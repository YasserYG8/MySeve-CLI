import React from 'react';
import { Box, Text } from 'ink';
import figlet from 'figlet';
import { profileData } from '../data/profile.js';
import { useStdoutDimensions } from '../hooks/useStdoutDimensions.js';
import chalk from 'chalk';

export const Header: React.FC = () => {
  const { columns } = useStdoutDimensions();
  
  let asciiArt = 'YASSER';
  try {
    asciiArt = figlet.textSync('YASSER', { font: 'Slant' });
  } catch (err) {
    // fallback if figlet fails
  }

  const divider = '─'.repeat(Math.max(10, columns - 4));

  return (
    <Box flexDirection="column" marginBottom={1} paddingX={2}>
      <Box flexDirection="row" justifyContent="space-between" alignItems="flex-end">
        <Text color="blue" bold>{asciiArt}</Text>
        <Box flexDirection="column" alignItems="flex-end" marginBottom={1}>
          <Box flexDirection="row">
            <Text color="green" bold>● </Text>
            <Text color="white" bold>AGENT ACTIVE</Text>
            <Text color="gray" dimColor> | v1.0.0</Text>
          </Box>
          <Text color="gray" dimColor>Model: openrouter/free</Text>
        </Box>
      </Box>
      
      <Box flexDirection="row" justifyContent="space-between" marginTop={1} marginBottom={1}>
        <Text>{chalk.bgBlue.white.bold(' PORTFOLIO TUI ')}</Text>
        <Text color="gray" dimColor>
          {profileData.title} · Tunisia
        </Text>
      </Box>
      <Text color="gray">{divider}</Text>
    </Box>
  );
};
export default Header;
