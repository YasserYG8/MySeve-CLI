import React from 'react';
import { Box, Text } from 'ink';
import { profileData } from '../data/profile.js';

export const Header: React.FC = () => {
  return (
    <Box flexDirection="column" alignItems="center" marginBottom={1}>
      {/* Large clear block logo */}
      <Box flexDirection="column" alignItems="center" marginBottom={1}>
        <Text color="gray">██  ██    ████▄    ██████   ██████  ██████  ██████▄</Text>
        <Text color="gray"> ▀███▀   ▐█▀  ▀█▌ ▐█▀   ▀  ▐█▀   ▀  ██▄▄▄▄  ██   ██</Text>
        <Text color="gray">  ███    ▐█▄▄▄█▌   ▀████▄   ▀████▄  ██▀▀▀▀  ██████▀</Text>
        <Text color="gray">  ███    ▐█▀  ▀█▌ ▄▄   ██  ▄▄   ██  ██▄▄▄▄  ██  ▀██▄</Text>
        <Text color="gray">  ▀▀▀    █▌  █▌   ▀████▀   ▀████▀   ██████  ██   ▀██</Text>
      </Box>

      <Box flexDirection="row" justifyContent="center" flexWrap="wrap">
        <Text color="green">Active</Text>
        <Text color="gray"> · Yasser Gombra v1.0.0 · </Text>
        <Text color="white" bold>{profileData.title}</Text>
      </Box>
    </Box>
  );
};

export default Header;
