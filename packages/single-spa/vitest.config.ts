import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const fromHere = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// Self-contained config for the vendored single-spa specs. The root vitest.config.ts references
// this file as a workspace project, and `pnpm --filter @qiankunjs/single-spa run test` picks it up
// directly — keep it independent of the root config so both entry points behave identically.
export default defineConfig({
  define: {
    // Compile-time constants the vendored sources expect, matching upstream's jest globals
    // (__PROFILE__ included — the specs exercise the profiler; the published build still compiles
    // it to false). BABEL_ENV "test" enables navigateToUrl's simulated-DOM navigation branch.
    __DEV__: 'true',
    __PROFILE__: 'true',
    'process.env.BABEL_ENV': JSON.stringify('test'),
  },
  resolve: {
    alias: {
      // the upstream specs import the upstream package name (jest moduleNameMapper equivalent)
      'single-spa': fromHere('./src/single-spa.ts'),
    },
  },
  test: {
    name: 'single-spa',
    // The vendored upstream specs assume jest-style implicit globals and upstream's jsdom
    // environment (happy-dom diverges on navigation/event dispatch, which these specs exercise
    // heavily; jsdom is pinned to 20.x to match jest-environment-jsdom 29's fragment-navigation
    // semantics). Per-file overrides (the node environment for node-spec) use
    // @vitest-environment docblocks.
    globals: true,
    environment: 'jsdom',
    // upstream specs hard-code jest-jsdom's default origin (no port)
    environmentOptions: { jsdom: { url: 'http://localhost/' } },
    include: ['{spec,node-spec}/**/*.spec.ts'],
    exclude: ['**/node_modules/**'],
    // single-spa deliberately rethrows lifecycle errors on the global scope when no error handler
    // is registered; many upstream specs trigger that path on purpose (jest never surfaced
    // these), so ignore exactly those — a SingleSpaError carries an appOrParcelName property
    onUnhandledError(error) {
      return typeof error === 'object' && 'appOrParcelName' in error ? false : undefined;
    },
  },
});
