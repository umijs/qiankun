# registerMicroApps

按路由把微应用注册到主应用上。每个应用都绑定一条 `activeRule`，URL 命中时 qiankun 挂载它，不再命中时卸载它。

这是 [`loadMicroApp`](/zh-CN/api/load-micro-app) 之外的路由驱动方案。只有当 URL 应当完全决定应用是否挂载时才使用它；按需加载、组件嵌入和由主应用状态控制的场景优先使用 `loadMicroApp`。

## 函数签名

```ts
function registerMicroApps<T extends ObjectType>(
  apps: Array<RegistrableApp<T>>,
  lifeCycles?: LifeCycles<T>,
): void
```

`registerMicroApps` 只是把这些应用记下来，交给 [single-spa](https://single-spa.js.org/) 托管。在你调用 [start](/zh-CN/api/start) 之前，什么都不会加载。注册和激活是分开的两步：

```ts
import { registerMicroApps, start } from 'qiankun';

registerMicroApps(apps, lifeCycles);
start();
```

## 参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `apps` | `Array<RegistrableApp<T>>` | 是 | 要注册的微应用。字段见 [RegistrableApp 字段](#registrableapp-字段)。 |
| `lifeCycles` | `LifeCycles<T>` | 否 | 全局生命周期钩子，作用于本次调用注册的每一个应用。见[全局生命周期钩子](#全局生命周期钩子)。 |

## RegistrableApp 字段

```ts
type RegistrableApp<T extends ObjectType> = {
  name: string;
  entry: string;                       // HTMLEntry
  container: HTMLElement;
  activeRule: string | ActivityFn | Array<string | ActivityFn>;
  props?: T;
  loader?: (loading: boolean) => void;
  configuration?: AppConfiguration;
};
```

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `name` | `string` | 是 | 路由注册应用稳定且唯一的标识。重名应用会被跳过，因此多次注册时应保持一致；它通常不需要等于 packageName 或 Webpack library 名。见 [`name` 是稳定的唯一标识](#name-是稳定的唯一标识)。 |
| `entry` | `string` | 是 | 微应用 HTML entry 的 URL，比如 `//localhost:7100`。v3 里 `entry` 永远是一个字符串(HTML 地址),2.x 那种 `{ scripts, styles }` 对象写法已经没了。 |
| `container` | `HTMLElement` | 是 | 微应用挂载进去的 DOM 元素——是一个真实的元素，不是选择器字符串。传一个拿到 ref 的节点，或者 `document.getElementById(...)`。 |
| `activeRule` | `string \| ActivityFn \| Array<string \| ActivityFn>` | 是 | 应用什么时候激活，会原样转发给 single-spa 的 `activeWhen`。字符串是路径前缀；函数 `(location) => boolean` 让你完全掌控；数组则是任意一项命中即激活。 |
| `props` | `T` | 否 | 每次生命周期调用(`bootstrap`／`mount`／`unmount`／`update`)时传给微应用的数据。 |
| `loader` | `(loading: boolean) => void` | 否 | 报告加载状态。资源开始加载或应用开始挂载时收到 `true`，挂载完成后收到 `false`。请把参数当作状态处理，因为可能连续收到多次 `true`。 |
| `configuration` | `AppConfiguration` | 否 | 单个应用的运行时配置：`sandbox`、`styleIsolation`、`fetch` 等。见 [AppConfiguration](/zh-CN/api/configuration) 和[单应用配置是唯一的配置入口](#单应用配置是唯一的配置入口)。 |

::: info entry 和 container
`entry` 必须带上宽松的 CORS 响应头，因为 qiankun 要跨域抓取这份 HTML 及其资源。`container` 元素在整个注册生命周期内必须一直挂在页面上——qiankun 在注册时就把这个元素引用记下来了，所以它不能被宿主框架替换掉、加 key 重建、或者卸载掉。
:::

### 关于 `activeRule`

`activeRule` 就是 single-spa 的 `activeWhen`。最常见的写法是一个路径前缀：

```ts
registerMicroApps([
  { name: 'react', entry: '//localhost:7100', container, activeRule: '/react' },
]);
```

前缀表达不了的场景，就上函数或者数组：

```ts
registerMicroApps([
  {
    name: 'react',
    entry: '//localhost:7100',
    container,
    // active on /react as well as any /shop/* route
    activeRule: ['/react', (location) => location.pathname.startsWith('/shop/')],
  },
]);
```

## 全局生命周期钩子

第二个参数对本次调用注册的每一个应用都生效。每个钩子是一个函数(或函数数组)`(app, global) => Promise<void>`:

```ts
registerMicroApps(apps, {
  beforeLoad:    (app) => { console.log('[lifecycle] before load', app.name); return Promise.resolve(); },
  beforeMount:   (app) => { console.log('[lifecycle] before mount', app.name); return Promise.resolve(); },
  afterMount:    (app) => { console.log('[lifecycle] after mount', app.name); return Promise.resolve(); },
  beforeUnmount: (app) => { console.log('[lifecycle] before unmount', app.name); return Promise.resolve(); },
  afterUnmount:  (app) => { console.log('[lifecycle] after unmount', app.name); return Promise.resolve(); },
});
```

第二个参数 `global` 是微应用那份被沙箱隔离的 `window` 视图(也就是 Proxy 隔离膜)，不是真实的 `window`。这些框架层的钩子，和子应用自己导出的 `bootstrap`／`mount`／`unmount` 是两回事。完整说明见[生命周期钩子](/zh-CN/api/lifecycles)和[微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props)。

## 行为

- **按 `name` 去重。** 如果某个应用的 `name` 已经注册过了，它会被跳过，所以用两次 `registerMicroApps` 注册有重叠的应用是安全的。
- **注册到 single-spa。** 每个新应用都会变成一个 single-spa application,`activeWhen` 取 `activeRule`、`customProps` 取 `props`。
- **激活要等 `start()`。** 内部加载器会一直等到你调用 [start](/zh-CN/api/start) 才去加载和挂载。光注册不会有任何可见的效果。
- **`loader` 报告状态，不保证事件次数。** 加载开始时会收到 `true`，需要时挂载前还会再次收到 `true`，挂载完成后收到 `false`。回调应当可以重复执行。
- **`lifeCycles` 作用于整次调用。** 第二个参数里的钩子会作用于本次注册的所有应用。

```mermaid
flowchart TD
  A["registerMicroApps(apps, lifeCycles)"] --> B{"name 已经注册过?"}
  B -- 是 --> C["跳过"]
  B -- 否 --> D["single-spa registerApplication"]
  D --> E["等待 start"]
  F["start"] --> E
  E --> G{"activeRule 命中 URL?"}
  G -- 是 --> H["loading true → 加载并挂载 → loading false"]
  G -- 否 --> I["不再命中时卸载"]
```

## 示例

一套完整的主应用接入：先拿到一个真实的 container 元素，给每个应用配上各自的 `configuration`，最后调一次 `start()`。

::: code-group

```ts [main/src/register.ts]
import { registerMicroApps, start } from 'qiankun';

export function registerAll(
  container: HTMLElement,
  onLoading: (name: string, loading: boolean) => void,
): void {
  registerMicroApps([
    {
      name: 'react',
      entry: '//localhost:7100',
      container,
      activeRule: '/react',
      loader: (loading) => onLoading('react', loading),
      configuration: { sandbox: true, styleIsolation: true },
    },
    {
      name: 'vue',
      entry: '//localhost:7101',
      container,
      activeRule: '/vue',
      loader: (loading) => onLoading('vue', loading),
      configuration: { sandbox: true, styleIsolation: true },
    },
    {
      // 稳定的路由应用标识，不要求等于 output.library.name
      name: 'webpack-app',
      entry: '//localhost:7102',
      container,
      activeRule: '/webpack',
      loader: (loading) => onLoading('webpack-app', loading),
      configuration: { sandbox: true },
    },
  ]);

  start();
}
```

```tsx [main/src/App.tsx]
import { useEffect, useRef } from 'react';
import { registerAll } from './register';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      registerAll(containerRef.current, (name, loading) => {
        console.log(`[${name}] loading: ${loading}`);
      });
    }
    // register once; the container must never be unmounted or keyed
  }, []);

  // 这些 activeRule 彼此互斥，因此可以安全共用容器。
  return <div ref={containerRef} id="subapp-stage" />;
}
```

:::

::: tip 只有互斥路由才能共用容器
只有当多个路由应用的 `activeRule` 不会同时命中时，它们才能共用一个容器。规则重叠时，多个应用可能并发激活，此时必须使用不同容器。所有已注册容器都应在整个会话期间留在 DOM 中。
:::

## 注意事项与坑

### `name` 是稳定的唯一标识

`name` 是 qiankun 和 single-spa 识别路由注册应用的标识，用于注册去重和运行时记录。不同应用不能共用一个名字，同一个应用在多次注册时也应保持名字稳定。

正确标记 entry 脚本后，qiankun 会从入口执行结果解析生命周期：ESM 应用读取模块导出，经典应用读取入口脚本产生的值。这条主要路径不要求 `name` 等于 packageName 或 Webpack 的 `output.library.name`。

只有入口结果里没有合法的生命周期对象时，qiankun 才会最后尝试从 `globalContext[appName]` 兼容回退。应用如果有意依赖这条回退，全局变量的 key 才必须和 `name` 相同；它不是正常的命名契约。完整查找顺序见[微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props)。

### 单应用配置是唯一的配置入口

v3 里没有通过 `start()` 注入的框架级全局配置。`start()` 只接收 single-spa 的 `{ urlRerouteOnly? }`。过去那些作为全局框架选项存在的东西——`sandbox`、`styleIsolation`、自定义 `fetch`——现在一律**按应用**在 `RegistrableApp.configuration` 里设置：

```ts
registerMicroApps([
  {
    name: 'react',
    entry: '//localhost:7100',
    container,
    activeRule: '/react',
    configuration: {
      sandbox: true,          // default true; Proxy-membrane JS isolation
      styleIsolation: true,   // default false; CSS @scope isolation
      // fetch: customFetch,  // optional custom fetch for this app's assets
    },
  },
]);
```

每个字段和默认值见 [AppConfiguration](/zh-CN/api/configuration)。

::: warning 没有 2.x 的 start 选项
`prefetch`、`sandbox: { strictStyleIsolation | experimentalStyleIsolation }`、`singular`、`getPublicPath`、`getTemplate` 这些都是 qiankun 2.x 的 `start` 选项，v3 里它们都不存在了。样式隔离就是一个布尔值 `styleIsolation`，底层用 CSS `@scope` 实现——没有 Shadow DOM 模式。预加载由流式加载器自动完成，所以也没有 `prefetch` 策略可配。见[从 qiankun 2.x 迁移](/zh-CN/cookbook/migrate-from-2x)。
:::

::: info 没有内置的全局状态库
v3 不再自带 `initGlobalState` / `onGlobalStateChange` / `setGlobalState`。要共享状态，就把你自己的方法或者 store 通过 `props` 传给每个应用。见[跨应用共享状态与通信](/zh-CN/cookbook/communicate-between-apps)。
:::

## 参见

- [start](/zh-CN/api/start) —— 激活已注册的应用
- [loadMicroApp](/zh-CN/api/load-micro-app) —— 命令式地挂载应用，而不是按路由
- [AppConfiguration](/zh-CN/api/configuration) —— 单应用的 `sandbox`、`styleIsolation`、`fetch`
- [生命周期钩子(LifeCycles)](/zh-CN/api/lifecycles) —— 全局钩子参考
- [setDefaultMountApp / runAfterFirstMounted](/zh-CN/api/effects) —— 路由／首次挂载相关的副作用
- [类型参考](/zh-CN/api/types) —— `RegistrableApp`、`LoadableApp`、`HTMLEntry`
