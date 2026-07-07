# 从 qiankun 2.x 迁移

qiankun 3.0 把运行时整个重写了：流式 HTML 入口加载、基于 `Proxy` 隔离膜的 JS 沙箱、原生 ESM 执行。这些重写不只是换了实现——比如加载内核改成客户端流式渲染后，资源边到边解析执行，渲染更快，还避开了老方案手动 `eval` 脚本带来的一类晦涩 bug(细节见 [HTML entry 流式加载](/zh-CN/concepts/html-entry-loading))。对外的 API 则比 2.x 更小、也更严格，有几个 2.x 的选项直接没了。下面按破坏性变更逐条过，每条都给一个改前 / 改后的对照，照着把 2.x 的接入改成 v3。

::: info 版本
本页对应 qiankun `3.0.0-rc.21`。下面出现的选项名和默认值，都以 `packages/` 下 v3 的源码为准。

:::

## 总览

| 方面 | qiankun 2.x | qiankun 3.0 |
| --- | --- | --- |
| `entry` | 字符串，或 `{ scripts, styles }` 对象 | 只能是 HTML URL 字符串 |
| `container` | 选择器字符串或 `HTMLElement` | 只能是 `HTMLElement` 实例 |
| `start()` 选项 | `prefetch`、`sandbox`、`singular`、`fetch`、`getPublicPath`、`getTemplate`、`excludeAssetFilter` 等 | 只有 single-spa 的 `StartOpts`(`{ urlRerouteOnly? }`) |
| 沙箱 / 样式隔离 | `sandbox: { strictStyleIsolation \| experimentalStyleIsolation }`(Shadow DOM) | `sandbox: boolean` + 独立的 `styleIsolation: boolean`(CSS `@scope`) |
| 单应用配置 | 混在 `start()` 里 | 每个应用各自的 `configuration: AppConfiguration` |
| 全局状态 store | `initGlobalState` / `onGlobalStateChange` / `setGlobalState` | 移除——自己通过 props 传 store |
| 微应用构建 | 手写 UMD / `libraryTarget` / `jsonpFunction` / `chunkLoadingGlobal` | `@qiankunjs/bundler-plugin`(webpack)或 `qiankun()`(Vite) |
| 预加载 | `start()` 上的 `prefetch: 'all' \| string[] \| fn` | 流式加载器自动预加载；`prefetchApps` 已废弃 |
| 运行环境下限 | Node 16+，较老的浏览器 | Node `>=20.19`;`Proxy` + `TransformStream` + `URL.createObjectURL` |

下面把每一行展开讲。

## entry:从对象改成一个 URL 字符串

2.x 里 `entry` 可以是一个配置对象，列出脚本和样式。v3 里 `entry` 永远是单个 HTML URL 字符串——qiankun 会流式解析那份 HTML 文档，从里面自己发现资源。

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

类型现在是 `type HTMLEntry = string`。`{ scripts, styles }` 这种写法和 2.x 的 `EntryOpts` 类型都没了。

## container:从选择器字符串改成 HTMLElement

2.x 里 `container` 能接收一个 CSS 选择器字符串。v3 里 `container` 的类型和实际消费都是 `HTMLElement` 实例——传元素，别传选择器。

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
传选择器字符串现在会直接报类型错误，运行时也拿不到元素。如果你在 DOM 节点还没生成时就注册应用，那就把注册往后推，等元素有了再注册(比如放到基座的挂载副作用里去解析)。

:::

## start():单应用配置取代全局选项

这是改动最大的一处。2.x 的 `start()` 接收一大堆框架级选项(`prefetch`、`sandbox`、`singular`、`fetch`、`getPublicPath`、`getTemplate`、`excludeAssetFilter` 等)。v3 的 `start()` 只往下透传 single-spa 的 `StartOpts`——唯一的字段就是 `urlRerouteOnly`。凡是过去作为 `start()` 全局选项的东西，要么被移除了，要么挪到了每个应用各自的 `configuration` 上。

```ts
// v3 signature
function start(opts?: { urlRerouteOnly?: boolean }): void;
```

单应用的各种开关都放在应用的 `configuration` 字段上(类型是 [`AppConfiguration`](/zh-CN/api/configuration))，它会覆盖合并到该应用的框架默认值之上。

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

v3 的 `AppConfiguration` 就这几个字段，不多不少：

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `sandbox` | `boolean` | `true` | 开启 Proxy 隔离膜 JS 沙箱 |
| `styleIsolation` | `boolean` | `false` | 用运行时 `@scope` 给应用的 CSS 加作用域 |
| `globalContext` | `WindowProxy` | `window` | 沙箱隔离膜代理的基础全局对象 |
| `fetch` | `typeof window.fetch` | `window.fetch` | 自定义 fetch(会被包上 cacheable / retryable / throwable) |
| `streamTransformer` | `() => TransformStream<string, string>` | — | 可选，对 HTML 流做一层变换 |
| `nodeTransformer` | `NodeTransformer` | 内置 | 进阶用法：改写每个资源节点 |

v3 里没有 `FrameworkConfiguration` 类型，没有 `getPublicPath` / `getTemplate` / `excludeAssetFilter`，也没有 `singular`。完整参考见 [AppConfiguration](/zh-CN/api/configuration)。

## 沙箱与样式隔离：拆成两个独立的布尔值

2.x 里隔离是一个嵌套对象，策略都基于 Shadow DOM。v3 把它拆成两个互不相干的布尔值，并改用原生 CSS `@scope`——没有 Shadow DOM 这条路了。

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

几处关键差别：

- `sandbox` 现在是个纯 `boolean`(只管 JS 隔离)。设成 `sandbox: false` 就让应用跑在真实的 `window` 上——对那些受不了被代理全局的老应用有用。
- `styleIsolation` 是另一个独立的 `boolean`(默认关)。开启后，每个应用的样式会被包进 `@scope ([data-name="<appName>"]) { ... }`；外部样式表会被重新抓取、以 blob `<link>` 的形式提供，好让 `@scope` 能把它包起来。
- 作用域选择器由内部按 `[data-name="<appName>"]` 推导，不开放给用户配置。

::: warning `@scope` 的浏览器支持
v3 的样式隔离依赖原生 CSS `@scope`，既没有 Shadow DOM 兜底，也没有 polyfill。不支持 `@scope` 的浏览器不会对样式生效隔离。细节和注意事项(font-face 和 keyframes 的处理)见[样式隔离](/zh-CN/concepts/style-isolation)和[开启 CSS 样式隔离](/zh-CN/cookbook/enable-style-isolation)。

:::

## 全局状态 store:移除

qiankun 2.x 自带一套跨应用的 store:`initGlobalState`、`onGlobalStateChange`、`setGlobalState`，还有 `MicroAppStateActions`。这些在 v3 里一个都不剩。

通信改成把你需要的东西通过 `props` 往下传。`props` 能带函数也能带对象，所以你完全可以把一个小 store 或事件总线交给每个微应用。

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

微应用这头，在 `mount(props)` 里读 `props.store` 就行。各种通信模式(props 握手、共享事件总线、卸载时清理)见[应用间共享状态与通信](/zh-CN/cookbook/communicate-between-apps)。

## 构建配置：别再手动动 UMD，交给 bundler 插件

2.x 里微应用得手写输出配置，把生命周期挂到某个全局上，再让 chunk-loading 的名字唯一。v3 用 `@qiankunjs/bundler-plugin` 把这些替掉了。

### Webpack

插件会把输出库设成 `window`(在 webpack 4 上还会设 `jsonpFunction`)，并给入口 `<script>` 打上加载器识别用的 `entry` 属性。把它装成 dev 依赖、加进 `plugins` 就行；记得 `html-webpack-plugin` 也留在数组里，这样入口脚本才能被自动标记。

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

webpack 插件只接收一个可选字段 `packageName`，默认取你 `package.json` 里的 `name`。见[让 Webpack 应用接入 qiankun](/zh-CN/cookbook/prepare-a-webpack-app)和 [bundler-plugin 参考](/zh-CN/ecosystem/bundler-plugin)。

### Vite

v3 在 dev 和生产环境下都通过它的 ESM 沙箱原生加载 Vite 应用——没有 SystemJS，也没有 UMD 构建模式。加上零参数的 `qiankun()` 插件即可；它会为 dev 和 preview 设好宽松的 CORS，并在构建时标记入口 module 脚本。

```ts [vite.config.ts]
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { qiankun } from '@qiankunjs/bundler-plugin/vite';

export default defineConfig({
  plugins: [react(), qiankun()],
  server: { port: 7100, strictPort: true },
});
```

::: info 从零搭一个新应用
新项目的话，`create-qiankun` 会把这些全给你接好。见 [create-qiankun](/zh-CN/ecosystem/create-qiankun) 和[快速上手](/zh-CN/guide/getting-started)。

:::

## 微应用入口：用现代 API 渲染进 props.container

生命周期约定不变——还是 `bootstrap`、`mount`、`unmount`——但要用现代 API 渲染，并且挂进 `props.container`(应用自己的容器子树)，而不是全局 document。在 webpack(经典模式)下，由 qiankun 驱动时应用仍然把生命周期发布到 `window[appName]` 上；入口 `<script>` 带着 `entry` 属性(由 bundler 插件加上)。

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

Vue 的写法结构一样，`mount` 里用 `createApp(...).mount(...)`,`unmount` 里用 `app.unmount()`。往 `window[appName]` 发布、以及带 `entry` 属性的脚本，只对经典(webpack)这条路适用；原生 Vite / ESM 应用直接导出生命周期，由 ESM 引擎解析。见[微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props)。

::: danger 入口脚本有且只能有一个
一份 HTML 入口里，标记 `entry` 的脚本至多一个。出现两个 entry 脚本，加载器会抛 `QiankunError`。bundler 插件是幂等的，会替你只标记一个入口脚本。

:::

## 运行环境与工具链下限

v3 抬高了最低环境要求。

- **Node**:构建和跑工具链(`create-qiankun`、Vite)需要 `>=20.19`。
- **浏览器**:运行时需要 `Proxy`、`TransformStream`、`URL.createObjectURL`。样式隔离还额外需要原生 CSS `@scope`。

`start()` 之前先用 v3 新增的 [`isRuntimeCompatible`](/zh-CN/api/is-runtime-compatible) 按能力做个判断：

```ts
import { isRuntimeCompatible, registerMicroApps, start } from 'qiankun';

if (isRuntimeCompatible()) {
  registerMicroApps(apps);
  start();
} else {
  // render a fallback / upgrade notice
}
```

只有当 `Proxy`、`TransformStream`、`URL.createObjectURL` 三个都在，`isRuntimeCompatible()` 才返回 `true`。

::: info Firefox 与 ESM 应用
Firefox 不支持动态注入的 import map，而原生加载(Vite)的微应用要靠它，ESM 沙箱才转得起来。经典(webpack)应用不受影响。见 [ESM 沙箱](/zh-CN/concepts/esm-sandbox)。

:::

## v3 新增、值得用起来的导出

- [`isRuntimeCompatible`](/zh-CN/api/is-runtime-compatible)——启动前探一下浏览器支持情况。
- `RegistrableApp`(以及 `loadMicroApp` 第二个参数)上的单应用 [`configuration`](/zh-CN/api/configuration)——`sandbox`、`styleIsolation`、`globalContext`、`fetch` 现在都住在这里。

v3 完整的对外 API 是：`registerMicroApps`、`start`、`loadMicroApp`、`setDefaultMountApp`、`runAfterFirstMounted`、`addErrorHandler`、`removeErrorHandler`、`isRuntimeCompatible`，以及已废弃的 `prefetchApps`。见 [API 参考总览](/zh-CN/api/index)。

::: warning prefetchApps 已废弃
流式加载器在解析入口 HTML 的过程中就自动预加载资源了，所以基本用不着显式预取。`prefetchApps` 还在，但在 3.0 里已废弃；2.x 里 `start()` 上的那套 `prefetch` 策略则彻底没了。加载调优见[优化加载与预加载](/zh-CN/cookbook/optimize-loading)。

:::

## 迁移清单

1. 把每个 `entry` 改成 HTML URL 字符串。
2. 把每个 `container` 改成 `HTMLElement` 实例。
3. 从 `start()` 里去掉所有 qiankun 特有的选项；把 `sandbox` / `styleIsolation` / `fetch` 挪进每个应用的 `configuration`。
4. 把 `sandbox: { strictStyleIsolation | experimentalStyleIsolation }` 换成 `sandbox: boolean` 加 `styleIsolation: boolean`。
5. 移除 `initGlobalState` / `onGlobalStateChange` / `setGlobalState`；自己的 store 通过 `props` 传。
6. 删掉手写的 UMD / `libraryTarget` / `jsonpFunction` 输出配置；加上 `@qiankunjs/bundler-plugin`(webpack)或 `qiankun()`(Vite)。
7. 把微应用入口改成用 `createRoot` / `app.mount` 渲染进 `props.container`。
8. 丢掉 `prefetch` 策略，靠流式自动预加载。
9. 用 `isRuntimeCompatible()` 给启动加道闸，确认你的 Node / 浏览器下限达标。
