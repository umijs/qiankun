# 生命周期钩子（`LifeCycles`）

`LifeCycles` 是主应用提供的钩子，用于观察一个微应用的准备、挂载和卸载过程。它们不负责实现微应用；应用自己导出的 `bootstrap`、`mount`、`unmount` 和可选 `update` 属于另一份契约。

## 与 loadMicroApp 一起使用

把钩子作为 [`loadMicroApp`](/zh-CN/api/load-micro-app) 的第三个参数传入，它们只作用于返回的这个实例：

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

// 之后，主应用不再需要这个实例时：
await microApp.unmount();
```

空的第二个参数是单应用配置的位置；需要设置时参见 [`AppConfiguration`](/zh-CN/api/configuration)。

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

每个字段可以接收一个函数或一个数组。数组成员按声明顺序运行；qiankun 会等待前一个函数返回的 Promise，再启动下一个。如果某个钩子 reject，链中剩余钩子不会运行，当前生命周期转换也会失败。

## 五个钩子

| 钩子 | 时机保证 | 主应用中的常见用途 |
| --- | --- | --- |
| `beforeLoad` | 在入口准备期间执行，qiankun 继续使用解析出的应用生命周期之前完成；不保证早于网络请求 | 开启主应用侧 loading 或记录耗时 |
| `beforeMount` | 紧接在微应用自己的 `mount` 被调用之前 | 准备本次挂载所需的主应用上下文 |
| `afterMount` | 微应用的 `mount` Promise resolve 之后 | 关闭 loading 或记录成功挂载 |
| `beforeUnmount` | 紧接在微应用自己的 `unmount` 被调用之前 | 持久化主应用持有的状态或停止主应用订阅 |
| `afterUnmount` | 微应用的 `unmount` Promise resolve 后，在拆卸阶段执行 | 完成主应用清理或记录一次会话结束 |

`beforeMount` / `afterMount` 只围绕应用的 `mount`，不围绕入口加载或 `bootstrap`；`beforeUnmount` / `afterUnmount` 同样围绕应用的 `unmount` 阶段。

重新挂载时，每次状态转换都会运行对应的挂载和卸载钩子。`beforeLoad` 属于入口准备，不是每次挂载都会执行的钩子。

### `beforeLoad` 与网络时机

入口准备可能在 `beforeLoad` 被等待之前就开始，因此钩子可能与入口请求重叠。不要用它注入认证信息、改写 URL，也不要假设它会在 fetch 开始前运行。请通过 [`AppConfiguration.fetch`](/zh-CN/api/configuration) 配置请求行为。

qiankun 会等待 `beforeLoad`，再继续使用从入口解析出的生命周期对象。因此它适合主应用侧的观察工作，但不适合改变入口的加载方式。

## `global` 参数

默认沙箱开启时，`global` 是当前微应用实例看到的隔离 `WindowProxy` 视图。它既不是微应用导出的生命周期对象，也不是主应用页面真实的 `window`。

只有在微应用明确需要从自身 window 视图读取某个值时才使用它；应用数据和回调应优先通过 `props` 传递。关闭沙箱后，这些隔离保证不再成立。公开边界见 [JavaScript 隔离](/zh-CN/concepts/js-sandbox)。

## 路由驱动应用

选择路由驱动方式时，把一个 `LifeCycles` 对象作为 [`registerMicroApps`](/zh-CN/api/register-micro-apps) 的第二个参数传入。它会作用于这次调用注册的所有应用，因此上报或按应用分支时应使用 `app` 参数。除此之外，钩子的含义和时机保证相同。

## 主应用钩子与微应用生命周期

主应用的 `LifeCycles` 接收 `(app, global)`，观察实例周围的状态转换；微应用自己的 `bootstrap`、`mount`、`unmount` 和可选 `update` 接收 props，负责渲染应用并完成清理。主应用钩子不能替代这些导出。

应用侧契约见[微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props)。

## 相关内容

- [`loadMicroApp`](/zh-CN/api/load-micro-app)——按实例加载与句柄所有权
- [`registerMicroApps`](/zh-CN/api/register-micro-apps)——路由驱动激活
- [`AppConfiguration`](/zh-CN/api/configuration)——请求与沙箱配置
- [类型参考](/zh-CN/api/types)——`LoadableApp`、`MicroApp` 及相关类型
