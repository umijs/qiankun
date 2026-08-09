# Using the sandbox without qiankun

`@qiankunjs/sandbox` can be used directly by a browser host that does not use qiankun or its HTML loader. The package has two layers:

- `StandardSandbox` isolates JavaScript global writes and supports classic-script evaluation and ESM imports.
- `createSandbox()` adds lifecycle-managed browser integration: optional DOM containment, style isolation, timer and listener cleanup, and isolation plugins.

The lower-level `Compartment` class is also public for hosts that need a Compartment-shaped global and module-hook facade. It is not the recommended classic-script entry point.

## Install

```bash
pnpm add @qiankunjs/sandbox@rc
```

The package is browser-only. It depends on DOM APIs, blob URLs, and dynamically injected import maps, so it must not be initialized during Node.js or SSR rendering.

## Choose the right entry point

| Scenario | Entry point |
| --- | --- |
| Evaluate classic code or import ESM without DOM containment | `StandardSandbox` |
| Contain dynamic DOM, styles, timers, and listeners | `createSandbox()` with a container |
| Use lifecycle cleanup without DOM containment | `createSandbox()` without a container |
| Build a specialized Compartment host | `Compartment` |

`StandardSandbox` installs sandbox-local `window`, `self`, and `globalThis` references. A bare `Compartment` intentionally does not, because those browser globals are not part of the Compartment shape. In development, `Compartment.evaluateScript()` warns once when `window` has not been defined as a self-reference. The warning is diagnostic only: execution continues and `window.x = 1` can still reach the host.

## JavaScript-only usage

### Evaluate a classic script

```ts
import { StandardSandbox } from '@qiankunjs/sandbox';

const sandbox = new StandardSandbox('analytics-job', {
  reportId: 'weekly-42',
});

await sandbox.evaluateScript(
  `
    window.analyticsResult = {
      reportId,
      generatedAt: Date.now(),
    };
  `,
  { sourceURL: 'https://analytics.example/job.js' },
);

const view = sandbox.globalThis as Window & {
  analyticsResult?: { reportId: string; generatedAt: number };
};

console.log(view.analyticsResult);
console.log(Reflect.get(window, 'analyticsResult')); // undefined

sandbox.dispose();
```

The source runs as a native blob script. `sourceURL` is optional, but supplying the original URL makes stack traces and DevTools source views easier to understand.

### Import an ESM graph

```ts
const sandbox = new StandardSandbox('analytics-module');
const entryUrl = new URL('/modules/analytics-entry.js', document.baseURI).href;
const namespace = await sandbox.import(entryUrl);

console.log(namespace);
sandbox.dispose();
```

The default module base is `document.baseURI`, and the default fetch implementation is the native window fetch. `StandardSandbox` accepts module configuration in its fourth, Compartment-options argument. `createSandbox()` exposes `modules`, `resolveHook`, `importHook`, and the `loadHook` alias directly. The [sandbox plugins guide](/cookbook/sandbox-plugins) includes a precompiled-module example.

## Contain a browser widget

The following host loads a third-party classic script without depending on qiankun or the loader:

```html
<div id="widget-host"></div>
```

```ts
import { createSandbox } from '@qiankunjs/sandbox';

const container = document.querySelector<HTMLElement>('#widget-host')!;
const controller = createSandbox('support-widget', {
  container,
  styleIsolation: true,
});

try {
  // Activate cleanup plugins before the widget installs side effects.
  await controller.mount();

  const response = await fetch('https://widgets.example/support.js');
  if (!response.ok) {
    throw new Error(`Widget request failed: ${response.status}`);
  }

  const source = await response.text();
  await controller.instance.evaluateScript(source, {
    sourceURL: response.url,
  });
} catch (error) {
  // dispose() is safe after a partial mount or evaluation failure.
  await controller.dispose();
  throw error;
}
```

Application code sees a virtualized document:

- `document.body` points to the configured container.
- `document.head` points to a `<qiankun-head>` inside that container.
- Dynamically created scripts, styles, and stylesheet links are intercepted before insertion.
- `styleIsolation: true` scopes styles to `[data-name="support-widget"]`.

The host still owns the application lifecycle. If the widget exports an unmount function, call it before releasing sandbox effects.

```ts
const widgetView = controller.instance.globalThis as Window & {
  widgetUnmount?: () => void | Promise<void>;
};
await widgetView.widgetUnmount?.();
await controller.unmount();

// A later activation rebuilds the sandbox integrations.
await controller.mount();

// Terminal owner cleanup; this controller cannot be reused afterward.
await controller.dispose();
container.replaceChildren();
```

`unmount()` does not clear the container and does not infer an application's business teardown. `dispose()` may be called while mounted and is idempotent.

## Replace the container between mounts

Pass a getter when the host creates a fresh element for each activation:

```ts
let currentContainer = document.querySelector<HTMLElement>('#widget-a')!;

const controller = createSandbox('support-widget', {
  container: () => currentContainer,
  styleIsolation: true,
});

await controller.mount();
await controller.unmount();

currentContainer = document.querySelector<HTMLElement>('#widget-b')!;
await controller.mount();
```

The getter is resolved again for the next mount. Alternatively, `mount(container)` can override the configured container for one activation.

## Use lifecycle cleanup without DOM containment

When no container is supplied, `createSandbox()` omits the dynamic-DOM plugin but retains timer, window-listener, and history cleanup:

```ts
const controller = createSandbox('background-integration');

await controller.mount();
await controller.instance.evaluateScript(`
  window.addEventListener('message', () => {});
  window.setInterval(() => {}, 1000);
`);

await controller.unmount();
await controller.dispose();
```

Mount before evaluating the source. Side effects created before `mount()` are outside the mount-phase tracking window. Style isolation requires a container; `createSandbox('name', { styleIsolation: true })` throws a `TypeError`.

## Container preparation

`createSandbox()` prepares configured containers automatically. The public helper is intended for advanced hosts that assemble the lower-level pieces themselves:

```ts
import { prepareSandboxContainer } from '@qiankunjs/sandbox';

const container = document.querySelector<HTMLElement>('#widget-host')!;
const { styleIsolation, cleanup } = prepareSandboxContainer(container, 'support-widget');

console.log(styleIsolation.appName); // support-widget
console.log(styleIsolation.scopeRoot); // [data-name="support-widget"]

// Release the protocol state when the custom host is permanently torn down.
cleanup();
```

Preparation performs three related operations:

1. Sets `data-name="support-widget"` on the container.
2. Ensures a `<qiankun-head>` element for virtualized head insertions.
3. Returns the exact `{ appName, scopeRoot }` pair required by style isolation.

Cleanup only reverts state created by that call. It keeps a pre-existing `<qiankun-head>`, restores a previous `data-name`, and does not overwrite a later host change. It is safe to call more than once.

## Configuration reference

```ts
const controller = createSandbox(appName, {
  container,
  provisionContainerHead,
  globals,
  incubatorContext,
  modules,
  resolveHook,
  importHook,
  loadHook,
  plugins,
  styleIsolation,
  fetch,
  nodeTransformer,
  compartmentOptions,
});
```

| Option | Purpose |
| --- | --- |
| `container` | Enables DOM containment; accepts an element or a getter |
| `provisionContainerHead` | Whether the sandbox provisions a `<qiankun-head>` at mount time when the container lacks one, default `true`; pass `false` when an external pipeline (such as qiankun's streaming loader) materializes the container structure from the entry HTML |
| `globals` | Adds values or property descriptors to the sandbox global |
| `incubatorContext` | Selects the host window through which global reads fall through |
| `modules` | Supplies a table of predefined modules |
| `resolveHook` | Resolves module specifiers |
| `importHook` / `loadHook` | Loads custom module descriptors; `loadHook` is an alias |
| `plugins` | Appends custom isolation plugins after the built-in preset |
| `styleIsolation` | Enables runtime CSS scoping; requires `container` |
| `fetch` | Overrides the fetch used by ESM and dynamic assets |
| `nodeTransformer` | Replaces the default dynamic asset transformation |
| `compartmentOptions` | Provides lower-level host options such as `moduleHost` |

Top-level module options take precedence over duplicate values in `compartmentOptions`. The controller exposes the normalized `instance`, `nodeTransformer`, optional `styleIsolation`, and the `mount`, `unmount`, and `dispose` lifecycle methods.

For custom globals and plugins, see [Extending sandbox isolation](/cookbook/sandbox-plugins).

## Why the default transformer matters

The dynamic-DOM plugin intercepts a script element, but interception alone does not isolate its JavaScript. The default transformer fetches a classic script, wraps it with the current Compartment's classic-script transformer, and gives the browser a blob URL. This is the path that keeps `window.someValue = ...` inside the sandbox.

The same transformer processes dynamic styles and stylesheet links, applying the internal style-isolation options when enabled. It uses `document.baseURI` as the standalone asset base.

Advanced hosts can replace it:

```ts
const controller = createSandbox('trusted-widget', {
  container,
  nodeTransformer: (node) => node,
});
```

This identity transformer is intentionally shown as a warning, not a recommended default. It disables classic-script wrapping, and a dynamically appended script may execute against the host window. It also bypasses the default style transformation. Supply a custom transformer only when it implements equivalent controls or every affected asset is trusted.

If an external HTML pipeline needs to transform nodes before insertion, use `controller.nodeTransformer` rather than the raw callback passed in options. The controller version has already been enriched with the Compartment, fetch implementation, classic-script wrapper, and style-isolation configuration.

Its output also carries an ownership consequence: the controller's transformer marks each node as finished pipeline product, so the sandbox's patched insertion points let it through natively instead of routing it into the dynamic transpilation pipeline a second time. In particular, a `<style>` or `<link>` prepared this way is **not** recorded in the sandbox's dynamic-stylesheet ledger — it survives `unmount()` and is not re-attached on a later `mount()`. Its lifecycle belongs to the pipeline that prepared it: remove or re-insert it yourself if your embedding unmounts and remounts. Styles that sandboxed code injects at runtime (through the patched DOM methods, without the mark) keep the full ledger lifecycle — removed at unmount, restored at remount.

## Understand the isolation boundary

The sandbox prioritizes browser compatibility and shared object identity. Its membrane is deliberately non-transitive.

```ts
const sharedSettings = { theme: 'light' };
const sandbox = new StandardSandbox('settings-demo', { sharedSettings });

await sandbox.evaluateScript(`
  window.localFlag = true;
  sharedSettings.theme = 'dark';
`);
```

After evaluation:

- `window.localFlag` in the host is still `undefined` because the global property write was isolated.
- `sharedSettings.theme` is `"dark"` in both host and sandbox because the same object crossed the boundary.
- DOM nodes, events, functions, and library instances likewise keep their identity; `===` and `instanceof` continue to work.

This model is not suitable for hostile code. It does not harden objects, freeze intrinsics, create another origin, or impose an iframe/Worker callable boundary. Use those browser isolation mechanisms when code must not access host capabilities. The [Compartment Alignment RFC](https://github.com/umijs/qiankun/blob/next/docs/rfcs/compartment-alignment.md) explains this design boundary in detail.

## Content Security Policy

The classic evaluator and ESM engine avoid `eval` and `new Function`, so they do not require `'unsafe-eval'`. They execute generated code through blob URLs instead.

At minimum, the relevant CSP directives must account for:

- `blob:` in `script-src` for classic and ESM execution;
- permission for the inline `script[type="importmap"]` injected by the ESM engine;
- the remote origins in `connect-src`, because external scripts and modules are fetched;
- `blob:` in `style-src` when style isolation converts external stylesheets;
- the page's nonce, hash, or inline-style policy for dynamically created `<style>` elements.

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' blob:; style-src 'self' 'unsafe-inline' blob:; connect-src 'self' https://widgets.example
```

This illustrative policy permits the runtime import map and widget-created inline styles. The exact policy depends on the execution path and widget, and cross-origin fetches must also satisfy CORS. Adding `'unsafe-eval'` does not fix a missing blob, inline-script, or network-source permission and is not required by this package.

## Production checklist

- Use `StandardSandbox`, not bare `Compartment`, for classic scripts.
- Call `mount()` before application code installs timers or listeners.
- Keep the default transformer unless a replacement preserves classic-script isolation.
- Treat application teardown and container clearing as host responsibilities.
- Call `dispose()` on permanent removal and on partial-load failure.
- Test the actual CSP and cross-origin asset policy in the target browser set.
- Use iframe, Worker, or origin isolation for untrusted code.
