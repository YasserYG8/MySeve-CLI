import React from 'react';
import { Box, Text } from 'ink';
import { profileData } from '../data/profile.js';

export const Projects: React.FC = () => {
  const { projects } = profileData;

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Box marginBottom={1}>
        <Text color="blue" bold underline>Projects & Contributions</Text>
      </Box>

      <Box flexDirection="column">
        {projects.map((project, idx) => (
          <Box
            key={idx}
            flexDirection="column"
            borderStyle="round"
            borderColor="green"
            paddingX={1}
            marginBottom={1}
          >
            <Box flexDirection="row" justifyContent="space-between">
              <Text color="yellow" bold>{project.title}</Text>
              <Text color="cyan" dimColor>{project.github}</Text>
            </Box>
            
            <Box marginTop={1} marginBottom={1}>
              <Text color="white">{project.description}</Text>
            </Box>

            <Box flexDirection="row" flexWrap="wrap">
              <Text color="gray" bold>Stack: </Text>
              {project.stack.map((tech, tIdx) => (
                <Text key={tIdx} color="magenta">
                  {tech}{tIdx < project.stack.length - 1 ? ' · ' : ''}
                </Text>
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      <Box marginTop={1}>
        <Text dimColor color="gray">Press [ESC] or [I] to go back to the Chat.</Text>
      </Box>
    </Box>
  );
};
export default Projects;
