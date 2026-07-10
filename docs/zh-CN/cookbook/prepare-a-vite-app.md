# 接入 Vite 微应用

qiankun v3 以原生 ESM 方式加载 Vite 应用。接入路径只有一条：安装 Vite 插件，从入口模块导出微应用生命周期，再由主应用通过 [`loadMicroApp`](/zh-CN/api/load-micro-app) 加载。不需要 UMD 包装、SystemJS 转换或全局生命周期对象。

::: tip 要新建应用？
[create-qiankun](/zh-CN/ecosystem/create-qiankun) 可以直接生成这套配置。本指南用于改造已有的 React 或 Vue 应用。
:::

## 1. 安装并配置插件

在 Vite 应用中安装 bundler 插件：

```bash
pnpm add -D @qiankunjs/bundler-plugin
```

把 `qiankun()` 与框架插件一起配置，并固定开发端口：

::: code-group

```ts [vite.config.ts (React)]
import { qiankun } from '@qiankunjs/bundler-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), qiankun()],
  server: {
    port: 7101,
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

插件不接收任何参数，只为 Vite 补上接入 qiankun 所需的两项能力：

- 开发和预览服务器返回宽松的 CORS 响应头，让主应用可以获取 HTML 入口和模块图；
- 生产构建会给入口模块脚本添加 qiankun 所需的唯一 `entry` 属性。

请从 `@qiankunjs/bundler-plugin/vite` 导入；包的裸导入指向 Webpack 插件。

## 2. 导出原生 ESM 生命周期

直接从 `index.html` 引用的模块导出 `bootstrap`、`mount` 和 `unmount`。在 `mount` 中创建框架实例，在 `props.container` 内渲染，并在 `unmount` 中销毁实例。

::: code-group

```tsx [src/main.tsx (React)]
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
  }
}

type MountProps = { container: HTMLElement };
let root: ReactDOM.Root | undefined;

function render(scope: ParentNode) {
  const node = scope.querySelector('#root');
  if (!node) throw new Error('#root not found');

  root = ReactDOM.createRoot(node);
  root.render(<App />);
}

export async function bootstrap() {}

export async function mount({ container }: MountProps) {
  render(container);
}

export async function unmount() {
  root?.unmount();
  root = undefined;
}

if (!window.__POWERED_BY_QIANKUN__) {
  render(document);
}
```

```ts [src/main.ts (Vue)]
import { createApp, type App as VueApp } from 'vue';
import App from './App.vue';

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
  }
}

type MountProps = { container: HTMLElement };
let app: VueApp<Element> | undefined;

function render(scope: ParentNode) {
  const node = scope.querySelector('#app');
  if (!node) throw new Error('#app not found');

  app = createApp(App);
  app.mount(node);
}

export async function bootstrap() {}

export async function mount({ container }: MountProps) {
  render(container);
}

export async function unmount() {
  app?.unmount();
  app = undefined;
}

if (!window.__POWERED_BY_QIANKUN__) {
  render(document);
}
```

:::

这套写法有四个关键点：

- 原生 ESM 导出就是生命周期契约，不要再把生命周期对象赋给 `window`；
- `props.container` 属于当前微应用实例，应在它内部查询 `#root` 或 `#app`，不要使用页面级全局选择器；
- `__POWERED_BY_QIANKUN__` 用于避免入口在 qiankun 即将调用 `mount` 时自行渲染；应用通过自己的开发服务器运行时仍会立即渲染；
- 每次 `mount` 都要创建一个可用的应用，每次 `unmount` 都要完整撤销它。重新挂载时，模块顶层代码不会再次执行。

完整契约见[微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props)。

## 3. 保持原生模块入口

保留 Vite 常规的 HTML 结构和一条模块入口。挂载节点 id 必须与生命周期代码中的选择器一致：

```html
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
```

源码中不需要手工添加 `entry`。生产构建时，Vite 插件会把它添加到生成后的入口脚本。一份构建产物中，带这个属性的脚本不能超过一个。

如果应用部署在子路径下，或者资源使用独立域名，请配置 Vite 的 `base`，确保 `dist/index.html` 中生成的 URL 可以被浏览器访问。

## 4. 从主应用加载

把 Vite 服务器或生产部署地址传给 `loadMicroApp`，保存返回的句柄，并在移除容器前卸载应用：

```ts
import { loadMicroApp } from 'qiankun';

const container = document.getElementById('micro-app-slot');
if (!container) throw new Error('micro-app-slot not found');

const microApp = loadMicroApp({
  name: 'account-app',
  entry: 'http://localhost:7101/',
  container,
  props: { accountId: '42' },
});

await microApp.mountPromise;

// 主应用视图销毁时：
await microApp.unmount();
```

`loadMicroApp` 不需要配合 `registerMicroApps`，也不需要显式调用 `start()`。React 和 Vue 主应用也可以改用对应的 [`<MicroApp>` 集成](/zh-CN/ecosystem/index)，由组件生命周期管理同一个句柄。

## 5. 配置跨域部署

插件只为 Vite 的开发和预览服务器启用 CORS。生产环境中，服务器或 CDN 必须允许主应用来源获取：

- HTML 入口；
- JavaScript 模块和动态导入的 chunk；
- CSS、图片以及应用引用的其他资源。

请从主应用页面测试最终的资源 URL、重定向、MIME 类型和 CORS 响应头。如果应用请求需要 Cookie，通配符 `Access-Control-Allow-Origin` 并不适用；请同时配置明确的来源、支持凭据的响应头，以及主应用的自定义 [`fetch`](/zh-CN/api/configuration)。

## 6. 验证开发与生产环境

1. 单独运行 Vite 应用，确认独立运行分支可以渲染；
2. 运行主应用，用 `http://localhost:7101/` 调用 `loadMicroApp`，确认应用渲染在传入容器内；
3. 依次调用 `await microApp.unmount()` 和 `await microApp.mount()`，确认没有重复的根节点、监听器或残留界面；
4. 在 Vite 应用中执行 `pnpm run build`，检查 `dist/index.html`：应当恰好有一个生成后的模块脚本带 `entry` 属性；
5. 执行 `pnpm run preview`，让主应用指向预览地址，并重复挂载与卸载检查；
6. 发布前，从每个受支持的浏览器和主应用来源测试生产入口。浏览器限制见[原生 ESM 支持](/zh-CN/concepts/esm-sandbox)。

## 相关内容

- [HTML 入口](/zh-CN/concepts/html-entry-loading)——入口约定与 CORS 边界
- [原生 ESM 支持](/zh-CN/concepts/esm-sandbox)——可观察的 ESM 行为与兼容性
- [`@qiankunjs/bundler-plugin`](/zh-CN/ecosystem/bundler-plugin)——插件参考
- [同时运行多个实例](/zh-CN/cookbook/run-multiple-instances)——重新挂载与清理模式
- [接入 Webpack 应用](/zh-CN/cookbook/prepare-a-webpack-app)——Classic 构建的替代方案
