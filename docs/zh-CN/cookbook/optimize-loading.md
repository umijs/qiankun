# 优化微应用加载

qiankun 会以流式方式处理 HTML 入口，并在解析过程中发现和预加载后续资源。大多数应用无需额外配置预取策略。优化时应优先关注入口体积、HTTP 缓存、CORS 配置和挂载方式。

## 建立性能基线

以 `mountPromise` 的完成时间作为挂载结束点，记录从开始加载到完成挂载的总耗时：

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

同时通过浏览器的网络（Network）面板分别记录首次加载和再次挂载的数据。入口 HTML 的下载时间仅反映加载过程的一部分，不应作为唯一指标。

## 优化顺序

### 1. 配置 CORS 和 HTTP 缓存

主应用通过 `fetch` 获取微应用入口和资源，因此跨域服务器必须返回正确的 CORS 响应头。

对于文件名包含内容哈希的 JavaScript、CSS 和字体资源，应配置长期缓存。HTML 入口需要及时更新，可使用协商缓存。压缩和 CDN 配置也应覆盖微应用的全部资源。

qiankun 还会在当前页面内维护一个内存 LRU 缓存，保存成功的请求结果，并可能复用同一应用和容器对应的生命周期配置。只有运行时缓存未命中时，HTTP 协商缓存才会参与请求；同一页面中的重新挂载不能用于刷新部署版本。如需确保加载新发布的微应用，应刷新主应用页面。

### 2. 保持 HTML 入口简洁

入口中只应声明当前应用所需的资源，并且最多只能有一个脚本带有 `entry` 标记。官方[构建插件](/zh-CN/ecosystem/bundler-plugin)生成的生产构建通常会标记一个入口脚本；Vite 开发环境的 HTML 可以不包含显式标记，由 qiankun 在运行时选择导出生命周期的模块。

### 3. 复用稳定的容器

同一应用再次挂载到同一容器时，qiankun 可以复用已有的加载结果。使用框架组件时，应避免在每次渲染时替换容器节点；直接调用 `loadMicroApp` 时，同一挂载位置也应使用稳定的容器元素。

需要同时运行多个实例时，每个实例都应使用独立容器，具体要求见[多实例指南](/zh-CN/cookbook/run-multiple-instances)。

### 4. 在 `mount` 中创建实例状态

重新挂载时，模块顶层代码不会再次执行。因此，应用实例、路由实例和实例级状态容器应在 `mount()` 中创建，并在 `unmount()` 中销毁。按照此方式管理状态，可以避免复用加载结果时残留旧状态或丢失样式。

### 5. 谨慎覆盖 `fetch`

仅在身份认证、代理或可观测性等场景确有需要时配置自定义 `fetch`。自定义实现必须保持标准 Fetch API 的响应类型和流式语义，不应预先将响应读取为字符串，也不应移除缓存响应头。

完整字段见 [`AppConfiguration.fetch`](/zh-CN/api/configuration)。

## 不应沿用 2.x 的预取配置

- 不应调用 `start({ prefetch: ... })`；v3 的 `start()` 不接收此类配置。
- [`prefetchApps`](/zh-CN/api/prefetch-apps) 已废弃，不应成为新项目的默认优化手段。
- 不应仅为预加载资源而提前创建一个不执行卸载的 `loadMicroApp` 实例。

仅当性能数据表明按需加载无法满足目标时，才应在业务层提前触发应用加载，并同时设计取消和卸载机制。

## 使用网络面板定位瓶颈

建议按照以下顺序检查：

1. HTML 入口是否被重定向、身份认证或 CORS 阻塞。
2. 关键 JS/CSS 是否缺少压缩或合理缓存头。
3. 是否存在重复下载、体积过大的源码映射（source map）或无关资源。
4. 再次挂载时是否仍产生完整的网络请求瀑布。
5. `mountPromise` 的主要耗时来自网络、脚本执行，还是微应用自身的渲染。

如果网络请求耗时较短，但 `mountPromise` 仍耗时较长，则瓶颈通常位于微应用的初始化或首次渲染过程，而非 qiankun 加载器。

## 相关内容

- [HTML 入口](/zh-CN/concepts/html-entry-loading)——加载流程及其外部表现
- [处理微应用错误](/zh-CN/cookbook/handle-errors)——处理资源加载失败
- [AppConfiguration](/zh-CN/api/configuration)——自定义 `fetch` 与高级选项
- [流式 HTML 入口实现](/zh-CN/internals/streaming-html-entry)——面向贡献者的实现细节
