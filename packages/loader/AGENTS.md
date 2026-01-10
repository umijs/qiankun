# @qiankunjs/loader

Streaming HTML entry loader using writable-dom.

## STRUCTURE

```
loader/
├── index.ts              # loadEntry() - main API
├── TagTransformStream.ts # <head> → <qiankun-head> replacement
├── writable-dom/         # Forked streaming DOM engine
│   └── index.ts          # WritableDOMStream implementation
└── parser.ts             # Static HTML parsing for prefetch
```

## WHERE TO LOOK

| Task                | File                    | Notes                                  |
| ------------------- | ----------------------- | -------------------------------------- |
| Load micro-app      | `index.ts`              | `loadEntry(url, container, opts)`      |
| Head virtualization | `TagTransformStream.ts` | String-level tag replacement           |
| Streaming DOM       | `writable-dom/index.ts` | Incremental parsing + blocking scripts |

## LOADING PIPELINE

```
1. fetch(entry)
   ↓
2. TextDecoderStream (bytes → string)
   ↓
3. TagTransformStream (<head> → <qiankun-head>)
   ↓
4. WritableDOMStream (stream → live DOM)
   ├─ nodeTransformer called per node
   ├─ Blocks on sync scripts/styles
   └─ Preloads other assets while blocked
   ↓
5. Resolve with sandbox.latestSetProp (app exports)
```

## KEY PATTERNS

### Entry Script Detection

```typescript
// Script with `entry` attribute = app's main export point
<script src="main.js" entry></script>
// Loader resolves promise when entry script loads
```

### Defer Script Ordering

- Deferred queue ensures correct execution order
- `prepareDeferredQueue` from @qiankunjs/shared

### Detached Parsing

- HTML parsed in detached document first
- Nodes transformed before moving to live DOM
- Prevents premature script execution

## ANTI-PATTERNS

- **NEVER** include >1 `entry` script per HTML entry (throws QiankunError)
- **FIXME**: Non-standard HTML chunks lacking `<head>` tag

## EXPORTS

```typescript
export { loadEntry, type LoaderOpts } from './index';
```
