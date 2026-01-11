const { QiankunWebpackPlugin } = require('@qiankunjs/bundler-plugin');
module.exports = {
  webpack: function (config) {
    config.plugins.push(new QiankunWebpackPlugin());
    return config;
  },
};
