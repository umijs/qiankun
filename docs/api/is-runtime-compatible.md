# isRuntimeCompatible

A runtime capability probe that reports whether the current browser can run the qiankun 3.0 runtime. New in v3, it lets you gate bootstrapping and present a graceful fallback on browsers that lack the primitives qiankun depends on.

## Signature

```ts
function isRuntimeCompatible(): boolean
```

`isRuntimeCompatible` is re-exported by `qiankun` from [`@qiankunjs/shared`](/api/index). It takes no arguments and returns synchronously.

```ts
import { isRuntimeCompatible } from 'qiankun';

if (isRuntimeCompatible()) {
  // safe to register and start micro-apps
}
```

## What it checks

The probe verifies that three globals the v3 runtime relies on are present as callable APIs:

```ts
typeof Proxy === 'function' &&
  typeof TransformStream === 'function' &&
  typeof URL?.createObjectURL === 'function';
```

| Capability | Used for |
| --- | --- |
| `Proxy` | The Proxy-membrane [JS sandbox](/concepts/js-sandbox) that gives each micro-app an isolated `window`/`document` view. |
| `TransformStream` | The streaming [HTML-entry loader](/concepts/html-entry-loading), which pipes the entry HTML through a transform stream as it arrives. |
| `URL.createObjectURL` | Blob URLs, which back both the classic script path and the [ESM sandbox](/concepts/esm-sandbox). |

::: info What it does not check
The probe is intentionally minimal. It is a feature-detection check for these three primitives only. It does **not** test for import maps, dynamic `import()`, or any ESM-specific capability, and it does not read the user-agent string or compare version numbers.
:::

## Browser support

The strictest of the three requirements is `TransformStream`, so it sets the practical floor. As an approximate guide, `TransformStream` became broadly available around:

- Chrome / Edge 67+
- Firefox 102+
- Safari 14.1+

Treat these as a rough baseline rather than an exact matrix. `Proxy` and `URL.createObjectURL` have been available for longer, so in practice a browser that supports `TransformStream` will pass all three checks. When in doubt, call `isRuntimeCompatible()` at runtime instead of maintaining a version list.

## Usage

Call the probe before you register or start micro-apps, and render a fallback when it returns `false`.

```ts
import { registerMicroApps, start, isRuntimeCompatible } from 'qiankun';

if (isRuntimeCompatible()) {
  registerMicroApps([
    {
      name: 'app1',
      entry: 'https://app1.example.com',
      container: document.getElementById('subapp-container')!,
      activeRule: '/app1',
    },
  ]);

  start();
} else {
  document.getElementById('subapp-container')!.innerHTML =
    'Your browser is not supported. Please upgrade to a modern version.';
}
```

The check is cheap and synchronous, so it is safe to run it once during your shell's bootstrap sequence.

## ESM sandbox has stricter needs

`isRuntimeCompatible` reflects the requirements of the core runtime. Micro-apps that ship native ES modules (`<script type="module">`) go through the [ESM sandbox](/concepts/esm-sandbox), which additionally depends on **dynamically injected import maps**. Passing `isRuntimeCompatible()` does not by itself guarantee that path will work.

::: warning Firefox and import maps
Firefox does not support multiple dynamically injected import maps by default (it is gated behind the `dom.multiple_import_maps.enabled` flag). For guaranteed support on Firefox or older browsers, adopt [es-module-shims](/concepts/esm-sandbox) as a supported base rather than relying on native import maps. Chrome/Edge and recent Safari support the feature natively.
:::

## Related

- [API reference overview](/api/index)
- [start](/api/start)
- [registerMicroApps](/api/register-micro-apps)
- [The ESM sandbox](/concepts/esm-sandbox)
- [The JS sandbox](/concepts/js-sandbox)
