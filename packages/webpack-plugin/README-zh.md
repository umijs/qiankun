# @qiankunjs/webpack-plugin

`@qiankunjs/webpack-plugin` 是专为 [qiankun](https://github.com/umijs/qiankun) 微前端框架设计的 Webpack 插件，旨在简化和自动化与 qiankun 集成时的一些常见配置。

## 功能特性

- 自动设置输出库的名称和格式。
- 确保 `jsonpFunction` 名称（webpack 4）或 `chunkLoadingGlobal`（webpack 5）的唯一性。
- 将全局对象设置为 `window`，确保库能在浏览器中运行。
- 自动为 HTML 中的入口脚本标签添加入口标记。
- 完整的 webpack 4 和 webpack 5 兼容性，具有正确的版本检测。
- 强健的错误处理和验证。
- 可配置选项提供灵活性。

## 安装

使用 npm：

```bash
npm install @qiankunjs/webpack-plugin --save-dev
```

或使用 yarn：

```bash
yarn add @qiankunjs/webpack-plugin --dev
```

## 使用方法

在您的 `webpack.config.js` 或其他配置文件中：

```javascript
const { QiankunPlugin } = require('@qiankunjs/webpack-plugin');

module.exports = {
  // ... 其他配置
  plugins: [
    new QiankunPlugin({
      packageName: '可选的包名', // 可选，如果未提供，将使用 package.json 中的 name
      entrySrcPattern: /main\.js$/g, // 可选，用于匹配特定脚本标签的正则表达式
      chunkLoadingGlobalPrefix: 'myPrefix_', // 可选，块加载全局变量的前缀
    }),
  ],
};
```

### 配置选项

- `packageName` (string, 可选): 包的名称。如果未提供，将使用 `package.json` 中的 `name` 字段。
- `entrySrcPattern` (RegExp, 可选): 用于匹配应该标记为入口点的特定脚本标签的正则表达式。如果未提供，插件将标记最后一个脚本标签为入口。
- `chunkLoadingGlobalPrefix` (string, 可选): 块加载全局变量的前缀。默认为 `'webpackJsonp_'`。

**注意**: 插件会自动为匹配的脚本标签添加 `entry` 属性，以将其标记为 qiankun 的入口点。

## Webpack 版本兼容性

此插件会自动检测 webpack 版本并应用适当的配置：

- **Webpack 4**: 使用 `library`、`libraryTarget` 和 `jsonpFunction`
- **Webpack 5**: 使用现代的 `library.type` 和 `chunkLoadingGlobal` 配置

## 错误处理

插件包含针对常见问题的强健错误处理：

- 缺失或无效的 `package.json`
- 无效的包名
- 正则表达式模式验证
- Webpack 配置验证
- HTML 处理错误

所有错误都会记录详细的消息以帮助调试。

## 示例

### 基本用法

```javascript
new QiankunPlugin();
```

### 使用自定义包名

```javascript
new QiankunPlugin({
  packageName: 'my-micro-app',
});
```

### 使用模式匹配

```javascript
new QiankunPlugin({
  entrySrcPattern: /app\.[a-z0-9]+\.js$/,
});
```

### 完整配置

```javascript
new QiankunPlugin({
  packageName: 'my-micro-app',
  entrySrcPattern: /main\.js$/,
  entryAttributeName: 'qiankun-entry',
  chunkLoadingGlobalPrefix: 'myApp_',
});
```

## 贡献

欢迎任何形式的贡献！请提交 PR 或开启 issue 进行讨论。

## 许可证

MIT
