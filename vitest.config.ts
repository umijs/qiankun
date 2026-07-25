import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

const fromRoot = (p: string) => fileURLToPath(new URL(p, import.meta.url));
const repositoryRoot = dirname(fileURLToPath(import.meta.url));
const isWorkspaceRoot = resolve(process.cwd()) === repositoryRoot;

export default defineConfig({
  define: {
    __QIANKUN_VERSION__: JSON.stringify('0.0.0-test'),
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
    },
  },
  test: {
    globals: false,
    environment: 'happy-dom',
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
                exclude: ['packages/create-qiankun/tests/e2e*.test.ts', '**/node_modules/**'],
              },
            },
          ],
        }
      : {}),
  },
});
