# isRuntimeCompatible

Check whether the current browser provides the minimum capabilities required by the qiankun v3 runtime. Use it before loading an app when the host needs to show a fallback for unsupported browsers.

## Signature

```ts
function isRuntimeCompatible(): boolean;
```

The check is synchronous, takes no arguments, and does not modify runtime state.

## What it checks

`isRuntimeCompatible()` returns `true` only when these three APIs are available:

| Capability | Why qiankun needs it |
| --- | --- |
| `Proxy` | JavaScript isolation |
| `TransformStream` | Streaming HTML-entry loading |
| `URL.createObjectURL` | Isolated script execution |

Use the probe instead of maintaining a browser-version list in application code.

## Usage

```ts
import { isRuntimeCompatible, loadMicroApp } from 'qiankun';

const container = document.getElementById('micro-app-slot');
if (!container) throw new Error('micro-app-slot not found');

if (!isRuntimeCompatible()) {
  container.textContent = 'Please use a supported browser.';
} else {
  const microApp = loadMicroApp({
    name: 'account-app',
    entry: 'https://account.example.com',
    container,
  });

  void microApp.mountPromise.catch((error: unknown) => {
    console.error('Failed to mount account-app', error);
  });

  // Keep microApp and call microApp.unmount() when this view is removed.
}
```

Route-driven hosts can run the same check before `registerMicroApps` and `start`.

## What it does not check

The result only covers the three core runtime APIs above. It does not verify:

- the extra browser behavior required by [native ESM applications](/concepts/esm-sandbox);
- CSS `@scope` support for optional [style isolation](/concepts/style-isolation);
- your Content Security Policy, CORS headers, entry URL, or asset availability.

In particular, the native ESM path requires multiple dynamically injected import maps. Firefox does not enable that behavior by default, even when `isRuntimeCompatible()` returns `true`; ship classic scripts instead (for example, Webpack builds) when Firefox support is required.

## Related

- [`loadMicroApp`](/api/load-micro-app)
- [Native ESM support](/concepts/esm-sandbox)
- [Browser support](/guide/browser-support)
- [Getting started](/guide/getting-started)
