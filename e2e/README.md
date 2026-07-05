# qiankun e2e

Browser end-to-end tests built on [Playwright](https://playwright.dev). They exercise the **built artifacts** of the workspace packages (`pnpm build` output) through real cross-origin app loading, which is exactly what unit tests running in happy-dom cannot cover.

## Layout

```
e2e/
├── ports.ts            # single source of truth for all fixture ports
├── playwright.config.ts # webServer array boots main + all sub apps automatically
├── servers/serve.mjs    # zero-dep static server with CORS (real cross-origin deployment shape);
│                        # /__e2e__/request-count endpoints let tests assert per-path server hits
│                        # (e.g. the modulepreload warm-up being reused from the preload cache)
├── fixtures/
│   ├── main/            # vite-built main app, bundles the local `qiankun` package,
│   │                    # exposes window.__E2E__ for tests to drive loadMicroApp imperatively
│   ├── sub-classic/     # classic global-lifecycle sub app (the UMD shape), no build step
│   ├── sub-esm/         # native ESM sub app with a multi-module graph, no build step;
│   │                    # preload.html variant carries a <link rel="modulepreload"> (vite output shape)
│   └── sub-misbehaving/ # deliberately bad app: mount errors + leaked intervals (via props)
└── tests/               # suites organized by framework invariants, not by pages
```

The main fixture serves two pages: `index.html` (imperative `loadMicroApp` playground driven via `window.__E2E__`) and `register.html` (`registerMicroApps` + hash-based `activeRule` routing mode).

Suites map to qiankun's core promises:

- `lifecycle` — mount/unmount/remount, lifecycle caching (scripts must not re-execute on remount)
- `sandbox-js` — window pollution stays inside the sandbox, main-realm globals stay readable, leaked intervals reclaimed on unmount
- `esm-sandbox` — ESM entry lifecycles, sandboxed module graph, namespace caching across remounts
- `style-isolation` — `@scope` based CSS isolation, with a control test documenting the unisolated leak
- `error-handling` — 404 entries and throwing mounts reject cleanly without breaking the main app
- `multi-instance` — same app twice in independent sandboxes, mixed classic + esm coexistence
- `router-mode` — route-driven mount/unmount/switch including history back

## Browser matrix

PRs run chromium only (`ci.yml`). The full chromium + webkit + firefox matrix runs nightly and on demand via the `E2E Full Browser Matrix` workflow.

Known engine limitation: the ESM sandbox relies on dynamically injected import maps, which **Firefox does not support yet**. Every test that mounts `sub-esm` carries a `test.fail(browserName === 'firefox', FIREFOX_ESM_LIMITATION)` annotation — an _expected failure_, not a skip. The day Firefox starts passing, playwright reports "passed unexpectedly" so we know to lift the annotations.

## Running

```bash
# from repo root: builds all packages first, then runs chromium suite
pnpm run test:e2e

# from e2e/: assumes packages are already built
pnpm run test:e2e        # chromium only (what CI runs on PRs)
pnpm run test:e2e:all    # chromium + webkit + firefox (install browsers first)
pnpm run test:e2e:ui     # playwright UI mode for debugging
```

First time only: `npx playwright install chromium` (or `--with-deps` on linux).

Sub-app fixtures are served directly from source; only `fixtures/main` needs a build (`pnpm run build:fixtures`, done automatically by the test scripts). After changing any `packages/*` source, rebuild the package **and** the main fixture, since the fixture bundles qiankun.

## Rules (anti-flake discipline)

1. Never `waitForTimeout` — use web-first assertions (`expect(locator).…` retries automatically).
2. Tests are independent: each starts from `page.goto('/')`, no shared state, no ordering.
3. Fixtures must stay dependency-free and deterministic: no CDN assets, no frameworks unless the suite explicitly targets a ui-binding, no timers in the happy path.
4. All ports come from `ports.ts`; never hardcode a port anywhere else.
5. Retries are CI-only (`retries: 2`). If a test flakes locally, fix it, don't rerun it.
6. Assert sandbox behavior via `page.evaluate` probes on the main realm + DOM markers rendered by the sub apps — precise assertions, not screenshots.
