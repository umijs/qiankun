# 生命周期钩子（`LifeCycles`）

`LifeCycles` 是由主应用提供的钩子，用于观察微应用的准备、挂载和卸载过程。这些钩子不负责实现微应用本身；微应用导出的 `bootstrap`、`mount`、`unmount` 和可选的 `update` 属于另一项生命周期契约。

## 在 loadMicroApp 中使用

将钩子作为 [`loadMicroApp`](/zh-CN/api/load-micro-app) 的第三个参数传入。钩子仅作用于本次调用创建的实例：

```ts
import { loadMicroApp } from 'qiankun';

const container = document.getElementById('micro-app-slot');
if (!container) throw new Error('micro-app-slot not found');

const microApp = loadMicroApp(
  {
    name: 'account-app',
    entry: 'http://localhost:7101/',
    container,
  },
  {},
  {
    beforeLoad: async (app) => console.log('preparing', app.name),
    beforeMount: [
      async (app) => console.log('mounting', app.name),
      async (_app, global) => console.log('app URL', global.location.href),
    ],
    afterMount: async (app) => console.log('mounted', app.name),
    beforeUnmount: async (app) => console.log('unmounting', app.name),
    afterUnmount: async (app) => console.log('unmounted', app.name),
  },
);

await microApp.mountPromise;

// 主应用不再需要该实例时：
await microApp.unmount();
```

第二个参数用于传入应用配置。示例中未设置配置项，因此传入空对象；具体配置见 [`AppConfiguration`](/zh-CN/api/configuration)。

## 类型

```ts
type ObjectType = Record<string, unknown>;

type LifeCycleFn<T extends ObjectType> = (
  app: LoadableApp<T>,
  global: WindowProxy,
) => Promise<void>;

type LifeCycles<T extends ObjectType> = {
  beforeLoad?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  beforeMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  afterMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  beforeUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  afterUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
};
```

`app` 是主应用传入的 [`LoadableApp`](/zh-CN/api/types) 描述对象：`{ name, entry, container, props? }`。

每个字段可接收一个函数或函数数组。数组中的函数按声明顺序执行；qiankun 会等待前一个函数返回的 Promise 完成，再执行下一个函数。如果某个钩子的 Promise 被拒绝，后续钩子不会执行，当前生命周期转换也会失败。

## 五个钩子

| 钩子 | 时机保证 | 主应用中的常见用途 |
| --- | --- | --- |
| `beforeLoad` | 在入口准备阶段执行，并在 qiankun 调用解析出的微应用生命周期前完成；网络请求可能更早开始 | 显示主应用侧加载状态或记录耗时 |
| `beforeMount` | 在微应用自身的 `mount` 调用前执行 | 准备本次挂载所需的主应用上下文 |
| `afterMount` | 微应用的 `mount` Promise 完成之后 | 隐藏加载状态或记录挂载成功事件 |
| `beforeUnmount` | 在微应用自身的 `unmount` 调用前执行 | 持久化主应用持有的状态或停止主应用订阅 |
| `afterUnmount` | 微应用的 `unmount` Promise 完成后，在卸载阶段执行 | 完成主应用清理或记录会话结束事件 |

`beforeMount` 和 `afterMount` 分别在应用 `mount` 的前后执行，不包含入口加载或 `bootstrap` 阶段；`beforeUnmount` 和 `afterUnmount` 则分别在应用 `unmount` 的前后执行。

应用重新挂载时，每一次挂载/卸载都会再次执行对应钩子。`beforeLoad` 属于入口准备阶段，不会在每次挂载时执行。

### `beforeLoad` 与网络时机

入口准备可能在 qiankun 等待 `beforeLoad` 之前开始，因此该钩子的执行可能与入口请求重叠。请勿通过该钩子注入认证信息或修改 URL，也不应假定它一定在 fetch 开始前执行。请求行为应通过 [`AppConfiguration.fetch`](/zh-CN/api/configuration) 配置。

qiankun 会等待 `beforeLoad` 完成，再使用从入口解析出的生命周期对象。因此，该钩子适合执行主应用侧的观察逻辑，不适合修改入口加载方式。

## `global` 参数

启用默认沙箱时，`global` 是当前微应用实例对应的隔离 `WindowProxy` 视图。它既不是微应用导出的生命周期对象，也不是主应用页面中的真实 `window`。

仅当微应用需要从自身隔离的 `window` 视图读取特定值时才应使用该参数。应用数据和回调应优先通过 `props` 传递。关闭沙箱后，上述隔离保证不再成立。相关限制参见 [JavaScript 隔离](/zh-CN/concepts/js-sandbox)。

## 路由驱动应用

使用路由驱动方式时，将 `LifeCycles` 对象作为 [`registerMicroApps`](/zh-CN/api/register-micro-apps) 的第二个参数传入。该对象作用于本次调用注册的所有应用，因此在上报数据或区分应用时，应根据 `app` 参数进行处理。钩子的含义和执行时机与 `loadMicroApp` 相同。

## 主应用钩子与微应用生命周期

主应用的 `LifeCycles` 接收 `(app, global)`，用于观察实例的状态转换。微应用导出的 `bootstrap`、`mount`、`unmount` 和可选的 `update` 接收 props，负责渲染应用并完成清理。主应用钩子不能替代微应用导出的生命周期函数。

应用侧契约见[微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props)。

## 相关内容

- [`loadMicroApp`](/zh-CN/api/load-micro-app)——按需加载和管理微应用实例。
- [`registerMicroApps`](/zh-CN/api/register-micro-apps)——路由驱动激活。
- [`AppConfiguration`](/zh-CN/api/configuration)——请求与沙箱配置。
- [类型参考](/zh-CN/api/types)——`LoadableApp`、`MicroApp` 及相关类型。
