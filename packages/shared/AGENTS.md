# @qiankunjs/shared

Internal utilities for fetch, asset transpilation, and module resolution.

## STRUCTURE

```
shared/
├── assets-transpilers/   # Script/link DOM node transformation
│   ├── script.ts         # Blob URL wrapping, sandbox execution
│   └── link.ts           # Preload optimization, URL rewriting
├── fetch-utils/          # Enhanced fetch wrappers
│   ├── makeFetchCacheable.ts   # LRU cache (50 entries)
│   ├── makeFetchRetryable.ts   # Automatic retries
│   └── makeFetchThrowable.ts   # Non-2xx throws error
├── module-resolver/      # Shared dependency resolution
├── reporter/             # QiankunError, logger
├── deferred-queue/       # Async task sequencing
└── utils.ts              # Deferred, getEntireUrl, etc.
```

## WHERE TO LOOK

| Task               | File                                | Notes                                               |
| ------------------ | ----------------------------------- | --------------------------------------------------- |
| Script sandboxing  | `assets-transpilers/script.ts`      | Creates Blob URL with sandbox scope                 |
| Link preload fix   | `assets-transpilers/link.ts`        | Changes `as="script"` to `as="fetch"` for sandbox   |
| Fetch with cache   | `fetch-utils/makeFetchCacheable.ts` | Clones responses, prunes failed                     |
| Dependency sharing | `module-resolver/index.ts`          | Semver matching via `<script type="dependencymap">` |
| Promise utilities  | `utils.ts`                          | `Deferred` class for async control flow             |

## KEY PATTERNS

### Higher-Order Fetch

```typescript
// Decorator pattern - wrap fetch with enhancements
const enhancedFetch = makeFetchCacheable(makeFetchRetryable(makeFetchThrowable(fetch)));
```

### Deferred Promise

```typescript
const deferred = new Deferred<void>();
// Later:
deferred.resolve();
await deferred.promise;
```

### Blob URL Execution

```typescript
// Scripts wrapped and executed via Blob for sandbox isolation
const blob = new Blob([wrappedCode], { type: 'text/javascript' });
script.src = URL.createObjectURL(blob);
```

### DOM as Metadata Store

- `data-src`: Original source URL
- `data-consumed`: Marks processed elements

## EXPORTS

```typescript
// Transpilers
export { transpileScript, transpileLink } from './assets-transpilers';
// Fetch
export { makeFetchCacheable, makeFetchRetryable, makeFetchThrowable } from './fetch-utils';
// Module resolution
export { createModuleResolver } from './module-resolver';
// Utilities
export { Deferred, QiankunError, prepareDeferredQueue } from './utils';
```
