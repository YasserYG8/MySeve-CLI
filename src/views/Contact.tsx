import React from 'react';
import { Box, Text } from 'ink';
import { profileData } from '../data/profile.js';

export const Contact: React.FC = () => {
  const { contact } = profileData;

  const renderRow = (label: string, value: string) => {
    return (
      <Box flexDirection="row" marginBottom={1} key={label}>
        <Box width={15}>
          <Text color="cyan" bold>{label}:</Text>
        </Box>
        <Text color="white">{value}</Text>
      </Box>
    );
  };
  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Box marginBottom={1}>
        <Text color="blue" bold underline>Contact Information</Text>
      </Box>

      {renderRow('Email', contact.email)}
      {renderRow('Phone', contact.phone)}
      {renderRow('GitHub', contact.github)}
      {renderRow('LinkedIn', contact.linkedin)}
      {renderRow('Location', contact.location)}
      {renderRow('Status', contact.status)}
      {renderRow('License', contact.license)}
      {renderRow('Languages', contact.languages.join(', '))}

      <Box marginTop={1}>
        <Text dimColor color="gray">Press [ESC] or [I] to go back to the Chat.</Text>
      </Box>
    </Box>
  );
};
export default Contact;
