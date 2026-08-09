# 常见问题

本页汇总常见问题及初步排查方法。完整配置、示例和原理请参阅对应的指南、API 与概念文档。

## 主应用需要构建插件吗？

不需要。主应用通过 [`loadMicroApp`](/zh-CN/api/load-micro-app) 加载微应用实例。仅路由驱动场景需要使用 [`registerMicroApps`](/zh-CN/api/register-micro-apps) 和 [`start`](/zh-CN/api/start)。

微应用应使用 [`@qiankunjs/bundler-plugin`](/zh-CN/ecosystem/bundler-plugin) 生成符合 qiankun 约定的 HTML 入口，并配置开发服务器。已有项目可按照 [Vite](/zh-CN/cookbook/prepare-a-vite-app) 或 [Webpack](/zh-CN/cookbook/prepare-a-webpack-app) 指南接入。

## 为什么会报 CORS 错误？

主应用页面会获取微应用的 HTML 入口、脚本和样式。所有跨源资源都必须允许来自主应用所在源的请求。生产环境的 CORS 响应头应由实际提供资源的静态服务器或 CDN 配置，不能仅依赖开发插件。

应先在网络（Network）面板中定位首个失败请求，检查最终 URL、响应状态和 `Access-Control-Allow-Origin`。启用样式隔离后，外部 CSS 资源同样需要正确配置 CORS。

## 为什么出现 `more than one entry script` 错误？

一个 HTML 入口最多只能包含一个带有 `entry` 属性的外部脚本。请勿为多个代码分块手动添加该标记；应由构建插件标记实际入口。相关约定见 [HTML 入口](/zh-CN/concepts/html-entry-loading)。

## 为什么出现 `lifecycle functions not found` 错误？

微应用必须导出 `bootstrap`、`mount` 和 `unmount`。原生 ESM 应用可使用具名导出或默认生命周期对象；Classic 构建则需要正确配置打包输出。

应先按照对应的 [Vite](/zh-CN/cookbook/prepare-a-vite-app) 或 [Webpack](/zh-CN/cookbook/prepare-a-webpack-app) 指南检查入口配置，再查看[生命周期契约](/zh-CN/concepts/lifecycle-and-props)。

## 支持 Vite 和原生 ESM 吗？

支持。开启默认沙箱时，`<script type="module">` 会使用原生 ESM 路径。作为微应用被 qiankun 加载时，Vite 的 HMR 连接会被关闭（独立运行不受影响），开发时需手动刷新。Firefox 和 CSP 还需要额外注意事项，详见[原生 ESM 支持](/zh-CN/concepts/esm-sandbox)。

## 有内置的全局状态库吗？

v3 不再提供 `initGlobalState`、`setGlobalState` 等内置状态管理 API。应用间共享状态时，应通过 `props` 传递数据、回调或由主应用维护的状态容器，并在卸载时解除订阅。参见[应用间通信](/zh-CN/cookbook/communicate-between-apps)。

## 如何隔离样式？

在应用配置中设置 `sandbox: { styleIsolation: true }`。该配置仅限制微应用样式影响容器外部，不能阻止主应用的全局样式影响微应用。该能力还依赖原生 CSS `@scope`，外部样式资源也必须正确配置 CORS。

操作步骤参见[启用样式隔离](/zh-CN/cookbook/enable-style-isolation)；限制与边界参见[样式隔离概念](/zh-CN/concepts/style-isolation)。

## 支持哪些浏览器？

完整的「能力 × 浏览器要求」矩阵见[浏览器支持](/zh-CN/guide/browser-support)。简单来说：[`isRuntimeCompatible()`](/zh-CN/api/is-runtime-compatible) 仅检查基础运行时所需的 `Proxy`、`TransformStream` 和 `URL.createObjectURL`；原生 ESM 还依赖动态 import map，样式隔离则依赖 CSS `@scope`，需按项目实际启用的能力分别评估。

## 为什么重新挂载时不会再次执行入口代码？

同一实例重新挂载时，qiankun 会重建不包含脚本的入口 DOM，并复用首次加载时解析出的生命周期。Classic 和 ESM 应用都会再次调用 `mount(props)`，但不会重新执行入口顶层代码。

框架实例、路由实例和每次挂载所需的状态应在 `mount()` 中创建，并在 `unmount()` 中销毁。参见[生命周期与 props](/zh-CN/concepts/lifecycle-and-props)。

## qiankun 2.x 的 API 和配置发生了哪些变化？

v3 移除或调整了全局状态 API、`start()` 配置、`entry` 与 `container` 的类型，以及旧版沙箱配置。迁移时请以[从 qiankun 2.x 迁移](/zh-CN/cookbook/migrate-from-2x)为准。
