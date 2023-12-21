const HtmlWebpackPlugin = require('html-webpack-plugin');
const { name } = require('./package');
const path = require('path');

const modeEntryMap = {
  multiple: './multiple.js',
  react: './render/ReactRender.jsx',
  vue: './render/VueRender.js',
  vue3: './render/Vue3Render.js',
  undefined: './render/VanillaRender.js',
}

const modeHTMLMap = {
  multiple: './multiple.html',
  react: './index.html',
  vue: './index.html',
  vue3: './index.html',
  undefined: './index.html',
}

module.exports = {
  entry: modeEntryMap[process.env.MODE],
  devtool: 'source-map',
  devServer: {
    open: true,
    port: '7099',
    clientLogLevel: 'warning',
    disableHostCheck: true,
    compress: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: true,
    overlay: { warnings: false, errors: true },
  },
  output: {
    publicPath: '/',
  },
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      vue: path.join(__dirname, 'node_modules/vue')
      // '@vue/composition-api': path.join(__dirname, 'node_modules/@vue/composition-api')
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-react-jsx'],
          },
        },
      },
      {
        test: /\.(le|c)ss$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: modeHTMLMap[process.env.MODE],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
    }),
  ],
};
