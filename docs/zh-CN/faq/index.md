# 常见问题

采用 qiankun 3.0 时最常遇到的问题解答。每一条都链接到对应的参考文档或实践指南页面，其中有对该主题的完整讲解。

## 我需要构建插件吗？

主应用（host）不需要任何插件——它只调用 [registerMicroApps](/zh-CN/api/register-micro-apps) / [start](/zh-CN/api/start) 或 [loadMicroApp](/zh-CN/api/load-micro-app)。主应用自身的入口 `<script>` 不能带上 `entry` 属性，因为主应用本身并不是一个微应用。

微应用需要做两件事：其构建必须（1）用 `entry` 属性标记入口 `<script>`，并且（2）以宽松的 CORS 策略提供资源。[@qiankunjs/bundler-plugin](/zh-CN/ecosystem/bundler-plugin) 会替你完成这两件事。

::: code-group

```ts [Vite]
// vite.config.ts
import { defineConfig } from 'vite';
import { qiankun } from '@qiankunjs/bundler-plugin/vite';

export default defineConfig({
  plugins: [qiankun()],
  server: { port: 7100, strictPort: true },
});
```

```js [Webpack]
// webpack.config.js
const { QiankunWebpackPlugin } = require('@qiankunjs/bundler-plugin');

module.exports = {
  output: { publicPath: 'auto' },
  plugins: [new QiankunWebpackPlugin()],
  devServer: {
    headers: { 'Access-Control-Allow-Origin': '*' },
    allowedHosts: 'all',
  },
};
```

:::

`qiankun()` 会处理开发/预览环境的 CORS 响应头，并为 ESM sandbox 路径标记 `type="module"` 的入口脚本。`QiankunWebpackPlugin` 会将 `output.library` 设为 `{ name, type: 'window' }`（这样 classic 路径就能从 `window[name]` 读取应用），并标记注入的入口脚本。

无构建（no-build）的应用可以手动标记入口——为暴露 lifecycle 的那个脚本加上 `entry`：

```html
<script src="./entry.js" entry></script>
```

参见 [让 Vite 应用适配 qiankun](/zh-CN/cookbook/prepare-a-vite-app) 与 [让 Webpack 应用适配 qiankun](/zh-CN/cookbook/prepare-a-webpack-app)。

## 为什么会出现 CORS 错误？

qiankun 通过一个装饰过的 `window.fetch` 跨域抓取每个微应用的 HTML Entry 及其资源。因此子应用服务器必须以宽松的 CORS 响应头作出应答，例如 `Access-Control-Allow-Origin: *`。缺少这些响应头时，浏览器会拦截该 fetch，应用也就永远加载不出来。

- Vite：使用 `qiankun()`，它会设置开发/预览环境的 CORS 响应头。
- Webpack：设置 `devServer.headers['Access-Control-Allow-Origin'] = '*'` 与 `allowedHosts: 'all'`。
- 静态托管：以启用 CORS 的方式提供资源（例如 `http-server . --cors`）。

::: warning 第三方库同样需要 CORS
子应用加载的任何库——jQuery、某个 UI 组件库、一段埋点脚本——都会被 qiankun 以同样的方式抓取。一个不发送 `Access-Control-Allow-Origin` 的公共 CDN 会失败。请将该库自行打包托管，用你自己启用了 CORS 的源来提供，而不是用一个不带响应头的 CDN。
:::

在开启 [样式隔离](/zh-CN/concepts/style-isolation) 时，外部的 `<link rel="stylesheet">` 样式表也会被重新抓取（这样它们的 CSS 才能被 `@scope` 包裹）。一个没有 CORS 响应头的跨域样式表会被丢弃，以维持隔离。请同样为样式表提供 CORS。

## 为什么报 “more than one entry script” 错误？

一个 HTML Entry 里最多只能包含一个带 `entry` 属性的 `<script>`。这个脚本正是暴露微应用 lifecycle 的那一个；qiankun 会等待它来解析出应用。第二个带 `entry` 属性的脚本会抛出 `QiankunError`。

如果你的构建注入了多个脚本（vendor chunk、runtime chunk、main chunk），就交给 bundler 插件去决定哪一个是入口——不要在此之上再手动添加 `entry`。非入口脚本（`<head>` 里自打包的某个库、代码分割出的 chunk）会正常加载，且不能带上该属性。

## 为什么报 “lifecycle functions not found”？

qiankun 能加载入口，却无法在其上找到 `bootstrap` / `mount` / `unmount` 函数。请确认微应用确实暴露了它们，并且暴露的方式与其加载路径相匹配。

::: code-group

```ts [ESM 路径（Vite）]
// 原生的 module 导出本身就是 lifecycle。
export async function bootstrap() {}
export async function mount(props: { container?: Element }) {
  render(props);
}
export async function unmount(props: { container?: Element }) {
  root?.unmount();
}
```

```tsx [Classic 路径（window 全局变量）]
// 打包产物的 library 名必须等于注册的应用名，
// 这样导出才会落到 window[name] 上。
export async function bootstrap() {}
export async function mount(props) { render(props); }
export async function unmount(props) { root?.unmount(); }
// QiankunWebpackPlugin 会把 output.library → window['webpack-app']
```

:::

常见原因：

- **注册的 `name` 与全局变量不匹配。** 在 classic 路径上，应用是从 `window[name]`（即 library 名）读取的。如果你注册的是 `name: 'webpack-app'`，那么打包产物的 `output.library.name` 就必须是 `'webpack-app'`。不匹配意味着 qiankun 查到的是一个空的全局变量。
- **lifecycle 没有被导出。** 在 ESM 路径上，`bootstrap`/`mount`/`unmount` 必须从入口 module 中 `export`。在 classic 路径上，它们必须能通过 window library 访问到（插件会为你赋值；手写的应用则要赋值 `window[name] = { bootstrap, mount, unmount }`）。
- **ESM module 里的隐式全局变量。** ESM 运行在严格模式下，因此一个隐式的 `foo = 1` 会抛出 `ReferenceError`，而不是写入 sandbox。请显式声明你的全局变量。

参见 [微应用的 lifecycle 与 props](/zh-CN/concepts/lifecycle-and-props)。

## qiankun 支持 Vite / ESM 吗？

支持，原生支持，且开发和生产环境皆可。一个 `<script type="module">` 入口会由 [ESM sandbox](/zh-CN/concepts/esm-sandbox) 执行：module 会被抓取、被改写以使其全局变量经由 JS sandbox membrane 路由、通过一个动态注入的 import map 被赋予合成的 specifier，并由浏览器原生的 module loader 按序求值。除了标记入口（`qiankun()` 会做这件事）之外，不需要任何构建期转换。

::: warning sandbox 内部禁用 HMR
在 Vite 开发模式下，qiankun 会打桩（stub）掉 `/@vite/client`，使 HMR WebSocket 永不开启——若放任其存活，它会从 sandbox 内部发起连接，并触发一次破坏性的整页 `location.reload()`。当 Vite 应用在 qiankun 内部运行时，请手动“编辑并刷新”。
:::

::: info Firefox 需要一个开关
ESM sandbox 依赖于多个动态注入的 import map。Chrome/Edge 133+ 与 Safari 18.4+ 原生支持这一点；Firefox 则需要 `dom.multiple_import_maps.enabled`（默认关闭），或者采用 es-module-shims。正因如此，ESM 的 e2e 测试套件在 Firefox 上被标注为“预期失败”。
:::

## 有内置的全局状态存储吗？

没有。qiankun 3.0 没有 `initGlobalState` / `onGlobalStateChange` / `setGlobalState` API。请改为显式地共享状态：

- 通过 `props`（注册应用配置的第四个键 / `loadMicroApp` 的 `props` 字段）向微应用传递数据与回调。props 会到达微应用的 lifecycle 函数。
- 若有更复杂的需求，请使用你自己的 store（一个共享 module、一个事件总线、一个 signals 库），并通过 props 把它的 API 交给微应用。

参见 [在应用间共享状态与通信](/zh-CN/cookbook/communicate-between-apps)。

## 我该如何隔离样式？

通过应用配置中的 `styleIsolation` 布尔值逐个应用开启。它默认关闭。

```ts
registerMicroApps([
  {
    name: 'react',
    entry: '//localhost:7100',
    container,
    activeRule: '/react',
    configuration: { sandbox: true, styleIsolation: true },
  },
]);
```

开启后，qiankun 会将微应用的 CSS 包裹进一个原生 CSS `@scope` 块中，其作用域限定在应用容器（`[data-name="<appName>"]`）上。外部样式表会被重新抓取，并以 blob-`<link>` 的形式提供，这样它们的规则也能被限定作用域。

::: info 不是 Shadow DOM
v3 不使用 Shadow DOM。2.x 里的选项对象 `sandbox: { strictStyleIsolation | experimentalStyleIsolation }` 已不复存在——唯一的开关就是布尔值 `styleIsolation`。
:::

要求与限制：

- 浏览器必须支持 CSS `@scope`。没有 polyfill；不支持它的浏览器不会限定样式作用域。
- 外部样式表必须可通过 CORS 抓取，否则会被丢弃以维持隔离。
- `@font-face` 与 `@namespace` 被有意保持为全局（对它们限定作用域会破坏字体加载），因此它们仍可能在应用间发生冲突。
- `@keyframes` 会以逐应用的前缀重命名；在 JS 中以字符串动态拼出的 keyframe 名不会被改写。

参见 [样式隔离](/zh-CN/concepts/style-isolation) 与 [启用 CSS 样式隔离](/zh-CN/cookbook/enable-style-isolation)。

## 支持哪些浏览器？

v3 运行时需要 `Proxy`、`TransformStream` 与 `URL.createObjectURL`。请在启动前探测当前浏览器：

```ts
import { isRuntimeCompatible } from 'qiankun';

if (isRuntimeCompatible()) {
  start();
} else {
  // 渲染一个降级 / 升级提示
}
```

`isRuntimeCompatible()` 返回：

```ts
typeof Proxy === 'function' &&
  typeof TransformStream === 'function' &&
  typeof URL?.createObjectURL === 'function';
```

`TransformStream` 是三者中门槛最高的（流式 HTML Entry 加载依赖它）。ESM-sandbox 微应用还额外需要 import map 支持（参见上面关于 Firefox 的说明）。参见 [isRuntimeCompatible](/zh-CN/api/is-runtime-compatible)。

## 为什么我的应用在 remount 时不会重新运行（ESM）？

这是设计使然。在 ESM 路径上，一次 remount 会重新 import 同一个 blob URL，因此浏览器返回的是**同一个 module namespace**——顶层 module 代码不会再次运行，只有 `mount(props)` 会被重新调用。（classic 路径则会在每次 remount 时重新执行整个脚本。）

如果你在 module 顶层创建应用状态，它会在 unmount 与 remount 之间存活下来，从而显得“过期”或在第二次 mount 时失败。请把所有实例创建都移入 `mount()`，并在 `unmount()` 中将其销毁：

```ts
let root: Root | undefined;

export async function mount(props: { container?: Element }) {
  const el = props.container?.querySelector('#root') ?? document.getElementById('root');
  root = createRoot(el);          // 在 mount 中创建，而不是在 module 顶层
  root.render(<App />);
}

export async function unmount() {
  root?.unmount();
  root = undefined;
}
```

这既是现代框架的标准接线方式，也是让 [多实例](/zh-CN/cookbook/run-multiple-instances) 正常工作的关键。参见 [ESM sandbox](/zh-CN/concepts/esm-sandbox)。

## 2.x 的那些选项去哪了？

若干 qiankun 2.x 的 API 与选项在 3.0 中已不存在：

| 2.x | 3.0 |
| --- | --- |
| `start({ prefetch, sandbox, singular, fetch, ... })` | 仅 `start({ urlRerouteOnly? })`；逐应用的选项放在 `configuration` 中 |
| `sandbox: { strictStyleIsolation \| experimentalStyleIsolation }` | `styleIsolation: boolean`（CSS `@scope`） |
| `initGlobalState` / `onGlobalStateChange` / `setGlobalState` | 通过 `props` / 你自己的 store 传递状态 |
| `entry: { scripts, styles }` 对象 | `entry: string`（一个 HTML URL） |
| `container: '#selector'` 字符串 | `container: HTMLElement` |
| `prefetch` 策略 | 流式 loader 自动预加载；`prefetchApps` 已废弃 |

完整的逐步指引见 [从 qiankun 2.x 迁移](/zh-CN/cookbook/migrate-from-2x)。
