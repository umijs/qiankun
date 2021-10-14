import { writeFileSync } from 'fs';
import { join } from 'path';
import { version } from './package.json';

// generate version.ts
const versionFilePath = join(__dirname, './src/version.ts');
writeFileSync(versionFilePath, `export const version = '${version}';`);

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
