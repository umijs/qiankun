# 优化微应用加载

qiankun 会自动以流式方式处理 HTML Entry，并在加载过程中发现后续资源。大多数应用不需要配置预取策略；真正有效的优化通常来自入口体积、HTTP 缓存、CORS 和稳定的挂载方式。

## 先建立基线

围绕 `loadMicroApp` 的 `mountPromise` 记录用户真正感知的挂载耗时：

```ts
performance.mark('sub-app:start');

const microApp = loadMicroApp({
  name: 'sub-app',
  entry: '//localhost:7101',
  container,
});

await microApp.mountPromise;
performance.measure('sub-app:mount', 'sub-app:start');
```

同时在浏览器 Network 面板记录首次加载和再次挂载两组数据。不要只比较入口 HTML 的下载时间。

## 优化顺序

### 1. 配置 CORS 和 HTTP 缓存

主应用通过 `fetch` 获取微应用入口和资源，因此跨域服务器必须返回正确的 CORS 响应头。

对带内容 hash 的 JS、CSS 和字体使用长期缓存；HTML Entry 使用能及时更新、但允许协商缓存的策略。确认压缩和 CDN 同样覆盖微应用资源。

### 2. 保持 HTML Entry 简洁

入口只应声明当前应用需要的资源，并且只能有一个被标记为 `entry` 的脚本。使用官方 [bundler plugin](/zh-CN/ecosystem/bundler-plugin) 管理入口标记，不要手工维护脚本清单。

### 3. 复用稳定的容器

同一个应用再次挂载到同一个容器时，qiankun 可以复用已经完成的加载工作。框架组件不要在每次渲染时无意义地替换容器节点；直接调用 `loadMicroApp` 时，也应为同一个展示位置复用稳定的元素。

需要同时运行多个实例时，每个实例使用独立容器，并遵循[多实例指南](/zh-CN/cookbook/run-multiple-instances)。

### 4. 把每次挂载的状态放进 `mount`

不要依赖模块顶层代码在重新挂载时再次执行。应用实例、router 和按实例创建的 store 应在 `mount()` 中创建，并在 `unmount()` 中销毁。这样复用加载结果时不会出现旧状态或样式缺失。

### 5. 谨慎覆盖 `fetch`

只有在鉴权、代理或观测确实需要时才配置自定义 `fetch`。它必须保持标准 Fetch API 的响应和流式语义，不要提前把响应读取成字符串或破坏缓存头。

完整字段见 [`AppConfiguration.fetch`](/zh-CN/api/configuration)。

## 不要沿用 2.x 的预取配置

- 不要调用 `start({ prefetch: ... })`；v3 的 `start()` 不接收这类配置。
- [`prefetchApps`](/zh-CN/api/prefetch-apps) 已废弃，不应成为新项目的默认优化手段。
- 不要为了“预热”而提前创建一个不会卸载的 `loadMicroApp` 实例。

只有在真实数据证明按需加载仍无法满足目标时，才考虑在产品层提前触发应用加载，并同时设计取消和卸载策略。

## 用 Network 面板定位瓶颈

按下面顺序检查：

1. HTML Entry 是否被重定向、鉴权或 CORS 阻塞。
2. 关键 JS/CSS 是否缺少压缩或合理缓存头。
3. 是否存在重复下载、过大的 source map 或无关资源。
4. 再次挂载时是否仍产生完整网络瀑布。
5. `mountPromise` 的主要耗时来自网络、脚本执行，还是微应用自己的渲染。

如果网络很快但 `mountPromise` 仍然很慢，优化重点已经不在 qiankun 加载器，而在微应用的启动和首屏渲染。

## 相关内容

- [HTML Entry 与执行](/zh-CN/concepts/html-entry-loading) —— 用户可观察的加载模型。
- [处理加载与运行时错误](/zh-CN/cookbook/handle-errors) —— 暴露资源失败。
- [AppConfiguration](/zh-CN/api/configuration) —— 自定义 fetch 与高级选项。
- [流式 HTML Entry 实现](/zh-CN/internals/streaming-html-entry) —— 贡献者级实现细节。
