# 浏览器支持

qiankun 3 面向现代浏览器构建，不支持 IE。具体的浏览器要求取决于你启用了哪些能力：基础运行时的要求最宽松，原生 ESM 和样式隔离各自依赖更新的浏览器特性。本页是浏览器兼容性的唯一权威说明，其他页面涉及兼容性时均以此为准。

## 能力与浏览器要求

| 能力 | 依赖的浏览器特性 | 浏览器要求 |
| --- | --- | --- |
| 基础运行时（加载、Classic 脚本执行、JS 沙箱） | `Proxy`、`TransformStream`、`URL.createObjectURL` | 近年主流版本的 Chrome、Edge、Safari、Firefox 均满足 |
| 原生 ESM 微应用（[原生 ESM 支持](/zh-CN/concepts/esm-sandbox)） | 动态注入的 import map | Chrome／Edge 133+、Safari 18.4+；**Firefox 默认不支持** |
| 样式隔离（[样式隔离](/zh-CN/concepts/style-isolation)） | 原生 CSS `@scope`，无 polyfill 或降级方案 | Chrome／Edge 118+、Safari 17.4+、Firefox 128+ |

三行是叠加关系：只用 Classic 微应用、不开样式隔离，按第一行评估即可；每多启用一项能力，按对应行收紧浏览器矩阵。

## 用运行时检测代替版本清单

基础运行时的能力可以在运行时直接检测，不必自行维护浏览器版本列表：

```ts
import { isRuntimeCompatible } from 'qiankun';

if (isRuntimeCompatible()) {
  // 加载微应用
}
```

注意 [`isRuntimeCompatible()`](/zh-CN/api/is-runtime-compatible) 只覆盖基础运行时的三项能力，**不检测**动态 import map 和 CSS `@scope`。是否启用原生 ESM 与样式隔离，需要按上表单独评估。

## Firefox 与原生 ESM

ESM 沙箱依赖动态注入多个 import map，Firefox 尚未默认启用该能力。需要支持 Firefox 时，微应用应改用 Classic 脚本方式交付（例如 Webpack 构建产物），基础运行时和样式隔离在 Firefox 上不受影响。

## 继续阅读

- [原生 ESM 支持](/zh-CN/concepts/esm-sandbox)——ESM 微应用的完整约束与开发注意事项。
- [样式隔离](/zh-CN/concepts/style-isolation)——`@scope` 的作用边界与限制。
- [isRuntimeCompatible](/zh-CN/api/is-runtime-compatible)——运行时检测的 API 说明。
