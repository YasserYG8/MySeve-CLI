import React from 'react';
import { Box, Text } from 'ink';
import { profileData, Project } from '../data/profile.js';
import { theme } from '../constants/theme.js';
import { displayWidth, joinTerms, wrapText } from '../utils/text.js';
import ScrollView, { Block } from '../components/ScrollView.js';
import Spine, { SPINE_WIDTH, SpineDot } from '../components/Spine.js';

const STACK_LABEL = 'Stack ';

interface ViewProps {
  width: number;
  height: number;
}

export const Projects: React.FC<ViewProps> = ({ width, height }) => {
  const textWidth = Math.max(1, width - SPINE_WIDTH);

  const toBlock = (project: Project): Block => {
    const note = project.note ?? '';
    const noteFits = displayWidth(project.title) + displayWidth(note) + 2 <= textWidth;
    const noteRows = note && !noteFits ? wrapText(note, textWidth) : [];

    return [
      <Box width={width} justifyContent="space-between">
        <Text><SpineDot /><Text bold>{project.title}</Text></Text>
        {note && noteFits && <Text color={theme.muted}>{note}</Text>}
      </Box>,
      ...noteRows.map((line) => <Text><Spine /><Text color={theme.muted}>{line}</Text></Text>),
      ...wrapText(project.description, textWidth).map((line) => <Text><Spine />{line}</Text>),
      ...wrapText(joinTerms(project.stack), Math.max(1, textWidth - STACK_LABEL.length)).map((line, index) => (
        <Text>
          <Spine />
          <Text color={theme.muted}>{index === 0 ? STACK_LABEL : ' '.repeat(STACK_LABEL.length)}</Text>
          {line}
        </Text>
      )),
      ...(project.github ? wrapText(project.github, textWidth) : []).map((line) => (
        <Text><Spine /><Text color={theme.accent}>{line}</Text></Text>
      )),
    ];
  };

  const own = profileData.projects.filter((project) => !project.note);
  const openSource = profileData.projects.filter((project) => project.note);

  const blocks: Block[] = [
    [<Text bold>Projects</Text>],
    ...own.map(toBlock),
    [<Text bold>Open Source Contributions</Text>],
    ...openSource.map(toBlock),
  ];

  return <ScrollView title="Projects & Contributions" blocks={blocks} width={width} height={height} />;
};

export default Projects;
