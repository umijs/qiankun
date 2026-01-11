# Bundler Plugin

The `@qiankunjs/bundler-plugin` provides bundler plugins for the qiankun micro-frontend framework. Currently it supports Webpack (4 & 5), with plans to support other bundlers like Vite and Turbopack in the future.

## Installation

```bash
npm install @qiankunjs/bundler-plugin --save-dev
# or
yarn add @qiankunjs/bundler-plugin --dev
# or
pnpm add @qiankunjs/bundler-plugin --save-dev
```

## Webpack Plugin

### Features

- **Automatic Library Configuration**: Sets the correct output library name and format for qiankun consumption
- **Unique JSONP Function**: Ensures unique `jsonpFunction`/`chunkLoadingGlobal` names to prevent conflicts between micro applications
- **Browser Compatibility**: Sets global object to `window` for proper browser execution
- **Entry Script Marking**: Automatically adds `entry` attribute to the main entry script tag in HTML using webpack entrypoints
- **Webpack 4 & 5 Support**: Compatible with both Webpack 4 and Webpack 5
- **Zero Configuration**: Works out of the box with sensible defaults

### Basic Usage

```javascript
// webpack.config.js
const { QiankunWebpackPlugin } = require('@qiankunjs/bundler-plugin');

module.exports = {
  entry: './src/index.js',
  plugins: [
    new QiankunWebpackPlugin()
  ]
};
```

This basic configuration will:
- Use the `name` field from your `package.json` as the library name
- Automatically mark the entry script tag with the `entry` attribute (based on webpack entrypoints)
- Configure the output for qiankun consumption

### With Custom Options

```javascript
// webpack.config.js
const { QiankunWebpackPlugin } = require('@qiankunjs/bundler-plugin');

module.exports = {
  entry: './src/index.js',
  plugins: [
    new QiankunWebpackPlugin({
      packageName: 'my-micro-app',
    })
  ]
};
```

### Configuration Options

#### `packageName` (optional)

- **Type**: `string`
- **Default**: Value from `package.json` name field
- **Description**: Specifies the name of the output library that qiankun will use to identify your micro application

### Framework Integration

#### React (CRACO)

```javascript
// craco.config.js
const { QiankunWebpackPlugin } = require('@qiankunjs/bundler-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.plugins.push(
        new QiankunWebpackPlugin({
          packageName: process.env.REACT_APP_NAME || 'react-app'
        })
      );
      return webpackConfig;
    }
  }
};
```

#### Vue CLI

```javascript
// vue.config.js
const { QiankunWebpackPlugin } = require('@qiankunjs/bundler-plugin');

module.exports = {
  configureWebpack: {
    plugins: [
      new QiankunWebpackPlugin()
    ]
  },
  devServer: {
    port: 8080,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
};
```

#### Angular

```javascript
// custom-webpack.config.js
const { QiankunWebpackPlugin } = require('@qiankunjs/bundler-plugin');

module.exports = {
  plugins: [
    new QiankunWebpackPlugin({
      packageName: 'angular-micro-app'
    })
  ]
};
```

### What the Plugin Does

#### 1. Output Library Configuration

**Webpack 4:**
```javascript
{
  output: {
    library: 'your-app-name',
    libraryTarget: 'window',
    jsonpFunction: 'webpackJsonp_your-app-name',
    globalObject: 'window'
  }
}
```

**Webpack 5:**
```javascript
{
  output: {
    library: {
      name: 'your-app-name',
      type: 'window'
    }
  }
}
```

#### 2. Entry Script Marking

The plugin uses webpack entrypoints to identify the main entry chunk and marks its script tag with `entry`. If multiple entrypoints exist, it matches by HTML filename; otherwise it falls back to the first entrypoint. If detection fails, it marks the last injected script.

### Troubleshooting

- **Library Not Exposed**: Ensure `package.json` has a valid name field, or explicitly set `packageName` in plugin options.
- **Entry Attribute Missing**: Verify `html-webpack-plugin` is present and the plugin is listed after it in `plugins`. The plugin relies on webpack `compilation.entrypoints` to find the main chunk.

## Related Documentation

- [Core APIs](/api/) - qiankun core APIs
- [Create Qiankun](/ecosystem/create-qiankun) - Project scaffolding tool
- [React Bindings](/ecosystem/react) - React UI bindings
- [Vue Bindings](/ecosystem/vue) - Vue UI bindings

## Contributing

Found an issue or want to contribute? Check out the [GitHub repository](https://github.com/umijs/qiankun) and contribute to the `packages/bundler-plugin` directory.
