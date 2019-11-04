const webpackMerge = require('webpack-merge');

module.exports = (config, options) => {
  const qiankunSpaConfig = {
    output: {
      library: 'ngTestApp',
      libraryTarget: 'umd',
    },
    externals: {
      'zone.js': 'Zone',
    },
  };
  const mergedConfig = webpackMerge.smart(config, qiankunSpaConfig);
  return mergedConfig;
};
