# esm-unsupported：ESM 沙箱所需能力不可用

## 触发原因

浏览器未能通过 ESM 沙箱的动态多 import map 检测。qiankun 在独立的同源 iframe 中先注入第一张 import map 并执行模块，再追加第二张映射并执行模块；任一步模块加载失败均会触发此错误。

检测发生在微应用 ESM 模块的获取、改写和执行之前。同一宿主文档中的检测结果会复用；Classic 脚本不会触发此检测。

## 排查步骤

1. 对照[浏览器支持](/zh-CN/guide/browser-support)，确认当前浏览器满足原生 ESM 的要求。仅支持 ES 模块或单张 import map 并不足够。
2. 检查控制台中的 CSP 拒绝信息。检测通常会将强制 CSP 拦截报告为 `esm-capability-check-failed`，但此错误码不能代替完整的 CSP 排查。
3. 通过 `microApp.mountPromise` 捕获错误，并使用 `error instanceof QiankunError` 和 `error.code` 判断原因，避免匹配浏览器错误文案。

## 解决办法

使用满足要求的浏览器，或为微应用提供 Classic 构建入口，由宿主选择该入口。qiankun 3.0 不提供 ESM 沙箱降级；关闭沙箱也不是保留隔离的兼容方案。不应要求用户修改浏览器实验开关。

若检测无法完成，会报告 [esm-capability-check-failed：ESM 能力检测未完成](/zh-CN/errors/esm-capability-check-failed)。

## 相关内容

- [浏览器支持](/zh-CN/guide/browser-support)
- [错误码与解决办法](/zh-CN/errors/)
- [esm-unsupported: Required ESM sandbox capabilities are unavailable](/errors/esm-unsupported)
