# isRuntimeCompatible

一个运行时能力探针，用来判断当前浏览器能不能跑起来 qiankun 3.0 的运行时。这是 v3 新增的 API:在启动微应用之前先探一下，遇到缺少必需能力的浏览器就退回到一个兜底方案。

## 签名

```ts
function isRuntimeCompatible(): boolean
```

`isRuntimeCompatible` 由 `qiankun` 从 [`@qiankunjs/shared`](/zh-CN/api/index) 转发出来。不接收参数，同步返回。

```ts
import { isRuntimeCompatible } from 'qiankun';

if (isRuntimeCompatible()) {
  // safe to register and start micro-apps
}
```

## 它检查什么

探针会确认 v3 运行时依赖的三个全局能力都存在、而且是可调用的：

```ts
typeof Proxy === 'function' &&
  typeof TransformStream === 'function' &&
  typeof URL?.createObjectURL === 'function';
```

| 能力 | 用途 |
| --- | --- |
| `Proxy` | 基于 Proxy 隔离膜的 [JS 沙箱](/zh-CN/concepts/js-sandbox)，给每个微应用一份隔离的 `window`/`document` 视图。 |
| `TransformStream` | 流式的 [HTML 入口加载器](/zh-CN/concepts/html-entry-loading)，入口 HTML 一边到达一边过一遍 transform stream。 |
| `URL.createObjectURL` | Blob URL，经典脚本路径和 [ESM 沙箱](/zh-CN/concepts/esm-sandbox)都靠它。 |

::: info 它不检查什么
探针刻意做得很薄，只对上面这三个基础能力做特性检测。它**不会**探测 import map、动态 `import()` 或任何 ESM 相关的能力，也不会去读 user-agent、比对版本号。
:::

## 浏览器支持

三个要求里 `TransformStream` 最苛刻，实际的门槛就由它划定。粗略地说，`TransformStream` 大致从这些版本开始广泛可用：

- Chrome / Edge 67+
- Firefox 102+
- Safari 14.1+

这几个版本当个大致基线看就行，别当成精确的兼容性对照表。`Proxy` 和 `URL.createObjectURL` 出现得更早，所以一个浏览器只要支持 `TransformStream`，三项检查基本都能过。拿不准的时候，与其自己维护一份版本清单，不如运行时直接调 `isRuntimeCompatible()`。

## 用法

在注册或启动微应用之前先调探针，返回 `false` 时渲染一个兜底内容。

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

这项检查开销很小，又是同步的，放心在基座的启动流程里跑一次就够了。

## ESM 沙箱要求更高

`isRuntimeCompatible` 反映的是核心运行时的要求。而以原生 ES module(`<script type="module">`)方式交付的微应用会走 [ESM 沙箱](/zh-CN/concepts/esm-sandbox)，这条路还额外依赖**动态注入的 import map**。所以 `isRuntimeCompatible()` 过了，并不等于这条路一定能跑通。

::: warning Firefox 与 import map
Firefox 默认不支持注入多个动态 import map(该能力被 `dom.multiple_import_maps.enabled` 开关挡着)。想在 Firefox 或更老的浏览器上拿到确定的支持，别指望原生 import map，改用 [es-module-shims](/zh-CN/concepts/esm-sandbox) 作为受支持的基座。Chrome/Edge 和较新的 Safari 都原生支持这个特性。
:::

## 相关链接

- [API 参考总览](/zh-CN/api/index)
- [start](/zh-CN/api/start)
- [registerMicroApps](/zh-CN/api/register-micro-apps)
- [ESM 沙箱](/zh-CN/concepts/esm-sandbox)
- [JS 沙箱](/zh-CN/concepts/js-sandbox)
