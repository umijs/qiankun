# 第 1 步：搭建微应用

qiankun 微应用仍是标准的前端应用，但入口模块需要额外导出生命周期函数，供主应用执行挂载和卸载。

本教程使用 React 和 Vite。Vue 或 Webpack 的接入方式请参阅[接入 Vite 应用](/zh-CN/cookbook/prepare-a-vite-app)或[接入 Webpack 应用](/zh-CN/cookbook/prepare-a-webpack-app)。

## 创建应用

在 `qiankun-tutorial` 目录中执行：

```bash
npm create vite@latest sub-app -- --template react-ts
cd sub-app
npm install
npm install --save-dev @qiankunjs/bundler-plugin@rc
```

## 配置 Vite

添加 qiankun 插件，并为开发服务器设置固定端口：

```ts [sub-app/vite.config.ts]
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

该插件负责为 qiankun 配置 Vite 入口，并放开跨域限制，让运行在 `7099` 端口的主应用能够请求它。启用 `strictPort` 后，如果端口已被占用，Vite 将直接报告错误，而不会自动改用其他端口。否则 Vite 悄悄换了端口后，主应用仍会请求 `7101`，导致加载失败。

## 导出生命周期函数

用下面的入口替换 `src/main.tsx`：

```tsx [sub-app/src/main.tsx]
import { StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import App from './App';
import './index.css';

type AppProps = {
  container?: HTMLElement;
};

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
  }
}

let root: Root | undefined;

function findRoot(props: AppProps): Element | null {
  return props.container?.querySelector('#root') ?? document.getElementById('root');
}

function render(props: AppProps = {}) {
  const element = findRoot(props);
  if (!element) return;

  root = createRoot(element);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

export async function bootstrap() {
  return Promise.resolve();
}

export async function mount(props: AppProps) {
  render(props);
}

export async function unmount(props: AppProps) {
  root?.unmount();
  root = undefined;

  const element = findRoot(props);
  if (element) element.innerHTML = '';
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
```

入口模块应遵循以下约定：

- `mount` 在 `props.container` 内渲染；该值由 qiankun 传入，是一个 `HTMLElement`。
- `unmount` 销毁 React 根节点并释放引用，确保应用能够再次挂载。
- 应用不由 qiankun 加载时，入口末尾的分支会将内容渲染到自身的 `#root`，使微应用仍可独立运行。
- 入口是原生 ESM 模块，qiankun 会直接读取模块导出，无需把这些函数挂到 `window` 上。

Vite 默认的 `index.html` 已经包含 `<div id="root"></div>`，HTML 无需再做改动。

## 检查独立运行模式

启动服务器：

```bash
npm run dev
```

访问 **http://localhost:7101**，确认应用可以正常渲染。保持开发服务器运行，然后继续[第 2 步：搭建主应用](/zh-CN/tutorial/build-the-main-app)。

完整的生命周期契约、props 和可选的 `update` 生命周期，请参阅[微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props)。
