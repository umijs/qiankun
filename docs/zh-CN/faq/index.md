# 常见问题

接入 qiankun 3.0 时最容易撞上的一些问题都收在这里。每一条都指向对应的参考页或实战页，想看细节顺着链接过去就行。

## 需要装构建插件吗

主应用(基座)不需要任何插件——它只是调用 [registerMicroApps](/zh-CN/api/register-micro-apps) / [start](/zh-CN/api/start)，或者 [loadMicroApp](/zh-CN/api/load-micro-app)。它自己的入口 `<script>` 不要带 `entry` 属性，因为主应用本身不是一个微应用。

微应用要做两件事：构建时(1)给入口 `<script>` 打上 `entry` 属性，(2)让资源带上宽松的 CORS。这两件事 [@qiankunjs/bundler-plugin](/zh-CN/ecosystem/bundler-plugin) 都替你做了。

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

`qiankun()` 负责处理开发 / 预览环境的 CORS 响应头，并给 `type="module"` 的入口脚本打标，让它走 ESM sandbox 这条路。`QiankunWebpackPlugin` 把 `output.library` 设成 `{ name, type: 'window' }`(这样 classic 路径就能从 `window[name]` 上读到应用)，并给注入的入口脚本打标。

不走构建的 no-build 应用可以手动打标——给暴露 lifecycle 的那个脚本加上 `entry`:

```html
<script src="./entry.js" entry></script>
```

参见 [让 Vite 应用适配 qiankun](/zh-CN/cookbook/prepare-a-vite-app) 和 [让 Webpack 应用适配 qiankun](/zh-CN/cookbook/prepare-a-webpack-app)。

## 为什么会报 CORS 错误

qiankun 通过一个装饰过的 `window.fetch` 跨域抓取每个微应用的 HTML Entry 和它的资源。所以子应用的服务器必须回一个宽松的 CORS 响应头，比如 `Access-Control-Allow-Origin: *`。没有这个头，浏览器会直接拦掉这次 fetch，应用根本加载不出来。

- Vite:用 `qiankun()`，它会把开发 / 预览环境的 CORS 响应头设好。
- Webpack:设置 `devServer.headers['Access-Control-Allow-Origin'] = '*'`，并且 `allowedHosts: 'all'`。
- 静态托管：以启用 CORS 的方式提供资源(比如 `http-server . --cors`)。

::: warning 第三方库同样需要 CORS
子应用加载的任何库——jQuery、某个 UI 组件库、一段埋点脚本——都会被 qiankun 用同样的方式抓取。一个不发 `Access-Control-Allow-Origin` 的公共 CDN 会失败。把这个库自己收下来，从你自己开了 CORS 的源上托管，别用一个不带响应头的 CDN。
:::

开了[样式隔离](/zh-CN/concepts/style-isolation)之后，外部的 `<link rel="stylesheet">` 样式表也会被重新抓取(好把它们的 CSS 用 `@scope` 包起来)。一个没有 CORS 响应头的跨域样式表会被丢弃，以保住隔离。样式表也要带 CORS 一起托管。

## 为什么报 “more than one entry script”

一个 HTML Entry 里，带 `entry` 属性的 `<script>` 只能有一个。它就是暴露微应用 lifecycle 的那个脚本，qiankun 要等它 resolve 才能拿到应用。出现第二个带 `entry` 的脚本会抛 `QiankunError`。

如果你的构建注入了好几个脚本(vendor chunk、runtime chunk、main chunk)，让 bundler 插件去决定哪个是入口——别自己再手动加一个 `entry` 上去。其余非入口脚本(放在 `<head>` 里自打包的某个库、代码分割出来的 chunk)照常加载，不要带这个属性。

## 为什么报 “lifecycle functions not found”

qiankun 把入口加载出来了，却在上面找不到 `bootstrap` / `mount` / `unmount` 这几个函数。确认一下微应用确实暴露了它们，而且暴露的方式和它的加载路径对得上。

::: code-group

```ts [ESM 路径(Vite)]
// 原生的 module 导出本身就是 lifecycle。
export async function bootstrap() {}
export async function mount(props: { container?: Element }) {
  render(props);
}
export async function unmount(props: { container?: Element }) {
  root?.unmount();
}
```

```tsx [Classic 路径(window 全局变量)]
// 打包产物的 library 名必须等于注册的应用名,
// 这样导出才会落到 window[name] 上。
export async function bootstrap() {}
export async function mount(props) { render(props); }
export async function unmount(props) { root?.unmount(); }
// QiankunWebpackPlugin 会把 output.library → window['webpack-app']
```

:::

常见原因：

- **注册的 `name` 和全局变量对不上。** classic 路径下，应用是从 `window[name]`(也就是 library 名)上读出来的。如果你注册的是 `name: 'webpack-app'`，那打包产物的 `output.library.name` 就必须是 `'webpack-app'`。对不上，qiankun 查到的就是个空的全局变量。
- **lifecycle 没导出。** ESM 路径下，`bootstrap`/`mount`/`unmount` 必须从入口 module 里 `export` 出来。classic 路径下，它们要能通过 window library 取到(插件会帮你赋值；手写的应用就自己 `window[name] = { bootstrap, mount, unmount }`)。
- **ESM module 里的隐式全局变量。** ESM 跑在严格模式下，像 `foo = 1` 这样的隐式赋值会抛 `ReferenceError`，而不是写进 sandbox。全局变量都要先声明。

参见 [微应用的 lifecycle 与 props](/zh-CN/concepts/lifecycle-and-props)。

## qiankun 支持 Vite / ESM 吗

支持，原生支持，开发和生产环境都可以。一个 `<script type="module">` 入口会交给 [ESM sandbox](/zh-CN/concepts/esm-sandbox) 执行：module 被抓下来，经过改写让它的全局变量都经由 JS sandbox membrane 路由，再通过一个动态注入的 import map 分配到合成的 specifier，最后由浏览器原生的 module loader 按序求值。除了给入口打标(这件事 `qiankun()` 做了)，不需要任何构建期的转换。

::: warning sandbox 内部禁用了 HMR
Vite 开发模式下，qiankun 会把 `/@vite/client` 打桩(stub)掉，让 HMR WebSocket 根本不去连——留着它的话，连接会从 sandbox 内部发起，进而触发一次破坏性的整页 `location.reload()`。Vite 应用跑在 qiankun 里的时候，手动改代码、手动刷新。
:::

::: info Firefox 需要开个开关
ESM sandbox 依赖多个动态注入的 import map。Chrome/Edge 133+ 和 Safari 18.4+ 原生支持；Firefox 则需要打开 `dom.multiple_import_maps.enabled`(默认关闭)，或者采用 es-module-shims。正因如此，ESM 的 e2e 测试套件在 Firefox 上被标注为“预期失败”。
:::

## 有内置的全局状态存储吗

没有。qiankun 3.0 没有 `initGlobalState` / `onGlobalStateChange` / `setGlobalState` 这套 API。请改为显式地共享状态：

- 通过 `props`(注册应用配置的第四个键 / `loadMicroApp` 上的 `props` 字段)向微应用传数据和回调。props 会到达微应用的 lifecycle 函数。
- 需求更复杂时，用你自己的 store(一个共享 module、一个事件总线、一个 signals 库)，再通过 props 把它的 API 交给微应用。

参见 [在应用间共享状态与通信](/zh-CN/cookbook/communicate-between-apps)。

## 怎么隔离样式

在应用配置里用 `styleIsolation` 这个布尔值逐个应用开启。它默认关闭。

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

开启后，qiankun 会把微应用的 CSS 包进一个原生 CSS `@scope` 块里，作用域限定在应用容器(`[data-name="<appName>"]`)上。外部样式表会被重新抓取，并以 blob-`<link>` 的形式提供，这样它们的规则也能被限定作用域。

::: info 不是 Shadow DOM
v3 不使用 Shadow DOM。2.x 里那个选项对象 `sandbox: { strictStyleIsolation | experimentalStyleIsolation }` 已经不存在了——唯一的开关就是布尔值 `styleIsolation`。
:::

要求和限制：

- 浏览器必须支持 CSS `@scope`。没有 polyfill；不支持它的浏览器不会限定样式作用域。
- 外部样式表必须能通过 CORS 抓取，否则会被丢弃以保住隔离。
- `@font-face` 和 `@namespace` 是故意保持为全局的(对它们限定作用域会破坏字体加载)，所以它们跨应用之间仍然可能冲突。
- `@keyframes` 会以逐应用的前缀重命名；在 JS 里用字符串动态拼出来的 keyframe 名不会被改写。

参见 [样式隔离](/zh-CN/concepts/style-isolation) 和 [启用 CSS 样式隔离](/zh-CN/cookbook/enable-style-isolation)。

## 支持哪些浏览器

v3 运行时需要 `Proxy`、`TransformStream` 和 `URL.createObjectURL`。启动前先探一下当前浏览器：

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

三者里 `TransformStream` 的门槛最高(流式 HTML Entry 加载靠它)。走 ESM-sandbox 的微应用还额外需要 import map 支持(见上面关于 Firefox 的说明)。参见 [isRuntimeCompatible](/zh-CN/api/is-runtime-compatible)。

## 为什么应用 remount 时不重新运行(ESM)

这是设计如此。ESM 路径下，一次 remount 会重新 import 同一个 blob URL，于是浏览器返回的是**同一个 module namespace**——顶层 module 代码不会再跑一遍，只有 `mount(props)` 会被再次调用。(classic 路径则是每次 remount 都会把整个脚本重新执行一遍。)

如果你把应用状态建在 module 顶层，它会在 unmount、remount 之间一直活着，于是第二次 mount 时表现为“过期”或者干脆报错。把所有实例的创建都挪进 `mount()`，再在 `unmount()` 里拆掉：

```ts
let root: Root | undefined;

export async function mount(props: { container?: Element }) {
  const el = props.container?.querySelector('#root') ?? document.getElementById('root');
  root = createRoot(el);          // 在 mount 里创建,而不是 module 顶层
  root.render(<App />);
}

export async function unmount() {
  root?.unmount();
  root = undefined;
}
```

这本来就是现代框架标准的接线方式，也是让[多实例](/zh-CN/cookbook/run-multiple-instances)能正常工作的前提。参见 [ESM sandbox](/zh-CN/concepts/esm-sandbox)。

## 2.x 的那些选项去哪了

qiankun 2.x 的若干 API 和选项在 3.0 里已经不存在：

| 2.x | 3.0 |
| --- | --- |
| `start({ prefetch, sandbox, singular, fetch, ... })` | 只剩 `start({ urlRerouteOnly? })`；逐应用的选项挪到了 `configuration` 里 |
| `sandbox: { strictStyleIsolation \| experimentalStyleIsolation }` | `styleIsolation: boolean`(CSS `@scope`) |
| `initGlobalState` / `onGlobalStateChange` / `setGlobalState` | 通过 `props` / 你自己的 store 传状态 |
| `entry: { scripts, styles }` 对象 | `entry: string`(一个 HTML URL) |
| `container: '#selector'` 字符串 | `container: HTMLElement` |
| `prefetch` 各种预取策略 | 流式 loader 自动预加载；`prefetchApps` 已废弃 |

完整的分步指引见 [从 qiankun 2.x 迁移](/zh-CN/cookbook/migrate-from-2x)。
