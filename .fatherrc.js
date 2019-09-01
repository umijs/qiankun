export default {
  target: 'browser',
  entry: 'src/index.ts',
  esm: 'rollup',
  cjs: 'rollup',
  disableTypeCheck: true,
  runtimeHelpers: true,
  extraBabelPlugins: [
    ['babel-plugin-import', {
      libraryName: 'lodash',
      libraryDirectory: '',
      camel2DashComponentName: false,
    }],
  ],
};
