# FAQ

Answers to the questions that come up most often when adopting qiankun 3.0. Each entry links to the reference or cookbook page where the topic is covered in full.

## Do I need a build plugin?

The host (main) app needs no plugin — it only calls [registerMicroApps](/api/register-micro-apps) / [start](/api/start) or [loadMicroApp](/api/load-micro-app). Its own entry `<script>` must not carry the `entry` attribute, because the host is not itself a micro-app.

Micro-apps need two things: their build must (1) mark the entry `<script>` with the `entry` attribute, and (2) serve assets with permissive CORS. The [@qiankunjs/bundler-plugin](/ecosystem/bundler-plugin) does both for you.

::: code-group

```ts [Vite]
// vite.config.ts
import { defineConfig } from 'vite';
import { qiankun } from '@qiankunjs/bundler-plugin/vite';

export default defineConfig({
  plugins: [qiankun()],
  server: { port: 7100, strictPort: true },
});
```

```js [Webpack]
// webpack.config.js
const { QiankunWebpackPlugin } = require('@qiankunjs/bundler-plugin');

module.exports = {
  output: { publicPath: 'auto' },
  plugins: [new QiankunWebpackPlugin()],
  devServer: {
    headers: { 'Access-Control-Allow-Origin': '*' },
    allowedHosts: 'all',
  },
};
```

:::

`qiankun()` handles dev/preview CORS headers and marks the `type="module"` entry script for the ESM sandbox path. `QiankunWebpackPlugin` sets `output.library` to `{ name, type: 'window' }` (so the classic path can read the app off `window[name]`) and marks the injected entry script.

A no-build app can mark the entry manually — add `entry` to the one script that exposes the lifecycles:

```html
<script src="./entry.js" entry></script>
```

See [Make a Vite app qiankun-ready](/cookbook/prepare-a-vite-app) and [Make a Webpack app qiankun-ready](/cookbook/prepare-a-webpack-app).

## Why am I getting CORS errors?

qiankun fetches every micro-app's HTML entry and its assets cross-origin through a decorated `window.fetch`. The sub-app server must therefore answer with permissive CORS headers, for example `Access-Control-Allow-Origin: *`. Without them the browser blocks the fetch and the app never loads.

- Vite: use `qiankun()`, which sets the dev/preview CORS headers.
- Webpack: set `devServer.headers['Access-Control-Allow-Origin'] = '*'` and `allowedHosts: 'all'`.
- Static hosting: serve with CORS enabled (for example `http-server . --cors`).

::: warning Third-party libraries need CORS too
Any library the sub-app loads — jQuery, a UI kit, an analytics script — is fetched by qiankun the same way. A public CDN that does not send `Access-Control-Allow-Origin` will fail. Vendor the library and serve it from your own CORS-enabled origin instead of a headerless CDN.
:::

Under [style isolation](/concepts/style-isolation), external `<link rel="stylesheet">` sheets are also re-fetched (so their CSS can be `@scope`-wrapped). A cross-origin stylesheet without CORS headers is dropped to preserve isolation. Serve stylesheets with CORS as well.

## Why the error "more than one entry script"?

An HTML entry may contain exactly one `<script>` marked with the `entry` attribute. That script is the one that exposes the micro-app's lifecycles; qiankun waits on it to resolve the app. A second `entry`-attributed script throws a `QiankunError`.

If your build injects multiple scripts (vendor chunk, runtime chunk, main chunk), let the bundler plugin decide which one is the entry — do not add `entry` by hand on top of it. Non-entry scripts (a vendored library in `<head>`, code-split chunks) load normally and must not carry the attribute.

## Why "lifecycle functions not found"?

qiankun could load the entry but could not find the `bootstrap` / `mount` / `unmount` functions on it. Make sure the micro-app actually exposes them, and that the way it exposes them matches its loading path.

::: code-group

```ts [ESM path (Vite)]
// The native module exports ARE the lifecycles.
export async function bootstrap() {}
export async function mount(props: { container?: Element }) {
  render(props);
}
export async function unmount(props: { container?: Element }) {
  root?.unmount();
}
```

```tsx [Classic path (window global)]
// The bundle's library name must equal the registered app name,
// so the exports land on window[name].
export async function bootstrap() {}
export async function mount(props) { render(props); }
export async function unmount(props) { root?.unmount(); }
// QiankunWebpackPlugin wires output.library → window['webpack-app']
```

:::

Common causes:

- **The registered `name` does not match the global.** On the classic path the app is read from `window[name]` (the library name). If you register `name: 'webpack-app'`, the bundle's `output.library.name` must be `'webpack-app'`. A mismatch means qiankun looks up an empty global.
- **Lifecycles are not exported.** On the ESM path, `bootstrap`/`mount`/`unmount` must be `export`ed from the entry module. On the classic path, they must be reachable via the window library (the plugin assigns it; a hand-written app assigns `window[name] = { bootstrap, mount, unmount }`).
- **Implicit globals in an ESM module.** ESM runs in strict mode, so an implicit `foo = 1` throws a `ReferenceError` instead of writing to the sandbox. Declare your globals.

See [Micro-app lifecycle and props](/concepts/lifecycle-and-props).

## Does qiankun support Vite / ESM?

Yes, natively, in both development and production. A `<script type="module">` entry is executed by the [ESM sandbox](/concepts/esm-sandbox): modules are fetched, rewritten so their globals route through the JS sandbox membrane, given synthetic specifiers via a dynamically injected import map, and evaluated in order by the browser's native module loader. No build-time transform is required beyond marking the entry (which `qiankun()` does).

::: warning HMR is disabled inside the sandbox
For Vite dev, qiankun stubs `/@vite/client` so the HMR WebSocket never opens — left live it would connect from inside the sandbox and trigger a destructive full-page `location.reload()`. Edit-and-reload manually while a Vite app runs inside qiankun.
:::

::: info Firefox needs a flag
The ESM sandbox relies on multiple dynamically injected import maps. Chrome/Edge 133+ and Safari 18.4+ support this natively; Firefox requires `dom.multiple_import_maps.enabled` (off by default) or the adoption of es-module-shims. The ESM e2e suite is annotated as an expected failure on Firefox for this reason.
:::

## Is there a built-in global-state store?

No. qiankun 3.0 has no `initGlobalState` / `onGlobalStateChange` / `setGlobalState` API. Share state explicitly instead:

- Pass data and callbacks to a micro-app through `props` (the fourth key on a registered app / the `props` field on `loadMicroApp`). Props reach the micro-app's lifecycle functions.
- For richer needs, use your own store (a shared module, an event bus, a signals library) and hand its API to the micro-app via props.

See [Share state and communicate between apps](/cookbook/communicate-between-apps).

## How do I isolate styles?

Enable it per app with the `styleIsolation` boolean in the app's configuration. It is off by default.

```ts
registerMicroApps([
  {
    name: 'react',
    entry: '//localhost:7100',
    container,
    activeRule: '/react',
    configuration: { sandbox: true, styleIsolation: true },
  },
]);
```

When enabled, qiankun wraps the micro-app's CSS in a native CSS `@scope` block scoped to the app container (`[data-name="<appName>"]`). External stylesheets are re-fetched and served as blob-`<link>`s so their rules can be scoped too.

::: info Not Shadow DOM
v3 does not use Shadow DOM. The 2.x option object `sandbox: { strictStyleIsolation | experimentalStyleIsolation }` no longer exists — the only knob is the boolean `styleIsolation`.
:::

Requirements and limits:

- The browser must support CSS `@scope`. There is no polyfill; browsers without it will not scope styles.
- External stylesheets must be CORS-fetchable, or they are dropped to preserve isolation.
- `@font-face` and `@namespace` are intentionally kept global (scoping them breaks font loading), so they can still collide across apps.
- `@keyframes` are renamed with a per-app prefix; keyframe names built dynamically as strings in JS are not rewritten.

See [Style isolation](/concepts/style-isolation) and [Enable CSS style isolation](/cookbook/enable-style-isolation).

## What browsers are supported?

The v3 runtime needs `Proxy`, `TransformStream`, and `URL.createObjectURL`. Probe the current browser before starting:

```ts
import { isRuntimeCompatible } from 'qiankun';

if (isRuntimeCompatible()) {
  start();
} else {
  // render a fallback / upgrade notice
}
```

`isRuntimeCompatible()` returns:

```ts
typeof Proxy === 'function' &&
  typeof TransformStream === 'function' &&
  typeof URL?.createObjectURL === 'function';
```

`TransformStream` is the highest floor of the three (streaming HTML-entry loading depends on it). ESM-sandbox micro-apps additionally need import-map support (see the Firefox note above). See [isRuntimeCompatible](/api/is-runtime-compatible).

## Why does my app not re-run on remount (ESM)?

By design. On the ESM path a remount re-imports the same blob URL, so the browser returns the **same module namespace** — top-level module code does not run again, only `mount(props)` is re-invoked. (The classic path re-executes the whole script on each remount.)

If you create app state at module top level, it survives across unmount and remount and appears "stale" or fails on the second mount. Move all instance creation into `mount()` and tear it down in `unmount()`:

```ts
let root: Root | undefined;

export async function mount(props: { container?: Element }) {
  const el = props.container?.querySelector('#root') ?? document.getElementById('root');
  root = createRoot(el);          // create in mount, not at module top level
  root.render(<App />);
}

export async function unmount() {
  root?.unmount();
  root = undefined;
}
```

This is the standard modern-framework wiring and also what keeps [multiple instances](/cookbook/run-multiple-instances) working. See [The ESM sandbox](/concepts/esm-sandbox).

## Where did the 2.x options go?

Several qiankun 2.x APIs and options do not exist in 3.0:

| 2.x | 3.0 |
| --- | --- |
| `start({ prefetch, sandbox, singular, fetch, ... })` | `start({ urlRerouteOnly? })` only; per-app options live in `configuration` |
| `sandbox: { strictStyleIsolation \| experimentalStyleIsolation }` | `styleIsolation: boolean` (CSS `@scope`) |
| `initGlobalState` / `onGlobalStateChange` / `setGlobalState` | pass state via `props` / your own store |
| `entry: { scripts, styles }` object | `entry: string` (an HTML URL) |
| `container: '#selector'` string | `container: HTMLElement` |
| `prefetch` strategies | streaming loader auto-preloads; `prefetchApps` is deprecated |

The full step-by-step is in [Migrate from qiankun 2.x](/cookbook/migrate-from-2x).
