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

Note that [`isRuntimeCompatible()`](/api/is-runtime-compatible) only covers the three base-runtime features — it does **not** check dynamic import maps or CSS `@scope`. Whether to enable native ESM or style isolation must be evaluated separately against the table above.

## Firefox and native ESM

The ESM sandbox relies on injecting multiple import maps dynamically, which Firefox does not yet enable by default. To support Firefox, deliver micro-apps as classic scripts instead (for example a Webpack build); the base runtime and style isolation are unaffected on Firefox.

## Keep reading

- [Native ESM support](/concepts/esm-sandbox) — the full constraints and development notes for ESM micro-apps.
- [Style isolation](/concepts/style-isolation) — what `@scope` does and does not contain.
- [isRuntimeCompatible](/api/is-runtime-compatible) — the runtime detection API.
