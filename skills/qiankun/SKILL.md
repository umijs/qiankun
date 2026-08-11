---
name: qiankun
description: >-
  Usage manual for building micro-frontend projects with qiankun 3.x. Use when the user wants to create a qiankun main (host) app or sub (micro) app, convert an existing Vite app into a qiankun micro app, or wire up micro-frontend loading with React/Vue.
---

# qiankun

qiankun is a micro-frontend framework: a main (host) app loads sub (micro) apps from their HTML entries at runtime, each inside a JS sandbox, with opt-in CSS isolation. This skill is the agent-facing manual for **qiankun 3.x**.

## Task routing

Read only the reference file(s) the task at hand needs:

| Task | Read |
| --- | --- |
| Create a micro (sub) app, or convert an existing Vite app | [references/create-micro-app.md](references/create-micro-app.md) |
| Create a main (host) app | [references/create-main-app.md](references/create-main-app.md) |
| Anything else — migration, style isolation, sandbox, debugging | https://qiankun.umijs.org and `examples/` in https://github.com/umijs/qiankun |

## Before you start

Determine these, asking the user only when not inferable from context:

1. **App type** — main (host/shell) or sub (micro app).
2. **App name** — lowercase letters, numbers, hyphens. The name the host registers must exactly match the name the sub app uses in its classic-mode fallback.
3. **Framework** — React or Vue; TypeScript or JavaScript. Templates in the references are TS; strip types for JS.
4. **Dev port** — must be fixed and unique per app, because the host hard-references it in `entry`. Convention: main app `7099`, sub apps `7101`, `7102`, …

Package versions — until qiankun 3.0 stable ships, `rc` is the dist-tag for the core packages:

| Package                               | Dist-tag | Goes in                                       |
| ------------------------------------- | -------- | --------------------------------------------- |
| `qiankun`                             | `rc`     | main app `dependencies`                       |
| `@qiankunjs/react` / `@qiankunjs/vue` | `latest` | main app `dependencies` (optional UI binding) |
| `@qiankunjs/bundler-plugin`           | `rc`     | sub app `devDependencies`                     |

## Key facts

These invariants shape every task below:

- **Vite sub apps need no dedicated build mode.** qiankun 3 loads `<script type="module">` natively through its ESM sandbox — regular `vite dev` / `vite build` output is qiankun-ready as-is.
- The JS sandbox is **on by default**. CSS isolation is opt-in per app via `styleIsolation: true` (runtime CSS `@scope`).
- A sub app must stay **runnable standalone**: when not loaded by qiankun (`window.__POWERED_BY_QIANKUN__` is undefined) it renders itself directly.
- **Always unmount** what you mount. `loadMicroApp` returns a handle whose `.unmount()` must be called when the app leaves; the `MicroApp` component bindings do this automatically on component unmount.
- Webpack sub apps use `@qiankunjs/bundler-plugin/webpack` instead of the Vite plugin; see the docs.

## After any creation task

Verify the result following the checklist at the end of the reference you used. If a browser tool is available, perform the checks yourself instead of asking the user to.
