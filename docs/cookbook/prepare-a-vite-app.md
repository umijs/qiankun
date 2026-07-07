# Make a Vite app qiankun-ready

This guide turns an existing Vite app into a qiankun micro-app. qiankun v3 loads Vite apps natively through its [ESM sandbox](/concepts/esm-sandbox) — the same native `<script type="module">` graph runs in both dev and production, with no SystemJS or legacy transform. The steps below are: add the Vite plugin, export the lifecycles, adjust `index.html` and the dev server, and respect a few ESM-sandbox behaviors.

::: tip Prefer a fresh start
If you are scaffolding a new app rather than adapting an existing one, [create-qiankun](/ecosystem/create-qiankun) generates this wiring for you. For a Webpack app, see [Make a Webpack app qiankun-ready](/cookbook/prepare-a-webpack-app).
:::

## Add the Vite plugin

Install the bundler plugin as a dev dependency and register the Vite plugin alongside your framework plugin.

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

`qiankun()` is zero-argument and does exactly two things:

- **CORS for dev and preview.** It sets `server.cors` / `preview.cors` to `true` and adds `Access-Control-Allow-Origin: *`, so the main app can fetch the entry HTML and the module graph cross-origin. You do not add CORS headers yourself.
- **Entry marking at build time.** On `vite build` it marks the entry `<script type="module">` in the emitted `index.html` with the `entry` attribute (see below). During dev serve it does nothing — the ESM engine resolves the entry by its lifecycle exports, and Vite strips unknown HTML attributes at dev time anyway.

::: warning Import path matters
The Vite plugin lives only at the `/vite` subpath: `import { qiankun } from '@qiankunjs/bundler-plugin/vite'`. The bare `@qiankunjs/bundler-plugin` import resolves to the Webpack plugin. The plugin takes no options — do not pass `entry`, `libraryName`, or similar.
:::

## Export the lifecycles from your entry

qiankun drives each micro-app through three lifecycle functions. Under the ESM sandbox your native `export`s **are** the lifecycles — nothing is wrapped in a UMD or window library. Render into `props.container` (the element qiankun provides at mount time), and keep a standalone branch so the app still runs on its own dev server.

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

Notes on this pattern:

- **`props.container`** is the element qiankun mounts into. Locate your mount node inside it (`container.querySelector('#root')`) so the same code works hosted and standalone. React/Webpack demos use `#root`, Vue uses `#app` — match whatever id your `index.html` declares.
- **`window.__POWERED_BY_QIANKUN__`** is set by qiankun at runtime inside the sandbox. Use it to gate the standalone `render()` call so the app does not double-mount when hosted.
- **The `window[name] = { bootstrap, mount, unmount }` assignment is an optional classic-mode fallback.** Under the ESM sandbox the native exports are the primary lifecycle source; you can keep the assignment for resilience, but it is not what the ESM engine reads. The registered qiankun `name` must match the window key if you keep it.
- **`unmount` must fully tear down** (`root.unmount()` / `app.unmount()` and null the reference). Leaked instances break remount and multi-instance scenarios. See [Run multiple micro-app instances](/cookbook/run-multiple-instances).

For the full lifecycle contract and the shape of `props`, see [Micro-app lifecycle and props](/concepts/lifecycle-and-props).

## Set up index.html

Declare a mount node and an entry module script. In your source `index.html`, mark the entry `<script>` with the `entry` attribute.

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

- `type="module"` routes the script through the **ESM sandbox**. A classic `<script>` (no `type="module"`) would take the classic `with(proxy)` path instead.
- The `entry` attribute names the single lifecycle-bearing script. In **dev**, Vite strips this unknown attribute, and that is fine — the ESM engine picks the entry by its lifecycle exports. In **production**, `qiankun()` re-adds `entry` to the built script. Marking it in source keeps the two paths symmetric.

::: danger One entry only
Exactly one script may carry the `entry` attribute. The loader throws `QiankunError` if it finds more than one. Non-entry scripts load normally.
:::

Also set a fixed dev-server port with `strictPort: true` (shown in the config above). The main app references your app by a fixed URL, so the port must not drift:

```ts
// examples/main/src/apps.ts — how the host references this app
{ name: 'react', path: '/react', entry: '//localhost:7100' }
```

`entry` in `registerMicroApps` is the string URL of your app's `index.html` (here, the dev-server root). See [registerMicroApps](/api/register-micro-apps) for the host side.

## Vue: define feature flags in two places

Vue's esm-bundler build reads compile-time feature flags such as `__VUE_OPTIONS_API__`. Because Vite 8 prebundles dependencies with **rolldown** (not esbuild), and `config.define` does not reach that prebundle step, you must declare the flags in **both** `define` and `optimizeDeps.rolldownOptions.transform.define`.

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

This is Vue's own esm-bundler best practice, independent of qiankun. As a safety net, the qiankun ESM sandbox also binds these dunder feature flags live at runtime, so a flag written into the real global stays visible to the sandboxed module. Defining them at build time is still the correct primary path.

## ESM-sandbox behaviors to respect

The ESM sandbox runs your native module graph faithfully, but a few semantics differ from a classic bundled micro-app. Design around them.

### Create app state inside mount(), not at module top level

On remount, qiankun re-runs `mount(props)` but **not** the module's top-level code. Each module's blob URL is reused, so `import(sameBlobUrl)` returns the same namespace — top-level statements execute exactly once. This matches modern framework style: build your app instance inside `mount()`, tear it down in `unmount()`.

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

::: warning Classic vs ESM remount
This differs from the classic sandbox, which re-executes the entire entry script on every remount. Code that relied on top-level side effects running again per mount must move that work into `mount()`.
:::

### HMR is disabled under qiankun

When your Vite app runs inside qiankun, Vite's HMR client (`/@vite/client`) is stubbed. `import.meta.hot` is a working noop, so `accept()` calls never throw, but no HMR WebSocket opens. This is deliberate: the real client's socket would connect from inside the sandbox and could trigger a destructive full-page `location.reload()`. During development, edit and reload the page manually. Standalone (outside qiankun), HMR works as usual.

### Bare specifiers must be resolvable

The ESM engine resolves every `import` specifier itself. A bare specifier such as `import x from 'lodash-es'` must be resolvable via **your app's own `<script type="importmap">`** or written as a URL-like specifier (`./`, `../`, `/`, or an absolute URL). If neither applies, resolution throws `QiankunError` ("failed to resolve the bare specifier … no import map entry found"). In a normal Vite build every dependency is already bundled to relative/absolute URLs, so this mainly affects apps that ship hand-written import maps.

::: info Import maps are per-app and isolated
qiankun parses your app's import map itself and never merges it into the host document. Only the `imports` field is honored; `scopes` is parsed, warned about, and ignored in v1.
:::

### Typed imports are v1 passthrough

Import attributes — `import data from './x.json' with { type: 'json' }`, CSS module imports, WASM — are passed through natively in v1: mapped straight to the original URL and loaded by the browser **without instance isolation**, with a one-time `console.warn`. That requires the sub-app server to send the correct MIME type and CORS headers. For typed **dynamic** imports, relative specifiers resolve against the internal blob URL, which is a known v1 limitation — use absolute URLs there.

## Verify

1. Run your app standalone (`vite`) and confirm it renders on its own port. The `__POWERED_BY_QIANKUN__` branch takes the standalone `render()` path.
2. Register it in the main app with `entry` pointing at the dev-server URL, then `start()`. See [Getting started](/guide/getting-started) and the [Tutorial](/tutorial/index) for the host wiring.
3. Navigate to the app's route and confirm `mount` runs and it renders into the host container; navigate away and confirm `unmount` tears it down cleanly.

::: warning Firefox and dynamically injected import maps
The ESM sandbox injects an import map at runtime, which Firefox does not enable by default (`dom.multiple_import_maps.enabled` is off through the Firefox 150 branch). Chrome/Edge 133+ and Safari 18.4+ support it natively. For guaranteed Firefox support you need es-module-shims as a supported base. See [The ESM sandbox](/concepts/esm-sandbox) for details.
:::

## Related

- [The ESM sandbox](/concepts/esm-sandbox) — how native modules run through the membrane
- [@qiankunjs/bundler-plugin](/ecosystem/bundler-plugin) — the Vite and Webpack plugins in full
- [Micro-app lifecycle and props](/concepts/lifecycle-and-props) — the lifecycle contract
- [Make a Webpack app qiankun-ready](/cookbook/prepare-a-webpack-app) — the classic-path equivalent
- [Enable CSS style isolation](/cookbook/enable-style-isolation) — scoping styles per app
