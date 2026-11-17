// The /hire flow: asks a few questions, then sends them to FormSubmit
// (formsubmit.co), which emails Yasser. The AI reads each answer, so visitors
// can reply in sentences ("hi, I'm Sarah, sarah@acme.com"). Simple rules are
// the backup when the AI is slow, down, or replies in the wrong format.
import { profileData } from '../data/profile.js';
import { streamModel } from './ai.js';

export interface HireData {
  name: string;
  email: string;
  company: string;
  message: string;
}

export type HireField = keyof HireData;

export interface HireState {
  step: HireField | 'confirm';
  data: Partial<HireData>;
}

const FIELDS: HireField[] = ['name', 'email', 'company', 'message'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MY_EMAIL = profileData.contact.email;
const MAX_LENGTH: Record<HireField, number> = { name: 60, email: 200, company: 200, message: 2000 };
const MAX_NAME_WORDS = 5;

const QUESTIONS: Record<HireField, (data: Partial<HireData>) => string> = {
  name: () => "What's your name?",
  email: (data) => `Nice to meet you, ${data.name}! What's your email, so I can reply?`,
  company: () => 'Which company, and which job? For example: Acme, DevOps Engineer, remote',
  message: () => 'And your message to me?',
};

const ASK_AGAIN: Record<HireField, string> = {
  name: "Sorry, I didn't get your name. What's your name?",
  email: "I couldn't find an email in that. Please type it, for example: name@company.com",
  company: "Sorry, I didn't get that. Which company is it, and which job?",
  message: "Sorry, I didn't get that. What would you like to tell me?",
};

// ---------- Backup rules (used when the AI fails) ----------

const GREETING = /^(?:(?:hi|hello|hey|salam|salut|bonjour|good (?:morning|afternoon|evening))(?:\s+(?:there|everyone|all))?\b[\s,!.]*)+/i;
const NAME_INTRO = /^(?:my name(?:'s| is)?|name\s*[:=-]?|i'?m|i am|it'?s|it is|this is|(?:you can |they )?call me|je m'appelle|je suis)\s+/i;
const NAME_END = /\s*(?:[,.!?;:(]|\s(?:from|at|and|with|here|working|i'?m|i am|my)\b).*$/i;

// "hi, my name is mohamed from Acme" -> "Mohamed"
export function extractName(answer: string): string {
  let name = answer.trim().replace(GREETING, '');
  name = name.replace(NAME_INTRO, '').replace(NAME_END, '').trim();
  const words = name.split(/\s+/).filter(Boolean).slice(0, MAX_NAME_WORDS);
  if (words.length === 0) return '';
  // Capitalize only words typed all in lower case, so "McDonald" stays as typed.
  return words.map((word) => (word === word.toLowerCase() ? word[0].toUpperCase() + word.slice(1) : word)).join(' ');
}

// "my email is sarah@acme.com." -> "sarah@acme.com"
export function extractEmail(answer: string): string {
  const found = answer.match(/[^\s@<>()"',;:]+@[^\s@<>()"',;:]+\.[^\s@<>()"',;:]+/);
  return found ? found[0].replace(/[.!?]+$/, '') : '';
}

const backupValue = (field: HireField, answer: string): string => {
  if (field === 'name') return extractName(answer);
  if (field === 'email') return extractEmail(answer);
  if (field === 'message') return answer.trim().replace(/^(?:my )?message(?: is)?\s*[:=-]?\s*/i, '');
  return answer.trim();
};

// Answers that need no AI: a plain name, or just an email.
const quickValue = (field: HireField, answer: string): string => {
  const plain = answer.trim();
  if (field === 'email') return EMAIL_PATTERN.test(plain) ? plain : '';
  if (field === 'name') {
    const name = extractName(plain);
    const isPlainName = plain.split(/\s+/).length <= 3 && /^[\p{L}'’-]+(?: [\p{L}'’-]+)*$/u.test(plain);
    return isPlainName && name.toLowerCase() === plain.toLowerCase() ? name : '';
  }
  return '';
};

// Checks a value from the AI or the rules. Returns '' when it can't be used.
const checkValue = (field: HireField, value: unknown): string => {
  if (typeof value !== 'string') return '';
  const text = value.trim();
  if (!text || /^(?:null|none|n\/a)$/i.test(text) || text.length > MAX_LENGTH[field]) return '';
  if (field === 'email') return EMAIL_PATTERN.test(text) ? text : '';
  if (field === 'name' && (text.split(/\s+/).length > MAX_NAME_WORDS || /[@:/\\<>{}]/.test(text))) return '';
  return text;
};

// ---------- AI ----------

const AI_TIMEOUT_MS = 10000;
const AI_TIMEOUT_LONG_MS = 20000; // the message can be long to copy
const MAX_AI_INPUT = 2500;

// Asks the model for one JSON object. Returns null on any failure, so the rules run.
async function askModelJson(
  system: string,
  answer: string,
  signal: AbortSignal,
  timeoutMs: number,
): Promise<Record<string, unknown> | null> {
  const controller = new AbortController();
  const stop = () => controller.abort();
  signal.addEventListener('abort', stop);
  const timer = setTimeout(stop, timeoutMs);
  try {
    const reply = await streamModel(
      [
        { role: 'system', content: system },
        { role: 'user', content: answer.slice(0, MAX_AI_INPUT) },
      ],
      controller.signal,
    );
    if (controller.signal.aborted) return null;
    const json = reply.match(/\{[\s\S]*\}/)?.[0];
    if (!json) return null;
    const parsed = JSON.parse(json);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    if (signal.aborted) throw new Error('aborted');
    return null;
  } finally {
    clearTimeout(timer);
    signal.removeEventListener('abort', stop);
  }
}

const extractPrompt = (question: string, field: HireField) => `You help fill a short job-offer form in Yasser's terminal CV.
The form asked the visitor: "${question}"
Read the visitor's answer and pull out any of these fields that it contains:
- "name": the visitor's own name (a person, not a company), with normal capital letters.
- "email": the visitor's email address.
- "company": the company and the job they offer, short, like "Acme — DevOps Engineer (remote)".
- "message": what they want to tell Yasser, copied word for word, without filler such as "my message is".${
  field === 'message' ? '' : '\nThe form did not ask for the message yet, so "message" must be null.'
}
Reply with ONLY one JSON object with the keys "name", "email", "company" and "message".
Use null for anything the answer does not contain. Never invent values. No other text.`;

const CONFIRM_PROMPT = `A visitor saw a preview of their job-offer message to Yasser and was asked: "Send it to me? (y/n)".
Decide what their answer means. Reply with ONLY one JSON object:
{"action": "send" | "cancel" | "edit" | "unclear", "field": "name" | "email" | "company" | "message" | null, "value": string | null}
- "send": they agree to send it now.
- "cancel": they do not want to send it.
- "edit": they want to change one part. "field" is that part ("company" also means the job). "value" is the new value if they gave it, otherwise null.
- "unclear": anything else.
No other text.`;

// ---------- The flow ----------

export const HIRE_INTRO =
  "Great, let's talk! 🙌 I'll ask you 4 quick questions, and your answers go straight to my inbox. Answer however you like. Type /cancel to stop.";

export const startHire = (): { state: HireState; reply: string } => ({
  state: { step: 'name', data: {} },
  reply: `${HIRE_INTRO}\n\n${QUESTIONS.name({})}`,
});

const preview = (data: Partial<HireData>) =>
  [
    'Here is your message:',
    '',
    `From: ${data.name} (${data.email})`,
    `Job: ${data.company}`,
    `Message: ${data.message}`,
    '',
    'Send it to me? (y/n, or tell me what to change)',
  ].join('\n');

export type HireResult =
  | { kind: 'next'; state: HireState; reply: string }
  | { kind: 'send'; data: HireData }
  | { kind: 'cancel'; reply: string };

// Asks the next empty field, or shows the preview when all are filled.
const advance = (data: Partial<HireData>, prefix = ''): HireResult => {
  const missing = FIELDS.find((field) => !data[field]);
  if (missing) return { kind: 'next', state: { step: missing, data }, reply: prefix + QUESTIONS[missing](data) };
  return { kind: 'next', state: { step: 'confirm', data }, reply: prefix + preview(data) };
};

const YES = /^(?:y|yes|yeah|yep|yup|ok|okay|sure|send|send it|go|oui)$/i;
const NO = /^(?:n|no|nope|nah|non|cancel|stop)$/i;
const CANCELLED: HireResult = { kind: 'cancel', reply: 'OK, I did not send it. Type /hire to start again.' };

async function answerConfirm(state: HireState, answer: string, signal: AbortSignal): Promise<HireResult> {
  const choice = answer.trim().replace(/[.!]+$/, '');
  if (YES.test(choice)) return { kind: 'send', data: state.data as HireData };
  if (NO.test(choice)) return CANCELLED;

  const unclear: HireResult = {
    kind: 'next',
    state,
    reply: 'Please type y to send it, or n to cancel. You can also tell me what to change, for example: "change my email".',
  };
  const ai = await askModelJson(CONFIRM_PROMPT, answer, signal, AI_TIMEOUT_MS);
  if (!ai) return unclear;
  if (ai.action === 'send') return { kind: 'send', data: state.data as HireData };
  if (ai.action === 'cancel') return CANCELLED;
  if (ai.action !== 'edit' || !FIELDS.includes(ai.field as HireField)) return unclear;

  const field = ai.field as HireField;
  const value = checkValue(field, ai.value);
  if (value) return advance({ ...state.data, [field]: value }, 'Updated! ');
  if (ai.value) return { kind: 'next', state, reply: ASK_AGAIN[field] };
  // They want to change it but gave no new value: ask that question again.
  const data = { ...state.data };
  delete data[field];
  return advance(data);
}

// Takes the visitor's answer to the current question.
export async function answerHire(state: HireState, answer: string, signal: AbortSignal): Promise<HireResult> {
  if (state.step === 'confirm') return answerConfirm(state, answer, signal);

  const field = state.step;
  if (answer.trim().length > MAX_LENGTH.message) {
    return { kind: 'next', state, reply: `That's a bit long. Please keep it under ${MAX_LENGTH.message} characters.` };
  }

  const found: Partial<HireData> = {};
  const quick = quickValue(field, answer);
  if (quick) {
    found[field] = quick;
  } else {
    const timeout = field === 'message' ? AI_TIMEOUT_LONG_MS : AI_TIMEOUT_MS;
    const ai = await askModelJson(extractPrompt(QUESTIONS[field](state.data), field), answer, signal, timeout);
    if (ai) {
      // The asked field, plus a name or email given early ("I'm Sarah, sarah@acme.com").
      for (const key of [field, 'name', 'email'] as HireField[]) {
        const value = checkValue(key, ai[key]);
        if (value && !found[key]) found[key] = value;
      }
    } else {
      const value = checkValue(field, backupValue(field, answer));
      if (value) found[field] = value;
    }
  }

  if (!found[field]) return { kind: 'next', state, reply: ASK_AGAIN[field] };

  const data = { ...state.data, [field]: found[field] };
  for (const key of FIELDS) {
    if (!data[key] && found[key]) data[key] = found[key];
  }
  return advance(data);
}

export const HIRE_SENT = (email: string) => `Sent! 🚀 Thank you. I'll reply to ${email} soon.`;
export const HIRE_CANCELLED = 'OK, I cancelled your message.';

// FormSubmit refuses requests with no Referer, so we send the website as one.
// After the form is activated, FormSubmit gives a random alias that can replace
// the email in this URL.
const FORM_URL = `https://formsubmit.co/ajax/${MY_EMAIL}`;

export async function sendHire(data: HireData, signal: AbortSignal): Promise<void> {
  const url = process.env['HIRE_FORM_URL'] || FORM_URL;
  const fallback = `I couldn't send your message right now. Please email me at ${MY_EMAIL}.`;

  const request: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Referer: profileData.contact.website + '/',
    },
    body: JSON.stringify({
      _subject: `[Terminal CV] ${data.name} — ${data.company}`,
      _replyto: data.email,
      _template: 'table',
      name: data.name,
      email: data.email,
      company_and_job: data.company,
      message: data.message,
    }),
    signal,
  };

  // A network error ("fetch failed") gets one retry. The visitor never sees the
  // raw error, only the fallback with a short code for debugging.
  let response: Response | undefined;
  for (let attempt = 1; !response; attempt++) {
    try {
      response = await fetch(url, request);
    } catch (err: any) {
      if (signal.aborted) throw err;
      if (attempt >= 2) {
        const code = err?.cause?.code || err?.cause?.message || err?.message || 'unknown';
        throw new Error(`${fallback} (network error: ${code})`);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  const result = (await response.json().catch(() => null)) as { success?: string | boolean } | null;
  if (!response.ok || String(result?.success) !== 'true') throw new Error(fallback);
}
