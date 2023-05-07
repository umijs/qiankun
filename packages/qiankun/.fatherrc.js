export default {
  platform: 'browser',
  esm: {},
  cjs: {},
  umd: {},
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
