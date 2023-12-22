const { QiankunPlugin } = require('@qiankunjs/webpack-plugin');
module.exports = {
  webpack: function (config) {
    config.plugins.push(new QiankunPlugin());
    return config;
  },
};
