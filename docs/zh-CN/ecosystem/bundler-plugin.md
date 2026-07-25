# Webpack 插件

`@qiankunjs/bundler-plugin` 是专为 qiankun 微前端框架设计的 Webpack 插件。它简化并自动化了将微应用与 qiankun 集成所需的常见配置，确保正确的构建输出和运行时行为。

## 🚀 安装

### 使用 npm

```bash
npm install @qiankunjs/bundler-plugin --save-dev
```

### 使用 yarn

```bash
yarn add @qiankunjs/bundler-plugin --dev
```

### 使用 pnpm

```bash
pnpm add @qiankunjs/bundler-plugin --save-dev
```

## 🎯 功能特性

- **自动库配置**：设置正确的输出库名称和格式供 qiankun 使用
- **唯一 JSONP 函数**：确保唯一的 `jsonpFunction` 名称以防止微应用间冲突
- **浏览器兼容性**：将全局对象设置为 `window` 以确保在浏览器中正确执行
- **入口脚本标记**：自动为 HTML 中的主脚本标签添加 `entry` 属性
- **Webpack 4 & 5 支持**：兼容 Webpack 4 和 Webpack 5
- **零配置**：开箱即用，具有合理的默认设置

## 📋 系统要求

- **Webpack**：4.x 或 5.x
- **Node.js**：v14 或更高版本
- **package.json**：必须存在于项目根目录

## 🚀 快速开始

### 基本用法

```javascript
// webpack.config.js
const { QiankunPlugin } = require('@qiankunjs/bundler-plugin');

module.exports = {
  entry: './src/index.js',
  plugins: [
    new QiankunPlugin()
  ]
};
```

这个基本配置将：
- 使用 `package.json` 中的 `name` 字段作为库名称
- 自动为最后一个脚本标签添加 `entry` 属性
- 配置输出以供 qiankun 使用

### 自定义选项

```javascript
// webpack.config.js
const { QiankunPlugin } = require('@qiankunjs/bundler-plugin');

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

## 🎛️ 配置选项

### `packageName` (可选)

- **类型**：`string`
- **默认值**：`package.json` 中的 name 字段值
- **描述**：指定 qiankun 用于识别微应用的输出库名称

```javascript
new QiankunPlugin({
  packageName: 'my-custom-app-name'
})
```

### `entrySrcPattern` (可选)

- **类型**：`RegExp`
- **默认值**：`null`（将标记最后一个脚本标签）
- **描述**：用于匹配特定脚本标签以添加 `entry` 属性的正则表达式模式

```javascript
new QiankunPlugin({
  entrySrcPattern: /index\.[a-f0-9]+\.js$/
})
```

## 🔧 框架集成

### React 应用

```javascript
// webpack.config.js (Create React App with CRACO)
const { QiankunPlugin } = require('@qiankunjs/bundler-plugin');

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

### Vue 应用

```javascript
// vue.config.js
const { QiankunPlugin } = require('@qiankunjs/bundler-plugin');

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

### Angular 应用

```javascript
// custom-webpack.config.js
const { QiankunPlugin } = require('@qiankunjs/bundler-plugin');

module.exports = {
  plugins: [
    new QiankunPlugin({
      packageName: 'angular-micro-app'
    })
  ]
};
```

## 🏗️ 插件功能

### 1. 输出库配置

插件自动配置 webpack 输出以将微应用暴露为库：

**Webpack 4：**
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

**Webpack 5：**
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

### 2. 入口脚本标记

插件处理 HTML 文件并为适当的脚本标签添加 `entry` 属性：

**处理前：**
```html
<!DOCTYPE html>
<html>
<head>
  <title>我的微应用</title>
</head>
<body>
  <div id="app"></div>
  <script src="/static/js/main.12345.js"></script>
</body>
</html>
```

**处理后：**
```html
<!DOCTYPE html>
<html>
<head>
  <title>我的微应用</title>
</head>
<body>
  <div id="app"></div>
  <script entry src="/static/js/main.12345.js"></script>
</body>
</html>
```

## 🎨 高级配置

### 自定义入口模式匹配

对于具有复杂构建输出的应用，您可以精确指定哪个脚本应被标记为入口：

```javascript
new QiankunPlugin({
  // 匹配特定命名模式的脚本
  entrySrcPattern: /main\.[a-f0-9]{8}\.js$/
})
```

```javascript
new QiankunPlugin({
  // 匹配特定目录中的脚本
  entrySrcPattern: /\/js\/app\./
})
```

```javascript
new QiankunPlugin({
  // 匹配特定前缀的脚本
  entrySrcPattern: /^bundle\./
})
```

### 多个 HTML 文件

插件会处理项目中的所有 HTML 文件，对每个文件应用相同的入口标记逻辑。

### 开发与生产环境

```javascript
const isDev = process.env.NODE_ENV === 'development';

new QiankunPlugin({
  packageName: isDev ? 'my-app-dev' : 'my-app-prod',
  entrySrcPattern: isDev ? /main\.js$/ : /main\.[a-f0-9]+\.js$/
})
```

## ✅ 验证

### 检查库暴露

```bash
# 构建微应用
npm run build

# 检查主包是否包含库
grep -n "window\[.*your-app-name" dist/static/js/main.*.js
```

### 验证入口属性

```bash
# 检查 HTML 是否包含 entry 属性
grep -n "entry" dist/index.html
```

## 🐛 故障排除

### 匹配到多个脚本标签

**错误：** `The regular expression matched multiple script tags, please check your regex.`

**解决方案：** 使您的正则表达式模式更具体：

```javascript
// ❌ 太宽泛 - 匹配多个文件
entrySrcPattern: /\.js$/

// ✅ 更具体 - 只匹配主文件
entrySrcPattern: /main\.[a-f0-9]+\.js$/
```

### 没有匹配到脚本标签

**错误：** `The provided regular expression did not match any scripts.`

**解决方案：** 检查您的模式是否与实际生成的文件名匹配：

```javascript
// 检查实际生成的文件
console.log(fs.readdirSync('dist/static/js/'));

// 相应调整模式
entrySrcPattern: /app\.[a-f0-9]+\.js$/
```

### 库未暴露

**问题：** qiankun 找不到您的微应用

**解决方案：**

1. 检查 `package.json` 是否有有效的名称：
```json
{
  "name": "my-micro-app"
}
```

2. 在浏览器控制台中验证库是否已暴露：
```javascript
// 加载后应该存在
window['my-micro-app']
```

3. 确保插件已应用：
```javascript
// 确保插件在 plugins 数组中
plugins: [
  new QiankunPlugin()
]
```

### JSONP 函数冲突

**问题：** 多个微应用导致冲突

**解决方案：** 使用不同的包名称：

```javascript
// 应用 1
new QiankunPlugin({
  packageName: 'app-dashboard'
})

// 应用 2
new QiankunPlugin({
  packageName: 'app-settings'
})
```

## 🔧 集成示例

### Create React App (CRACO)

```javascript
// craco.config.js
const { QiankunPlugin } = require('@qiankunjs/bundler-plugin');

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
const { QiankunPlugin } = require('@qiankunjs/bundler-plugin');

module.exports = defineConfig({
  configureWebpack: {
    plugins: [
      new QiankunPlugin()
    ]
  },
  // 额外的 qiankun 特定配置
  devServer: {
    port: 8080,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
});
```

### Next.js (使用自定义 webpack 配置)

```javascript
// next.config.js
const { QiankunPlugin } = require('@qiankunjs/bundler-plugin');

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

### Vite (使用 vite-plugin-qiankun)

虽然此插件是为 Webpack 设计的，但对于 Vite 用户：

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

## 📊 性能考虑

### 包体积

插件对包的开销很小：
- 库包装器：~100 字节
- JSONP 函数自定义：~50 字节

### 构建时间

插件在 emit 阶段运行，通常增加：
- HTML 处理：< 100ms
- webpack 配置：< 50ms

### 运行时性能

- 无运行时性能影响
- 启用 qiankun 的高效加载机制
- 防止全局命名空间冲突

## 🔒 安全考虑

### 库命名

使用描述性、非冲突的库名称：

```javascript
// ✅ 好 - 特定且唯一
packageName: 'company-dashboard-app'

// ❌ 坏 - 太通用，可能冲突
packageName: 'app'
```

### CORS 配置

确保您的微应用使用适当的 CORS 头提供服务：

```javascript
// 开发服务器配置
devServer: {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
  }
}
```

## 📚 最佳实践

### 1. 一致的命名约定

```javascript
// 跨环境使用一致的命名
const appName = process.env.NODE_ENV === 'production' 
  ? 'company-app-prod' 
  : 'company-app-dev';

new QiankunPlugin({
  packageName: appName
})
```

### 2. 环境特定的模式

```javascript
// 不同环境使用不同模式
const entrySrcPattern = process.env.NODE_ENV === 'production'
  ? /main\.[a-f0-9]+\.js$/  // 生产环境使用哈希
  : /main\.js$/;            // 开发环境使用简单名称

new QiankunPlugin({
  entrySrcPattern
})
```

### 3. 验证配置

```javascript
// 在构建过程中添加验证
const pkg = require('./package.json');

if (!pkg.name) {
  throw new Error('package.json 必须有 name 字段供 qiankun 使用');
}

new QiankunPlugin({
  packageName: pkg.name
})
```

### 4. 测试集成

```javascript
// 测试您的配置
describe('Qiankun 集成', () => {
  it('应该在 window 上暴露库', () => {
    expect(window[process.env.REACT_APP_NAME]).toBeDefined();
  });

  it('应该有入口脚本标记', () => {
    const entryScript = document.querySelector('script[entry]');
    expect(entryScript).toBeTruthy();
  });
});
```

## 🔗 相关文档

- [核心 API](/zh-CN/api/) - qiankun 核心 API
- [Create Qiankun](/zh-CN/ecosystem/create-qiankun) - 项目脚手架工具
- [React 绑定](/zh-CN/ecosystem/react) - React UI 绑定
- [Vue 绑定](/zh-CN/ecosystem/vue) - Vue UI 绑定

## 📈 迁移指南

### 从手动配置迁移

如果您之前手动配置 webpack for qiankun：

**之前：**
```javascript
module.exports = {
  output: {
    library: 'myApp',
    libraryTarget: 'window',
    jsonpFunction: 'webpackJsonp_myApp'
  }
};
```

**之后：**
```javascript
const { QiankunPlugin } = require('@qiankunjs/bundler-plugin');

module.exports = {
  plugins: [
    new QiankunPlugin({
      packageName: 'myApp'
    })
  ]
};
```

### 从其他微前端解决方案迁移

该插件处理 qiankun 所需的 webpack 特定配置，消除了手动库设置和入口脚本标记的需要。

## 🤝 贡献

发现问题或想要贡献？查看 [GitHub 仓库](https://github.com/umijs/qiankun) 并贡献到 `packages/webpack-plugin` 目录。 