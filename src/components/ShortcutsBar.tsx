import React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../constants/theme.js';
import { VERSION } from '../constants/version.js';

const VIEW_KEYS = [
  { key: 'P', label: 'Projects', view: 'projects' },
  { key: 'S', label: 'Skills', view: 'skills' },
  { key: 'E', label: 'Experience', view: 'experience' },
  { key: 'C', label: 'Contact', view: 'contact' },
  { key: 'H', label: 'Help', view: 'help' },
  { key: 'I', label: 'Chat', view: 'chat' },
  { key: 'Q', label: 'Quit', view: 'quit' },
];

const CHAT_LINKS = ['/projects', '/skills', '/experience', '/contact', '/help'];

const VIEW_BAR_WIDTH = VIEW_KEYS.reduce((sum, item) => sum + item.label.length + 2, 0) + (VIEW_KEYS.length - 1) * 2;
const CHAT_BAR_WIDTH = CHAT_LINKS.join('  ').length;

interface ShortcutsBarProps {
  activeView: string;
  width: number;
}

// One row, always. Letter keys only work outside the chat, where nothing is being typed.
export const ShortcutsBar: React.FC<ShortcutsBarProps> = ({ activeView, width }) => {
  const inChat = activeView === 'chat';
  const barWidth = inChat ? CHAT_BAR_WIDTH : VIEW_BAR_WIDTH;
  const version = `v${VERSION}`;
  const showVersion = barWidth + version.length + 3 <= width;

  let bar: React.ReactNode;
  if (barWidth > width) {
    bar = <Text color={theme.muted}>{inChat ? '/ commands' : 'esc chat · h help · q quit'}</Text>;
  } else if (inChat) {
    bar = <Text color={theme.muted}>{CHAT_LINKS.join('  ')}</Text>;
  } else {
    bar = (
      <Text>
        {VIEW_KEYS.map((item, index) => {
          const isActive = item.view === activeView;
          return (
            <Text key={item.key}>
              {index > 0 ? '  ' : ''}
              <Text bold color={isActive ? theme.accent : undefined}>{item.key}</Text>
              <Text bold={isActive} color={isActive ? theme.accent : theme.muted}> {item.label}</Text>
            </Text>
          );
        })}
      </Text>
    );
  }

  return (
    <Box justifyContent="space-between" paddingX={2} marginTop={1} flexShrink={0}>
      {bar}
      {showVersion && <Text color={theme.muted}>{version}</Text>}
    </Box>
  );
};

export default ShortcutsBar;
