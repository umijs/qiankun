import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

const fromRoot = (p: string) => fileURLToPath(new URL(p, import.meta.url));
const repositoryRoot = dirname(fileURLToPath(import.meta.url));
const isWorkspaceRoot = resolve(process.cwd()) === repositoryRoot;

export default defineConfig({
  define: {
    __QIANKUN_VERSION__: JSON.stringify('0.0.0-test'),
    // Compile-time constants the vendored single-spa sources expect, matching upstream's jest
    // globals (__PROFILE__ included — its specs exercise the profiler; the published build still
    // compiles it to false). BABEL_ENV "test" enables navigateToUrl's simulated-DOM branch.
    __DEV__: 'true',
    __PROFILE__: 'true',
    'process.env.BABEL_ENV': JSON.stringify('test'),
  },
  // Resolve workspace packages to their source so cross-package test imports (e.g. the sandbox tests
  // importing @qiankunjs/shared through the membrane) work without a prior build — the CI unit-test
  // job runs `pnpm run test` without building dist.
  resolve: {
    alias: {
      '@qiankunjs/shared': fromRoot('./packages/shared/src/index.ts'),
      '@qiankunjs/sandbox': fromRoot('./packages/sandbox/src/index.ts'),
      '@qiankunjs/loader': fromRoot('./packages/loader/src/index.ts'),
      '@qiankunjs/ui-shared': fromRoot('./packages/ui-bindings/shared/src/index.ts'),
      // the ui bindings import the facade by package name; the binding tests mock it, but the
      // specifier still has to resolve without a built dist
      qiankun: fromRoot('./packages/qiankun/src/index.ts'),
      '@qiankunjs/single-spa': fromRoot('./packages/single-spa/src/index.ts'),
      // the vendored single-spa specs import the upstream package name (jest moduleNameMapper
      // equivalent); nothing else in the workspace may use this bare specifier
      'single-spa': fromRoot('./packages/single-spa/src/single-spa.ts'),
    },
  },
  test: {
    globals: false,
    environment: 'happy-dom',
    // single-spa deliberately rethrows lifecycle errors on the global scope when no error handler
    // is registered; many of its vendored upstream specs trigger that path on purpose (jest never
    // surfaced these), so ignore exactly those — a SingleSpaError carries an appOrParcelName
    // property. Root-level because vitest ignores per-project onUnhandledError callbacks.
    onUnhandledError(error) {
      return typeof error === 'object' && 'appOrParcelName' in error ? false : undefined;
    },
    // Vitest 4 replaces vitest.workspace.ts with projects. Package scripts also discover this root
    // config, so only enable workspace project discovery when Vitest itself starts at the repo root.
    ...(isWorkspaceRoot
      ? {
          projects: [
            {
              extends: true,
              test: {
                name: 'packages',
                include: ['packages/**/*.{test,spec}.{ts,tsx}'],
                exclude: ['packages/create-qiankun/tests/e2e*.test.ts', 'packages/single-spa/**', '**/node_modules/**'],
              },
            },
            // the vendored single-spa specs need jest-flavored settings; they live in the
            // package's own config so `pnpm --filter @qiankunjs/single-spa run test` matches
            './packages/single-spa/vitest.config.ts',
          ],
        }
      : {}),
  },
});
