# Step 2 — Build the main app

The main app owns the page and the element where the micro-app will render. In this step, a small React component creates that element, calls `loadMicroApp`, and disposes of the returned instance during cleanup.

Keep the micro-app from [Step 1](/tutorial/build-the-micro-app) running at `http://localhost:7101`.

## Create the application

Return to the `qiankun-tutorial` directory, next to `sub-app`:

```bash
npm create vite@latest main-app -- --template react-ts
cd main-app
npm install
npm install qiankun@rc
```

## Fix the main-app port

Configure Vite to use port `7099`:

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

The main app does not need the qiankun bundler plugin. It loads micro-apps, but is not itself being loaded as one.

## Load and release one instance

Replace `src/App.tsx` with this component:

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
      void microApp.unload().catch((error: unknown) => {
        console.error('Failed to dispose of sub-app:', error);
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

This is the complete ownership relationship:

1. React creates the `<div>`, and the ref exposes it as an `HTMLElement`.
2. `loadMicroApp` loads `sub-app` from port `7101` into that element.
3. The returned `microApp` handle represents this instance. Its `mountPromise` can be observed for load failures.
4. When `MicroAppSlot` leaves the React tree, the effect cleanup calls `microApp.unload()` to unmount any mounted app and dispose of its generation.

The button is only there to make the lifecycle visible in the tutorial. In an application, the same component might be controlled by a tab, a dialog, a framework router, or any other product state.

::: warning Keep the handle and use it for cleanup
Retain the handle returned by `loadMicroApp` and call `unload()` when its owning component is destroyed. This disposes of the entire name/container generation and invalidates old handles sharing its configuration; loading again requests the entry and executes scripts afresh. Use `unmount()` when you only want to remove the app temporarily while keeping its cache for remounting.

React cleanup cannot return a Promise, so this example starts `unload()` and handles rejection. In host workflows that can wait, await the Promise before removing the container. If the handle was not retained, use `unloadMicroApp(name, container)` as described under [loadMicroApp](/api/load-micro-app#unload).
:::

## About route-driven orchestration

This tutorial deliberately lets React decide when the instance exists. If your architecture instead maps applications directly to URL rules, use [`registerMicroApps`](/api/register-micro-apps) and [`start`](/api/start). They are not required when using `loadMicroApp`.

Continue with [Step 3 — Connect, run, and verify](/tutorial/run-and-verify).
