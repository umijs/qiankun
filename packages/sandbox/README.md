# @qiankunjs/sandbox

`@qiankunjs/sandbox` provides qiankun's browser sandbox as a standalone package. It can isolate classic-script and ESM global writes, and can optionally contain dynamic DOM and styles inside an application container. It does not require `qiankun` or `@qiankunjs/loader`.

> This package is browser-only. It uses DOM APIs, blob URLs, and dynamically injected import maps; it does not support Node.js or SSR execution.

## Choose an API layer

| Need | API | What it provides |
| --- | --- | --- |
| JavaScript isolation only | `StandardSandbox` | A safe preset for classic scripts and ESM, including `window`/`self` self-references |
| Low-level Compartment mechanics | `Compartment` | A Compartment-shaped global and module-hook facade for advanced hosts |
| Browser containment and lifecycle | `createSandbox()` | `StandardSandbox` plus optional DOM/style containment, timer and listener cleanup, and isolation plugins |

Use `StandardSandbox` for direct classic-script evaluation. A bare `Compartment` deliberately does not install a sandboxed `window` self-reference. Calling `Compartment.evaluateScript()` without defining one emits a development warning, but it does not change execution semantics: code such as `window.answer = 42` may write to the host window.

## JavaScript isolation

### Classic scripts

```ts
import { StandardSandbox } from '@qiankunjs/sandbox';

const sandbox = new StandardSandbox('report-widget', {
  tenantId: 'acme',
});

await sandbox.evaluateScript(
  `
    window.reportState = { tenantId };
  `,
  { sourceURL: 'https://widgets.example/report.js' },
);

console.log(Reflect.get(sandbox.globalThis, 'reportState')); // { tenantId: 'acme' }
console.log(Reflect.get(window, 'reportState')); // undefined

sandbox.dispose();
```

`evaluateScript()` executes through a native blob script. It does not use `eval` or `new Function`.

### ESM

```ts
const sandbox = new StandardSandbox('report-module');
const namespace = await sandbox.import(new URL('./report-entry.js', document.baseURI).href);

console.log(namespace);
sandbox.dispose();
```

Relative module resolution defaults to `document.baseURI`. `StandardSandbox` accepts custom module tables and hooks through its fourth, Compartment-options argument; `createSandbox()` promotes `modules`, `resolveHook`, `importHook`, and `loadHook` to top-level options. See the [sandbox plugins guide](../../docs/cookbook/sandbox-plugins.md) for an advanced example.

## Full browser sandbox

Pass a container to `createSandbox()` to enable document virtualization and dynamic DOM interception. Set `styleIsolation: true` to scope application styles to that container.

```ts
import { createSandbox } from '@qiankunjs/sandbox';

const container = document.querySelector<HTMLElement>('#widget')!;
const controller = createSandbox('report-widget', {
  container,
  styleIsolation: true,
});

// Mount before application code so timers and listeners are tracked.
await controller.mount();

const response = await fetch('/vendor/report-widget.js');
const source = await response.text();
await controller.instance.evaluateScript(source, {
  sourceURL: response.url,
});

// Releases active plugin effects and keeps the controller available for remount.
await controller.unmount();
await controller.mount();

// Terminal cleanup. A disposed controller cannot be mounted or evaluated again.
await controller.dispose();
```

When `container` is a function, it is resolved again for each mount. This supports hosts that replace the mount element between activations:

```ts
let currentContainer = document.querySelector<HTMLElement>('#first')!;

const controller = createSandbox('report-widget', {
  container: () => currentContainer,
});

await controller.mount();
await controller.unmount();

currentContainer = document.querySelector<HTMLElement>('#second')!;
await controller.mount();
```

Calling `createSandbox('name')` without a container creates the JS-only preset. Its timer, window-listener, and history plugins can be activated with `mount()` without providing an arbitrary DOM element, and an element passed to `mount()` is left untouched — container preparation belongs to the container-backed preset. `styleIsolation: true` requires a configured container.

### Container preparation

`createSandbox()` establishes its container contract automatically. Advanced hosts that compose the lower-level APIs can prepare a container directly:

```ts
import { prepareSandboxContainer } from '@qiankunjs/sandbox';

const { styleIsolation, cleanup } = prepareSandboxContainer(container, 'report-widget');

console.log(styleIsolation);
// { appName: 'report-widget', scopeRoot: '[data-name="report-widget"]' }

// Later, release only the attributes and virtual head created by this call.
cleanup();
```

The helper sets `data-name`, ensures a `<qiankun-head>` mount point for the sandboxed `document.head`, and returns the matching style-isolation options. Cleanup is idempotent: it preserves an existing virtual head, restores a previous `data-name`, and does not overwrite a later host update to that attribute.

## Default asset transformation

The default `nodeTransformer` is isolation-preserving. A classic `<script>` dynamically appended by sandboxed code is fetched, wrapped with the controller's classic-script transformer, and executed through a blob URL. Dynamic styles and stylesheet links go through the same pipeline, including style scoping when enabled.

You may provide a custom transformer. Returning each node unchanged is not a neutral optimization:

```ts
const controller = createSandbox('trusted-widget', {
  container,
  nodeTransformer: (node) => node,
});
```

An identity transformer disables the default classic-script wrapping. A dynamically appended classic script can then execute against the host global. Use this override only when the host supplies equivalent isolation or fully trusts every script. The internal asset transpiler is intentionally not a public API; the supported extension point is `nodeTransformer`.

For a custom HTML loading pipeline, use `controller.nodeTransformer`. It is the fully configured transformer shared with dynamic DOM interception, including the current Compartment, fetch implementation, classic-script wrapper, and style-isolation options.

## Lifecycle ownership

- `mount(container?)` activates or rebuilds timer, listener, history, DOM, and user-plugin effects. The argument overrides the configured container for that mount.
- `unmount()` releases active effects and records any state required for a later mount. It does not run an application's own unmount function or clear caller-owned DOM.
- `dispose()` permanently releases plugin effects, generated module resources, global accessors, and container preparation. It is safe to call more than once.

Mount the controller before evaluating application code when its timers and listeners must participate in cleanup. Run the application's own teardown before `unmount()` or `dispose()`, and clear application DOM according to the host's ownership rules.

## Isolation boundary

This package is a compatibility sandbox, not a security boundary for hostile code.

- Writes to the sandbox global stay local to that sandbox.
- Reads fall through to the host window unless a value is configured or shadowed.
- The membrane is non-transitive: objects crossing the boundary retain their identity. `===`, `instanceof`, DOM nodes, events, and shared library instances continue to work.
- Mutating a host object obtained through read-through also mutates that shared object. Only the global property write is isolated.
- DOM containment redirects the sandboxed `document.head` and `document.body`; it does not create a separate browser realm or origin.

Use an iframe, Worker, or another origin/callable boundary for untrusted code. See the [Compartment Alignment RFC](../../docs/rfcs/compartment-alignment.md) for the rationale behind the write-isolation and identity-sharing model.

## Content Security Policy

Classic and ESM execution do not require `'unsafe-eval'`. They do require the page's `script-src` policy to allow `blob:` URLs. The ESM engine also injects an inline `script[type="importmap"]`, which must be permitted by the page's script policy. ESM and external classic assets are fetched first, so their origins must satisfy CORS and `connect-src` as well.

Style isolation can create blob stylesheet URLs; allow `blob:` in `style-src` when external styles are used. Dynamically created inline `<style>` elements remain subject to the page's normal nonce, hash, or inline-style policy.

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' blob:; style-src 'self' 'unsafe-inline' blob:; connect-src 'self' https://widgets.example
```

This illustrative policy allows the runtime import map and a widget-created inline style. Tighten it to the assets and execution path the host actually uses. Do not add `'unsafe-eval'` for this package.

## Further reading

- [Standalone sandbox cookbook](../../docs/cookbook/standalone-sandbox.md)
- [Extending sandbox isolation](../../docs/cookbook/sandbox-plugins.md)
- [Standalone Sandbox RFC](../../docs/rfcs/standalone-sandbox.md)
