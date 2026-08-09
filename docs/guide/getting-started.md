# Getting started

This guide uses the official `create-qiankun` scaffolder to run a main app and a micro-app. The main app controls the micro-app directly with `loadMicroApp`.

You need Node.js `>=20.19`, npm, and a modern Chromium-based browser or Safari (see [Browser support](/guide/browser-support) for the full requirements).

## Create and run the applications

From an empty working directory, create the two projects:

```bash
mkdir qiankun-demo
cd qiankun-demo
npx create-qiankun@latest main-app --type main
npx create-qiankun@latest sub-app --template react-ts
```

Start them in two terminals, both opened from `qiankun-demo`:

::: code-group

```bash [micro-app]
cd sub-app
npm install
npm run dev
# http://localhost:7101
```

```bash [main app]
cd main-app
npm install
npm run dev
# http://localhost:7099
```

:::

Open **http://localhost:7099**. The page now contains the independently served micro-app. You can also open **http://localhost:7101** to confirm that the micro-app still runs by itself.

For interactive prompts, Vue templates, pnpm or Yarn alternatives, and generated-file details, see the [`create-qiankun` reference](/ecosystem/create-qiankun).

::: warning Firefox and ESM applications
The ESM sandbox depends on dynamically injected import maps, which Firefox does not currently support. Use a Chromium-based browser or Safari for this guide. Classic micro-apps are unaffected.
:::

## How the main app controls the micro-app

The generated main app runs on port `7099`. Its `App.tsx` follows this pattern after React has created the container element:

```tsx
import { loadMicroApp } from 'qiankun';
import { useEffect, useRef } from 'react';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const microApp = loadMicroApp({
      name: 'sub-app',
      entry: '//localhost:7101',
      container,
    });

    return () => {
      void microApp.unmount().catch((error: unknown) => {
        console.error('Failed to unmount sub-app:', error);
      });
    };
  }, []);

  return <div ref={containerRef} />;
}
```

The application description has three required fields:

| Field | Purpose |
| --- | --- |
| `name` | Identifies this micro-app. |
| `entry` | Points to its HTML entry; here, the server on port `7101`. |
| `container` | The `HTMLElement` that receives the micro-app. |

`loadMicroApp` returns a `MicroApp` handle. Keep that handle for as long as the instance is in use and call `unmount()` during cleanup. This lets qiankun run the micro-app's `unmount` lifecycle and release the instance cleanly. React effect cleanup cannot return a Promise, so the example starts unmounting and attaches a rejection handler; in an async host flow, await `unmount()` before removing the container.

## What the micro-app provides

The generated micro-app is an ordinary Vite application with two additions:

- `@qiankunjs/bundler-plugin` prepares its HTML entry and development server for qiankun.
- Its entry module exports `bootstrap`, `mount`, and `unmount`. `mount` renders inside the container supplied by the main app, and `unmount` destroys the framework root.

The standalone branch renders the same application when it is opened directly on port `7101`. You therefore keep independent development while also making the app loadable by a main app.

## Route-driven applications

`loadMicroApp` is the primary API when application code decides when an instance exists. If activation should instead be derived entirely from the current URL, use [`registerMicroApps`](/api/register-micro-apps) together with [`start`](/api/start). You do not need either API for the flow on this page.

## Next steps

- Build the same setup without a scaffolder in the [manual tutorial](/tutorial/).
- Learn the application contract in [Lifecycle and props](/concepts/lifecycle-and-props).
- Prepare an existing [Vite](/cookbook/prepare-a-vite-app) or [Webpack](/cookbook/prepare-a-webpack-app) application.
- See every option and method in the [`loadMicroApp` API](/api/load-micro-app).
