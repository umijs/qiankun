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
| Runtime floor | Older toolchains and browsers | Node `>=20.19`; `Proxy` + `TransformStream` + `URL.createObjectURL` |

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

Current per-app fields are `sandbox`, `fetch`, `streamTransformer`, and `nodeTransformer`; `styleIsolation`, `globals`, `incubatorContext`, and `plugins` live inside the `sandbox` object. Defaults and advanced contracts are maintained in the [AppConfiguration reference](/api/configuration).

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
For a new project, `create-qiankun` wires all of this up for you. See [create-qiankun](/ecosystem/create-qiankun) and [Getting started](/guide/getting-started).

:::

## Micro-app entry: render into props.container with a modern API

The lifecycle contract is unchanged — still `bootstrap`, `mount`, `unmount` — but render with a modern API and mount into `props.container` (the app's own container subtree), not the global document. Export the lifecycle functions normally. The bundler plugin exposes a webpack build under its `packageName` and marks the entry script; native ESM builds use the module exports directly.

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

::: danger Exactly one entry script
An HTML entry may mark at most one script as the `entry`. Two entry scripts make the loader throw a `QiankunError`. The bundler plugin is idempotent and tags a single entry script for you.

:::

## Runtime and toolchain floor

v3 raises the minimum environment.

- **Node**: building and running the toolchain (`create-qiankun`, Vite) needs `>=20.19`.
- **Browser**: the runtime needs `Proxy`, `TransformStream`, and `URL.createObjectURL`. Style isolation additionally needs native CSS `@scope`.

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
Firefox doesn't support dynamically injected import maps, which natively loaded (Vite) micro-apps depend on to make the ESM sandbox work. Classic (webpack) apps are unaffected. See [ESM sandbox](/concepts/esm-sandbox).

:::

## Other v3 APIs worth adopting

- [`isRuntimeCompatible`](/api/is-runtime-compatible) — probe browser support before starting.
- The per-app [`configuration`](/api/configuration) on `RegistrableApp` (and the second argument of `loadMicroApp`) — `sandbox` (with `styleIsolation`, `globals`, `incubatorContext`, `plugins` inside it) and `fetch` all live here now.

For new integrations, start with `loadMicroApp`; the [API overview](/api/) owns the complete current export list.

::: warning prefetchApps is deprecated
The streaming loader prefetches assets as it parses the entry HTML, so explicit prefetching is rarely needed. `prefetchApps` still exists but is deprecated in 3.0; the whole `prefetch` strategy from 2.x's `start()` is gone. For loading tuning, see [Optimizing loading and prefetch](/cookbook/optimize-loading).

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
