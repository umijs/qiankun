# qiankun examples

A porcelain-and-ink shell hosting four independent micro apps, every one running with the JS
sandbox and runtime style isolation (`@scope`) explicitly enabled. See [DESIGN.md](./DESIGN.md)
for the shared design language.

| app                | port | stack                                         | loading path                     |
| ------------------ | ---- | --------------------------------------------- | -------------------------------- |
| main               | 7099 | React 19 + Vite 8 + Tailwind 4                | host                             |
| react              | 7100 | React 19 + Vite 8 (`bundler-plugin/vite`)     | ESM sandbox                      |
| vue                | 7101 | Vue 3.5 + Vite 8 (`bundler-plugin/vite`)      | ESM sandbox                      |
| webpack            | 7102 | React 19 + webpack 5 (`QiankunWebpackPlugin`) | classic (window library)         |
| standalone-sandbox | 7103 | TypeScript + Vite 8                           | direct `@qiankunjs/sandbox` use |
| purehtml           | 7104 | no build, vendored jQuery                     | classic (inline global)          |

## Run

From the repo root:

```bash
pnpm install
pnpm start:example
```

This builds the workspace packages and starts every app's dev server in parallel. Open
http://localhost:7099 for the qiankun host or http://localhost:7103 for the standalone sandbox lab. The examples consume `qiankun` and `@qiankunjs/bundler-plugin` via
`workspace:*`, so they always demo the in-repo code — rebuild packages (`pnpm build:packages`)
after changing them.

## What each app demonstrates

Every micro app implements the same "isolation lab":

- **Window probe** — writes `window.__SANDBOX_PROBE__` inside its sandbox; the dashboard's
  host realm check proves the host window never sees it.
- **Timer probe** — starts a deliberately-leaked `setInterval`; qiankun reclaims it on unmount.
- **Style probe** — appends a `<style>` tinting `body`; with style isolation on, only the app's
  own area tints.
- **Local state** — a framework-idiomatic counter that lives and dies with the app instance.

`standalone-sandbox` is intentionally not a micro app. It imports only `@qiankunjs/sandbox`, evaluates a local third-party classic script, and demonstrates DOM/style containment plus timer and listener cleanup without `qiankun` or `@qiankunjs/loader`.
