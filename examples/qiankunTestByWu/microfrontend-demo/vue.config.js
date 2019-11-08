const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

const port = 7099; // dev port

module.exports = {
  publicPath: './',
  devServer: {
    // host: '0.0.0.0',
    hot: true,
    disableHostCheck: true,
    port,
    overlay: {
      warnings: false,
      errors: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
