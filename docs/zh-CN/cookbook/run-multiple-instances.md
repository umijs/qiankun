# 运行多个微应用实例

`loadMicroApp` 既可以同时加载不同应用，也可以将同一应用挂载到多个位置。该方式适用于标签页、对话框、仪表盘，以及其他由主应用状态决定实例数量的场景。

## 为每个实例准备独立容器

同时显示的每个实例都必须使用独立的 `HTMLElement` 容器：

```ts
import { loadMicroApp } from 'qiankun';

function requireElement(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing container: ${id}`);
  return element;
}

const apps = [
  loadMicroApp({
    name: 'reports',
    entry: '//localhost:7101',
    container: requireElement('reports-pane'),
  }),
  loadMicroApp({
    name: 'settings',
    entry: '//localhost:7102',
    container: requireElement('settings-pane'),
  }),
];

await Promise.all(apps.map((app) => app.mountPromise));

// 仪表盘关闭时
await Promise.all(apps.map((app) => app.unmount()));
```

两个并行运行的实例不得共用同一容器。在同一位置切换应用时，应先等待当前实例的 `unmount()` 完成，再加载后续实例。

qiankun 内部确实有一道按容器计的占用闸门：指向同一元素的应用会以 FIFO 顺序轮流写入 DOM，因此把第二个应用 `loadMicroApp` 进已被占用的容器时会排队等待，而不是静默覆盖。但这只是防止写入交错的兜底，不能替代卸载——句柄始终未卸载的应用会永久持有容器，排在它后面的应用也会一直等下去（开发模式下等待超过数秒会打印警告）。

## 同一个应用的多个实例

同一组 `name` 和 `entry` 可以与不同容器组合，从而创建多个实例：

```ts
const left = loadMicroApp({
  name: 'reports',
  entry: '//localhost:7101',
  container: requireElement('left-pane'),
  props: { accountId: 'A' },
});

const right = loadMicroApp({
  name: 'reports',
  entry: '//localhost:7101',
  container: requireElement('right-pane'),
  props: { accountId: 'B' },
});

await Promise.all([left.mountPromise, right.mountPromise]);
```

微应用必须仅在 `props.container` 内查询和渲染节点。使用固定的页面级选择器、将状态存储在共享全局对象中，或复用单例框架根节点，都可能导致多个实例相互覆盖。

启用 `sandbox.styleIsolation` 后，CSS 作用域按 `name` 区分。同名实例使用相同的作用域选择器。如果某些样式只能作用于特定实例，应为这些实例设置不同的名称。

## 更新实例

微应用导出 `update` 生命周期后，可通过对应实例句柄更新 `props`：

```ts
if (left.update) {
  await left.update({ accountId: 'C' });
}
```

每个句柄仅对应一个实例，不得使用其他实例的句柄执行更新或卸载操作。

## 重新挂载与容器复用

实例卸载后，可以通过原句柄再次调用 `mount()`。qiankun 会复用已解析的生命周期，不会重新执行入口模块的顶层代码。因此，每次挂载所需的应用实例、路由实例和状态容器都应在微应用的 `mount()` 中创建。

如果主应用销毁原容器并再次调用 `loadMicroApp`，该调用会创建一个新实例，主应用应单独保存和清理新句柄。移除容器 DOM 之前，仍须通过原句柄卸载原实例。

## 每个句柄都必须卸载

主应用负责管理每次 `loadMicroApp` 调用返回的句柄，并在不再使用实例时执行卸载：

```ts
await Promise.all([left.unmount(), right.unmount()]);
```

`unmount()` 会调用微应用的卸载生命周期，并清理由 qiankun 跟踪的容器内容和沙箱副作用。微应用仍须自行释放状态订阅、Worker、WebSocket、Observer 和 Portal 等外部资源。

## 原生 ESM 注意事项

同一 ESM 应用的并发实例必须使用独立容器；测试时应覆盖模块首次求值、动态创建元素等场景。当前 ESM 实现对于同时求值的同源实例仍存在已知限制。若业务需要运行大量并发实例，应使用实际应用充分验证，或评估采用 Classic 脚本构建。

实现原理见 [ESM 沙箱实现](/zh-CN/internals/esm-sandbox)，常规 ESM 接入要求见[原生 ESM 支持](/zh-CN/concepts/esm-sandbox)。

## 相关内容

- [`loadMicroApp` API](/zh-CN/api/load-micro-app)
- [生命周期与 props](/zh-CN/concepts/lifecycle-and-props)
- [JavaScript 隔离](/zh-CN/concepts/js-sandbox)
- [应用间通信](/zh-CN/cookbook/communicate-between-apps)
