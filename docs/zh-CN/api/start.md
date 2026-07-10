# start

启动由 [`registerMicroApps`](/zh-CN/api/register-micro-apps) 注册的路由驱动应用。调用后，single-spa 会根据当前 URL 和每个应用的 `activeRule` 自动挂载或卸载应用。

直接使用 [`loadMicroApp`](/zh-CN/api/load-micro-app) 时不需要调用 `start()`。

## 签名

```ts
function start(opts?: StartOpts): void;
```

`StartOpts` 来自 single-spa：

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `urlRerouteOnly` | `boolean` | `false` | 为 `true` 时，只在 URL 实际变化后重新匹配应用。 |

## 用法

```ts
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'sub-app',
    entry: '//localhost:7101',
    container: document.getElementById('subapp-container')!,
    activeRule: '/sub-app',
  },
]);

start();
```

`start()` 是幂等的，重复调用不会再次启动路由。

## 与 `loadMicroApp` 的关系

`loadMicroApp` 会确保运行时已经就绪，所以按需加载时直接调用它即可。只有注册式路由方案需要显式调用 `start()`。

从 qiankun 2.x 迁移时，不要继续向 `start()` 传沙箱、预取或 fetch 配置。完整变化见[迁移指南](/zh-CN/cookbook/migrate-from-2x)。

## 相关内容

- [loadMicroApp](/zh-CN/api/load-micro-app) —— 推荐的按需实例加载方式。
- [registerMicroApps](/zh-CN/api/register-micro-apps) —— 注册由 URL 驱动的应用。
- [加载一个微应用实例](/zh-CN/concepts/architecture) —— 两种加载方式的选择。
