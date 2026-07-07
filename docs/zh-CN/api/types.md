# 类型参考

qiankun 从其公共入口（`packages/qiankun/src/types.ts`）导出的每个类型，外加运行时依赖的 `Window` 增强声明。这些类型全部从包根部重新导出，因此你可以直接导入：

```ts
import type {
  ObjectType,
  HTMLEntry,
  AppMetadata,
  LoadableApp,
  RegistrableApp,
  AppConfiguration,
  LifeCycleFn,
  LifeCycles,
  MicroApp,
  MicroAppLifeCycles,
  PrefetchStrategy,
} from 'qiankun';
```

::: warning 从 qiankun 2.x 迁移
有三处结构发生了变化，如果你原样移植 2.x 代码，将会产生类型错误：

- `entry` 是一个纯字符串（`HTMLEntry = string`）。不存在对象形式的 entry（`{ scripts, styles }`），也没有 `EntryOpts`。
- `container` 是一个 `HTMLElement`。像 `'#subapp-viewport'` 这样的选择器字符串不再被接受。
- 不存在 `FrameworkConfiguration` 类型。单个应用的配置是 `AppConfiguration`，而 `start()` 只接受 single-spa 的 `StartOpts`。

完整清单请参阅[从 qiankun 2.x 迁移](/zh-CN/cookbook/migrate-from-2x)。
:::

## 类型总览

| 类型 | 结构 | 说明 |
| --- | --- | --- |
| `ObjectType` | `Record<string, unknown>` | props 泛型 `T` 的基础约束。 |
| `HTMLEntry` | `string` | 微应用的 HTML entry URL。仅支持字符串。 |
| `AppMetadata` | `{ name; entry }` | 微应用的最小身份标识。 |
| `LoadableApp<T>` | `AppMetadata & { container; props? }` | 与 [`loadMicroApp`](/zh-CN/api/load-micro-app) 配合使用。`container` 是一个 `HTMLElement`。 |
| `RegistrableApp<T>` | `LoadableApp<T> & { loader?; activeRule; configuration? }` | 与 [`registerMicroApps`](/zh-CN/api/register-micro-apps) 配合使用。 |
| `AppConfiguration` | loader 选项 `& { sandbox?; globalContext?; styleIsolation? }` | 单个应用的运行时配置。参阅 [AppConfiguration](/zh-CN/api/configuration)。 |
| `LifeCycleFn<T>` | `(app, global) => Promise<void>` | 单个框架级 lifecycle 钩子。 |
| `LifeCycles<T>` | `{ beforeLoad?; beforeMount?; afterMount?; beforeUnmount?; afterUnmount? }` | 框架级钩子。参阅[生命周期钩子](/zh-CN/api/lifecycles)。 |
| `MicroApp` | single-spa `Parcel` | `loadMicroApp` 返回的句柄。 |
| `MicroAppLifeCycles` | `{ bootstrap; mount; unmount; update? }` | 微应用自身提供的 lifecycle 导出。 |
| `PrefetchStrategy` | `boolean \| 'all' \| string[] \| fn` | 为向后兼容而导出；任何 v3 API 都不再使用它。 |

## ObjectType

```ts
export type ObjectType = Record<string, unknown>;
```

在 qiankun 接受 props 泛型 `T` 的所有场景中使用的约束。当你为自己的 props 对象定义类型时，它必须扩展自 `ObjectType`：

```ts
type Props = { userId: number; theme: 'light' | 'dark' };
// Props satisfies Record<string, unknown>, so it is a valid T
```

## HTMLEntry

```ts
export type HTMLEntry = string;
```

微应用的 entry 始终是其 HTML 文档的 URL。qiankun 通过 [HTML Entry 加载器](/zh-CN/concepts/html-entry-loading)以流式方式处理该 HTML，并执行其中引用的脚本。

```ts
const entry: HTMLEntry = 'http://localhost:7100';
```

::: danger 不支持对象形式的 entry
qiankun 2.x 的 `entry: { scripts: [...], styles: [...] }` 形式在 v3 中不复存在。将 `entry` 指向一个 HTML 页面，让加载器自行发现其资源。
:::

## AppMetadata

```ts
export type AppMetadata = {
  name: string;
  entry: HTMLEntry;
};
```

微应用的最小描述符：一个唯一的 `name` 和它的 HTML `entry`。`AppMetadata` 是 `LoadableApp` 和 `RegistrableApp` 所扩展的基础，也是 [`prefetchApps`](/zh-CN/api/prefetch-apps) 接受的元素类型。

## LoadableApp

```ts
export type LoadableApp<T extends ObjectType> = AppMetadata & {
  container: HTMLElement;
  props?: T;
};
```

用于以命令式方式通过 [`loadMicroApp`](/zh-CN/api/load-micro-app) 挂载应用的描述符。

| 字段 | 类型 | 描述 |
| --- | --- | --- |
| `name` | `string` | 唯一的微应用名称。 |
| `entry` | `HTMLEntry` | HTML entry URL。 |
| `container` | `HTMLElement` | 应用挂载到的 DOM 元素。必须是元素，而不是选择器。 |
| `props` | `T`（可选） | 转发给微应用 lifecycle 导出的 props。 |

```ts
import { loadMicroApp } from 'qiankun';

const container = document.getElementById('subapp')!;
const app = loadMicroApp<{ userId: number }>({
  name: 'app1',
  entry: 'http://localhost:7100',
  container,
  props: { userId: 42 },
});
```

::: warning container 是一个 HTMLElement
`container: '#subapp'` 在 2.x 中可以编译通过，但在 v3 中是类型错误。请自行解析出元素，例如通过 `document.getElementById(...)` 或框架的 ref。
:::

## RegistrableApp

```ts
export type RegistrableApp<T extends ObjectType> = LoadableApp<T> & {
  loader?: (loading: boolean) => void;
  activeRule: RegisterApplicationConfig['activeWhen'];
  configuration?: AppConfiguration;
};
```

用于交给 [`registerMicroApps`](/zh-CN/api/register-micro-apps) 的、由路由驱动的应用的描述符。它在 `LoadableApp` 的基础上扩展了三个路由/加载相关的字段。

| 字段 | 类型 | 描述 |
| --- | --- | --- |
| `loader` | `(loading: boolean) => void`（可选） | 在挂载前以 `true`、挂载后以 `false` 调用，便于你驱动加载指示器。 |
| `activeRule` | single-spa `Activity` | 应用何时处于激活状态。可以是路径前缀字符串、`(location) => boolean` 函数，或两者混合的数组。 |
| `configuration` | `AppConfiguration`（可选） | 单个应用的运行时配置，会合并覆盖框架默认值。 |

`activeRule` 是 single-spa 的 `activeWhen` 类型 —— `string | ((location: Location) => boolean) | Array<string | ((location: Location) => boolean)>`：

```ts
import { registerMicroApps } from 'qiankun';

registerMicroApps([
  {
    name: 'app1',
    entry: 'http://localhost:7100',
    container: document.getElementById('subapp')!,
    activeRule: '/app1',
    configuration: { sandbox: true, styleIsolation: true },
  },
]);
```

## AppConfiguration

```ts
export type AppConfiguration = Partial<
  Pick<LoaderOpts, 'fetch' | 'streamTransformer' | 'nodeTransformer'>
> & {
  sandbox?: boolean;
  globalContext?: WindowProxy;
  styleIsolation?: boolean;
};
```

单个应用的运行时配置。它是 [`loadMicroApp`](/zh-CN/api/load-micro-app) 的第二个参数，也是 `RegistrableApp` 的 `configuration` 字段。

| 字段 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `fetch` | `typeof window.fetch` | `window.fetch` | 用于 entry 和资源请求的自定义 fetch。qiankun 会将其包装为可缓存、可重试，并在非 2xx 响应时抛出错误。 |
| `streamTransformer` | `() => TransformStream<string, string>` | `undefined` | 在 HTML 流加载时接入其中的一个 transform。 |
| `nodeTransformer` | `<T extends Node>(node: T, opts) => T` | 内置默认值 | 在每个 script/link/style 节点进入真实 DOM 之前对其进行改写。默认实现会运行 `transpileAssets`。 |
| `sandbox` | `boolean` | `true` | 启用 [JS 沙箱](/zh-CN/concepts/js-sandbox)膜，并在适用场景下启用 [ESM 沙箱](/zh-CN/concepts/esm-sandbox)。 |
| `globalContext` | `WindowProxy` | `window` | 沙箱膜所代理的基础全局对象。 |
| `styleIsolation` | `boolean` | `false` | 启用作用域限定于应用容器的运行时 CSS `@scope` [样式隔离](/zh-CN/concepts/style-isolation)。 |

前三个字段来自加载器的 `LoaderOpts`。默认值在 `loadApp` 内部解析，而非在类型中体现。详情请参阅专门的 [AppConfiguration](/zh-CN/api/configuration) 页面。

::: danger 没有 sandbox 对象，也没有 FrameworkConfiguration
`sandbox` 是一个布尔值。2.x 的对象形式 `sandbox: { strictStyleIsolation, experimentalStyleIsolation }` 以及 Shadow DOM 隔离都已移除。样式隔离是独立的布尔值 `styleIsolation`，通过 CSS `@scope` 实现。不存在 `FrameworkConfiguration` 类型，且 `start()` 不接受任何 sandbox、prefetch 或单例相关的选项。
:::

## LifeCycleFn 与 LifeCycles

```ts
export type LifeCycleFn<T extends ObjectType> = (
  app: LoadableApp<T>,
  global: WindowProxy,
) => Promise<void>;

export type LifeCycles<T extends ObjectType> = {
  beforeLoad?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  beforeMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  afterMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  beforeUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  afterUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
};
```

你作为可选的最后一个参数传给 `registerMicroApps` 和 `loadMicroApp` 的框架级钩子。每个钩子可以是一个函数或一个函数数组，按顺序执行。第二个参数 `global` 是该应用经沙箱代理的 `window`，而非真实的 `window`。

```ts
const lifeCycles: LifeCycles<Record<string, unknown>> = {
  beforeLoad: async (app) => console.log('before load', app.name),
  afterMount: [
    async (app, global) => console.log('mounted into', app.container, global),
  ],
};
```

::: info 两种不同的 lifecycle 类型
`LifeCycles`（上面的五个框架级钩子）与 `MicroAppLifeCycles`（微应用自身导出的 `bootstrap`/`mount`/`unmount`/`update`）是相互独立的。参阅[微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props)。
:::

## MicroApp

```ts
import type { Parcel } from 'single-spa';
export type MicroApp = Parcel;
```

[`loadMicroApp`](/zh-CN/api/load-micro-app) 返回的句柄。它是 single-spa 的 `Parcel`，为你提供命令式控制能力以及每个阶段对应的 promise。

| 成员 | 类型 | 描述 |
| --- | --- | --- |
| `mount()` | `() => Promise<null>` | 挂载应用。 |
| `unmount()` | `() => Promise<null>` | 卸载应用。 |
| `update?(props)` | `(props) => Promise<any>` | 当应用导出了 `update` 钩子时，推送新的 props。 |
| `getStatus()` | `() => Status` | 当前的 lifecycle 状态（下方为联合类型）。 |
| `loadPromise` | `Promise<null>` | 源代码加载完成时 resolve。 |
| `bootstrapPromise` | `Promise<null>` | bootstrap 完成时 resolve。 |
| `mountPromise` | `Promise<null>` | mount 完成时 resolve。 |
| `unmountPromise` | `Promise<null>` | unmount 完成时 resolve。 |

`getStatus()` 返回 single-spa 的其中一个状态字符串：

```ts
type Status =
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
```

```ts
const app = loadMicroApp({ name: 'app1', entry, container });
await app.mountPromise;
console.log(app.getStatus()); // 'MOUNTED'
await app.unmount();
```

## MicroAppLifeCycles

```ts
type ExtraProps = { container: HTMLElement };
export type MicroAppLifeCycles = FlattenArrayValue<ParcelLifeCycles<ExtraProps>>;
```

微应用导出给 qiankun 用以驱动它的 lifecycle 对象的结构。在展平 single-spa 的数组形式后，它解析为：

```ts
type MicroAppLifeCycles = {
  bootstrap: (props) => Promise<void>;
  mount: (props) => Promise<void>;
  unmount: (props) => Promise<void>;
  update?: (props) => Promise<void>;
};
```

每个函数都会接收到 mount props，其中包含 `container: HTMLElement`（要渲染进去的节点）以及你通过 `props` 传入的任何内容。微应用的 entry 导出这些函数：

```ts
export async function bootstrap() {}
export async function mount(props: { container: HTMLElement }) {
  render(props.container);
}
export async function unmount(props: { container: HTMLElement }) {
  unmount(props.container);
}
```

## PrefetchStrategy

```ts
export type PrefetchStrategy =
  | boolean
  | 'all'
  | string[]
  | ((apps: AppMetadata[]) => {
      criticalAppNames: string[];
      minorAppsName: string[];
    });
```

::: warning 已导出但未使用
`PrefetchStrategy` 是一个为源码兼容而保留的遗留类型。没有任何 v3 公共 API 消费它 —— 流式加载器会自动预加载，而 [`prefetchApps`](/zh-CN/api/prefetch-apps) 已被弃用。这里对它进行说明，仅仅是因为它仍然被导出。
:::

## Window 增强声明

qiankun 会对全局 `Window` 接口进行增强。微应用正是通过这些属性来检测自己运行在 qiankun 之下，运行时也借此与基于 zone 的框架协作。

```ts
declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
    __INJECTED_PUBLIC_PATH_BY_QIANKUN__?: string;
    __QIANKUN_DEVELOPMENT__?: boolean;
    Zone?: CallableFunction;
    __zone_symbol__setTimeout?: Window['setTimeout'];
  }
}
```

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| `__POWERED_BY_QIANKUN__` | `boolean` | 当应用运行在 qiankun 内部时，会被设置到沙箱化的全局对象上。读取它可以区分独立运行与被嵌入运行的行为分支。 |
| `__INJECTED_PUBLIC_PATH_BY_QIANKUN__` | `string` | qiankun 注入的运行时 public path，使应用能够从正确的源解析其资源。 |
| `__QIANKUN_DEVELOPMENT__` | `boolean` | 当 qiankun 以开发模式运行时被设置，用于启用额外的开发期诊断。 |
| `Zone` | `CallableFunction` | 当 zone.js 被加载时存在（例如 Angular）。qiankun 会将其纳入考量，以保证被打过补丁的定时器行为正确。 |
| `__zone_symbol__setTimeout` | `Window['setTimeout']` | zone.js 保存的对原始 `setTimeout` 的引用，在 zone.js 生效时用于访问未被打补丁的定时器。 |

微应用通常会读取前两个属性以在运行时进行适配：

```ts
// Inside the micro-app
if (window.__POWERED_BY_QIANKUN__) {
  // running under qiankun: export bootstrap/mount/unmount
} else {
  // running standalone
  render(document.getElementById('root'));
}

// Align the module public path with qiankun's injected value (webpack)
if (window.__POWERED_BY_QIANKUN__) {
  // eslint-disable-next-line no-undef, camelcase
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

::: tip 全局增强是自动生效的
从 `qiankun` 导入任何内容都会引入这个 `declare global` 块，因此无需额外设置，`window.__POWERED_BY_QIANKUN__` 在你的项目中就已具备类型。在不依赖 `qiankun` 的微应用中，请自行添加一个包含相同属性的 `declare global` 块。
:::

## 参见

- [AppConfiguration](/zh-CN/api/configuration) —— 深入讲解每个配置字段
- [生命周期钩子（LifeCycles）](/zh-CN/api/lifecycles) —— 框架级钩子参考
- [registerMicroApps](/zh-CN/api/register-micro-apps) 与 [loadMicroApp](/zh-CN/api/load-micro-app) —— 这些类型被消费的地方
- [微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props) —— mount props 如何流转到微应用
- [从 qiankun 2.x 迁移](/zh-CN/cookbook/migrate-from-2x) —— 集中一处的破坏性类型变更
