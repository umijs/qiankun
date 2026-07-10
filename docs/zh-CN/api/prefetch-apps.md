# prefetchApps（已废弃）

`prefetchApps` 为指定微应用预热浏览器 HTTP 缓存。它只为兼容旧代码保留，新项目不应调用。

::: warning 已废弃
qiankun v3 的流式 HTML Entry 加载会在处理入口时发现并加载资源。`start()` 也不再接收预取策略。当前性能建议见[优化微应用加载](/zh-CN/cookbook/optimize-loading)。
:::

## 签名

```ts
function prefetchApps(
  apps: AppMetadata[],
  fetch?: typeof window.fetch,
): void;
```

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `apps` | `AppMetadata[]` | — | 要预热的 `{ name, entry }` 列表。 |
| `fetch` | `typeof window.fetch` | `window.fetch` | 请求入口以及发现的外部脚本和样式时使用的 fetch 实现。 |

函数立即返回，不提供完成 promise，也不会创建沙箱、执行脚本或挂载应用。

## 遗留行为

调用后，它会在浏览器空闲时获取入口 HTML，并尝试获取其中的外部脚本和样式表。离线、省流量或慢速网络环境可能跳过预取；单个请求失败也不会让函数抛出同步错误。

```ts
import { prefetchApps } from 'qiankun';

// 仅用于维护已有调用；不要添加到新项目。
prefetchApps([{ name: 'legacy-app', entry: 'https://cdn.example.com/legacy-app/' }]);
```

`PrefetchStrategy` 类型仍为兼容性而导出，但没有任何 v3 公共 API 使用它。

## 相关内容

- [优化微应用加载](/zh-CN/cookbook/optimize-loading)
- [HTML Entry 与执行](/zh-CN/concepts/html-entry-loading)
- [从 qiankun 2.x 迁移](/zh-CN/cookbook/migrate-from-2x)
