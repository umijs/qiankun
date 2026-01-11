# @qiankunjs/bundler-plugin

Bundler plugins for the [qiankun](https://github.com/umijs/qiankun) micro-frontend framework. Currently supports Webpack (4 & 5), with plans to support other bundlers like Vite and Turbopack in the future.

## Installation

Using npm:

```bash
npm install @qiankunjs/bundler-plugin --save-dev
```

Or using yarn:

```bash
yarn add @qiankunjs/bundler-plugin --dev
```

## Webpack Plugin

### Features

- Automatically sets the name and format of the output library
- Ensures the uniqueness of the `jsonpFunction`/`chunkLoadingGlobal` name
- Sets the global object to `window`, ensuring the library can run in the browser
- Automatically adds an entry marker to the entry script tag in HTML
- Supports both Webpack 4 and Webpack 5

### Usage

In your `webpack.config.js` or other configuration files:

```javascript
const { QiankunWebpackPlugin } = require('@qiankunjs/bundler-plugin');

module.exports = {
  plugins: [
    new QiankunWebpackPlugin({
      packageName: 'optionalPackageName',
    }),
  ],
};
```

### Options

- `packageName`: Specifies the name of the output library. If not provided, the name from `package.json` will be used.

### Entry Script Detection

The plugin automatically detects and marks the entry script in your HTML:

1. Uses webpack's `compilation.entrypoints` API to identify entry chunks
2. For single entry builds: marks the main entry chunk's script
3. For multi-entry builds: matches HTML filename to entrypoint name
4. Falls back to the last script tag if automatic detection fails

## Contributing

Any form of contribution is welcome! Please submit PRs or open issues for discussion.

## License

MIT
