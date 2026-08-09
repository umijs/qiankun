# Native ESM support

qiankun can run a micro-app delivered as native ES modules, including the module graph served by Vite during development. The app keeps native `import`/`export` semantics while using the same per-app JavaScript isolation as classic applications.

You do not need to produce a UMD library or expose lifecycles on `window` for this path.

## When qiankun uses it

A `<script type="module">` in the micro-app entry uses the native ESM path when `sandbox` is enabled. Inline and external module scripts are supported, and classic scripts in the same HTML continue to use the classic path.

The official Vite plugin configures the development server and marks the entry module in production builds. Vite development HTML may omit an explicit `entry` marker; in that case, the ESM engine selects the entry from lifecycle exports. In normal projects, prefer the plugin over editing generated HTML by hand.

Turning off `sandbox` also turns off this isolated ESM path; it is not an ESM compatibility fallback.

## The micro-app contract

The entry module exports `bootstrap`, `mount`, and `unmount`, with an optional `update`. Named exports and a default lifecycle object are both supported.

```js
let app;

export async function bootstrap() {}

export async function mount(props) {
  app = createApp();
  app.mount(props.container.querySelector('#root'));
}

export async function unmount() {
  app.unmount();
  app = undefined;
}
```

Create per-mount framework instances, routers, and stores in `mount`, then release them in `unmount`. Render into `props.container` so remounts and multiple instances do not depend on global selectors.

## Runtime behavior

- Native module behavior is preserved, including top-level `await`, circular dependencies, live bindings, and module evaluation order.
- ESM is strict mode. An implicit global assignment such as `feature = true` throws `ReferenceError`; use an explicit declaration or `window.feature`.
- A module's top-level code runs once for an app instance. After `unmount`, a remount calls `mount` again but does not recreate module-scope state.
- A failure in the selected entry module rejects application loading. Route-registered applications report that failure through single-spa's global handler; `loadMicroApp` reports it through the instance lifecycle promises. An unrelated non-entry module script can be logged and skipped instead of failing the application.

Do not use module-scope initialization as a substitute for `mount`. The lifecycle boundary is what makes cleanup and remounting predictable.

## Vite development behavior

qiankun supports the native module graph emitted by the Vite dev server, but it intentionally does not provide Vite's normal in-app HMR connection. Develop with a manual page refresh rather than assuming hot updates or React Fast Refresh will preserve state.

Vite can inject CSS from module top-level code. Because module top-level code does not rerun on remount, that CSS may be absent after the app has been unmounted and mounted again. Test remounts explicitly if the app relies on JavaScript-injected styles.

See [Prepare a Vite app](/cookbook/prepare-a-vite-app) for the supported setup and development workflow.

## Compatibility and diagnostics

- Recent Chromium/Edge and Safari releases support the required browser capability; see [Browser support](/guide/browser-support) for the version matrix. Firefox does not enable it by default, so use the Classic/Webpack delivery path when Firefox support is required.
- A Content Security Policy must allow `blob:` scripts. qiankun's ESM path does not require `'unsafe-eval'`.
- Modules and their assets must be served with correct CORS headers and MIME types. JSON, CSS, and WASM imports with type attributes (`with { type: … }`) may retain native, shared-page behavior rather than full per-app isolation.
- Production stack traces can contain `blob:` URLs instead of source file URLs. Keep source maps and configure error reporting to map those frames back to deployed sources.

Use the classic/UMD path when its browser reach or development behavior better fits the application. For implementation details, see [ESM sandbox internals](/internals/esm-sandbox) and the [ESM sandbox RFC](https://github.com/umijs/qiankun/blob/next/docs/rfcs/esm-sandbox.md).
