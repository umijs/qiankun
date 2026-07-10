# @qiankunjs/bundler-plugin

`@qiankunjs/bundler-plugin` 为微应用准备 qiankun 可识别的 HTML Entry。主应用不需要安装它。

这个包同时提供 Vite 和 Webpack 插件；请使用对应的导入路径，不会自动识别打包工具。

## 安装

```bash
pnpm add -D @qiankunjs/bundler-plugin
```

支持 Vite 5 及以上版本，以及 Webpack 4 / 5。两种 peer dependency 都是可选的，只需安装项目实际使用的打包工具。

## 导出

| 导入路径 | 导出 | 用途 |
| --- | --- | --- |
| `@qiankunjs/bundler-plugin/vite` | `qiankun`（具名和默认导出） | Vite 插件 |
| `@qiankunjs/bundler-plugin` | `QiankunWebpackPlugin`（具名和默认导出） | Webpack 插件 |
| `@qiankunjs/bundler-plugin/webpack` | `QiankunWebpackPlugin`（具名和默认导出） | Webpack 显式子路径 |

## Vite

Vite 插件是零参数函数：

```ts
import { qiankun } from '@qiankunjs/bundler-plugin/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [qiankun()],
  server: { port: 7101, strictPort: true },
});
```

它提供两项可观察行为：

- 为 Vite 的 dev 和 preview server 配置允许跨域加载的响应头；
- 在构建产出的 HTML 中标记入口 module script。

插件不接收选项，也不会改变微应用的生命周期代码。入口模块仍须导出 `bootstrap`、`mount` 和 `unmount`。

开发环境的 CORS 配置不会替代生产服务器配置。部署后的 HTML、模块和其他资源仍须由实际服务器或 CDN 返回正确的 CORS 与 MIME 响应头。

完整接入步骤见[接入 Vite 应用](/zh-CN/cookbook/prepare-a-vite-app)。

## Webpack

Webpack 插件需要配合 `html-webpack-plugin` 生成 HTML Entry：

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
| `packageName` | 当前 `package.json` 的 `name` | Classic 构建输出的全局 library 名称。 |

插件会把输出调整成浏览器全局 library，并在 `html-webpack-plugin` 生成的文档中标记入口脚本。确保 `package.json` 有稳定的名称；无法读取时请显式提供 `packageName`。

Webpack 插件不会配置 dev server CORS。开发服务器和生产静态服务器都需要允许主应用跨域获取 HTML、脚本和样式。

完整接入步骤见[接入 Webpack 应用](/zh-CN/cookbook/prepare-a-webpack-app)。

## 入口约束

- 一个 HTML Entry 最多只能有一个带 `entry` 属性的脚本。
- 不要在插件已经标记入口后手工再添加一个标记。
- 微应用必须导出[生命周期契约](/zh-CN/concepts/lifecycle-and-props)。
- 生产资源必须满足浏览器的 CORS、CSP 和 MIME 类型要求。

加载器如何消费入口，见 [HTML Entry 与执行](/zh-CN/concepts/html-entry-loading)。
