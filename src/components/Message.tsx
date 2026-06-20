import React from 'react';
import { Box, Text } from 'ink';

interface MessageProps {
  sender: 'user' | 'assistant';
  text: string;
}

export const Message: React.FC<MessageProps> = ({ sender, text }) => {
  if (sender === 'user') {
    return (
      <Box flexDirection="row" marginBottom={1}>
        <Text color="blue" bold>yasser@cv:~$ </Text>
        <Text color="white">{text}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="row" marginBottom={1}>
      <Text color="green" bold>AI &gt; </Text>
      <Text color="white">{text}</Text>
    </Box>
  );
};
export default Message;
