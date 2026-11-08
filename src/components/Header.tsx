import React from 'react';
import { Box, Text } from 'ink';
import { profileData } from '../data/profile.js';
import { theme } from '../constants/theme.js';
import { wrapText } from '../utils/text.js';

const LOGO = [
  '██  ██    ████    █████   █████  ██████  █████ ',
  '██  ██   ██  ██  ██      ██      ██      ██  ██',
  ' ████    ██████   ████    ████   █████   █████ ',
  '  ██     ██  ██      ██      ██  ██      ██ ██ ',
  '  ██     ██  ██  █████   █████   ██████  ██  ██',
];

export const LOGO_WIDTH = LOGO[0].length;

const getLines = (width: number, compact: boolean) => {
  const { name, title, subtitle, contact } = profileData;
  return {
    identity: compact
      ? wrapText(`${name} · ${title}`, width)
      : [...wrapText(name, width), ...wrapText(subtitle, width)],
    status: wrapText(`● ${contact.status}`, width),
  };
};

export const getHeaderHeight = (width: number, compact: boolean): number => {
  const { identity, status } = getLines(width, compact);
  return (compact ? 0 : LOGO.length + 1) + identity.length + status.length + 1;
};

interface HeaderProps {
  width: number;
  compact: boolean;
}

export const Header: React.FC<HeaderProps> = ({ width, compact }) => {
  const { identity, status } = getLines(width, compact);
  const { name } = profileData;

  return (
    <Box flexDirection="column" alignItems="center" marginBottom={1} flexShrink={0}>
      {!compact && (
        <Box flexDirection="column" marginBottom={1} flexShrink={0}>
          {LOGO.map((line, index) => (
            <Text key={index} color={theme.accent}>{line}</Text>
          ))}
        </Box>
      )}

      {identity.map((line) => (
        <Text key={line}>
          {line === name ? <Text bold>{line}</Text> : line}
        </Text>
      ))}

      {status.map((line) => (
        <Text key={line} color={theme.good}>{line}</Text>
      ))}
    </Box>
  );
};

export default Header;
