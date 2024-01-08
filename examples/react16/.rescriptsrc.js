const QiankunPlugin = require('../../packages/webpack-plugin/dist/cjs');

module.exports = {
  webpack: (config) => {
    const name = 'react16';
    // config.plugins.push(new QiankunPlugin());

    config.output.library = `${name}-[name]`;
    config.output.libraryTarget = 'window';
    config.output.jsonpFunction = `webpackJsonp_${name}`;
    config.output.globalObject = 'window';

    return config;
  },

  devServer: (_) => {
    const config = _;

    config.headers = {
      'Access-Control-Allow-Origin': '*',
    };
    config.historyApiFallback = true;

    config.hot = false;
    config.watchContentBase = false;
    config.liveReload = false;

    return config;
  },
};
