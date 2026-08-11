# Prepare a Vite micro-app

qiankun v3 loads Vite applications as native ESM. The integration has one path: install the Vite plugin, export the micro-app lifecycles from the entry module, and load the app from the host with [`loadMicroApp`](/api/load-micro-app). No UMD wrapper, SystemJS transform, or global lifecycle object is needed.

::: tip Starting a new app?
The [Agent skill](/ecosystem/agent-skill) lets a coding agent generate this setup for you. This guide is for adapting an existing React or Vue application.
:::

## 1. Install and configure the plugin

Install the bundler plugin in the Vite application:

```bash
npm install --save-dev @qiankunjs/bundler-plugin@rc
```

Add `qiankun()` alongside the framework plugin and use a fixed development port:

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

The plugin takes no options. It provides the two pieces Vite needs for qiankun:

- Development and preview servers return permissive CORS headers, allowing the host to fetch the HTML entry and module graph.
- Production builds mark the entry module script with the single `entry` attribute expected by qiankun.

Import from `@qiankunjs/bundler-plugin/vite`; the package's bare import is the Webpack plugin.

## 2. Export native ESM lifecycles

Export `bootstrap`, `mount`, and `unmount` directly from the module referenced by `index.html`. Create the framework instance in `mount`, render inside `props.container`, and destroy it in `unmount`.

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

The important parts of this pattern are:

- Native ESM exports are the lifecycle contract. Do not assign the lifecycle object to `window`.
- `props.container` belongs to this micro-app instance. Query `#root` or `#app` inside it instead of using a page-global selector.
- `__POWERED_BY_QIANKUN__` prevents the entry from rendering itself when qiankun will call `mount`; the standalone development server still renders immediately.
- Every `mount` must create a usable application, and every `unmount` must completely reverse it. Top-level module code does not run again on remount.

See [Micro-app lifecycle and props](/concepts/lifecycle-and-props) for the complete contract.

## 3. Keep index.html as a native module entry

Keep the normal Vite HTML structure with one module entry. The mount-node id must match the selector used by your lifecycle code:

```html
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
```

You do not need to add `entry` to the source file. During production builds, the Vite plugin adds it to the generated entry script. The built HTML must contain no more than one script carrying that attribute.

If the application is deployed below a path or on a separate asset origin, configure Vite's `base` so the URLs emitted into `dist/index.html` are reachable from the browser.

## 4. Load it from the host

Pass the Vite server or deployment URL to `loadMicroApp`, keep the returned handle, and unmount it before removing the container:

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

// When the host view is disposed:
await microApp.unmount();
```

`loadMicroApp` does not require `registerMicroApps` or an explicit `start()` call. React and Vue hosts may instead use their [`<MicroApp>` integrations](/ecosystem/index), which manage the same handle with the component lifecycle.

## 5. Configure cross-origin deployment

The plugin enables CORS only for Vite's development and preview servers. In production, the server or CDN must allow the host origin to fetch:

- the HTML entry;
- JavaScript modules and dynamically imported chunks;
- CSS, images, and other assets referenced by the app.

Test the final asset URLs, redirects, MIME types, and CORS headers from the host page. If the app requires cookies, a wildcard `Access-Control-Allow-Origin` is not sufficient; configure an explicit origin, credential-aware headers, and the host's custom [`fetch`](/api/configuration) together.

## 6. Verify development and production

1. Run the Vite app by itself and confirm the standalone branch renders.
2. Run the host, call `loadMicroApp` with `http://localhost:7101/`, and confirm the app renders inside the supplied container.
3. Call `await microApp.unmount()` and then `await microApp.mount()`; confirm there are no duplicated roots, listeners, or stale views.
4. Run `npm run build` in the Vite app and inspect `dist/index.html`: exactly one generated module script should have the `entry` attribute.
5. Run `npm run preview`, point the host at the preview URL, and repeat the mount/unmount check.
6. Before release, test the deployed entry from every supported browser and host origin. See [Native ESM support](/concepts/esm-sandbox) for browser constraints.

## Related

- [HTML entry](/concepts/html-entry-loading) — the entry contract and CORS boundaries
- [Native ESM support](/concepts/esm-sandbox) — observable ESM behavior and compatibility
- [`@qiankunjs/bundler-plugin`](/ecosystem/bundler-plugin) — plugin reference
- [Run multiple instances](/cookbook/run-multiple-instances) — remounting and cleanup patterns
- [Prepare a Webpack app](/cookbook/prepare-a-webpack-app) — the Classic-build alternative
