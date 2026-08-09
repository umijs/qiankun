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

`loadMicroApp` 返回一个 `MicroApp` 句柄，其底层类型为 single-spa Parcel。该句柄可用于查询状态和卸载应用。函数不会等待加载和挂载完成；如需确定各阶段的完成时机，应等待句柄中对应的 Promise。

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
| `streamTransformer` | `() => TransformStream<string, string>` | — | 用于自定义 HTML 流式处理过程的可选转换流。 |
| `nodeTransformer` | `NodeTransformer` | 内部默认值 | 在 `<script>`、`<link>` 和 `<style>` 节点进入真实 DOM 前进行转换。仅高级扩展场景需要覆盖。 |

```ts
type AppConfiguration =
  Partial<Pick<LoaderOpts, 'fetch' | 'streamTransformer' | 'nodeTransformer'>> & {
    sandbox?: boolean | SandboxConfiguration;
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

`loadMicroApp` 返回 `MicroApp`，即 single-spa 的 Parcel 句柄：

```ts
type MicroApp = Parcel;

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
| `mount()` | 挂载该 Parcel。`loadMicroApp` 会在加载时自动挂载，因此通常无需直接调用。 |
| `unmount()` | 卸载应用、停用沙箱，并清理可追踪的副作用和容器 DOM。不再使用应用时必须调用。 |
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
- **相同名称和容器可能复用已加载内容。** 不应依赖模块顶层代码在重新挂载时再次执行；每次挂载所需的状态应在 `mount()` 中初始化。
- **调用方负责卸载。** 不再展示应用时应调用 `unmount()`，以便 qiankun 清空容器并释放能够追踪的资源和副作用。

多实例、复用和重新挂载的完整建议见[运行多个微应用实例](/zh-CN/cookbook/run-multiple-instances)。

## 示例

以下示例先获取 `container` 元素并挂载应用，在不再需要该应用时将其卸载。

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

// 不再需要时卸载应用
await microApp.unmount();
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
