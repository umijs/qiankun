import { writeFileSync } from 'fs';
import { join } from 'path';
import globals from 'globals';

console.log('generate globals.ts...');
// generate globals.ts
const globalsFilePath = join(__dirname, './src/core/sandbox/globals.ts');
writeFileSync(
  globalsFilePath,
  `// generated from https://github.com/sindresorhus/globals/blob/main/globals.json es2015 part
// only init its values while Proxy is supported
export const globals = window.Proxy ? ${JSON.stringify(
    Object.keys(globals.es2015),
    null,
    2,
  )}.filter(p => /* just keep the available properties in current window context */ p in window) : [];`,
);
console.log('generate globals.ts succeed...');

export { default } from '../../.fatherrc.cjs';
