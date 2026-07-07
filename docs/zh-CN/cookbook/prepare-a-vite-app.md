# 让 Vite 应用接入 qiankun

本指南将一个现有的 Vite 应用改造为 qiankun 微应用。qiankun v3 通过其 [ESM 沙箱](/zh-CN/concepts/esm-sandbox)原生加载 Vite 应用——同一份原生 `<script type="module">` 模块图在开发和生产环境中运行，无需 SystemJS，也没有遗留的转换逻辑。下面的步骤依次是：添加 Vite 插件、导出 lifecycle、调整 `index.html` 和开发服务器，并遵循几条 ESM 沙箱的行为约定。

::: tip 更倾向于全新开始
如果你是搭建一个全新应用而非改造现有应用，[create-qiankun](/zh-CN/ecosystem/create-qiankun) 会为你生成这套接入代码。对于 Webpack 应用，请参见[让 Webpack 应用接入 qiankun](/zh-CN/cookbook/prepare-a-webpack-app)。
:::

## 添加 Vite 插件

将 bundler 插件安装为开发依赖，并在你的框架插件旁注册 Vite 插件。

```bash
pnpm add -D @qiankunjs/bundler-plugin
```

::: code-group

```ts [vite.config.ts (React)]
import { qiankun } from '@qiankunjs/bundler-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), qiankun()],
  server: {
    port: 7100,
    strictPort: true,
  },
});
```

```ts [vite.config.ts (Vue)]
import { qiankun } from '@qiankunjs/bundler-plugin/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue(), qiankun()],
  server: {
    port: 7101,
    strictPort: true,
  },
});
```

:::

`qiankun()` 不接受任何参数，只做两件事：

- **为 dev 和 preview 开启 CORS。** 它会把 `server.cors` / `preview.cors` 设为 `true`，并添加 `Access-Control-Allow-Origin: *`，使主应用能够跨域获取入口 HTML 及模块图。你无需自己添加 CORS 头。
- **在构建期标记入口。** 执行 `vite build` 时，它会在产物 `index.html` 中给入口 `<script type="module">` 打上 `entry` 属性（见下文）。开发模式下它什么都不做——ESM 引擎通过 lifecycle 导出来识别入口，况且 Vite 在开发期本身就会剥离未知的 HTML 属性。

::: warning 导入路径很关键
Vite 插件只存在于 `/vite` 子路径下：`import { qiankun } from '@qiankunjs/bundler-plugin/vite'`。裸写的 `@qiankunjs/bundler-plugin` 导入解析到的是 Webpack 插件。该插件不接受任何选项——不要传入 `entry`、`libraryName` 之类的参数。
:::

## 从入口导出 lifecycle

qiankun 通过三个 lifecycle 函数驱动每个微应用。在 ESM 沙箱下，你的原生 `export` **就是** lifecycle——不会被包裹进任何 UMD 或 window 库。请渲染到 `props.container`（qiankun 在 mount 时提供的元素），并保留一个独立运行分支，以便应用仍能在自己的开发服务器上单独运行。

::: code-group

```tsx [src/main.tsx (React)]
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
    [key: string]: unknown;
  }
}

let root: ReactDOM.Root | undefined;

function render(props: { container?: Element } = {}) {
  // Resolve the mount node inside the qiankun-provided container,
  // falling back to the global document when running standalone.
  const container = props.container?.querySelector('#root') ?? document.getElementById('root');
  if (!container) return;

  root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

export async function bootstrap() {}

export async function mount(props: { container?: Element }) {
  render(props);
}

export async function unmount(_props: { container?: Element }) {
  root?.unmount();
  root = undefined;
}

if (window.__POWERED_BY_QIANKUN__) {
  // classic-mode fallback: expose lifecycles on window under the registered app name
  window['react'] = { bootstrap, mount, unmount };
} else {
  render();
}
```

```ts [src/main.ts (Vue)]
import { createApp } from 'vue';
import App from './App.vue';

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
    [key: string]: unknown;
  }
}

let app: ReturnType<typeof createApp> | undefined;

function render(props: { container?: Element } = {}) {
  const container = props.container?.querySelector('#app') ?? document.getElementById('app');
  if (!container) return;

  app = createApp(App);
  app.mount(container);
}

export async function bootstrap() {}

export async function mount(props: { container?: Element }) {
  render(props);
}

export async function unmount(_props: { container?: Element }) {
  app?.unmount();
  app = undefined;
}

if (window.__POWERED_BY_QIANKUN__) {
  window['vue'] = { bootstrap, mount, unmount };
} else {
  render();
}
```

:::

关于这套写法的说明：

- **`props.container`** 是 qiankun 挂载进去的元素。请在它内部定位你的挂载节点（`container.querySelector('#root')`），这样同一份代码在被托管和独立运行两种情况下都能工作。React/Webpack 示例使用 `#root`，Vue 使用 `#app`——请与你 `index.html` 中声明的 id 保持一致。
- **`window.__POWERED_BY_QIANKUN__`** 由 qiankun 在运行时于沙箱内设置。用它来把守独立运行的 `render()` 调用，避免应用在被托管时重复挂载。
- **`window[name] = { bootstrap, mount, unmount }` 这个赋值是可选的 classic 模式回退。** 在 ESM 沙箱下，原生导出才是主要的 lifecycle 来源；你可以保留这个赋值以增强健壮性，但它并不是 ESM 引擎读取的对象。如果保留它，注册的 qiankun `name` 必须与 window 键名一致。
- **`unmount` 必须彻底拆卸**（`root.unmount()` / `app.unmount()` 并把引用置空）。泄漏的实例会破坏重新挂载和多实例场景。参见[运行多个微应用实例](/zh-CN/cookbook/run-multiple-instances)。

关于完整的 lifecycle 契约以及 `props` 的结构，参见[微应用 lifecycle 与 props](/zh-CN/concepts/lifecycle-and-props)。

## 配置 index.html

声明一个挂载节点和一个入口模块脚本。在你的源码 `index.html` 中，给入口 `<script>` 打上 `entry` 属性。

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React micro app · qiankun</title>
    <style>
      /* standalone-only page background; inside qiankun the host owns the page */
      body {
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx" entry></script>
  </body>
</html>
```

关于 `entry` 属性，有两点需要理解：

- `type="module"` 会让脚本走 **ESM 沙箱**。经典 `<script>`（没有 `type="module"`）则会走经典的 `with(proxy)` 路径。
- `entry` 属性标记出那唯一一个承载 lifecycle 的脚本。在**开发**模式下，Vite 会剥离这个未知属性，这没关系——ESM 引擎通过 lifecycle 导出来挑选入口。在**生产**模式下，`qiankun()` 会把 `entry` 重新加回到构建后的脚本上。在源码中标记它可以让两条路径保持对称。

::: danger 只能有一个入口
只能有一个脚本携带 `entry` 属性。如果 loader 发现超过一个，就会抛出 `QiankunError`。非入口脚本会正常加载。
:::

同时用 `strictPort: true` 固定开发服务器端口（在上面的配置中已展示）。主应用通过固定 URL 引用你的应用，因此端口不能漂移：

```ts
// examples/main/src/apps.ts — how the host references this app
{ name: 'react', path: '/react', entry: '//localhost:7100' }
```

`registerMicroApps` 中的 `entry` 是你应用 `index.html` 的字符串 URL（这里就是开发服务器根路径）。主应用一侧的写法参见 [registerMicroApps](/zh-CN/api/register-micro-apps)。

## Vue：在两个地方定义 feature flag

Vue 的 esm-bundler 构建会读取编译期 feature flag，例如 `__VUE_OPTIONS_API__`。由于 Vite 8 使用 **rolldown**（而非 esbuild）对依赖做预打包，而 `config.define` 无法到达那个预打包步骤，你必须在 `define` 和 `optimizeDeps.rolldownOptions.transform.define` **两个地方**都声明这些 flag。

```ts [vite.config.ts (Vue)]
import { qiankun } from '@qiankunjs/bundler-plugin/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// Vue's recommended esm-bundler feature flags: https://link.vuejs.org/feature-flags
const vueFeatureFlags = {
  __VUE_OPTIONS_API__: 'true',
  __VUE_PROD_DEVTOOLS__: 'false',
  __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
};

export default defineConfig({
  define: vueFeatureFlags,
  // config.define does not reach dep prebundling; pass the flags to rolldown too
  // (Vite 8 prebundles with rolldown; esbuildOptions is deprecated).
  optimizeDeps: {
    rolldownOptions: {
      transform: {
        define: vueFeatureFlags,
      },
    },
  },
  plugins: [vue(), qiankun()],
  server: { port: 7101, strictPort: true },
});
```

这是 Vue 自身的 esm-bundler 最佳实践，与 qiankun 无关。作为一道安全网，qiankun 的 ESM 沙箱也会在运行时把这些双下划线 feature flag 实时绑定，因此写入真实全局对象的 flag 仍对沙箱化的模块可见。不过在构建期定义它们仍然是正确的首选路径。

## 需要遵循的 ESM 沙箱行为

ESM 沙箱会忠实地运行你的原生模块图，但有几条语义与经典的打包式微应用不同。请围绕它们来设计。

### 在 mount() 内部而非模块顶层创建应用状态

重新挂载时，qiankun 会重新运行 `mount(props)`，但**不会**重新运行模块的顶层代码。每个模块的 blob URL 会被复用，因此 `import(sameBlobUrl)` 返回的是同一个命名空间——顶层语句恰好只执行一次。这与现代框架的风格一致：在 `mount()` 里构建你的应用实例，在 `unmount()` 里拆卸它。

```ts
// Do this — the app is created per mount, torn down per unmount.
let app: ReturnType<typeof createApp> | undefined;
export async function mount(props) {
  app = createApp(App);
  app.mount(resolveContainer(props));
}
export async function unmount() {
  app?.unmount();
  app = undefined;
}
```

```ts
// Avoid this — the instance is created once at module load and cannot
// be recreated on the second mount.
const app = createApp(App); // runs only on the first load
export async function mount(props) {
  app.mount(resolveContainer(props));
}
```

::: warning classic 与 ESM 的重新挂载差异
这与经典沙箱不同，后者在每次重新挂载时都会重新执行整个入口脚本。那些依赖顶层副作用在每次 mount 时重新运行的代码，必须把相关逻辑移进 `mount()`。
:::

### 在 qiankun 下 HMR 被禁用

当你的 Vite 应用运行在 qiankun 内部时，Vite 的 HMR 客户端（`/@vite/client`）会被打桩。`import.meta.hot` 是一个可用的空实现，因此 `accept()` 调用永远不会抛错，但不会打开任何 HMR WebSocket。这是刻意为之：真实客户端的 socket 会从沙箱内部发起连接，并可能触发破坏性的整页 `location.reload()`。开发期间请手动编辑并刷新页面。独立运行（在 qiankun 之外）时，HMR 照常工作。

### 裸模块标识符必须可解析

ESM 引擎会自行解析每一个 `import` 标识符。诸如 `import x from 'lodash-es'` 这样的裸标识符，必须能通过**你应用自己的 `<script type="importmap">`** 解析，或写成类 URL 的标识符（`./`、`../`、`/` 或绝对 URL）。如果两者都不满足，解析就会抛出 `QiankunError`（"failed to resolve the bare specifier … no import map entry found"）。在正常的 Vite 构建中，每个依赖都已被打包成相对/绝对 URL，因此这主要影响那些附带手写 import map 的应用。

::: info import map 是逐应用且相互隔离的
qiankun 会自行解析你应用的 import map，绝不会把它合并进主应用文档。只有 `imports` 字段会被采纳；`scopes` 会被解析、给出警告，并在 v1 中被忽略。
:::

### 带类型的导入在 v1 中直接透传

导入属性——`import data from './x.json' with { type: 'json' }`、CSS module 导入、WASM——在 v1 中会被原生透传：直接映射到原始 URL 并由浏览器加载，**不做实例隔离**，并附带一次性的 `console.warn`。这要求子应用服务器发送正确的 MIME 类型和 CORS 头。对于带类型的**动态**导入，相对标识符会相对内部 blob URL 解析，这是一个已知的 v1 限制——在这种场景下请使用绝对 URL。

## 验证

1. 独立运行你的应用（`vite`），确认它在自己的端口上渲染。`__POWERED_BY_QIANKUN__` 分支会走独立运行的 `render()` 路径。
2. 在主应用中用指向开发服务器 URL 的 `entry` 注册它，然后 `start()`。主应用的接入方式参见[快速上手](/zh-CN/guide/getting-started)和[教程](/zh-CN/tutorial/index)。
3. 导航到该应用的路由，确认 `mount` 运行且它渲染进了主应用容器；再导航离开，确认 `unmount` 干净地拆卸了它。

::: warning Firefox 与动态注入的 import map
ESM 沙箱在运行时注入 import map，而 Firefox 默认不启用它（`dom.multiple_import_maps.enabled` 在 Firefox 150 分支之前一直是关闭的）。Chrome/Edge 133+ 和 Safari 18.4+ 原生支持它。若要确保 Firefox 支持，你需要 es-module-shims 作为受支持的基座。详情参见 [ESM 沙箱](/zh-CN/concepts/esm-sandbox)。
:::

## 相关内容

- [ESM 沙箱](/zh-CN/concepts/esm-sandbox) —— 原生模块如何穿过 membrane 运行
- [@qiankunjs/bundler-plugin](/zh-CN/ecosystem/bundler-plugin) —— Vite 和 Webpack 插件的完整说明
- [微应用 lifecycle 与 props](/zh-CN/concepts/lifecycle-and-props) —— lifecycle 契约
- [让 Webpack 应用接入 qiankun](/zh-CN/cookbook/prepare-a-webpack-app) —— 经典路径的对应版本
- [启用 CSS 样式隔离](/zh-CN/cookbook/enable-style-isolation) —— 按应用作用域化样式
