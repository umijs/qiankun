import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/e2e*.test.ts'],
    testTimeout: Number(process.env.E2E_TIMEOUT) || 180_000,
  },
});
