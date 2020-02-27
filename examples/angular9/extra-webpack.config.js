const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;
const webpackMerge = require('webpack-merge');

module.exports = (angularWebpackConfig, options) => {
  const singleSpaWebpackConfig = singleSpaAngularWebpack(angularWebpackConfig, options);

  const singleSpaConfig = {
    output: {
      library: 'angular9',
      libraryTarget: 'umd',
    },
    externals: {
      'zone.js': 'Zone',
    },
  };
  const mergedConfig = webpackMerge.smart(singleSpaWebpackConfig, singleSpaConfig);
  return mergedConfig;
};
