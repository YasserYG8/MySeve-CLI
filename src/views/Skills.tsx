import React from 'react';
import { Box, Text } from 'ink';
import { profileData } from '../data/profile.js';

export const Skills: React.FC = () => {
  const { skills } = profileData;

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Box marginBottom={1}>
        <Text color="blue" bold underline>Skills & Technologies</Text>
      </Box>

      {skills.map((cat, idx) => (
        <Box flexDirection="column" marginBottom={1} key={idx}>
          <Text color="yellow" bold>{cat.category}</Text>
          <Box marginLeft={2} flexDirection="row" flexWrap="wrap">
            {cat.skills.map((skill, sIdx) => (
              <Box marginRight={2} key={sIdx}>
                <Text color="white">
                  ▪ {skill}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>
      ))}

      <Box marginTop={1}>
        <Text dimColor color="gray">Press [ESC] or [I] to go back to the Chat.</Text>
      </Box>
    </Box>
  );
};
export default Skills;
