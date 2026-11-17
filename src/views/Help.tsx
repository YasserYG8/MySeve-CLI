import React from 'react';
import { Text } from 'ink';
import { COMMANDS } from '../constants/commands.js';
import { theme } from '../constants/theme.js';
import { wrapText } from '../utils/text.js';
import ScrollView, { Block } from '../components/ScrollView.js';

const LABEL_WIDTH = 13;

const CHAT_KEYS = [
  ['enter', 'Send your message'],
  ['tab', 'Fill in the suggestion, or complete a command'],
  ['/', 'Open the command menu'],
  ['↑ ↓', 'Scroll the chat, or choose a command'],
  ['esc', 'Stop an answer, or clear your text'],
  ['ctrl+c', 'Quit'],
];

const SCREEN_KEYS = [
  ['p s e c h', 'Open Projects, Skills, Experience, Contact, Help'],
  ['↑ ↓', 'Scroll'],
  ['pgup pgdn', 'Scroll faster'],
  ['esc or i', 'Back to the chat'],
  ['q', 'Quit'],
];

interface ViewProps {
  width: number;
  height: number;
}

export const Help: React.FC<ViewProps> = ({ width, height }) => {
  const section = (heading: string, items: string[][]): Block => [
    <Text bold>{heading}</Text>,
    ...items.flatMap(([key, desc]) =>
      wrapText(desc, Math.max(1, width - LABEL_WIDTH)).map((line, index) => (
        <Text>
          <Text color={theme.accent}>{(index === 0 ? key : '').padEnd(LABEL_WIDTH)}</Text>
          {line}
        </Text>
      ))
    ),
  ];

  const blocks: Block[] = [
    section('Commands', COMMANDS.map((command) => [command.name, command.desc])),
    section('Keys in the chat', CHAT_KEYS),
    section('Keys on other screens', SCREEN_KEYS),
  ];

  return <ScrollView title="Terminal CV Command Help" blocks={blocks} width={width} height={height} />;
};

export default Help;
