# @qiankunjs/sandbox

JS isolation engine using Proxy-based Membrane + Compartment execution model.

## STRUCTURE

```
sandbox/
├── core/
│   ├── sandbox/          # StandardSandbox, createSandboxContainer
│   ├── membrane/         # Proxy wrapper for global isolation
│   ├── compartment/      # Code evaluation with `with(this)` binding
│   └── globals.ts        # Global property definitions
├── patchers/
│   ├── dynamicAppend/    # DOM appendChild/insertBefore interception
│   ├── windowListener.ts # Event listener tracking
│   ├── interval.ts       # Timer tracking
│   └── historyListener.ts
└── consts.ts             # qiankunHeadTagName, etc.
```

## WHERE TO LOOK

| Task | File | Notes |
| --- | --- | --- |
| Create sandbox | `core/sandbox/index.ts` | `createSandboxContainer()` returns mount/unmount |
| Proxy logic | `core/membrane/index.ts` | Write → local target, Read → target → endowments → host |
| Code execution | `core/compartment/index.ts` | `with(this)` scope binding |
| DOM interception | `patchers/dynamicAppend/forStandardSandbox.ts` | Redirects to app container |
| Side effect cleanup | `patchers/*.ts` | Each returns `free()` function |

## KEY PATTERNS

### Membrane (Proxy)

- **Writes**: Trapped and stored in local `target` object
- **Reads**: Check local → endowments → fallback to host window
- **Native rebinding**: `fetch`, `console` rebound to avoid "Illegal invocation"

### Patcher/Free Pattern

```typescript
// Every patcher returns cleanup function
const free = patchWindowListener(sandbox);
// On unmount:
free(); // Removes all listeners added by micro-app
```

### WeakMap Metadata

- `sandboxConfigWeakMap`: Sandbox config per instance
- `elementAttachSandboxConfigMap`: Tracks which app owns which DOM node

## ANTI-PATTERNS

- **NEVER** access real `window.document.head` directly - use proxied version
- **FIXME**: Indirect `eval` in membrane causes System.js scope escape
- **FIXME**: Global variable for runtime container may miss monkey-patched logic

## EXPORTS

```typescript
export { createSandboxContainer } from './core/sandbox';
export { StandardSandbox } from './core/sandbox/StandardSandbox';
export { Compartment } from './core/compartment';
export { qiankunHeadTagName } from './consts';
```
