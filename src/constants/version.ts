import { createRequire } from 'node:module';

// Same relative path from src/constants and dist/constants.
const require = createRequire(import.meta.url);
export const VERSION: string = require('../../package.json').version;
