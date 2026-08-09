# HTML 入口

qiankun 使用 HTML 文档的 URL 描述微应用，该文档通常是部署后的 `index.html`。将此 URL 作为 `entry` 传给 [`loadMicroApp`](/zh-CN/api/load-micro-app) 后，qiankun 会加载文档声明的脚本和样式，并将微应用挂载到指定容器。

本页只介绍面向使用者的约定。解析与资源处理流程见 [HTML 入口流式加载原理](/zh-CN/internals/streaming-html-entry)。

## 为什么使用 HTML 入口

HTML 文档可以作为微应用资源的唯一描述文件。构建产物更新哈希文件名后，`index.html` 会同步引用新资源，主应用无需另行维护资源清单。

这种方式不会影响微应用独立部署：微应用可以通过自己的 HTML 页面独立开发和运行，也可以在生产环境中由 qiankun 加载。主应用只需了解入口 URL 和生命周期约定。

## 入口约定

入口应返回合法且非空的 HTML 文档。使用官方构建插件时，生产构建会自动将一个外部脚本标记为生命周期入口：

```html
<!doctype html>
<html>
  <head>
    <link rel="stylesheet" href="/assets/main.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/main.js" entry></script>
  </body>
</html>
```

一份 HTML 文档中不能包含多个带有 `entry` 属性的脚本。入口必须是包含 `src` 或 `data-src` 的外部脚本，内联脚本不能作为生命周期入口。[`@qiankunjs/bundler-plugin`](/zh-CN/ecosystem/bundler-plugin) 会自动标记 Vite 生产构建和 Webpack 构建的入口。Vite 开发环境可以不包含显式标记，此时 ESM 引擎会根据生命周期导出选择入口。建议优先使用插件，不要手动修改生成后的 HTML。

文档中仍可包含其他脚本。`entry` 标记仅用于指定负责导出[微应用生命周期](/zh-CN/concepts/lifecycle-and-props)的脚本。

## 流式加载的作用

qiankun 在接收响应的同时处理 HTML，无需等待整个文档下载完成。因此：

- 页面结构可以逐步写入容器；
- 完整 HTML 下载结束前即可开始发现资源；
- 脚本和样式表按文档顺序处理，现有构建产物无需额外生成 qiankun 资源清单。

流式加载不要求微应用使用额外 API。如果服务器或代理会缓冲完整响应，HTML 入口仍可正常工作，但无法实现渐进加载。部署优化参见[优化微应用加载](/zh-CN/cookbook/optimize-loading)。

## Classic 与 ESM 入口

两种格式采用相同的 HTML 入口和生命周期模型，可根据微应用的构建工具选择。

| | Classic 脚本 | 原生 ESM |
| --- | --- | --- |
| 典型入口 | `<script src="/app.js" entry>` | `<script type="module" src="/assets/main.js" entry>` |
| 生命周期导出方式 | 由打包工具配置的 UMD／全局导出 | 具名导出或默认生命周期对象 |
| 常见场景 | 现有 Webpack 或旧式构建 | Vite 和现代模块构建 |

Classic 脚本与 ESM 模块的执行限制不同，但主应用最终都会获得相同类型的 `MicroApp` 句柄。参见[原生 ESM 支持](/zh-CN/concepts/esm-sandbox)、[接入 Vite 应用](/zh-CN/cookbook/prepare-a-vite-app)或[接入 Webpack 应用](/zh-CN/cookbook/prepare-a-webpack-app)。

## 跨域与部署边界

HTML 入口及其资源均由主应用页面发起请求。微应用与主应用不同源时，需要满足以下条件：

- HTML 入口以及 qiankun 获取的所有资源都必须通过 CORS 允许主应用来源；
- 除 HTML 入口外，重定向后的地址和全部资源 URL 也必须可由浏览器访问；
- JavaScript、CSS 和模块应返回正确的内容类型；
- 请求需要 Cookie 或授权信息时，请配置自定义 [`fetch`](/zh-CN/api/configuration)，并由服务端返回匹配的凭据型 CORS 响应头。

HTML 入口机制不会绕过浏览器的安全策略。CSP、混合内容限制、身份认证和网络错误仍按浏览器规则处理。

## 继续阅读

- [加载一个微应用实例](/zh-CN/concepts/architecture)——入口在运行模型中的位置。
- [微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props)——入口需要导出的内容。
- [JavaScript 隔离](/zh-CN/concepts/js-sandbox)与[样式隔离](/zh-CN/concepts/style-isolation)——加载后的资源如何被约束。
- [HTML 入口流式加载原理](/zh-CN/internals/streaming-html-entry)——供维护者阅读的解析与执行细节。
