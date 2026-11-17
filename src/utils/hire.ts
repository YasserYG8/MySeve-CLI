// The /hire flow: asks a few questions, then sends them to FormSubmit
// (formsubmit.co), which emails Yasser. The answers never go to the AI.
import { profileData } from '../data/profile.js';

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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MY_EMAIL = profileData.contact.email;

interface Step {
  field: HireField;
  max: number;
  ask: (data: Partial<HireData>) => string;
  invalid?: (value: string) => string | null;
}

const STEPS: Step[] = [
  {
    field: 'name',
    max: 100,
    ask: () => "What's your name?",
  },
  {
    field: 'email',
    max: 200,
    ask: (data) => `Nice to meet you, ${data.name}! What's your email, so I can reply?`,
    invalid: (value) => (EMAIL_PATTERN.test(value) ? null : "That doesn't look like an email. Please try again, for example: name@company.com"),
  },
  {
    field: 'company',
    max: 200,
    ask: () => 'Which company, and which job? For example: Acme, DevOps Engineer, remote',
  },
  {
    field: 'message',
    max: 2000,
    ask: () => 'And your message to me?',
  },
];

export const HIRE_INTRO =
  "Great, let's talk! 🙌 I'll ask you 4 quick questions. Your answers go straight to my inbox, not to the AI. Type /cancel to stop.";

export const startHire = (): { state: HireState; reply: string } => ({
  state: { step: 'name', data: {} },
  reply: `${HIRE_INTRO}\n\n${STEPS[0].ask({})}`,
});

const preview = (data: Partial<HireData>) =>
  [
    'Here is your message:',
    '',
    `From: ${data.name} (${data.email})`,
    `Job: ${data.company}`,
    `Message: ${data.message}`,
    '',
    'Send it to me? (y/n)',
  ].join('\n');

export type HireResult =
  | { kind: 'next'; state: HireState; reply: string }
  | { kind: 'send'; data: HireData }
  | { kind: 'cancel'; reply: string };

// Takes the visitor's answer to the current question.
export function answerHire(state: HireState, answer: string): HireResult {
  if (state.step === 'confirm') {
    const choice = answer.trim().toLowerCase();
    if (['y', 'yes', 'send'].includes(choice)) return { kind: 'send', data: state.data as HireData };
    if (['n', 'no'].includes(choice)) return { kind: 'cancel', reply: 'OK, I did not send it. Type /hire to start again.' };
    return { kind: 'next', state, reply: 'Please type y to send it, or n to cancel.' };
  }

  const index = STEPS.findIndex((step) => step.field === state.step);
  const step = STEPS[index];
  const value = answer.trim();

  if (value.length > step.max) {
    return { kind: 'next', state, reply: `That's a bit long. Please keep it under ${step.max} characters.` };
  }
  const problem = step.invalid?.(value);
  if (problem) return { kind: 'next', state, reply: problem };

  const data = { ...state.data, [step.field]: value };
  const nextStep = STEPS[index + 1];
  if (nextStep) {
    return { kind: 'next', state: { step: nextStep.field, data }, reply: nextStep.ask(data) };
  }
  return { kind: 'next', state: { step: 'confirm', data }, reply: preview(data) };
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

  const response = await fetch(url, {
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
  });

  const result = (await response.json().catch(() => null)) as { success?: string | boolean } | null;
  if (!response.ok || String(result?.success) !== 'true') throw new Error(fallback);
}
