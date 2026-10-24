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

注意 [`isRuntimeCompatible()`](/zh-CN/api/is-runtime-compatible) 只覆盖基础运行时的三项能力，**不检测**动态 import map 和 CSS `@scope`。样式隔离仍需按上表单独评估。qiankun 会在首次加载沙箱中的 ESM 模块前自动检测动态多 import map，无需额外调用检测 API。

## ESM 加载前检测

qiankun 在独立的同源 `about:blank` iframe 中验证“注入第一张 import map 并执行模块，再追加第二张并执行模块”的行为，避免影响宿主文档的映射。检测仅使用本地 blob，不请求外部资源；检测结果在同一宿主文档中复用，Classic 脚本不触发检测。检测不改变 `isRuntimeCompatible()` 的同步语义。

通过 `mountPromise` 处理检测失败：

```ts
import { loadMicroApp, QiankunError } from 'qiankun';

const app = loadMicroApp({ name, entry, container });
void app.mountPromise.catch((error: unknown) => {
  if (error instanceof QiankunError && error.code === 'esm-unsupported') {
    // 提示用户使用受支持的浏览器，或选择 Classic 构建入口。
    return;
  }
  console.error(error);
});
```

[esm-unsupported：ESM 沙箱所需能力不可用](/zh-CN/errors/esm-unsupported) 表示模块未能通过映射检测；若 iframe 初始化失败、检测脚本被强制 CSP 拦截或 5 秒内未完成，则报告 [esm-capability-check-failed：ESM 能力检测未完成](/zh-CN/errors/esm-capability-check-failed)。后者不能用于判断浏览器是否支持 ESM 沙箱。检测不替代微应用资源的 CSP、CORS 和网络检查。

## Firefox 与原生 ESM

ESM 沙箱依赖动态注入多个 import map，Firefox 尚未默认启用该能力。qiankun 3.0 不提供 ESM 沙箱降级，使用 ESM 微应用时，必须选择支持动态注入多个 import map 的浏览器。es-module-shims 的评估与不接入的原因见 [ESM 沙箱 RFC](https://github.com/umijs/qiankun/blob/next/docs/rfcs/esm-sandbox.md)。

需要支持 Firefox 时，微应用应改用 Classic 脚本方式交付（例如 Webpack 构建产物），基础运行时和样式隔离在 Firefox 上不受影响。

## 继续阅读

- [原生 ESM 支持](/zh-CN/concepts/esm-sandbox)——ESM 微应用的完整约束与开发注意事项。
- [样式隔离](/zh-CN/concepts/style-isolation)——`@scope` 的作用边界与限制。
- [isRuntimeCompatible](/zh-CN/api/is-runtime-compatible)——运行时检测的 API 说明。
