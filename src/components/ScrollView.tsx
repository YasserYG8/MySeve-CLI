import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { theme } from '../constants/theme.js';
import ScrollBar, { SCROLL_GUTTER } from './ScrollBar.js';

// One node per terminal row, so the content can be measured before it is drawn.
export type Block = React.ReactNode[];

const TITLE_ROWS = 2;

interface ScrollViewProps {
  title: string;
  blocks: Block[];
  width: number;
  height: number;
}

// Shared frame for the static screens: a title row, then blocks that scroll inside the height.
export const ScrollView: React.FC<ScrollViewProps> = ({ title, blocks, width, height }) => {
  const rows = blocks.flatMap((block, index) => (index > 0 ? [null, ...block] : block));
  const visible = Math.max(1, height - TITLE_ROWS);
  const maxOffset = Math.max(0, rows.length - visible);
  const [requestedOffset, setOffset] = useState(0);
  const offset = Math.min(requestedOffset, maxOffset);
  const pageStep = Math.max(1, visible - 1);

  useInput((_input, key) => {
    if (key.upArrow) setOffset(Math.max(0, offset - 1));
    if (key.downArrow) setOffset(Math.min(maxOffset, offset + 1));
    if (key.pageUp) setOffset(Math.max(0, offset - pageStep));
    if (key.pageDown) setOffset(Math.min(maxOffset, offset + pageStep));
  });

  return (
    <Box flexDirection="column" paddingX={2} flexShrink={0}>
      <Box justifyContent="space-between" marginBottom={1} flexShrink={0}>
        <Text bold color={theme.accent} wrap="truncate-end">{title}</Text>
        {maxOffset > 0 && (
          <Box flexShrink={0} marginLeft={2}>
            <Text color={theme.muted}>↑↓ scroll</Text>
          </Box>
        )}
      </Box>

      <Box flexShrink={0}>
        <Box flexDirection="column" width={width} flexShrink={0}>
          {rows.slice(offset, offset + visible).map((row, index) => (
            <Box key={offset + index} height={1} flexShrink={0}>{row}</Box>
          ))}
        </Box>
        <ScrollBar total={rows.length} visible={visible} offset={offset} />
      </Box>
    </Box>
  );
};

export { SCROLL_GUTTER };
export default ScrollView;
