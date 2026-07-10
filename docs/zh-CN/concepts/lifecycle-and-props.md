# 微应用生命周期与 props

[`loadMicroApp`](/zh-CN/api/load-micro-app) 连接了两份公开契约：微应用导出生命周期函数，主应用则得到一个用于控制运行中实例的 `MicroApp` 句柄。双方职责清晰，应用才能安全地挂载、更新、卸载和再次挂载。

导出解析与钩子顺序等实现细节见[生命周期解析原理](/zh-CN/internals/lifecycle-resolution)。

## 微应用契约

每个微应用都要暴露 `bootstrap`、`mount` 和 `unmount`，`update` 则是可选的：

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

原生 ESM 应用可以像上面一样使用具名导出，也可以默认导出一个生命周期对象。Classic 构建通过打包工具暴露同样的对象。可直接采用 [Vite](/zh-CN/cookbook/prepare-a-vite-app) 和 [Webpack](/zh-CN/cookbook/prepare-a-webpack-app) 指南中的配置。

## 主应用通过句柄控制实例

`loadMicroApp` 会自动开始第一次挂载并立即返回。请保存句柄，用它观察状态、更新和清理应用：

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

只有微应用导出了 `update`，句柄上才会出现 `update` 方法。如果应用不支持原地更新，应卸载它，再创建或挂载合适的实例。

## props、容器与主应用钩子

主应用提供的 `props` 会传给微应用的生命周期。调用 `mount` 和 `unmount` 时，qiankun 还会提供 `props.container`，它是当前实例实际拥有的 `HTMLElement`。

渲染和查询都应限定在这个容器内。不要通过页面级全局选择器挂载，否则会破坏多实例能力，并让微应用依赖主应用的文档结构。容器属于单个实例；卸载后微应用必须停止使用它，即使主应用之后会复用这个节点。

`props` 也是传递回调、共享服务和主应用状态最直接的显式通道。需要长期通信时，参见[应用间共享状态与通信](/zh-CN/cookbook/communicate-between-apps)。

主应用生命周期钩子（`beforeLoad`、`beforeMount`、`afterMount`、`beforeUnmount`、`afterUnmount`）是另一套 API，用于观察微应用周围的状态转换。主应用需要日志、加载提示或策略检查时，请使用[生命周期钩子参考](/zh-CN/api/lifecycles)；渲染与清理仍应放在微应用自己的生命周期中。

## 挂载、卸载与重新挂载

- `bootstrap` 在初次加载、第一次挂载前执行，重新挂载时不再执行；
- `mount` 创建可见的应用，并且可能执行多次；
- `unmount` 必须撤销 `mount` 产生的所有用户可见效果；
- `update`（如果导出）把新的主应用 props 应用到已挂载实例。

重新挂载时，qiankun 会重建入口 DOM，并再次调用 `mount`；同一个实例不会重新执行入口脚本或模块顶层代码。应在 `mount` 中创建可销毁的框架根节点和视图状态，并在 `unmount` 中销毁它们，不要依赖顶层代码重新执行。

## 清理是双方共同的责任

微应用的 `unmount` 完成后，qiankun 会停用沙箱并清空实例容器。微应用仍须清理 DOM 树之外由自己创建的内容，包括：

- 框架根节点和 Portal；
- 主应用 store 或事件总线的订阅；
- 尚未结束的请求、Worker、Observer 和其他外部资源；
- 被主应用回调或服务保留的引用。

始终处理 `unmount()` 返回的 Promise。所属流程可以暂停时，应等待它完成再移除容器；框架清理回调无法等待时，应先启动卸载并添加 rejection 处理器，再丢弃句柄。设计良好的生命周期应能反复挂载和卸载，而不会产生重复监听或残留界面。

如果需要由 URL 驱动激活，[`registerMicroApps`](/zh-CN/api/register-micro-apps) 会沿用同一套微应用契约，只是由路由决定何时挂载和卸载。

## 继续阅读

- [`loadMicroApp` API](/zh-CN/api/load-micro-app)——完整的句柄与 Promise 参考。
- [加载一个微应用实例](/zh-CN/concepts/architecture)——外围运行模型。
- [同时运行多个实例](/zh-CN/cookbook/run-multiple-instances)——容器与实例模式。
- [生命周期解析原理](/zh-CN/internals/lifecycle-resolution)——供维护者阅读的导出发现与钩子顺序。
