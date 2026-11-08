// Named ANSI colors follow the visitor's terminal theme, so they stay readable
// on light and dark backgrounds. Body text sets no color for the same reason.
export const theme = {
  accent: 'cyan',
  good: 'green',
  bad: 'red',
  muted: 'gray',
} as const;
