# start

启动由 [`registerMicroApps`](/zh-CN/api/register-micro-apps) 注册的路由驱动应用。调用后，single-spa 会根据当前 URL 和每个应用的 `activeRule` 自动挂载或卸载应用。

直接使用 [`loadMicroApp`](/zh-CN/api/load-micro-app) 时无需调用 `start()`；如需统一设置加载超时，可在首次加载前调用 `start({ timeout })`。

## 函数签名

```ts
function start(opts?: StartOpts & Pick<AppConfiguration, 'timeout'>): void;
```

`StartOpts` 类型由 single-spa 提供，qiankun 在此基础上增加 `timeout`：

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `urlRerouteOnly` | `boolean` | `true` | 为 `true` 时，只在 URL 实际变化后重新匹配应用。 |
| `timeout` | `number` | `0`（关闭） | 后续微应用加载的默认超时，单位为毫秒。应用级配置可覆盖；正有限数启用，`0` 关闭。 |

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

`start()` 是幂等函数，重复调用不会重复启动路由处理，也不会修改首次调用确定的超时默认值。

## 与 `loadMicroApp` 的关系

`loadMicroApp` 会确保运行时已完成初始化，因此按需加载时可直接调用。通过 `start({ timeout })` 设置全局默认值时，应在首次 `loadMicroApp` 之前调用；单个应用仍可通过第二个参数覆盖它。

```ts
import { loadMicroApp, start } from 'qiankun';

start({ timeout: 10_000 });
const app = loadMicroApp({ name: 'app1', entry, container });
const streamingApp = loadMicroApp(
  { name: 'streaming-app', entry: streamingEntry, container: streamingContainer },
  { timeout: 0 },
);
```

该默认值同时适用于 `registerMicroApps` 的路由应用；它们可通过 `configuration.timeout` 覆盖。计时范围、清理行为和无效值处理见 [AppConfiguration](/zh-CN/api/configuration#timeout)。

从 qiankun 2.x 迁移时，不应继续向 `start()` 传入沙箱、预取或 fetch 配置。完整变更见[从 qiankun 2.x 迁移](/zh-CN/cookbook/migrate-from-2x)。

## 相关内容

- [loadMicroApp](/zh-CN/api/load-micro-app)——推荐的按需实例加载方式。
- [registerMicroApps](/zh-CN/api/register-micro-apps)——注册由 URL 驱动的应用。
- [加载一个微应用实例](/zh-CN/concepts/architecture)——两种加载方式的选择。
