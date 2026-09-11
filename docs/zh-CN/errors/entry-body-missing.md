# entry-body-missing：入口响应缺少正文流

## 触发原因

HTML 入口响应的 `Response.body` 为 `null`，加载器无法取得用于流式解析的响应体。

虽然错误信息使用了 `empty`，此分支判断的是响应体是否为 `null`，不是正文长度。零字节但非 `null` 的可读流不会直接触发此错误。

## 排查步骤

1. 检查入口请求的方法和响应状态，确认没有使用 HEAD 请求或返回 204 等无正文响应。
2. 检查自定义 `fetch`、测试替身及预加载逻辑返回的 `Response`，确认没有构造 `new Response(null)`。
3. 查看重定向和网关逻辑，确认最终响应确实提供 HTML 正文。

## 解决办法

让入口 GET 请求返回带有 HTML 正文的有效响应。自定义 `fetch` 或预加载逻辑应保留响应体；在测试中模拟入口时，应提供真实 HTML 字符串或可读流。修复后同时检查 HTML 内容，确保它是微应用入口。

## 相关内容

- [错误码与解决办法](/zh-CN/errors/)
- [entry-body-missing: Missing entry response body](/errors/entry-body-missing)
