# loadMicroApp

`loadMicroApp` 是 qiankun 推荐的微应用加载 API。它将微应用挂载到指定的 DOM 元素，并返回管理该实例的句柄。页面区域、标签页、弹窗，以及由主应用状态控制的微应用，均可采用这一方式。

仅当应用必须根据 URL 自动激活时，才需要使用 [registerMicroApps](/zh-CN/api/register-micro-apps) 和 [`start`](/zh-CN/api/start)。

[React `<MicroApp>`](/zh-CN/ecosystem/react) 和 [Vue `<MicroApp>`](/zh-CN/ecosystem/vue) 组件均基于该函数实现。

## 函数签名

```ts
function loadMicroApp<T extends ObjectType>(
  app: LoadableApp<T>,
  configuration?: AppConfiguration,
  lifeCycles?: LifeCycles<T>,
): MicroApp;
```

`loadMicroApp` 返回一个 `MicroApp` 句柄，在 single-spa Parcel 的基础上提供 `unload()` 销毁方法。该句柄可用于查询状态、卸载和销毁应用。函数不会等待加载和挂载完成；如需确定各阶段的完成时机，应等待句柄中对应的 Promise。

## 参数

### `app: LoadableApp<T>`

用于描述待加载的微应用及其挂载位置。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `name` | `string` | 是 | 微应用名称。多个实例可以复用名称；只有并发挂载的实例需要使用不同容器。 |
| `entry` | `string` | 是 | 微应用 HTML 入口的 URL。仅支持字符串；v3 不再支持 2.x 的对象形式（`{ scripts, styles }`）。 |
| `container` | `HTMLElement` | 是 | 用于渲染微应用的 DOM 元素。必须传入实际元素，不能使用 CSS 选择器字符串。 |
| `props` | `T` | 否 | 传递给微应用生命周期函数的数据。 |

```ts
type ObjectType = Record<string, unknown>;

type LoadableApp<T extends ObjectType> = {
  name: string;
  entry: string;
  container: HTMLElement;
  props?: T;
};
```

::: warning `container` 必须是元素
在 qiankun v3 中，`container` 的类型为 `HTMLElement`，不再接受 `string | HTMLElement`。调用前应通过 `document.getElementById(...)` 或框架提供的 ref 获取实际元素。传入选择器字符串会导致类型错误，运行时也无法正常挂载。
:::

### `configuration?: AppConfiguration`

单个应用的运行时配置。所有配置项均为可选，默认值由 qiankun 内部处理。

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `sandbox` | `boolean \| SandboxConfiguration` | `true` | 启用基于 Proxy 隔离膜的 [JavaScript 隔离](/zh-CN/concepts/js-sandbox)和[原生 ESM 支持](/zh-CN/concepts/esm-sandbox)。仅当旧应用必须在真实全局对象中运行时，才应设为 `false`；传入对象则在保持隔离的同时配置沙箱。 |
| `fetch` | `typeof window.fetch` | `window.fetch` | 用于请求入口，以及由加载器处理的脚本、模块和样式的自定义 fetch。 |
| `loadTimeout` | `number` | `0`（关闭） | 加载阶段的超时，单位为毫秒。计时不包含等待容器，也不约束 `bootstrap`、`mount` 和 `unmount`，详见 [AppConfiguration](/zh-CN/api/configuration#loadtimeout)。 |
| `streamTransformer` | `() => TransformStream<string, string>` | — | 用于自定义 HTML 流式处理过程的可选转换流。 |
| `nodeTransformer` | `NodeTransformer` | 内部默认值 | 在 `<script>`、`<link>` 和 `<style>` 节点进入真实 DOM 前进行转换。仅高级扩展场景需要覆盖。 |

```ts
type AppConfiguration =
  Partial<Pick<LoaderOpts, 'fetch' | 'streamTransformer' | 'nodeTransformer'>> & {
    sandbox?: boolean | SandboxConfiguration;
    loadTimeout?: number;
  };
```

`sandbox` 是隔离能力的统一入口。它的对象形式承载 `styleIsolation`、`globals`、`incubatorContext`、`plugins` 以及 Compartment 模块钩子：

```ts
loadMicroApp(app, {
  sandbox: {
    styleIsolation: true,
    globals: { TENANT_ID: 'acme' },
  },
});
```

完整的配置参考见 [AppConfiguration](/zh-CN/api/configuration)。

### `lifeCycles?: LifeCycles<T>`

可选的生命周期钩子，在该应用加载、挂载和卸载的相应阶段触发。每个钩子可以是单个函数或函数数组，签名均为 `(app, global)`，其中 `global` 表示经过沙箱隔离的 `window` 视图。

```ts
type LifeCycleFn<T extends ObjectType> = (app: LoadableApp<T>, global: WindowProxy) => Promise<void>;

type LifeCycles<T extends ObjectType> = {
  beforeLoad?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  beforeMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  afterMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  beforeUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  afterUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
};
```

细节见[生命周期钩子](/zh-CN/api/lifecycles)。

## 返回值

`loadMicroApp` 返回的 `MicroApp` 扩展了 single-spa 的 Parcel 句柄：

```ts
type MicroApp = Parcel & { unload(): Promise<void> };

type Parcel = {
  mount(): Promise<null>;
  unmount(): Promise<null>;
  update?(customProps: object): Promise<any>;
  getStatus():
    | 'NOT_LOADED'
    | 'LOADING_SOURCE_CODE'
    | 'NOT_BOOTSTRAPPED'
    | 'BOOTSTRAPPING'
    | 'NOT_MOUNTED'
    | 'MOUNTING'
    | 'MOUNTED'
    | 'UPDATING'
    | 'UNMOUNTING'
    | 'UNLOADING'
    | 'SKIP_BECAUSE_BROKEN'
    | 'LOAD_ERROR';
  loadPromise: Promise<null>;
  bootstrapPromise: Promise<null>;
  mountPromise: Promise<null>;
  unmountPromise: Promise<null>;
};
```

| 成员 | 说明 |
| --- | --- |
| `mount()` | 挂载该 Parcel。`loadMicroApp` 会在加载时自动挂载，因此通常无需直接调用。与 `unmount()` 按调用顺序逐个执行；轮到执行时应用已经挂载，则以 [`app-already-mounted`](/zh-CN/errors/app-already-mounted) 拒绝；重新挂载失败时，以挂载错误拒绝。 |
| `unmount()` | 卸载应用、停用沙箱，并清理可追踪的副作用和容器 DOM。已加载的实例会保留，供重新挂载或同名应用复用。挂载尚未完成时也可以调用：请求会立即登记，等这次挂载结束后再卸载。轮到执行时应用没有处于挂载状态，则以 [`app-not-mounted`](/zh-CN/errors/app-not-mounted) 拒绝；如果原因是前一次挂载失败，错误的 `cause` 就是那次挂载错误。 |
| `unload()` | 先卸载已挂载的应用，再销毁该句柄所用的实例及其缓存，句柄随之失效。销毁范围见[下方说明](#unload)。 |
| `update?(props)` | 仅当微应用导出 `update` 生命周期时存在，用于向运行中的应用传递新的 props。 |
| `getStatus()` | 返回当前生命周期状态，取值范围为上述联合类型。 |
| `loadPromise` | 表示源码加载阶段完成的 Promise。 |
| `bootstrapPromise` | 表示 bootstrap 阶段完成的 Promise。 |
| `mountPromise` | 表示挂载阶段完成的 Promise。可等待该 Promise，以确认应用已完成渲染。 |
| `unmountPromise` | 表示卸载阶段完成的 Promise。 |

::: warning 处理 Promise 拒绝
加载或挂载失败时，这些 Promise 会被拒绝。应通过 `.catch` 或 `try...catch` 处理错误，避免产生未处理的 Promise 拒绝。
:::

## 行为 {#behavior}

- **调用后立即开始加载和挂载。** 无需预先调用 `start()`；如需等待应用完成渲染，应等待 `mountPromise`。
- **一个容器在同一时刻只承载一个应用。** 如果连续向同一容器加载应用，后一个实例会等待前一个实例卸载。
- **同名应用会复用已卸载的实例。** 以相同的 `name` 和 `entry` 再次调用时，如果该应用有已卸载、处于空闲状态的实例，qiankun 会把它挂载到本次传入的容器，不再重新加载入口，也不再调用 `bootstrap`。没有空闲实例时，已调用 `unmount()` 但尚未卸载完成的实例（包括仍在挂载中的实例）也会被复用，新实例等它卸载完成后再挂载。只有同时挂载的实例才会各自加载一份。因此同一 `name` 应始终指向同一个应用，每次挂载所需的状态应在 `mount()` 中初始化。
- **调用方负责卸载。** 不再展示应用时调用 `unmount()`，官方 `<MicroApp>` 组件也是这样做的。需要释放已加载的资源时，再调用 `unload()` 或 `unloadMicroApp(name)`。
- **`bootstrap` 失败的实例会被销毁。** 共用这次 `bootstrap` 的调用都以同一个错误拒绝；保留的句柄之后再调用，以 `app-unloaded` 拒绝，错误的 `cause` 是那次 `bootstrap` 错误。再次调用 `loadMicroApp` 会重新加载入口，并重新执行 `bootstrap`。
- **刚失败的应用不会立即重新加载。** 同一 `name` 和 `entry` 的加载或 `bootstrap` 失败后，约 1 秒内再次调用 `loadMicroApp` 不会被拒绝，但加载会延后到这段冷却期结束再开始，避免重渲染循环或密集重试反复请求入口。冷却期从失败时开始计算，不因新的调用而延长；同一应用有实例加载并 `bootstrap` 成功后，冷却期随即结束；等待期间调用 `unload()` 会取消这次加载。

多实例、复用和重新挂载的完整建议见[运行多个微应用实例](/zh-CN/cookbook/run-multiple-instances)。

## 销毁实例：unload 和 unloadMicroApp {#unload}

`unmount()` 之后，qiankun 仍保留已加载的实例，包括生命周期、沙箱和缓存。同名应用再次加载时直接复用这些实例，不重新执行入口。实例会一直保留到主应用主动销毁；需要释放时，调用句柄的 `unload()` 或 `unloadMicroApp(name)`。官方 `<MicroApp>` 组件销毁时只调用 `unmount()`，不会销毁实例。

两种方式的销毁范围不同：

- **`unload()` 只销毁该句柄所用的那份实例。** 一份实例可能被多个句柄共用，例如在同一容器上排队的句柄，以及复用它的后续调用返回的句柄。这些句柄一并失效，其中尚在排队的直接取消。同名应用的其他实例不受影响。
- **`unloadMicroApp(name)` 销毁该名称下全部手动加载的实例**，包括正在挂载的和卸载后闲置的。

销毁后再次调用 `loadMicroApp`，会重新请求入口和资源，并重新执行脚本。

已挂载的实例会先执行 `unmount`，排队实例则直接取消，无需等待它们挂载。已经开始执行的 `bootstrap`、`mount`、`unmount` 和 `update` 无法中途打断，销毁会等它们结束；挂载中途被取消的实例会先完成卸载、清空容器，再把容器交给后续实例。

```ts
import { loadMicroApp, unloadMicroApp } from 'qiankun';

const app = loadMicroApp({ name: 'app1', entry, container });
await app.mountPromise;
await app.unload();

// 未保留句柄时，按名称销毁该应用的全部实例。
await unloadMicroApp('app1');
```

`unloadMicroApp` 的函数签名如下：

```ts
function unloadMicroApp(name: string): Promise<void>;
```

销毁后，失效句柄的 `getStatus()` 返回 `NOT_LOADED`；`mount()`、`unmount()` 和已有的 `update()` 方法以 `app-unloaded` 拒绝。尚未完成的 `mountPromise` 也会拒绝。销毁时还在排队的请求中，`unmount()` 由销毁流程代为完成，`mount()` 以 `app-unloaded` 拒绝。重复调用同一句柄的 `unload()` 会返回同一个销毁结果，不会影响之后新建的实例。没有对应实例时，`unloadMicroApp` 直接完成；某个实例清理失败时，它会等全部实例销毁结束，再以第一个错误拒绝。

销毁会清理容器节点（包括 `qiankun-head`）、框架追踪的副作用、沙箱隔离膜和配置引用、ESM 模块缓存、blob URL，以及该实例注入的 import map 脚本。入口和资源的 fetch 缓存同时失效；仍被其他实例使用的共享请求不会被中止。调用方也应释放自己持有的句柄、props 和其他引用。

销毁会撤销隔离膜。销毁前已经排入队列的 `setTimeout`、`requestAnimationFrame` 和 Promise 回调如果在之后才执行，访问 `window` 等全局对象时会抛出 `TypeError`。微应用应在自己的 `unmount` 中清理这些挂起的异步回调。

浏览器已经注册的原生 import map 条目及模块注册表无法通过 qiankun 撤销。移除注入脚本、撤销 blob URL 不等于清空浏览器模块注册表；重新加载会使用新的实例标识。机制限制见 [ESM 沙箱 RFC 第 11 节](https://github.com/umijs/qiankun/blob/next/docs/rfcs/esm-sandbox.md)。关闭沙箱（`sandbox: false`）时，微应用写入真实全局对象的状态也无法由 qiankun 自动回滚。

`unloadMicroApp` 只管理 `loadMicroApp` 创建的实例。路由注册应用应使用 [registerMicroApps](/zh-CN/api/register-micro-apps#unload-application) 页面说明的 `unloadApplication`。

## 示例

以下示例先获取 `container` 元素并挂载应用，不再需要该应用时将其销毁。

```ts
import { loadMicroApp } from 'qiankun';

const container = document.getElementById('micro-app-slot');
if (!container) throw new Error('container not found');

const microApp = loadMicroApp(
  {
    name: 'app1',
    entry: 'http://localhost:7101',
    container,
    props: { userId: 42 },
  },
  { sandbox: true },
);

// 等待应用完成挂载
await microApp.mountPromise;
console.log(microApp.getStatus()); // 'MOUNTED'

// 不再需要时销毁实例
await microApp.unload();
```

如果旧应用无法在隔离环境中运行，可以关闭沙箱：

```ts
const microApp = loadMicroApp(
  { name: 'legacy-app', entry: 'http://localhost:7200', container },
  { sandbox: false },
);
```

::: tip React 和 Vue 组件
如果主应用使用 React 或 Vue，也可以使用对应的 [`<MicroApp>`](/zh-CN/ecosystem/react) 组件管理容器引用、props 更新和实例卸载。组件内部采用与 `loadMicroApp` 相同的实例模型。
:::

## 相关内容

- [registerMicroApps](/zh-CN/api/register-micro-apps)——根据路由自动激活和卸载应用。
- [start](/zh-CN/api/start)——`loadMicroApp` 会自动调用该函数；路由驱动应用则需要显式调用。
- [AppConfiguration](/zh-CN/api/configuration)——完整的配置项参考。
- [生命周期钩子](/zh-CN/api/lifecycles)——`LifeCycles` 钩子的完整说明。
- [微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props)——props 的传递方式与微应用生命周期。
- [运行多个微应用实例](/zh-CN/cookbook/run-multiple-instances)——在同一页面运行多个实例的方法。
