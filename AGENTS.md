# QIANKUN PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-10 **Commit:** 058166b6 **Branch:** next

## OVERVIEW

Qiankun is a micro-frontend framework built on single-spa, providing HTML entry, JS sandbox, and style isolation. Monorepo managed by pnpm with `father` build tool.

## STRUCTURE

```
qiankun/
├── packages/
│   ├── qiankun/         # Main facade - re-exports from loader/sandbox/shared
│   ├── sandbox/         # JS isolation via Proxy membrane + Compartment (SEE packages/sandbox/AGENTS.md)
│   ├── loader/          # Streaming HTML entry loader (SEE packages/loader/AGENTS.md)
│   ├── shared/          # fetch-utils, asset transpilers, module-resolver (SEE packages/shared/AGENTS.md)
│   ├── ui-bindings/     # React/Vue <MicroApp> components
│   ├── bundler-plugin/  # Entry point configuration plugin
│   └── create-qiankun/  # CLI scaffolding tool
├── examples/            # Integration examples (NOT in workspace currently)
└── docs/                # VitePress documentation
```

## WHERE TO LOOK

| Task | Location | Notes |
| --- | --- | --- |
| Core APIs (registerMicroApps, loadMicroApp) | `packages/qiankun/src/apis/` | Thin wrappers around loader/sandbox |
| App loading lifecycle | `packages/qiankun/src/core/loadApp.ts` | Orchestrates sandbox+loader+hooks |
| JS sandbox implementation | `packages/sandbox/src/core/` | Membrane, Compartment, StandardSandbox |
| HTML streaming loader | `packages/loader/src/index.ts` | Uses writable-dom for streaming |
| Script/link transpilation | `packages/shared/src/assets-transpilers/` | Blob URL sandboxing |
| Fetch enhancements | `packages/shared/src/fetch-utils/` | Cache, retry, error handling |
| Dependency sharing | `packages/shared/src/module-resolver/` | Semver-based matching |
| React/Vue bindings | `packages/ui-bindings/{react,vue}/` | `<MicroApp>` component |

## CODE MAP

### Package Dependencies (internal)

```
qiankun (facade)
├── @qiankunjs/loader
│   ├── @qiankunjs/sandbox
│   └── @qiankunjs/shared
├── @qiankunjs/sandbox
│   └── @qiankunjs/shared
└── @qiankunjs/shared (base utilities)
```

### Key Entry Points

| Package            | Entry          | Primary Exports                                     |
| ------------------ | -------------- | --------------------------------------------------- |
| qiankun            | `src/index.ts` | `registerMicroApps`, `start`, `loadMicroApp`        |
| @qiankunjs/sandbox | `src/index.ts` | `createSandboxContainer`, `StandardSandbox`         |
| @qiankunjs/loader  | `src/index.ts` | `loadEntry`                                         |
| @qiankunjs/shared  | `src/index.ts` | `transpileScript`, `makeFetchCacheable`, `Deferred` |

## CONVENTIONS

### TypeScript (STRICT - enforced by eslint)

- `@typescript-eslint/no-explicit-any`: ERROR - use `unknown` instead
- `@typescript-eslint/consistent-type-imports`: inline-type-imports required
- `@typescript-eslint/no-unnecessary-condition`: ERROR
- Path aliases: `@qiankunjs/*` → `packages/*/src`

### Code Style

- No `as any`, `@ts-ignore`, `@ts-expect-error`
- Unused vars: prefix with `_` (e.g., `_unused`)
- Type exports: use `export type { X }` inline syntax

### Build

- Tool: `father` (UmiJS ecosystem)
- Output: dual ESM + CJS in `dist/`
- No `exports` field in package.json (uses `main`/`module`/`types`)

## ANTI-PATTERNS (THIS PROJECT)

- **NEVER** add more than 1 `entry` attribute script per HTML entry
- **NEVER** use `!important` in CSS unless absolutely necessary (breaks isolation)
- **ALWAYS** unmount micro-apps when finished (`loadMicroApp` returns unmount handle)
- **AVOID** global variables in micro-apps - sandbox tracks `latestSetProp` for exports

### Technical Debt (from codebase comments)

- `FIXME` in `loadApp.ts`: async execution order coordination
- `FIXME` in sandbox: System.js scope escape via indirect eval
- `TODO`: Snapshot sandbox and GC not yet implemented

## COMMANDS

```bash
pnpm install              # Install all workspace deps
pnpm run build            # Build all packages (father build)
pnpm run test             # Run vitest across workspace
pnpm run eslint           # Lint packages/
pnpm run ci               # Full CI: build + eslint + prettier:check

# Development
pnpm run start:example    # Build + run example apps
pnpm run docs:dev         # VitePress dev server

# Release (changesets)
pnpm run prerelease:alpha # Enter alpha, version bump
pnpm run release:alpha    # Build, publish, exit alpha
```

## NOTES

- **v3.0 Active Development**: Check roadmap at github.com/umijs/qiankun/discussions/1378
- **Streaming Architecture**: v3 uses `writable-dom` for incremental HTML parsing
- **Head Virtualization**: `<head>` → `<qiankun-head>` for isolation
- **Blob URL Execution**: Scripts wrapped and executed via `URL.createObjectURL`
- **Test Environment**: Vitest + happy-dom; edge-runtime for fetch tests
