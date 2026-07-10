# 让 Webpack 应用接入 qiankun

本指南介绍如何把现有 Webpack 应用接入 qiankun 的经典脚本执行路径。应用仍然拥有独立的构建和开发服务器，同时导出 qiankun 生命周期，并由主应用通过 `loadMicroApp` 显式挂载。bundler plugin 同时支持 Webpack 4 和 Webpack 5。

如果使用 Vite，请参阅[让 Vite 应用接入 qiankun](/zh-CN/cookbook/prepare-a-vite-app)。

## 安装插件

安装 qiankun bundler plugin 和 `html-webpack-plugin`：

```bash
pnpm add -D @qiankunjs/bundler-plugin html-webpack-plugin
```

`html-webpack-plugin` 生成 HTML 入口，并让 qiankun 插件能够识别其中的入口脚本。

## 配置 Webpack

添加两个插件，使用稳定的 `packageName`，并允许开发服务器被跨域加载：

```js [webpack.config.js]
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { QiankunWebpackPlugin } = require('@qiankunjs/bundler-plugin');

module.exports = {
  entry: './src/index.tsx',
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new QiankunWebpackPlugin({ packageName: 'my-webpack-app' }),
  ],
  devServer: {
    port: 7102,
    headers: { 'Access-Control-Allow-Origin': '*' },
    allowedHosts: 'all',
  },
};
```

插件会把 bundle 配置为浏览器全局 library，并在 `html-webpack-plugin` 生成的 HTML 中标记入口脚本。请把 `output.library`、`output.libraryTarget`、`output.globalObject`，以及 Webpack 4 的 JSONP 函数交给插件管理。

### 选择稳定的 `packageName`

`packageName` 是经典 bundle 的全局 library 名称，默认取当前项目 `package.json` 中的 `name`。如果这个字段缺失、由工具动态生成或可能变化，请显式提供 `packageName`。

这个值必须非空，并且在不同构建之间保持稳定。它**不需要**等于传给 `loadMicroApp` 的 `name`：

- `packageName` 命名 Webpack 输出的 library。
- `loadMicroApp({ name })` 是 qiankun 中的应用标识。

qiankun 会优先从入口脚本的导出，或该脚本写入的全局对象中解析生命周期。查找 `window[name]` 只是最终的兼容回退，不是主要契约。两个名称使用相同的值没有问题，但并非强制要求。

### 设置运行时 public path

入口脚本执行时，qiankun 会提供微应用入口的基地址。把它接入 Webpack 的运行时 public path，使懒加载 chunk 从微应用自己的 origin 获取：

```ts [src/public-path.ts]
declare let __webpack_public_path__: string;

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
    __INJECTED_PUBLIC_PATH_BY_QIANKUN__?: string;
  }
}

if (window.__POWERED_BY_QIANKUN__ && window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}

export {};
```

请在应用入口的其他内容之前导入这个模块。这种方式同时适用于 Webpack 4 和 Webpack 5；应用独立运行时，Webpack 继续使用原有的 public path。

## 导出生命周期函数

从 Webpack 入口导出 `bootstrap`、`mount` 和 `unmount`。下面的 React 示例在 qiankun 提供的 `HTMLElement` 内渲染，同时保留独立运行能力：

```tsx [src/index.tsx]
import './public-path';
import { StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import App from './App';
import './index.css';

type LifecycleProps = {
  container?: HTMLElement;
};

let root: Root | undefined;

function render(props: LifecycleProps = {}) {
  const element = props.container?.querySelector('#root') ?? document.getElementById('root');
  if (!element) return;

  root = createRoot(element);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

export async function bootstrap() {
  return Promise.resolve();
}

export async function mount(props: LifecycleProps) {
  render(props);
}

export async function unmount() {
  root?.unmount();
  root = undefined;
}

if (!window.__POWERED_BY_QIANKUN__) {
  void bootstrap().then(() => mount({}));
}
```

Webpack 会通过 `QiankunWebpackPlugin` 配置的全局 library 发布这些入口导出；不要再手动赋值同一个 library 全局变量。`unmount` 必须完整释放框架根节点，以及应用自己创建的副作用。

`html-webpack-plugin` 模板只需要应用挂载节点，脚本的注入和标记交给插件：

```html [src/index.html]
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>My Webpack micro-app</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

## 从主应用加载

主应用把 HTML 入口加载进一个已经存在的 `HTMLElement`。请保存返回的 `MicroApp` 句柄，并在所属视图移除时卸载它：

```ts [main-app/src/micro-app.ts]
import { loadMicroApp, type MicroApp } from 'qiankun';

let microApp: MicroApp | undefined;

export function showWebpackApp() {
  if (microApp) return;

  const container = document.getElementById('subapp-container');
  if (!container) throw new Error('Missing #subapp-container');

  microApp = loadMicroApp({
    name: 'orders-panel',
    entry: '//localhost:7102',
    container,
  });
}

export async function hideWebpackApp() {
  await microApp?.unmount();
  microApp = undefined;
}
```

这里特意使用了不同的 `orders-panel` 和 `my-webpack-app`：应用标识与 Webpack library 名称是两个概念。props、配置项和句柄方法请参阅 [`loadMicroApp`](/zh-CN/api/load-micro-app)。

如果应用完全由 URL 规则激活，[`registerMicroApps`](/zh-CN/api/register-micro-apps) 和 [`start`](/zh-CN/api/start) 是对应的路由驱动方案。

## CORS 与资源地址

qiankun 从主应用所在的 origin 请求入口 HTML 及其资源。`QiankunWebpackPlugin` 不会配置 webpack-dev-server，因此微应用服务器必须自行返回 `Access-Control-Allow-Origin`。外部脚本和样式也需要提供适当的 CORS header。

上面的 `public-path.ts` 会让懒加载 chunk 与微应用的部署 origin 对齐。如果部署使用 CDN 或其他资源基地址，请确认注入或显式配置的 URL 与当前环境一致。

## 生产检查

部署接入前请完成以下检查：

1. 执行微应用的生产构建，并从预期 origin 提供构建产物。
2. 直接打开部署后的 HTML 入口，确认独立运行仍然正常。
3. 通过 `loadMicroApp` 加载这个入口，然后各执行一次卸载和重新挂载。
4. 确认入口 HTML、JavaScript chunk、CSS 和外部资源来自预期 URL，并带有需要的 CORS header。
5. 在不同版本之间保持 `packageName` 稳定，并确认构建产物仍然只有一个被标记的入口脚本。

插件的全部选项和 Webpack 版本差异请参阅 [@qiankunjs/bundler-plugin](/zh-CN/ecosystem/bundler-plugin)。应用在清理阶段的责任请参阅[生命周期与 props](/zh-CN/concepts/lifecycle-and-props)。
