# 从 qiankun 2.x 迁移

qiankun 3.0 围绕流式 HTML Entry 加载、基于 Proxy membrane 的 JS 沙箱以及原生 ESM 执行重写了运行时。相比 2.x，公共 API 更精简、更严格，若干 2.x 选项已不复存在。本指南逐一讲解破坏性变更，每项都附带前后对照，帮助你把 2.x 接入迁移到 v3。

::: info 版本
本页面针对 qiankun `3.0.0-rc.21`。下文中的确切选项名和默认值均来自 `packages/` 下的 v3 源码。
:::

## 概览

| 领域 | qiankun 2.x | qiankun 3.0 |
| --- | --- | --- |
| `entry` | 字符串或 `{ scripts, styles }` 对象 | 仅支持 HTML URL 字符串 |
| `container` | 选择器字符串或 `HTMLElement` | 仅支持 `HTMLElement` 实例 |
| `start()` 选项 | `prefetch`、`sandbox`、`singular`、`fetch`、`getPublicPath`、`getTemplate`、`excludeAssetFilter`……​ | 仅 single-spa 的 `StartOpts`（`{ urlRerouteOnly? }`） |
| 沙箱 / 样式隔离 | `sandbox: { strictStyleIsolation \| experimentalStyleIsolation }`（Shadow DOM） | `sandbox: boolean` + 独立的 `styleIsolation: boolean`（CSS `@scope`） |
| 单应用配置 | 混入 `start()` | 每个应用独立的 `configuration: AppConfiguration` |
| 全局状态 store | `initGlobalState` / `onGlobalStateChange` / `setGlobalState` | 已移除 —— 通过 props 传入你自己的 store |
| 微应用构建 | 手动 UMD / `libraryTarget` / `jsonpFunction` / `chunkLoadingGlobal` | `@qiankunjs/bundler-plugin`（webpack）或 `qiankun()`（Vite） |
| 预取 | `start()` 上的 `prefetch: 'all' \| string[] \| fn` | 流式 loader 自动预加载；`prefetchApps` 已废弃 |
| 运行时下限 | Node 16+、更老的浏览器 | Node `>=20.19`；Proxy + TransformStream + `URL.createObjectURL` |

本页其余部分详述每一行。

## Entry：从对象到纯 URL 字符串

在 2.x 中，`entry` 可以是列出 scripts 和 styles 的配置对象。在 v3 中，`entry` 始终是单个 HTML URL 字符串 —— qiankun 会流式加载这份 HTML 文档并从中发现资源。

::: code-group
```ts [2.x]
registerMicroApps([
  {
    name: 'react-app',
    entry: {
      scripts: ['//localhost:7100/main.js'],
      styles: ['//localhost:7100/main.css'],
    },
    container: '#subapp',
    activeRule: '/react',
  },
]);
```

```ts [3.0]
registerMicroApps([
  {
    name: 'react-app',
    entry: '//localhost:7100', // the app's HTML document
    container: document.querySelector('#subapp')!,
    activeRule: '/react',
  },
]);
```
:::

现在类型为 `type HTMLEntry = string`。`{ scripts, styles }` 形式和 2.x 的 `EntryOpts` 类型均已不复存在。

## Container：从选择器字符串到 HTMLElement

在 2.x 中，`container` 接受 CSS 选择器字符串。在 v3 中，`container` 的类型和使用方式都是 `HTMLElement` 实例 —— 请传入元素，而非选择器。

::: code-group
```ts [2.x]
registerMicroApps([
  { name: 'react-app', entry: '//localhost:7100', container: '#subapp', activeRule: '/react' },
]);
```

```ts [3.0]
const container = document.querySelector<HTMLElement>('#subapp')!;

registerMicroApps([
  { name: 'react-app', entry: '//localhost:7100', container, activeRule: '/react' },
]);
```
:::

::: warning
传入选择器字符串现在会导致类型错误，且在运行时无法解析。如果你在 DOM 节点存在之前就注册应用，请把注册推迟到元素可用之后（例如在你的 shell 的 mount effect 中解析它）。
:::

## start()：以单应用配置取代全局选项

这是最大的变更。在 2.x 中，`start()` 接受一堆框架选项（`prefetch`、`sandbox`、`singular`、`fetch`、`getPublicPath`、`getTemplate`、`excludeAssetFilter`……）。在 v3 中，`start()` 只转发 single-spa 的 `StartOpts` —— 唯一的字段是 `urlRerouteOnly`。所有过去作为全局 `start()` 选项的东西，现在要么被移除，要么移到了每个应用独立的 `configuration` 中。

```ts
// v3 signature
function start(opts?: { urlRerouteOnly?: boolean }): void;
```

单应用的可调项位于应用的 `configuration` 字段上（类型为 [`AppConfiguration`](/zh-CN/api/configuration)），它会针对该应用叠加到框架默认值之上。

::: code-group
```ts [2.x]
registerMicroApps(apps);
start({
  prefetch: 'all',
  sandbox: { experimentalStyleIsolation: true },
  singular: true,
});
```

```ts [3.0]
registerMicroApps(
  apps.map((app) => ({
    ...app,
    configuration: {
      sandbox: true,        // JS sandbox (default true)
      styleIsolation: true, // CSS @scope isolation (default false)
    },
  })),
);
start(); // no qiankun-specific options here
```
:::

v3 中的 `AppConfiguration` 恰好包含以下字段：

| 字段 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `sandbox` | `boolean` | `true` | 启用基于 Proxy membrane 的 JS 沙箱 |
| `styleIsolation` | `boolean` | `false` | 通过运行时 `@scope` 隔离应用的 CSS |
| `globalContext` | `WindowProxy` | `window` | 沙箱 membrane 代理的基础全局对象 |
| `fetch` | `typeof window.fetch` | `window.fetch` | 自定义 fetch（会被包装为 cacheable/retryable/throwable） |
| `streamTransformer` | `() => TransformStream<string, string>` | — | 对 HTML 流的可选变换 |
| `nodeTransformer` | `NodeTransformer` | internal | 高级用法：重写每个资源节点 |

v3 中没有 `FrameworkConfiguration` 类型，没有 `getPublicPath`/`getTemplate`/`excludeAssetFilter`，也没有 `singular`。完整参考见 [AppConfiguration](/zh-CN/api/configuration)。

## 沙箱与样式隔离：两个独立的布尔值

在 2.x 中，隔离是一个嵌套对象，采用基于 Shadow DOM 的策略。v3 把它拆成两个独立的布尔值，并使用原生 CSS `@scope` —— 不再有 Shadow DOM 路径。

::: code-group
```ts [2.x]
start({
  sandbox: {
    strictStyleIsolation: true,       // Shadow DOM
    // or
    experimentalStyleIsolation: true, // scoped rewrite
  },
});
```

```ts [3.0]
// per app
configuration: {
  sandbox: true,        // JS isolation (Proxy membrane)
  styleIsolation: true, // CSS isolation via @scope, wrapped to [data-name="<appName>"]
}
```
:::

关键区别：

- `sandbox` 现在是普通的 `boolean`（仅 JS 隔离）。设置 `sandbox: false` 可让应用运行在真实的 `window` 上 —— 对于无法容忍被代理的全局对象的遗留应用很有用。
- `styleIsolation` 是一个独立的 `boolean`（默认关闭）。开启后，每个应用的样式会被包裹在 `@scope ([data-name="<appName>"]) { ... }` 中；外部样式表会被重新拉取并以 blob `<link>` 提供，以便 `@scope` 能包裹它们。
- scope 选择器在内部派生为 `[data-name="<appName>"]`，不可由用户配置。

::: warning `@scope` 浏览器支持
v3 的样式隔离依赖原生 CSS `@scope`。没有 Shadow DOM 回退，也没有 polyfill。不支持 `@scope` 的浏览器不会对样式进行隔离。详情及注意事项（font-face 与 keyframes 的处理）见 [样式隔离](/zh-CN/concepts/style-isolation) 和 [启用 CSS 样式隔离](/zh-CN/cookbook/enable-style-isolation)。
:::

## 全局状态 store：已移除

qiankun 2.x 自带一个跨应用 store：`initGlobalState`、`onGlobalStateChange`、`setGlobalState` 和 `MicroAppStateActions`。这些在 v3 中都不存在。

请通过 `props` 向下传递你需要的任何东西来进行通信。由于 `props` 可以携带函数和对象，你可以把一个小型 store 或事件总线交给每个微应用。

::: code-group
```ts [2.x]
import { initGlobalState } from 'qiankun';

const actions = initGlobalState({ user: null });
actions.onGlobalStateChange((state, prev) => console.log(state, prev));
actions.setGlobalState({ user: { name: 'Alice' } });
```

```ts [3.0]
// main app: build your own store and pass it through props
import mitt from 'mitt';

const store = { state: { user: null }, emitter: mitt() };

registerMicroApps([
  {
    name: 'react-app',
    entry: '//localhost:7100',
    container,
    activeRule: '/react',
    props: { store }, // delivered to the micro-app's mount(props)
  },
]);
```
:::

在微应用内部，于 `mount(props)` 中读取 `props.store`。相关模式（props 握手、共享事件总线、unmount 清理）见 [在应用间共享状态与通信](/zh-CN/cookbook/communicate-between-apps)。

## 构建配置：放弃手动 UMD 改造，改用 bundler 插件

在 2.x 中，微应用需要手写输出配置，把生命周期导出到全局，并让 chunk-loading 名称唯一。v3 用 `@qiankunjs/bundler-plugin` 取而代之。

### Webpack

该插件会把 output library 设为 `window`（在 webpack 4 上还会设置 `jsonpFunction`），并为入口 `<script>` 标记 loader 所依赖的 `entry` 属性。将其安装为开发依赖并加入 `plugins`；保留数组中的 `html-webpack-plugin`，以便入口脚本能被自动标记。

::: code-group
```js [2.x webpack.config.js]
const packageName = require('./package.json').name;

module.exports = {
  output: {
    library: `${packageName}`,
    libraryTarget: 'umd',
    jsonpFunction: `webpackJsonp_${packageName}`,
    globalObject: 'window',
  },
};
```

```js [3.0 webpack.config.js]
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { QiankunWebpackPlugin } = require('@qiankunjs/bundler-plugin');

module.exports = {
  output: { publicPath: 'auto' },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new QiankunWebpackPlugin(), // packageName defaults to package.json "name"
  ],
  devServer: {
    // the plugin does NOT set CORS for you — add it yourself
    headers: { 'Access-Control-Allow-Origin': '*' },
    allowedHosts: 'all',
  },
};
```
:::

webpack 插件接受一个可选字段 `packageName`，默认为你 `package.json` 中的 `name`。见 [让 Webpack 应用适配 qiankun](/zh-CN/cookbook/prepare-a-webpack-app) 和 [bundler-plugin 参考](/zh-CN/ecosystem/bundler-plugin)。

### Vite

v3 在开发和生产环境下都通过其 ESM 沙箱原生加载 Vite 应用 —— 没有 SystemJS 或 UMD 构建模式。加入零参数的 `qiankun()` 插件；它会为 dev 和 preview 设置宽松的 CORS，并在构建时标记入口 module 脚本。

```ts [vite.config.ts]
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { qiankun } from '@qiankunjs/bundler-plugin/vite';

export default defineConfig({
  plugins: [react(), qiankun()],
  server: { port: 7100, strictPort: true },
});
```

::: info 脚手架搭建全新应用
对于新项目，`create-qiankun` 会把这些都配好。见 [create-qiankun](/zh-CN/ecosystem/create-qiankun) 和 [快速上手](/zh-CN/guide/getting-started)。
:::

## 微应用入口：以现代方式渲染到 props.container

保持相同的生命周期契约 —— `bootstrap`、`mount`、`unmount` —— 但改用现代 API 渲染，并挂载到 `props.container`（应用自己的容器子树），而非全局 document。在 webpack（classic 模式）下，当由 qiankun 驱动时，应用仍会把生命周期发布到 `window[appName]` 上；入口 `<script>` 携带 `entry` 属性（由 bundler 插件添加）。

::: code-group
```tsx [2.x main.tsx]
import ReactDOM from 'react-dom';
import App from './App';

function render(props = {}) {
  const { container } = props;
  ReactDOM.render(<App />, container ? container.querySelector('#root') : document.getElementById('root'));
}

export async function bootstrap() {}
export async function mount(props) { render(props); }
export async function unmount(props) {
  const { container } = props;
  ReactDOM.unmountComponentAtNode(container ? container.querySelector('#root') : document.getElementById('root'));
}
```

```tsx [3.0 main.tsx]
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

let root: ReactDOM.Root | undefined;

function render(props: { container?: Element } = {}) {
  const el = props.container?.querySelector('#root') ?? document.getElementById('root');
  if (!el) return;
  root = ReactDOM.createRoot(el);
  root.render(<React.StrictMode><App /></React.StrictMode>);
}

export async function bootstrap() {}
export async function mount(props: { container?: Element }) { render(props); }
export async function unmount() {
  root?.unmount();
  root = undefined;
}

// classic (webpack) mode: expose lifecycles on the app-name global
if (window.__POWERED_BY_QIANKUN__) {
  window['react-app'] = { bootstrap, mount, unmount };
} else {
  render();
}
```
:::

对于 Vue，同样的结构适用：在 `mount` 中使用 `createApp(...).mount(...)`，在 `unmount` 中使用 `app.unmount()`。`window[appName]` 发布和带 `entry` 属性的脚本仅适用于 classic（webpack）路径；原生 Vite/ESM 应用直接导出生命周期，由 ESM 引擎解析。见 [微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props)。

::: danger 有且仅有一个 entry 脚本
一份 HTML entry 最多只能包含一个被标记为 `entry` 的脚本。两个 entry 脚本会让 loader 抛出 `QiankunError`。bundler 插件是幂等的，会为你标记单个 entry 脚本。
:::

## 运行时与工具链下限

v3 抬高了最低环境要求。

- **Node**：构建和运行工具链（`create-qiankun`、Vite）需要 `>=20.19`。
- **浏览器**：运行时需要 `Proxy`、`TransformStream` 和 `URL.createObjectURL`。样式隔离额外需要原生 CSS `@scope`。

在 `start()` 之前，使用新的 [`isRuntimeCompatible`](/zh-CN/api/is-runtime-compatible) 导出按能力进行门控：

```ts
import { isRuntimeCompatible, registerMicroApps, start } from 'qiankun';

if (isRuntimeCompatible()) {
  registerMicroApps(apps);
  start();
} else {
  // render a fallback / upgrade notice
}
```

只有当 `Proxy`、`TransformStream` 和 `URL.createObjectURL` 全部存在时，`isRuntimeCompatible()` 才返回 `true`。

::: info Firefox 与 ESM 应用
Firefox 不支持动态注入的 import map，而 ESM 沙箱依赖它来原生加载（Vite）微应用。classic（webpack）应用不受影响。见 [ESM 沙箱](/zh-CN/concepts/esm-sandbox)。
:::

## 值得采用的 v3 新导出

- [`isRuntimeCompatible`](/zh-CN/api/is-runtime-compatible) —— 在启动前探测浏览器支持情况。
- `RegistrableApp`（以及 `loadMicroApp` 的第二个参数）上的每应用 [`configuration`](/zh-CN/api/configuration) —— `sandbox`、`styleIsolation`、`globalContext` 和 `fetch` 现在都位于此处。

v3 完整的公共接口为 `registerMicroApps`、`start`、`loadMicroApp`、`setDefaultMountApp`、`runAfterFirstMounted`、`addErrorHandler`、`removeErrorHandler`、`isRuntimeCompatible` 以及 `prefetchApps`（已废弃）。见 [API 参考概览](/zh-CN/api/index)。

::: warning prefetchApps 已废弃
流式 loader 会在解析入口 HTML 时自动预加载资源，因此很少需要显式预取。`prefetchApps` 仍然存在，但在 3.0 中已废弃，而 2.x 中 `start()` 上的 `prefetch` 策略已被移除。关于加载调优，见 [优化加载与预加载](/zh-CN/cookbook/optimize-loading)。
:::

## 迁移清单

1. 把每个 `entry` 改为 HTML URL 字符串。
2. 把每个 `container` 改为 `HTMLElement` 实例。
3. 从 `start()` 移除所有 qiankun 专属选项；把 `sandbox`/`styleIsolation`/`fetch` 移入每个应用的 `configuration`。
4. 用 `sandbox: boolean` 加 `styleIsolation: boolean` 替换 `sandbox: { strictStyleIsolation | experimentalStyleIsolation }`。
5. 移除 `initGlobalState`/`onGlobalStateChange`/`setGlobalState`；通过 `props` 传入你自己的 store。
6. 删除手动的 UMD/`libraryTarget`/`jsonpFunction` 输出配置；添加 `@qiankunjs/bundler-plugin`（webpack）或 `qiankun()`（Vite）。
7. 把微应用入口现代化为渲染进 `props.container` 的 `createRoot` / `app.mount`。
8. 放弃 `prefetch` 策略；依赖流式自动预加载。
9. 用 `isRuntimeCompatible()` 门控启动，并确认你的 Node/浏览器下限。
