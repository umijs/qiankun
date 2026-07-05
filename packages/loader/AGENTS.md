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
| Load micro-app | `index.ts` | `loadEntry(entry, container, opts)`; `opts` carries `sandbox` and/or `esmEngine` |
| Head virtualization | `TagTransformStream.ts` | rewrites `<head>` tags at the string level before DOM insertion |
| Streaming DOM | `writable-dom/index.ts` | incremental parsing, blocks on sync scripts/styles, preloads the rest |

## LOADING PIPELINE

```
1. fetch(entry)                              (decorated fetch: cacheable/retryable/throwable)
2. TextDecoderStream                         bytes → string
3. TagTransformStream                        <head> → <qiankun-head>
4. WritableDOMStream                         stream → live DOM
   ├─ nodeTransformer(node) per node         → shared/assets-transpilers rewrites script/link/style
   ├─ classic <script entry> → blob-URL execution in the sandbox membrane
   ├─ <script type="module"> → handed to opts.esmEngine (EsmSandboxEngine)
   └─ blocks on sync scripts; preloads other assets while blocked
5. resolve app export                        classic: sandbox.latestSetProp · esm: engine lifecycle namespace
```

## KEY PATTERNS

### Script classification (`index.ts`)

```typescript
isExternalScript; // has src or data-src
isEntryScript; // external + [entry]  → resolves the load promise (app's main export point)
isDeferScript; // external + [defer]  → ordered via shared prepareDeferredQueue
```

- Exactly **one** `entry` script is allowed per HTML entry; a second one throws `QiankunError`.

### Detached parsing

Nodes are parsed/transformed in a detached document first, then moved to live DOM — this prevents premature script execution before the transpiler has rewritten the node.

## ANTI-PATTERNS

- **NEVER** include more than one `entry` script per HTML entry (throws `QiankunError`).
- **FIXME** (in code): non-standard HTML chunks that lack a `<head>` tag.

## EXPORTS (`src/index.ts`)

```typescript
export { loadEntry, type LoaderOpts } from './index';
// LoaderOpts = { fetch, sandbox?, esmEngine?, nodeTransformer?, streamTransformer? } & BaseTranspilerOpts
```
