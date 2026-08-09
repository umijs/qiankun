# QIANKUN PROJECT KNOWLEDGE BASE

**Updated:** 2026-07-06 · **Commit:** dcc42ae4 · **Branch:** next (qiankun 3.0, active dev)

Qiankun is a micro-frontend framework built on [single-spa](https://github.com/single-spa/single-spa). v3 rewrites the runtime around **streaming HTML-entry loading**, a **Proxy-membrane JS sandbox**, and native **ESM-sandbox** execution. It is a pnpm monorepo built with Vite 8; `tsc` emits package declarations.

> Requires Node `^22.15 || >=24`, `pnpm@11.13.1` (see `packageManager`). Never use npm/yarn at the root.

## STRUCTURE

```
qiankun/
├── packages/
│   ├── qiankun/         # Facade: public APIs (register/loadMicroApp, start, prefetch) + loadApp orchestration
│   ├── sandbox/         # JS isolation: Proxy membrane + Compartment  → packages/sandbox/AGENTS.md
│   ├── loader/          # Streaming HTML-entry loader (writable-dom)  → packages/loader/AGENTS.md
│   ├── shared/          # Transpilers, fetch-utils, module-resolver, ESM-sandbox engine → packages/shared/AGENTS.md
│   ├── single-spa/      # Vendored single-spa fork (@qiankunjs/single-spa, upstream 7.0 @ ce0f925a) → packages/single-spa/README.md
│   ├── ui-bindings/     # <MicroApp> components: react/ vue/ shared/ (dogfooded by examples/{main,vue-host})
│   ├── bundler-plugin/  # Webpack(4/5) + Vite plugins: mark entry script, fix output library
│   └── create-qiankun/  # `npm create qiankun` scaffolder (React/Vue, Vite)
├── e2e/                 # Playwright, runs against BUILT dist → e2e/README.md
├── examples/            # Runnable demos: two hosts (main = @qiankunjs/react, vue-host = @qiankunjs/vue) + react/vue/purehtml/webpack
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
2. **sandbox** — `createSandbox()` builds a Proxy-membrane `window`/`document` view; patchers (dynamicAppend, timers, listeners, history) each return a `free()` cleanup called on unmount. Without a container it uses the JS-only preset; a container enables DOM containment.
3. **loader** — `loadEntry(entry, container, opts)` streams the HTML entry through `writable-dom`, virtualizing `<head>` → `<qiankun-head>` and running each node through a `nodeTransformer`.
4. **transpilers** (`shared/assets-transpilers`) rewrite each script/link/style node before it hits live DOM.

Micro apps sharing one container element take FIFO turns for their DOM writes through the **container occupancy gate** (`core/containerOccupancy.ts`, two critical sections: load-phase streaming and mount→unmount; see `docs/rfcs/container-occupancy-gate.md`).

Two execution paths, chosen per script type:

- **Classic** (`<script entry>`, UMD/global): source is wrapped and run via a **blob URL** scoped to the sandbox membrane. The app's export = `sandbox.latestSetProp` (the last global the entry script set).
- **ESM** (`<script type="module">`): handled by `EsmSandboxEngine` (`shared/esm-sandbox`). Modules are fetched, lexer-rewritten to route globals through the membrane, given synthetic specifiers via a dynamically injected **import map**, and evaluated in order. The engine also handles dynamic `import()`.

**Style isolation** (`shared/assets-transpilers/style.ts` + `link.ts`) uses CSS `@scope` at runtime; external stylesheets become blob-`<link>`s so `@scope` can wrap them. Opt-in via `styleIsolation`.

Internal dependency graph (never invert it):

```
qiankun → loader → sandbox → shared
                   sandbox → shared
qiankun → single-spa   (vendored fork; zero deps, bottom of the graph — must not import shared/sandbox/loader)
ui-bindings/{react,vue} → ui-bindings/shared → qiankun
```

## COMMANDS

```bash
pnpm install                 # install all workspace deps

# build (Vite 8 → package JavaScript; tsc → declarations)
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

## CONVENTIONS (enforced by ESLint flat config — `pnpm run eslint` will reject violations)

TypeScript is strict + type-checked (`typescript-eslint`'s type-checked flat config):

- **No `any`** — `no-explicit-any` auto-fixes to `unknown`. No `as any`, `@ts-ignore`, `@ts-expect-error`.
- **Inline type imports** — `import { type Foo, bar }`, not `import type { Foo }` on its own line (`consistent-type-imports`/`consistent-type-exports` with `fixStyle: inline-type-imports`).
- `no-unnecessary-condition` is an error — don't guard values the types prove are always truthy.
- Unused vars/args must be prefixed `_` (`argsIgnorePattern: ^_`).
- `array-simple`: `T[]` for simple, `Array<T>` for complex element types.
- JS-wide: `no-else-return` (no `else` after `return`), `object-shorthand`.
- Path alias `@qiankunjs/*` → `packages/*/src` (tsconfig + vitest); imports resolve to **source**, not dist.

Build/release:

- Vite 8 builds browser package JavaScript as ESM+CJS, while `tsc` emits declarations; the `create-qiankun` Node CLI is CJS-only. Package entry fields and subpath exports must point at the corresponding `dist` outputs.
- TypeScript 7 is installed as `@typescript/native` and owns the `tsc` binary. The `typescript` dependency intentionally aliases `@typescript/typescript6` because TypeScript 7.0 has no programmatic API yet and tools such as `typescript-eslint` and `vue-tsc` still require that compatibility API.
- Versioning via **changesets**, but changesets are **auto-derived from Conventional Commits** in CI (`scripts/generate-changesets.mjs`) — do **not** hand-write `.changeset/*.md`. Just land a well-formed conventional commit (`feat`/`fix`/`feat!`…); the release job maps changed files → packages and infers the bump. Each sub-package keeps its own `CHANGELOG.md` (changeset default, visible on npm); on publish `scripts/generate-release-notes.mjs` aggregates them into **one GitHub Release**, which can be polished after the fact via the `/release-changelog` skill (`gh release edit`). Full flow: `.changeset/README.md`.
- Conventional commits enforced by commitlint (`feat:`, `fix:`, `feat(esm-sandbox):`, …).

## DOCS & README CONVENTIONS

- **Chinese-first.** The primary audience is Chinese. `docs/zh-CN/` is the source of truth: write it to a native-author standard — no translationese, no AI-flavored filler (「让我们」「值得注意的是」「强大的/无缝的」), no calqued English syntax. The English pages align to the Chinese semantics, not the other way around; pure zh wording fixes don't require touching en. Same contract for `README.zh-CN.md` ↔ `README.md`: keep both editions in sync whenever either changes.
- **Mainland reachability is a hard constraint.** Google Fonts only via the `.cn` mirrors (`fonts.googleapis.cn`/`fonts.gstatic.cn`); never reference resources on domains unreachable from mainland China.
- **Domains**: canonical docs domain is `https://www.qiankunjs.com` (zh under `/zh-CN/`); `qiankun.umijs.org` stays alive and 307s to it; v2 docs live at `v2.qiankun.umijs.org`; live examples at `examples.qiankunjs.com`. Old-site URLs are kept working via `docs/public/_redirects` — extend it when moving pages, never break inbound links.
- **Consistency rules**: terminology never drifts (主应用/微应用/沙箱/隔离膜; qiankun always lowercase); link text in reference lists ("相关内容"/"继续阅读"/"延伸阅读") equals the target page's H1; API pages use 「函数签名」/「默认值为 X」; `guide/browser-support` is the single source of truth for browser requirements — link it, don't restate version numbers elsewhere.
- Until 3.0 reaches npm `latest`, install commands must say `qiankun@rc`, and the site shows a version banner (layout-top slot in `docs/.vitepress/theme/index.js`; remove it together with `--vp-layout-top-height` once stable ships).
- **README GitHub alerts**: put the `[!WARNING]`/`[!NOTE]` marker on its own line followed by a blank `>` line. Prettier's `proseWrap: never` re-joins plain soft breaks, which silently breaks alert rendering.
- VitePress compiles every `.md` as a Vue SFC: bare `<Tag>` in prose/link text or `{{` in inline code breaks the build (fenced code blocks are safe).

## ANTI-PATTERNS (this project)

- **NEVER** put more than one `entry` script in an HTML entry — the loader throws `QiankunError`.
- **ALWAYS** unmount micro-apps; `loadMicroApp`/patchers return handles/`free()` — leaks break remount & multi-instance.
- In sandbox code, **never touch the real `window`/`document.head`** — go through the proxied view.
- The vendored `loader/src/writable-dom/` fork accepts **generic designs only** — never qiankun-coupled semantics; caller bookkeeping goes through its `assetTransformer` callback (see `packages/loader/AGENTS.md`).
- Don't invert the package dependency graph above (e.g. `shared` must not import `sandbox`).
- e2e: never `waitForTimeout`; use web-first assertions; all ports come from `e2e/ports.ts`.
- Performance work is judged in this order: **proportional impact first** (does the win scale with asset size / network / app scale — e.g. eliminating a duplicate download), **readability second** (never trade it away for small wins), **constant absolute savings last** (fixed single-digit-ms pipeline costs are noise in real apps and rarely worth landing). Beware: the ~50ms benchmark fixture makes fixed milliseconds masquerade as percentages — convert to absolute ms against realistic load times before deciding. And fix root causes at the source, not with per-call-site markers/exemptions downstream.

## NOTES

- Firefox doesn't support dynamically injected import maps → ESM-sandbox e2e tests are annotated `test.fail(firefox, …)` (expected failure, not skip). See `e2e/README.md`.
- Design decisions live in `docs/rfcs/` (e.g. the ESM-sandbox RFC).
- v3 roadmap: github.com/umijs/qiankun/discussions/1378.
