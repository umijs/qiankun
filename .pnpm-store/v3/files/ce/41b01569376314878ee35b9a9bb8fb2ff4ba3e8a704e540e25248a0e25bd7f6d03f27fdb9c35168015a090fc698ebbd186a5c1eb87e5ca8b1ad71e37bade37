# @umijs/case-sensitive-paths-webpack-plugin

[![NPM version](https://img.shields.io/npm/v/@umijs/case-sensitive-paths-webpack-plugin.svg?style=flat)](https://npmjs.org/package/@umijs/case-sensitive-paths-webpack-plugin)
[![NPM downloads](http://img.shields.io/npm/dm/@umijs/case-sensitive-paths-webpack-plugin.svg?style=flat)](https://npmjs.org/package/@umijs/case-sensitive-paths-webpack-plugin)
[![codecov](https://codecov.io/gh/umijs/case-sensitive-paths-webpack-plugin/branch/master/graph/badge.svg)](https://codecov.io/gh/umijs/case-sensitive-paths-webpack-plugin)
[![GitHub Actions status](https://github.com/umijs/case-sensitive-paths-webpack-plugin/workflows/CI/badge.svg)](https://github.com/umijs/case-sensitive-paths-webpack-plugin)

A webpack plugin to enforce case-sensitive paths when resolving module, similar to the well-known [case-sensitive-paths-webpack-plugin](https://github.com/Urthen/case-sensitive-paths-webpack-plugin) project.

The difference is:

1. Only compatible with Webpack 4+ & Node.js 14+
3. Ignore paths outside of current project
2. Ignore `node_modules` resources
4. Ignore `asset/inline` resources
5. Check each level paths asynchronously & in parallel
6. Higher cache utilization

So this plugin has better performance than it.

## Usage

Install:

```bash
$ npm i @umijs/case-sensitive-paths-webpack-plugin --save-dev
```

Configure in `webpack.config.js`:

```js
const CaseSensitivePathsPlugin = require('@umijs/case-sensitive-paths-webpack-plugin');

module.exports = {
  plugins: [
    new CaseSensitivePathsPlugin(),
  ],
};
```

That's all.

## Thanks

This project is inspired by [case-sensitive-paths-webpack-plugin](https://github.com/Urthen/case-sensitive-paths-webpack-plugin), thanks!

## LICENSE

[MIT](./LICENSE)
