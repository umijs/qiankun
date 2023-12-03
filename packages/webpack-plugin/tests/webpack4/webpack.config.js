const path = require('path');
const QiankunPlugin = require('../../dist/cjs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', // 指定模板文件路径
      filename: 'index.html', // 输出的HTML文件名（默认为index.html）
    }),
    new QiankunPlugin({
      entrySrcPattern: /app\.12\.js/,
    }),
  ],
};
