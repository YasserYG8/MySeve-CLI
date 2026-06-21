import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { profileData } from '../data/profile.js';

export const Experience: React.FC = () => {
  const { experience } = profileData;
  const [scrollOffset, setScrollOffset] = useState(0);
  const itemsPerPage = 2;
  const currentPage = scrollOffset + 1;

  useInput((input, key) => {
    if (key.upArrow) {
      setScrollOffset(prev => Math.max(0, prev - 1));
    }
    if (key.downArrow) {
      setScrollOffset(prev => Math.min(experience.length - itemsPerPage, prev + 1));
    }
  });

  const visibleExperience = experience.slice(scrollOffset, scrollOffset + itemsPerPage);

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Box marginBottom={1} justifyContent="space-between">
        <Text color="gray" bold>[ Professional Experience & Education ]</Text>
        <Text color="gray">
          (Page {currentPage}/{experience.length - itemsPerPage + 1} · Use ↑/↓ to scroll)
        </Text>
      </Box>

      {visibleExperience.map((item, idx) => {
        return (
          <Box
            key={idx}
            flexDirection="column"
            borderStyle="single"
            borderColor="gray"
            paddingX={1}
            marginBottom={1}
          >
            <Box flexDirection="row" justifyContent="space-between">
              <Box flexDirection="row">
                <Text color="white" bold>[ {item.title} ]</Text>
                <Text color="white"> @ {item.organization}</Text>
              </Box>
              {item.location && <Text color="gray">{item.location}</Text>}
            </Box>
            <Box marginLeft={2} marginTop={1}>
              <Text color="gray">{item.period}</Text>
            </Box>
            {item.details.length > 0 && (
              <Box flexDirection="column" marginLeft={2} marginTop={1}>
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
        <Text color="gray">Press [ESC] or [I] to go back to the Chat.</Text>
      </Box>
    </Box>
  );
};

export default Experience;
