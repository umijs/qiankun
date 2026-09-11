# 内容安全策略（CSP）

qiankun 3 的脚本执行器不依赖 `eval` 或 `new Function`，无需为框架本身放行 `'unsafe-eval'`。但脚本和样式经过沙箱转换后，可能通过 Blob URL 或内联节点交给浏览器，主应用的内容安全策略（CSP）需要允许这些资源。

本页适用于默认沙箱及独立使用的 `@qiankunjs/sandbox`。微应用与主应用共用文档，策略应配置在**主应用 HTML 响应**上；只调整微应用资源服务器的 CSP 不能代替主应用配置。浏览器兼容性见[浏览器支持](/zh-CN/guide/browser-support)。

## 最小策略示例

以下响应头适用于**主应用、微应用及其资源均同源**，且使用 ESM、内联脚本和样式隔离的场景：

```http
Content-Security-Policy: default-src 'self'; script-src 'self' blob: 'unsafe-inline'; style-src 'self' blob: 'unsafe-inline'; connect-src 'self'
```

这是满足上述运行方式的最小示例。`'unsafe-inline'` 会放行对应类别的所有内联内容，应按下文的执行路径收紧。业务用到的图片、字体、接口和其他来源仍需按实际情况配置。

跨源部署时，在 `connect-src` 中加入微应用入口、脚本、模块、隔离样式及接口的实际来源，例如：

```http
Content-Security-Policy: default-src 'self'; script-src 'self' blob: 'unsafe-inline'; style-src 'self' blob: 'unsafe-inline'; connect-src 'self' https://micro-app.example.com https://api.example.com
```

将示例域名替换为实际地址。跨源 fetch 还必须满足 CORS；CSP 放行不会代替服务器的 CORS 响应头。未经过转换、由浏览器直接加载的外链脚本或样式，其来源还需分别加入 `script-src` 或 `style-src`。

## 各项权限的用途

| 策略 | 何时需要 | 原因 |
| --- | --- | --- |
| `default-src 'self'` | 示例的默认来源约束 | 未单独配置的资源类型回退到同源策略 |
| `script-src 'self'` | 加载主应用自身的外链脚本 | 主应用代码由浏览器直接加载 |
| `script-src blob:` | 沙箱执行外链 Classic 脚本、ESM，或调用 `evaluateScript()` | 转换后的脚本、模块和运行时辅助模块通过 Blob URL 执行 |
| `script-src 'unsafe-inline'` | 使用当前 ESM 引擎，或存在未通过 nonce 等方式授权的内联 Classic 脚本 | ESM 引擎动态插入内联 import map；HTML 中的内联 Classic 脚本重写后仍是内联脚本 |
| `style-src 'self'` | 加载同源外链样式 | 未启用样式隔离时，外链样式仍由浏览器直接加载 |
| `style-src blob:` | 对外链样式启用 `styleIsolation`，或复用共享样式依赖 | 隔离样式在 fetch 和 `@scope` 等重写后通过 Blob URL 加载；依赖复用也会生成 Blob 样式占位资源 |
| `style-src 'unsafe-inline'` | 使用未通过 nonce 等方式授权的内联样式 | 原有或动态创建的 style 节点经过 `@scope` 重写后仍是内联节点 |
| `connect-src` | 获取微应用 HTML、外链脚本、模块、隔离样式及其 `@import` 资源 | 这些资源先通过 fetch 获取；主应用和微应用的业务请求也受此指令约束 |

图片、字体等由浏览器直接请求的资源仍受 `img-src`、`font-src` 等指令约束，不会因为 CSS 已经转成 Blob URL 而自动放行。

若现有策略单独设置了 `script-src-elem` 或 `style-src-elem`，还需检查这些指令是否允许对应节点；只修改 `script-src` 或 `style-src` 可能不会生效。具体回退规则见 [CSP 规范](https://www.w3.org/TR/CSP3/#directive-script-src-elem)。

### 只使用 Classic 脚本

外链 Classic 脚本和独立沙箱的 `evaluateScript()` 都通过 Blob URL 执行。若主应用和微应用均没有需要内联授权的脚本、事件处理属性等内容，也不使用 ESM，可以去掉 `script-src` 中的 `'unsafe-inline'`：

```http
Content-Security-Policy: default-src 'self'; script-src 'self' blob:; style-src 'self' blob: 'unsafe-inline'; connect-src 'self'
```

此示例仍假设资源同源。它保留了样式隔离和内联样式所需的权限；没有这些样式时，可以继续收紧 `style-src`。不要将它直接用于包含内联 Classic 脚本的 HTML 入口：这类脚本只会被重写，不会自动转成 Blob URL。

### 使用 ESM

普通 JavaScript 模块及辅助模块通过 Blob URL 执行，但模块映射由动态创建的 `<script type="importmap">` 提供。该节点没有 `src`，内容是运行时生成的 JSON，仍受内联脚本检查。规则见 [HTML 规范中的脚本准备步骤](https://html.spec.whatwg.org/multipage/scripting.html#prepare-the-script-element)。

JSON、CSS、WASM 等带类型的模块导入会保留原始 URL，交由浏览器原生加载；跨源使用时，还需按浏览器实际采用的资源指令放行对应来源。

因此，在本页采用的来源白名单策略下，仅放行 `blob:` 不足以运行 ESM，还需要 `'unsafe-inline'`。`'unsafe-eval'` 不能代替这项权限。

## 能否使用 nonce

浏览器支持通过匹配的 nonce 授权单个内联 script 或 style 节点。但当前 qiankun **没有统一的 CSP nonce 配置**，内部生成的 import map 不会自动继承主应用脚本或微应用入口上的 nonce，因此不能仅通过给入口添加 nonce，就把本页 ESM 示例中的 `'unsafe-inline'` 删除。

完整的 nonce 传递能力属于 **3.x 后续计划**，尚未提供可用配置。需要全程使用 nonce 策略的项目，应将这一限制纳入接入评估；本页不提供尚未实现的 nonce API 示例。

另外，运行时 import map 包含实例标识和新建的 Blob URL，无法用一份构建期固定 hash 覆盖。内联 Classic 脚本和隔离样式的内容也会被重写，原始内容的 hash 不能直接用于授权转换后的节点。

同一来源列表中加入 nonce 或 hash 后，浏览器会忽略其中的 `'unsafe-inline'`，不能靠同时添加两者作为兜底。参见 [CSP 的内联匹配规则](https://www.w3.org/TR/CSP3/#match-element-to-source-list)。

## 如何验证

1. 使用生产构建产物，在主应用 HTML 响应上配置策略。
2. 在目标浏览器中分别验证首次加载、动态资源加载、卸载后重新挂载，以及实际使用的 ESM 和样式隔离路径。
3. 查看控制台的 CSP 违规信息，区分被阻止的是 Blob 脚本、内联 import map、内联脚本或样式，还是 fetch 的目标来源。

仓库中的 [Classic CSP 用例](https://github.com/umijs/qiankun/blob/next/e2e/tests/sandbox-js.spec.ts)、[ESM CSP 用例](https://github.com/umijs/qiankun/blob/next/e2e/tests/esm-sandbox.spec.ts)和[独立沙箱用例](https://github.com/umijs/qiankun/blob/next/e2e/tests/standalone-sandbox.spec.ts)覆盖了不含 `'unsafe-eval'` 的策略。这些用例仍放行 Blob 和内联内容，不能作为 nonce 策略已经受支持的依据。

如果业务代码、第三方依赖或开发工具自身调用 `eval` / `new Function`，它们仍可能触发 CSP 拦截；qiankun 不依赖这些调用，不代表微应用也没有这类调用。

## 继续阅读

- [浏览器支持](/zh-CN/guide/browser-support)
- [原生 ESM 支持](/zh-CN/concepts/esm-sandbox)
- [样式隔离](/zh-CN/concepts/style-isolation)
- [不依赖 qiankun，独立使用沙箱](/zh-CN/cookbook/standalone-sandbox)
