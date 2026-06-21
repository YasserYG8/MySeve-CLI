import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import Spinner from 'ink-spinner';
import { ChatMessage } from '../hooks/useChat.js';
import { useStdoutDimensions } from '../hooks/useStdoutDimensions.js';

interface ChatProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  onSendMessage: (text: string) => void;
}

const COMMANDS = [
  { name: '/projects', desc: 'Show Projects' },
  { name: '/skills', desc: 'Show Skills' },
  { name: '/experience', desc: 'Show Experience' },
  { name: '/contact', desc: 'Show Contact Info' },
  { name: '/help', desc: 'Show Help Screen' },
  { name: '/clear', desc: 'Clear Chat History' }
];

// Helper to wrap lines to terminal width
function wrapLine(text: string, limit: number): string[] {
  const lines: string[] = [];
  const paragraphs = text.split('\n');
  
  for (const paragraph of paragraphs) {
    if (paragraph.length === 0) {
      lines.push('');
      continue;
    }
    const words = paragraph.split(' ');
    let currentLine = '';
    
    for (const word of words) {
      if (currentLine.length + word.length + 1 > limit) {
        if (currentLine.length > 0) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          // Word itself is longer than limit, force push it
          lines.push(word);
          currentLine = '';
        }
      } else {
        currentLine = currentLine.length > 0 ? currentLine + ' ' + word : word;
      }
    }
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
  }
  return lines;
}

export const Chat: React.FC<ChatProps> = ({
  messages,
  isLoading,
  error,
  onSendMessage,
}) => {
  const [inputValue, setInputValue] = useState('');
  const { columns, rows } = useStdoutDimensions();
  const [scrollOffset, setScrollOffset] = useState(0);

  const typedCommand = inputValue.toLowerCase().trim();
  const filteredCommands = COMMANDS.filter(cmd => 
    cmd.name.startsWith(typedCommand)
  );
  const showCommands = inputValue.startsWith('/') && filteredCommands.length > 0;

  const handleSubmit = (value: string) => {
    if (value.trim() && !isLoading) {
      onSendMessage(value);
      setInputValue('');
    }
  };

  // Format all chat messages into console lines
  const availableWidth = Math.min(80, columns - 4) - 4;
  const allLines: { text: string; color: string; bold?: boolean }[] = [];

  messages.forEach(msg => {
    const isUser = msg.sender === 'user';
    const prefix = isUser ? 'yasser@cv:~$ ' : 'AI > ';
    const wrapped = wrapLine(msg.text, availableWidth - prefix.length);

    if (wrapped.length > 0) {
      allLines.push({
        text: `${prefix}${wrapped[0]}`,
        color: isUser ? 'white' : 'gray',
        bold: false
      });
      for (let i = 1; i < wrapped.length; i++) {
        allLines.push({
          text: ' '.repeat(prefix.length) + wrapped[i],
          color: isUser ? 'white' : 'gray'
        });
      }
      // Add newline after each message block for spacing
      allLines.push({ text: '', color: 'gray' });
    }
  });

  // Calculate height budget
  let menuHeight = showCommands ? filteredCommands.length + 2 : 0;
  let nonChatHeight = 8 + 2 + 2 + 1 + 1 + 2 + menuHeight + 2; // header + margins + padding + prompt + help tips + tips + menu + safety
  if (isLoading) nonChatHeight += 1;
  if (error) nonChatHeight += 1;
  
  const chatHeightLimit = Math.max(3, rows - nonChatHeight);
  const maxScrollOffset = Math.max(0, allLines.length - chatHeightLimit);

  // Sync scroll to bottom when messages or loading state changes
  const prevMsgCountRef = useRef(messages.length);
  const prevLinesCountRef = useRef(allLines.length);

  useEffect(() => {
    if (messages.length !== prevMsgCountRef.current || allLines.length !== prevLinesCountRef.current) {
      prevMsgCountRef.current = messages.length;
      prevLinesCountRef.current = allLines.length;
      setScrollOffset(Math.max(0, allLines.length - chatHeightLimit));
    }
  }, [messages.length, allLines.length, chatHeightLimit]);

  // Intercept Tab for command completion and arrow keys/PageUp/PageDown for scrolling
  useInput((input, key) => {
    if (key.tab) {
      if (inputValue.startsWith('/') && filteredCommands.length > 0) {
        setInputValue(filteredCommands[0].name);
      }
    }
    if (key.pageUp || key.upArrow) {
      setScrollOffset(prev => Math.max(0, prev - 1));
    }
    if (key.pageDown || key.downArrow) {
      setScrollOffset(prev => Math.min(maxScrollOffset, prev + 1));
    }
  });

  const visibleLines = allLines.slice(scrollOffset, scrollOffset + chatHeightLimit);
  const showScrollUp = scrollOffset > 0;
  const showScrollDown = scrollOffset < maxScrollOffset;

  return (
    <Box flexDirection="column" paddingX={2}>
      {/* Scrollable messages viewport (collapses to 0 height when empty) */}
      <Box flexDirection="column">
        {showScrollUp && (
          <Text color="gray" dimColor>  ▲ scroll up (PageUp / Up Arrow)</Text>
        )}

        {messages.length > 0 && (
          visibleLines.map((line, idx) => (
            <Text key={idx} color={line.color as any} bold={line.bold}>
              {line.text}
            </Text>
          ))
        )}

        {showScrollDown && (
          <Text color="gray" dimColor>  ▼ scroll down (PageDown / Down Arrow)</Text>
        )}
      </Box>

      {/* Error display */}
      {error && (
        <Box marginBottom={1}>
          <Text color="red" bold>Error: </Text>
          <Text color="red">{error}</Text>
        </Box>
      )}

      {/* OpenCode inspired prompt box with a left vertical accent line */}
      <Box flexDirection="column" marginTop={1}>
        {isLoading && (
          <Box flexDirection="row" marginBottom={1}>
            <Text color="gray">│ </Text>
            <Text color="green">
              {/* @ts-ignore */}
              <Spinner type="dots" />
              {" Thinking..."}
            </Text>
          </Box>
        )}

        {/* Input field row */}
        <Box flexDirection="row">
          <Box flexDirection="row" flexGrow={1}>
            <Text color="gray">│ </Text>
            <Text color="white" bold>Ask anything... </Text>
            {/* @ts-ignore */}
            <TextInput
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSubmit}
              placeholder=""
              showCursor
            />
          </Box>
        </Box>

        {/* Shortcuts and build details help under prompt */}
        <Box flexDirection="row" marginTop={1}>
          <Text color="gray">│ </Text>
          <Box flexDirection="row" justifyContent="space-between" flexGrow={1}>
            <Text color="gray">Build · YasserYG8 · max</Text>
            <Text color="gray">tab autocomplete · ctrl+c exit</Text>
          </Box>
        </Box>

        {showCommands && (
          <Box flexDirection="column" marginTop={1}>
            <Box flexDirection="row">
              <Text color="gray">│ </Text>
              <Text color="gray" bold>[ Available Commands ]</Text>
            </Box>
            {filteredCommands.map(cmd => (
              <Box flexDirection="row" key={cmd.name}>
                <Text color="gray">│ </Text>
                <Text color="white">  {cmd.name.padEnd(12)} - {cmd.desc}</Text>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Tip section at the bottom */}
      <Box marginTop={1}>
        <Text color="gray">
          <Text color="white" bold>● Tip </Text>
          Use <Text color="white" bold>/projects</Text> or <Text color="white" bold>/skills</Text> to quickly showcase specific details about Yasser.
        </Text>
      </Box>
    </Box>
  );
};

export default Chat;
