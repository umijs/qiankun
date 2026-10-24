# Browser support

qiankun 3 targets modern browsers and does not support IE. The exact requirements depend on which capabilities you enable: the base runtime is the most permissive, while native ESM and style isolation each rely on newer browser features. This page is the single source of truth for browser compatibility; other pages defer to it.

## Capabilities and their requirements

| Capability | Browser features it relies on | Browser requirement |
| --- | --- | --- |
| Base runtime (loading, classic script execution, JS sandbox) | `Proxy`, `TransformStream`, `URL.createObjectURL` | Any recent mainstream Chrome, Edge, Safari, or Firefox |
| Native ESM micro-apps ([Native ESM support](/concepts/esm-sandbox)) | Dynamically injected import maps | Chrome/Edge 133+, Safari 18.4+; **not supported in Firefox by default** |
| Style isolation ([Style isolation](/concepts/style-isolation)) | Native CSS `@scope`, with no polyfill or fallback | Chrome/Edge 118+, Safari 17.4+, Firefox 128+ |

The rows stack: if you only ship classic micro-apps without style isolation, the first row is all that matters; each additional capability tightens the browser matrix by its own row.

## Prefer runtime detection over version lists

The base runtime can be detected at runtime, so there is no need to maintain a browser version list yourself:

```ts
import { isRuntimeCompatible } from 'qiankun';

if (isRuntimeCompatible()) {
  // load micro-apps
}
```

Note that [`isRuntimeCompatible()`](/api/is-runtime-compatible) only covers the three base-runtime features — it does **not** check dynamic import maps or CSS `@scope`. Evaluate style isolation separately against the table above. qiankun automatically checks dynamic multiple-import-map support before loading the first sandboxed ESM module; no additional detection API call is needed.

## ESM loading capability check

In a separate same-origin `about:blank` iframe, qiankun injects an import map and executes a module, then adds a second map and executes another module. This avoids changing the host document's mappings. The probe uses local blobs without fetching external resources. Its result is reused within the host document; Classic scripts do not trigger the check. The synchronous behavior of `isRuntimeCompatible()` stays the same.

Handle check failures through `mountPromise`:

```ts
import { loadMicroApp, QiankunError } from 'qiankun';

const app = loadMicroApp({ name, entry, container });
void app.mountPromise.catch((error: unknown) => {
  if (error instanceof QiankunError && error.code === 'esm-unsupported') {
    // Ask the user to use a supported browser, or select a Classic build entry.
    return;
  }
  console.error(error);
});
```

[esm-unsupported: Required ESM sandbox capabilities are unavailable](/errors/esm-unsupported) means a probe module could not use its map. An inaccessible iframe, initialization failure, enforced CSP restriction on probe scripts, or a check exceeding five seconds produces [esm-capability-check-failed: ESM capability check could not complete](/errors/esm-capability-check-failed). The latter does not establish whether the browser supports the ESM sandbox. The check does not replace CSP, CORS, or network checks for micro-app resources.

## Firefox and native ESM

The ESM sandbox relies on injecting multiple import maps dynamically, which Firefox does not yet enable by default. qiankun 3.0 provides no ESM sandbox fallback, so ESM micro-apps require a browser with native support for dynamically injected multiple import maps. See the [ESM sandbox RFC](https://github.com/umijs/qiankun/blob/next/docs/rfcs/esm-sandbox.md) for the es-module-shims evaluation and the decision not to include it.

To support Firefox, deliver micro-apps as classic scripts instead (for example a Webpack build); the base runtime and style isolation are unaffected on Firefox.

## Keep reading

- [Native ESM support](/concepts/esm-sandbox) — the full constraints and development notes for ESM micro-apps.
- [Style isolation](/concepts/style-isolation) — what `@scope` does and does not contain.
- [isRuntimeCompatible](/api/is-runtime-compatible) — the runtime detection API.
