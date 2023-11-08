# @qiankunjs/webpack-plugin

`@qiankunjs/webpack-plugin` is a Webpack plugin designed for the [qiankun](https://github.com/umijs/qiankun) micro-frontend framework, aiming to simplify and automate some common configurations when integrating with qiankun.

## Features

- Automatically sets the name and format of the output library.
- Ensures the uniqueness of the `jsonpFunction` name.
- Sets the global object to `window`, ensuring the library can run in the browser.
- Automatically adds an entry marker to the entry script tag in HTML.

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
const QiankunPlugin = require('@qiankunjs/webpack-plugin');

module.exports = {
  // ... other configurations
  plugins: [
    new QiankunPlugin({
      packageName: 'optionalPackageName', // Optional, if not provided, the name from package.json will be used
      webpackVersion: '5', // Optional, specify the major version of webpack being used. If not provided, the version from package.json will be used by default.
      entrySrcPattern: /<script[^>]*src="app.*\.js"[^>]*><\/script>/g, // Optional, a regex pattern to match specific script tags for adding the 'entry' attribute.    Defaults to the last script tag if not specified.
    }),
  ],
};
```

## Options

- `packageName`: Specifies the name of the output library. If not provided, the name from `package.json` will be used.

## Contributing

Any form of contribution is welcome! Please submit PRs or open issues for discussion.

## License

MIT
