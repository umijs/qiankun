# @qiankunjs/loader

Streaming HTML-entry loader built on a forked `writable-dom`. Depends on `@qiankunjs/sandbox` + `@qiankunjs/shared`.

## STRUCTURE

```
loader/
├── index.ts              # loadEntry() — main API
├── TagTransformStream.ts # <head> → <qiankun-head> string-level replacement
├── writable-dom/         # forked streaming DOM engine (incremental parse + blocking scripts)
│   └── index.ts
└── parser.ts             # static HTML parsing for prefetch
```

## WHERE TO LOOK

| Task | File | Notes |
| --- | --- | --- |
| Load micro-app | `index.ts` | `loadEntry(entry, container, opts)`; `opts.compartment` is the single sandbox/module facade |
| Head virtualization | `TagTransformStream.ts` | rewrites `<head>` tags at the string level before DOM insertion |
| Streaming DOM | `writable-dom/index.ts` | incremental parsing, blocks on sync scripts/styles, preloads the rest |

## LOADING PIPELINE

```
1. fetch(entry)                              (decorated fetch: cacheable/retryable/throwable)
2. TextDecoderStream                         bytes → string
3. TagTransformStream                        <head> → <qiankun-head>
4. WritableDOMStream                         stream → live DOM
   ├─ nodeTransformer(node) per node         → shared/assets-transpilers rewrites script/link/style
   ├─ classic <script entry> → synchronous Compartment host-adapter rewrite, then blob-URL execution
   ├─ <script type="module"> → registered through the compartment module facade
   └─ blocks on sync scripts; preloads other assets while blocked
5. resolve app export                        classic: compartment.latestSetProp · esm: compartment.importDocumentModules()
```

## KEY PATTERNS

### Script classification (`index.ts`)

```typescript
isExternalScript; // has src or data-src
isEntryScript; // external + [entry]  → resolves the load promise (app's main export point)
isDeferScript; // external + [defer]  → ordered via shared prepareDeferredQueue
```

- Exactly **one** `entry` script is allowed per HTML entry; a second one throws `QiankunError`.
- Loader and asset-transpiler interfaces must not mention `EsmSandboxEngine` or the concrete `Sandbox` class; consume structural `CompartmentLoaderFacade`.
- `transformClassicScript()` is a stable sandbox-owned host adapter because detached node transformation is synchronous. `evaluateScript()` schedules a separate script asynchronously and cannot replace it in the streaming pipeline.

### Detached parsing

Nodes are parsed/transformed in a detached document first, then moved to live DOM — this prevents premature script execution before the transpiler has rewritten the node.

### writable-dom fork discipline

`writable-dom/` is vendored from marko-js/writable-dom and periodically re-synced; every deviation carries a `[qiankun]` comment so syncs can re-apply them mechanically. Changes there demand deliberate thought and must stay **generic**: general-purpose hooks or upstream bug fixes only — never qiankun-specific semantics coupled to other packages (no `@qiankunjs/*` imports, no sandbox marks, no downstream contract knowledge). The fork's one integration seam is the `assetTransformer` callback (every element passes through it right before insertion); caller bookkeeping belongs in the callback `loadEntry` provides (`index.ts`), on the caller's side of that seam. The loader itself carries no sandbox semantics either: a sandbox-provided `nodeTransformer` stamps its own output (e.g. the native-passthrough mark its patcher consumes) — the loader just routes every element through whatever transformer it was given.

## ANTI-PATTERNS

- **NEVER** include more than one `entry` script per HTML entry (throws `QiankunError`).
- **NEVER** add qiankun-coupled logic inside `writable-dom/` — generic designs only; hang caller bookkeeping on the `assetTransformer` callback in `loadEntry` (see the fork discipline above).
- **FIXME** (in code): non-standard HTML chunks that lack a `<head>` tag.

## EXPORTS (`src/index.ts`)

```typescript
export { loadEntry, type LoaderOpts } from './index';
// LoaderOpts = { fetch, compartment?, nodeTransformer?, streamTransformer?, onDOMStreamSettled? } & BaseTranspilerOpts
// onDOMStreamSettled: notified exactly once when the DOM-write phase is over (stream piped, errored,
// or never started) — distinct from the returned promise, which can settle at the entry script's
// onload while tail nodes are still streaming; qiankun's container gate keys its release on it
```
