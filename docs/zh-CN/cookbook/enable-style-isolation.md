# 开启 CSS 样式隔离

为单个微应用开启 `styleIsolation`，可以阻止它的样式规则影响容器外的主应用或其他微应用。

这是**单向隔离**：微应用样式不会向外泄漏，但主应用的全局样式仍然可能影响微应用。

## 开启隔离

把 `styleIsolation: true` 作为 [`loadMicroApp`](/zh-CN/api/load-micro-app) 的第二个参数传入：

```ts
import { loadMicroApp } from 'qiankun';

const container = document.getElementById('subapp-container');
if (!container) throw new Error('micro-app container not found');

const microApp = loadMicroApp(
  {
    name: 'sub-app',
    entry: '//localhost:7101',
    container,
  },
  {
    styleIsolation: true,
  },
);

// 页面不再展示这个应用时
await microApp.unmount();
```

React 和 Vue 的 `<MicroApp>` 组件通过各自的 `settings` 属性接收同一个配置。路由驱动模式则把它放在应用的 `configuration` 字段中。

## 隔离覆盖范围

开启后，qiankun 会限制微应用入口中的内联样式、外链样式和常见的运行时插入规则，使它们只在应用容器内生效。

以下内容不属于双向或安全隔离：

- 主应用的全局选择器仍可能命中微应用中的元素。
- 渲染到应用容器外的 portal 不在样式作用域内。
- `@font-face` 等文档级规则仍可能在应用之间产生命名冲突。
- 应用仍应避免依赖过于宽泛的全局选择器。

具体机制见[样式隔离概念](/zh-CN/concepts/style-isolation)；源码级处理流程见[样式隔离实现](/zh-CN/internals/style-isolation)。

## 前置条件

### 浏览器支持 CSS `@scope`

样式隔离依赖浏览器原生的 CSS `@scope`。qiankun 不提供 polyfill；在不支持它的浏览器中不要开启这一能力。

### 外链样式允许 CORS

微应用的外链 CSS 需要能被主应用页面跨域获取。请确保子应用服务器和第三方样式资源返回正确的 `Access-Control-Allow-Origin` 响应头。

## 验证

1. 在主应用和微应用中各放一个相同 class 的测试元素。
2. 让微应用 CSS 为该 class 设置一个明显样式。
3. 确认样式只作用于微应用容器中的元素。
4. 卸载应用，确认容器内容和动态插入的样式随之清理。

如果应用开启隔离后变成无样式页面，优先检查浏览器是否支持 `@scope`，以及外链 CSS 请求是否被 CORS 阻止。

## 相关内容

- [样式隔离](/zh-CN/concepts/style-isolation) —— 能力、边界与限制。
- [AppConfiguration](/zh-CN/api/configuration) —— `styleIsolation` 配置参考。
- [处理加载与运行时错误](/zh-CN/cookbook/handle-errors) —— 捕获资源加载错误。
