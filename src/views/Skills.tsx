import React from 'react';
import { Text } from 'ink';
import { profileData } from '../data/profile.js';
import { joinTerms, wrapText } from '../utils/text.js';
import ScrollView, { Block } from '../components/ScrollView.js';

const LABEL_WIDTH = 25;
const MIN_TWO_COLUMN_WIDTH = 60;

interface ViewProps {
  width: number;
  height: number;
}

export const Skills: React.FC<ViewProps> = ({ width, height }) => {
  const twoColumns = width >= MIN_TWO_COLUMN_WIDTH;

  const blocks: Block[] = profileData.skills.map(({ category, skills }) => {
    if (!twoColumns) {
      return [
        ...wrapText(category, width).map((line) => <Text bold>{line}</Text>),
        ...wrapText(joinTerms(skills), width).map((line) => <Text>{line}</Text>),
      ];
    }
    return wrapText(joinTerms(skills), width - LABEL_WIDTH).map((line, index) => (
      <Text>
        <Text bold>{(index === 0 ? category : '').padEnd(LABEL_WIDTH)}</Text>
        {line}
      </Text>
    ));
  });

  return <ScrollView title="Skills & Technologies" blocks={blocks} width={width} height={height} />;
};

export default Skills;
