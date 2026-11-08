import React from 'react';
import { Text } from 'ink';
import { profileData } from '../data/profile.js';
import { theme } from '../constants/theme.js';
import { wrapText } from '../utils/text.js';
import ScrollView, { Block } from '../components/ScrollView.js';

const LABEL_WIDTH = 11;

interface ViewProps {
  width: number;
  height: number;
}

export const Contact: React.FC<ViewProps> = ({ width, height }) => {
  const { contact } = profileData;

  const rows = (label: string, value: string, color?: string): Block =>
    wrapText(value, Math.max(1, width - LABEL_WIDTH)).map((line, index) => (
      <Text>
        <Text color={theme.muted}>{(index === 0 ? label : '').padEnd(LABEL_WIDTH)}</Text>
        <Text color={color}>{line}</Text>
      </Text>
    ));

  const blocks: Block[] = [
    [
      ...rows('Email', contact.email, theme.accent),
      ...rows('Phone', contact.phone),
      ...rows('Website', contact.website, theme.accent),
      ...rows('GitHub', contact.github, theme.accent),
      ...rows('LinkedIn', contact.linkedin, theme.accent),
      ...rows('X', contact.x, theme.accent),
    ],
    [
      ...rows('Status', contact.status, theme.good),
      ...rows('Location', contact.location),
      ...rows('Languages', contact.languages.join(', ')),
      ...rows('Driving', contact.license),
    ],
  ];

  return <ScrollView title="Contact Information" blocks={blocks} width={width} height={height} />;
};

export default Contact;
