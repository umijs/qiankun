# Migrate from qiankun 2.x

qiankun 3.0 rewrites the runtime around streaming HTML-entry loading, a Proxy-membrane JS sandbox, and native ESM execution. The public API is smaller and stricter than 2.x, and several 2.x options no longer exist. This guide walks the breaking changes one at a time, each with a before/after, so you can port a 2.x integration to v3.

::: info Version
This page targets qiankun `3.0.0-rc.21`. The exact option names and defaults below come from the v3 source under `packages/`.
:::

## At a glance

| Area | qiankun 2.x | qiankun 3.0 |
| --- | --- | --- |
| `entry` | string or `{ scripts, styles }` object | HTML URL string only |
| `container` | selector string or `HTMLElement` | `HTMLElement` instance only |
| `start()` options | `prefetch`, `sandbox`, `singular`, `fetch`, `getPublicPath`, `getTemplate`, `excludeAssetFilter`, ... | single-spa `StartOpts` only (`{ urlRerouteOnly? }`) |
| Sandbox / style isolation | `sandbox: { strictStyleIsolation \| experimentalStyleIsolation }` (Shadow DOM) | `sandbox: boolean` + separate `styleIsolation: boolean` (CSS `@scope`) |
| Per-app config | mixed into `start()` | per-app `configuration: AppConfiguration` |
| Global state store | `initGlobalState` / `onGlobalStateChange` / `setGlobalState` | removed — pass your own store via props |
| Micro-app build | manual UMD / `libraryTarget` / `jsonpFunction` / `chunkLoadingGlobal` | `@qiankunjs/bundler-plugin` (webpack) or `qiankun()` (Vite) |
| Prefetch | `prefetch: 'all' \| string[] \| fn` on `start()` | streaming loader auto-preloads; `prefetchApps` is deprecated |
| Runtime floor | Node 16+, older browsers | Node `>=20.19`; Proxy + TransformStream + `URL.createObjectURL` |

The rest of this page details each row.

## Entry: object to plain URL string

In 2.x `entry` could be a config object listing scripts and styles. In v3 `entry` is always a single HTML URL string — qiankun streams that HTML document and discovers assets from it.

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

The type is now `type HTMLEntry = string`. The `{ scripts, styles }` form and the 2.x `EntryOpts` type no longer exist.

## Container: selector string to HTMLElement

In 2.x `container` accepted a CSS selector string. In v3 `container` is typed and consumed as an `HTMLElement` instance — pass the element, not a selector.

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
Passing a selector string is now a type error and will not resolve at runtime. If you register apps before the DOM node exists, defer registration until the element is available (for example, resolve it inside your shell's mount effect).
:::

## start(): per-app configuration instead of global options

This is the largest change. In 2.x `start()` accepted a bag of framework options (`prefetch`, `sandbox`, `singular`, `fetch`, `getPublicPath`, `getTemplate`, `excludeAssetFilter`, ...). In v3 `start()` forwards only single-spa's `StartOpts` — the sole field is `urlRerouteOnly`. Everything that used to be a global `start()` option is now either removed or moved to a per-app `configuration`.

```ts
// v3 signature
function start(opts?: { urlRerouteOnly?: boolean }): void;
```

Per-app knobs live on the app's `configuration` field (of type [`AppConfiguration`](/api/configuration)), which is merged over the framework defaults for that app.

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
      sandbox: true,        // JS sandbox (default true)
      styleIsolation: true, // CSS @scope isolation (default false)
    },
  })),
);
start(); // no qiankun-specific options here
```
:::

`AppConfiguration` in v3 has exactly these fields:

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `sandbox` | `boolean` | `true` | Enable the Proxy-membrane JS sandbox |
| `styleIsolation` | `boolean` | `false` | Scope the app's CSS via runtime `@scope` |
| `globalContext` | `WindowProxy` | `window` | Base global the sandbox membrane proxies |
| `fetch` | `typeof window.fetch` | `window.fetch` | Custom fetch (wrapped cacheable/retryable/throwable) |
| `streamTransformer` | `() => TransformStream<string, string>` | — | Optional transform over the HTML stream |
| `nodeTransformer` | `NodeTransformer` | internal | Advanced: rewrite each asset node |

There is no `FrameworkConfiguration` type, no `getPublicPath`/`getTemplate`/`excludeAssetFilter`, and no `singular` in v3. See [AppConfiguration](/api/configuration) for the full reference.

## Sandbox and style isolation: two separate booleans

In 2.x isolation was a nested object with Shadow DOM based strategies. v3 splits it into two independent booleans and uses native CSS `@scope` — there is no Shadow DOM path.

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
  sandbox: true,        // JS isolation (Proxy membrane)
  styleIsolation: true, // CSS isolation via @scope, wrapped to [data-name="<appName>"]
}
```
:::

Key differences:

- `sandbox` is now a plain `boolean` (JS isolation only). Set `sandbox: false` to run an app on the real `window` — useful for legacy apps that cannot tolerate a proxied global.
- `styleIsolation` is a separate `boolean` (default off). When on, each app's styles are wrapped in `@scope ([data-name="<appName>"]) { ... }`; external stylesheets are re-fetched and served as blob `<link>`s so `@scope` can wrap them.
- The scope selector is derived internally as `[data-name="<appName>"]` and is not user-configurable.

::: warning `@scope` browser support
v3 style isolation relies on native CSS `@scope`. There is no Shadow DOM fallback and no polyfill. Browsers without `@scope` support will not scope the styles. See [Style isolation](/concepts/style-isolation) and [Enable CSS style isolation](/cookbook/enable-style-isolation) for details and caveats (font-face and keyframes handling).
:::

## Global state store: removed

qiankun 2.x shipped a built-in cross-app store: `initGlobalState`, `onGlobalStateChange`, `setGlobalState`, and `MicroAppStateActions`. None of these exist in v3.

Communicate by passing whatever you need down through `props`. Because `props` can carry functions and objects, you can hand a small store or event bus to each micro-app.

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

Inside the micro-app, read `props.store` in `mount(props)`. See [Share state and communicate between apps](/cookbook/communicate-between-apps) for patterns (props handshake, shared event bus, and unmount cleanup).

## Build config: drop manual UMD surgery for the bundler plugin

In 2.x micro-apps needed hand-written output config to export lifecycles onto a global and to make chunk-loading names unique. v3 replaces that with `@qiankunjs/bundler-plugin`.

### Webpack

The plugin sets the output library to `window` (and, on webpack 4, the `jsonpFunction`) and marks the entry `<script>` with the `entry` attribute the loader keys on. Install it as a dev dependency and add it to `plugins`; keep `html-webpack-plugin` in the array so the entry script can be marked automatically.

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

The webpack plugin takes one optional field, `packageName`, which defaults to the `name` in your `package.json`. See [Make a Webpack app qiankun-ready](/cookbook/prepare-a-webpack-app) and the [bundler-plugin reference](/ecosystem/bundler-plugin).

### Vite

v3 loads Vite apps natively through its ESM sandbox in both dev and production — there is no SystemJS or UMD build mode. Add the zero-argument `qiankun()` plugin; it sets permissive CORS for dev and preview and marks the entry module script on build.

```ts [vite.config.ts]
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { qiankun } from '@qiankunjs/bundler-plugin/vite';

export default defineConfig({
  plugins: [react(), qiankun()],
  server: { port: 7100, strictPort: true },
});
```

::: info Scaffolding a fresh app
For a new project, `create-qiankun` wires all of this up. See [create-qiankun](/ecosystem/create-qiankun) and [Getting started](/guide/getting-started).
:::

## Micro-app entry: modern render into props.container

Keep the same lifecycle contract — `bootstrap`, `mount`, `unmount` — but render with the modern APIs and mount into `props.container` (the app's own container subtree), not the global document. Under webpack (classic mode) the app still publishes its lifecycles on `window[appName]` when powered by qiankun; the entry `<script>` carries the `entry` attribute (the bundler plugin adds it).

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

// classic (webpack) mode: expose lifecycles on the app-name global
if (window.__POWERED_BY_QIANKUN__) {
  window['react-app'] = { bootstrap, mount, unmount };
} else {
  render();
}
```
:::

For Vue, the same shape applies with `createApp(...).mount(...)` in `mount` and `app.unmount()` in `unmount`. The `window[appName]` publish and the `entry`-attribute script only apply to the classic (webpack) path; native Vite/ESM apps export the lifecycles directly and are resolved by the ESM engine. See [Micro-app lifecycle and props](/concepts/lifecycle-and-props).

::: danger Exactly one entry script
An HTML entry may contain at most one script marked `entry`. Two entry scripts make the loader throw a `QiankunError`. The bundler plugins are idempotent and mark a single entry script for you.
:::

## Runtime and tooling floor

v3 raises the minimum environment.

- **Node**: `>=20.19` for building and running the tooling (`create-qiankun`, Vite).
- **Browser**: the runtime needs `Proxy`, `TransformStream`, and `URL.createObjectURL`. Style isolation additionally needs native CSS `@scope`.

Gate on capability before you `start()` using the new [`isRuntimeCompatible`](/api/is-runtime-compatible) export:

```ts
import { isRuntimeCompatible, registerMicroApps, start } from 'qiankun';

if (isRuntimeCompatible()) {
  registerMicroApps(apps);
  start();
} else {
  // render a fallback / upgrade notice
}
```

`isRuntimeCompatible()` returns `true` only when `Proxy`, `TransformStream`, and `URL.createObjectURL` are all present.

::: info Firefox and ESM apps
Firefox does not support dynamically injected import maps, which the ESM sandbox relies on for natively-loaded (Vite) micro-apps. Classic (webpack) apps are unaffected. See [The ESM sandbox](/concepts/esm-sandbox).
:::

## New v3 exports to adopt

- [`isRuntimeCompatible`](/api/is-runtime-compatible) — probe browser support before starting.
- Per-app [`configuration`](/api/configuration) on `RegistrableApp` (and `loadMicroApp`'s second argument) — where `sandbox`, `styleIsolation`, `globalContext`, and `fetch` now live.

The full v3 public surface is `registerMicroApps`, `start`, `loadMicroApp`, `setDefaultMountApp`, `runAfterFirstMounted`, `addErrorHandler`, `removeErrorHandler`, `isRuntimeCompatible`, and `prefetchApps` (deprecated). See the [API reference overview](/api/index).

::: warning prefetchApps is deprecated
The streaming loader preloads assets automatically as the entry HTML is parsed, so explicit prefetching is rarely needed. `prefetchApps` still exists but is deprecated in 3.0, and the 2.x `prefetch` strategies on `start()` are gone. For loading tuning, see [Optimize loading and preloading](/cookbook/optimize-loading).
:::

## Migration checklist

1. Change every `entry` to an HTML URL string.
2. Change every `container` to an `HTMLElement` instance.
3. Remove all qiankun-specific options from `start()`; move `sandbox`/`styleIsolation`/`fetch` into each app's `configuration`.
4. Replace `sandbox: { strictStyleIsolation | experimentalStyleIsolation }` with `sandbox: boolean` plus `styleIsolation: boolean`.
5. Remove `initGlobalState`/`onGlobalStateChange`/`setGlobalState`; pass your own store through `props`.
6. Delete manual UMD/`libraryTarget`/`jsonpFunction` output config; add `@qiankunjs/bundler-plugin` (webpack) or `qiankun()` (Vite).
7. Modernize micro-app entries to `createRoot` / `app.mount` rendering into `props.container`.
8. Drop `prefetch` strategies; rely on streaming auto-preload.
9. Gate startup with `isRuntimeCompatible()` and confirm your Node/browser floor.
