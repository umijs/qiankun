# @qiankunjs/shared

Base utilities shared by `loader`/`sandbox`/`qiankun`: asset transpilers, fetch decorators, module resolution, error reporting, and the **ESM-sandbox engine**. No internal `@qiankunjs/*` dependencies — keep it at the bottom of the graph (it must never import `sandbox` or `loader`).

## STRUCTURE

```
shared/
├── assets-transpilers/   # transform script/link/style DOM nodes for the micro-frontend runtime
│   ├── index.ts          # transpileAssets(node, baseURI, opts) — dispatch by tagName
│   ├── script.ts         # classic scripts → blob-URL wrapping, sandbox scope
│   ├── link.ts           # external stylesheets → blob-<link> (enables @scope); preload/URL rewriting; cache
│   └── style.ts          # inline <style> → CSS @scope rewriting (runtime style isolation)
├── esm-sandbox/          # per-instance native-ESM execution engine (see below)
├── fetch-utils/          # higher-order fetch decorators
│   ├── makeFetchCacheable.ts   # mini LRU, clones responses, prunes failures
│   ├── makeFetchRetryable.ts   # automatic retries
│   └── makeFetchThrowable.ts   # non-2xx → throw
├── module-resolver/      # shared-dependency canonicalization (semver via <script type="dependencymap">)
├── reporter/             # QiankunError + logger (warn/…)
├── deferred-queue/       # async task sequencing (defer-script ordering)
├── common.ts / utils.ts  # Deferred, defineProperty, hasOwnProperty, keys, resolveUrl, …
└── typings.d.ts
```

## ESM-SANDBOX (`esm-sandbox/`, the largest subsystem here)

`EsmSandboxEngine` is the replaceable mechanism behind the sandbox package's Compartment module facade; it must not leak into loader or qiankun interfaces. It runs a micro-app's `<script type="module">` graph inside the sandbox membrane without a bundler. Pipeline: resolve through `resolveHook` → obtain and memoize a descriptor from `modules` or `importHook` / `loadHook` → fetch/lexer-rewrite source when needed → give modules synthetic specifiers → inject an **import map** → evaluate in dependency order → keep dunder-globals (`__qk_track`) live on later global writes.

| File | Responsibility |
| --- | --- |
| `engine.ts` | `EsmSandboxEngine` — module-graph orchestration, redeclaration probing, in-order eval, dynamic `import()` |
| `types.ts` | Public structural module contracts: hooks, descriptors, `ModuleSource`, Compartment facade |
| `lexer.ts` | CSP-safe `es-module-lexer/js` wrapper; preparation Promise is already resolved |
| `rewrite.ts` | `rewriteModule`, `buildSyntheticSpecifier`, `esmInternalPrefix`, `runtimeModuleSubpath` |
| `import-bindings.ts` | import statement binding analysis |
| `identifier-scan.ts` | `scanReferencedGlobals`, `isLiveBindableDunderName` — which globals a module touches |
| `import-map-registry.ts` | `injectImportMapEntries`, `resetImportMapRegistry` — the dynamic import map |
| `instance-registry.ts` | Per-engine instance/view lookup used by generated runtime modules |
| `vite-client-stub.ts` | `isViteClientUrl`, `viteClientStubSource` — stubs Vite dev-client HMR |
| `source-map.ts` | rewritten-module source-map fixups |

> ESM sandbox depends on **dynamically injected import maps** → unsupported on Firefox (see `e2e/README.md`).

## WHERE TO LOOK

| Task | File | Notes |
| --- | --- | --- |
| Transpile any asset node | `assets-transpilers/index.ts` | `transpileAssets()` — the single dispatch entry |
| Classic script sandboxing | `assets-transpilers/script.ts` | blob-URL wrap + sandbox scope |
| Style isolation | `assets-transpilers/style.ts` + `link.ts` | CSS `@scope` rewrite; external CSS → blob-`<link>` |
| Fetch enhancements | `fetch-utils/*` | decorator chain (compose with `make*` HOFs) |
| Shared dependency reuse | `module-resolver/index.ts` | `moduleResolver(url, container, head)` semver match |
| ESM module execution | `esm-sandbox/engine.ts` | `EsmSandboxEngine` (see section above) |
| Module facade contracts | `esm-sandbox/types.ts` | The only ESM mechanism types cross-package callers should consume |
| Promise/util helpers | `utils.ts` | `Deferred`, `keys`, `defineProperty`, `hasOwnProperty` |

## KEY PATTERNS

### Module hooks and descriptors

- `resolveHook(specifier, referrer)` synchronously returns a canonical full specifier.
- A `modules` descriptor wins before `importHook`; descriptors may provide precompiled `ModuleSource`, a namespace, or a redirect specifier.
- `importHook(fullSpecifier)` is Promise-memoized, including failures. Probe-driven rebuilds reuse its result and do not call the hook again, so hooks must be idempotent.
- A precompiled `ModuleSource` is already linked/re-written and skips the default fetch and rewrite pipeline.
- Redirect cycles must fail deterministically; namespace descriptors keep their object identity.

The engine may be imported by the sandbox implementation itself, but do not add it to `LoaderOpts`, asset-transpiler options, or other cross-package interfaces. Those use `CompartmentModuleFacade`.

### Higher-order fetch (decorator composition)

```typescript
const enhancedFetch = makeFetchCacheable(makeFetchRetryable(makeFetchThrowable(fetch)));
```

### Deferred promise

```typescript
const d = new Deferred<void>();
d.resolve();
await d.promise;
```

### DOM as metadata store

- `data-src` — original source URL of a transpiled node.
- `data-consumed` — marks an already-processed element.

## EXPORTS

`src/index.ts` re-exports everything: `./assets-transpilers`, `./utils`, `./common`, `./module-resolver`, `./reporter`, `./esm-sandbox`, the three `fetch-utils/make*`, and `./deferred-queue`. Notable named exports: `transpileAssets`, the Compartment-shaped module contracts, the internal `EsmSandboxEngine` mechanism, `moduleResolver`, `makeFetchCacheable`, `makeFetchRetryable`, `makeFetchThrowable`, `Deferred`, `QiankunError`, `warn`.
