# API 总览

`qiankun` 推荐通过 [`loadMicroApp`](/zh-CN/api/load-micro-app) 按需加载并管理微应用实例。它会立即挂载应用，并返回一个可用于更新、查询状态和卸载应用的句柄。

```ts
import { loadMicroApp } from 'qiankun';

const microApp = loadMicroApp({
  name: 'sub-app',
  entry: '//localhost:7101',
  container: document.getElementById('subapp-container')!,
});

// 不再需要时释放实例
await microApp.unmount();
```

如果应用必须跟随 URL 自动激活，可以使用 [`registerMicroApps`](/zh-CN/api/register-micro-apps) 和 [`start`](/zh-CN/api/start)。这是路由驱动的替代方案，不是使用 `loadMicroApp` 的前置条件。

## 导出一览

| 导出 | 用途 |
| --- | --- |
| [`loadMicroApp`](/zh-CN/api/load-micro-app) | 立即加载并挂载一个微应用，返回 [`MicroApp`](/zh-CN/api/types) 句柄。 |
| [`registerMicroApps`](/zh-CN/api/register-micro-apps) | 注册由 URL `activeRule` 驱动的微应用。 |
| [`start`](/zh-CN/api/start) | 启动路由驱动的注册模式。直接使用 `loadMicroApp` 时通常不需要调用。 |
| [`setDefaultMountApp`](/zh-CN/api/effects) | 没有应用挂载时跳转到默认应用路由。 |
| [`runAfterFirstMounted`](/zh-CN/api/effects) | 首个微应用挂载后执行一次回调。 |
| [`addErrorHandler` / `removeErrorHandler`](/zh-CN/api/error-handling) | 注册或移除全局错误处理器。 |
| [`isRuntimeCompatible`](/zh-CN/api/is-runtime-compatible) | 探测当前浏览器是否支持 qiankun v3 的基础运行时。 |
| [`prefetchApps`](/zh-CN/api/prefetch-apps) | 已废弃的手动预取 API。 |

## 两种加载方式

### 按需加载：`loadMicroApp`

适合页面区域、组件、弹窗以及由主应用状态控制的微应用。主应用负责决定何时创建和卸载实例。

```ts
function loadMicroApp<T extends ObjectType>(
  app: LoadableApp<T>,
  configuration?: AppConfiguration,
  lifeCycles?: LifeCycles<T>,
): MicroApp;
```

返回值暴露 `mount`、`unmount`、`getStatus` 和生命周期 promise；只有微应用导出可选的 `update` 生命周期时，句柄上才会有 `update`。每个不再使用的实例都应调用 `unmount()`。

### 路由驱动：`registerMicroApps` + `start`

适合应用是否挂载完全由 URL 决定的场景。先注册应用及其 `activeRule`，再调用 `start()` 交给 single-spa 自动激活和卸载。

```ts
registerMicroApps(apps, lifeCycles?);
start(opts?);
```

如何选择见[加载一个微应用实例](/zh-CN/concepts/architecture)。

## 配置、生命周期与类型

- [`AppConfiguration`](/zh-CN/api/configuration)：沙箱、样式隔离、自定义 fetch 及高级转换选项。
- [`LifeCycles`](/zh-CN/api/lifecycles)：由主应用提供的加载、挂载和卸载观察钩子。
- [`MicroApp`、`LoadableApp` 等类型](/zh-CN/api/types)：完整类型声明。
- [微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props)：微应用必须实现的 `bootstrap`、`mount`、`unmount` 契约。

## 迁移与废弃项

从 qiankun 2.x 升级时，请以[迁移指南](/zh-CN/cookbook/migrate-from-2x)为唯一参考。各 API 页面只描述当前版本的行为。

`prefetchApps` 已废弃；流式 HTML Entry 加载会在解析过程中自动发现并预加载资源。替代建议见[优化加载](/zh-CN/cookbook/optimize-loading)。
