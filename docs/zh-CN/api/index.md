# API 总览

建议优先使用 [`loadMicroApp`](/zh-CN/api/load-micro-app) 按需加载和管理微应用实例。调用后会立即开始挂载应用，并返回用于更新、查询状态和卸载应用的句柄。

```ts
import { loadMicroApp } from 'qiankun';

const microApp = loadMicroApp({
  name: 'sub-app',
  entry: '//localhost:7101',
  container: document.getElementById('subapp-container')!,
});

// 不再需要时卸载实例
await microApp.unmount();
```

如果应用必须根据 URL 自动激活，可使用 [`registerMicroApps`](/zh-CN/api/register-micro-apps) 和 [`start`](/zh-CN/api/start)。这是面向路由驱动场景的另一种加载方式，与 `loadMicroApp` 相互独立，无需搭配使用。

## 导出一览

| 导出 | 用途 |
| --- | --- |
| [`loadMicroApp`](/zh-CN/api/load-micro-app) | 立即加载并挂载一个微应用，返回 [`MicroApp`](/zh-CN/api/types) 句柄。 |
| [`registerMicroApps`](/zh-CN/api/register-micro-apps) | 注册由 URL `activeRule` 驱动的微应用。 |
| [`start`](/zh-CN/api/start) | 启动路由驱动的注册模式。直接使用 `loadMicroApp` 时通常不需要调用。 |
| [`setDefaultMountApp`](/zh-CN/api/effects) | 没有应用挂载时跳转到默认应用路由。 |
| [`runAfterFirstMounted`](/zh-CN/api/effects) | 首个微应用挂载后执行一次回调。 |
| [`addErrorHandler` / `removeErrorHandler`](/zh-CN/api/error-handling) | 注册或移除全局错误处理器。 |
| [`isRuntimeCompatible`](/zh-CN/api/is-runtime-compatible) | 检查当前浏览器是否满足 qiankun v3 的基础运行条件。 |
| [`prefetchApps`](/zh-CN/api/prefetch-apps) | 已废弃的手动预取 API。 |

## 两种加载方式

### 按需加载：`loadMicroApp`

适用于页面区域、组件、弹窗，以及由主应用状态控制的微应用。主应用负责决定实例的创建和卸载时机。

```ts
function loadMicroApp<T extends ObjectType>(
  app: LoadableApp<T>,
  configuration?: AppConfiguration,
  lifeCycles?: LifeCycles<T>,
): MicroApp;
```

返回值提供 `mount`、`unmount`、`getStatus` 和各阶段的 Promise。只有微应用导出 `update` 生命周期时，句柄才提供 `update` 方法。不再使用实例时，应调用 `unmount()`。

### 路由驱动：`registerMicroApps` + `start`

适用于完全由 URL 决定应用挂载状态的场景。应先注册应用及其 `activeRule`，再调用 `start()`，由 single-spa 根据路由自动激活和卸载应用。

```ts
registerMicroApps(apps, lifeCycles?);
start(opts?);
```

两种方式的选择原则见[加载一个微应用实例](/zh-CN/concepts/architecture)。

## 配置、生命周期与类型

- [`AppConfiguration`](/zh-CN/api/configuration)：沙箱、样式隔离、自定义 fetch 及高级转换选项。
- [`LifeCycles`](/zh-CN/api/lifecycles)：由主应用提供的加载、挂载和卸载观察钩子。
- [`MicroApp`、`LoadableApp` 等类型](/zh-CN/api/types)：完整类型声明。
- [微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props)：微应用必须实现的 `bootstrap`、`mount`、`unmount` 契约。

## 迁移与废弃项

从 qiankun 2.x 升级时，请参阅[从 qiankun 2.x 迁移](/zh-CN/cookbook/migrate-from-2x)。各 API 页面仅描述当前版本的行为。

`prefetchApps` 已废弃；流式 HTML 入口加载会在解析过程中自动发现并预加载资源。替代建议见[优化微应用加载](/zh-CN/cookbook/optimize-loading)。
