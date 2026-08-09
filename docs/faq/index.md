# FAQ

These are direct answers and first checks for common problems. Full configuration, examples, and implementation detail live in the linked guides, API references, and concept pages.

## Does the host need a build plugin?

No. The host loads instances with [`loadMicroApp`](/api/load-micro-app). Only the route-driven alternative uses [`registerMicroApps`](/api/register-micro-apps) and [`start`](/api/start).

Micro-apps should use [`@qiankunjs/bundler-plugin`](/ecosystem/bundler-plugin) to prepare the HTML Entry and development server. Follow the [Vite](/cookbook/prepare-a-vite-app) or [Webpack](/cookbook/prepare-a-webpack-app) guide for an existing project.

## Why do I get a CORS error?

The host page fetches the micro-app HTML Entry, scripts, and styles. Every cross-origin resource must allow the host origin. Production CORS headers belong on the real static server or CDN; a development plugin cannot configure them for production.

Find the first failing request in the Network panel and check its final URL, response status, and `Access-Control-Allow-Origin`. External CSS also needs CORS when style isolation is enabled.

## Why do I get `more than one entry script`?

An HTML Entry may contain at most one external script with the `entry` attribute. Do not mark several chunks by hand; let the bundler plugin identify the real entry. See [HTML Entry and execution](/concepts/html-entry-loading).

## Why do I get `lifecycle functions not found`?

The micro-app must expose `bootstrap`, `mount`, and `unmount`. Native ESM uses named exports or a default lifecycle object; a Classic build needs the correct bundler output configuration.

Check the corresponding [Vite](/cookbook/prepare-a-vite-app) or [Webpack](/cookbook/prepare-a-webpack-app) guide first, then review the [lifecycle contract](/concepts/lifecycle-and-props).

## Does qiankun support Vite and native ESM?

Yes. With the default sandbox enabled, `<script type="module">` uses the native ESM path. When a Vite app is loaded by qiankun, its HMR connection is disabled (standalone development is unaffected), so refresh manually during development. Firefox and CSP need additional attention. See [Native ESM support](/concepts/esm-sandbox).

## Is there a built-in global state store?

No. v3 does not include `initGlobalState`, `setGlobalState`, or the related store API. Pass data, callbacks, or a host-owned store through `props`, and unsubscribe during unmount. See [Communicate between apps](/cookbook/communicate-between-apps).

## How do I isolate styles?

Set `sandbox: { styleIsolation: true }` in the app configuration. It stops micro-app CSS from leaking outside the container, but does not stop global host styles from entering the app. It also depends on native CSS `@scope` and CORS for external stylesheets.

Follow [Enable style isolation](/cookbook/enable-style-isolation) for the steps and [Style isolation](/concepts/style-isolation) for the boundaries.

## Which browsers are supported?

See [Browser support](/guide/browser-support) for the full capability-to-browser matrix. In short: [`isRuntimeCompatible()`](/api/is-runtime-compatible) checks only the base runtime requirements — `Proxy`, `TransformStream`, and `URL.createObjectURL` — while native ESM additionally needs dynamic import maps and style isolation needs CSS `@scope`, so evaluate each capability you enable separately.

## Why does entry code not run again on remount?

When the same instance remounts, qiankun rebuilds the entry DOM without scripts and reuses the lifecycles discovered during the first load. Both Classic and ESM call `mount(props)` again without executing entry top-level code.

Create framework instances, routers, and per-mount state inside `mount()`, then destroy them in `unmount()`. See [Lifecycle and props](/concepts/lifecycle-and-props).

## Where did the qiankun 2.x APIs and options go?

v3 removed or changed the global-state API, `start()` configuration, entry/container types, and legacy sandbox configuration. Do not reconstruct migration rules from scattered pages; use [Migrate from qiankun 2.x](/cookbook/migrate-from-2x) as the single source of truth.
