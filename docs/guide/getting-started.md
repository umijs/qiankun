# Getting started

This guide creates and runs a main app and a micro-app with the official [Agent skill](/ecosystem/agent-skill). The main app controls the micro-app directly with `loadMicroApp`.

You need Node.js `>=20.19`, npm, and a modern Chromium-based browser or Safari (see [Browser support](/guide/browser-support) for the full requirements).

## Create and run the applications

From an empty working directory, install the skill, then have your coding agent (Claude Code, Cursor, …) create the two projects:

```bash
mkdir qiankun-demo
cd qiankun-demo
npx skills add umijs/qiankun
```

Describe the goal to the agent, for example:

> Use qiankun to create a React + TypeScript main app named main-app (port 7099, loading the micro-app with loadMicroApp) and a React + TypeScript micro-app named sub-app (port 7101)

If you are not working with an agent, follow the [tutorial](/tutorial/) to build the same structure by hand — the rest of this page applies either way.

Once the projects exist, start them in two terminals, both opened from `qiankun-demo`:

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

For the skill's installation details, coverage, and what it generates, see [Agent skill](/ecosystem/agent-skill).

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

- Build the same setup step by step in the [tutorial](/tutorial/).
- Learn the application contract in [Lifecycle and props](/concepts/lifecycle-and-props).
- Prepare an existing [Vite](/cookbook/prepare-a-vite-app) or [Webpack](/cookbook/prepare-a-webpack-app) application.
- See every option and method in the [`loadMicroApp` API](/api/load-micro-app).
