export default {
  platform: 'browser',
  esm: {},
  cjs: {},
  umd: {},
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
