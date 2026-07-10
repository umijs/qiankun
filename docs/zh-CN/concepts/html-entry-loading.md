# HTML 入口

qiankun 用一个 HTML 文档的 URL 描述微应用，通常就是它部署后的 `index.html`。把这个 URL 作为 `entry` 传给 [`loadMicroApp`](/zh-CN/api/load-micro-app)，qiankun 会加载文档声明的脚本和样式，并把结果挂载到指定容器。

本页只介绍面向使用者的约定。解析器和资源管线见 [HTML 入口流式加载原理](/zh-CN/internals/streaming-html-entry)。

## 为什么使用 HTML 入口

HTML 文档可以继续作为微应用资源的唯一事实来源。构建产物生成新的哈希文件名后，`index.html` 已经引用了它们，主应用不需要再维护一份容易失去同步的资源清单。

这个模型也保留了独立部署能力：同一个应用可以拥有自己的 HTML 外壳，在开发时独立运行，在生产环境中再由 qiankun 加载。主应用只需要知道入口 URL 和生命周期约定。

## 入口约定

入口应返回合法且非空的 HTML 文档。受支持的构建会把一个外部脚本标记为生命周期入口：

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

一份 HTML 绝不能包含多个带 `entry` 属性的脚本。入口必须是带 `src` 或 `data-src` 的外部脚本，内联脚本不能作为生命周期入口。[`@qiankunjs/bundler-plugin`](/zh-CN/ecosystem/bundler-plugin) 会为受支持的 Vite 和 Webpack 构建添加标记，应优先使用插件，而不是手工修改生成后的 HTML。

文档中仍然可以包含其他脚本。`entry` 标记只用于指出哪个脚本的导出需要满足[微应用生命周期约定](/zh-CN/concepts/lifecycle-and-props)。

## 流式加载带来什么

qiankun 会在响应到达的同时进行处理，而不是等完整 HTML 下载结束后才开始。使用者可以观察到三个结果：

- 页面结构可以逐步写入容器；
- 完整 HTML 下载结束前即可开始发现资源；
- 脚本和样式表遵循文档顺序，因此现有构建产物不需要额外的 qiankun 资源清单。

流式加载不要求微应用使用特殊 API。如果服务器或代理缓冲了整个响应，入口仍然可以工作，只是无法获得渐进加载的收益。部署调优参见[加载性能优化](/zh-CN/cookbook/optimize-loading)。

## Classic 与 ESM 入口

两种格式采用相同的 HTML 入口与生命周期模型，按微应用的构建工具选择即可。

| | Classic 脚本 | 原生 ESM |
| --- | --- | --- |
| 典型入口 | `<script src="/app.js" entry>` | `<script type="module" src="/assets/main.js" entry>` |
| 生命周期暴露方式 | 由打包工具配置的 UMD／全局导出 | 具名导出或默认生命周期对象 |
| 常见场景 | 现有 Webpack 或旧式构建 | Vite 和现代模块构建 |

Classic 脚本与 ESM 模块有不同的执行限制，但主应用最终得到的都是同一种 `MicroApp` 句柄。参见[原生 ESM 支持](/zh-CN/concepts/esm-sandbox)、[接入 Vite 应用](/zh-CN/cookbook/prepare-a-vite-app)或[接入 Webpack 应用](/zh-CN/cookbook/prepare-a-webpack-app)。

## 跨域与部署边界

入口与资源都由主应用所在页面发起请求。两者不在同一源时：

- HTML 入口以及 qiankun 需要获取的每一项资源都要通过 CORS 允许主应用来源；
- 重定向后的地址和资源 URL 也必须能从浏览器访问，只有 HTML 请求成功并不够；
- JavaScript、CSS 和模块应返回正确的内容类型；
- 请求需要 Cookie 或授权信息时，请配置自定义 [`fetch`](/zh-CN/api/configuration)，并让服务端返回匹配的凭据型 CORS 响应头。

HTML 入口模型不会绕过浏览器安全策略，CSP、混合内容规则、身份认证和网络错误仍然有效。

## 继续阅读

- [加载一个微应用实例](/zh-CN/concepts/architecture)——入口在运行模型中的位置。
- [微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props)——入口必须暴露什么。
- [JavaScript 隔离](/zh-CN/concepts/js-sandbox)与[样式隔离](/zh-CN/concepts/style-isolation)——加载后的资源如何被约束。
- [HTML 入口流式加载原理](/zh-CN/internals/streaming-html-entry)——供维护者阅读的解析与执行细节。
