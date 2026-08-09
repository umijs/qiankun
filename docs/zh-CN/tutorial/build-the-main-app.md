# 第 2 步：搭建主应用

主应用负责页面外壳，并提供用于渲染微应用的元素。本步骤使用一个精简的 React 组件创建该元素、调用 `loadMicroApp`，并在组件清理时卸载对应实例。

开始前，请确保[第 1 步](/zh-CN/tutorial/build-the-micro-app)创建的微应用仍运行在 `http://localhost:7101`。

## 创建应用

回到 `qiankun-tutorial` 目录，在 `sub-app` 旁边创建主应用：

```bash
npm create vite@latest main-app -- --template react-ts
cd main-app
npm install
npm install qiankun@rc
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

主应用无需安装 qiankun 构建插件。该应用负责加载微应用，自身不会作为微应用被其他应用加载。

## 加载并卸载一个实例

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
      console.error('sub-app 挂载失败：', error);
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
      <h1>主应用</h1>
      <button type="button" onClick={() => setVisible((value) => !value)}>
        {visible ? '卸载微应用' : '挂载微应用'}
      </button>
      {visible && <MicroAppSlot />}
    </main>
  );
}
```

各部分的职责如下：

1. React 创建 `<div>`，并通过 ref 取得对应的 `HTMLElement`。
2. `loadMicroApp` 从 `7101` 端口加载 `sub-app`，并将其挂载到该元素。
3. 返回的 `microApp` 句柄对应当前实例。主应用可通过 `mountPromise` 处理挂载失败。
4. `MicroAppSlot` 从 React 组件树中卸载时，`useEffect` 的清理函数会调用 `microApp.unmount()` 卸载实例。

示例中的按钮仅用于演示生命周期。在实际应用中，组件的挂载状态通常由标签页、弹窗、框架路由或其他业务状态决定。

::: warning 保留句柄，并用它完成卸载
如果未保留 `loadMicroApp` 的返回值，主应用就没有办法再卸载该实例。每次调用 `loadMicroApp` 后，都应在所属组件销毁时调用一次 `unmount()`。

React 清理函数不能返回 Promise，因此本例只是发起 `unmount()` 调用，并捕获可能的失败。如果主应用的清理流程支持异步等待，则应在移除容器前等待该 Promise 完成。
:::

## 路由驱动的编排方式

在本教程中，实例的创建和销毁由 React 组件树驱动。如果应用需要根据 URL 规则自动激活，可使用 [`registerMicroApps`](/zh-CN/api/register-micro-apps) 和 [`start`](/zh-CN/api/start)。使用 `loadMicroApp` 时无需调用这两个 API。

继续[第 3 步：运行并验证](/zh-CN/tutorial/run-and-verify)。
