import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const fromRoot = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  // Resolve workspace packages to their source so cross-package test imports (e.g. the sandbox tests
  // importing @qiankunjs/shared through the membrane) work without a prior build — the CI unit-test
  // job runs `pnpm run test` without building dist.
  resolve: {
    alias: {
      '@qiankunjs/shared': fromRoot('./packages/shared/src/index.ts'),
      '@qiankunjs/sandbox': fromRoot('./packages/sandbox/src/index.ts'),
      '@qiankunjs/loader': fromRoot('./packages/loader/src/index.ts'),
    },
  },
  test: {
    globals: false,
    environment: 'happy-dom',
  },
});
