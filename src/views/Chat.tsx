import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import Spinner from 'ink-spinner';
import { ChatMessage } from '../hooks/useChat.js';
import { useStdoutDimensions } from '../hooks/useStdoutDimensions.js';
import { usePlaceholder } from '../hooks/usePlaceholder.js';

interface ChatProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  onSendMessage: (text: string) => void;
  onInterrupt: () => void;
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
  onInterrupt,
}) => {
  const [inputValue, setInputValue] = useState('');
  const { columns, rows } = useStdoutDimensions();
  const [scrollOffset, setScrollOffset] = useState(0);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const placeholder = usePlaceholder();

  const typedCommand = inputValue.toLowerCase().trim();
  const filteredCommands = COMMANDS.filter(cmd => 
    cmd.name.startsWith(typedCommand)
  );
  const showCommands = inputValue.startsWith('/') && filteredCommands.length > 0;

  // Keep selectedCommandIndex in bounds when input changes
  useEffect(() => {
    setSelectedCommandIndex(0);
  }, [inputValue]);

  const handleSubmit = (value: string) => {
    let textToSubmit = value.trim();

    // Auto-complete commands on Enter submission
    if (textToSubmit.startsWith('/')) {
      const typed = textToSubmit.toLowerCase();
      const matches = COMMANDS.filter(cmd => cmd.name.startsWith(typed));
      
      if (matches.length === 1) {
        // If there is exactly one matching command (e.g. /p -> /projects), auto-complete and run it
        textToSubmit = matches[0].name;
      } else if (matches.length > 1) {
        // If there are multiple matches, submit the currently highlighted index
        if (selectedCommandIndex >= 0 && selectedCommandIndex < matches.length) {
          textToSubmit = matches[selectedCommandIndex].name;
        } else {
          textToSubmit = matches[0].name;
        }
      }
    }

    if (textToSubmit && !isLoading) {
      onSendMessage(textToSubmit);
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
  let nonChatHeight = 7 + 2 + 2 + 1 + 1 + 2 + menuHeight + 2 + 2; // header + margins + padding + prompt + help tips + tips + menu + safety + terminal safety margin
  if (isLoading) nonChatHeight += 1;
  if (error) nonChatHeight += 1;
  
  const chatHeightLimit = Math.max(3, (rows - 1) - nonChatHeight);
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

  // Intercept keyboard controls for dropdown autocomplete menu and chat history scrolling
  useInput((input, key) => {
    if (key.escape) {
      if (isLoading) {
        onInterrupt();
      } else {
        setInputValue('');
      }
    }
    if (key.tab) {
      if (inputValue.startsWith('/') && filteredCommands.length > 0) {
        const indexToUse = Math.min(selectedCommandIndex, filteredCommands.length - 1);
        setInputValue(filteredCommands[indexToUse].name);
      }
    }
    if (key.upArrow) {
      if (showCommands) {
        setSelectedCommandIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else {
        setScrollOffset(prev => Math.max(0, prev - 1));
      }
    }
    if (key.downArrow) {
      if (showCommands) {
        setSelectedCommandIndex(prev => (prev + 1) % filteredCommands.length);
      } else {
        setScrollOffset(prev => Math.min(maxScrollOffset, prev + 1));
      }
    }
    if (key.pageUp) {
      setScrollOffset(prev => Math.max(0, prev - 3));
    }
    if (key.pageDown) {
      setScrollOffset(prev => Math.min(maxScrollOffset, prev + 3));
    }
  });

  const visibleLines = allLines.slice(scrollOffset, scrollOffset + chatHeightLimit);
  const showScrollUp = scrollOffset > 0;
  const showScrollDown = scrollOffset < maxScrollOffset;

  return (
    <Box flexDirection="column" paddingX={2}>
      {/* Scrollable messages viewport */}
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
            <Text color="white" bold>Ask {'>'} </Text>
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
            {filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedCommandIndex;
              return (
                <Box flexDirection="row" key={cmd.name}>
                  <Text color="gray">│ </Text>
                  <Text color={isSelected ? 'white' : 'gray'} bold={isSelected}>
                    {isSelected ? '> ' : '  '}
                    {cmd.name.padEnd(12)} - {cmd.desc}
                  </Text>
                </Box>
              );
            })}
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
