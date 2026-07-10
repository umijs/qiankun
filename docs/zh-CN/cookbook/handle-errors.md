# 处理微应用错误

应在真正能够恢复的层级处理错误。使用 [`loadMicroApp`](/zh-CN/api/load-micro-app) 时，拥有实例的主应用负责渲染兜底界面，并保留句柄以完成清理；全局错误通道则单独用于集中记录和监控上报。

本页处理入口和生命周期失败。应用成功挂载后，普通 UI 事件或业务代码产生的错误，仍应由微应用自己的框架错误边界和监控方案处理。

## 先处理当前实例

`loadMicroApp` 会在加载和挂载完成前返回。为 `mountPromise` 添加 rejection 处理，显示当前实例的错误状态，同时继续持有 `unmount()` 的责任：

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

也可以用 `try` / `await` 写出同样的流程。关键是，捕获 `mountPromise` 并不会转移生命周期所有权：成功挂载后，不能在没有等待 `unmount()` 的情况下丢弃句柄或移除容器。

主应用发起 `unmount()` 后，也要处理它可能产生的 rejection。面向用户的提示应保持简洁，原始错误则由下文的全局处理器交给监控系统。

## 用全局通道集中上报

在主应用启动阶段注册一次全局处理器，为所有应用的错误补充上下文并集中上报。保留同一个函数引用，以便在测试或主应用清理时注销：

```ts
import { addErrorHandler, removeErrorHandler } from 'qiankun';

const reportMicroAppError = (error: Error) => {
  reportToMonitoring(error);
};

addErrorHandler(reportMicroAppError);

// 主应用清理或测试结束时：
removeErrorHandler(reportMicroAppError);
```

这个通道会观察所有 `loadMicroApp` 实例的加载和生命周期失败。通过 [`registerMicroApps`](/zh-CN/api/register-micro-apps) 激活的应用也会进入同一个全局通道。它适合遥测上报，不适合决定或渲染某个实例的兜底界面。

不要在全局处理器中继续抛错、刷新整页或启动无上限重试。错误结构和覆盖的生命周期见 [`addErrorHandler` / `removeErrorHandler` 参考](/zh-CN/api/error-handling)。

## React 与 Vue 主应用

React 和 Vue 的 `<MicroApp>` 组件封装了同样的实例级 Promise 处理，并通过组件生命周期负责卸载。

- React 支持 `autoCaptureError` 或自定义 `errorBoundary`，参见 [React 集成](/zh-CN/ecosystem/react)；
- Vue 支持 `autoCaptureError` 或 `#error-boundary` 插槽，参见 [Vue 集成](/zh-CN/ecosystem/vue)。

组件错误边界用于就近展示兜底界面，全局处理器用于集中上报。两者互补，也可能同时观察到同一次失败。

## 按现象排查

先检查浏览器 Network 面板和微应用的独立构建，再根据用户看到的现象缩小范围：

| 现象 | 检查什么 | 常见处理 |
| --- | --- | --- |
| 入口或资源请求失败、意外重定向，或者返回空响应 | HTML 入口和每项被获取资源的状态、最终 URL、身份认证与 CORS | 修正部署 URL 并允许主应用来源；需要凭据时配置自定义 [`fetch`](/zh-CN/api/configuration) |
| 入口已经加载，但应用没有进入 `mount` | 入口是否按照对应构建格式导出了 `bootstrap`、`mount` 和 `unmount` | 按 [Vite](/zh-CN/cookbook/prepare-a-vite-app) 或 [Webpack](/zh-CN/cookbook/prepare-a-webpack-app) 接入指南准备应用 |
| HTML 入口因为存在多个 entry 而被拒绝 | 生成的 `index.html` 与 bundler 插件产物 | 确保恰好一个外部脚本带有 `entry` 属性 |
| 应用没有合法挂载目标，或渲染到了错误位置 | 传入的 `container`，以及 `props.container` 内部使用的选择器 | 传入页面中有效的 `HTMLElement`，而不是选择器字符串，并且只在这个元素内部查询 |
| ESM 应用在挂载前失败 | 失败的模块请求、无法解析的裸导入、import map、MIME 类型和 CORS | 让 Vite 生成基于 URL 的导入，或提供有效的应用自有映射；修复失败的模块响应 |
| 开启样式隔离后，应用可以渲染但没有样式 | Network 面板中的外部样式表请求 | 为 CSS 启用 CORS 并确认样式表 URL；参见[样式隔离](/zh-CN/cookbook/enable-style-isolation) |

不要让应用逻辑匹配运行时的私有错误字符串。错误信息可能变化；应使用失败实例、生命周期阶段、网络响应和监控元数据作为排查上下文。

## 只重试瞬时故障

qiankun 会对瞬时网络故障进行有限重试，之后才拒绝实例 Promise 并通知全局处理器。不要在 `loadMicroApp` 外再添加递归或无上限重试。

确有重试价值时，应在上一次 `mountPromise` 已经结束后，由用户显式触发。导出无效、存在多个入口脚本、容器不合法、ESM 依赖无法解析等配置错误需要修正，不能依靠重试解决。身份认证和网关要求应放入自定义 [`fetch`](/zh-CN/api/configuration)。

## 保留生产诊断能力

为每个微应用开启生产 source map，并使用匹配的应用名和发布版本上传到监控服务。发布前应在预发布环境制造一次错误，确认监控能够还原到原始源码；缺少对应 source map 时，转换后的 ESM 调用栈无法提供有效定位。

如果源码不公开，请限制 source map 的访问权限；面向用户的兜底界面也不应展示原始调用栈或包含敏感信息的服务端响应。

## 相关内容

- [`loadMicroApp`](/zh-CN/api/load-micro-app)——实例 Promise 与清理所有权
- [`addErrorHandler` / `removeErrorHandler`](/zh-CN/api/error-handling)——全局错误 API
- [微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props)——可能失败的阶段
- [原生 ESM 支持](/zh-CN/concepts/esm-sandbox)——ESM 行为与兼容性
- [共享状态与通信](/zh-CN/cookbook/communicate-between-apps)——保持主应用回调与订阅清洁
