import { useState, useCallback, useRef } from 'react';
import { SYSTEM_PROMPT } from '../constants/prompts.js';
import { hasOwnApiKey, streamModel } from '../utils/ai.js';
import { answerHire, HIRE_CANCELLED, HIRE_SENT, HireState, sendHire, startHire } from '../utils/hire.js';

export interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  isError?: boolean; // shown to the visitor, never sent to the model
  prompt?: string; // sent to the model in place of `text` (used by /about)
  local?: boolean; // part of the /hire flow: shown, but never sent to the model
  pending?: string; // spinner text while this message is empty
}

const ABOUT_PROMPT = 'Introduce yourself to me in a short, warm message, in the first person. Say who you are, your age, where you are from, what you study, what you are passionate about, what you want to do next, and what you are looking for right now. Use only facts you know.';

const UNAVAILABLE_MESSAGE = "I can't reach the AI right now. Please try again in a moment. /projects, /skills, /experience and /contact still work.";
const EMPTY_REPLY_MESSAGE = 'No answer came back. Please try again.';

export const useChat = (onViewChange: (view: string) => void) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hire, setHire] = useState<HireState | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const updateLastAssistant = useCallback((update: (message: ChatMessage) => ChatMessage) => {
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (!last || last.sender !== 'assistant') return prev;
      return [...prev.slice(0, -1), update(last)];
    });
  }, []);

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
    let modelPrompt: string | undefined;

    // A local exchange: the visitor's line and my reply, kept away from the model.
    const sayLocally = (reply: string, isError = false) => {
      setMessages((prev) => [
        ...prev,
        { sender: 'user', text: trimmed, local: true },
        { sender: 'assistant', text: reply, local: true, isError },
      ]);
    };

    // While /hire is running, answers go to the form. A slash command stops it.
    if (hire) {
      if (trimmed.startsWith('/')) {
        setHire(null);
        if (trimmed.toLowerCase() === '/cancel') {
          sayLocally(HIRE_CANCELLED);
          return;
        }
        // Any other command cancels the form and then runs below.
      } else {
        // Reading the answer can call the AI (for the name), so show a spinner.
        const controller = new AbortController();
        abortControllerRef.current = controller;
        setMessages((prev) => [
          ...prev,
          { sender: 'user', text: trimmed, local: true },
          { sender: 'assistant', text: '', local: true, pending: 'Thinking...' },
        ]);
        setIsLoading(true);
        let sending = false;
        try {
          const result = await answerHire(hire, trimmed, controller.signal);
          if (result.kind !== 'send') {
            setHire(result.kind === 'next' ? result.state : null);
            updateLastAssistant((message) => ({ ...message, text: result.reply }));
            return;
          }

          setHire(null);
          sending = true;
          updateLastAssistant((message) => ({ ...message, pending: 'Sending...' }));
          await sendHire(result.data, controller.signal);
          updateLastAssistant((message) => ({ ...message, text: HIRE_SENT(result.data.email) }));
        } catch (err: any) {
          let text = err?.message || 'I could not send your message.';
          if (controller.signal.aborted) {
            text = sending
              ? 'Stopped. Your message may not have been sent. Type /hire to try again.'
              : 'Stopped. Please type your answer again.';
          }
          updateLastAssistant((message) => ({ ...message, text, isError: true }));
        } finally {
          if (abortControllerRef.current === controller) abortControllerRef.current = null;
          setIsLoading(false);
        }
        return;
      }
    }

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

      if (command === '/hire') {
        const { state, reply } = startHire();
        setHire(state);
        sayLocally(reply);
        return;
      }

      if (command === '/about') {
        // Falls through to the AI request below, with a hidden prompt.
        modelPrompt = ABOUT_PROMPT;
      } else {
        // Unknown command
        setMessages(prev => [
          ...prev,
          { sender: 'user', text: trimmed },
          { sender: 'assistant', text: `Unknown command: ${trimmed}. Type /help for all available commands.`, isError: true }
        ]);
        return;
      }
    }

    // Cancel any previous active stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Add user message
    const userMsg: ChatMessage = { sender: 'user', text: trimmed, prompt: modelPrompt };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Prepare message history with system prompt, filtering out empty entries
    const apiMessages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...[...messages, userMsg]
        .filter(m => !m.isError && !m.local && m.text && m.text.trim() !== '')
        .map(m => ({
          role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
          content: m.prompt ?? m.text,
        }))
    ];

    // Add empty assistant response to stream into
    setMessages((prev) => [...prev, { sender: 'assistant', text: '' }]);

    try {
      let accumulatedText = '';
      await streamModel(apiMessages, controller.signal, (chunk) => {
        accumulatedText += chunk;
        updateLastAssistant((message) => ({ ...message, text: accumulatedText }));
      });

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
      const errorText = hasOwnApiKey() ? `Error: ${err?.message || 'Failed to fetch response.'}` : UNAVAILABLE_MESSAGE;
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
  }, [messages, hire, onViewChange, updateLastAssistant]);

  return {
    messages,
    isLoading,
    isHiring: hire !== null,
    sendMessage,
    interruptChat,
    clearChat: () => setMessages([]),
  };
};

export default useChat;
