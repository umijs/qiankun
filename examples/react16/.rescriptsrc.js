const QiankunPlugin  = require('../../packages/webpack-plugin/dist/cjs').default;


module.exports = {
  webpack: config => {
    config.plugins.push(new QiankunPlugin());

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
