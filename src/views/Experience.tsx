import React from 'react';
import { Box, Text } from 'ink';
import { profileData } from '../data/profile.js';

export const Experience: React.FC = () => {
  const { experience } = profileData;

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Box marginBottom={1}>
        <Text color="blue" bold underline>Professional Experience & Education</Text>
      </Box>

      {experience.map((item, idx) => {
        return (
          <Box flexDirection="column" marginBottom={1} key={idx}>
            <Box flexDirection="row">
              <Text color="green" bold>● </Text>
              <Text color="yellow" bold>{item.title}</Text>
              <Text color="white"> @ {item.organization}</Text>
              {item.location && <Text color="gray" dimColor> | {item.location}</Text>}
            </Box>
            <Box marginLeft={2}>
              <Text color="cyan">{item.period}</Text>
            </Box>
            {item.details.length > 0 && (
              <Box flexDirection="column" marginLeft={4} marginTop={1}>
                {item.details.map((detail, dIdx) => (
                  <Text key={dIdx} color="white">
                    - {detail}
                  </Text>
                ))}
              </Box>
            )}
          </Box>
        );
      })}

      <Box marginTop={1}>
        <Text dimColor color="gray">Press [ESC] or [I] to go back to the Chat.</Text>
      </Box>
    </Box>
  );
};
export default Experience;
