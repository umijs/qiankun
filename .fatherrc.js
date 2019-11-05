export default {
  target: 'browser',
  entry: 'src/index.ts',
  esm: 'babel',
  cjs: 'babel',
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
