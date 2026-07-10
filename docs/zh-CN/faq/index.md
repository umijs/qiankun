# 常见问题

这里给出常见问题的直接答案和第一步检查。完整配置、示例和原理分别放在对应的指南、API 与概念页中。

## 主应用需要构建插件吗？

不需要。主应用通过 [`loadMicroApp`](/zh-CN/api/load-micro-app) 加载实例；只有路由驱动替代方案才使用 [`registerMicroApps`](/zh-CN/api/register-micro-apps) 和 [`start`](/zh-CN/api/start)。

微应用应使用 [`@qiankunjs/bundler-plugin`](/zh-CN/ecosystem/bundler-plugin) 准备 HTML Entry 和开发服务器。已有项目按 [Vite](/zh-CN/cookbook/prepare-a-vite-app) 或 [Webpack](/zh-CN/cookbook/prepare-a-webpack-app) 指南接入。

## 为什么会报 CORS 错误？

主应用页面会获取微应用的 HTML Entry、脚本和样式。任何跨域资源都必须允许主应用来源；生产环境的 CORS 响应头由实际静态服务器或 CDN 配置，不能只依赖开发插件。

先在 Network 面板找到第一个失败请求，检查最终 URL、响应状态和 `Access-Control-Allow-Origin`。如果开启了样式隔离，外链 CSS 同样需要 CORS。

## 为什么报 “more than one entry script”？

一个 HTML Entry 最多只能有一个带 `entry` 属性的外部脚本。不要手工给多个 chunk 添加标记；让 bundler plugin 标记真正的入口。约定见 [HTML Entry 与执行](/zh-CN/concepts/html-entry-loading)。

## 为什么报 “lifecycle functions not found”？

微应用必须暴露 `bootstrap`、`mount` 和 `unmount`。原生 ESM 使用具名导出或默认生命周期对象；Classic 构建需要正确的打包输出配置。

先按对应的 [Vite](/zh-CN/cookbook/prepare-a-vite-app) 或 [Webpack](/zh-CN/cookbook/prepare-a-webpack-app) 指南核对入口，再查看[生命周期契约](/zh-CN/concepts/lifecycle-and-props)。

## 支持 Vite 和原生 ESM 吗？

支持。开启默认沙箱时，`<script type="module">` 会使用原生 ESM 路径。Vite 开发环境中的 HMR 会被关闭，Firefox 和 CSP 还需要额外注意事项，详见[原生 ESM 支持](/zh-CN/concepts/esm-sandbox)。

## 有内置的全局状态库吗？

v3 没有 `initGlobalState`、`setGlobalState` 等内置 store API。通过 `props` 传递数据、回调或由主应用持有的 store，并在卸载时解除订阅。参见[应用间通信](/zh-CN/cookbook/communicate-between-apps)。

## 怎么隔离样式？

在应用配置中设置 `styleIsolation: true`。它只阻止微应用样式向容器外泄漏，不能阻止主应用全局样式进入微应用，并且依赖原生 CSS `@scope` 和外链样式 CORS。

操作步骤见[开启样式隔离](/zh-CN/cookbook/enable-style-isolation)，边界见[样式隔离概念](/zh-CN/concepts/style-isolation)。

## 支持哪些浏览器？

[`isRuntimeCompatible()`](/zh-CN/api/is-runtime-compatible) 只检查基础运行时所需的 `Proxy`、`TransformStream` 和 `URL.createObjectURL`。原生 ESM 还需要动态 import map，样式隔离还需要 CSS `@scope`；请根据实际启用能力核对对应概念页。

## 为什么 remount 时不重新运行入口代码？

同一个实例重新挂载时，qiankun 会重建不含脚本的入口 DOM，并复用首次加载时发现的生命周期。Classic 和 ESM 都会再次调用 `mount(props)`，但不会重新执行入口顶层代码。

把框架实例、router 和每次挂载所需的状态放进 `mount()`，并在 `unmount()` 中销毁。参见[生命周期与 props](/zh-CN/concepts/lifecycle-and-props)。

## qiankun 2.x 的 API 和选项去哪了？

v3 移除了或调整了全局状态、`start()` 配置、entry/container 类型和旧式沙箱配置。不要从零散页面拼迁移规则；以[从 qiankun 2.x 迁移](/zh-CN/cookbook/migrate-from-2x)为唯一参考。
