const { name } = require('./package');

module.exports = {
  webpack: (config) => {
    config.output.library = `subapp-${name}`;
    config.output.libraryTarget = 'umd';
    config.output.jsonpFunction = `webpackJsonp_${name}`;

    return config;
  },

  devServer: (_) => {
    const config = {};

    config.port = '7100';
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
