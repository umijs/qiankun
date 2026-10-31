# 从 qiankun 2.x 迁移

qiankun 3.0 的公开 API 更精简，约束也更明确。本指南通过迁移前后的示例，逐项说明不兼容变更及其 v3 替代方案。

为便于与现有项目对照，路由注册示例继续使用 `registerMicroApps`。对于由主应用控制的面板、标签页和组件，应优先使用 [`loadMicroApp`](/zh-CN/api/load-micro-app)。

::: info 版本
从 qiankun 2.x 迁移到当前 v3 API 时，请以本页列出的差异为准。其他 API 页面仅描述当前版本的行为。

:::

## 总览

| 方面 | qiankun 2.x | qiankun 3.0 |
| --- | --- | --- |
| `entry` | 字符串，或 `{ scripts, styles }` 对象 | 只能是 HTML URL 字符串 |
| `container` | 选择器字符串或 `HTMLElement` | 只能是 `HTMLElement` 实例 |
| `start()` 选项 | `prefetch`、`sandbox`、`singular`、`fetch`、`getPublicPath`、`getTemplate`、`excludeAssetFilter` 等 | 仅支持 single-spa 的 `StartOpts`（`{ urlRerouteOnly? }`） |
| 沙箱 / 样式隔离 | `strictStyleIsolation`（Shadow DOM）或 `experimentalStyleIsolation`（选择器改写） | `sandbox: boolean \| SandboxConfiguration`，样式隔离为 `sandbox.styleIsolation: boolean`（CSS `@scope`） |
| 单应用配置 | 通过 `start()` 统一配置 | 每个应用分别设置 `configuration: AppConfiguration` |
| 全局状态管理 | `initGlobalState` / `onGlobalStateChange` / `setGlobalState` | 已移除；通过 `props` 传入自有状态容器 |
| 微应用构建 | 手动配置 UMD / `libraryTarget` / `jsonpFunction` / `chunkLoadingGlobal` | 使用 `@qiankunjs/bundler-plugin`（Webpack）或 `qiankun()`（Vite） |
| 预加载 | `start()` 上的 `prefetch: 'all' \| string[] \| fn` | 流式加载器自动预加载；`prefetchApps` 已废弃 |
| 浏览器兼容 | 包含旧浏览器兼容路径 | 面向现代浏览器，不提供快照沙箱退化；见[浏览器支持](/zh-CN/guide/browser-support) |
| 错误处理 | `addGlobalUncaughtErrorHandler` / `removeGlobalUncaughtErrorHandler` | 路由应用使用 `addErrorHandler` / `removeErrorHandler`；手动加载应用处理句柄 Promise |
| 实例释放 | `unmount()` 卸载后保留已加载实例 | 空闲实例有数量和时间限制；新增 `unload()`、`unloadMicroApp()` 和 `unloadApplication()` |

以下各节详细说明这些差异。

## entry：由对象改为 URL 字符串

在 2.x 中，`entry` 可以是列出脚本和样式的配置对象。v3 仅接受单个 HTML URL 字符串；qiankun 会以流式方式解析该 HTML 文档，并自动发现其中的资源。

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
    entry: '//localhost:7100', // 微应用的 HTML 文档
    container: document.querySelector('#subapp')!,
    activeRule: '/react',
  },
]);
```
:::

当前类型为 `type HTMLEntry = string`。v3 已移除 `{ scripts, styles }` 写法以及 2.x 的 `EntryOpts` 类型。

## container：由选择器字符串改为 HTMLElement

在 2.x 中，`container` 可以接收 CSS 选择器字符串。v3 的 `container` 必须是 `HTMLElement` 实例，不再接受选择器字符串。

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
传入选择器字符串会产生类型错误，运行时也无法获得目标元素。如果注册应用时 DOM 节点尚未创建，应在节点创建后再注册应用，例如在主应用的挂载副作用中查询元素并完成注册。

:::

## start()：应用级配置取代全局选项

这是迁移时配置调整幅度最大的变更。2.x 的 `start()` 接收 `prefetch`、`sandbox`、`singular`、`fetch`、`getPublicPath`、`getTemplate`、`excludeAssetFilter` 等框架级选项。v3 的 `start()` 仅向 single-spa 传递 `StartOpts`，目前只有 `urlRerouteOnly` 一个字段。原有的 qiankun 全局选项已被移除，或调整为各应用的 `configuration`。

```ts
// v3 函数签名
function start(opts?: { urlRerouteOnly?: boolean }): void;
```

各应用的运行配置均写入 `configuration` 字段，其类型为 [`AppConfiguration`](/zh-CN/api/configuration)。该配置会与框架默认值合并，并覆盖同名字段。

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
      sandbox: {              // JavaScript 沙箱（默认开启）
        styleIsolation: true, // CSS @scope 隔离（默认关闭）
      },
    },
  })),
);
start(); // 此处不再接收 qiankun 专用选项
```
:::

当前的应用级字段为 `sandbox`、`fetch`、`loadTimeout`、`streamTransformer` 和 `nodeTransformer`；`styleIsolation`、`globals`、`incubatorContext`、`plugins`、`modules`、`resolveHook`、`importHook` 和 `loadHook` 位于 `sandbox` 对象内部。默认值和高级用法见 [AppConfiguration 参考](/zh-CN/api/configuration)。

v3 已移除 `FrameworkConfiguration` 类型、`getPublicPath`、`getTemplate`、`excludeAssetFilter` 和 `singular`。

## 沙箱与样式隔离：统一入口 + 原生 `@scope`

2.x 将 JavaScript 和样式隔离选项统一放在嵌套的 `sandbox` 配置中，样式隔离可选择 Shadow DOM 或选择器改写。v3 保留了 `sandbox` 这一统一入口，但内容不同：JavaScript 隔离由开关本身控制，样式隔离改为 `sandbox.styleIsolation`，并改用原生 CSS `@scope`，不再提供 Shadow DOM 模式。

::: code-group
```ts [2.x]
start({
  sandbox: {
    strictStyleIsolation: true,       // 使用 Shadow DOM
    // 或者
    experimentalStyleIsolation: true, // 改写选择器作用域
  },
});
```

```ts [3.0]
// 每个应用单独配置
configuration: {
  sandbox: {
    // 传入对象形式即启用基于 Proxy 隔离膜的 JavaScript 隔离
    styleIsolation: true, // 使用 @scope 将 CSS 限制在 [data-name="<appName>"] 内
  },
}
```
:::

主要差异如下：

- `sandbox` 的类型是 `boolean | SandboxConfiguration`。设置为 `sandbox: false` 后，应用会在真实的 `window` 上运行，可用于兼容无法在代理全局对象中运行的旧应用；传入对象则在保持隔离的同时对其进行配置。
- `sandbox.styleIsolation` 是一个 `boolean`，默认值为 `false`。启用后，每个应用的样式会包含在 `@scope ([data-name="<appName>"]) { ... }` 中；外部样式表会被重新获取，并以 blob URL 形式注入 `<link>`，以便在样式内容外层添加 `@scope`。
- 作用域选择器由内部根据 `[data-name="<appName>"]` 推导，无法通过公开配置修改。

::: warning `@scope` 的浏览器支持
v3 的样式隔离依赖浏览器原生支持 CSS `@scope`，不提供 Shadow DOM 替代模式或兼容实现（polyfill）。不支持 `@scope` 的浏览器无法使用该能力。`@font-face` 和 `@keyframes` 等规则的处理方式见[样式隔离](/zh-CN/concepts/style-isolation)和[启用 CSS 样式隔离](/zh-CN/cookbook/enable-style-isolation)。

:::

## 全局状态管理：已移除

qiankun 2.x 提供 `initGlobalState`、`onGlobalStateChange`、`setGlobalState` 和 `MicroAppStateActions` 用于跨应用状态管理。v3 已移除这些 API。

迁移后，应通过 `props` 向微应用传递所需的数据、函数或对象。例如，可以传入接口精简的状态容器或事件总线。

::: code-group
```ts [2.x]
import { initGlobalState } from 'qiankun';

const actions = initGlobalState({ user: null });
actions.onGlobalStateChange((state, prev) => console.log(state, prev));
actions.setGlobalState({ user: { name: 'Alice' } });
```

```ts [3.0]
// 主应用：创建状态仓库，并通过 props 传递
import mitt from 'mitt';

const store = { state: { user: null }, emitter: mitt() };

registerMicroApps([
  {
    name: 'react-app',
    entry: '//localhost:7100',
    container,
    activeRule: '/react',
    props: { store }, // 传递给微应用的 mount(props)
  },
]);
```
:::

微应用在 `mount(props)` 中读取 `props.store`。有关 `props` 约定、共享事件总线和卸载清理等通信方式，见[应用间共享状态与通信](/zh-CN/cookbook/communicate-between-apps)。

## 构建配置：使用构建插件取代手动 UMD 配置

在 2.x 中，微应用需要手动配置输出格式，将生命周期挂载到全局对象，并确保代码块加载名称唯一。v3 通过 `@qiankunjs/bundler-plugin` 统一完成这些配置。

### Webpack

插件会将输出库的全局对象配置为 `window`，并在 Webpack 4 中设置 `jsonpFunction`，同时为入口 `<script>` 添加加载器识别所需的 `entry` 属性。应将插件安装为开发依赖并加入 `plugins` 数组，同时保留 `html-webpack-plugin`，以便自动为相应脚本添加 `entry` 属性。

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
    new QiankunWebpackPlugin(), // packageName 默认取 package.json 中的 name
  ],
  devServer: {
    // 插件不会配置 CORS，需要由应用自行添加
    headers: { 'Access-Control-Allow-Origin': '*' },
    allowedHosts: 'all',
  },
};
```
:::

Webpack 插件仅接收可选字段 `packageName`，其默认值为 `package.json` 中的 `name`。该字段用于命名构建产物的全局库，与主应用中的应用 `name` 含义不同。启用默认沙箱且导出生命周期的脚本带有 `entry` 属性时，两者无需使用相同值；设置 `sandbox: false` 并依赖 `window[appName]` 解析生命周期时，全局库的属性名必须与主应用名称相同，除非构建产物自行创建该属性。详见[接入 Webpack 应用](/zh-CN/cookbook/prepare-a-webpack-app)和[构建插件参考](/zh-CN/ecosystem/bundler-plugin)。

### Vite

v3 在开发和生产环境中均通过 ESM 沙箱原生加载 Vite 应用，不再使用 SystemJS 或 UMD 构建模式。在 Vite 配置中加入无参数的 `qiankun()` 插件后，插件会为开发服务器和预览服务器启用 CORS，并在构建时标记入口模块脚本。

```ts [vite.config.ts]
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { qiankun } from '@qiankunjs/bundler-plugin/vite';

export default defineConfig({
  plugins: [react(), qiankun()],
  server: { port: 7100, strictPort: true },
});
```

::: info 创建新应用
对于新项目，可通过 [Agent skill](/zh-CN/ecosystem/agent-skill) 让 coding agent 生成所需配置。另见[快速上手](/zh-CN/guide/getting-started)。

:::

## 微应用入口：使用现代 API 渲染到 `props.container`

生命周期仍由 `bootstrap`、`mount` 和 `unmount` 组成，但应使用现代框架 API 渲染到 `props.container`，即当前应用的容器子树，而不是全局 `document`。应用需要按照常规方式导出生命周期函数。对于 Webpack 构建，插件会以 `packageName` 命名全局库，并为相应脚本添加 `entry` 属性；原生 ESM 构建则直接使用模块导出。

`bootstrap` 的参数已收紧为只读的 `{ name, entry }`，不再传入业务 props 或容器。如果旧实现依赖用户数据、路由状态或 DOM 初始化，应将这部分逻辑移到 `mount`，并在 `unmount` 中释放资源；后续数据变更通过 `update` 处理。参见[微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props)。

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

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
```
:::

Vue 的实现结构相同：在 `mount` 中调用 `createApp(...).mount(...)`，在 `unmount` 中调用 `app.unmount()`。Webpack 和原生 ESM 构建均导出相同的三个生命周期函数，对应的构建集成会将入口处理为 qiankun 所需的格式。详见[微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props)。

`mount` 和 `unmount` 会收到本次挂载的 `props.container`；可选的 `update` 只接收调用方传入的业务 props，不会自动注入容器。若更新时需要访问框架根节点或容器，应在 `mount` 中保存引用，在 `unmount` 中释放。

::: danger `entry` 脚本不得超过一个
一份 HTML 入口中最多只能有一个带 `entry` 标记的脚本。若存在两个 `entry` 脚本，加载器会抛出 `QiankunError`。构建插件具有幂等性，只会为一个脚本添加 `entry` 属性。

:::

## 实例复用与销毁：区分 unmount 和 unload

迁移时应检查所有 `loadMicroApp` 调用，避免把再次调用函数等同于重新加载脚本：

- 以相同的 `name` 和 `entry` 加载时，可复用同一容器上的实例，或其他容器中已空闲、正在卸载的实例。同一容器上的挂载会排队；在不同容器中同时挂载时，各自使用独立实例。
- 命中缓存时，入口脚本、模块顶层代码和 `bootstrap` 不会再次执行；本次业务 props 由 `mount` 接收。与挂载位置或用户状态有关的初始化应放在 `mount` 中。
- 同一 `name` 和 `entry` 最多保留 2 份空闲实例，全局最多 8 份，连续空闲 5 分钟后回收。这是内置策略，不是 `AppConfiguration` 配置项。缓存回收后，旧句柄仍可通过 `mount()` 重新加载。
- 复用实例时沿用创建它时的配置和主应用生命周期钩子；再次传入不同的 `configuration` 不会重建已有沙箱。需要更换配置或强制获取新代码时，应先销毁旧实例。

`unmount()` 用于暂时移除视图，已加载实例仍可能被复用。需要释放沙箱、资源和缓存时，改用以下 API：

| 加载方式 | 销毁方式 | 范围 |
| --- | --- | --- |
| `loadMicroApp` | `await app.unload()` | 销毁该句柄所用的实例，共用它的句柄一并失效 |
| `loadMicroApp` | `await unloadMicroApp(name)` | 销毁该名称下全部手动加载的实例 |
| `registerMicroApps` | `await unloadApplication(name, { waitForUnmount: true })` | 等待路由卸载后销毁；保留注册，后续进入活跃路由会重新加载 |

```ts
import { loadMicroApp } from 'qiankun';

const app = loadMicroApp({ name: 'account-app', entry, container });
await app.mountPromise;

// 暂时隐藏，之后仍可能复用。
await app.unmount();
await app.mount();

// 不再使用时销毁；之后须重新调用 loadMicroApp 获取句柄。
await app.unload();
```

`mountPromise` 和 `unmountPromise` 只表示首次挂载和首次卸载；后续操作应等待 `mount()`、`unmount()` 各自返回的 Promise。主动 `unload()` 与缓存自动回收不同：主动销毁后旧句柄失效，不能再挂载。

加载或 `bootstrap` 失败后，重新调用 `loadMicroApp` 可以重新加载；同一 `name` 和 `entry` 有约 1 秒的失败冷却期。不要通过反复挂载失败句柄重试。销毁无法抢占已经进入的应用生命周期，也无法清空浏览器原生 ESM 模块注册表。完整行为与清理边界见 [loadMicroApp](/zh-CN/api/load-micro-app)；路由应用见 [registerMicroApps](/zh-CN/api/register-micro-apps#unload-application)。

## 错误处理与加载超时

v3 不再导出 `addGlobalUncaughtErrorHandler` 和 `removeGlobalUncaughtErrorHandler`。应按加载方式迁移错误处理：

- **路由应用**：用 `addErrorHandler` / `removeErrorHandler` 处理 single-spa 的加载和生命周期错误；移除时传入同一函数引用。
- **手动加载应用**：处理返回句柄的 Promise 拒绝，首次挂载可等待 `mountPromise`。全局 `addErrorHandler` 不会接收这些首次加载及生命周期错误。
- **普通页面异常**：如需监听与 qiankun 无关的未捕获错误，使用浏览器的 `error` / `unhandledrejection` 事件，并由主应用管理监听器清理。

框架错误可通过从 `qiankun` 导入的 `QiankunError` 及其稳定 `code` 识别；业务错误、网络异常和 single-spa 错误不一定属于该类型，不应通过匹配错误消息判断。

新增的 `loadTimeout` 默认值为 `0`，表示关闭。它从取得容器的加载权限后开始计时，覆盖 `beforeLoad`、入口加载、资源处理、生命周期发现和 HTML 流结束；不包含容器等待、失败冷却期，也不限制 `bootstrap`、`mount`、`unmount` 或缓存命中后的重新挂载。

```ts
import { loadMicroApp, QiankunError } from 'qiankun';

const app = loadMicroApp({ name, entry, container }, { loadTimeout: 10_000 });
try {
  await app.mountPromise;
} catch (error) {
  if (error instanceof QiankunError) {
    console.error(error.code, error);
  } else {
    console.error(error);
  }
}
```

启用超时后，入口生命周期就绪且 HTML 流结束才会进入挂载；默认关闭时仍可在 HTML 流结束前挂载。超时产生 `LoadAppTimeoutError`（`code` 为 `load-timeout`），框架会中止加载并清理已写入的节点和沙箱。自定义 `fetch` 应转发 `init.signal`，并在中止后停止读取响应流。详见 [AppConfiguration](/zh-CN/api/configuration#loadtimeout) 和 [addErrorHandler / removeErrorHandler](/zh-CN/api/error-handling)。

## 运行环境与工具链下限

- **开发工具链**：本仓库要求 Node `^22.15.0 || >=24.0.0` 和 `pnpm@11.13.1`。接入项目还应满足其构建工具的要求；这不是浏览器运行时的 Node 依赖。
- **浏览器**：以[浏览器支持](/zh-CN/guide/browser-support)为准，分别评估基础运行时、原生 ESM 和样式隔离。v3 不支持 IE，也不会自动退化成快照沙箱。

调用 `start()` 之前，应先使用 v3 新增的 [`isRuntimeCompatible`](/zh-CN/api/is-runtime-compatible) 检查所需的运行时能力：

```ts
import { isRuntimeCompatible, registerMicroApps, start } from 'qiankun';

if (isRuntimeCompatible()) {
  registerMicroApps(apps);
  start();
} else {
  // 渲染降级界面或升级提示
}
```

仅当环境同时支持 `Proxy`、`TransformStream` 和 `URL.createObjectURL` 时，`isRuntimeCompatible()` 才返回 `true`。

::: info Firefox 与 ESM 应用
`isRuntimeCompatible()` 只检测基础运行时，不检测 ESM 沙箱或 CSS `@scope`。qiankun 会在首次加载沙箱 ESM 前检测动态多 import map：不支持时以 `esm-unsupported` 拒绝，检测被 CSP 拦截或超时等情况以 `esm-capability-check-failed` 拒绝。Firefox 默认不支持该 ESM 路径；需要支持 Firefox 时应提供 Classic 构建入口。详见[浏览器支持](/zh-CN/guide/browser-support)。

:::

## CSP：重新检查脚本和样式策略

v3 的脚本执行器不依赖 `eval` 或 `new Function`，但转换后的外链 Classic 脚本和 ESM 通过 Blob URL 执行，不能直接沿用仅允许原始资源域名的脚本策略。应在主应用响应上配置相应的 `script-src`、`style-src` 和 `connect-src`。当前 ESM 路径还会动态插入内联 import map，没有统一的 nonce 传递配置；只给入口脚本加 nonce 不足以授权该路径。按实际使用的脚本、样式和跨源部署方式核对[内容安全策略（CSP）](/zh-CN/guide/csp-requirements)。

## 其他 v3 API

- [`isRuntimeCompatible`](/zh-CN/api/is-runtime-compatible)——在启动前检查浏览器兼容性
- 应用级 [`configuration`](/zh-CN/api/configuration)——可通过 `RegistrableApp.configuration` 或 `loadMicroApp` 的第二个参数设置 `sandbox`（包括样式隔离和模块钩子）、`fetch`、`loadTimeout` 等选项

`setDefaultMountApp` 和 `runAfterFirstMounted` 仍从 `qiankun` 导出；路由导航可使用同样从顶层导出的 `navigateToUrl`，无需为此额外引入另一份 single-spa。

新项目应优先使用 `loadMicroApp`。完整的公开导出列表见 [API 总览](/zh-CN/api/)。

::: warning prefetchApps 已废弃
流式加载器会在本次入口 HTML 的解析过程中自动预加载资源；这不等同于在应用激活前预取尚未加载的其他应用。`prefetchApps` 仍保留，但已在 3.0 中废弃；2.x 中 `start()` 的 `prefetch` 策略已移除。加载优化见[优化微应用加载](/zh-CN/cookbook/optimize-loading)。

:::

## 迁移清单

1. 将每个 `entry` 改为 HTML URL 字符串。
2. 将每个 `container` 改为 `HTMLElement` 实例。
3. 移除 `start()` 中所有 qiankun 特有的选项，并将 `sandbox`、`styleIsolation` 和 `fetch` 等配置写入各应用的 `configuration`。
4. 将 `sandbox: { strictStyleIsolation | experimentalStyleIsolation }` 改为 `sandbox: { styleIsolation: boolean }`。
5. 移除 `initGlobalState`、`onGlobalStateChange` 和 `setGlobalState`；通过 `props` 传入自有状态容器。
6. 移除手动配置的 UMD、`libraryTarget` 和 `jsonpFunction` 输出选项；添加 `@qiankunjs/bundler-plugin`（Webpack）或 `qiankun()`（Vite）。
7. 在微应用入口中使用 `createRoot` 或 `app.mount` 渲染到 `props.container`。
8. 移除 `prefetch` 策略，使用流式加载器的自动预加载能力。
9. 在启动前调用 `isRuntimeCompatible()`，确认浏览器具备核心运行时能力。
10. 将依赖业务 props 或容器的 `bootstrap` 逻辑移到 `mount`；`update` 不依赖自动注入的容器。
11. 核对实例复用和缓存回收后的重新加载；区分临时卸载与主动销毁，并等待每次操作返回的 Promise。
12. 按加载方式迁移错误处理，按需设置 `loadTimeout`，并为自定义 fetch 转发取消信号。
13. 根据实际使用的 ESM、样式隔离和跨源资源重新核对主应用 CSP。
