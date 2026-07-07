# 让 Vite 应用接入 qiankun

这篇讲怎么把一个现成的 Vite 应用改造成 qiankun 微应用。qiankun v3 通过 [ESM 沙箱](/zh-CN/concepts/esm-sandbox)原生加载 Vite 应用——开发和生产跑的是同一份原生 `<script type="module">` 依赖图，不需要 SystemJS，也没有 legacy transform。要做的事就几步：装上 Vite 插件、导出生命周期、调整 `index.html` 和 dev server，再照顾好几个 ESM 沙箱下的行为差异。

::: tip 从零起步更省事
如果你是新建一个应用而不是改造老的，[create-qiankun](/zh-CN/ecosystem/create-qiankun) 会把这套接线直接给你生成好。Webpack 应用的接入见[让 Webpack 应用接入 qiankun](/zh-CN/cookbook/prepare-a-webpack-app)。
:::

## 装上 Vite 插件

把 bundler 插件装成 dev 依赖，然后和你的框架插件放在一起注册 Vite 插件。

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

`qiankun()` 不接受任何参数，只干两件事：

- **给 dev 和 preview 开 CORS。** 它把 `server.cors` / `preview.cors` 设为 `true`，并加上 `Access-Control-Allow-Origin: *`，这样主应用才能跨域抓取入口 HTML 和整份模块图。你不用自己去加 CORS 头。
- **构建时标记入口。** 执行 `vite build` 时，它会在产出的 `index.html` 里给入口那条 `<script type="module">` 打上 `entry` 属性（见下文）。dev serve 阶段它什么都不做——ESM 引擎靠生命周期导出来识别入口，而且 Vite 在 dev 阶段本来就会把不认识的 HTML 属性剥掉。

::: warning 导入路径别搞错
Vite 插件只在 `/vite` 子路径下：`import { qiankun } from '@qiankunjs/bundler-plugin/vite'`。直接 import 裸的 `@qiankunjs/bundler-plugin` 拿到的是 Webpack 插件。这个插件不接收任何选项——别传 `entry`、`libraryName` 之类的东西。
:::

## 从入口导出生命周期

qiankun 通过三个生命周期函数来驱动每个微应用。在 ESM 沙箱下，你原生的那些 `export` **就是**生命周期——没有任何 UMD 或 window library 的包装。渲染进 `props.container`（qiankun 在挂载时提供的那个元素），同时保留一条 standalone 分支，让应用还能在自己的 dev server 上独立跑。

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

关于这套写法，有几点要说清楚：

- **`props.container`** 是 qiankun 挂载进去的那个元素。在它内部找你的挂载节点（`container.querySelector('#root')`），这样同一份代码在被托管和独立运行两种情况下都能用。React/Webpack 示例用 `#root`，Vue 用 `#app`——你 `index.html` 里声明的是哪个 id 就对哪个。
- **`window.__POWERED_BY_QIANKUN__`** 是 qiankun 在沙箱里运行时注入的。用它来判断要不要走 standalone 的 `render()`，避免应用被托管时重复挂载两次。
- **`window[name] = { bootstrap, mount, unmount }` 这行赋值是可选的 classic-mode 兜底。** ESM 沙箱下，原生导出才是生命周期的主来源；这行你可以留着做个保险，但它并不是 ESM 引擎实际读取的东西。如果保留，注册时的 qiankun `name` 必须和这个 window key 对上。
- **`unmount` 必须彻底拆干净**（`root.unmount()` / `app.unmount()`，并把引用置空）。实例泄漏会让重新挂载和多实例场景出问题。参见[同时运行多个微应用实例](/zh-CN/cookbook/run-multiple-instances)。

生命周期完整的约定和 `props` 的形状，见[微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props)。

## 配置 index.html

声明一个挂载节点和一条入口 module 脚本。在你的源码 `index.html` 里，给入口 `<script>` 打上 `entry` 属性。

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

关于 `entry` 属性，有两点要理解：

- `type="module"` 会让脚本走 **ESM 沙箱**。经典 `<script>`（没有 `type="module"`）走的是另一条 `with(proxy)` 路径。
- `entry` 属性标记的是那唯一一条带生命周期的脚本。**dev** 阶段 Vite 会把这个它不认识的属性剥掉，这没关系——ESM 引擎靠生命周期导出来挑入口。**生产**阶段，`qiankun()` 会把 `entry` 重新加回构建产物里的脚本。在源码里标好它，是为了让两条路径保持对称。

::: danger 入口只能有一个
带 `entry` 属性的脚本只能有一条。加载器一旦发现多于一条，就抛 `QiankunError`。非入口的脚本照常加载。
:::

另外要用 `strictPort: true` 把 dev server 端口固定住（上面的配置里已经写了）。主应用是靠一个固定 URL 来引用你的应用的，端口不能漂：

```ts
// examples/main/src/apps.ts — how the host references this app
{ name: 'react', path: '/react', entry: '//localhost:7100' }
```

`registerMicroApps` 里的 `entry` 就是你应用 `index.html` 的字符串 URL（这里是 dev server 根地址）。主应用那一侧的写法见 [registerMicroApps](/zh-CN/api/register-micro-apps)。

## Vue：feature flag 要在两处声明

Vue 的 esm-bundler 构建会读取 `__VUE_OPTIONS_API__` 这类编译期 feature flag。因为 Vite 8 用 **rolldown**（不是 esbuild）来预打包依赖，而 `config.define` 到不了这个预打包步骤，所以这些 flag 你得在 `define` 和 `optimizeDeps.rolldownOptions.transform.define` **两处**都声明。

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

这本来就是 Vue esm-bundler 自己的最佳实践，和 qiankun 无关。作为一层保险，qiankun 的 ESM 沙箱也会在运行时把这些双下划线 feature flag 动态绑定好，这样写进真实全局的 flag 对沙箱里的模块仍然可见。但构建期声明它们，依然是正道。

## 需要照顾的 ESM 沙箱行为

ESM 沙箱会忠实地跑你原生的模块图，但有几处语义和经典的打包型微应用不一样。设计时要绕开它们。

### 应用状态放进 mount() 里建，别放模块顶层

重新挂载时，qiankun 会重跑 `mount(props)`，但**不会**重跑模块的顶层代码。每个模块的 blob URL 是复用的，所以 `import(sameBlobUrl)` 返回的是同一个 namespace——顶层语句只执行一次。这和现代框架的写法本来就一致：在 `mount()` 里构建应用实例，在 `unmount()` 里拆掉。

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

::: warning classic 与 ESM 重新挂载的区别
这一点和经典沙箱不同：经典沙箱每次重新挂载都会把整条入口脚本重跑一遍。原先依赖顶层副作用每次挂载都重新执行的代码，得把那部分逻辑挪进 `mount()`。
:::

### qiankun 下 HMR 是关掉的

你的 Vite 应用跑在 qiankun 里时，Vite 的 HMR 客户端（`/@vite/client`）会被打桩。`import.meta.hot` 是一个可正常调用的 noop，所以 `accept()` 调用不会抛错，但不会真的开 HMR WebSocket。这是有意为之：真实客户端的 socket 会从沙箱内部发起连接，可能触发一次破坏性的整页 `location.reload()`。开发时改完代码手动刷新页面即可。独立运行（在 qiankun 之外）时，HMR 照常工作。

### bare specifier 必须可解析

ESM 引擎自己解析每一个 `import` specifier。像 `import x from 'lodash-es'` 这种 bare specifier，必须能通过**你应用自己的 `<script type="importmap">`** 解析出来，或者写成 URL 形式的 specifier（`./`、`../`、`/`，或一个绝对 URL）。两者都不满足，解析就会抛 `QiankunError`（"failed to resolve the bare specifier … no import map entry found"）。正常的 Vite 构建里每个依赖都已经打包成相对 / 绝对 URL 了，所以这主要影响那些手写 import map 的应用。

::: info import map 是按应用隔离的
qiankun 自己解析你应用的 import map，绝不会把它并进主应用文档。只有 `imports` 字段会被采纳；`scopes` 会被解析、给出警告，然后在 v1 里忽略掉。
:::

### 带类型的 import 在 v1 是直通的

import attributes——`import data from './x.json' with { type: 'json' }`、CSS module import、WASM——在 v1 里都是原生直通：直接映射回原始 URL 交给浏览器加载，**没有实例隔离**，并附带一次性的 `console.warn`。这要求子应用服务器发回正确的 MIME 类型和 CORS 头。对于带类型的**动态** import，相对 specifier 会相对内部 blob URL 去解析，这是已知的 v1 限制——那种场景请用绝对 URL。

## 验证

1. 让应用独立跑起来（`vite`），确认它在自己的端口上能渲染。`__POWERED_BY_QIANKUN__` 分支会走 standalone 的 `render()` 路径。
2. 在主应用里用指向 dev server URL 的 `entry` 注册它，然后 `start()`。主应用那一侧的接线见[快速上手](/zh-CN/guide/getting-started)和[教程](/zh-CN/tutorial/index)。
3. 导航到这个应用的路由，确认 `mount` 跑起来、内容渲染进了主应用容器；再导航离开，确认 `unmount` 把它干净地拆掉。

::: warning Firefox 与动态注入的 import map
ESM 沙箱在运行时注入 import map，而 Firefox 默认不启用它（`dom.multiple_import_maps.enabled` 在 Firefox 150 这一支之前都是关的）。Chrome/Edge 133+ 和 Safari 18.4+ 原生支持。要在 Firefox 上确保可用，需要 es-module-shims 作为受支持的基座。细节见 [ESM 沙箱](/zh-CN/concepts/esm-sandbox)。
:::

## 相关

- [ESM 沙箱](/zh-CN/concepts/esm-sandbox) —— 原生模块如何穿过隔离膜运行
- [@qiankunjs/bundler-plugin](/zh-CN/ecosystem/bundler-plugin) —— Vite 和 Webpack 插件的完整说明
- [微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props) —— 生命周期约定
- [让 Webpack 应用接入 qiankun](/zh-CN/cookbook/prepare-a-webpack-app) —— 经典路径的对应做法
- [开启 CSS 样式隔离](/zh-CN/cookbook/enable-style-isolation) —— 按应用限定样式作用域
