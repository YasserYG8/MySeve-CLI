// One way to call the model, used by the chat and by /hire.
// With OPENROUTER_API_KEY (local dev) it calls OpenRouter directly; without it
// (npm users) it calls the proxy, which streams plain text.
import OpenAI from 'openai';

export interface ModelMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const hasOwnApiKey = () => Boolean(process.env['OPENROUTER_API_KEY']);

// Streams the reply into `onText` and returns the whole text.
export async function streamModel(
  messages: ModelMessage[],
  signal: AbortSignal,
  onText: (chunk: string) => void = () => {},
): Promise<string> {
  let fullText = '';
  const append = (chunk: string) => {
    fullText += chunk;
    onText(chunk);
  };

  const apiKey = process.env['OPENROUTER_API_KEY'];
  if (apiKey) {
    const openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey,
      defaultHeaders: {
        'HTTP-Referer': 'https://github.com/YasserYG8/MySeve-CLI',
        'X-Title': 'Yasser Gombra Terminal CV',
      },
    });
    const stream = await openai.chat.completions.create(
      { model: 'openrouter/free', messages, stream: true },
      { signal },
    );
    for await (const chunk of stream) {
      if (signal.aborted) break;
      const text = chunk.choices[0]?.delta?.content || '';
      if (text) append(text);
    }
    return fullText;
  }

  const proxyUrl = process.env['CHAT_PROXY_URL'] || 'https://proxyclipart.vercel.app/api/chat';
  const response = await fetch(proxyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
    signal,
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(errText || `Server responded with status ${response.status}`);
  }
  const reader = response.body?.getReader();
  if (!reader) throw new Error('Response stream is not readable');

  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done || signal.aborted) break;
    const chunk = decoder.decode(value, { stream: true });
    if (chunk) append(chunk);
  }
  return fullText;
}
