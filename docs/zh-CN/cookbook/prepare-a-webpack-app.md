# 接入 Webpack 应用

本指南介绍如何将现有 Webpack 应用接入 qiankun 的 Classic 脚本执行模式。微应用仍可独立构建并使用自己的开发服务器，但需要导出 qiankun 生命周期，再由主应用通过 `loadMicroApp` 挂载。构建插件同时支持 Webpack 4 和 Webpack 5。

如果项目使用 Vite，请参阅[接入 Vite 应用](/zh-CN/cookbook/prepare-a-vite-app)。

## 安装插件

安装 qiankun 构建插件和 `html-webpack-plugin`：

```bash
npm install --save-dev @qiankunjs/bundler-plugin@rc html-webpack-plugin
```

`html-webpack-plugin` 用于生成 HTML 入口，使 qiankun 插件能够识别对应的入口脚本。

## 配置 Webpack

添加两个插件，设置稳定的 `packageName`，并允许主应用跨域访问开发服务器：

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

插件会将构建产物配置为浏览器全局库，并在 `html-webpack-plugin` 生成的 HTML 中标记入口脚本。`output.library`、`output.libraryTarget`、`output.globalObject` 以及 Webpack 4 的 JSONP 函数这几个字段交由插件设置即可，不要在自己的 Webpack 配置里再手动指定。

### 选择稳定的 `packageName`

`packageName` 是 Classic 脚本构建产物的全局库名称，默认值为当前项目 `package.json` 中的 `name`。若该字段缺失、由工具动态生成或可能发生变化，应显式设置 `packageName`。

该值不能为空，并且必须在不同版本的构建之间保持稳定。使用默认的 `sandbox: true` 时，它**不需要**与传给 `loadMicroApp` 的 `name` 相同：

- `packageName` 用于命名 Webpack 输出的全局库。
- `loadMicroApp({ name })` 用于标识 qiankun 中的应用。

qiankun 会优先从入口脚本的导出或沙箱捕获的全局对象中解析生命周期。查找 `window[name]` 仅用于兼容旧有方式，不是主要约定。设置 `sandbox: false` 后，沙箱无法再捕获入口导出，qiankun 只能退回 `window[name]` 查找。此时要么构建产物自行把生命周期赋给 `window[name]`，要么让全局库名（通常即 `packageName`）与主应用传入的 `name` 保持一致。

### 设置运行时公共路径（public path）

入口脚本执行时，qiankun 会提供微应用入口的基地址。将其赋值给 Webpack 的运行时公共路径，可确保延迟加载的代码分块从微应用自身的源加载：

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

该模块必须先于应用入口中的其他内容导入。此方式同时适用于 Webpack 4 和 Webpack 5；应用独立运行时，Webpack 仍使用原有的公共路径。

## 导出生命周期函数

在 Webpack 入口中导出 `bootstrap`、`mount` 和 `unmount`。以下 React 示例在 qiankun 提供的 `HTMLElement` 内渲染，同时保留独立运行能力：

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

Webpack 会通过 `QiankunWebpackPlugin` 配置的全局库暴露这些入口导出，因此不应再手动为对应的全局库变量赋值。`unmount` 必须清理框架根节点，以及应用自行创建的各类副作用。

`html-webpack-plugin` 模板只需包含应用挂载节点，脚本的注入和标记由插件完成：

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

主应用将 HTML 入口加载到现有的 `HTMLElement` 中。应保存返回的 `MicroApp` 句柄，并在所属视图移除之前卸载应用：

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

示例中的应用标识 `orders-panel` 与 Webpack 全局库名称 `my-webpack-app` 不同，用于说明二者是独立概念。`props`、配置项和句柄方法见 [`loadMicroApp`](/zh-CN/api/load-micro-app)。

如果应用完全由 URL 规则决定是否激活，可以使用 [`registerMicroApps`](/zh-CN/api/register-micro-apps) 和 [`start`](/zh-CN/api/start) 实现路由驱动加载。

## CORS 与资源地址

qiankun 从主应用所在的源请求入口 HTML 及其资源。`QiankunWebpackPlugin` 不会配置 webpack-dev-server，因此微应用服务器必须自行返回 `Access-Control-Allow-Origin` 响应头。外部脚本和样式也必须提供正确的 CORS 响应头。

上述 `public-path.ts` 会使延迟加载的代码分块从微应用的部署源加载。如果部署使用 CDN 或其他资源基地址，应确认注入或显式配置的 URL 与当前环境一致。

## 生产检查

部署前应完成以下检查：

1. 执行微应用的生产构建，并将构建产物部署到预期的源。
2. 直接打开部署后的 HTML 入口，确认独立运行仍然正常。
3. 通过 `loadMicroApp` 加载该入口，并分别执行一次卸载和重新挂载。
4. 确认入口 HTML、JavaScript 代码分块、CSS 和外部资源来自预期 URL，并带有必要的 CORS 响应头。
5. 在不同版本之间保持 `packageName` 稳定，并确认构建产物仍然只有一个被标记的入口脚本。

插件的完整选项和 Webpack 版本差异见 [`@qiankunjs/bundler-plugin`](/zh-CN/ecosystem/bundler-plugin)。应用在卸载阶段需要完成的清理工作见[生命周期与 props](/zh-CN/concepts/lifecycle-and-props)。
