import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { profileData } from '../data/profile.js';
import useStdoutDimensions from '../hooks/useStdoutDimensions.js';

export const Skills: React.FC = () => {
  const { skills } = profileData;
  const { columns, rows } = useStdoutDimensions();
  const [scrollOffset, setScrollOffset] = useState(0);

  // Dynamically size the page based on console height to prevent terminal scrolling
  const itemsPerPage = rows >= 36 ? 3 : 2;
  const totalPages = Math.ceil(skills.length / itemsPerPage);
  const currentPage = Math.floor(scrollOffset / itemsPerPage) + 1;

  useInput((input, key) => {
    if (key.upArrow) {
      setScrollOffset(prev => Math.max(0, prev - itemsPerPage));
    }
    if (key.downArrow) {
      setScrollOffset(prev => Math.min(skills.length - itemsPerPage, prev + itemsPerPage));
    }
  });

  const visibleSkills = skills.slice(scrollOffset, scrollOffset + itemsPerPage);

  return (
    <Box flexDirection="column" paddingX={2}>
      <Box marginBottom={1} justifyContent="space-between">
        <Text color="gray" bold>[ Skills & Technologies ]</Text>
        <Text color="gray">
          (Page {currentPage}/{totalPages} · Use ↑/↓ to scroll)
        </Text>
      </Box>

      {visibleSkills.map((cat, idx) => (
        <Box
          key={idx}
          flexDirection="column"
          borderStyle="single"
          borderColor="gray"
          padding={1}
          marginBottom={1}
        >
          <Box>
            <Text color="white" bold>[ {cat.category} ]</Text>
          </Box>
          <Box flexDirection="row" flexWrap="wrap">
            {cat.skills.map((skill, sIdx) => (
              <Box marginRight={2} key={sIdx}>
                <Text color="white">▪ {skill}</Text>
              </Box>
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

export default Skills;
