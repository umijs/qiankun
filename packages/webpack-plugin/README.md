# @qiankunjs/webpack-plugin

`@qiankunjs/webpack-plugin` is a Webpack plugin designed for the [qiankun](https://github.com/umijs/qiankun) micro-frontend framework, aiming to simplify and automate some common configurations when integrating with qiankun.

## Features

- Automatically sets the name and format of the output library.
- Ensures the uniqueness of the `jsonpFunction` name (webpack 4) or `chunkLoadingGlobal` (webpack 5).
- Sets the global object to `window`, ensuring the library can run in the browser.
- Automatically adds an entry marker to the entry script tag in HTML.
- Full webpack 4 and webpack 5 compatibility with proper version detection.
- Robust error handling and validation.
- Configurable options for flexibility.

## Installation

Using npm:

```bash
npm install @qiankunjs/webpack-plugin --save-dev
```

Or using yarn:

```bash
yarn add @qiankunjs/webpack-plugin --dev
```

## Usage

In your `webpack.config.js` or other configuration files:

```javascript
const { QiankunPlugin } = require('@qiankunjs/webpack-plugin');

module.exports = {
  // ... other configurations
  plugins: [
    new QiankunPlugin({
      packageName: 'optionalPackageName', // Optional, if not provided, the name from package.json will be used
      entrySrcPattern: /main\.js$/g, // Optional, a regex pattern to match specific script tags for adding the 'entry' attribute
      entryAttributeName: 'entry', // Optional, custom attribute name for entry scripts (default: 'entry')
      chunkLoadingGlobalPrefix: 'webpackJsonp_', // Optional, custom prefix for chunk loading global (default: 'webpackJsonp_')
    }),
  ],
};
```

## Options

- `packageName` (string, optional): Specifies the name of the output library. If not provided, the name from `package.json` will be used.
- `entrySrcPattern` (RegExp, optional): A regex pattern to match specific script tags for adding the entry attribute. If not specified, the last script tag will be marked as entry.
- `entryAttributeName` (string, optional): Custom attribute name for marking entry scripts. Defaults to `'entry'`.
- `chunkLoadingGlobalPrefix` (string, optional): Custom prefix for the chunk loading global variable. Defaults to `'webpackJsonp_'`.

## Webpack Version Compatibility

This plugin automatically detects the webpack version and applies appropriate configurations:

- **Webpack 4**: Uses `library`, `libraryTarget`, and `jsonpFunction`
- **Webpack 5**: Uses modern `library.type` and `chunkLoadingGlobal` configurations

## Error Handling

The plugin includes robust error handling for common issues:

- Missing or invalid `package.json`
- Invalid package names
- Regex pattern validation
- Webpack configuration validation
- HTML processing errors

All errors are logged with descriptive messages to help with debugging.

## Examples

### Basic Usage

```javascript
new QiankunPlugin();
```

### With Custom Package Name

```javascript
new QiankunPlugin({
  packageName: 'my-micro-app',
});
```

### With Pattern Matching

```javascript
new QiankunPlugin({
  entrySrcPattern: /app\.[a-z0-9]+\.js$/,
});
```

### Full Configuration

```javascript
new QiankunPlugin({
  packageName: 'my-micro-app',
  entrySrcPattern: /main\.js$/,
  entryAttributeName: 'qiankun-entry',
  chunkLoadingGlobalPrefix: 'myApp_',
});
```

## Contributing

Any form of contribution is welcome! Please submit PRs or open issues for discussion.

## License

MIT
