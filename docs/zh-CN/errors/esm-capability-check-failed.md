# esm-capability-check-failed：ESM 能力检测未完成

## 触发原因

ESM 能力检测的同源 iframe 无法访问、初始化失败、脚本被强制 CSP 拦截，或检测在 5 秒内未完成。该错误表示检测受到环境限制，不能据此认定浏览器不支持动态多 import map。

检测会清理 iframe、事件处理器和临时 blob URL，结果在同一宿主文档中复用。若应用配置的 `loadTimeout` 更早到期，宿主可能先收到 `load-timeout`。

## 排查步骤

1. 检查控制台中的 CSP、Trusted Types 和 iframe 访问错误。
2. 确认页面允许创建和访问同源 `about:blank` iframe。该 iframe 继承宿主的来源和 CSP，仅用于检测，不承载微应用。
3. 确认脚本策略允许检测使用的 `blob:` 模块和内联 import map；同时检查 `script-src-elem` 等更具体的指令。完整要求见 [内容安全策略（CSP）](/zh-CN/guide/csp-requirements)。

## 解决办法

按部署要求调整页面的脚本及嵌入策略。检测未通过前，应向用户展示加载失败提示，或选择 Classic 构建入口。该检测不覆盖微应用资源的 CORS、网络状态或全部 CSP 要求。

## 相关内容

- [浏览器支持](/zh-CN/guide/browser-support)
- [错误码与解决办法](/zh-CN/errors/)
- [esm-capability-check-failed: ESM capability check could not complete](/errors/esm-capability-check-failed)
