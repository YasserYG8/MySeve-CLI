import React from 'react';
import { Box, Text } from 'ink';

export const Help: React.FC = () => {
  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Text color="cyan" bold underline>Terminal CV Command Help</Text>
      <Box flexDirection="column" marginTop={1}>
        <Text color="yellow" bold>Global Shortcuts:</Text>
        <Text>  I - Focus back to Chat view (default)</Text>
        <Text>  P - Switch to Projects view</Text>
        <Text>  S - Switch to Skills view</Text>
        <Text>  E - Switch to Experience view</Text>
        <Text>  C - Switch to Contact view</Text>
        <Text>  H - Switch to Help view (this screen)</Text>
        <Text>  Q / ESC - Quit the application / Return to Chat from other views</Text>
      </Box>

      <Box flexDirection="column" marginTop={1}>
        <Text color="green" bold>In-Chat Slash Commands:</Text>
        <Text>  /projects   - Switch to Projects view</Text>
        <Text>  /skills     - Switch to Skills view</Text>
        <Text>  /experience - Switch to Experience view</Text>
        <Text>  /contact    - Switch to Contact view</Text>
        <Text>  /help       - Switch to Help view</Text>
        <Text>  /clear      - Clear the current chat history</Text>
      </Box>

      <Box marginTop={1}>
        <Text dimColor color="gray">Press [ESC] or [I] to go back to the Chat.</Text>
      </Box>
    </Box>
  );
};
export default Help;
