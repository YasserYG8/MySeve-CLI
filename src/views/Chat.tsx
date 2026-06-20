import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import Spinner from 'ink-spinner';
import Message from '../components/Message.js';
import { ChatMessage } from '../hooks/useChat.js';
import { usePlaceholder } from '../hooks/usePlaceholder.js';
import { useStdoutDimensions } from '../hooks/useStdoutDimensions.js';

interface ChatProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  onSendMessage: (text: string) => void;
}

export const Chat: React.FC<ChatProps> = ({
  messages,
  isLoading,
  error,
  onSendMessage,
}) => {
  const [inputValue, setInputValue] = useState('');
  const placeholder = usePlaceholder();
  const { columns, rows } = useStdoutDimensions();

  const handleSubmit = (value: string) => {
    onSendMessage(value);
    setInputValue('');
  };

  // Calculate height budget for messages
  // Total terminal height - header (~9 lines) - ShortcutsBar (~3 lines) - Input section (~2 lines) - safety margins
  const chatHeightLimit = Math.max(3, rows - 16);

  // Filter and fit messages in the available height
  let estimatedLines = 0;
  const messagesToShow: ChatMessage[] = [];

  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (!msg) continue;
    // Add lines estimate (prefix text + message text length divided by columns)
    const prefixLength = msg.sender === 'user' ? 14 : 5;
    const msgLines = Math.ceil((msg.text.length + prefixLength) / columns) + 1;
    if (estimatedLines + msgLines > chatHeightLimit && messagesToShow.length > 0) {
      break;
    }
    estimatedLines += msgLines;
    messagesToShow.unshift(msg);
  }

  return (
    <Box flexDirection="column" flexGrow={1} paddingX={2}>
      {/* Messages area */}
      <Box flexDirection="column" flexGrow={1} minHeight={chatHeightLimit}>
        {messages.length === 0 ? (
          <Box flexDirection="column" justifyContent="center" alignItems="center" flexGrow={1} marginY={2}>
            <Text color="gray" dimColor>Welcome to Yasser's interactive TUI CV!</Text>
            <Text color="gray" dimColor>Ask the AI anything about Yasser's skills, experience, or projects.</Text>
          </Box>
        ) : (
          messagesToShow.map((msg, idx) => (
            <Message key={idx} sender={msg.sender} text={msg.text} />
          ))
        )}
      </Box>

      {/* Error display */}
      {error && (
        <Box marginBottom={1}>
          <Text color="red" bold>Error: </Text>
          <Text color="red">{error}</Text>
        </Box>
      )}

      {/* Input / Loading status */}
      <Box flexDirection="column" marginTop={1}>
        {isLoading && (
          <Box marginBottom={1}>
            <Text color="green">
              {/* @ts-ignore */}
              <Spinner type="dots" />
              {" Thinking..."}
            </Text>
          </Box>
        )}
        <Box flexDirection="row">
          <Text color="blue" bold>yasser@cv:~$ </Text>
          {/* @ts-ignore */}
          <TextInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
            placeholder={placeholder}
            showCursor
          />
        </Box>
      </Box>
    </Box>
  );
};
export default Chat;
