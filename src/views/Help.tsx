import React from 'react';
import { Box, Text } from 'ink';

export const Help: React.FC = () => {
  return (
    <Box
      flexDirection="column"
      paddingX={2}
      paddingY={1}
    >
      <Box marginBottom={1}>
        <Text color="gray" bold>[ Terminal CV Command Help ]</Text>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Text color="white" bold>[ Global Shortcuts ]</Text>
        <Text color="white">  ESC or I  - Return to Chat (when in other views)</Text>
        <Text color="white">  P         - Switch to Projects view</Text>
        <Text color="white">  S         - Switch to Skills view</Text>
        <Text color="white">  E         - Switch to Experience view</Text>
        <Text color="white">  C         - Switch to Contact view</Text>
        <Text color="white">  H         - Switch to Help view (this screen)</Text>
        <Text color="white">  Q         - Quit the application</Text>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Text color="white" bold>[ In-Chat Slash Commands ]</Text>
        <Text color="white">  /projects   - Switch to Projects view</Text>
        <Text color="white">  /skills     - Switch to Skills view</Text>
        <Text color="white">  /experience - Switch to Experience view</Text>
        <Text color="white">  /contact    - Switch to Contact view</Text>
        <Text color="white">  /help       - Switch to Help view</Text>
        <Text color="white">  /clear      - Clear the current chat history</Text>
      </Box>

      <Box marginTop={1}>
        <Text color="gray">Press [ESC] or [I] to go back to the Chat.</Text>
      </Box>
    </Box>
  );
};

export default Help;
