# 处理微应用错误

哪一层能从故障中恢复，就在哪一层处理错误。使用 [`loadMicroApp`](/zh-CN/api/load-micro-app) 时，主应用负责在实例所在位置显示错误提示，并保留实例句柄以便后续清理。对于通过 `registerMicroApps` 注册的路由驱动应用，可使用全局错误处理器统一记录错误并上报监控系统。

本页介绍入口加载和生命周期执行失败的处理方式。应用成功挂载后，由界面事件或业务代码引发的错误，仍应交由微应用自身的框架错误边界和监控方案处理。

## 处理当前实例的错误

`loadMicroApp` 会在加载和挂载完成前返回实例句柄。应处理 `mountPromise` 被拒绝的情况，并在当前实例的容器中显示错误信息。主应用仍须保留句柄，以便在挂载成功后调用 `unmount()`：

```ts
import { loadMicroApp } from 'qiankun';

const container = document.getElementById('micro-app-slot');
if (!container) throw new Error('micro-app-slot not found');

const microApp = loadMicroApp({
  name: 'account-app',
  entry: 'http://localhost:7101/',
  container,
});

const mountFinished = microApp.mountPromise
  .then(() => true)
  .catch(() => {
    const message = document.createElement('p');
    message.setAttribute('role', 'alert');
    message.textContent = '当前内容暂时无法加载。';
    container.replaceChildren(message);
    return false;
  });

export async function disposeMicroApp() {
  const mounted = await mountFinished;
  if (mounted) {
    await microApp.unmount();
  }
}
```

也可以使用 `await` 配合 `try...catch` 实现相同流程。处理 `mountPromise` 的错误不会改变主应用对实例生命周期的管理责任。挂载成功后，必须等待 `unmount()` 完成，才能移除容器或释放句柄。

主应用调用 `unmount()` 时，也应处理调用失败的情况。界面中的错误信息应简明且不包含内部实现细节，原始错误应由当前实例的 Promise 处理逻辑上报监控系统。

## 上报路由驱动应用的错误

使用 `registerMicroApps` 时，可在主应用启动阶段注册全局错误处理器，为路由驱动应用的错误补充上下文并统一上报。应保留处理函数的引用，以便在测试结束或主应用销毁时注销：

```ts
import { addErrorHandler, removeErrorHandler } from 'qiankun';

const reportMicroAppError = (error: Error) => {
  reportToMonitoring(error);
};

addErrorHandler(reportMicroAppError);

// 主应用清理或测试结束时：
removeErrorHandler(reportMicroAppError);
```

该处理器会接收通过 [`registerMicroApps`](/zh-CN/api/register-micro-apps) 激活的应用在加载和生命周期阶段产生的错误。`loadMicroApp` 实例的首次加载和生命周期错误只会反映在句柄对应的 Promise 中，不会进入该全局处理流程。全局处理器适合统一记录和上报路由驱动应用的错误，不应负责渲染具体实例的错误界面。

不应在全局处理器中再次抛出错误、刷新整个页面或执行无上限重试。错误结构和适用的生命周期阶段见 [`addErrorHandler` / `removeErrorHandler` 参考](/zh-CN/api/error-handling)。

## React 与 Vue 主应用

React 和 Vue 的 `<MicroApp>` 组件封装了相同的实例级 Promise 处理逻辑，并通过组件生命周期执行卸载。

- React 支持 `autoCaptureError` 或自定义 `errorBoundary`，参见 [React 集成](/zh-CN/ecosystem/react)；
- Vue 支持 `autoCaptureError` 或 `#error-boundary` 插槽，参见 [Vue 集成](/zh-CN/ecosystem/vue)。

组件错误边界用于在实例所在位置显示错误界面，并可在捕获错误时直接上报监控系统。由于组件基于 `loadMicroApp`，其首次加载和生命周期错误只会走实例 Promise，不会再进入 single-spa 的全局错误处理器。

## 按现象排查

首先检查浏览器的网络（Network）面板和微应用的独立构建结果，再根据页面表现缩小排查范围：

| 现象 | 检查项 | 常见处理 |
| --- | --- | --- |
| 入口或资源请求失败、发生意外重定向，或者返回空响应 | HTML 入口和每项资源的请求状态、最终 URL、身份认证与 CORS 配置 | 修正部署 URL 并允许主应用来源访问；需要携带凭据时配置自定义 [`fetch`](/zh-CN/api/configuration) |
| 入口加载完成，但应用没有进入 `mount` | 入口是否按照对应构建格式导出了 `bootstrap`、`mount` 和 `unmount` | 按 [Vite](/zh-CN/cookbook/prepare-a-vite-app) 或 [Webpack](/zh-CN/cookbook/prepare-a-webpack-app) 接入指南改造应用 |
| HTML 入口因存在多个入口脚本而被拒绝 | 生成的 `index.html` 与构建插件产物 | 最多保留一个带有 `entry` 属性的外部脚本；Vite 开发环境可以不含显式标记 |
| 挂载目标无效，或应用渲染到了错误位置 | 传入的 `container`，以及 `props.container` 内部使用的选择器 | 传入页面中有效的 `HTMLElement`，而不是选择器字符串，并且仅在该元素内部查询 |
| ESM 应用在挂载前失败 | 失败的模块请求、无法解析的裸模块导入、导入映射（import map）、MIME 类型和 CORS | 使用 Vite 生成基于 URL 的导入，或为应用提供有效的模块映射；修复异常的模块响应 |
| 启用样式隔离后，应用可以渲染但没有样式 | 网络（Network）面板中的外部样式表请求 | 为 CSS 启用 CORS 并确认样式表 URL；参见[样式隔离](/zh-CN/cookbook/enable-style-isolation) |

应用逻辑不应依赖运行时内部错误信息的具体文本，因为这些信息可能随版本变化。排查时应根据失败实例、生命周期阶段、网络响应和监控元数据判断原因。

## 仅对临时性故障进行重试

qiankun 增强后的 fetch 自带一个有限的自动重试额度，由同一个 fetch 封装实例共享。它不会区分故障是否临时，网络异常和无效 HTTP 响应都会消耗额度，因此不能假定每个失败请求都会被重试。请求最终失败时，相应的实例 Promise 会被拒绝。对于路由驱动应用，该错误还会通知全局处理器；`loadMicroApp` 调用方则应处理实例 Promise。不应在 `loadMicroApp` 之外增加递归重试或无上限重试。

调用方仅应在故障可能具有临时性时提供额外的用户重试，并先等待上一次 `mountPromise` 结束。生命周期导出无效、入口脚本数量不正确、容器无效或 ESM 依赖无法解析等配置错误必须直接修正，无法通过重试解决。身份认证和网关逻辑应通过自定义 [`fetch`](/zh-CN/api/configuration) 实现。

## 保留生产诊断能力

应为每个微应用生成生产环境源码映射（source map），并使用对应的应用名称和发布版本将其上传到监控服务。发布前应在预发布环境主动触发一次错误，确认监控服务能够将调用栈还原到原始源码。缺少对应的源码映射时，转换后的 ESM 调用栈通常无法提供有效的源码位置。

如果源码不公开，应限制源码映射的访问权限。面向用户的错误界面也不应展示原始调用栈或包含敏感信息的服务端响应。

## 相关内容

- [`loadMicroApp`](/zh-CN/api/load-micro-app)——实例 Promise 与生命周期管理
- [`addErrorHandler` / `removeErrorHandler`](/zh-CN/api/error-handling)——全局错误 API
- [微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props)——可能失败的阶段
- [原生 ESM 支持](/zh-CN/concepts/esm-sandbox)——ESM 行为与兼容性
- [共享状态与通信](/zh-CN/cookbook/communicate-between-apps)——管理主应用回调与订阅的清理
