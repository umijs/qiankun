# @qiankunjs/webpack-plugin

`@qiankunjs/webpack-plugin` 是一个为 [qiankun](https://github.com/umijs/qiankun) 微前端框架设计的 Webpack 插件，用于简化和自动化与 qiankun 集成的一些常见配置。

## 功能

- 自动设置输出库的名称和格式。
- 确保 `jsonpFunction` 名称的唯一性。
- 设置全局对象为 `window`，确保库可以在浏览器中运行。
- 自动为 html 中的入口script标签加上entry标记

## 安装

使用 npm:

```bash
npm install @qiankunjs/webpack-plugin --save-dev
```

或使用 yarn:

```bash
yarn add @qiankunjs/webpack-plugin --dev
```

## 使用

在您的 `webpack.config.js` 或其他配置文件中：

```javascript
const QiankunPlugin = require('@qiankunjs/webpack-plugin');

module.exports = {
  // ... 其他配置
  plugins: [
    new QiankunPlugin({
      packageName: 'optionalPackageName',  // 可选，如果不提供，将使用 package.json 中的名称
    })
  ]
};
```

## 选项

- `packageName`: 指定输出库的名称。如果未提供，将使用 `package.json` 中的名称。

## 贡献

欢迎任何形式的贡献！请提交 PR 或开启 issue 讨论。

## 许可证

MIT

