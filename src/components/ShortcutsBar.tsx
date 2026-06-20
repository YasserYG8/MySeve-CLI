import React from 'react';
import { Box, Text } from 'ink';
import chalk from 'chalk';

interface ShortcutsBarProps {
  activeView: string;
}

export const ShortcutsBar: React.FC<ShortcutsBarProps> = ({ activeView }) => {
  const renderShortcut = (key: string, label: string, viewName: string) => {
    const isActive = activeView === viewName;
    
    // Highlight key in bright cyan if active, dim cyan/white if inactive
    const keyStr = isActive ? chalk.cyan(key) : chalk.white.bold(key);
    const arrow = chalk.gray('→');
    const desc = isActive ? chalk.cyan(label) : chalk.gray(label);

    return (
      <Box marginRight={2} key={key}>
        <Text color={isActive ? "cyan" : "gray"}>[</Text>
        <Text>{keyStr}{arrow}{desc}</Text>
        <Text color={isActive ? "cyan" : "gray"}>]</Text>
      </Box>
    );
  };

  return (
    <Box paddingX={1} justifyContent="center" width="100%">
      {renderShortcut('i', 'Chat', 'chat')}
      {renderShortcut('p', 'Projects', 'projects')}
      {renderShortcut('s', 'Skills', 'skills')}
      {renderShortcut('e', 'Experience', 'experience')}
      {renderShortcut('c', 'Contact', 'contact')}
      {renderShortcut('h', 'Help', 'help')}
      {renderShortcut('q', 'Quit', 'quit')}
    </Box>
  );
};
export default ShortcutsBar;
