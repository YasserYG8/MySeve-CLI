import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import Spinner from 'ink-spinner';
import { ChatMessage } from '../hooks/useChat.js';
import { usePlaceholder } from '../hooks/usePlaceholder.js';
import { COMMANDS } from '../constants/commands.js';
import { theme } from '../constants/theme.js';
import ScrollBar, { SCROLL_GUTTER } from '../components/ScrollBar.js';
import { balanceBold, displayWidth, formatReply, wrapText } from '../utils/text.js';

interface ChatProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isHiring: boolean; // the /hire form is waiting for an answer
  onSendMessage: (text: string) => void;
  onInterrupt: () => void;
  width: number;
  height: number;
}

type LineKind = 'user' | 'assistant' | 'error' | 'thinking' | 'blank';

interface ChatLine {
  kind: LineKind;
  isFirst: boolean;
  text: string;
}

const LABEL_WIDTH = 8; // "YASSER" plus two spaces
const PROMPT_PREFIX_WIDTH = 8; // "┃ Ask > "
const GAP_ABOVE_PROMPT = 1;
const HINT_ROWS = 2; // one gap, one row of hints

const INLINE_MARKDOWN = /(\*\*.+?\*\*|\*[^\s*](?:[^*]*[^\s*])?\*|`[^`]+`)/g;

function toChatLines(messages: ChatMessage[], isLoading: boolean, width: number): ChatLine[] {
  const textWidth = Math.max(1, width - LABEL_WIDTH);
  const lines: ChatLine[] = [];

  messages.forEach((message, index) => {
    const isWaiting = message.sender === 'assistant' && !message.text;
    if (isWaiting && !(isLoading && index === messages.length - 1)) return;
    if (lines.length > 0) lines.push({ kind: 'blank', isFirst: false, text: '' });

    if (isWaiting) {
      lines.push({ kind: 'thinking', isFirst: true, text: message.pending ?? 'Thinking...' });
      return;
    }

    const kind: LineKind = message.sender === 'user' ? 'user' : message.isError ? 'error' : 'assistant';
    const wrapped = kind === 'assistant'
      ? balanceBold(wrapText(formatReply(message.text), textWidth))
      : wrapText(message.text, textWidth);
    wrapped.forEach((text, lineIndex) => lines.push({ kind, isFirst: lineIndex === 0, text }));
  });

  return lines;
}

const renderInline = (text: string): React.ReactNode[] =>
  text.split(INLINE_MARKDOWN).map((part, index) => {
    if (index % 2 === 0) return part;
    if (part.startsWith('**')) return <Text key={index} bold>{part.slice(2, -2)}</Text>;
    if (part.startsWith('`')) return <Text key={index} color={theme.accent}>{part.slice(1, -1)}</Text>;
    return <Text key={index} italic>{part.slice(1, -1)}</Text>;
  });

const LABELS: Partial<Record<LineKind, { text: string; color: string }>> = {
  user: { text: 'you', color: theme.accent },
  assistant: { text: 'YASSER', color: theme.good },
  thinking: { text: 'YASSER', color: theme.good },
  error: { text: 'YASSER', color: theme.bad },
};

const renderLine = (line: ChatLine, key: number) => {
  const label = LABELS[line.kind];
  const labelText = (line.isFirst && label ? label.text : '').padEnd(LABEL_WIDTH);

  return (
    <Box key={key} height={1} flexShrink={0}>
      <Text wrap="truncate-end">
        <Text bold color={label?.color}>{labelText}</Text>
        {line.kind === 'assistant' && renderInline(line.text)}
        {(line.kind === 'user' || line.kind === 'blank') && line.text}
        {line.kind === 'error' && line.text}
        {line.kind === 'thinking' && (
          <Text color={theme.muted}>
            {/* @ts-ignore */}
            <Spinner type="dots" />
            {` ${line.text}`}
          </Text>
        )}
      </Text>
    </Box>
  );
};

export const Chat: React.FC<ChatProps> = ({
  messages,
  isLoading,
  isHiring,
  onSendMessage,
  onInterrupt,
  width,
  height,
}) => {
  const [inputValue, setInputValue] = useState('');
  // The text input only moves its cursor to the end when it mounts, so a new
  // key is needed each time the code (not the keyboard) changes the text.
  const [inputKey, setInputKey] = useState(0);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const suggestion = usePlaceholder();
  const placeholder = isHiring ? 'Type your answer... (/cancel to stop)' : suggestion.hint;

  const setInputFromCode = (value: string) => {
    setInputValue(value);
    setInputKey((key) => key + 1);
  };

  const typedCommand = inputValue.toLowerCase().trim();
  const filteredCommands = COMMANDS.filter((command) => command.name.startsWith(typedCommand));
  const showCommands = inputValue.startsWith('/') && filteredCommands.length > 0;

  const isLanding = messages.length === 0;
  const inputWidth = Math.max(1, width - PROMPT_PREFIX_WIDTH);
  const promptRows = Math.max(1, Math.ceil((displayWidth(inputValue || placeholder) + 1) / inputWidth));
  const menuRows = showCommands ? filteredCommands.length + 1 : 0;
  const chromeRows = GAP_ABOVE_PROMPT + promptRows + menuRows + HINT_ROWS;
  const viewportRows = Math.max(1, height - chromeRows);

  const allLines = toChatLines(messages, isLoading, width - SCROLL_GUTTER);
  const maxScrollOffset = Math.max(0, allLines.length - viewportRows);
  const [scrollOffset, setScrollOffset] = useState(maxScrollOffset);
  const visibleOffset = Math.min(scrollOffset, maxScrollOffset);
  const visibleLines = allLines.slice(visibleOffset, visibleOffset + viewportRows);

  useEffect(() => {
    setSelectedCommandIndex(0);
  }, [inputValue]);

  // Follow new text, and stay at the end when the space for messages changes.
  const previousRef = useRef({ lines: allLines.length, rows: viewportRows });
  useEffect(() => {
    const previous = previousRef.current;
    if (previous.lines !== allLines.length || previous.rows !== viewportRows) {
      previousRef.current = { lines: allLines.length, rows: viewportRows };
      setScrollOffset(maxScrollOffset);
    }
  }, [allLines.length, viewportRows, maxScrollOffset]);

  const handleSubmit = (value: string) => {
    let textToSubmit = value.trim();

    // A partial command runs the highlighted match, so /p then Enter opens /projects.
    if (textToSubmit.startsWith('/')) {
      const typed = textToSubmit.toLowerCase();
      const matches = COMMANDS.filter((command) => command.name.startsWith(typed));
      if (matches.length > 0) {
        textToSubmit = (matches[selectedCommandIndex] ?? matches[0]).name;
      }
    }

    if (textToSubmit && !isLoading) {
      onSendMessage(textToSubmit);
      setInputValue('');
    }
  };

  useInput((_input, key) => {
    if (key.escape) {
      if (isLoading) {
        onInterrupt();
      } else if (inputValue) {
        setInputFromCode('');
      }
    }
    if (key.tab) {
      if (inputValue === '') {
        if (!isHiring) setInputFromCode(suggestion.fill);
      } else if (showCommands) {
        const index = Math.min(selectedCommandIndex, filteredCommands.length - 1);
        setInputFromCode(filteredCommands[index].name);
      }
    }
    if (key.upArrow) {
      if (showCommands) {
        setSelectedCommandIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else {
        setScrollOffset(Math.max(0, visibleOffset - 1));
      }
    }
    if (key.downArrow) {
      if (showCommands) {
        setSelectedCommandIndex((prev) => (prev + 1) % filteredCommands.length);
      } else {
        setScrollOffset(Math.min(maxScrollOffset, visibleOffset + 1));
      }
    }
    if (key.pageUp) {
      setScrollOffset(Math.max(0, visibleOffset - viewportRows));
    }
    if (key.pageDown) {
      setScrollOffset(Math.min(maxScrollOffset, visibleOffset + viewportRows));
    }
  });

  let hint = inputValue
    ? (width >= 37 ? 'enter send · esc clear · ctrl+c quit' : 'enter send · esc clear')
    : (width >= 38 ? 'enter send · tab autofill · / commands' : 'tab autofill · / commands');
  if (isHiring && !inputValue) hint = 'enter send · /cancel stop';
  if (showCommands) hint = width >= 36 ? '↑↓ choose · tab complete · enter run' : 'tab complete · enter run';
  if (isLoading) hint = 'esc stop · ctrl+c quit';

  const scrollHint = maxScrollOffset > 0 && !showCommands
    ? `↑↓ scroll ${visibleOffset + visibleLines.length}/${allLines.length}`
    : '';
  const showScrollHint = scrollHint && hint.length + scrollHint.length + 2 <= width;

  return (
    <Box flexDirection="column" paddingX={2} height={isLanding ? undefined : height} flexShrink={0}>
      {/* Messages grow so the prompt stays in one place during a conversation */}
      <Box flexGrow={isLanding ? 0 : 1} flexShrink={0}>
        <Box flexDirection="column" flexGrow={1}>
          {visibleLines.map((line, index) => renderLine(line, visibleOffset + index))}
        </Box>
        <ScrollBar total={allLines.length} visible={viewportRows} offset={visibleOffset} />
      </Box>

      <Box flexDirection="column" marginTop={GAP_ABOVE_PROMPT} flexShrink={0}>
        <Box flexShrink={0}>
          <Box flexShrink={0} width={PROMPT_PREFIX_WIDTH}>
            <Text color={theme.accent}>┃ </Text>
            <Text bold>Ask {'>'} </Text>
          </Box>
          <Box width={inputWidth}>
            {/* @ts-ignore */}
            <TextInput
              key={inputKey}
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSubmit}
              placeholder={placeholder}
              showCursor
            />
          </Box>
        </Box>

        {showCommands && (
          <Box flexDirection="column" marginTop={1} flexShrink={0}>
            {filteredCommands.map((command, index) => {
              const isSelected = index === selectedCommandIndex;
              return (
                <Box key={command.name} height={1} flexShrink={0}>
                  <Text wrap="truncate-end">
                    <Text color={theme.accent}>┃ </Text>
                    <Text bold={isSelected} color={isSelected ? theme.accent : theme.muted}>
                      {isSelected ? '> ' : '  '}
                      {command.name.padEnd(13)}
                      {command.desc}
                    </Text>
                  </Text>
                </Box>
              );
            })}
          </Box>
        )}

        <Box justifyContent="space-between" marginTop={1} flexShrink={0}>
          <Text color={theme.muted} wrap="truncate-end">{hint}</Text>
          {showScrollHint && <Text color={theme.muted}>{scrollHint}</Text>}
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
