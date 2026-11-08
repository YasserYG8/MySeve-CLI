import React from 'react';
import { Text } from 'ink';
import { profileData } from '../data/profile.js';
import { theme } from '../constants/theme.js';
import { displayWidth, wrapText } from '../utils/text.js';
import ScrollView, { Block } from '../components/ScrollView.js';
import Spine, { SPINE_WIDTH, SpineDot } from '../components/Spine.js';

interface ViewProps {
  width: number;
  height: number;
}

export const Experience: React.FC<ViewProps> = ({ width, height }) => {
  const textWidth = Math.max(1, width - SPINE_WIDTH);

  const blocks: Block[] = profileData.experience.map((item) => {
    const place = `@ ${item.organization}`;
    const headingFits = displayWidth(`${item.title} ${place}`) <= textWidth;
    const meta = [item.period, item.location].filter(Boolean).join(' · ');

    const heading = headingFits
      ? [<Text><Text bold>{item.title}</Text> {place}</Text>]
      : [
          ...wrapText(item.title, textWidth).map((line) => <Text bold>{line}</Text>),
          ...wrapText(place, textWidth).map((line) => <Text>{line}</Text>),
        ];

    return [
      ...heading.map((node, index) => (
        <Text>
          {index === 0 ? <SpineDot /> : <Spine />}
          {node}
        </Text>
      )),
      ...wrapText(meta, textWidth).map((line) => (
        <Text><Spine /><Text color={theme.muted}>{line}</Text></Text>
      )),
      ...item.details.flatMap((detail) =>
        wrapText(`• ${detail}`, textWidth).map((line) => (
          <Text><Spine />{line}</Text>
        ))
      ),
    ];
  });

  return <ScrollView title="Professional Experience & Education" blocks={blocks} width={width} height={height} />;
};

export default Experience;
