# 启用 CSS 样式隔离

为单个微应用启用 `sandbox.styleIsolation` 后，该应用的样式规则不会影响容器之外的主应用或其他微应用。

样式隔离是**单向的**：微应用样式不会影响外部内容，但主应用的全局样式仍可能作用于微应用。

## 启用隔离

在 [`loadMicroApp`](/zh-CN/api/load-micro-app) 的第二个参数中设置 `sandbox: { styleIsolation: true }`：

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
    sandbox: { styleIsolation: true },
  },
);

// 页面不再展示这个应用时
await microApp.unmount();
```

React 和 Vue 的 `<MicroApp>` 组件通过 `settings` 属性接收相同配置。对于由路由驱动的应用，应将该配置写入应用的 `configuration` 字段。

## 隔离覆盖范围

启用后，qiankun 会限制微应用入口中的内联样式、外链样式以及运行时动态插入的样式规则，使这些规则仅在应用容器内生效。

以下情况不在样式隔离范围内：

- 主应用的全局选择器仍可能命中微应用中的元素。
- 渲染到应用容器之外的 Portal 不在样式作用域内。
- `@font-face` 等文档级规则仍可能在应用之间产生命名冲突。
- 应用仍应避免依赖过于宽泛的全局选择器。

具体机制见[样式隔离](/zh-CN/concepts/style-isolation)；实现流程见[样式隔离实现](/zh-CN/internals/style-isolation)。

## 前置条件

### 浏览器支持 CSS `@scope`

样式隔离依赖浏览器原生支持 CSS `@scope`。qiankun 不提供兼容实现（polyfill），因此不应在缺少该能力的浏览器中启用样式隔离。

### 外链样式允许 CORS

主应用页面需要通过跨域请求获取微应用的外链 CSS。微应用服务器和第三方样式资源必须返回正确的 `Access-Control-Allow-Origin` 响应头。

## 验证

1. 分别在主应用和微应用中添加一个使用相同类名的测试元素。
2. 在微应用 CSS 中为该类名设置易于辨识的样式。
3. 确认样式只作用于微应用容器中的元素。
4. 卸载应用，确认容器内容和动态插入的样式随之清理。

如果启用隔离后微应用未加载样式，应首先确认浏览器是否支持 `@scope`，并检查外链 CSS 请求是否因 CORS 配置被浏览器阻止。

## 相关内容

- [样式隔离](/zh-CN/concepts/style-isolation)——能力、边界与限制
- [AppConfiguration](/zh-CN/api/configuration)——`sandbox.styleIsolation` 配置参考
- [处理微应用错误](/zh-CN/cookbook/handle-errors)——捕获资源加载错误
