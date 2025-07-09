# Webpack Plugin

The `@qiankunjs/webpack-plugin` is a Webpack plugin specifically designed for the qiankun micro-frontend framework. It simplifies and automates common configurations required for integrating micro applications with qiankun, ensuring proper build output and runtime behavior.

## 🚀 Installation

### Using npm

```bash
npm install @qiankunjs/webpack-plugin --save-dev
```

### Using yarn

```bash
yarn add @qiankunjs/webpack-plugin --dev
```

### Using pnpm

```bash
pnpm add @qiankunjs/webpack-plugin --save-dev
```

## 🎯 Features

- **Automatic Library Configuration**: Sets the correct output library name and format for qiankun consumption
- **Unique JSONP Function**: Ensures unique `jsonpFunction` names to prevent conflicts between micro applications
- **Browser Compatibility**: Sets global object to `window` for proper browser execution
- **Entry Script Marking**: Automatically adds `entry` attribute to the main script tag in HTML
- **Webpack 4 & 5 Support**: Compatible with both Webpack 4 and Webpack 5
- **Zero Configuration**: Works out of the box with sensible defaults

## 📋 Requirements

- **Webpack**: 4.x or 5.x
- **Node.js**: v14 or higher
- **package.json**: Must exist in project root

## 🚀 Quick Start

### Basic Usage

```javascript
// webpack.config.js
const { QiankunPlugin } = require('@qiankunjs/webpack-plugin');

module.exports = {
  entry: './src/index.js',
  plugins: [
    new QiankunPlugin()
  ]
};
```

This basic configuration will:
- Use the `name` field from your `package.json` as the library name
- Automatically mark the last script tag with the `entry` attribute
- Configure the output for qiankun consumption

### With Custom Options

```javascript
// webpack.config.js
const { QiankunPlugin } = require('@qiankunjs/webpack-plugin');

module.exports = {
  entry: './src/index.js',
  plugins: [
    new QiankunPlugin({
      packageName: 'my-micro-app',
      entrySrcPattern: /main\.[a-f0-9]+\.js$/
    })
  ]
};
```

## 🎛️ Configuration Options

### `packageName` (optional)

- **Type**: `string`
- **Default**: Value from `package.json` name field
- **Description**: Specifies the name of the output library that qiankun will use to identify your micro application

```javascript
new QiankunPlugin({
  packageName: 'my-custom-app-name'
})
```

### `entrySrcPattern` (optional)

- **Type**: `RegExp`
- **Default**: `null` (will mark the last script tag)
- **Description**: A regular expression pattern to match specific script tags for adding the `entry` attribute

```javascript
new QiankunPlugin({
  entrySrcPattern: /index\.[a-f0-9]+\.js$/
})
```

## 🔧 Framework Integration

### React Applications

```javascript
// webpack.config.js (Create React App with CRACO)
const { QiankunPlugin } = require('@qiankunjs/webpack-plugin');

module.exports = {
  webpack: {
    plugins: {
      add: [
        new QiankunPlugin({
          packageName: 'react-micro-app'
        })
      ]
    }
  }
};
```

### Vue Applications

```javascript
// vue.config.js
const { QiankunPlugin } = require('@qiankunjs/webpack-plugin');

module.exports = {
  configureWebpack: {
    plugins: [
      new QiankunPlugin({
        packageName: 'vue-micro-app'
      })
    ]
  }
};
```

### Angular Applications

```javascript
// custom-webpack.config.js
const { QiankunPlugin } = require('@qiankunjs/webpack-plugin');

module.exports = {
  plugins: [
    new QiankunPlugin({
      packageName: 'angular-micro-app'
    })
  ]
};
```

## 🏗️ What the Plugin Does

### 1. Output Library Configuration

The plugin automatically configures the webpack output to expose your micro application as a library:

**Webpack 4:**
```javascript
{
  output: {
    library: 'your-app-name',
    libraryTarget: 'window',
    jsonpFunction: 'webpackJsonp_your-app-name',
    globalObject: 'window',
    chunkLoadingGlobal: 'webpackJsonp_your-app-name'
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
    },
    jsonpFunction: 'webpackJsonp_your-app-name',
    globalObject: 'window',
    chunkLoadingGlobal: 'webpackJsonp_your-app-name'
  }
}
```

### 2. Entry Script Marking

The plugin processes your HTML files and adds the `entry` attribute to the appropriate script tag:

**Before:**
```html
<!DOCTYPE html>
<html>
<head>
  <title>My Micro App</title>
</head>
<body>
  <div id="app"></div>
  <script src="/static/js/main.12345.js"></script>
</body>
</html>
```

**After:**
```html
<!DOCTYPE html>
<html>
<head>
  <title>My Micro App</title>
</head>
<body>
  <div id="app"></div>
  <script entry src="/static/js/main.12345.js"></script>
</body>
</html>
```

## 🎨 Advanced Configurations

### Custom Entry Pattern Matching

For applications with complex build outputs, you can specify exactly which script should be marked as the entry:

```javascript
new QiankunPlugin({
  // Match scripts with specific naming pattern
  entrySrcPattern: /main\.[a-f0-9]{8}\.js$/
})
```

```javascript
new QiankunPlugin({
  // Match scripts in specific directory
  entrySrcPattern: /\/js\/app\./
})
```

```javascript
new QiankunPlugin({
  // Match scripts with specific prefix
  entrySrcPattern: /^bundle\./
})
```

### Multiple HTML Files

If your application generates multiple HTML files, the plugin will process all of them:

```javascript
// webpack.config.js with multiple entries
module.exports = {
  entry: {
    main: './src/main.js',
    admin: './src/admin.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      chunks: ['main'],
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      chunks: ['admin'], 
      filename: 'admin.html'
    }),
    new QiankunPlugin({
      entrySrcPattern: /main\./  // Only mark main scripts
    })
  ]
};
```

### Environment-specific Configuration

```javascript
// webpack.config.js
const { QiankunPlugin } = require('@qiankunjs/webpack-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  plugins: [
    new QiankunPlugin({
      packageName: isDevelopment ? 'dev-micro-app' : 'micro-app',
      entrySrcPattern: isDevelopment ? /index\.js$/ : /index\.[a-f0-9]+\.js$/
    })
  ]
};
```

## 🔍 Build Output Analysis

### Checking the Generated Library

After building with the plugin, you can verify the output:

```bash
# Build your micro application
npm run build

# Check the main bundle contains your library
grep -n "window\[.*your-app-name" dist/static/js/main.*.js
```

### Verifying Entry Attribute

```bash
# Check HTML contains entry attribute
grep -n "entry" dist/index.html
```

## 🐛 Troubleshooting

### Multiple Script Tags Matched

**Error:** `The regular expression matched multiple script tags, please check your regex.`

**Solution:** Make your regex pattern more specific:

```javascript
// ❌ Too broad - matches multiple files
entrySrcPattern: /\.js$/

// ✅ More specific - matches only main files
entrySrcPattern: /main\.[a-f0-9]+\.js$/
```

### No Script Tags Matched

**Error:** `The provided regular expression did not match any scripts.`

**Solution:** Check your pattern against the actual generated filenames:

```javascript
// Check what files are actually generated
console.log(fs.readdirSync('dist/static/js/'));

// Adjust pattern accordingly
entrySrcPattern: /app\.[a-f0-9]+\.js$/
```

### Library Not Exposed

**Issue:** qiankun can't find your micro application

**Solutions:**

1. Check `package.json` has a valid name:
```json
{
  "name": "my-micro-app"
}
```

2. Verify the library is exposed in browser console:
```javascript
// Should exist after loading
window['my-micro-app']
```

3. Ensure the plugin is applied:
```javascript
// Make sure plugin is in the plugins array
plugins: [
  new QiankunPlugin()
]
```

### JSONP Function Conflicts

**Issue:** Multiple micro apps causing conflicts

**Solution:** Use different package names:

```javascript
// App 1
new QiankunPlugin({
  packageName: 'app-dashboard'
})

// App 2
new QiankunPlugin({
  packageName: 'app-settings'
})
```

## 🔧 Integration Examples

### Create React App (CRACO)

```javascript
// craco.config.js
const { QiankunPlugin } = require('@qiankunjs/webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.plugins.push(
        new QiankunPlugin({
          packageName: process.env.REACT_APP_NAME || 'react-app'
        })
      );
      return webpackConfig;
    }
  }
};
```

### Vue CLI

```javascript
// vue.config.js
const { defineConfig } = require('@vue/cli-service');
const { QiankunPlugin } = require('@qiankunjs/webpack-plugin');

module.exports = defineConfig({
  configureWebpack: {
    plugins: [
      new QiankunPlugin()
    ]
  },
  // Additional qiankun-specific configuration
  devServer: {
    port: 8080,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
});
```

### Next.js (with custom webpack config)

```javascript
// next.config.js
const { QiankunPlugin } = require('@qiankunjs/webpack-plugin');

module.exports = {
  webpack: (config, { dev, isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new QiankunPlugin({
          packageName: 'nextjs-micro-app'
        })
      );
    }
    return config;
  }
};
```

### Vite (with vite-plugin-qiankun)

While this plugin is designed for Webpack, for Vite users:

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import qiankun from 'vite-plugin-qiankun';

export default defineConfig({
  plugins: [
    qiankun('my-vite-app', {
      useDevMode: true
    })
  ]
});
```

## 📊 Performance Considerations

### Bundle Size

The plugin adds minimal overhead to your bundle:
- Library wrapper: ~100 bytes
- JSONP function customization: ~50 bytes

### Build Time

The plugin runs during the emit phase and typically adds:
- < 100ms for HTML processing
- < 50ms for webpack configuration

### Runtime Performance

- No runtime performance impact
- Enables qiankun's efficient loading mechanisms
- Prevents global namespace conflicts

## 🔒 Security Considerations

### Library Naming

Use descriptive, non-conflicting library names:

```javascript
// ✅ Good - specific and unique
packageName: 'company-dashboard-app'

// ❌ Bad - too generic, might conflict
packageName: 'app'
```

### CORS Configuration

Ensure your micro applications are served with proper CORS headers:

```javascript
// Development server configuration
devServer: {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
  }
}
```

## 📚 Best Practices

### 1. Consistent Naming Convention

```javascript
// Use consistent naming across environments
const appName = process.env.NODE_ENV === 'production' 
  ? 'company-app-prod' 
  : 'company-app-dev';

new QiankunPlugin({
  packageName: appName
})
```

### 2. Environment-specific Patterns

```javascript
// Different patterns for different environments
const entrySrcPattern = process.env.NODE_ENV === 'production'
  ? /main\.[a-f0-9]+\.js$/  // Hashed in production
  : /main\.js$/;            // Simple in development

new QiankunPlugin({
  entrySrcPattern
})
```

### 3. Verify Configuration

```javascript
// Add verification in your build process
const pkg = require('./package.json');

if (!pkg.name) {
  throw new Error('package.json must have a name field for qiankun');
}

new QiankunPlugin({
  packageName: pkg.name
})
```

### 4. Testing Integration

```javascript
// Test your configuration
describe('Qiankun Integration', () => {
  it('should expose library on window', () => {
    expect(window[process.env.REACT_APP_NAME]).toBeDefined();
  });

  it('should have entry script marked', () => {
    const entryScript = document.querySelector('script[entry]');
    expect(entryScript).toBeTruthy();
  });
});
```

## 🔗 Related Documentation

- [Core APIs](/api/) - qiankun core APIs
- [Create Qiankun](/ecosystem/create-qiankun) - Project scaffolding tool
- [React Bindings](/ecosystem/react) - React UI bindings
- [Vue Bindings](/ecosystem/vue) - Vue UI bindings

## 📈 Migration Guide

### From Manual Configuration

If you were manually configuring webpack for qiankun:

**Before:**
```javascript
module.exports = {
  output: {
    library: 'myApp',
    libraryTarget: 'window',
    jsonpFunction: 'webpackJsonp_myApp'
  }
};
```

**After:**
```javascript
const { QiankunPlugin } = require('@qiankunjs/webpack-plugin');

module.exports = {
  plugins: [
    new QiankunPlugin({
      packageName: 'myApp'
    })
  ]
};
```

### From Other Micro-frontend Solutions

The plugin handles the webpack-specific configurations needed for qiankun, eliminating the need for manual library setup and entry script marking.

## 🤝 Contributing

Found an issue or want to contribute? Check out the [GitHub repository](https://github.com/umijs/qiankun) and contribute to the `packages/webpack-plugin` directory. 