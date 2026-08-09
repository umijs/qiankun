# AppConfiguration

`AppConfiguration` 是单个微应用实例的运行时配置，包含 JavaScript 隔离、样式隔离、自定义 fetch 和高级加载转换钩子。

使用 [`loadMicroApp`](/zh-CN/api/load-micro-app) 时，应将配置作为第二个参数传入。路由驱动应用通过 `registerMicroApps` 的 `configuration` 字段设置配置，`<MicroApp>` 组件则通过 `settings` 属性接收相同类型的配置。

## 类型

```ts
import { type AppConfiguration } from 'qiankun';
```

每个字段都是可选的。下表列出字段省略时的默认行为。

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `sandbox` | `boolean \| SandboxConfiguration` | `true` | 隔离能力的统一入口。设为 `false` 时微应用在真实全局对象中运行；设为 `true` 时以默认配置启用沙箱；传入对象时启用沙箱并配置底层 Compartment。 |
| `fetch` | `typeof window.fetch` | `window.fetch` | 用于请求入口，以及由加载器处理的脚本、模块和样式。图片等由浏览器直接发起的请求不一定经过该函数。 |
| `streamTransformer` | `() => TransformStream<string, string>` | `undefined` | 可选。用于自定义 HTML 入口的流式处理过程，接收解码后的 HTML 字符串流。 |
| `nodeTransformer` | `<T extends Node>(node: T, opts) => T` | 内置资源转换器 | 在 `<script>`、`<link>` 和 `<style>` 节点进入容器前进行转换。仅用于高级扩展。 |

## 配置项说明

### sandbox

默认值为 `true`。启用后，每个微应用都会获得独立的 `window` 视图；原生 ESM 入口也使用相同的应用级隔离机制。相关行为与限制参见 [JavaScript 隔离](/zh-CN/concepts/js-sandbox)。

设为 `sandbox: false` 后，微应用将在真实全局上下文中运行，同时原生 ESM 隔离也会关闭。该选项可用于无法兼容代理全局对象的旧应用，但应用之间将不再具备 JavaScript 隔离能力。

```ts
configuration: { sandbox: false }
```

如需在保持隔离的同时调整沙箱行为，可传入对象而非 `true`：

```ts
configuration: {
  sandbox: {
    styleIsolation: true,
    globals: { TENANT_ID: 'acme' },
  },
}
```

## SandboxConfiguration

`SandboxConfiguration` 在结构上是沙箱 `CompartmentOptions` 的公开投影，外加 `plugins` 和 `styleIsolation` 两个宿主扩展：

```ts
import { type SandboxConfiguration } from 'qiankun';

type SandboxConfiguration = Pick<
  CreateSandboxOptions,
  'globals' | 'incubatorContext' | 'modules' | 'resolveHook' | 'importHook' | 'loadHook' | 'plugins' | 'styleIsolation'
>;
```

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `styleIsolation` | `boolean` | `false` | 启用运行时 CSS 隔离，使用 CSS `@scope` 将微应用样式的作用域限制在应用容器内。 |
| `globals` | `Record<string, unknown \| PropertyDescriptor>` | `{}` | 安装到该应用 compartment 全局对象上的值或属性描述符，不会修改宿主 `window`。 |
| `incubatorContext` | `WindowProxy` | `window` | 孵化该沙箱的宿主上下文，即沙箱未遮蔽的属性所透读的全局对象。 |
| `plugins` | `readonly IsolationPlugin[]` | `[]` | 追加在 qiankun 内置插件之后的隔离插件。 |
| `modules` / `resolveHook` / `importHook` / `loadHook` | Compartment 模块钩子 | `undefined` | 沙箱内 ESM 的模块解析与加载钩子，属于高级用法。 |

### sandbox.styleIsolation

默认值为 `false`。设为 `true` 后，qiankun 使用原生 CSS [`@scope`](https://developer.mozilla.org/en-US/docs/Web/CSS/@scope) 将微应用样式限制在应用容器内。作用域根由应用配置确定，不支持自定义。

样式隔离位于 `sandbox` 对象内部而非与之并列，是因为动态注入的样式依赖沙箱的 DOM 拦截：入口中的静态样式由加载器转译处理，动态样式则由沙箱处理。若在关闭 JS 沙箱的同时开启 CSS 隔离，所有动态样式都会静默泄漏，因此该组合在配置上不可表达。

::: warning 浏览器支持与 CORS
样式隔离依赖原生 CSS `@scope`，qiankun 不提供兼容实现（polyfill）。不支持 `@scope` 的浏览器无法使用该配置。此外，外部样式表必须允许通过 CORS 获取；请求或转换失败时，qiankun 会忽略对应样式表，不会改为加载未隔离的样式。
:::

行为与限制参见[样式隔离](/zh-CN/concepts/style-isolation)，操作步骤参见[启用 CSS 样式隔离](/zh-CN/cookbook/enable-style-isolation)，实现细节参见[样式隔离实现](/zh-CN/internals/style-isolation)。

### sandbox.globals

默认值为 `{}`。每一项都会被安装到该微应用自己的 compartment 全局对象上：可以是普通值，也可以是属性描述符（用于控制可写性、可枚举性等）。宿主 `window` 不会被修改，配置的键对 classic 与 ESM 应用同样可见。

```ts
configuration: {
  sandbox: {
    globals: {
      tenantId: 'acme',
      featureClient: { value: createFeatureClient(), writable: false },
    },
  },
}
```

### sandbox.incubatorContext

默认值为 `window`，表示孵化该沙箱的宿主上下文，即沙箱未遮蔽的属性所透读的全局对象。该命名沿用 ShadowRealm 提案中的「incubator realm」。常规的单窗口场景无需配置此项；当宿主环境的基础执行域不是顶层 `window` 时，可通过此项指定相应的全局对象。

### sandbox.plugins

默认值为 `[]`。隔离插件运行在 qiankun 内置插件之后：`bootstrap` 插件在微应用脚本执行前运行，`mount` 插件在每次挂载时运行，其返回的 `Free` 函数会参与卸载清理与重新挂载时的恢复。完整协议参见[用插件扩展沙箱](/zh-CN/cookbook/sandbox-plugins)。

### 模块钩子

`modules`、`resolveHook` 和 `importHook`（`loadHook` 是它的别名）直接设置在 `sandbox` 对象上，用于配置该应用 Compartment 的模块加载行为——重定向、私有协议或预编译模块源。这些钩子仅作用于沙箱内的 ESM。示例参见[独立使用沙箱](/zh-CN/cookbook/standalone-sandbox)。

### fetch

默认值为 `window.fetch`。qiankun 会在调用方提供的 fetch 基础上检查响应状态是否处于 `200-399` 范围，并对失败请求进行有限次数的自动重试，同时执行请求去重和缓存。

自定义 `fetch` 通常用于携带身份凭据、添加请求头或使用代理。该函数必须保持标准 Fetch API 的响应格式和流式处理语义；qiankun 提供的校验、重试和缓存仍会生效。

### streamTransformer

默认值为 `undefined`。配置后，返回的 `TransformStream<string, string>` 会参与 HTML 入口的流式处理，执行位置在字节解码之后、qiankun 转换标签之前。该转换器可在流式处理期间修改入口 HTML，例如插入或删除标记。常规应用通常无需配置此项。

处理流程的详细说明见[流式 HTML 入口实现](/zh-CN/internals/streaming-html-entry)。

### nodeTransformer

默认转换器负责 qiankun 对 `<script>`、`<link>` 和 `<style>` 节点的标准处理。覆盖该转换器后，节点转换将由调用方负责，并可能同时影响脚本隔离、模块解析和样式隔离，因此仅适用于高级扩展。输入输出约定和默认处理流程参见[流式 HTML 入口实现](/zh-CN/internals/streaming-html-entry)。

## 配置方式

推荐将配置作为 `loadMicroApp` 的第二个参数传入：

```ts
import { loadMicroApp } from 'qiankun';

const microApp = loadMicroApp(
  {
    name: 'react-app',
    entry: '//localhost:7101',
    container: document.getElementById('subapp-container')!,
  },
  {
    sandbox: { styleIsolation: true },
  },
);
```

React 和 Vue 的 `<MicroApp>` 组件通过 `settings` 接收相同类型的配置。路由驱动应用应在 `registerMicroApps` 的应用 `configuration` 字段中设置配置。

`container` 属于应用描述，不属于 `AppConfiguration`；它必须是一个真实的 `HTMLElement`。

## 优先级

所有字段都按微应用实例生效。`start()` 不接收也不会合并全局的沙箱、样式或 fetch 配置。

应用级的 `sandbox` 对象会整体覆盖外层配置：配置合并是一次浅展开，沙箱内部的各个字段不会被深合并。

## 从 v2 迁移

v2 的对象形式沙箱配置、`start()` 全局配置和旧版样式隔离选项均不属于该类型。完整的替换关系见[从 qiankun 2.x 迁移](/zh-CN/cookbook/migrate-from-2x)。

## 相关内容

- [loadMicroApp](/zh-CN/api/load-micro-app)——将 `AppConfiguration` 作为第二个参数。
- [registerMicroApps](/zh-CN/api/register-micro-apps)——路由驱动应用通过 `configuration` 设置同一类型。
- [start](/zh-CN/api/start)——框架启动；注意它只接收 `{ urlRerouteOnly }`。
- [类型参考](/zh-CN/api/types)——完整的类型定义，包括 `RegistrableApp` 和 `LoadableApp`。
- [样式隔离](/zh-CN/concepts/style-isolation)和 [JavaScript 隔离](/zh-CN/concepts/js-sandbox)——`styleIsolation` 与 `sandbox` 的工作原理和能力边界。
