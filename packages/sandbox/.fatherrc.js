import { writeFileSync } from 'fs';
import globals from 'globals';
import { join } from 'path';

console.log('generate globals.ts...');
// generate globals.ts
const globalsFilePath = join(__dirname, './src/core/globals.ts');
writeFileSync(
  globalsFilePath,
  `// generated from https://github.com/sindresorhus/globals/blob/main/globals.json es2015 part
// only init its values while Proxy is supported
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export const globalsInES2015 = window.Proxy ? ${JSON.stringify(
    Object.keys(globals.es2015),
    null,
    2,
  )}.filter(p => /* just keep the available properties in current window context */ p in window) : [];

export const globalsInBrowser = ${JSON.stringify(Object.keys(globals.browser), null, 2)};
  `,
);

console.log('generate globals.ts succeed...');

export { default } from '../../.fatherrc.cjs';
