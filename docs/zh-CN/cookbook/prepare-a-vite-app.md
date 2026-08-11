# 接入 Vite 应用

qiankun v3 以原生 ESM 方式加载 Vite 应用。接入时需要安装 Vite 插件，从入口模块导出微应用生命周期，并由主应用通过 [`loadMicroApp`](/zh-CN/api/load-micro-app) 加载。无需使用 UMD 包装、SystemJS 转换或全局生命周期对象。

::: tip 创建新应用
通过 [Agent skill](/zh-CN/ecosystem/agent-skill) 可让 coding agent 生成所需配置。本指南主要用于改造已有的 React 或 Vue 应用。
:::

## 1. 安装并配置插件

在 Vite 应用中安装构建插件：

```bash
npm install --save-dev @qiankunjs/bundler-plugin@rc
```

将 `qiankun()` 与框架插件一同加入配置，并指定固定的开发服务器端口：

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

该插件不接收参数，为 Vite 提供接入 qiankun 所需的两项能力：

- 为开发服务器和预览服务器配置 CORS 响应头，使主应用能够获取 HTML 入口和模块依赖；
- 在生产构建中为唯一的入口模块脚本添加 qiankun 所需的 `entry` 属性。

Vite 插件必须从 `@qiankunjs/bundler-plugin/vite` 导入；包根路径导出的是 Webpack 插件。

## 2. 导出原生 ESM 生命周期

从 `index.html` 直接引用的入口模块中导出 `bootstrap`、`mount` 和 `unmount`。框架实例应在 `mount` 中创建，在 `props.container` 内渲染，并在 `unmount` 中销毁。

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

实现生命周期时应遵循以下原则：

- 原生 ESM 导出即为生命周期约定，不应再将生命周期对象赋值给 `window`；
- `props.container` 属于当前微应用实例，应在该容器内查询 `#root` 或 `#app`，而不应使用页面级全局选择器；
- `__POWERED_BY_QIANKUN__` 用于避免入口模块在 qiankun 调用 `mount` 之前自行渲染；应用通过自身开发服务器独立运行时仍会立即渲染；
- 每次调用 `mount` 都必须创建完整的应用实例，每次调用 `unmount` 都必须彻底销毁该实例。重新挂载时，模块顶层代码不会再次执行。

完整的生命周期约定见[微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props)。

## 3. 保持原生模块入口

保留 Vite 常规的 HTML 结构和单个模块入口。挂载节点的 ID 必须与生命周期代码中的选择器一致：

```html
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
```

源码中无需手动添加 `entry` 属性。生产构建时，Vite 插件会将该属性添加到生成的入口脚本中。每份构建产物必须恰好包含一个带有该属性的脚本。

如果应用部署在子路径下，或资源通过独立域名提供，应配置 Vite 的 `base`，确保浏览器能够访问 `dist/index.html` 中生成的资源 URL。

## 4. 从主应用加载

将 Vite 开发服务器地址或生产环境部署地址配置为 `loadMicroApp` 的 `entry`，保存返回的实例句柄，并在移除容器之前卸载应用：

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

使用 `loadMicroApp` 时，无需同时配置 `registerMicroApps`，也无需显式调用 `start()`。React 和 Vue 主应用也可以使用对应的 [`<MicroApp>` 集成](/zh-CN/ecosystem/index)，由组件生命周期管理实例句柄。

## 5. 配置跨域部署

插件仅为 Vite 开发服务器和预览服务器启用 CORS。在生产环境中，服务器或 CDN 必须允许主应用所在的源获取以下资源：

- HTML 入口；
- JavaScript 模块和动态导入的代码块；
- CSS、图片以及应用引用的其他资源。

应从主应用页面测试最终资源 URL、重定向、MIME 类型和 CORS 响应头。如果应用请求需要携带 Cookie，则不能将 `Access-Control-Allow-Origin` 配置为通配符；需要同时做三件事：在服务端指定明确的允许来源、返回支持凭据的响应头，并在主应用侧配置自定义 [`fetch`](/zh-CN/api/configuration)。

## 6. 验证开发与生产环境

1. 单独运行 Vite 应用，确认应用在独立运行模式下能够正常渲染；
2. 运行主应用，以 `http://localhost:7101/` 为入口调用 `loadMicroApp`，确认应用渲染在传入的容器内；
3. 依次调用 `await microApp.unmount()` 和 `await microApp.mount()`，确认没有重复的根节点、监听器或残留界面；
4. 在 Vite 应用中执行 `npm run build`，检查 `dist/index.html`：应当恰好有一个生成的模块脚本带有 `entry` 属性；
5. 执行 `npm run preview`，将主应用入口指向预览服务器地址，并重复检查挂载与卸载过程；
6. 发布前，应分别在所有受支持的浏览器中，使用各主应用的实际源访问生产入口，确认应用能够正常加载。浏览器限制见[原生 ESM 支持](/zh-CN/concepts/esm-sandbox)。

## 相关内容

- [HTML 入口](/zh-CN/concepts/html-entry-loading)——入口约定与 CORS 要求
- [原生 ESM 支持](/zh-CN/concepts/esm-sandbox)——ESM 的运行行为与兼容性
- [`@qiankunjs/bundler-plugin`](/zh-CN/ecosystem/bundler-plugin)——插件参考
- [运行多个微应用实例](/zh-CN/cookbook/run-multiple-instances)——重新挂载与清理模式
- [接入 Webpack 应用](/zh-CN/cookbook/prepare-a-webpack-app)——Classic 脚本构建方案
