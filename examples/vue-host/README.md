# vue host

Vue 3.5 + Vite 8 host for the qiankun examples: the second shell, and the one that keeps
`@qiankunjs/vue` honest. It mounts the same four micro apps as `examples/main`, but through
`<MicroApp>` from the Vue binding instead of the React one.

- Mounting: `src/Stage.vue` renders one `<MicroApp>` whose `:name` / `:entry` come from the active
  route, with `:settings="{ sandbox: { styleIsolation: true } }"`. Leaving a route unmounts the app;
  no `key` is used, so switching apps goes through the binding's own `name` watcher.
- Slots: `#loader="{ loading }"` draws the stage veil and `#error-boundary="{ error }"` draws the
  mount-failed panel. The binding's wrapper is not positioned, so the shell positions it through
  `wrapper-class-name`.
- Routing: the brand, sidebar, and dashboard use `<MicroAppLink>` from `@qiankunjs/vue`.
  `src/main.ts` calls `start()` before mounting the shell so navigation works from the dashboard
  before any micro app has loaded. `src/router.ts` keeps a reactive pathname in sync with browser
  history and single-spa routing events; the active route still drives `<MicroApp>` mounting.
- Deliberately slim: no dashboard, seal or trigram (see `examples/DESIGN.md`), plain scoped CSS over
  the shared tokens, and no `@qiankunjs/bundler-plugin` — this is a host, not a micro app.

Three things it can show that the React shell cannot:

- **`appProps` → `update`** — the toggle above the stage mutates `appProps.theme`; the Vue micro app
  is the only example implementing an `update` lifecycle, and echoes what it receives in its footer.
- **The error slot** — the “Missing app” route points at an entry that 404s on purpose.
- **Warm remounts** — the header strip reads `data-mount-times` off the live container, so leaving an
  app and coming back visibly reuses qiankun's cached parcel for that container.

Run standalone with `pnpm dev` (http://localhost:7105); the micro apps on 7100–7104 must be running
too, which `pnpm start:example` from the repo root takes care of.
