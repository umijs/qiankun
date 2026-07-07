# isRuntimeCompatible

一个运行时能力探测函数，用于报告当前浏览器是否能够运行 qiankun 3.0 运行时。它是 v3 新增的 API，让你可以据此决定是否启动应用，并在缺少 qiankun 所依赖底层能力的浏览器上呈现优雅的降级方案。

## 签名

```ts
function isRuntimeCompatible(): boolean
```

`isRuntimeCompatible` 由 `qiankun` 从 [`@qiankunjs/shared`](/zh-CN/api/index) 重新导出。它不接受任何参数，并同步返回结果。

```ts
import { isRuntimeCompatible } from 'qiankun';

if (isRuntimeCompatible()) {
  // 可以安全地注册并启动微应用
}
```

## 它检查什么

该探测会验证 v3 运行时所依赖的三个全局对象是否作为可调用的 API 存在：

```ts
typeof Proxy === 'function' &&
  typeof TransformStream === 'function' &&
  typeof URL?.createObjectURL === 'function';
```

| 能力 | 用途 |
| --- | --- |
| `Proxy` | 基于 Proxy membrane 的 [JS 沙箱](/zh-CN/concepts/js-sandbox)，为每个微应用提供隔离的 `window`/`document` 视图。 |
| `TransformStream` | 流式 [HTML Entry 加载器](/zh-CN/concepts/html-entry-loading)，在入口 HTML 到达时将其通过 transform stream 进行处理。 |
| `URL.createObjectURL` | Blob URL，classic 脚本路径与 [ESM 沙箱](/zh-CN/concepts/esm-sandbox) 都依赖它。 |

::: info 它不检查什么
该探测有意保持最小化。它只是对上述三个底层能力的特性检测（feature detection）。它**不会**检测 import map、动态 `import()` 或任何 ESM 特有的能力，也不会读取 user-agent 字符串或比较版本号。
:::

## 浏览器支持

三个要求中最严格的是 `TransformStream`，因此它决定了实际的支持下限。作为大致参考，`TransformStream` 大约在以下版本开始被广泛支持：

- Chrome / Edge 67+
- Firefox 102+
- Safari 14.1+

请将这些版本视为粗略的基线，而非精确的兼容性矩阵。`Proxy` 和 `URL.createObjectURL` 支持得更早，因此在实践中，支持 `TransformStream` 的浏览器都会通过这三项检查。如有疑问，请在运行时调用 `isRuntimeCompatible()`，而不是维护一份版本清单。

## 用法

在注册或启动微应用之前调用该探测，当它返回 `false` 时渲染降级方案。

```ts
import { registerMicroApps, start, isRuntimeCompatible } from 'qiankun';

if (isRuntimeCompatible()) {
  registerMicroApps([
    {
      name: 'app1',
      entry: 'https://app1.example.com',
      container: document.getElementById('subapp-container')!,
      activeRule: '/app1',
    },
  ]);

  start();
} else {
  document.getElementById('subapp-container')!.innerHTML =
    'Your browser is not supported. Please upgrade to a modern version.';
}
```

这项检查开销很低且是同步的，因此可以安全地在主应用（shell）的启动流程中执行一次。

## ESM 沙箱有更严格的要求

`isRuntimeCompatible` 反映的是核心运行时的要求。以原生 ES 模块（`<script type="module">`）形式交付的微应用会走 [ESM 沙箱](/zh-CN/concepts/esm-sandbox) 路径，而该路径额外依赖**动态注入的 import map**。通过 `isRuntimeCompatible()` 本身并不能保证该路径可以正常工作。

::: warning Firefox 与 import map
Firefox 默认不支持多个动态注入的 import map（该能力被 `dom.multiple_import_maps.enabled` 标志所限制）。若要在 Firefox 或较旧浏览器上获得确定的支持，请采用 [es-module-shims](/zh-CN/concepts/esm-sandbox) 作为受支持的基座，而不是依赖原生 import map。Chrome/Edge 以及较新的 Safari 原生支持该特性。
:::

## 相关链接

- [API 参考总览](/zh-CN/api/index)
- [start](/zh-CN/api/start)
- [registerMicroApps](/zh-CN/api/register-micro-apps)
- [ESM 沙箱](/zh-CN/concepts/esm-sandbox)
- [JS 沙箱](/zh-CN/concepts/js-sandbox)
