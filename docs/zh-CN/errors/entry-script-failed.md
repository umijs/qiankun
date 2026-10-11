# entry-script-failed：`entry` 脚本加载失败

## 触发原因

标记为 `entry` 的非 ESM 脚本触发了 `error` 事件，导致 HTML 入口加载失败，对应的 Promise 进入 rejected 状态。错误信息会包含 HTML 入口地址和脚本地址。

此错误码对应 `entry` 脚本元素的 `error` 事件，并不代表所有脚本运行时异常都会转换成此错误。标记为 `entry` 的 ESM 脚本通过模块导入 Promise 确认执行结果。

## 排查步骤

1. 按错误信息中的地址检查网络请求，确认脚本 URL、响应状态和响应内容正确。
2. 查看控制台中同一时刻的错误，检查 CORS 或内容安全策略（CSP）是否阻止了资源加载或执行。
3. 若地址已转换为 blob URL，结合原始脚本地址和更早的日志定位源文件。

## 解决办法

根据浏览器报告修正资源地址、服务器响应、跨域访问或 CSP 配置，并处理对应脚本问题。先确认 `entry` 脚本能在主应用页面中正常加载，再重新加载微应用。

## 相关内容

- [错误码与解决办法](/zh-CN/errors/)
- [entry-script-failed: Entry script failed to load](/errors/entry-script-failed)
