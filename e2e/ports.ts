// Single source of truth for all e2e fixture ports.
// Referenced by playwright.config.ts (which passes them to servers/serve.mjs via argv)
// and by the main fixture app for its sub-app entry URLs.
export const PORTS = {
  main: 7500,
  'sub-classic': 7501,
  'sub-esm': 7502,
  'sub-misbehaving': 7503,
  'standalone-sandbox': 7504,
} as const;

export const SUB_APP_ENTRIES = {
  'sub-classic': `http://localhost:${PORTS['sub-classic']}`,
  // same server, dedicated pages exercising classic script streaming semantics
  'sub-classic-multiscript': `http://localhost:${PORTS['sub-classic']}/multiscript.html`,
  // explicit <head>, intentionally no <body>: exercises the fragment parsing + sandbox body facade
  'sub-classic-bodyless': `http://localhost:${PORTS['sub-classic']}/bodyless.html`,
  'sub-classic-broken-asset': `http://localhost:${PORTS['sub-classic']}/broken-asset.html`,
  'sub-esm': `http://localhost:${PORTS['sub-esm']}`,
  // same server, dedicated page whose HTML carries a <link rel="modulepreload">
  'sub-esm-preload': `http://localhost:${PORTS['sub-esm']}/preload.html`,
  'sub-misbehaving': `http://localhost:${PORTS['sub-misbehaving']}`,
  // resolves to a 404 on purpose: the error-handling suite asserts the failure path
  'sub-missing': `http://localhost:${PORTS['sub-misbehaving']}/missing/`,
} as const;
