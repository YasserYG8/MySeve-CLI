import React from 'react';
import { Text } from 'ink';
import { theme } from '../constants/theme.js';

export const SPINE_WIDTH = 2;

export const Spine: React.FC = () => <Text color={theme.muted}>│ </Text>;

export const SpineDot: React.FC = () => <Text color={theme.accent}>● </Text>;

export default Spine;
