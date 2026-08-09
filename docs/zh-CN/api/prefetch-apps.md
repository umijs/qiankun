# prefetchApps（已废弃）

`prefetchApps` 用于预先获取指定微应用的资源并填充浏览器 HTTP 缓存。该函数仅为兼容旧代码而保留，新项目不应使用。

::: warning 已废弃
qiankun v3 的流式 HTML 入口加载会在处理入口时发现并加载资源。`start()` 也不再接收预取策略。当前性能建议见[优化微应用加载](/zh-CN/cookbook/optimize-loading)。
:::

## 函数签名

```ts
function prefetchApps(
  apps: AppMetadata[],
  fetch?: typeof window.fetch,
): void;
```

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `apps` | `AppMetadata[]` | — | 需要预取的 `{ name, entry }` 列表。 |
| `fetch` | `typeof window.fetch` | `window.fetch` | 请求入口以及发现的外部脚本和样式时使用的 fetch 实现。 |

函数会立即返回，不会返回表示完成状态的 Promise，也不会创建沙箱、执行脚本或挂载应用。

## 兼容行为

调用后，该函数会在浏览器空闲时获取入口 HTML，并尝试获取其中引用的外部脚本和样式表。在离线、开启省流模式（Save-Data）或低速网络环境中，预取可能被跳过。单个请求失败也不会使函数同步抛出错误。

```ts
import { prefetchApps } from 'qiankun';

// 仅用于维护现有调用；新项目不应使用。
prefetchApps([{ name: 'legacy-app', entry: 'https://cdn.example.com/legacy-app/' }]);
```

`PrefetchStrategy` 类型仍为兼容性而导出，但没有任何 v3 公共 API 使用它。

## 相关内容

- [优化微应用加载](/zh-CN/cookbook/optimize-loading)。
- [HTML 入口](/zh-CN/concepts/html-entry-loading)。
- [从 qiankun 2.x 迁移](/zh-CN/cookbook/migrate-from-2x)。
