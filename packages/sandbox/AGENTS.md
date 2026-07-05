# @qiankunjs/sandbox

JS isolation engine: Proxy-based **Membrane** + **Compartment** execution model. Also exposes the globals contract the ESM-sandbox engine (in `@qiankunjs/shared`) relies on. Depends only on `@qiankunjs/shared`.

## STRUCTURE

```
sandbox/
├── core/
│   ├── sandbox/          # createSandboxContainer() + StandardSandbox (mount/unmount, latestSetProp)
│   ├── membrane/         # Proxy wrapper for global (window/document) isolation
│   ├── compartment/      # Code evaluation with `with(this)` scope binding + globalProps
│   ├── globals.ts        # global property definitions
│   └── esm-globals.ts    # esmDestructurableGlobals — globals the ESM engine may destructure/rebind
├── patchers/
│   ├── dynamicAppend/    # appendChild/insertBefore interception → redirect to app container
│   ├── windowListener.ts # event listener tracking
│   ├── interval.ts       # timer tracking
│   └── historyListener.ts
└── consts.ts             # qiankunHeadTagName / qiankunBodyTagName, nativeGlobal, nativeDocument
```

## WHERE TO LOOK

| Task | File | Notes |
| --- | --- | --- |
| Create sandbox | `core/sandbox/index.ts` | `createSandboxContainer()` returns mount/unmount + membrane views |
| Proxy logic | `core/membrane/index.ts` | Write → local target; Read → local → endowments → host window |
| Code execution | `core/compartment/index.ts` | `with(this)` scope binding for classic (blob-URL) scripts |
| DOM interception | `patchers/dynamicAppend/forStandardSandbox.ts` | Redirects dynamic script/style/link to app container |
| Side-effect cleanup | `patchers/*.ts` | Each patcher returns a `free()` called on unmount |
| ESM globals contract | `core/esm-globals.ts` | Consumed by `shared/esm-sandbox` engine, passed as `globalsBaseSet` |

## KEY PATTERNS

### Membrane (Proxy)

- **Writes** are trapped and stored on a local `target` object (the sandbox's own globals).
- **Reads** check local target → endowments → fall back to the real host window.
- **Native rebinding**: `fetch`, `console`, etc. are rebound to the real receiver to avoid "Illegal invocation".
- `latestSetProp` records the last global the entry script assigned — that's how the loader recovers a classic app's exported lifecycles when no explicit export exists.

### Patcher / free pattern

```typescript
const free = patchWindowListener(sandbox); // on mount
// ...
free(); // on unmount — removes every listener/timer the micro-app added
```

### WeakMap metadata

- `sandboxConfigWeakMap` — per-instance sandbox config.
- `elementAttachSandboxConfigMap` — which app owns which dynamically-appended DOM node.

## ANTI-PATTERNS

- **NEVER** access the real `window` / `document.head` directly — always the proxied view.
- **FIXME** (in code): indirect `eval` in the membrane can let System.js escape sandbox scope.
- **FIXME**: the runtime-container global may miss monkey-patched append logic.

## EXPORTS (`src/index.ts`)

```typescript
export * from './core/sandbox'; // createSandboxContainer, type Sandbox, StandardSandbox
export * from './core/compartment'; // Compartment
export * from './consts'; // qiankunHeadTagName, qiankunBodyTagName, nativeGlobal, nativeDocument
export { esmDestructurableGlobals } from './core/esm-globals';
```
