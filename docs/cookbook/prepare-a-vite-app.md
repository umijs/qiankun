# Wire a Vite app into qiankun

This page covers turning an existing Vite app into a qiankun micro-app. qiankun v3 loads Vite apps natively through the [ESM sandbox](/concepts/esm-sandbox) — development and production run the same native `<script type="module">` dependency graph, with no SystemJS and no legacy transform. There are only a few things to do: install the Vite plugin, export the lifecycles, adjust `index.html` and the dev server, and account for a handful of behavioral differences under the ESM sandbox.

::: tip Starting fresh is easier
If you're creating a new app rather than converting an existing one, [create-qiankun](/ecosystem/create-qiankun) generates this wiring for you. For Webpack apps, see [Wire a Webpack app into qiankun](/cookbook/prepare-a-webpack-app).
:::

## Install the Vite plugin

Install the bundler plugin as a dev dependency, then register the Vite plugin alongside your framework plugin.

```bash
pnpm add -D @qiankunjs/bundler-plugin
```

::: code-group

```ts [vite.config.ts (React)]
import { qiankun } from '@qiankunjs/bundler-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), qiankun()],
  server: {
    port: 7100,
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

`qiankun()` takes no arguments and does only two things:

- **Enables CORS for dev and preview.** It sets `server.cors` / `preview.cors` to `true` and adds `Access-Control-Allow-Origin: *`, so the host app can fetch the entry HTML and the full module graph across origins. You don't have to add CORS headers yourself.
- **Marks the entry at build time.** When you run `vite build`, it stamps an `entry` attribute onto the entry `<script type="module">` in the emitted `index.html` (see below). During dev serve it does nothing — the ESM engine identifies the entry by its lifecycle exports, and Vite strips unknown HTML attributes during dev anyway.

::: warning Get the import path right
The Vite plugin lives only under the `/vite` subpath: `import { qiankun } from '@qiankunjs/bundler-plugin/vite'`. Importing the bare `@qiankunjs/bundler-plugin` gives you the Webpack plugin. This plugin takes no options — don't pass `entry`, `libraryName`, or anything like that.
:::

## Export the lifecycles from the entry

qiankun drives every micro-app through three lifecycle functions. Under the ESM sandbox, your native `export`s **are** the lifecycles — there's no UMD or window-library wrapper. Render into `props.container` (the element qiankun provides at mount) and keep a standalone branch so the app can still run on its own dev server.

::: code-group

```tsx [src/main.tsx (React)]
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
    [key: string]: unknown;
  }
}

let root: ReactDOM.Root | undefined;

function render(props: { container?: Element } = {}) {
  // Resolve the mount node inside the qiankun-provided container,
  // falling back to the global document when running standalone.
  const container = props.container?.querySelector('#root') ?? document.getElementById('root');
  if (!container) return;

  root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

export async function bootstrap() {}

export async function mount(props: { container?: Element }) {
  render(props);
}

export async function unmount(_props: { container?: Element }) {
  root?.unmount();
  root = undefined;
}

if (window.__POWERED_BY_QIANKUN__) {
  // classic-mode fallback: expose lifecycles on window under the registered app name
  window['react'] = { bootstrap, mount, unmount };
} else {
  render();
}
```

```ts [src/main.ts (Vue)]
import { createApp } from 'vue';
import App from './App.vue';

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
    [key: string]: unknown;
  }
}

let app: ReturnType<typeof createApp> | undefined;

function render(props: { container?: Element } = {}) {
  const container = props.container?.querySelector('#app') ?? document.getElementById('app');
  if (!container) return;

  app = createApp(App);
  app.mount(container);
}

export async function bootstrap() {}

export async function mount(props: { container?: Element }) {
  render(props);
}

export async function unmount(_props: { container?: Element }) {
  app?.unmount();
  app = undefined;
}

if (window.__POWERED_BY_QIANKUN__) {
  window['vue'] = { bootstrap, mount, unmount };
} else {
  render();
}
```

:::

A few things worth spelling out about this pattern:

- **`props.container`** is the element qiankun mounts into. Look up your mount node inside it (`container.querySelector('#root')`) so the same code works both when hosted and when running standalone. The React/Webpack examples use `#root`, Vue uses `#app` — target whichever id you declare in your `index.html`.
- **`window.__POWERED_BY_QIANKUN__`** is injected by qiankun when the app runs inside the sandbox. Use it to decide whether to run the standalone `render()`, so a hosted app doesn't mount itself twice.
- **The `window[name] = { bootstrap, mount, unmount }` assignment is an optional classic-mode fallback.** Under the ESM sandbox the native exports are the primary source of the lifecycles; you can keep this line as a safety net, but it isn't what the ESM engine actually reads. If you keep it, the qiankun `name` you register with must match this window key.
- **`unmount` must tear everything down completely** (`root.unmount()` / `app.unmount()`, and null out the reference). Leaked instances break remount and multi-instance scenarios. See [Run multiple micro-app instances](/cookbook/run-multiple-instances).

For the full lifecycle contract and the shape of `props`, see [Micro-app lifecycles and props](/concepts/lifecycle-and-props).

## Configure index.html

Declare a mount node and one entry module script. In your source `index.html`, stamp the `entry` attribute onto the entry `<script>`.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React micro app · qiankun</title>
    <style>
      /* standalone-only page background; inside qiankun the host owns the page */
      body {
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx" entry></script>
  </body>
</html>
```

Two things to understand about the `entry` attribute:

- `type="module"` routes the script through the **ESM sandbox**. A classic `<script>` (without `type="module"`) takes a different `with(proxy)` path.
- The `entry` attribute marks the single script that carries the lifecycles. During **dev**, Vite strips this attribute it doesn't recognize — that's fine, because the ESM engine picks the entry by its lifecycle exports. In **production**, `qiankun()` adds `entry` back onto the built script. Marking it in source keeps the two paths symmetric.

::: danger Only one entry allowed
There can be only one script with the `entry` attribute. The loader throws `QiankunError` the moment it finds more than one. Non-entry scripts load as usual.
:::

You also need to pin the dev server port with `strictPort: true` (already set in the configs above). The host references your app by a fixed URL, and the port can't drift:

```ts
// examples/main/src/apps.ts — how the host references this app
{ name: 'react', path: '/react', entry: '//localhost:7100' }
```

The `entry` in `registerMicroApps` is the string URL of your app's `index.html` (here, the dev server root). For the host-side setup, see [registerMicroApps](/api/register-micro-apps).

## Vue: declare feature flags in two places

Vue's esm-bundler build reads compile-time feature flags like `__VUE_OPTIONS_API__`. Because Vite 8 prebundles dependencies with **rolldown** (not esbuild), and `config.define` doesn't reach that prebundling step, you have to declare these flags in **both** `define` and `optimizeDeps.rolldownOptions.transform.define`.

```ts [vite.config.ts (Vue)]
import { qiankun } from '@qiankunjs/bundler-plugin/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// Vue's recommended esm-bundler feature flags: https://link.vuejs.org/feature-flags
const vueFeatureFlags = {
  __VUE_OPTIONS_API__: 'true',
  __VUE_PROD_DEVTOOLS__: 'false',
  __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
};

export default defineConfig({
  define: vueFeatureFlags,
  // config.define does not reach dep prebundling; pass the flags to rolldown too
  // (Vite 8 prebundles with rolldown; esbuildOptions is deprecated).
  optimizeDeps: {
    rolldownOptions: {
      transform: {
        define: vueFeatureFlags,
      },
    },
  },
  plugins: [vue(), qiankun()],
  server: { port: 7101, strictPort: true },
});
```

This is Vue esm-bundler best practice in its own right, unrelated to qiankun. As a safety net, qiankun's ESM sandbox also binds these double-underscore feature flags dynamically at runtime, so flags written to the real global stay visible to modules inside the sandbox. But declaring them at build time is still the right way to do it.

## ESM-sandbox behaviors to account for

The ESM sandbox faithfully runs your native module graph, but a few semantics differ from a classic bundled micro-app. Design around them.

### Build app state in mount(), not at module top level

On remount, qiankun reruns `mount(props)` but does **not** rerun the module's top-level code. Each module's blob URL is reused, so `import(sameBlobUrl)` returns the same namespace — top-level statements execute only once. This lines up with how modern frameworks are written anyway: build the app instance in `mount()`, tear it down in `unmount()`.

```ts
// Do this — the app is created per mount, torn down per unmount.
let app: ReturnType<typeof createApp> | undefined;
export async function mount(props) {
  app = createApp(App);
  app.mount(resolveContainer(props));
}
export async function unmount() {
  app?.unmount();
  app = undefined;
}
```

```ts
// Avoid this — the instance is created once at module load and cannot
// be recreated on the second mount.
const app = createApp(App); // runs only on the first load
export async function mount(props) {
  app.mount(resolveContainer(props));
}
```

::: warning Remount differs between classic and ESM
This differs from the classic sandbox, which reruns the entire entry script on every remount. Code that relied on top-level side effects re-executing on each mount needs that logic moved into `mount()`.
:::

### HMR is off under qiankun

When your Vite app runs inside qiankun, Vite's HMR client (`/@vite/client`) is stubbed out. `import.meta.hot` is a callable noop, so `accept()` calls don't throw, but no HMR WebSocket is actually opened. This is deliberate: the real client's socket would connect from inside the sandbox and could trigger a destructive full-page `location.reload()`. During development, just refresh the page manually after changing code. Running standalone (outside qiankun), HMR works as usual.

### Bare specifiers must be resolvable

The ESM engine resolves every `import` specifier itself. A bare specifier like `import x from 'lodash-es'` must be resolvable through **your app's own `<script type="importmap">`**, or written as a URL-form specifier (`./`, `../`, `/`, or an absolute URL). If neither holds, resolution throws `QiankunError` ("failed to resolve the bare specifier … no import map entry found"). A normal Vite build already bundles every dependency into a relative or absolute URL, so this mainly affects apps with a hand-written import map.

::: info Import maps are isolated per app
qiankun resolves your app's import map on its own and never merges it into the host document. Only the `imports` field is honored; `scopes` is parsed, warned about, and then ignored in v1.
:::

### Typed imports are pass-through in v1

Import attributes — `import data from './x.json' with { type: 'json' }`, CSS module imports, WASM — are native pass-through in v1: they map straight back to the original URL for the browser to load, with **no instance isolation**, plus a one-time `console.warn`. This requires the sub-app server to return the correct MIME type and CORS headers. For typed **dynamic** imports, relative specifiers resolve against the internal blob URL — a known v1 limitation, so use absolute URLs in that case.

## Verify

1. Run the app standalone (`vite`) and confirm it renders on its own port. The `__POWERED_BY_QIANKUN__` branch takes the standalone `render()` path.
2. Register it in the host with an `entry` pointing at the dev server URL, then `start()`. For the host-side wiring, see [Getting started](/guide/getting-started) and the [tutorial](/tutorial/index).
3. Navigate to the app's route and confirm `mount` runs and the content renders into the host container; then navigate away and confirm `unmount` tears it down cleanly.

::: warning Firefox and dynamically injected import maps
The ESM sandbox injects the import map at runtime, and Firefox doesn't enable that by default (`dom.multiple_import_maps.enabled` is off through the Firefox 150 line). Chrome/Edge 133+ and Safari 18.4+ support it natively. To make it work on Firefox, you need es-module-shims as a supported base layer. See [ESM sandbox](/concepts/esm-sandbox) for details.
:::

## Related

- [ESM sandbox](/concepts/esm-sandbox) — how native modules run through the isolation membrane
- [@qiankunjs/bundler-plugin](/ecosystem/bundler-plugin) — full reference for the Vite and Webpack plugins
- [Micro-app lifecycles and props](/concepts/lifecycle-and-props) — the lifecycle contract
- [Wire a Webpack app into qiankun](/cookbook/prepare-a-webpack-app) — the classic-path equivalent
- [Enable CSS style isolation](/cookbook/enable-style-isolation) — scope styles per app
