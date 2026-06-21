import React from 'react';
import { Box, Text } from 'ink';
import { profileData } from '../data/profile.js';

export const Contact: React.FC = () => {
  const { contact } = profileData;

  const renderRow = (label: string, value: string) => {
    return (
      <Box flexDirection="row" key={label}>
        <Box width={12}>
          <Text color="gray" bold>{label}:</Text>
        </Box>
        <Text color="white">{value}</Text>
      </Box>
    );
  };

  return (
    <Box
      flexDirection="column"
      paddingX={2}
    >
      <Box marginBottom={1}>
        <Text color="gray" bold>[ Contact Information ]</Text>
      </Box>

      {renderRow('Email', contact.email)}
      {renderRow('Phone', contact.phone)}
      {renderRow('Website', contact.website)}
      {renderRow('GitHub', contact.github)}
      {renderRow('LinkedIn', contact.linkedin)}
      {renderRow('Location', contact.location)}
      {renderRow('Status', contact.status)}
      {renderRow('License', contact.license)}
      {renderRow('Languages', contact.languages.join(', '))}

      <Box marginTop={1}>
        <Text color="gray">Press [ESC] or [I] to go back to the Chat.</Text>
      </Box>
    </Box>
  );
};

export default Contact;
