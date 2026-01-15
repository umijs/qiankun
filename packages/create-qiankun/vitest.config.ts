import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Exclude E2E tests from regular test runs - they require built dist
    exclude: ['**/e2e*.test.ts', '**/node_modules/**'],
    passWithNoTests: true,
  },
});
