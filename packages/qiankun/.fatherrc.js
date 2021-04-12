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
