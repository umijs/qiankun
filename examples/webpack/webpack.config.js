const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { QiankunWebpackPlugin } = require('@qiankunjs/bundler-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  // `--env deployBase=/apps/webpack/` is how scripts/build-examples-site.mjs pins this app to its
  // path on the deployed site. Unset (dev, plain builds) it keeps webpack's runtime-derived
  // publicPath, which is what the dev server at the origin root wants.
  const deployBase = env?.deployBase;

  return {
    entry: './src/index.tsx',
    output: {
      publicPath: deployBase || 'auto',
      clean: true,
      filename: isProduction ? '[name].[contenthash:8].js' : '[name].js',
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                  },
                },
                target: 'es2022',
              },
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: './src/index.html' }),
      new QiankunWebpackPlugin(),
      new webpack.DefinePlugin({
        __MICRO_APP_ENTRY__: JSON.stringify(deployBase || '//localhost:7102'),
      }),
    ],
    devServer: {
      port: 7102,
      headers: { 'Access-Control-Allow-Origin': '*' },
      allowedHosts: 'all',
      hot: true,
    },
    devtool: isProduction ? false : 'cheap-module-source-map',
  };
};
