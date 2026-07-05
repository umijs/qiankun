# react micro app

React 19 + Vite 8 micro app for the qiankun examples, loaded through the qiankun ESM sandbox.

- Entry: `index.html` marks `/src/main.tsx` with the `entry` attribute; `@qiankunjs/bundler-plugin/vite` handles dev/preview CORS headers and entry marking.
- Lifecycle: `src/main.tsx` exports `bootstrap` / `mount` / `unmount` as native ESM exports, plus a `window['react']` fallback for classic loading.
- UI: an isolation lab (window / timer / style probes) and a local state counter, following `examples/DESIGN.md`.

Run standalone with `pnpm dev` (http://localhost:7100), or start the main app on port 7099 and open it from the sidebar.
