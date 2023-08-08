import { writeFileSync } from 'fs';
import { join } from 'path';
import globals from 'globals';

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

export default {
  platform: 'browser',
  esm: {},
  cjs: {},
  sourcemap: true,
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
