# @qiankunjs/bundler-plugin

`@qiankunjs/bundler-plugin` 用于生成 qiankun 可识别的微应用 HTML 入口。主应用无需安装该插件。

该包同时提供 Vite 和 Webpack 插件。使用时必须选择对应的导入路径，插件不会自动判断项目所用的构建工具。

## 安装

```bash
npm install --save-dev @qiankunjs/bundler-plugin@rc
```

插件支持 Vite 5 及以上版本，以及 Webpack 4 和 Webpack 5。该包将 Vite 和 Webpack 声明为可选对等依赖（`peerDependencies`），项目只需安装实际使用的构建工具。

## 导出

| 导入路径 | 导出 | 用途 |
| --- | --- | --- |
| `@qiankunjs/bundler-plugin/vite` | `qiankun`（具名和默认导出） | Vite 插件 |
| `@qiankunjs/bundler-plugin` | `QiankunWebpackPlugin`（具名和默认导出） | Webpack 插件 |
| `@qiankunjs/bundler-plugin/webpack` | `QiankunWebpackPlugin`（具名和默认导出） | Webpack 专用子路径 |

## Vite

Vite 插件不接收参数：

```ts
import { qiankun } from '@qiankunjs/bundler-plugin/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [qiankun()],
  server: { port: 7101, strictPort: true },
});
```

插件会执行以下处理：

- 为 Vite 开发服务器和预览服务器配置允许跨源加载的响应头；
- 在构建产出的 HTML 中标记入口模块脚本。

插件不接收选项，也不会改变微应用的生命周期代码。入口模块仍须导出 `bootstrap`、`mount` 和 `unmount`。

开发环境的 CORS 配置不会替代生产服务器配置。部署后的 HTML、模块和其他资源仍须由实际服务器或 CDN 返回正确的 CORS 与 MIME 响应头。

完整接入步骤见[接入 Vite 应用](/zh-CN/cookbook/prepare-a-vite-app)。

## Webpack

Webpack 插件需要配合 `html-webpack-plugin` 生成 HTML 入口：

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { QiankunWebpackPlugin } = require('@qiankunjs/bundler-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new QiankunWebpackPlugin({ packageName: 'sub-app' }),
  ],
};
```

```ts
interface QiankunWebpackPluginOptions {
  packageName?: string;
}
```

| 选项 | 默认值 | 说明 |
| --- | --- | --- |
| `packageName` | 当前 `package.json` 的 `name` | Classic 脚本构建输出的全局库名称。 |

插件会将输出调整为浏览器全局库，并在 `html-webpack-plugin` 生成的 HTML 中标记入口脚本。应确保 `package.json` 中的名称保持稳定；如果插件无法读取该名称，则需要显式设置 `packageName`。

Webpack 插件不会配置开发服务器的 CORS。开发服务器和生产静态服务器都需要允许主应用跨域获取 HTML、脚本和样式。

完整接入步骤见[接入 Webpack 应用](/zh-CN/cookbook/prepare-a-webpack-app)。

## 入口约束

- 一个 HTML 入口最多只能有一个带 `entry` 属性的脚本。
- 插件标记入口后，请勿再手动添加入口标记。
- 微应用必须导出[生命周期契约](/zh-CN/concepts/lifecycle-and-props)。
- 生产资源必须满足浏览器的 CORS、CSP 和 MIME 类型要求。

加载器对入口的处理方式参见 [HTML 入口](/zh-CN/concepts/html-entry-loading)。
