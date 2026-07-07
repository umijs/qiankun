# QIANKUN PROJECT KNOWLEDGE BASE

**Updated:** 2026-07-06 · **Commit:** dcc42ae4 · **Branch:** next (qiankun 3.0, active dev)

Qiankun is a micro-frontend framework built on [single-spa](https://github.com/single-spa/single-spa). v3 rewrites the runtime around **streaming HTML-entry loading**, a **Proxy-membrane JS sandbox**, and native **ESM-sandbox** execution. pnpm monorepo, built with `father` (UmiJS).

> Requires Node `>=20.19`, `pnpm@10.28.2` (see `packageManager`). Never use npm/yarn at the root.

## STRUCTURE

```
qiankun/
├── packages/
│   ├── qiankun/         # Facade: public APIs (register/loadMicroApp, start, prefetch) + loadApp orchestration
│   ├── sandbox/         # JS isolation: Proxy membrane + Compartment  → packages/sandbox/AGENTS.md
│   ├── loader/          # Streaming HTML-entry loader (writable-dom)  → packages/loader/AGENTS.md
│   ├── shared/          # Transpilers, fetch-utils, module-resolver, ESM-sandbox engine → packages/shared/AGENTS.md
│   ├── ui-bindings/     # <MicroApp> components: react/ vue/ shared/
│   ├── bundler-plugin/  # Webpack(4/5) + Vite plugins: mark entry script, fix output library
│   └── create-qiankun/  # `npm create qiankun` scaffolder (React/Vue, Vite)
├── e2e/                 # Playwright, runs against BUILT dist → e2e/README.md
├── examples/            # Runnable integration demos (main + react/vue/purehtml/webpack)
└── docs/                # VitePress site (docs/rfcs holds design RFCs)
```

## PROGRESSIVE DISCLOSURE — read the scoped doc before editing a package

| Working in… | Read first |
| --- | --- |
| `packages/sandbox/**` | [`packages/sandbox/AGENTS.md`](packages/sandbox/AGENTS.md) — membrane, compartment, patchers, ESM globals |
| `packages/loader/**` | [`packages/loader/AGENTS.md`](packages/loader/AGENTS.md) — streaming pipeline, head virtualization |
| `packages/shared/**` | [`packages/shared/AGENTS.md`](packages/shared/AGENTS.md) — transpilers, fetch decorators, **esm-sandbox** |
| `e2e/**` | [`e2e/README.md`](e2e/README.md) — Playwright layout, fixtures, anti-flake rules |

## ARCHITECTURE (big picture)

`loadApp` (`packages/qiankun/src/core/loadApp.ts`) is the orchestrator. Per micro-app it wires:

1. **fetch** — decorated `window.fetch`: `makeFetchCacheable(makeFetchRetryable(makeFetchThrowable(fetch)))`.
2. **sandbox** — `createSandboxContainer()` builds a Proxy-membrane `window`/`document` view; patchers (dynamicAppend, timers, listeners, history) each return a `free()` cleanup called on unmount.
3. **loader** — `loadEntry(entry, container, opts)` streams the HTML entry through `writable-dom`, virtualizing `<head>` → `<qiankun-head>` and running each node through a `nodeTransformer`.
4. **transpilers** (`shared/assets-transpilers`) rewrite each script/link/style node before it hits live DOM.

Two execution paths, chosen per script type:

- **Classic** (`<script entry>`, UMD/global): source is wrapped and run via a **blob URL** scoped to the sandbox membrane. The app's export = `sandbox.latestSetProp` (the last global the entry script set).
- **ESM** (`<script type="module">`): handled by `EsmSandboxEngine` (`shared/esm-sandbox`). Modules are fetched, lexer-rewritten to route globals through the membrane, given synthetic specifiers via a dynamically injected **import map**, and evaluated in order. The engine also handles dynamic `import()`.

**Style isolation** (`shared/assets-transpilers/style.ts` + `link.ts`) uses CSS `@scope` at runtime; external stylesheets become blob-`<link>`s so `@scope` can wrap them. Opt-in via `styleIsolation`.

Internal dependency graph (never invert it):

```
qiankun → loader → sandbox → shared
                   sandbox → shared
ui-bindings/{react,vue} → ui-bindings/shared → qiankun
```

## COMMANDS

```bash
pnpm install                 # install all workspace deps

# build (father → dual ESM+CJS in each package's dist/)
pnpm run build               # build everything (packages + examples)
pnpm run build:packages      # build only packages/** (prereq for e2e & examples)

# unit tests — vitest + happy-dom, aliased to src (NO build needed, see vitest.config.ts)
pnpm run test                            # all packages
pnpm --filter @qiankunjs/shared run test # one package
pnpm --filter @qiankunjs/sandbox exec vitest run path/to.test.ts   # single file
pnpm --filter @qiankunjs/shared  exec vitest run -t "test name"    # single test by name

# e2e — Playwright against BUILT dist (see e2e/README.md)
pnpm run test:e2e            # build all + run chromium suite

# lint / format / full CI gate
pnpm run eslint              # eslint packages/
pnpm run prettier:check      # prettier -c .
pnpm run ci                  # build + eslint + prettier:check (what CI runs)

# dev
pnpm run start:example       # build packages + run all example apps in parallel
pnpm run docs:dev            # VitePress docs
```

## CONVENTIONS (enforced by eslint — `pnpm run eslint` will reject violations)

TypeScript is strict + type-checked (`@typescript-eslint/recommended-requiring-type-checking`):

- **No `any`** — `no-explicit-any` auto-fixes to `unknown`. No `as any`, `@ts-ignore`, `@ts-expect-error`.
- **Inline type imports** — `import { type Foo, bar }`, not `import type { Foo }` on its own line (`consistent-type-imports`/`consistent-type-exports` with `fixStyle: inline-type-imports`).
- `no-unnecessary-condition` is an error — don't guard values the types prove are always truthy.
- Unused vars/args must be prefixed `_` (`argsIgnorePattern: ^_`).
- `array-simple`: `T[]` for simple, `Array<T>` for complex element types.
- JS-wide: `no-else-return` (no `else` after `return`), `object-shorthand`.
- Path alias `@qiankunjs/*` → `packages/*/src` (tsconfig + vitest); imports resolve to **source**, not dist.

Build/release:

- `father` build, dual ESM+CJS; packages use `main`/`module`/`types` (no `exports` field).
- Versioning via **changesets**, but changesets are **auto-derived from Conventional Commits** in CI (`scripts/generate-changesets.mjs`) — do **not** hand-write `.changeset/*.md`. Just land a well-formed conventional commit (`feat`/`fix`/`feat!`…); the release job maps changed files → packages and infers the bump. Each sub-package keeps its own `CHANGELOG.md` (changeset default, visible on npm); on publish `scripts/generate-release-notes.mjs` aggregates them into **one GitHub Release**, which can be polished after the fact via the `/release-changelog` skill (`gh release edit`). Full flow: `.changeset/README.md`.
- Conventional commits enforced by commitlint (`feat:`, `fix:`, `feat(esm-sandbox):`, …).

## ANTI-PATTERNS (this project)

- **NEVER** put more than one `entry` script in an HTML entry — the loader throws `QiankunError`.
- **ALWAYS** unmount micro-apps; `loadMicroApp`/patchers return handles/`free()` — leaks break remount & multi-instance.
- In sandbox code, **never touch the real `window`/`document.head`** — go through the proxied view.
- Don't invert the package dependency graph above (e.g. `shared` must not import `sandbox`).
- e2e: never `waitForTimeout`; use web-first assertions; all ports come from `e2e/ports.ts`.

## NOTES

- Firefox doesn't support dynamically injected import maps → ESM-sandbox e2e tests are annotated `test.fail(firefox, …)` (expected failure, not skip). See `e2e/README.md`.
- Design decisions live in `docs/rfcs/` (e.g. the ESM-sandbox RFC).
- v3 roadmap: github.com/umijs/qiankun/discussions/1378.
