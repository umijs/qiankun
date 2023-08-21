module.exports = {
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
