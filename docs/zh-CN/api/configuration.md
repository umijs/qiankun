# AppConfiguration

`AppConfiguration` 是单个微应用实例的运行时配置，包含 JavaScript 隔离、样式隔离、自定义 fetch 和高级加载转换钩子。

配置默认作为 [`loadMicroApp`](/zh-CN/api/load-micro-app) 的第二个参数传入。路由驱动应用使用 `registerMicroApps` 的 `configuration` 字段，`<MicroApp>` 组件则通过 `settings` prop 暴露同一类型。

## 类型

```ts
import { type AppConfiguration } from 'qiankun';
```

每个字段都是可选的。下表列出字段省略时的默认行为。

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `sandbox` | `boolean` | `true` | 开启基于 `Proxy` 隔离膜的 JS 沙箱(对 `<script type="module">` 还会启用 ESM 沙箱引擎)。设成 `false` 就让微应用直接跑在真实全局上。 |
| `globalContext` | `WindowProxy` | `window` | 沙箱隔离膜代理的那个基础全局对象。基本不用改。 |
| `styleIsolation` | `boolean` | `false` | 开启运行时 CSS 隔离，把微应用的样式包进一个作用域限定在应用容器上的 CSS `@scope` 块里。默认关，按需开。 |
| `fetch` | `typeof window.fetch` | `window.fetch` | 用于入口以及 loader 接管的脚本、模块和样式请求。图片等由浏览器原生发起的请求不一定经过它。 |
| `streamTransformer` | `() => TransformStream<string, string>` | `undefined` | 可选，插进 HTML 入口流式管线里的一个 transform，拿到的是解码后的 HTML 字符串流。 |
| `nodeTransformer` | `<T extends Node>(node: T, opts) => T` | 内置资源转换器 | 在 script / link / style 节点进入容器前改写它。仅用于高级扩展。 |

## 逐个字段细说

### sandbox

默认 `true`。开启后，每个微应用获得独立的 `window` 视图；原生 ESM 入口也使用同一应用级隔离。可依赖的保证和责任边界见 [JavaScript 隔离](/zh-CN/concepts/js-sandbox)。

设成 `sandbox: false`，微应用就直接跑在真实全局上下文里——对那些没法忍受被代理过的全局的老应用有用，代价是丢掉隔离。

```ts
configuration: { sandbox: false }
```

`sandbox` 是普通布尔值。设为 `false` 也会关闭原生 ESM 隔离路径。

### globalContext

默认 `window`。这是沙箱隔离膜代理的基础全局。普通的单窗口场景下你根本不用设它；它是留给那种基础 realm 不是顶层 `window` 的高级托管场景的。

### styleIsolation

默认 `false`。设成 `true` 后，qiankun 使用原生 CSS [`@scope`](https://developer.mozilla.org/en-US/docs/Web/CSS/@scope) 将微应用样式限制在应用容器内。作用域根由应用配置推导，不能自定义。

::: warning 浏览器支持与 CORS
样式隔离依赖原生 CSS `@scope`，qiankun 没有提供 polyfill。应把不支持 `@scope` 的浏览器视为不支持这项配置。另外，外部样式表必须能通过 CORS 拉取；一旦请求或转换失败，这张样式表会被丢弃，而不会以未隔离形式加载。
:::

边界见[样式隔离](/zh-CN/concepts/style-isolation)，操作步骤见[开启 CSS 样式隔离](/zh-CN/cookbook/enable-style-isolation)，实现细节见[样式隔离实现](/zh-CN/internals/style-isolation)。

### fetch

默认 `window.fetch`。qiankun 会在调用方提供的 fetch 外增加非成功响应校验、瞬时失败重试和请求去重缓存。

传自定义 `fetch` 通常是为了注入凭证、请求头或走代理。它仍须保持标准 Fetch API 的响应与流式语义；外层的校验、重试和缓存行为仍会生效。

### streamTransformer

默认 `undefined`。传了的话，它的 `TransformStream<string, string>` 会被接进 HTML 入口的流式管线里，位置在字节解码之后、qiankun 自己改写标签之前。用它可以在流的过程中改写入口 HTML(比如注入或删掉一些标记)。大多数应用都用不上。

管线细节见[流式 HTML Entry 实现](/zh-CN/internals/streaming-html-entry)。

### nodeTransformer

默认转换器负责 qiankun 对 script、link 和 style 的标准处理。覆盖它意味着调用方接管节点改写，可能同时影响脚本隔离、模块解析和样式隔离；只有高级扩展才应使用。输入输出契约和默认管线见[流式 HTML Entry 实现](/zh-CN/internals/streaming-html-entry)。

## 在哪里传入配置

推荐把配置作为 `loadMicroApp` 的第二个参数传入：

```ts
import { loadMicroApp } from 'qiankun';

const microApp = loadMicroApp(
  {
    name: 'react-app',
    entry: '//localhost:7101',
    container: document.getElementById('subapp-container')!,
  },
  {
    sandbox: true,
    styleIsolation: true,
  },
);
```

React 和 Vue 的 `<MicroApp>` 组件通过 `settings` 接收同一类型。路由驱动应用则把配置放在 `registerMicroApps` 的应用 `configuration` 字段中。

`container` 属于应用描述，不属于 `AppConfiguration`；它必须是一个真实的 `HTMLElement`。

## 优先级

所有字段都按微应用实例生效。`start()` 不接收也不会合并全局的沙箱、样式或 fetch 配置。

## 从 v2 迁移

v2 的对象式沙箱配置、`start()` 全局配置和旧式样式隔离选项不属于这个类型。完整替换关系只在[从 qiankun 2.x 迁移](/zh-CN/cookbook/migrate-from-2x)中维护。

## 相关

- [loadMicroApp](/zh-CN/api/load-micro-app)——把 `AppConfiguration` 作为第二个参数。
- [registerMicroApps](/zh-CN/api/register-micro-apps)——路由驱动应用通过 `configuration` 设置同一类型。
- [start](/zh-CN/api/start)——框架启动；注意它只接收 `{ urlRerouteOnly }`。
- [类型参考](/zh-CN/api/types)——完整的类型面，含 `RegistrableApp` 和 `LoadableApp`。
- [样式隔离](/zh-CN/concepts/style-isolation) 和 [JS 沙箱](/zh-CN/concepts/js-sandbox)——`styleIsolation` 与 `sandbox` 背后的概念。
