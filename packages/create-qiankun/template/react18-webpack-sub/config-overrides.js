const packageName = require('./package.json').name;
const qiankunPlugin = require('@qiankunjs/webpack-plugin');
module.exports = {
  webpack: function (config, env) {
    config.plugins.push(new qiankunPlugin());

    return config;
  },
};
