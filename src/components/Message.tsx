import React from 'react';
import { Box, Text } from 'ink';

interface MessageProps {
  sender: 'user' | 'assistant';
  text: string;
}

const parseMarkdown = (text: string): React.ReactNode[] => {
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|yasser gombra|yasser|gombra|barbergo|takwira tn|chat-app|devops|docker|ci\/cd|github|linkedin)/gi;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Check markdown bold
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Text key={index} bold color="cyan">
          {part.slice(2, -2)}
        </Text>
      );
    }
    // Check markdown italic
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <Text key={index} italic color="gray">
          {part.slice(1, -1)}
        </Text>
      );
    }
    // Check markdown code
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <Text key={index} color="green">
          {part.slice(1, -1)}
        </Text>
      );
    }

    // Check keywords
    const lower = part.toLowerCase();
    if (lower === 'yasser gombra' || lower === 'yasser' || lower === 'gombra') {
      return (
        <Text key={index} bold color="yellow">
          {part}
        </Text>
      );
    }
    if (
      lower === 'barbergo' ||
      lower === 'takwira tn' ||
      lower === 'chat-app' ||
      lower === 'devops' ||
      lower === 'docker' ||
      lower === 'ci/cd' ||
      lower === 'github' ||
      lower === 'linkedin'
    ) {
      return (
        <Text key={index} bold color="magenta">
          {part}
        </Text>
      );
    }

    // Normal text
    return (
      <Text key={index} color="white">
        {part}
      </Text>
    );
  });
};

export const Message: React.FC<MessageProps> = ({ sender, text }) => {
  if (sender === 'user') {
    return (
      <Box flexDirection="row" marginBottom={1} flexWrap="wrap">
        <Text color="blue" bold>yasser@cv:~$ </Text>
        <Text color="white">{text}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="row" marginBottom={1} flexWrap="wrap">
      <Text color="green" bold>AI &gt; </Text>
      <Text>{parseMarkdown(text)}</Text>
    </Box>
  );
};
export default Message;
