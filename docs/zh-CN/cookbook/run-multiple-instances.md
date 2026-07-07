# 运行多个微应用实例

`loadMicroApp` 以命令式的方式挂载微应用，不走由路由驱动的 `registerMicroApps` 流程。由于每次调用都会构建各自独立的沙箱和实例，你可以同时挂载多个不同的微应用，甚至可以把*同一个*微应用在页面上挂载多次。本指南将展示如何安全地做到这一点，以及如何释放每一个实例。

当某个容器是否出现由你自己的 UI 状态（标签页、弹窗、仪表盘、小组件）驱动，而不是由 URL 驱动时，请采用这种方式。对于基于路由的组合，请优先使用 [registerMicroApps](/zh-CN/api/register-micro-apps) 配合 [start](/zh-CN/api/start)。

## 命令式挂载一个应用

`loadMicroApp(app, configuration?, lifeCycles?)` 会返回一个 `MicroApp` 句柄（一个 single-spa parcel）。它会立即开始挂载，并向你提供 `mount`、`unmount`、`update` 以及一系列可等待的生命周期 promise。

```ts [main/src/mount-app.ts]
import { loadMicroApp } from 'qiankun';
import type { MicroApp } from 'qiankun';

const container = document.querySelector('#sub-app') as HTMLElement;

const app: MicroApp = loadMicroApp({
  name: 'app-react',
  entry: 'http://localhost:7101',
  container,
  props: { token: 'abc' },
});

// wait until it is on screen
await app.mountPromise;
```

`container` 是一个 `HTMLElement`，`entry` 是微应用的 HTML URL，而 `props` 会在每次 `mount`/`unmount`/`update` 时传递给子应用的生命周期。如果框架尚未启动，`loadMicroApp` 会自动为你调用 `start()`，这样主应用中的 `pushState`/`replaceState` 就能继续正确地派发 `popstate`。

该句柄暴露了以下成员：

| 成员 | 类型 | 用途 |
| --- | --- | --- |
| `mount()` | `() => Promise<null>` | 在 unmount 之后再次挂载。 |
| `unmount()` | `() => Promise<null>` | 拆除该实例并释放它的副作用。 |
| `update(props)` | `(props) => Promise<any>` | 推送新的 props（仅当子应用导出了 `update` 时）。 |
| `getStatus()` | `() => string` | single-spa parcel 状态，例如 `MOUNTED`、`UNMOUNTING`。 |
| `loadPromise` / `bootstrapPromise` / `mountPromise` / `unmountPromise` | `Promise<null>` | 等待某个特定阶段。 |

完整的签名参见 [loadMicroApp](/zh-CN/api/load-micro-app)，可作为第二个参数传入的选项参见 [AppConfiguration](/zh-CN/api/configuration)。

## 并发挂载多个不同的应用

每一次 `loadMicroApp` 调用都是相互独立的。为每个应用分配各自的容器元素，你就可以同时挂载它们。

```ts [main/src/dashboard.ts]
import { loadMicroApp } from 'qiankun';

const apps = [
  { name: 'app-react', entry: 'http://localhost:7101', container: document.querySelector('#pane-react') as HTMLElement },
  { name: 'app-vue',   entry: 'http://localhost:7102', container: document.querySelector('#pane-vue') as HTMLElement },
].map((app) => loadMicroApp(app));

// later, when the dashboard is dismissed
await Promise.all(apps.map((app) => app.unmount()));
```

每次调用都会构建一个全新的 Proxy 膜（membrane）沙箱以及各自独立的 `instanceId`，因此这些应用不会共享全局状态，也不会覆盖彼此的定时器、监听器或 DOM 补丁。

## 将同一个应用挂载多次

你也可以用相同的 `name` 和 `entry` 多次调用 `loadMicroApp`，将其挂载到*不同的*容器中。

```ts [main/src/multi-instance.ts]
import { loadMicroApp } from 'qiankun';

const left = loadMicroApp({
  name: 'app-react',
  entry: 'http://localhost:7101',
  container: document.querySelector('#left') as HTMLElement,
});

const right = loadMicroApp({
  name: 'app-react',
  entry: 'http://localhost:7101',
  container: document.querySelector('#right') as HTMLElement,
});

await Promise.all([left.mountPromise, right.mountPromise]);
```

### 实例之间的隔离是如何工作的

qiankun 通过一个按名称维护的实例计数器，将同一个应用的并发实例彼此隔离开：

- 每次挂载都会得到一个单调递增的 `instanceId`（由 `genInstanceId` 生成，保存在一个不可枚举的 `window.__agii__` map 上）。容器会被打上 `data-name`、`data-instance-id`（当 `instanceId > 1` 时）以及 `data-mount-times` 标记。
- 经典 JS 沙箱会为每个实例提供一个独立的 Proxy 膜；[ESM 沙箱](/zh-CN/concepts/esm-sandbox)则为每个实例提供唯一的 `instanceKey`/compartment，使其模块通过各自的 import map 条目解析。
- 对于用 webpack 构建的应用，从第二个实例开始，其 `script[src]` 节点上的 `data-webpack` 会被剥离（`removeWebpackChunkCacheWhenAppHaveMultiInstance`）。Webpack 的运行时会以该属性为键缓存已加载的 chunk，从而跳过重复执行；移除它可以强制第二个实例重新求值自己的 bundle，而不是复用第一个实例中已经运行过的模块。

```mermaid
flowchart TD
  A["loadMicroApp('app-react', #left)"] --> B["instanceId 1<br/>全新沙箱 / instanceKey"]
  C["loadMicroApp('app-react', #right)"] --> D["instanceId 2<br/>全新沙箱 / instanceKey"]
  D --> E["剥离 data-webpack →<br/>重新求值 bundle"]
  B --> F["#left 独立渲染"]
  E --> G["#right 独立渲染"]
```

## 记忆化（Memoization）：复用 vs. 全新实例

`loadMicroApp` 会以 `` `${name}-${containerXPath}` `` 为键对已加载的应用进行记忆化。容器的 XPath 在第一次调用时计算一次，并作为该实例的身份标识。

- **不同的容器 ⇒ 全新实例。** 不同的 XPath 意味着一个新的键，因此应用会被重新加载，其生命周期也会被重新求值。这正是上面多实例示例得以生效的原因。
- **复用同一个容器 ⇒ 缓存重挂载。** 将同一个应用渲染进它此前占据过的 DOM 节点时，会复用被缓存的 parcel 配置：`bootstrap` 变为空操作，生命周期不会被重新求值。挂载步骤会重新加载入口 HTML，但*不包含*脚本（它们已经运行过了），只是重新执行 `mount(props)`。

::: tip 为不同的容器保持稳定的位置
实例键派生自容器在文档中的 XPath，只计算一次，并在应用的整个生命周期内保持不变。请让每个实例的容器在 DOM 中处于一个稳定且互不相同的位置，这样两个实例才能解析到不同的键。
:::

## 共享容器上的串行化

如果你把多个应用挂载到*同一个*容器中，qiankun 会将它们串行化。当一个新实例挂载到一个已经存在实例的容器上时，它的挂载步骤会先等待该容器上此前每一个未损坏实例的 `unmountPromise`，然后再进行渲染。这可以防止两个应用同时向同一个节点写入。

::: warning 每个容器只保留一个存活的应用
串行化意味着*下一个*应用会等待上一个应用完成 unmount——它并不会让两个应用在同一个节点里并排运行。若要实现真正并发的渲染，请为每个应用分配各自独立的容器元素。
:::

## 始终 unmount 每一个句柄

`loadMicroApp` 不会自行清理。你有责任对你持有的每一个句柄调用 `unmount()`。

```ts [main/src/lifecycle.ts]
const app = loadMicroApp({ name: 'app-react', entry, container });

// … when the app is no longer needed
await app.unmount();
```

unmount 才是释放沙箱副作用的动作。在 `unmount` 时，每个 patcher 的 `free()` 都会运行：`patchInterval` 清除每一个被追踪的 interval 并恢复原生定时器，`patchWindowListener` 移除应用添加的监听器，`patchHistoryListener` 卸下它的 history 钩子，而 dynamic-append patcher 则拆除注入的节点。随后膜会锁定并恢复应用修改过的所有全局变量，容器 DOM 也会被清空。跳过 `unmount` 会泄漏定时器、监听器和 DOM，并破坏重挂载与多实例行为。

::: danger ESM 实例只有在 `unload` 时才会被完全释放，而 parcel 没有 `unload`
ESM 沙箱的 `dispose()`——它会撤销该实例的 blob URL 并注销其 realm——挂接在 single-spa 的 `unload` 生命周期上，而不是 `unmount`。`loadMicroApp` 返回的是一个 parcel，而 parcel 没有 `unload` 语义，因此一个 ESM 实例的引擎、blob URL 和 import map 条目会在 `unmount` 之后依然残留，直到你丢弃对该句柄的所有引用、让它被垃圾回收为止。在反复创建 ESM 实例的长期存活的壳应用中，这会不断累积 import map 条目。在可能的情况下，请复用容器（缓存重挂载），而不是每次都创建一个全新的实例，并释放那些你已用完的句柄。
:::

## ESM 多实例注意事项

原生 ESM 子应用在真正并发的场景下还有一个额外的限制。ESM 引擎通过一个全局单锁，将异步创建的元素（例如求值期间的 `document.createElement`）归属到当前活跃的沙箱。合成 specifier 前缀可以让每个实例的*模块图*保持隔离，但当同一个应用的两个 ESM 实例在同一时刻求值时，它并不能完全解决元素的*归属*问题。

::: warning 为并发的 ESM 实例隔离容器
同时运行同一个 ESM（Vite 风格）微应用的多个并发实例，是一个已知的 v1 限制。请优先将每个实例隔离在各自的容器中，并避免它们的初始求值发生重叠。如果你确实需要许多同时存在的实例，目前经典/UMD 构建是更可预测的路径。底层机制参见 [ESM 沙箱](/zh-CN/concepts/esm-sandbox)。
:::

::: info 没有内置的跨实例状态
qiankun v3 不再内置全局状态存储——2.x 中的 `initGlobalState`/`onGlobalStateChange` 已不存在。请通过 `props` 向每个实例传入数据，并用 `app.update(props)` 更新它。参见 [在应用之间共享状态与通信](/zh-CN/cookbook/communicate-between-apps)。
:::

## 相关内容

- [loadMicroApp](/zh-CN/api/load-micro-app) —— 完整的 API 参考。
- [JS 沙箱](/zh-CN/concepts/js-sandbox) —— 逐实例隔离是如何构建的。
- [ESM 沙箱](/zh-CN/concepts/esm-sandbox) —— 原生 `<script type="module">` 的执行及其多实例限制。
- [微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props) —— mount、unmount 和重挂载时分别运行了什么。
