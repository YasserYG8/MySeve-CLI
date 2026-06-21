import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { profileData } from '../data/profile.js';

export const Projects: React.FC = () => {
  const { projects } = profileData;
  const [scrollOffset, setScrollOffset] = useState(0);
  const itemsPerPage = 2;
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const currentPage = scrollOffset + 1;

  useInput((input, key) => {
    if (key.upArrow) {
      setScrollOffset(prev => Math.max(0, prev - 1));
    }
    if (key.downArrow) {
      setScrollOffset(prev => Math.min(projects.length - itemsPerPage, prev + 1));
    }
  });

  const visibleProjects = projects.slice(scrollOffset, scrollOffset + itemsPerPage);

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Box marginBottom={1} justifyContent="space-between">
        <Text color="gray" bold>[ Projects & Contributions ]</Text>
        <Text color="gray">
          (Page {currentPage}/{projects.length - itemsPerPage + 1} · Use ↑/↓ to scroll)
        </Text>
      </Box>

      {visibleProjects.map((project, idx) => (
        <Box
          key={idx}
          flexDirection="column"
          borderStyle="single"
          borderColor="gray"
          paddingX={1}
          marginBottom={1}
        >
          <Box flexDirection="row" justifyContent="space-between">
            <Text color="white" bold>[ {project.title} ]</Text>
            <Text color="gray">{project.github}</Text>
          </Box>
          
          <Box marginTop={1} marginBottom={1}>
            <Text color="white">{project.description}</Text>
          </Box>

          <Box flexDirection="row" flexWrap="wrap">
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
