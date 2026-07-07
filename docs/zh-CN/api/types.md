# 类型参考

qiankun 从公共出口(`packages/qiankun/src/types.ts`)导出的全部类型，再加上运行时依赖的那几处 `Window` 扩展。这些类型都从包根重新导出，直接引入即可：

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

::: warning 从 qiankun 2.x 过来的注意
有三处形状变了，2.x 的代码原样搬过来会报类型错误：

- `entry` 是纯字符串(`HTMLEntry = string`)。没有对象形式的入口(`{ scripts, styles }`)，也没有 `EntryOpts`。
- `container` 是 `HTMLElement`。像 `'#subapp-viewport'` 这样的选择器字符串不再接受。
- 没有 `FrameworkConfiguration` 这个类型了。单个应用的配置是 `AppConfiguration`，而 `start()` 只接收 single-spa 的 `StartOpts`。

完整清单见[从 qiankun 2.x 迁移](/zh-CN/cookbook/migrate-from-2x)。
:::

## 类型总览

| 类型 | 形状 | 说明 |
| --- | --- | --- |
| `ObjectType` | `Record<string, unknown>` | props 泛型 `T` 的基础约束。 |
| `HTMLEntry` | `string` | 微应用的 HTML 入口地址。只能是字符串。 |
| `AppMetadata` | `{ name; entry }` | 微应用的最小身份标识。 |
| `LoadableApp<T>` | `AppMetadata & { container; props? }` | 配合 [`loadMicroApp`](/zh-CN/api/load-micro-app) 使用，`container` 是 `HTMLElement`。 |
| `RegistrableApp<T>` | `LoadableApp<T> & { loader?; activeRule; configuration? }` | 配合 [`registerMicroApps`](/zh-CN/api/register-micro-apps) 使用。 |
| `AppConfiguration` | loader 选项 `& { sandbox?; globalContext?; styleIsolation? }` | 单个应用的运行时配置，见 [AppConfiguration](/zh-CN/api/configuration)。 |
| `LifeCycleFn<T>` | `(app, global) => Promise<void>` | 单个框架级生命周期钩子。 |
| `LifeCycles<T>` | `{ beforeLoad?; beforeMount?; afterMount?; beforeUnmount?; afterUnmount? }` | 框架级钩子，见[生命周期钩子](/zh-CN/api/lifecycles)。 |
| `MicroApp` | single-spa `Parcel` | `loadMicroApp` 返回的句柄。 |
| `MicroAppLifeCycles` | `{ bootstrap; mount; unmount; update? }` | 微应用自身导出的生命周期。 |
| `PrefetchStrategy` | `boolean \| 'all' \| string[] \| fn` | 为向后兼容而导出，v3 的任何 API 都不用它。 |

## ObjectType

```ts
export type ObjectType = Record<string, unknown>;
```

凡是 qiankun 接收 props 泛型 `T` 的地方，都用这个约束。你给自己的 props 对象定类型时，它必须能满足 `ObjectType`:

```ts
type Props = { userId: number; theme: 'light' | 'dark' };
// Props satisfies Record<string, unknown>, so it is a valid T
```

## HTMLEntry

```ts
export type HTMLEntry = string;
```

微应用的入口永远是它 HTML 文档的地址。qiankun 会把这份 HTML 通过 [HTML 入口加载器](/zh-CN/concepts/html-entry-loading)流式解析，并执行其中引用的脚本。

```ts
const entry: HTMLEntry = 'http://localhost:7100';
```

::: danger 没有对象形式的入口
qiankun 2.x 的 `entry: { scripts: [...], styles: [...] }` 写法在 v3 里不存在了。把 `entry` 指向一个 HTML 页面，让加载器自己去发现它引用的资源。
:::

## AppMetadata

```ts
export type AppMetadata = {
  name: string;
  entry: HTMLEntry;
};
```

微应用的最小描述：一个唯一的 `name` 和它的 HTML `entry`。`AppMetadata` 是 `LoadableApp` 和 `RegistrableApp` 继承的基类，也是 [`prefetchApps`](/zh-CN/api/prefetch-apps) 接收的元素类型。

## LoadableApp

```ts
export type LoadableApp<T extends ObjectType> = AppMetadata & {
  container: HTMLElement;
  props?: T;
};
```

用 [`loadMicroApp`](/zh-CN/api/load-micro-app) 命令式挂载一个应用时，传给它的描述对象。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `name` | `string` | 微应用的唯一名称。 |
| `entry` | `HTMLEntry` | HTML 入口地址。 |
| `container` | `HTMLElement` | 应用挂载进去的 DOM 元素。必须是元素本身，不能是选择器。 |
| `props` | `T`(可选) | 转发给微应用生命周期导出函数的 props。 |

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

::: warning container 是 HTMLElement
`container: '#subapp'` 在 2.x 里能编译过，在 v3 里是类型错误。你得自己把元素取出来，比如用 `document.getElementById(...)` 或框架的 ref。
:::

## RegistrableApp

```ts
export type RegistrableApp<T extends ObjectType> = LoadableApp<T> & {
  loader?: (loading: boolean) => void;
  activeRule: RegisterApplicationConfig['activeWhen'];
  configuration?: AppConfiguration;
};
```

交给 [`registerMicroApps`](/zh-CN/api/register-micro-apps) 的、由路由驱动的应用描述对象。它在 `LoadableApp` 之上多了三个和路由 / 加载相关的字段。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `loader` | `(loading: boolean) => void`(可选) | 挂载前以 `true` 调用，挂载后以 `false` 调用，方便你驱动一个加载指示器。 |
| `activeRule` | single-spa `Activity` | 应用何时激活。可以是路径前缀字符串、`(location) => boolean` 函数，或两者混在一起的数组。 |
| `configuration` | `AppConfiguration`(可选) | 单个应用的运行时配置，叠加在框架默认值之上。 |

`activeRule` 就是 single-spa 的 `activeWhen` 类型——`string | ((location: Location) => boolean) | Array<string | ((location: Location) => boolean)>`:

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

单个应用的运行时配置。它既是 [`loadMicroApp`](/zh-CN/api/load-micro-app) 的第二个参数，也是 `RegistrableApp` 的 `configuration` 字段。

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `fetch` | `typeof window.fetch` | `window.fetch` | 用于入口和资源请求的自定义 fetch。qiankun 会给它套上缓存、重试，以及遇到非 2xx 就抛错的能力。 |
| `streamTransformer` | `() => TransformStream<string, string>` | `undefined` | 加载 HTML 时接入这条流的一个 transform。 |
| `nodeTransformer` | `<T extends Node>(node: T, opts) => T` | 内置默认值 | 在每个 script / link / style 节点进入真实 DOM 之前改写它。默认实现会跑 `transpileAssets`。 |
| `sandbox` | `boolean` | `true` | 开启 [JS 沙箱](/zh-CN/concepts/js-sandbox)隔离膜，以及在适用场景下的 [ESM 沙箱](/zh-CN/concepts/esm-sandbox)。 |
| `globalContext` | `WindowProxy` | `window` | 沙箱隔离膜所代理的那个基础全局对象。 |
| `styleIsolation` | `boolean` | `false` | 开启运行时的 CSS `@scope` [样式隔离](/zh-CN/concepts/style-isolation)，范围限定在应用容器内。 |

前三个字段来自加载器的 `LoaderOpts`。默认值是在 `loadApp` 内部解析的，不在类型里。细节见 [AppConfiguration](/zh-CN/api/configuration) 专页。

::: danger 没有 sandbox 对象，也没有 FrameworkConfiguration
`sandbox` 是个布尔值。2.x 的对象写法 `sandbox: { strictStyleIsolation, experimentalStyleIsolation }` 和 Shadow DOM 隔离都没了。样式隔离是单独的布尔值 `styleIsolation`，用 CSS `@scope` 实现。没有 `FrameworkConfiguration` 类型，`start()` 也不再接收任何 sandbox、prefetch 或单例相关的选项。
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

作为可选的最后一个参数传给 `registerMicroApps` 和 `loadMicroApp` 的框架级钩子。每个钩子是一个函数或一组函数，按顺序执行。第二个参数 `global` 是这个应用被沙箱代理过的 `window`，不是真实的 `window`。

```ts
const lifeCycles: LifeCycles<Record<string, unknown>> = {
  beforeLoad: async (app) => console.log('before load', app.name),
  afterMount: [
    async (app, global) => console.log('mounted into', app.container, global),
  ],
};
```

::: info 两种不同的生命周期类型
`LifeCycles`(上面这五个框架级钩子)和 `MicroAppLifeCycles`(微应用自己导出的 `bootstrap` / `mount` / `unmount` / `update`)是两回事。见[微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props)。
:::

## MicroApp

```ts
import type { Parcel } from 'single-spa';
export type MicroApp = Parcel;
```

[`loadMicroApp`](/zh-CN/api/load-micro-app) 返回的句柄。它就是 single-spa 的 `Parcel`，给你命令式的控制能力，外加每个阶段各自的 promise。

| 成员 | 类型 | 说明 |
| --- | --- | --- |
| `mount()` | `() => Promise<null>` | 挂载应用。 |
| `unmount()` | `() => Promise<null>` | 卸载应用。 |
| `update?(props)` | `(props) => Promise<any>` | 推送新的 props，前提是应用导出了 `update` 钩子。 |
| `getStatus()` | `() => Status` | 当前生命周期状态(下面的联合类型)。 |
| `loadPromise` | `Promise<null>` | 源码加载完成时 resolve。 |
| `bootstrapPromise` | `Promise<null>` | bootstrap 完成时 resolve。 |
| `mountPromise` | `Promise<null>` | 挂载完成时 resolve。 |
| `unmountPromise` | `Promise<null>` | 卸载完成时 resolve。 |

`getStatus()` 返回 single-spa 的状态字符串之一：

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

微应用为了让 qiankun 驱动它，而导出的那个生命周期对象的形状。把 single-spa 的数组形式拍平之后，它等于：

```ts
type MicroAppLifeCycles = {
  bootstrap: (props) => Promise<void>;
  mount: (props) => Promise<void>;
  unmount: (props) => Promise<void>;
  update?: (props) => Promise<void>;
};
```

每个函数都会收到挂载 props，里面既有 `container: HTMLElement`(要渲染进去的节点)，也有你通过 `props` 传进来的一切。微应用的入口这样导出它们：

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

::: warning 导出了，但没人用
`PrefetchStrategy` 是为源码兼容保留的历史类型。v3 没有任何公共 API 消费它——流式加载器会自动预加载，而 [`prefetchApps`](/zh-CN/api/prefetch-apps) 已废弃。它出现在这里，只是因为它还在被导出。
:::

## Window 扩展

qiankun 会扩展全局的 `Window` 接口。这些属性，一方面是微应用判断自己是否跑在 qiankun 里的依据，另一方面是运行时和基于 zone 的框架协作的接口。

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

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `__POWERED_BY_QIANKUN__` | `boolean` | 应用跑在 qiankun 里时，会被设到沙箱化的全局对象上。读它就能区分是独立运行还是被嵌入运行。 |
| `__INJECTED_PUBLIC_PATH_BY_QIANKUN__` | `string` | qiankun 注入的运行时 public path，让应用从正确的源解析自己的资源。 |
| `__QIANKUN_DEVELOPMENT__` | `boolean` | qiankun 以开发模式运行时被设置，用来开启一些开发期的额外诊断。 |
| `Zone` | `CallableFunction` | 加载了 zone.js(比如 Angular)时存在。qiankun 会把它考虑进去，让被 patch 过的定时器行为正确。 |
| `__zone_symbol__setTimeout` | `Window['setTimeout']` | zone.js 保存的原始 `setTimeout` 引用，在 zone.js 生效时用它拿到未被 patch 的定时器。 |

微应用一般读前两个来在运行时做适配：

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

::: tip 全局扩展是自动生效的
只要从 `qiankun` 里引入任何东西，就会把这段 `declare global` 一并带进来，所以 `window.__POWERED_BY_QIANKUN__` 在你的项目里天然就有类型，不用额外配置。如果某个微应用并不依赖 `qiankun`，那就自己写一段带相同属性的 `declare global`。
:::

## 延伸阅读

- [AppConfiguration](/zh-CN/api/configuration) —— 逐个字段讲清每一项配置
- [生命周期钩子(LifeCycles)](/zh-CN/api/lifecycles) —— 框架级钩子参考
- [registerMicroApps](/zh-CN/api/register-micro-apps) 和 [loadMicroApp](/zh-CN/api/load-micro-app) —— 这些类型被消费的地方
- [微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props) —— 挂载 props 如何流向微应用
- [从 qiankun 2.x 迁移](/zh-CN/cookbook/migrate-from-2x) —— 破坏性类型改动一览
