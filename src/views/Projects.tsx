import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { profileData } from '../data/profile.js';
import useStdoutDimensions from '../hooks/useStdoutDimensions.js';

export const Projects: React.FC = () => {
  const { projects } = profileData;
  const { columns, rows } = useStdoutDimensions();
  const [scrollOffset, setScrollOffset] = useState(0);

  // Dynamically size the page based on console height to prevent terminal scrolling
  const itemsPerPage = rows >= 36 ? 2 : 1;
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const currentPage = Math.floor(scrollOffset / itemsPerPage) + 1;

  useInput((input, key) => {
    if (key.upArrow) {
      setScrollOffset(prev => Math.max(0, prev - itemsPerPage));
    }
    if (key.downArrow) {
      setScrollOffset(prev => Math.min(projects.length - itemsPerPage, prev + itemsPerPage));
    }
  });

  const visibleProjects = projects.slice(scrollOffset, scrollOffset + itemsPerPage);

  return (
    <Box flexDirection="column" paddingX={2}>
      <Box marginBottom={1} justifyContent="space-between">
        <Text color="gray" bold>[ Projects & Contributions ]</Text>
        <Text color="gray">
          (Page {currentPage}/{totalPages} · Use ↑/↓ to scroll)
        </Text>
      </Box>

      {visibleProjects.map((project, idx) => (
        <Box
          key={idx}
          flexDirection="column"
          borderStyle="single"
          borderColor="gray"
          padding={1}
          marginBottom={1}
        >
          <Box flexDirection="row" justifyContent="space-between" flexWrap="wrap">
            <Text color="white" bold>[ {project.title} ]</Text>
            <Text color="gray">{project.github}</Text>
          </Box>
          
          <Box marginTop={1}>
            <Text color="white">{project.description}</Text>
          </Box>

          <Box flexDirection="row" flexWrap="wrap" marginTop={1}>
            <Text color="gray" bold>Stack: </Text>
            {project.stack.map((tech, tIdx) => (
              <Text key={tIdx} color="white">
                {tech}{tIdx < project.stack.length - 1 ? ' · ' : ''}
              </Text>
            ))}
          </Box>
        </Box>
      ))}

      <Box marginTop={1}>
        <Text color="gray">Press [ESC] or [I] to go back to the Chat.</Text>
      </Box>
    </Box>
  );
};

export default Projects;
