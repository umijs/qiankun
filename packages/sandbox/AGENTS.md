# @qiankunjs/sandbox

JS isolation engine: a Compartment-shaped facade owns the Proxy **Membrane**, classic-script evaluator, and module hooks. DOM behavior lives in independently registered **IsolationPlugin** instances. Depends only on `@qiankunjs/shared`.

## STRUCTURE

```
sandbox/
├── core/
│   ├── sandbox/          # createSandbox() + StandardSandbox preset + container protocol
│   ├── membrane/         # Proxy wrapper for global (window/document) isolation
│   ├── compartment/      # globals + module hooks + blob classic evaluation facade
│   ├── globals.ts        # global property definitions
│   └── esm-globals.ts    # esmDestructurableGlobals — globals the ESM engine may destructure/rebind
├── patchers/             # public IsolationPlugin protocol + built-in plugin presets
│   ├── dynamicAppend/    # appendChild/insertBefore interception → redirect to app container
│   ├── windowListener.ts # event listener tracking
│   ├── interval.ts       # timer tracking
│   └── historyListener.ts
└── consts.ts             # qiankunHeadTagName / qiankunBodyTagName, nativeGlobal, nativeDocument
```

## WHERE TO LOOK

| Task | File | Notes |
| --- | --- | --- |
| Create sandbox | `core/sandbox/index.ts` | Builds a `StandardSandbox`, installs the JS-only or DOM preset, and returns mount/unmount/dispose |
| Prepare container | `core/sandbox/container.ts` | Owns `<qiankun-head>`, `data-name`, style scope, and cleanup contracts |
| Proxy logic | `core/membrane/index.ts` | Write → local target; Read → local → configured globals → host window |
| Compartment facade | `core/compartment/index.ts` | Owns the membrane, module facade, and CSP-safe blob classic evaluation |
| Plugin protocol | `patchers/types.ts` | Public `IsolationPlugin`, context, `Free`, and `Rebuild` contracts |
| Built-in plugins | `patchers/index.ts` | Data-driven Standard/Snapshot presets; user plugins append after these |
| DOM interception | `patchers/dynamicAppend/forStandardSandbox.ts` | Redirects dynamic script/style/link to app container |
| Side-effect cleanup | `patchers/*.ts` | Each patcher returns a `free()` called on unmount |
| ESM globals contract | `core/esm-globals.ts` | Consumed by `shared/esm-sandbox` engine, passed as `globalsBaseSet` |

## KEY PATTERNS

### Membrane (Proxy)

- **Writes** are trapped and stored on a local `target` object (the sandbox's own globals).
- **Reads** check local target → configured globals → fall back to the real host window.
- **Native rebinding**: `fetch`, `console`, etc. are rebound to the real receiver to avoid "Illegal invocation".
- `latestSetProp` records the last global the entry script assigned — that's how the loader recovers a classic app's exported lifecycles when no explicit export exists.
- **Non-transitive by design**: unlike full membranes (es-membrane, Salesforce near-membrane), only the global (and document view) entry point is proxied — objects crossing the boundary keep their raw identity (`===`/`instanceof` hold across it). This is qiankun's deliberate isolation stance (isolate writes, share identity, for DOM compatibility and performance), not a gap to fill. Do NOT wrap crossing objects with proxies. The Membrane is a private mechanism of `Compartment` — the spec has no membrane concept, which is exactly why it must stay behind the facade.
- `incubatorContext` (the host window the view reads through to) is a qiankun host extension: the Compartment spec and ses isolate by absence and have no read-through concept. The name borrows the ShadowRealm proposal's official "incubator realm" term for the creating context.

### Compartment surface and deliberate differences

`new Compartment({ globals, modules, resolveHook, importHook, loadHook, transforms })` owns its `globalThis`. StandardSandbox adds qiankun self-references (`window`, `self`, `globalThis`, `top`, `parent`) in a second phase with `defineUnshadowableGlobals()`.

- Deliberately absent: synchronous `evaluate`, `harden`, and `lockdown`.
- qiankun host extensions: DOM globals, `evaluateScript`, the synchronous `transformClassicScript` streaming adapter, lifecycle and entry-discovery facades, module-document registration, `defineUnshadowableGlobals`, `dispose`, `incubatorContext` / `moduleHost`, and the IsolationPlugin protocol. The executable list lives in `COMPARTMENT_HOST_EXTENSIONS`.
- `evaluateScript()` uses a native blob `<script>` path. Do not introduce `eval` or `new Function` as an implementation shortcut.
- `transformClassicScript()` exists because loader node transformation must finish synchronously before the original node enters live DOM. Loader consumes it through structural `CompartmentLoaderFacade`; never restore a concrete-class or private WeakMap bridge.
- The pre-alignment names `Endowments` and `addIntrinsics()` have been removed entirely (the package has no external users, so no compatibility aliases). Use `CompartmentGlobals` / `globals` and `defineUnshadowableGlobals()`.

The module engine in `@qiankunjs/shared` is an implementation detail behind `Compartment.import()`, `load()`, and `importDocumentModules()`. Cross-package consumers must depend on the structural Compartment facade, never `EsmSandboxEngine`.

`createSandbox().unmount()` releases active effects and retains rebuilds, module namespaces, and document views for warm remounts. `createSandbox().dispose()` is terminal: it drains pending controller operations, runs active `Free` callbacks, discards rebuilds, invokes plugin `dispose` hooks, and disposes the Compartment. It also restores container protocol state and drops retained controller configuration. Cleanup attempts continue after a failure while preserving the first error. Initial load failures must call this path without replacing the original loading error.

`Compartment.dispose()` cancels pending classic evaluations, removes its generated-script receiver, releases its asset ownership and ESM engine, clears hook/module references, and revokes the global membrane. The DOM plugin separately revokes its cached document proxy and clears its ledgers on terminal disposal. Retained global/document proxies cannot be used after disposal; ordinary unmount must keep them available for remount. Import-map release only removes framework bookkeeping and owned script nodes; browser-native registrations cannot be retracted.

`createSandbox(appName)` is the JS-only preset: interval, window-listener, and history cleanup are available without a container. Providing `container` enables dynamic DOM interception; `mount()` prepares standalone containers lazily (`provisionContainerHead`, default `true` — qiankun's loader passes `false` because the entry HTML materializes the head in-stream). The controller keeps **two views of one configured transformer**, split by call-site identity: the public `nodeTransformer` is the pipeline variant — its output is stamped for native passthrough (`core/nativePassthrough.ts`), so patched mount points insert it untouched and it never enters the dynamic ledger — while the dynamic-append patcher receives the bare variant through the plugin config, whose output must NOT carry the mark (re-inserted nodes depend on re-entering the pipeline for ledger bookkeeping).

### IsolationPlugin / Free pattern

```typescript
const plugin: IsolationPlugin = {
  name: 'example',
  bootstrap: (ctx) => installBeforeAppCode(ctx),
  mount: async (ctx) => installForThisMount(ctx),
  dispose: (ctx) => releaseRetainedPluginState(ctx),
};

const free = await plugin.mount?.(context);
if (free) {
  const rebuild = free(); // unmount: remove this plugin's side effects
  await rebuild(container); // remount: restore recorded side effects
}
```

- `bootstrap` runs synchronously before any application script is evaluated.
- `mount` runs on every mount and may asynchronously produce its `Free`.
- `dispose(context): void` is optional and synchronous. It runs once at terminal disposal, after active `Free` callbacks and before Compartment disposal, so cleanup can still use the compartment. Release retained plugin views/caches here; the hook must tolerate partially completed bootstrap setup. It is not called on ordinary unmount.
- Built-in plugins run in preset order; user plugins run afterward in registration order.
- Prototype-level coordination belongs in browser-realm shared state with refcounts; it is not per-app context state. Use a stable `Symbol.for(...)` slot on `nativeGlobal` when independently bundled qiankun copies must coordinate the same prototype patch.
- Code under `patchers/**` may use only the public Compartment surface. ESLint forbids imports from membrane internals.

### Realm-shared metadata

- `dynamicAppend.sharedState` is stored on `nativeGlobal` under `Symbol.for('qiankun.dynamicAppend.sharedState')`, so multiple qiankun copies in the same browser realm share prototype/CSSOM refcounts and ownership metadata.
- `sandboxConfigs` — per-Compartment dynamic-append config.
- `elementConfigs` — which Compartment owns each dynamically appended DOM node.
- `containerOwners` — which Compartment currently patches a micro-app container.

## ANTI-PATTERNS

- **NEVER** access the real `window` / `document.head` directly — always the proxied view.
- **NEVER** import membrane internals from a plugin or expose `EsmSandboxEngine` in a cross-package contract.
- **NEVER** move dynamicAppend/style/timer/listener behavior into Compartment itself; those are DOM host plugins.
- `Compartment.dispose()` may call `disposeCompartmentAssets(this)` to notify the internal asset-owner registry that the owner is terminal. The identity-keyed cancellation registry and script/link cleanup stay in `shared/assets-transpilers`; Compartment must not inspect nodes, style scopes, caches, or dynamic-append ledgers. This notification also covers direct Compartment and JS-only transformer usage without a DOM plugin. Controller `Free`/plugin `dispose` still precedes Compartment disposal; warm unmount does not release this registry.
- **FIXME** (in code): indirect `eval` in the membrane can let System.js escape sandbox scope.
- **FIXME**: the runtime-container global may miss monkey-patched append logic.

## REPLACEMENT BOUNDARY

If a native Compartment becomes available, it may replace only globalThis virtualization, the evaluator, and the module graph. Document proxying, dynamic append interception, style isolation, timers/listeners cleanup, and history integration remain qiankun-owned DOM plugins because ECMAScript Compartment proposals do not define DOM behavior. Keep the plugin layer dependent only on the public Compartment surface so this boundary remains real.

## EXPORTS (`src/index.ts`)

```typescript
export * from './core/sandbox'; // createSandbox, prepareSandboxContainer, StandardSandbox, controller/options types
export * from './core/compartment'; // Compartment, options, compatibility lists
export * from './consts'; // qiankunHeadTagName, qiankunBodyTagName, nativeGlobal, nativeDocument
export { esmDestructurableGlobals } from './core/esm-globals';
export type { IsolationPlugin, IsolationPluginContext, Free, Rebuild } from './patchers';
```
