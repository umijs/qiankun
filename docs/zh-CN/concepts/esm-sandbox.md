# 原生 ESM 支持

qiankun 支持以原生 ES 模块交付的微应用，也支持 Vite 开发服务器提供的模块图。微应用可以保留原生 `import` 和 `export` 语义，并使用与 Classic 应用一致的应用级 JavaScript 隔离。

使用原生 ESM 时，无需生成 UMD 全局库，也无需将生命周期函数挂载到 `window`。

## 适用条件

启用 `sandbox` 后，微应用入口中的 `<script type="module">` 将由 ESM 沙箱处理。该机制同时支持内联模块和外部模块；同一份 HTML 中的 Classic 脚本仍由 Classic 沙箱处理。

官方 Vite 插件会配置开发服务器，并在生产构建中标记入口模块。Vite 开发环境可以不包含显式 `entry` 标记，此时 ESM 引擎会根据生命周期导出选择入口。建议优先使用插件，不要手动修改生成后的 HTML。

关闭 `sandbox` 会同时停用 ESM 隔离。因此，`sandbox: false` 不能作为 ESM 的兼容性降级方案。

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

每次挂载所需的框架实例、路由实例和状态仓库都应在 `mount` 中创建，并在 `unmount` 中销毁。界面应渲染到 `props.container` 内，避免使用全局选择器，以保证重新挂载和多实例运行正常。

## 运行时行为

- 保留原生模块语义，包括顶层 `await`、循环依赖、实时绑定（live binding）和模块求值顺序。
- ESM 强制使用严格模式。`feature = true` 这类隐式全局写入会抛出 `ReferenceError`；请显式声明变量，或者使用 `window.feature`。
- 对于同一个应用实例，模块顶层代码只执行一次。`unmount` 后重新挂载时仅再次调用 `mount`，不会重新初始化模块作用域。
- 选定的入口模块执行失败时，应用加载将失败。路由注册应用会通过 single-spa 全局处理器报告该错误；`loadMicroApp` 则通过实例的生命周期 Promise 返回错误。与入口无关的模块脚本发生异常时，运行时可能只记录错误并跳过该模块，而不会使应用加载失败。

不要使用模块顶层初始化替代 `mount`。只有将初始化与清理限定在生命周期内，才能保证重新挂载行为稳定可控。

## Vite 开发行为

qiankun 可以运行 Vite 开发服务器提供的原生模块图，但会关闭微应用内部的 Vite HMR 连接。开发过程中需要手动刷新页面，不应依赖热更新或 React Fast Refresh 保留状态。

Vite 可能通过模块顶层代码注入 CSS。由于重新挂载时不会再次执行模块顶层代码，此类样式可能在卸载后丢失。依赖 JavaScript 注入样式的应用应专门验证重新挂载场景。

受支持的配置和开发流程见[接入 Vite 应用](/zh-CN/cookbook/prepare-a-vite-app)。

## 兼容性与诊断

- 较新版本的 Chromium、Edge 与 Safari 已支持所需能力，具体版本矩阵见[浏览器支持](/zh-CN/guide/browser-support)。Firefox 默认未启用相关能力；如果需要支持 Firefox，请采用 Classic/Webpack 构建。
- 内容安全策略需要允许 `blob:` 脚本；qiankun 的 ESM 路径不要求 `'unsafe-eval'`。
- 模块及其资源必须返回正确的 CORS 响应头和 MIME 类型。JSON、CSS、WASM 等带类型的 import（`with { type: … }`）可能仍采用浏览器原生的页面级共享方式，无法实现完整的应用级隔离。
- 生产环境的错误栈中可能出现 `blob:` URL，而不是真实源文件地址。请保留源码映射（source map），并配置错误上报系统将这些栈帧还原到部署源码。

如果项目更重视 Classic 方案的浏览器兼容范围或开发体验，可以继续使用 UMD 构建。实现细节见 [ESM 沙箱实现](/zh-CN/internals/esm-sandbox)，设计取舍见 [ESM 沙箱 RFC](https://github.com/umijs/qiankun/blob/next/docs/rfcs/esm-sandbox.md)。
