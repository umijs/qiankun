# 第 2 步：搭建主应用

主应用拥有页面，以及微应用将要渲染到的元素。本步骤会用一个精简的 React 组件创建这个元素、调用 `loadMicroApp`，并在清理时卸载返回的实例。

请保持[第 1 步](/zh-CN/tutorial/build-the-micro-app)中的微应用运行在 `http://localhost:7101`。

## 创建应用

回到 `qiankun-tutorial` 目录，在 `sub-app` 旁边创建主应用：

```bash
pnpm create vite@latest main-app --template react-ts
cd main-app
pnpm install
pnpm add qiankun
```

## 固定主应用端口

配置 Vite 使用 `7099` 端口：

```ts [main-app/vite.config.ts]
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 7099,
    strictPort: true,
  },
});
```

主应用不需要 qiankun bundler plugin。它负责加载微应用，但自身不会作为微应用被加载。

## 加载并释放一个实例

用下面的组件替换 `src/App.tsx`：

```tsx [main-app/src/App.tsx]
import { loadMicroApp } from 'qiankun';
import { useEffect, useRef, useState } from 'react';

function MicroAppSlot() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const microApp = loadMicroApp({
      name: 'sub-app',
      entry: '//localhost:7101',
      container,
    });

    void microApp.mountPromise.catch((error: unknown) => {
      console.error('Failed to mount sub-app:', error);
    });

    return () => {
      void microApp.unmount().catch((error: unknown) => {
        console.error('sub-app 卸载失败：', error);
      });
    };
  }, []);

  return <div ref={containerRef} />;
}

export default function App() {
  const [visible, setVisible] = useState(true);

  return (
    <main>
      <h1>Main app</h1>
      <button type="button" onClick={() => setVisible((value) => !value)}>
        {visible ? 'Unmount' : 'Mount'} micro-app
      </button>
      {visible && <MicroAppSlot />}
    </main>
  );
}
```

完整的所有权关系如下：

1. React 创建 `<div>`，ref 将它作为 `HTMLElement` 提供给代码。
2. `loadMicroApp` 从 `7101` 端口加载 `sub-app`，并把它挂载进这个元素。
3. 返回的 `microApp` 句柄代表这个实例。可以通过它的 `mountPromise` 观察加载失败。
4. `MicroAppSlot` 离开 React 组件树时，effect 的清理函数会在丢弃实例前调用 `microApp.unmount()`。

这个按钮只用于在教程中直观展示生命周期。在实际应用中，同一个组件可以由标签页、弹窗、框架路由或其他业务状态控制。

::: warning 始终保留并卸载句柄
调用 `loadMicroApp` 后如果不保留返回值，主应用就无法可靠地释放这个实例。每次调用都应当在所属组件的清理路径中配对调用一次 `unmount()`。

React 清理函数不能返回 Promise，因此本例会启动 `unmount()` 并处理 rejection。主应用流程可以等待时，应在移除容器前等待这个 Promise。
:::

## 路由驱动的编排方式

本教程由 React 决定实例何时存在。如果你的架构需要把应用直接映射到 URL 规则，可以使用 [`registerMicroApps`](/zh-CN/api/register-micro-apps) 和 [`start`](/zh-CN/api/start)。使用 `loadMicroApp` 时不需要它们。

继续[第 3 步：连接、运行并验证](/zh-CN/tutorial/run-and-verify)。
