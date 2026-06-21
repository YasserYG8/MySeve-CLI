import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { profileData } from '../data/profile.js';
import useStdoutDimensions from '../hooks/useStdoutDimensions.js';

export const Experience: React.FC = () => {
  const { experience } = profileData;
  const { columns, rows } = useStdoutDimensions();
  const [scrollOffset, setScrollOffset] = useState(0);

  // Dynamically size the page based on console height to prevent terminal scrolling
  const itemsPerPage = rows >= 36 ? 2 : 1;
  const totalPages = Math.ceil(experience.length / itemsPerPage);
  const currentPage = Math.floor(scrollOffset / itemsPerPage) + 1;

  useInput((input, key) => {
    if (key.upArrow) {
      setScrollOffset(prev => Math.max(0, prev - itemsPerPage));
    }
    if (key.downArrow) {
      setScrollOffset(prev => Math.min(experience.length - itemsPerPage, prev + itemsPerPage));
    }
  });

  const visibleExperience = experience.slice(scrollOffset, scrollOffset + itemsPerPage);

  return (
    <Box flexDirection="column" paddingX={2}>
      <Box marginBottom={1} justifyContent="space-between">
        <Text color="gray" bold>[ Professional Experience & Education ]</Text>
        <Text color="gray">
          (Page {currentPage}/{totalPages} · Use ↑/↓ to scroll)
        </Text>
      </Box>

      {visibleExperience.map((item, idx) => {
        return (
          <Box
            key={idx}
            flexDirection="column"
            borderStyle="single"
            borderColor="gray"
            padding={1}
            marginBottom={1}
          >
            <Box flexDirection="row" justifyContent="space-between" flexWrap="wrap">
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
