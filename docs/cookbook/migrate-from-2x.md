# Migrating from qiankun 2.x

qiankun 3.0 has a smaller, stricter public contract than 2.x. This guide maps each breaking change to its v3 replacement with before-and-after examples.

Route-registration examples remain route based so existing `registerMicroApps` integrations are easy to compare. For new host-controlled panels, tabs, and components, prefer [`loadMicroApp`](/api/load-micro-app).

::: info Version
This page is the single source of truth for moving a qiankun 2.x integration to the current v3 API. Individual API pages document only current behavior.

:::

## Overview

| Aspect | qiankun 2.x | qiankun 3.0 |
| --- | --- | --- |
| `entry` | A string, or a `{ scripts, styles }` object | Only an HTML URL string |
| `container` | A selector string or an `HTMLElement` | Only an `HTMLElement` instance |
| `start()` options | `prefetch`, `sandbox`, `singular`, `fetch`, `getPublicPath`, `getTemplate`, `excludeAssetFilter`, etc. | Only single-spa's `StartOpts` (`{ urlRerouteOnly? }`) |
| Sandbox / style isolation | `strictStyleIsolation` (Shadow DOM) or `experimentalStyleIsolation` (selector rewriting) | `sandbox: boolean \| SandboxConfiguration`, with `sandbox.styleIsolation: boolean` (CSS `@scope`) |
| Per-app config | Mixed into `start()` | A per-app `configuration: AppConfiguration` |
| Global state store | `initGlobalState` / `onGlobalStateChange` / `setGlobalState` | Removed — pass your own store through props |
| Micro-app build | Hand-written UMD / `libraryTarget` / `jsonpFunction` / `chunkLoadingGlobal` | `@qiankunjs/bundler-plugin` (webpack) or `qiankun()` (Vite) |
| Prefetch | `prefetch: 'all' \| string[] \| fn` on `start()` | The streaming loader prefetches automatically; `prefetchApps` is deprecated |
| Browser compatibility | Includes legacy browser paths | Modern browsers, without a snapshot sandbox fallback; see [Browser support](/guide/browser-support) |
| Error handling | `addGlobalUncaughtErrorHandler` / `removeGlobalUncaughtErrorHandler` | `addErrorHandler` / `removeErrorHandler` for route apps; handle promises for manually loaded apps |
| Instance disposal | `unmount()` retains loaded instances | Bounded idle cache; new `unload()`, `unloadMicroApp()`, and `unloadApplication()` APIs |

Each row is expanded below.

## entry: from an object to a single URL string

In 2.x, `entry` could be a config object listing scripts and styles. In v3, `entry` is always a single HTML URL string — qiankun streams that HTML document and discovers the assets itself.

::: code-group
```ts [2.x]
registerMicroApps([
  {
    name: 'react-app',
    entry: {
      scripts: ['//localhost:7100/main.js'],
      styles: ['//localhost:7100/main.css'],
    },
    container: '#subapp',
    activeRule: '/react',
  },
]);
```

```ts [3.0]
registerMicroApps([
  {
    name: 'react-app',
    entry: '//localhost:7100', // the app's HTML document
    container: document.querySelector('#subapp')!,
    activeRule: '/react',
  },
]);
```
:::

The type is now `type HTMLEntry = string`. The `{ scripts, styles }` form and the 2.x `EntryOpts` type are both gone.

## container: from a selector string to an HTMLElement

In 2.x, `container` accepted a CSS selector string. In v3, both the type and the actual consumer of `container` expect an `HTMLElement` instance — pass the element, not a selector.

::: code-group
```ts [2.x]
registerMicroApps([
  { name: 'react-app', entry: '//localhost:7100', container: '#subapp', activeRule: '/react' },
]);
```

```ts [3.0]
const container = document.querySelector<HTMLElement>('#subapp')!;

registerMicroApps([
  { name: 'react-app', entry: '//localhost:7100', container, activeRule: '/react' },
]);
```
:::

::: warning
Passing a selector string is now a type error, and at runtime you won't get an element back. If you register apps before the DOM nodes exist, defer registration until the element is there (for example, resolve it inside the main app's mount side effect).

:::

## start(): per-app configuration replaces global options

This is the biggest change. In 2.x, `start()` took a large set of framework-level options (`prefetch`, `sandbox`, `singular`, `fetch`, `getPublicPath`, `getTemplate`, `excludeAssetFilter`, and more). In v3, `start()` only forwards single-spa's `StartOpts` — the one field is `urlRerouteOnly`. Anything that used to be a `start()` global option has either been removed or moved onto each app's own `configuration`.

```ts
// v3 signature
function start(opts?: { urlRerouteOnly?: boolean }): void;
```

Per-app switches live on the app's `configuration` field (typed [`AppConfiguration`](/api/configuration)), which is merged over the framework defaults for that app.

::: code-group
```ts [2.x]
registerMicroApps(apps);
start({
  prefetch: 'all',
  sandbox: { experimentalStyleIsolation: true },
  singular: true,
});
```

```ts [3.0]
registerMicroApps(
  apps.map((app) => ({
    ...app,
    configuration: {
      sandbox: {              // JS sandbox (default true)
        styleIsolation: true, // CSS @scope isolation (default false)
      },
    },
  })),
);
start(); // no qiankun-specific options here
```
:::

Current per-app fields are `sandbox`, `fetch`, `loadTimeout`, `streamTransformer`, and `nodeTransformer`; `styleIsolation`, `globals`, `incubatorContext`, `plugins`, `modules`, `resolveHook`, `importHook`, and `loadHook` live inside the `sandbox` object. Defaults and advanced contracts are maintained in the [AppConfiguration reference](/api/configuration).

v3 has no `FrameworkConfiguration` type, no `getPublicPath` / `getTemplate` / `excludeAssetFilter`, and no `singular`.

## Sandbox and style isolation: one umbrella, native `@scope`

In 2.x, JavaScript and style-isolation options shared a nested `sandbox` configuration, with Shadow DOM and selector-rewrite style strategies. v3 keeps a single `sandbox` umbrella but changes what is inside it: JS isolation is the switch itself, style isolation is `sandbox.styleIsolation`, and styles are scoped with native CSS `@scope` — there is no Shadow DOM path anymore.

::: code-group
```ts [2.x]
start({
  sandbox: {
    strictStyleIsolation: true,       // Shadow DOM
    // or
    experimentalStyleIsolation: true, // scoped rewrite
  },
});
```

```ts [3.0]
// per app
configuration: {
  sandbox: {
    // JS isolation (Proxy membrane) is on by any object form
    styleIsolation: true, // CSS isolation via @scope, wrapped to [data-name="<appName>"]
  },
}
```
:::

A few key differences:

- `sandbox` is a `boolean | SandboxConfiguration`. Setting `sandbox: false` runs the app on the real `window` — useful for legacy apps that can't tolerate proxied globals; passing an object keeps isolation on and configures it.
- `sandbox.styleIsolation` is a `boolean` (off by default). When on, each app's styles are wrapped in `@scope ([data-name="<appName>"]) { ... }`; external stylesheets are re-fetched and served as blob `<link>`s so `@scope` can wrap them.
- The scope selector is derived internally as `[data-name="<appName>"]` and isn't user-configurable.

::: warning `@scope` browser support
v3's style isolation relies on native CSS `@scope`, with no Shadow DOM fallback and no polyfill. Treat browsers without `@scope` as unsupported for this capability. For the details and caveats (how font-face and keyframes are handled), see [Style isolation](/concepts/style-isolation) and [Enabling CSS style isolation](/cookbook/enable-style-isolation).

:::

## Global state store: removed

qiankun 2.x shipped a cross-app store: `initGlobalState`, `onGlobalStateChange`, `setGlobalState`, and `MicroAppStateActions`. None of it survives in v3.

Communication moves to passing what you need down through `props`. `props` can carry functions and objects, so you can hand a small store or event bus to each micro-app.

::: code-group
```ts [2.x]
import { initGlobalState } from 'qiankun';

const actions = initGlobalState({ user: null });
actions.onGlobalStateChange((state, prev) => console.log(state, prev));
actions.setGlobalState({ user: { name: 'Alice' } });
```

```ts [3.0]
// main app: build your own store and pass it through props
import mitt from 'mitt';

const store = { state: { user: null }, emitter: mitt() };

registerMicroApps([
  {
    name: 'react-app',
    entry: '//localhost:7100',
    container,
    activeRule: '/react',
    props: { store }, // delivered to the micro-app's mount(props)
  },
]);
```
:::

On the micro-app side, read `props.store` inside `mount(props)`. For the communication patterns (props handshake, shared event bus, cleanup on unmount), see [Sharing state and communicating between apps](/cookbook/communicate-between-apps).

## Build config: stop hand-tuning UMD, let the bundler plugin do it

In 2.x, a micro-app had to hand-write its output config to attach lifecycles to a global and keep the chunk-loading name unique. v3 replaces all of that with `@qiankunjs/bundler-plugin`.

### Webpack

The plugin sets the output library to `window` (and on webpack 4 also sets `jsonpFunction`), and tags the entry `<script>` with the `entry` attribute the loader recognizes. Install it as a dev dependency and add it to `plugins`; keep `html-webpack-plugin` in the array too, so the entry script can be tagged automatically.

::: code-group
```js [2.x webpack.config.js]
const packageName = require('./package.json').name;

module.exports = {
  output: {
    library: `${packageName}`,
    libraryTarget: 'umd',
    jsonpFunction: `webpackJsonp_${packageName}`,
    globalObject: 'window',
  },
};
```

```js [3.0 webpack.config.js]
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { QiankunWebpackPlugin } = require('@qiankunjs/bundler-plugin');

module.exports = {
  output: { publicPath: 'auto' },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new QiankunWebpackPlugin(), // packageName defaults to package.json "name"
  ],
  devServer: {
    // the plugin does NOT set CORS for you — add it yourself
    headers: { 'Access-Control-Allow-Origin': '*' },
    allowedHosts: 'all',
  },
};
```
:::

The webpack plugin takes one optional field, `packageName`, defaulting to the `name` in your `package.json`. It identifies the bundle's library output rather than the host-side app `name`; with the default sandbox enabled, the two do not have to match when the entry script is marked correctly. If `sandbox: false` forces lifecycle discovery through `window[appName]`, the global library key must match the host-side name unless the bundle creates that property explicitly. See [Preparing a webpack app for qiankun](/cookbook/prepare-a-webpack-app) and the [bundler-plugin reference](/ecosystem/bundler-plugin).

### Vite

v3 loads Vite apps natively through its ESM sandbox in both dev and production — no SystemJS, no UMD build mode. Add the zero-argument `qiankun()` plugin; it sets up permissive CORS for dev and preview, and tags the entry module script at build time.

```ts [vite.config.ts]
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { qiankun } from '@qiankunjs/bundler-plugin/vite';

export default defineConfig({
  plugins: [react(), qiankun()],
  server: { port: 7100, strictPort: true },
});
```

::: info Scaffolding a new app
For a new project, the [Agent skill](/ecosystem/agent-skill) lets a coding agent wire all of this up for you. See also [Getting started](/guide/getting-started).

:::

## Micro-app entry: render into props.container with a modern API

The lifecycle names remain `bootstrap`, `mount`, and `unmount`. Render with a modern API and mount into `props.container` (the app's own container subtree), not the global document. Export the lifecycle functions normally. The bundler plugin exposes a webpack build under its `packageName` and marks the entry script; native ESM builds use the module exports directly.

`bootstrap` now receives only a readonly `{ name, entry }`, without business props or a container. Move user data, route state, and DOM initialization from an existing bootstrap into `mount`, release resources in `unmount`, and handle subsequent data changes through `update`. See [Micro-app lifecycle and props](/concepts/lifecycle-and-props).

::: code-group
```tsx [2.x main.tsx]
import ReactDOM from 'react-dom';
import App from './App';

function render(props = {}) {
  const { container } = props;
  ReactDOM.render(<App />, container ? container.querySelector('#root') : document.getElementById('root'));
}

export async function bootstrap() {}
export async function mount(props) { render(props); }
export async function unmount(props) {
  const { container } = props;
  ReactDOM.unmountComponentAtNode(container ? container.querySelector('#root') : document.getElementById('root'));
}
```

```tsx [3.0 main.tsx]
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

let root: ReactDOM.Root | undefined;

function render(props: { container?: Element } = {}) {
  const el = props.container?.querySelector('#root') ?? document.getElementById('root');
  if (!el) return;
  root = ReactDOM.createRoot(el);
  root.render(<React.StrictMode><App /></React.StrictMode>);
}

export async function bootstrap() {}
export async function mount(props: { container?: Element }) { render(props); }
export async function unmount() {
  root?.unmount();
  root = undefined;
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
```
:::

Vue follows the same structure: `createApp(...).mount(...)` in `mount`, `app.unmount()` in `unmount`. Export the same three lifecycle functions for both webpack and native ESM builds; their bundler integrations take care of exposing the entry in the form qiankun expects. See [Micro-app lifecycles and props](/concepts/lifecycle-and-props).

`mount` and `unmount` receive the current mount’s `props.container`; optional `update` receives the caller’s business props without an automatically injected container. Save any framework root or container reference needed for updates in `mount`, and release it in `unmount`.

::: danger At most one entry script
An HTML entry may mark at most one script as the `entry`. Two entry scripts make the loader throw a `QiankunError`. The bundler plugin is idempotent and tags a single entry script for you.

:::

## Instance reuse and disposal: unmount versus unload

Review every `loadMicroApp` call during migration: calling it again does not necessarily reload the scripts.

- Calls with the same `name` and `entry` can reuse the instance on the same container, or an idle or unmounting instance from another container. Mounts on one container queue; concurrent mounts on different containers use independent instances.
- Cache hits do not re-execute entry scripts, module top-level code, or `bootstrap`. The current business props go to `mount`, where container- and user-dependent initialization belongs.
- The idle cache retains at most 2 instances per `name` and `entry`, 8 globally, and reclaims instances after 5 minutes idle. This is an internal policy, not an `AppConfiguration` option. A retained handle can still call `mount()` to load again after cache reclamation.
- Reused instances retain their original configuration and host lifecycle hooks. Passing a different `configuration` does not rebuild an existing sandbox. Dispose of the old instance first to change its configuration or force fresh code loading.

`unmount()` temporarily removes the view; the loaded instance may still be reused. To release the sandbox, resources, and caches, use:

| Loading mode | Disposal API | Scope |
| --- | --- | --- |
| `loadMicroApp` | `await app.unload()` | Disposes of the instance behind this handle; other handles sharing it also become invalid |
| `loadMicroApp` | `await unloadMicroApp(name)` | Disposes of all manually loaded instances with this name |
| `registerMicroApps` | `await unloadApplication(name, { waitForUnmount: true })` | Disposes after a route-driven unmount; preserves registration and reloads on a later active route |

```ts
import { loadMicroApp } from 'qiankun';

const app = loadMicroApp({ name: 'account-app', entry, container });
await app.mountPromise;

// Temporarily hide the app, allowing reuse.
await app.unmount();
await app.mount();

// Dispose when no longer needed; call loadMicroApp for a new handle later.
await app.unload();
```

`mountPromise` and `unmountPromise` describe only the first mount and unmount. Await the promises returned by `mount()` and `unmount()` for later operations. Explicit `unload()` differs from automatic cache reclamation: explicit disposal invalidates old handles, so they cannot mount again.

After a load or `bootstrap` failure, call `loadMicroApp` again to reload; the same `name` and `entry` have an approximately one-second failure cooldown. Do not retry by repeatedly mounting a failed handle. Disposal cannot preempt application lifecycles already in progress or clear the browser’s native ESM module registry. See [loadMicroApp](/api/load-micro-app) for the full behavior and cleanup limits, and [registerMicroApps](/api/register-micro-apps#unload-application) for route apps.

## Error handling and load timeouts

v3 no longer exports `addGlobalUncaughtErrorHandler` or `removeGlobalUncaughtErrorHandler`. Migrate error handling according to the loading mode:

- **Route apps**: use `addErrorHandler` / `removeErrorHandler` for single-spa loading and lifecycle errors; remove a handler with the same function reference.
- **Manually loaded apps**: handle rejections from the returned handle’s promises; await `mountPromise` for the initial mount. Global `addErrorHandler` does not receive initial loading, bootstrap, or first-mount errors; a later `mount()` execution failure on the same handle also reaches the global observer.
- **Other page errors**: use the browser’s `error` / `unhandledrejection` events for uncaught errors outside qiankun, and clean up listeners in the host.

Identify framework errors with `QiankunError` imported from `qiankun` and its stable `code`, rather than matching message text. Business, network, and single-spa errors are not necessarily instances of this class.

The new `loadTimeout` defaults to `0` (disabled). Timing begins after acquiring the container for loading and covers `beforeLoad`, entry loading, resource processing, lifecycle discovery, and completion of the HTML stream. It excludes container waits and the failure cooldown, and does not bound `bootstrap`, `mount`, `unmount`, or cached remounts.

```ts
import { loadMicroApp, QiankunError } from 'qiankun';

const app = loadMicroApp({ name, entry, container }, { loadTimeout: 10_000 });
try {
  await app.mountPromise;
} catch (error) {
  if (error instanceof QiankunError) {
    console.error(error.code, error);
  } else {
    console.error(error);
  }
}
```

With a timeout enabled, mounting waits for both entry lifecycles and the end of the HTML stream. With the default disabled, mounting can still begin before the stream ends. A timeout produces `LoadAppTimeoutError` (`code: 'load-timeout'`); qiankun aborts loading and cleans up inserted nodes and the sandbox. Custom fetch implementations must forward `init.signal` and stop reading response streams on abort. See [AppConfiguration](/api/configuration#loadtimeout) and [addErrorHandler / removeErrorHandler](/api/error-handling).

## Runtime and toolchain floor

- **Development toolchain**: this repository requires Node `^22.15.0 || >=24.0.0` and `pnpm@11.13.1`. Integrating projects must also meet their own build tools’ requirements; this is not a browser runtime dependency on Node.
- **Browsers**: follow [Browser support](/guide/browser-support), assessing the base runtime, native ESM, and style isolation separately. v3 does not support IE or automatically fall back to a snapshot sandbox.

Before `start()`, gate on capability with the new v3 [`isRuntimeCompatible`](/api/is-runtime-compatible):

```ts
import { isRuntimeCompatible, registerMicroApps, start } from 'qiankun';

if (isRuntimeCompatible()) {
  registerMicroApps(apps);
  start();
} else {
  // render a fallback / upgrade notice
}
```

`isRuntimeCompatible()` returns `true` only when all three of `Proxy`, `TransformStream`, and `URL.createObjectURL` are present.

::: info Firefox and ESM apps
`isRuntimeCompatible()` checks only the base runtime, not the ESM sandbox or CSS `@scope`. Before the first sandboxed ESM load, qiankun probes dynamic multiple import maps: unsupported behavior rejects with `esm-unsupported`; a CSP-blocked or timed-out probe rejects with `esm-capability-check-failed`. Firefox does not enable this ESM path by default; provide a Classic build entry when Firefox support is required. See [Browser support](/guide/browser-support).

:::

## CSP: review script and style policies

v3’s script executor does not use `eval` or `new Function`, but transformed external Classic scripts and ESM execute through Blob URLs. A script policy allowing only the original asset origins is insufficient. Configure the host response’s `script-src`, `style-src`, and `connect-src` for the resources used. The current ESM path also inserts inline import maps and has no unified nonce propagation setting; adding a nonce to the entry script alone does not authorize it. Review [Content Security Policy (CSP)](/guide/csp-requirements) for your script, style, and cross-origin deployment paths.

## Other v3 APIs worth adopting

- [`isRuntimeCompatible`](/api/is-runtime-compatible) — probe browser support before starting.
- The per-app [`configuration`](/api/configuration) on `RegistrableApp` (and the second argument of `loadMicroApp`) — `sandbox` (including style isolation and module hooks), `fetch`, and `loadTimeout` live here now.

`setDefaultMountApp` and `runAfterFirstMounted` remain exported from `qiankun`. Route navigation can use the top-level `navigateToUrl` export without adding another copy of single-spa.

For new integrations, start with `loadMicroApp`; the [API overview](/api/) owns the complete current export list.

::: warning prefetchApps is deprecated
The streaming loader preloads assets while parsing the current entry HTML; this does not prefetch other, unloaded apps before activation. `prefetchApps` still exists but is deprecated in 3.0; the whole `prefetch` strategy from 2.x's `start()` is gone. For loading tuning, see [Optimizing loading and prefetch](/cookbook/optimize-loading).

:::

## Migration checklist

1. Change every `entry` to an HTML URL string.
2. Change every `container` to an `HTMLElement` instance.
3. Remove all qiankun-specific options from `start()`; move `sandbox` / `styleIsolation` / `fetch` into each app's `configuration`.
4. Replace `sandbox: { strictStyleIsolation | experimentalStyleIsolation }` with `sandbox: { styleIsolation: boolean }`.
5. Remove `initGlobalState` / `onGlobalStateChange` / `setGlobalState`; pass your own store through `props`.
6. Delete hand-written UMD / `libraryTarget` / `jsonpFunction` output config; add `@qiankunjs/bundler-plugin` (webpack) or `qiankun()` (Vite).
7. Change the micro-app entry to render into `props.container` with `createRoot` / `app.mount`.
8. Drop the `prefetch` strategy and rely on streaming auto-prefetch.
9. Gate browser startup with `isRuntimeCompatible()` to confirm the core runtime capabilities are present.
10. Move business-prop- or container-dependent `bootstrap` logic into `mount`; do not rely on an automatically injected container in `update`.
11. Check instance reuse and reloading after cache reclamation; distinguish temporary unmounting from explicit disposal and await each operation’s returned promise.
12. Migrate error handling for each loading mode, configure `loadTimeout` if needed, and forward cancellation signals in custom fetch implementations.
13. Review the host CSP for the ESM, style-isolation, and cross-origin resource paths actually used.
