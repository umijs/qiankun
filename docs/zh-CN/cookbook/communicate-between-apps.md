# 应用间共享状态与通信

在 qiankun v3 中，共享状态应由主应用持有，并且只向每个微应用开放它真正需要的数据与能力。大多数场景从 `loadMicroApp` 开始：通过 `props` 传入初始值，同时保存返回的句柄，供主应用之后更新或卸载微应用。

::: warning 从 qiankun 2.x 迁移
`initGlobalState`、`onGlobalStateChange`、`setGlobalState` 和 `MicroAppStateActions` 都不属于 qiankun v3。请用下文这些显式模式替代，详情见[从 qiankun 2.x 迁移](/zh-CN/cookbook/migrate-from-2x)。
:::

## 推荐的所有权模型

把唯一数据来源放在主应用中。微应用通过 props 接收以下三类内容之一：

- 用来渲染的**数据快照**；
- 用来上报事件或请求主应用执行操作的**回调**；
- 多个消费者需要实时状态时，由**主应用持有的 store 或服务**。

不要把 `window` 当成应用间状态 API。这样会让所有权和清理边界变得模糊，而且开启 JavaScript 隔离后，它也不是可靠的通信契约。

## 从 `loadMicroApp` 和 props 开始

由主应用创建微应用、保存句柄，并在 `props` 中传入初始快照：

```ts [主应用]
import { loadMicroApp } from 'qiankun';
const profileApp = loadMicroApp({
  name: 'profile',
  entry: 'https://profile.example.com',
  container: document.getElementById('micro-app')!,
  props: {
    user: { id: 'u-42', displayName: 'Ada' },
    theme: 'light',
  },
});
// 保存 profileApp，之后用它调用 update 和 unmount。
```

微应用从生命周期参数读取这些值，并且只渲染到传入的容器中：

```ts [微应用入口]
let destroyView: (() => void) | undefined;
export async function mount(props) {
  destroyView = renderProfile(props.container, {
    user: props.user,
    theme: props.theme,
  });
}
export async function unmount() {
  destroyView?.();
  destroyView = undefined;
}
```

`props` 中的普通值描述挂载时的数据快照。函数和对象则是主应用持有的引用；只传入确实需要的引用，并为它们定义小而清晰的接口。

主应用不再需要这个微应用时，调用 `await profileApp.unmount()`。移除容器或丢掉变量不能替代微应用生命周期。

## 用 `update` 推送新快照

已经挂载的应用需要新的渲染数据时，保存句柄，并在挂载完成后调用可选的 `update`：

```ts [主应用]
async function showDarkTheme() {
  const nextSnapshot = {
    user: { id: 'u-42', displayName: 'Ada' },
    theme: 'dark',
  };
  await profileApp.mountPromise;
  await profileApp.update?.(nextSnapshot);
}
```

微应用通过导出 `update` 选择接收更新：

```ts [微应用入口]
export async function update(nextProps) {
  rerenderProfile({
    user: nextProps.user,
    theme: nextProps.theme,
  });
}
```

把每次更新都视为微应用所需自定义 props 的一份完整新快照，不要依赖 qiankun 与旧对象做合并。如果微应用没有导出 `update`，句柄也就没有更新行为，因此这里适合使用可选链。

如果是连续事件流或高频变化的状态，回调或主应用持有的 store 通常比不断推送快照更清晰。

## 传入主应用持有的能力

### 用回调接收微应用事件

微应用需要上报事件或请求主应用执行操作时，传入一个职责明确的回调：

```ts [主应用与微应用]
const onProfileAction = (action: { type: 'ready' | 'sign-out' }) => {
  if (action.type === 'sign-out') signOutCurrentUser();
};
const profileApp = loadMicroApp({
  name: 'profile',
  entry: 'https://profile.example.com',
  container,
  props: { user, onProfileAction },
});
// 微应用内部：
export async function mount(props) {
  props.onProfileAction({ type: 'ready' });
}
```

回调载荷应尽量可版本化、可序列化。回调应该表达 `onCheckout`、`requestNavigation` 这类意图，而不是把整个主应用对象暴露给微应用。

### 由主应用持有共享 store

多个应用需要同一份实时状态时，在主应用中只创建一次 store，再把同一个小型接口传给每个应用。Redux、Zustand、RxJS 或项目自己的 store 都可以；qiankun 不限定状态库。

```ts [主应用]
const sessionStore = createSessionStore();
const profileApp = loadMicroApp({
  name: 'profile',
  entry: 'https://profile.example.com',
  container,
  props: { sessionStore },
});
```

微应用创建的订阅必须在 `unmount` 中释放：

```ts [微应用入口]
let unsubscribe: (() => void) | undefined;
export async function mount({ container, sessionStore }) {
  renderSession(container, sessionStore.getSnapshot());
  unsubscribe = sessionStore.subscribe((snapshot) => {
    rerenderSession(snapshot);
  });
}
export async function unmount() {
  unsubscribe?.();
  unsubscribe = undefined;
  destroySessionView();
}
```

::: danger 一定要取消订阅
订阅存在于主应用持有的 store 上，因此主应用可能通过监听函数继续引用已经卸载的微应用。qiankun 无法替你清理这层关系。在 `mount` 中创建的每个订阅，都要在 `unmount` 中调用对应的取消订阅函数。
:::

## 路由驱动与松耦合替代方案

如果 URL 完全决定应用是否激活，`registerMicroApps` 仍是路由驱动的替代方案。它接收初始 `props`，但不会返回可以推送快照的逐应用句柄；后续变化请使用回调或主应用持有的 store。参见 [registerMicroApps](/zh-CN/api/register-micro-apps)。

确实需要松耦合时，选择与需求相符的浏览器通道：

- 用路径、query string 或 hash 传递少量可序列化的导航状态；
- 用 `BroadcastChannel` 发送同源跨标签页消息；
- 用 `postMessage` 做跨窗口通信，并严格校验 origin；
- 用主应用提供的 `EventTarget` 发送同页面即发即弃事件，并在卸载时清理监听。

像设计 prop 类型一样设计消息 schema 和所有权。浏览器通道适合特定拓扑，但不应成为把普通应用状态藏进全局事件总线的理由。

## 检查清单

- 唯一数据来源放在主应用中。
- 首选 `loadMicroApp` 加 props 作为主接入路径。
- 保存返回的句柄，用它执行可选的 `update` 和必要的 `unmount`。
- 通过 `update` 发送完整、不可变的新快照。
- 双向或实时通信使用回调，或接口精简的主应用 store。
- 在 `unmount` 中取消主应用服务上的每一个订阅。
- 只有确实需要松耦合时，才使用路由或浏览器通道。

继续阅读[微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props)、[loadMicroApp](/zh-CN/api/load-micro-app)，以及对应的 [React](/zh-CN/ecosystem/react) 或 [Vue](/zh-CN/ecosystem/vue) 组件 API。
