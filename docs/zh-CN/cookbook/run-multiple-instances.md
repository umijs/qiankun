# 运行多个微应用实例

`loadMicroApp` 可以同时加载不同应用，也可以把同一个应用挂载到多个位置。适合标签页、弹窗、仪表盘和其他由主应用状态决定实例数量的场景。

## 为每个实例准备独立容器

同一时间展示的每个实例都需要自己的 `HTMLElement`：

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

不要让两个同时存活的实例共享一个容器。需要切换同一位置中的应用时，先等待当前实例 `unmount()` 完成，再加载下一个。

## 同一个应用的多个实例

同一个 `name` 和 `entry` 可以配合不同容器多次加载：

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

微应用必须只在 `props.container` 内查询和渲染节点。写死页面级选择器、把状态放在共享全局或使用单例框架根节点，都会让多个实例互相覆盖。

开启 `styleIsolation` 时还要注意，CSS 作用域按 `name` 区分。同名实例共享同一个选择器；如果某个实例的专属样式不能匹配其他实例，请为它们使用不同名称。

## 更新实例

微应用导出 `update` 生命周期后，可以通过对应句柄更新 props：

```ts
if (left.update) {
  await left.update({ accountId: 'C' });
}
```

不同实例持有不同句柄，更新和卸载操作不要交叉使用。

## 重新挂载与容器复用

同一个实例卸载后可以通过句柄再次调用 `mount()`。qiankun 会复用已经发现的生命周期，不重新执行入口顶层代码；每次挂载需要的应用实例、router 和 store 都应在微应用的 `mount()` 中创建。

如果主应用销毁旧容器并调用新的 `loadMicroApp`，应把它当作一个新实例，并为新句柄建立独立清理路径。不要只移除 DOM 后丢弃旧句柄。

## 每个句柄都必须卸载

主应用拥有每次 `loadMicroApp` 调用返回的句柄，也拥有对应的清理责任：

```ts
await Promise.all([left.unmount(), right.unmount()]);
```

`unmount()` 会调用微应用生命周期并清理 qiankun 能追踪的容器和沙箱副作用。微应用仍须自行释放 store 订阅、Worker、WebSocket、Observer 和 portal 等外部资源。

## 原生 ESM 注意事项

同一 ESM 应用的并发实例应使用独立容器，并测试初次求值和动态创建元素的场景。当前 ESM 实现对同时求值的同源实例仍有已知限制；如果产品严重依赖大量并发实例，请先通过真实应用验证，或评估 Classic 构建。

实现背景见 [ESM sandbox internals](/zh-CN/internals/esm-sandbox)，普通 ESM 接入要求见[原生 ESM 支持](/zh-CN/concepts/esm-sandbox)。

## 相关内容

- [`loadMicroApp` API](/zh-CN/api/load-micro-app)
- [生命周期与 props](/zh-CN/concepts/lifecycle-and-props)
- [JavaScript 隔离](/zh-CN/concepts/js-sandbox)
- [应用间通信](/zh-CN/cookbook/communicate-between-apps)
