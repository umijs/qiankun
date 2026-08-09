# 应用间共享状态与通信

在 qiankun v3 中，共享状态由主应用管理，只向各微应用提供其所需的数据和接口。大多数场景优先使用 `loadMicroApp` 即可：通过 `props` 传入初始数据，并保存返回的实例句柄，以便后续更新或卸载微应用。

::: warning 从 qiankun 2.x 迁移
qiankun v3 不再提供 `initGlobalState`、`onGlobalStateChange`、`setGlobalState` 和 `MicroAppStateActions`。请改用下文所述的显式通信方式，详见[从 qiankun 2.x 迁移](/zh-CN/cookbook/migrate-from-2x)。
:::

## 状态归属原则

把共享状态的唯一数据源放在主应用。微应用通过 `props` 接收以下内容：

- 用于渲染的**数据快照**；
- 用于上报事件或请求主应用执行操作的**回调函数**；
- 多个应用需要共享实时状态时，由**主应用管理的状态容器或服务**。

不要把 `window` 当作应用间的状态接口。全局对象无法明确状态归属和清理边界，并且在启用 JavaScript 隔离后也不能作为可靠的通信约定。

## 优先使用 `loadMicroApp` 和 props

主应用负责创建微应用、保存实例句柄，并通过 `props` 传入初始数据快照：

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

微应用从生命周期参数中读取这些值，并且仅在传入的容器中渲染：

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

`props` 中的普通值表示挂载时的数据快照。通过 `props` 传入的函数和对象仍由主应用持有，微应用获得的是对应引用。因此，只传入必要的引用，并为它们定义范围明确的接口即可。

主应用不再需要该微应用时，调用 `await profileApp.unmount()`。仅移除容器或释放句柄变量，不会执行微应用的卸载生命周期。

## 通过 `update` 传递新快照

已挂载的应用需要更新渲染数据时，通过已保存的句柄，在挂载完成后调用可选的 `update` 方法：

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

微应用可以导出 `update` 生命周期以接收更新：

```ts [微应用入口]
export async function update(nextProps) {
  rerenderProfile({
    user: nextProps.user,
    theme: nextProps.theme,
  });
}
```

每次更新都应传入完整的自定义 `props` 快照，不要依赖 qiankun 将新值与旧对象合并。如果微应用未导出 `update`，实例句柄不会提供更新方法，因此调用时需使用可选链。

对于连续事件流或高频变化的状态，回调函数或由主应用管理的状态容器通常比反复传递快照更合适。

## 传递由主应用提供的接口

### 通过回调接收微应用事件

微应用需要上报事件或请求主应用执行操作时，传入职责明确的回调函数：

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

回调参数尽量采用便于扩展的结构，并保持可序列化。回调应按业务意图命名，例如 `onCheckout`、`requestNavigation`；不要向微应用暴露完整的主应用对象。

### 由主应用管理共享状态

多个应用需要共享同一份实时状态时，可以在主应用中创建状态容器，向各应用传入同一个精简接口。可以使用 Redux、Zustand、RxJS 或项目自有的状态方案；qiankun 不限制具体实现。

```ts [主应用]
const sessionStore = createSessionStore();
const profileApp = loadMicroApp({
  name: 'profile',
  entry: 'https://profile.example.com',
  container,
  props: { sessionStore },
});
```

微应用创建的订阅必须在 `unmount` 中取消：

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

::: danger 必须取消订阅
订阅注册在主应用管理的状态容器中，因此监听函数可能在微应用卸载后仍保留对该应用的引用。qiankun 无法自动清理此类引用关系。在 `mount` 中创建的每项订阅，都必须在 `unmount` 中调用对应的取消订阅函数。
:::

## 路由驱动和解耦通信方式

如果应用是否激活完全由 URL 决定，可以使用 `registerMicroApps`。该 API 接收初始 `props`，但不会为各应用返回可用于更新快照的实例句柄；后续状态变化通过回调函数或主应用管理的状态容器传递。参见 [`registerMicroApps`](/zh-CN/api/register-micro-apps)。

需要降低应用间的直接依赖时，可根据通信范围选择浏览器提供的通道：

- 通过路径、查询字符串或哈希传递少量可序列化的导航状态；
- 通过 `BroadcastChannel` 在同源标签页之间传递消息；
- 通过 `postMessage` 实现跨窗口通信，并严格校验来源；
- 通过主应用提供的 `EventTarget` 发送无需持久化的同页面事件，并在卸载时移除监听器。

消息结构、版本和归属最好像 `props` 类型一样写明确。浏览器通道各有适用的通信范围，不要用全局事件总线代替常规状态管理。

## 检查清单

- 由主应用维护唯一数据来源。
- 优先使用 `loadMicroApp` 和 props 作为接入方式。
- 保存返回的实例句柄，通过该句柄执行可选的 `update` 和必要的 `unmount`。
- 通过 `update` 发送完整、不可变的新快照。
- 双向或实时通信使用回调函数，或由主应用提供的精简状态接口。
- 在 `unmount` 中取消对主应用服务创建的所有订阅。
- 仅在确有解耦需求时使用路由或浏览器通道。

相关内容见[微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props)、[`loadMicroApp`](/zh-CN/api/load-micro-app)，以及对应的 [React](/zh-CN/ecosystem/react) 或 [Vue](/zh-CN/ecosystem/vue) 组件 API。
