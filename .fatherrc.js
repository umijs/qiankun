import { writeFileSync } from 'fs';
import { join } from 'path';
import { version } from './package.json';
import globals from 'globals';

// generate version.ts
const versionFilePath = join(__dirname, './src/version.ts');
writeFileSync(versionFilePath, `export const version = '${version}';`);

// generate globals.ts
const globalsFilePath = join(__dirname, './src/sandbox/globals.ts');
writeFileSync(
  globalsFilePath,
  `// generated from https://github.com/sindresorhus/globals/blob/main/globals.json builtin part
export const globals = ${JSON.stringify(Object.keys(globals.builtin), null, 2)};`,
);

export default {
  target: 'browser',
  esm: 'babel',
  cjs: 'babel',
  umd: {
    minFile: true,
    sourcemap: true,
  },
  runtimeHelpers: true,
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'lodash',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
    ],
  ],
};
