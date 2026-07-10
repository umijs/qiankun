# 原生 ESM 支持

qiankun 可以运行以原生 ES 模块交付的微应用，包括 Vite 在开发环境中提供的模块图。应用保留原生 `import` / `export` 语义，同时复用与经典应用相同的逐应用 JavaScript 隔离。

这条路径不要求生成 UMD library，也不需要把生命周期挂到 `window` 上。

## 什么时候使用这条路径

开启 `sandbox` 时，微应用入口里的 `<script type="module">` 会走原生 ESM 路径。内联和外部模块脚本都受支持，同一份 HTML 中的经典脚本仍走经典路径。

官方 Vite 插件会标记应用入口，并处理开发与构建产物周围的配置。普通项目应优先使用插件，而不是手工修改生成的 HTML。

关闭 `sandbox` 也会关闭这条 ESM 隔离路径，它不是一种 ESM 兼容性回退方案。

## 微应用契约

入口模块需要导出 `bootstrap`、`mount` 和 `unmount`，还可以选择导出 `update`。具名导出和默认导出的生命周期对象都受支持。

```js
let app;

export async function bootstrap() {}

export async function mount(props) {
  app = createApp();
  app.mount(props.container.querySelector('#root'));
}

export async function unmount() {
  app.unmount();
  app = undefined;
}
```

每次挂载需要的框架实例、router 和 store 应在 `mount` 中创建，并在 `unmount` 中释放。请渲染到 `props.container`，避免重新挂载和多实例依赖全局选择器。

## 可以依赖的运行时行为

- 保留原生模块语义，包括顶层 `await`、循环依赖、live binding 和模块求值顺序。
- ESM 强制使用严格模式。`feature = true` 这类隐式全局写入会抛出 `ReferenceError`；请显式声明变量，或者使用 `window.feature`。
- 对同一个应用实例，模块顶层代码只执行一次。`unmount` 之后再次挂载只会重新调用 `mount`，不会重建模块作用域状态。
- 模块求值错误和被拒绝的顶层 `await` 会进入正常的 single-spa 错误通道。

不要用模块顶层初始化替代 `mount`。生命周期边界才是清理和重新挂载行为可预测的前提。

## Vite 开发行为

qiankun 能运行 Vite dev server 给出的原生模块图，但会主动关闭 Vite 在子应用内通常建立的 HMR 连接。开发时应采用手动刷新页面的流程，不要假设热更新或 React Fast Refresh 会保留状态。

Vite 可能通过模块顶层代码注入 CSS。由于重新挂载不会再执行模块顶层代码，应用卸载后再次挂载时，这类 CSS 可能缺失。依赖 JavaScript 注入样式的应用应明确测试重挂场景。

受支持的配置和开发流程见[让 Vite 应用接入 qiankun](/zh-CN/cookbook/prepare-a-vite-app)。

## 兼容性与诊断

- 当前版本的 Chromium/Edge 和 Safari 支持所需浏览器能力。Firefox 默认未开启该能力；需要支持 Firefox 时，请使用 Classic/Webpack 交付路径。
- 内容安全策略需要允许 `blob:` 脚本；qiankun 的 ESM 路径不要求 `'unsafe-eval'`。
- 模块及其资源需要正确的 CORS 响应头和 MIME 类型。JSON、CSS、WASM 等带类型导入可能保留原生的页面级共享行为，而不是完整的逐应用隔离。
- 生产错误栈里可能出现 `blob:` URL，而不是真实源文件地址。请保留 source map，并配置错误上报系统把这些栈帧映射回部署源码。

如果应用更看重经典路径的浏览器覆盖面或开发行为，可以继续使用 UMD 构建。实现细节见 [ESM 沙箱实现](/zh-CN/internals/esm-sandbox)，设计取舍见 [ESM 沙箱 RFC](../../rfcs/esm-sandbox.md)。
