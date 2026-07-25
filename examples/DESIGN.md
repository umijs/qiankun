# qiankun examples — design language

The examples share one visual system, "a universe in every sleeve" (袖里乾坤): the main app
is a porcelain-and-ink shell, every micro app is an independent small universe rendered
inside a visible sandbox boundary. Keep this file in sync when you touch the examples' UI.

## Tokens

Color (light developer console: refined hairlines on cool neutrals, geekblue primary; the
cinnabar seal stays as the one brand mark):

| token            | value     | usage                                                          |
| ---------------- | --------- | -------------------------------------------------------------- |
| `--paper`        | `#F7F8FA` | page background (cool, light)                                  |
| `--surface`      | `#FFFFFF` | cards, sidebar, stage                                          |
| `--ink`          | `#1B1F26` | primary text                                                   |
| `--ink-soft`     | `#5C6470` | secondary text                                                 |
| `--hairline`     | `#E4E7EC` | borders, dividers                                              |
| `--primary`      | `#2F54EB` | primary (geekblue): active nav, ticks, esm pill, live badges   |
| `--primary-deep` | `#1D39C4` | primary hover / deep                                           |
| `--cinnabar`     | `#D93026` | the seal brand mark + breach/danger ONLY                       |
| `--success`      | `#16A34A` | healthy status (trigram, mounted, host clean)                  |

Per-app accent (used only inside that app and for its sidebar dot):

- react `#087EA4` · vue `#42B883` · webpack `#1C78C0` · purehtml `#B8860B`

Typography:

- Display: `Space Grotesk` (500–700) — hero, app names, wordmark; geometric grotesque that
  reads developer-tool. Body: `IBM Plex Sans` (400/500/600). No serif latin anywhere; the only
  serif glyphs are the hanzi ornaments (乾坤 watermark & seal) in `'Songti SC', 'STSong', serif`.
- Data: `IBM Plex Mono` (400/500) — ports, versions, entries, probe output, badges.
- Google Fonts URL (each app imports the same one, browser caches it):
  `https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap`
- CJK fallback after each: `'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif`.

Shape & depth: radius `10px` cards / `6px` controls; hairline 1px borders; shadow only on
the stage frame: `0 1px 2px rgb(28 32 38 / 4%), 0 8px 24px rgb(28 32 38 / 6%)`.

Motion: 160ms ease-out on hover states; one orchestrated moment only — the stage frame
fades/lifts 8px on mount. Always honor `prefers-reduced-motion`.

## Signature elements (main app)

1. **The sandbox stage**: the micro-app container is wrapped in a "boundary frame" with
   corner ticks (viewfinder style), a header strip reading `data-name` / `data-version`
   off the live container, and the trigram status.
2. **The qian trigram (☰)**: three horizontal bars = JS sandbox / style isolation /
   mounted. A healthy, fully isolated, mounted app shows the full 乾 trigram; a bar
   renders broken (two segments) while its dimension is off/pending. This is a status
   display, not decoration.
3. **The seal**: a small cinnabar square stamped 乾坤 (SVG) — sidebar brand + favicon.

## Copy register

English, sentence case, plain verbs, no emoji, no exclamation marks. Data in mono.
The demo explains itself: every probe states what it proves in one line.

## Apps & ports

| app      | port | stack                                    | loading path            |
| -------- | ---- | ---------------------------------------- | ----------------------- |
| main     | 7099 | React 19 + Vite 8 + Tailwind 4           | host (`@qiankunjs/react`) |
| vue-host | 7105 | Vue 3.5 + Vite 8                         | host (`@qiankunjs/vue`)   |
| react    | 7100 | React 19 + Vite 8 (`bundler-plugin/vite`) | ESM sandbox             |
| vue      | 7101 | Vue 3.5 + Vite 8 (`bundler-plugin/vite`)  | ESM sandbox             |
| webpack  | 7102 | React 19 + webpack 5 (`QiankunWebpackPlugin`) | classic (window library) |
| purehtml | 7104 | no build, vendored jQuery                | classic (inline global) |

All examples are pnpm workspace members and consume `qiankun` / `@qiankunjs/react` /
`@qiankunjs/bundler-plugin` via `workspace:*`, so they always demo the in-repo code. Sandbox is
explicitly enabled (`sandbox: true`) and style isolation on (`styleIsolation: true`) for every app.

Both shells mount micro apps with `<MicroApp />` from the bindings we ship — `main` through
`@qiankunjs/react`, `vue-host` through `@qiankunjs/vue` — one instance inside the stage frame, named by
the active route. Loading and failure states are the component's `loader` / `errorBoundary` slots, so the
stage veil and the mount-failed panel are dressed slots rather than shell-owned state.

`main` is the full shell and owns the signature elements below. `vue-host` is deliberately slim: it carries
the tokens, the stage frame and the header strip, but no dashboard, seal SVG or trigram. It uses plain
scoped CSS with the same custom properties rather than a utility toolchain, and its extra instruments (the
`appProps` toggle, the failing route, `data-mount-times`) exist to make the Vue binding verifiable.

## Sub-app layout contract

Every sub app renders a single column (max-width 720px, centered):

1. **Header row**: accent dot + `<Framework> micro app` (Fraunces), badges (mono):
   framework version, bundler, and mode — `inside qiankun` (accent) vs `standalone`.
2. **Isolation lab** card — three probes, each a row: control on the left, live mono
   output + one-line explanation on the right:
   - _Window probe_: writes `window.__SANDBOX_PROBE__ = '<app>:<n>'`, reads it back.
     Proves globals stay inside the app's membrane (main shows the host value stays clean).
   - _Timer probe_: starts a 1s `setInterval` tick counter and never clears it.
     Proves qiankun reclaims leaked timers on unmount.
   - _Style probe_: appends a `<style>` tinting `body` background. With style isolation
     on, only the app's own area tints.
3. **Local state** card: a framework-idiomatic counter proving independent state.
4. **Footer** line (mono, ink-soft): `entry //localhost:<port> · lifecycle: <path>`. The Vue app
   appends `· host props: <scalars>` — it is the one app implementing an `update` lifecycle, which is
   how `vue-host` demonstrates the bindings' props channel.

Style rules for sub apps: scope everything under the app root element; no global
resets, no `body`/`html` rules in the app stylesheet (the style probe is the only,
deliberate exception). Standalone page background comes from a `<style>` in the app's
own `index.html`.
