# @qiankunjs/bundler-plugin

`@qiankunjs/bundler-plugin` 是为 [qiankun](https://github.com/umijs/qiankun) 微前端框架设计的打包工具插件集。当前支持 Webpack (4 & 5)，未来计划支持 Vite、Turbopack 等其他打包工具。

## 安装

使用 npm:

```bash
npm install @qiankunjs/bundler-plugin --save-dev
```

或使用 yarn:

```bash
yarn add @qiankunjs/bundler-plugin --dev
```

## Webpack 插件

### 功能

- 自动设置输出库的名称和格式
- 确保 `jsonpFunction`/`chunkLoadingGlobal` 名称的唯一性
- 设置全局对象为 `window`，确保库可以在浏览器中运行
- 自动为 HTML 中的入口 script 标签加上 entry 标记
- 同时支持 Webpack 4 和 Webpack 5

### 使用

在您的 `webpack.config.js` 或其他配置文件中：

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

### 选项

- `packageName`: 指定输出库的名称。如果未提供，将使用 `package.json` 中的名称。

### 入口脚本检测

插件会自动检测并标记 HTML 中的入口脚本：

1. 使用 webpack 的 `compilation.entrypoints` API 识别入口 chunk
2. 单入口构建：标记主入口 chunk 的脚本
3. 多入口构建：根据 HTML 文件名匹配对应的 entrypoint
4. 如果自动检测失败，回退到最后一个 script 标签

## 贡献

欢迎任何形式的贡献！请提交 PR 或开启 issue 讨论。

## 许可证

MIT
