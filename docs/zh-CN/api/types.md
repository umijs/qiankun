# 类型参考

本页列出 `qiankun` 包的根入口导出的公共类型和 `Window` 接口扩展。可按以下方式导入：

```ts
import type {
  ObjectType,
  HTMLEntry,
  AppMetadata,
  LoadableApp,
  RegistrableApp,
  AppConfiguration,
  SandboxConfiguration,
  LifeCycleFn,
  LifeCycles,
  MicroApp,
  MicroAppLifeCycles,
  PrefetchStrategy,
} from 'qiankun';
```

::: warning 从 qiankun 2.x 迁移时的类型变化
以下三项类型定义已经变更，直接使用 2.x 代码会产生类型错误：

- `entry` 的类型为字符串（`HTMLEntry = string`），不再支持对象形式的入口（`{ scripts, styles }`），`EntryOpts` 也已移除。
- `container` 的类型为 `HTMLElement`，不再接受 `'#subapp-viewport'` 等选择器字符串。
- `FrameworkConfiguration` 类型已移除。单个应用使用 `AppConfiguration` 配置，`start()` 仅接收 single-spa 的 `StartOpts`。

完整清单见[从 qiankun 2.x 迁移](/zh-CN/cookbook/migrate-from-2x)。
:::

## 类型总览

| 类型 | 定义 | 说明 |
| --- | --- | --- |
| `ObjectType` | `Record<string, unknown>` | props 泛型 `T` 的基础约束。 |
| `HTMLEntry` | `string` | 微应用的 HTML 入口地址，仅支持字符串。 |
| `AppMetadata` | `{ name; entry }` | 微应用的基本描述信息。 |
| `LoadableApp<T>` | `AppMetadata & { container; props? }` | 配合 [`loadMicroApp`](/zh-CN/api/load-micro-app) 使用，`container` 是 `HTMLElement`。 |
| `RegistrableApp<T>` | `LoadableApp<T> & { loader?; activeRule; configuration? }` | 配合 [`registerMicroApps`](/zh-CN/api/register-micro-apps) 使用。 |
| `AppConfiguration` | 加载器选项 `& { sandbox? }` | 单个应用的运行时配置，见 [AppConfiguration](/zh-CN/api/configuration)。 |
| `SandboxConfiguration` | `{ styleIsolation?; globals?; incubatorContext?; plugins?; …模块钩子 }` | `sandbox` 的对象形式，见 [SandboxConfiguration](/zh-CN/api/configuration#sandboxconfiguration)。 |
| `LifeCycleFn<T>` | `(app, global) => Promise<void>` | 单个框架级生命周期钩子。 |
| `LifeCycles<T>` | `{ beforeLoad?; beforeMount?; afterMount?; beforeUnmount?; afterUnmount? }` | 框架级钩子，见[生命周期钩子](/zh-CN/api/lifecycles)。 |
| `MicroApp` | single-spa `Parcel` | `loadMicroApp` 返回的句柄。 |
| `MicroAppLifeCycles` | `{ bootstrap; mount; unmount; update? }` | 微应用自身导出的生命周期。 |
| `PrefetchStrategy` | `boolean \| 'all' \| string[] \| fn` | 为向后兼容而导出，v3 的公共 API 不使用该类型。 |

## ObjectType

```ts
export type ObjectType = Record<string, unknown>;
```

qiankun 所有以 `T` 表示 props 类型的 API 均使用此约束。自定义 props 类型必须满足 `ObjectType`：

```ts
type Props = { userId: number; theme: 'light' | 'dark' };
// Props 满足 Record<string, unknown> 约束，可作为泛型 T。
```

## HTMLEntry

```ts
export type HTMLEntry = string;
```

微应用入口始终是 HTML 文档的地址。qiankun 通过 [HTML 入口](/zh-CN/concepts/html-entry-loading)流式解析该文档，并执行其中引用的脚本。

```ts
const entry: HTMLEntry = 'http://localhost:7101';
```

::: danger 不支持对象形式的入口
qiankun v3 不再支持 2.x 的 `entry: { scripts: [...], styles: [...] }` 写法。`entry` 应指向 HTML 页面，由加载器自动发现页面引用的资源。
:::

## AppMetadata

```ts
export type AppMetadata = {
  name: string;
  entry: HTMLEntry;
};
```

微应用的最小描述，包含稳定的 `name` 和 HTML `entry`。`AppMetadata` 是 `LoadableApp` 与 `RegistrableApp` 的基础类型，也是 [`prefetchApps`](/zh-CN/api/prefetch-apps) 接收的元素类型。

## LoadableApp

```ts
export type LoadableApp<T extends ObjectType> = AppMetadata & {
  container: HTMLElement;
  props?: T;
};
```

调用 [`loadMicroApp`](/zh-CN/api/load-micro-app) 按需挂载应用时，应传入该类型的描述对象。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `name` | `string` | 应用标识。不同容器中的多个 `loadMicroApp` 实例可以复用同一个名称。 |
| `entry` | `HTMLEntry` | HTML 入口地址。 |
| `container` | `HTMLElement` | 用于挂载应用的实际 DOM 元素，不能使用选择器字符串。 |
| `props` | `T`（可选） | 传递给微应用生命周期导出函数的 props。 |

```ts
import { loadMicroApp } from 'qiankun';

const container = document.getElementById('subapp')!;
const app = loadMicroApp<{ userId: number }>({
  name: 'app1',
  entry: 'http://localhost:7101',
  container,
  props: { userId: 42 },
});
```

::: warning container 的类型为 HTMLElement
`container: '#subapp'` 在 v3 中会产生类型错误。应通过 `document.getElementById(...)` 或框架提供的 ref 获取实际元素。
:::

## RegistrableApp

```ts
export type RegistrableApp<T extends ObjectType> = LoadableApp<T> & {
  loader?: (loading: boolean) => void;
  activeRule: RegisterApplicationConfig['activeWhen'];
  configuration?: AppConfiguration;
};
```

传递给 [`registerMicroApps`](/zh-CN/api/register-micro-apps) 的路由驱动应用描述对象。该类型在 `LoadableApp` 的基础上增加了三个与路由和加载相关的字段。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `loader` | `(loading: boolean) => void`（可选） | 报告路由应用的加载状态。在收到 `false` 前可能连续收到多次 `true`，调用方应根据参数值更新当前状态。 |
| `activeRule` | single-spa `Activity` | 应用的激活条件。可以是路径前缀字符串、`(location) => boolean` 函数，或由二者组成的数组。 |
| `configuration` | `AppConfiguration`（可选） | 单个应用的运行时配置；未指定的字段使用框架默认值。 |

`activeRule` 对应 single-spa 的 `activeWhen` 类型，即 `string | ((location: Location) => boolean) | Array<string | ((location: Location) => boolean)>`：

```ts
import { registerMicroApps } from 'qiankun';

registerMicroApps([
  {
    name: 'app1',
    entry: 'http://localhost:7100',
    container: document.getElementById('subapp')!,
    activeRule: '/app1',
    configuration: { sandbox: { styleIsolation: true } },
  },
]);
```

## AppConfiguration

```ts
export type AppConfiguration = Partial<
  Pick<LoaderOpts, 'fetch' | 'streamTransformer' | 'nodeTransformer'>
> & {
  sandbox?: boolean | SandboxConfiguration;
};
```

单个应用的运行时配置。它既是 [`loadMicroApp`](/zh-CN/api/load-micro-app) 的第二个参数，也是 `RegistrableApp` 的 `configuration` 字段。

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `fetch` | `typeof window.fetch` | `window.fetch` | 用于请求入口，以及由加载器处理的脚本、模块和样式的自定义 fetch。 |
| `streamTransformer` | `() => TransformStream<string, string>` | `undefined` | 用于自定义 HTML 流式处理过程的转换器。 |
| `nodeTransformer` | `<T extends Node>(node: T, opts) => T` | 内置默认值 | 在 `<script>`、`<link>` 和 `<style>` 节点进入容器前进行转换。 |
| `sandbox` | `boolean \| SandboxConfiguration` | `true` | 启用基于隔离膜的 [JavaScript 隔离](/zh-CN/concepts/js-sandbox)，以及适用场景下的[原生 ESM 支持](/zh-CN/concepts/esm-sandbox)。传入对象形式还可对其进行配置。 |

字段行为和默认值见 [AppConfiguration](/zh-CN/api/configuration)。

## SandboxConfiguration

```ts
export type SandboxConfiguration = Pick<
  CreateSandboxOptions,
  | 'globals'
  | 'incubatorContext'
  | 'modules'
  | 'resolveHook'
  | 'importHook'
  | 'loadHook'
  | 'plugins'
  | 'styleIsolation'
>;
```

`sandbox` 的对象形式。它在结构上是沙箱 `CompartmentOptions` 的公开投影，外加 `plugins` 和 `styleIsolation` 两个宿主扩展。

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `styleIsolation` | `boolean` | `false` | 启用基于 CSS `@scope` 的运行时[样式隔离](/zh-CN/concepts/style-isolation)，作用域限制在应用容器内。 |
| `globals` | `CompartmentGlobals` | `{}` | 安装到该应用 compartment 全局对象上的值或属性描述符。 |
| `incubatorContext` | `WindowProxy` | `window` | 孵化该沙箱的宿主上下文。 |
| `plugins` | `readonly IsolationPlugin[]` | `[]` | 追加在内置插件之后的隔离插件。 |
| `modules` / `resolveHook` / `importHook` / `loadHook` | Compartment 模块钩子 | `undefined` | 沙箱内 ESM 的模块解析与加载钩子。 |

::: danger 不支持 2.x 的 sandbox 对象和 FrameworkConfiguration
`sandbox` 的类型是布尔值或 `SandboxConfiguration`。v3 不再支持 2.x 的对象形式 `sandbox: { strictStyleIsolation, experimentalStyleIsolation }`，也不再提供 Shadow DOM 隔离；样式隔离改为 `sandbox.styleIsolation`，基于 CSS `@scope` 实现。`FrameworkConfiguration` 类型已移除，`start()` 也不再接收 sandbox、prefetch 或单例相关选项。
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

这组框架级钩子作为可选参数传递给 `registerMicroApps` 和 `loadMicroApp`。每个钩子可以是一个函数或函数数组，并按声明顺序执行。第二个参数 `global` 是该应用经过沙箱代理的 `window` 视图，不是真实的 `window`。

```ts
const lifeCycles: LifeCycles<Record<string, unknown>> = {
  beforeLoad: async (app) => console.log('before load', app.name),
  afterMount: [
    async (app, global) => console.log('mounted into', app.container, global),
  ],
};
```

::: info 两类生命周期类型
`LifeCycles` 表示上述五个框架级钩子；`MicroAppLifeCycles` 表示微应用导出的 `bootstrap`、`mount`、`unmount` 和 `update`。两者用途不同，详见[微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props)。
:::

## MicroApp

```ts
import type { Parcel } from '@qiankunjs/single-spa';
export type MicroApp = Parcel;
```

[`loadMicroApp`](/zh-CN/api/load-micro-app) 返回的句柄，其类型是 `@qiankunjs/single-spa` 的 `Parcel`——qiankun 内置的 single-spa fork，已作为依赖随 qiankun 一同安装。该句柄提供实例控制方法和各生命周期阶段对应的 Promise。路由相关的辅助函数同样应从该包导入，不要再单独安装 `single-spa`，否则会引入第二个相互独立的路由器。

| 成员 | 类型 | 说明 |
| --- | --- | --- |
| `mount()` | `() => Promise<null>` | 挂载应用。 |
| `unmount()` | `() => Promise<null>` | 卸载应用。 |
| `update?(props)` | `(props) => Promise<any>` | 传递新的 props，仅在应用导出 `update` 钩子时可用。 |
| `getStatus()` | `() => Status` | 返回当前生命周期状态，取值为下方的联合类型。 |
| `loadPromise` | `Promise<null>` | 表示源码加载阶段完成的 Promise。 |
| `bootstrapPromise` | `Promise<null>` | 表示 bootstrap 阶段完成的 Promise。 |
| `mountPromise` | `Promise<null>` | 表示挂载阶段完成的 Promise。 |
| `unmountPromise` | `Promise<null>` | 表示卸载阶段完成的 Promise。 |

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

微应用需要导出该生命周期对象，以便 qiankun 驱动应用。将 single-spa 支持的生命周期函数数组归一化为单个函数后，其结构如下：

```ts
type MicroAppLifeCycles = {
  bootstrap: (props) => Promise<void>;
  mount: (props) => Promise<void>;
  unmount: (props) => Promise<void>;
  update?: (props) => Promise<void>;
};
```

各生命周期函数都会接收主应用通过 `props` 传入的数据。qiankun 只会在调用 `mount` 和 `unmount` 时额外注入用于渲染的 `container: HTMLElement`；`bootstrap` 和 `update` 不应依赖该字段。微应用可按以下方式导出生命周期函数：

```ts
let root: { unmount(): void } | null = null;

export async function bootstrap() {}
export async function mount(props: { container: HTMLElement }) {
  root = render(props.container); // 渲染并保存句柄
}
export async function unmount() {
  root?.unmount(); // 卸载渲染树
  root = null;
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

::: warning 仅为兼容性保留
`PrefetchStrategy` 是为源码兼容保留的历史类型。v3 没有公共 API 使用该类型：流式加载器会自动预加载资源，而 [`prefetchApps`](/zh-CN/api/prefetch-apps) 已废弃。文档保留此项，是因为该类型仍从包中导出。
:::

## Window 扩展

qiankun 会扩展全局 `Window` 接口。这些属性用于判断微应用是否由 qiankun 运行，也用于运行时与使用 Zone.js 的框架进行协作。

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
| `__POWERED_BY_QIANKUN__` | `boolean` | 应用运行在 qiankun 中时，该属性会设置在沙箱全局对象上，可用于区分独立运行和嵌入运行。 |
| `__INJECTED_PUBLIC_PATH_BY_QIANKUN__` | `string` | qiankun 注入的运行时公共路径（public path），用于从正确的来源解析应用资源。 |
| `__QIANKUN_DEVELOPMENT__` | `boolean` | qiankun 以开发模式运行时设置，用于启用开发阶段的附加诊断。 |
| `Zone` | `CallableFunction` | 加载 Zone.js 的应用（例如 Angular 应用）会提供该属性。qiankun 使用该属性处理经过补丁修改的定时器。 |
| `__zone_symbol__setTimeout` | `Window['setTimeout']` | zone.js 保存的原始 `setTimeout` 引用。zone.js 生效时，qiankun 通过该属性访问未经补丁修改的定时器。 |

微应用通常读取前两个属性以进行运行时适配：

```ts
// 微应用入口
if (window.__POWERED_BY_QIANKUN__) {
  // 由 qiankun 运行：导出 bootstrap、mount 和 unmount
} else {
  // 独立运行
  render(document.getElementById('root'));
}

// 将模块公共路径设置为 qiankun 注入的值（Webpack）
if (window.__POWERED_BY_QIANKUN__) {
  // eslint-disable-next-line no-undef, camelcase
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

::: tip 全局类型会自动扩展
从 `qiankun` 导入任意成员时，上述 `declare global` 会同时生效，因此 `window.__POWERED_BY_QIANKUN__` 无需额外配置即可获得类型定义。如果微应用不依赖 `qiankun`，则需要自行声明包含相同属性的 `Window` 接口扩展。
:::

## 相关内容

- [AppConfiguration](/zh-CN/api/configuration)——各配置项的完整说明。
- [生命周期钩子（LifeCycles）](/zh-CN/api/lifecycles)——框架级钩子参考。
- [registerMicroApps](/zh-CN/api/register-micro-apps) 和 [loadMicroApp](/zh-CN/api/load-micro-app)——使用这些类型的 API。
- [微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props)——生命周期参数的传递方式。
- [从 qiankun 2.x 迁移](/zh-CN/cookbook/migrate-from-2x)——不兼容类型变更。
