# qiankun examples

Two identical shells hosting the same five independent micro apps, every one running with the JS
sandbox and runtime style isolation (`@scope`) explicitly enabled. Both mount them with `<MicroApp />` from our own
UI bindings — dogfooded rather than bypassed: `main` is the React shell (`@qiankunjs/react`) and
`vue-host` is the Vue one (`@qiankunjs/vue`). See [DESIGN.md](./DESIGN.md) for the shared design language.

They are deployed from `next` to **https://examples.qiankunjs.com** — see [Deployment](#deployment).

| app                | port | stack                                         | loading path                     |
| ------------------ | ---- | --------------------------------------------- | -------------------------------- |
| main               | 7099 | React 19 + Vite 8 + Tailwind 4                | host (`@qiankunjs/react`)        |
| vue-host           | 7105 | Vue 3.5 + Vite 8                              | host (`@qiankunjs/vue`)          |
| react              | 7100 | React 19 + Vite 8 (`bundler-plugin/vite`)     | ESM sandbox                      |
| vue                | 7101 | Vue 3.5 + Vite 8 (`bundler-plugin/vite`)      | ESM sandbox                      |
| webpack            | 7102 | React 19 + webpack 5 (`QiankunWebpackPlugin`) | classic (window library)         |
| standalone-sandbox | 7103 | TypeScript + Vite 8                           | direct `@qiankunjs/sandbox` use |
| purehtml           | 7104 | no build, vendored jQuery                     | classic (inline global)          |
| streaming          | 7106 | no build, chunk-flushing Node server          | classic, entry HTML streamed     |

## Run

From the repo root:

```bash
pnpm install
pnpm start:example
```

This builds the workspace packages and starts every app's dev server in parallel. Open
http://localhost:7099 for the React host, http://localhost:7105 for the Vue host, or
http://localhost:7103 for the standalone sandbox lab. The examples consume `qiankun`,
`@qiankunjs/react`, `@qiankunjs/vue` and `@qiankunjs/bundler-plugin` via `workspace:*`, so they always
demo the in-repo code — rebuild packages (`pnpm build:packages`) after changing them.

## What each app demonstrates

The framework apps implement the same "isolation lab":

- **Window probe** — writes `window.__SANDBOX_PROBE__` inside its sandbox; the dashboard's
  host realm check proves the host window never sees it.
- **Timer probe** — starts a deliberately-leaked `setInterval`; qiankun reclaims it on unmount.
- **Style probe** — appends a `<style>` tinting `body`; with style isolation on, only the app's
  own area tints.
- **Local state** — a framework-idiomatic counter that lives and dies with the app instance.

The **streaming** app demonstrates something none of the others can: its loading. Its server
(`examples/streaming/server.mjs`, zero dependencies) flushes the entry HTML in four paced chunks —
`index.html` is split on `<!--#flush:<ms>-->` markers, the pacing living next to the content it
delays — the way a server-side renderer emits markup as data becomes ready. qiankun's loader pipes
the response through the same streaming parser the browser uses for a top-level document, so each
chunk paints the moment it lands: the critical section is readable while the entry script has not
even been *requested* yet. Inline marks stamp every chunk's arrival, and the entry script — flushed
last on purpose — draws the resulting waterfall. Loaders that buffer the whole entry before
rendering can only show a spinner for that window, which is why this app is also the one whose
stage swaps the covering veil for a corner tag. Remounts replay from qiankun's warm cache and
render at once; reload the page to watch the cold stream again.

## Language switching, and what it demonstrates

Either shell switches between English and 简体中文 from the toolbar in its top-right corner, and the
choice reaches the micro apps: **the shell's locale is just a prop**. Every micro app implements the
`update` lifecycle, so switching language re-renders them in place — leave the counter at 3, switch
language, and it is still 3. That is the visible difference between `update` and a remount.

The two bindings spell the channel differently, and each shell is wired the way its binding expects —
worth knowing because getting it wrong is silent:

- **React** (`examples/main`) forwards every prop it does not own itself, so the shell passes
  `locale={locale}` straight to `<MicroApp />`.
- **Vue** (`examples/vue-host`) collects them in one wrapper, so the shell passes
  `:app-props="{ theme, locale }"`.

Each app owns its own translations — micro apps are independent deployables and none of them import
the shell's table. The no-build app has no framework to diff with, so its `update` repaints wholesale
and keeps its probe state in module scope to survive that.

The two shells are deliberately **the same application twice**: same dashboard, same sidebar, same
sandbox stage down to the trigram and the viewfinder ticks — the only difference is which binding does
the mounting. That is what makes them a fair comparison; anything that looks different between them is
a bug in one of the bindings or in one of the shells, not a design choice.

Both therefore carry the whole demo surface: the app registry and host-realm check on the dashboard,
the `appProps` toolbar, `data-mount-times` read off the live container (which is how you see a remount
take qiankun's warm path), and a "Missing app" route whose entry 404s on purpose so the error slot has
something to render.

`standalone-sandbox` is intentionally not a micro app. It imports only `@qiankunjs/sandbox`, evaluates a local third-party classic script, and demonstrates DOM/style containment plus timer and listener cleanup without `qiankun` or `@qiankunjs/loader`.

## Deployment

`next` deploys these examples to [examples.qiankunjs.com](https://examples.qiankunjs.com) (Cloudflare
Pages project `qiankun-examples`, driven by
[`.github/workflows/cloudflare-examples.yml`](../.github/workflows/cloudflare-examples.yml)). Because the
examples consume the workspace packages via `workspace:*`, a change under `packages/**` redeploys them
too — the deployed site always shows the current runtime.

A pull request into `next` that touches `examples/**` (or the site build script) gets a **preview
deployment** on a per-branch alias URL — surfaced in the workflow run's summary — without touching
production. Fork PRs are skipped: they cannot read the Cloudflare credentials.

`scripts/build-examples-site.mjs` aggregates every app into one static site. Locally:

```bash
pnpm run build:packages
node scripts/build-examples-site.mjs   # → dist-examples/
```

Where dev gives each app its own origin, the deployed site is one origin laid out by path:

| path                   | app                                                    |
| ---------------------- | ------------------------------------------------------ |
| `/`                    | the React shell                                        |
| `/vue-host/`           | the Vue shell                                          |
| `/apps/<name>/`        | the micro apps, served with `Access-Control-Allow-Origin: *` |
| `/standalone-sandbox/` | the sandbox-only lab                                   |

Two consequences worth knowing before you touch this:

- The shells read `import.meta.env.MODE === 'pages'` to pick between dev-server entries and `/apps/`
  ones, and the Vue shell hangs its routes off `import.meta.env.BASE_URL` because it is not at the
  site root. Add a route to a shell and the build script's `_redirects` generation picks it up — it
  reads the routes back out of `apps.ts` and fails the build if it cannot.
- `examples/404.html` ships to the site root deliberately. Without a top-level `404.html`, Cloudflare
  Pages treats the site as a single-page app and answers unmatched paths with the root shell at status
  200 — which would silently defeat the Vue shell's "Missing app" route.
- The streaming app's pacing survives deployment through a Pages Function: the build script copies
  `examples/streaming/pages-function.mjs` to `functions/apps/streaming/index.js` (repo root, where
  `wrangler pages deploy` looks), and that function re-chunks the statically uploaded `index.html`
  on the same `<!--#flush:<ms>-->` markers the dev server uses.
