# 第 1 步：搭建微应用

qiankun 微应用仍然是一个普通前端应用。它的入口模块额外提供生命周期函数，让主应用能够挂载和卸载它。

本教程使用 React 和 Vite。Vue 或 Webpack 的接入方式请参阅[改造 Vite 应用](/zh-CN/cookbook/prepare-a-vite-app)或[改造 Webpack 应用](/zh-CN/cookbook/prepare-a-webpack-app)。

## 创建应用

在 `qiankun-tutorial` 目录中执行：

```bash
pnpm create vite@latest sub-app --template react-ts
cd sub-app
pnpm install
pnpm add -D @qiankunjs/bundler-plugin
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

这个插件为 qiankun 准备 Vite 入口，并允许来自 `7099` 端口主应用的跨域请求。`strictPort` 可以避免 Vite 在端口被占用时自动切换地址，导致主应用仍然请求原来的端口。

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

需要关注的是这些对外行为：

- `mount` 在 `props.container` 内渲染，qiankun 提供的这个值是一个 `HTMLElement`。
- `unmount` 销毁 React 根节点并释放引用，使应用可以再次挂载。
- qiankun 不存在时，最后的分支会渲染到应用自己的 `#root`，从而保留独立开发能力。
- Vite 的原生 ESM 入口直接使用模块导出的生命周期，不需要把它们再挂到 `window` 上。

Vite 默认的 `index.html` 已经包含 `<div id="root"></div>`，无需修改其他 HTML。

## 检查独立运行模式

启动服务器：

```bash
pnpm dev
```

打开 **http://localhost:7101**，确认应用可以正常渲染。保持这个服务器运行，然后继续[第 2 步：搭建主应用](/zh-CN/tutorial/build-the-main-app)。

完整的生命周期契约、props 和可选的 `update` 生命周期，请参阅[生命周期与 props](/zh-CN/concepts/lifecycle-and-props)。
