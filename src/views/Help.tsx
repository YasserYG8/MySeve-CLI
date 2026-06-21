import React from 'react';
import { Box, Text } from 'ink';

export const Help: React.FC = () => {
  return (
    <Box
      flexDirection="column"
      paddingX={2}
    >
      <Box marginBottom={1}>
        <Text color="gray" bold>[ Terminal CV Command Help ]</Text>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Text color="white" bold>[ Slash Commands ]</Text>
        <Text color="white">  /projects   - Switch to Projects</Text>
        <Text color="white">  /skills     - Switch to Skills</Text>
        <Text color="white">  /experience - Switch to Experience</Text>
        <Text color="white">  /contact    - Switch to Contact</Text>
        <Text color="white">  /help       - Switch to Help</Text>
        <Text color="white">  /clear      - Clear chat history</Text>
      </Box>

      <Box marginTop={1}>
        <Text color="gray">Press [ESC] or [I] to go back to the Chat.</Text>
      </Box>
    </Box>
  );
};

export default Help;
