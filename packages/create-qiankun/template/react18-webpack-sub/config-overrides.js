const packageName = require('./package.json').name;
const {QiankunPlugin} = require('@qiankunjs/webpack-plugin');
module.exports = {
  webpack: function (config, env) {
    config.plugins.push(new QiankunPlugin());

    return config;
  },
};
