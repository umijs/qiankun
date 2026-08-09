# 微应用生命周期与 props

[`loadMicroApp`](/zh-CN/api/load-micro-app) 涉及两项公开契约：微应用需要导出生命周期函数，主应用则会获得用于控制实例的 `MicroApp` 句柄。明确双方职责后，才能保证微应用的挂载、更新、卸载和重新挂载行为稳定可靠。

导出解析与钩子顺序等实现细节见[生命周期解析原理](/zh-CN/internals/lifecycle-resolution)。

## 微应用契约

每个微应用都必须导出 `bootstrap`、`mount` 和 `unmount`，也可以选择导出 `update`：

```ts
type HostProps = {
  accountId: string;
};

type MountProps = HostProps & { container: HTMLElement };

export async function bootstrap() {
  // 第一次挂载前执行的一次性初始化。
}

export async function mount(props: MountProps) {
  // 在 props.container 内创建并渲染界面。
}

export async function update(props: HostProps) {
  // 不重新挂载，直接应用主应用传来的变更。
}

export async function unmount(props: MountProps) {
  // 销毁 mount 创建的界面并释放资源。
}
```

原生 ESM 应用既可以使用上述具名导出，也可以默认导出生命周期对象。Classic 构建则通过打包工具提供同样的对象。具体配置参见 [Vite](/zh-CN/cookbook/prepare-a-vite-app) 和 [Webpack](/zh-CN/cookbook/prepare-a-webpack-app) 接入指南。

## 主应用通过句柄控制实例

`loadMicroApp` 会立即返回句柄，并异步执行首次挂载。主应用应保存该句柄，用于获取状态、更新实例和执行清理：

```ts
const microApp = loadMicroApp({
  name: 'account-app',
  entry: 'https://accounts.example.com/',
  container,
  props: { accountId: '42' },
});

await microApp.mountPromise;

if (microApp.update) {
  await microApp.update({ accountId: '84' });
}

await microApp.unmount();

// 需要时，可以再次挂载同一个句柄。
await microApp.mount();
```

只有微应用导出 `update` 后，句柄才会提供 `update` 方法。如果微应用不支持直接更新，应先将其卸载，再创建或挂载符合当前状态的实例。

## props、容器与主应用钩子

主应用提供的 `props` 会传入微应用生命周期函数。调用 `mount` 和 `unmount` 时，qiankun 还会提供 `props.container`，即当前实例所使用的 `HTMLElement`。

渲染和 DOM 查询都应限定在该容器内。不要通过页面级全局选择器挂载，否则会破坏多实例能力，并使微应用依赖主应用的文档结构。容器仅归当前实例使用；微应用卸载后必须停止访问该容器，即使主应用后续会复用此节点。

`props` 还可用于显式传递回调、共享服务和主应用状态。需要建立持续通信机制时，参见[应用间共享状态与通信](/zh-CN/cookbook/communicate-between-apps)。

主应用生命周期钩子（`beforeLoad`、`beforeMount`、`afterMount`、`beforeUnmount`、`afterUnmount`）用于观察微应用的状态变化。主应用需要记录日志、展示加载状态或执行策略检查时，可以使用这些钩子，详见[生命周期钩子参考](/zh-CN/api/lifecycles)。渲染与清理逻辑仍应由微应用自身的生命周期负责。

## 挂载、卸载与重新挂载

- `bootstrap` 在应用初次加载且首次挂载前执行，重新挂载时不再执行；
- `mount` 创建可见的应用，并且可能执行多次；
- `unmount` 必须清理由 `mount` 创建的所有可见内容和副作用；
- `update`（如果已导出）将主应用提供的新 props 应用于已挂载实例。

重新挂载时，qiankun 会重建入口 DOM 并再次调用 `mount`，但同一实例不会重新执行入口脚本或模块顶层代码。因此，应在 `mount` 中创建可销毁的框架根节点和视图状态，并在 `unmount` 中将其销毁，不要依赖顶层代码再次执行。

## 清理是双方共同的责任

微应用的 `unmount` 执行完成后，qiankun 会停用沙箱并清空实例容器。微应用仍须清理由自身创建、且不属于容器 DOM 树的资源，包括：

- 框架根节点和 Portal；
- 主应用状态仓库或事件总线的订阅；
- 尚未结束的请求、Worker、Observer 和其他外部资源；
- 被主应用回调或服务保留的引用。

必须处理 `unmount()` 返回的 Promise。如果当前流程允许等待，应在卸载完成后再移除容器；如果框架的清理回调无法等待异步操作，就先调用 `unmount()` 并给它的 Promise 挂上 `catch`，然后再释放句柄引用。生命周期实现应支持反复挂载和卸载，且不得产生重复监听或残留界面。

如果需要根据 URL 自动激活微应用，可以使用 [`registerMicroApps`](/zh-CN/api/register-micro-apps)。此方式采用相同的微应用契约，但由路由决定挂载和卸载时机。

## 继续阅读

- [`loadMicroApp` API](/zh-CN/api/load-micro-app)——完整的句柄与 Promise 参考。
- [加载一个微应用实例](/zh-CN/concepts/architecture)——微应用的整体运行模型。
- [运行多个微应用实例](/zh-CN/cookbook/run-multiple-instances)——容器与实例模式。
- [生命周期解析原理](/zh-CN/internals/lifecycle-resolution)——供维护者阅读的导出发现与钩子顺序。
