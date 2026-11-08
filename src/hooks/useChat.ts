import { useState, useCallback, useRef } from 'react';
import OpenAI from 'openai';
import { SYSTEM_PROMPT } from '../constants/prompts.js';

export interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  isError?: boolean; // shown to the visitor, never sent to the model
}

const UNAVAILABLE_MESSAGE = "I can't reach the AI right now. Please try again in a moment. /projects, /skills, /experience and /contact still work.";
const EMPTY_REPLY_MESSAGE = 'No answer came back. Please try again.';

export const useChat = (onViewChange: (view: string) => void) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const interruptChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Handle slash commands
    if (trimmed.startsWith('/')) {
      const command = trimmed.toLowerCase();
      if (command === '/clear') {
        setMessages([]);
        return;
      }
      if (command === '/projects') {
        onViewChange('projects');
        return;
      }
      if (command === '/skills') {
        onViewChange('skills');
        return;
      }
      if (command === '/experience') {
        onViewChange('experience');
        return;
      }
      if (command === '/contact') {
        onViewChange('contact');
        return;
      }
      if (command === '/help') {
        onViewChange('help');
        return;
      }
      
      // Unknown command
      setMessages(prev => [
        ...prev,
        { sender: 'user', text: trimmed },
        { sender: 'assistant', text: `Unknown command: ${trimmed}. Type /help for all available commands.`, isError: true }
      ]);
      return;
    }

    const apiKey = process.env['OPENROUTER_API_KEY'];

    // Cancel any previous active stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Add user message
    const userMsg: ChatMessage = { sender: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Prepare message history with system prompt, filtering out empty entries
    const apiMessages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...[...messages, userMsg]
        .filter(m => !m.isError && m.text && m.text.trim() !== '')
        .map(m => ({
          role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
          content: m.text,
        }))
    ];

    // Add empty assistant response to stream into
    setMessages((prev) => [...prev, { sender: 'assistant', text: '' }]);

    const updateLastAssistant = (update: (message: ChatMessage) => ChatMessage) => {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (!last || last.sender !== 'assistant') return prev;
        return [...prev.slice(0, -1), update(last)];
      });
    };

    try {
      let accumulatedText = '';
      const appendText = (text: string) => {
        accumulatedText += text;
        updateLastAssistant((message) => ({ ...message, text: accumulatedText }));
      };

      if (apiKey) {
        // Direct OpenRouter Call (local dev with .env)
        const openai = new OpenAI({
          baseURL: 'https://openrouter.ai/api/v1',
          apiKey: apiKey,
          defaultHeaders: {
            'HTTP-Referer': 'https://github.com/YasserYG8/MySeve-CLI',
            'X-Title': 'Yasser Gombra Terminal CV',
          }
        });

        const stream = await openai.chat.completions.create({
          model: 'openrouter/free',
          messages: apiMessages,
          stream: true,
        }, {
          signal: controller.signal,
        });

        for await (const chunk of stream) {
          if (controller.signal.aborted) break;
          const text = chunk.choices[0]?.delta?.content || '';
          if (text) appendText(text);
        }
      } else {
        // Proxy call (production/npm fallback)
        const proxyUrl = process.env['CHAT_PROXY_URL'] || 'https://proxyclipart.vercel.app/api/chat';
        const response = await fetch(proxyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages: apiMessages }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(errText || `Server responded with status ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('Response stream is not readable');
        }

        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done || controller.signal.aborted) break;

          const chunk = decoder.decode(value, { stream: true });
          if (chunk) appendText(chunk);
        }
      }

      if (!accumulatedText && !controller.signal.aborted) {
        updateLastAssistant((message) => ({ ...message, text: EMPTY_REPLY_MESSAGE, isError: true }));
      }
    } catch (err: any) {
      // Handle abortion error gracefully
      if (err.name === 'AbortError' || err.message?.includes('aborted') || err.message?.includes('cancel')) {
        updateLastAssistant((message) => ({
          ...message,
          text: message.text ? `${message.text} ... [Interrupted]` : '... [Interrupted]',
        }));
        return;
      }

      // Visitors get a clear next step. A developer with a key gets the real error.
      const errorText = apiKey ? `Error: ${err?.message || 'Failed to fetch response.'}` : UNAVAILABLE_MESSAGE;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.sender === 'assistant' && last.text === '') {
          return [...prev.slice(0, -1), { ...last, text: errorText, isError: true }];
        }
        return [...prev, { sender: 'assistant', text: errorText, isError: true }];
      });
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      setIsLoading(false);
    }
  }, [messages, onViewChange]);

  return {
    messages,
    isLoading,
    sendMessage,
    interruptChat,
    clearChat: () => setMessages([]),
  };
};

export default useChat;
