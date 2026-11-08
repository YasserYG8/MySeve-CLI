import React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../constants/theme.js';

// Columns to keep free beside scrollable text: one gap and the bar.
export const SCROLL_GUTTER = 2;

interface ScrollBarProps {
  total: number;
  visible: number;
  offset: number;
}

// Draws nothing when everything fits.
export const ScrollBar: React.FC<ScrollBarProps> = ({ total, visible, offset }) => {
  if (total <= visible) return null;

  const thumbSize = Math.max(1, Math.round((visible * visible) / total));
  const thumbTop = Math.round((offset / (total - visible)) * (visible - thumbSize));

  return (
    <Box flexDirection="column" width={1} marginLeft={1} flexShrink={0}>
      {Array.from({ length: visible }, (_, row) => {
        const isThumb = row >= thumbTop && row < thumbTop + thumbSize;
        return (
          <Text key={row} color={isThumb ? theme.accent : theme.muted}>
            {isThumb ? '┃' : '│'}
          </Text>
        );
      })}
    </Box>
  );
};

export default ScrollBar;
