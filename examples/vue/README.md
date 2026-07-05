# vue micro app

Vue 3.5 + Vite 8 micro app for the qiankun examples, loaded through the qiankun ESM sandbox.

- Entry: `index.html` marks `/src/main.ts` with the `entry` attribute; `@qiankunjs/bundler-plugin/vite` handles dev/preview CORS headers and entry marking.
- Lifecycle: `src/main.ts` exports `bootstrap` / `mount` / `unmount` as native ESM exports, plus a `window['vue']` fallback for classic loading (the registered qiankun app name is `vue`).
- UI: an isolation lab (window / timer / style probes) and a local state counter, following `examples/DESIGN.md`.

Run standalone with `pnpm dev` (http://localhost:7101), or start the main app on port 7099 and open it from the sidebar.
