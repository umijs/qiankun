import { writeFileSync } from 'fs';
import { join } from 'path';
import cfg from '../../.fatherrc.cjs';
import { version } from './package.json';

// generate version.ts
const versionFilePath = join(__dirname, './src/version.ts');
writeFileSync(versionFilePath, `export const version = '${version}';`);

export default {
  umd: {},
  ...cfg,
};
