const { QiankunWebpackPlugin } = require('../../packages/bundler-plugin/dist/cjs');


module.exports = {
  webpack: config => {
    config.plugins.push(new QiankunWebpackPlugin());

    return config;
  },

  devServer: _ => {
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
