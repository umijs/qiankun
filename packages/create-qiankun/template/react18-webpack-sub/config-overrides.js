const packageName = require('./package.json').name

module.exports = {
  webpack: function(config, env) {
    config.output = {
      ...config.output,
      publicPath: `http://localhost:${process.env.PORT}/`,
      library: `${packageName}-[name]`,
      libraryTarget: 'umd',
      chunkLoadingGlobal: `webpackJsonp_${packageName}`,
    }
    return config;
  },
}