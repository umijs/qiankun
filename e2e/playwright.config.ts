import { defineConfig, devices } from '@playwright/test';
import { PORTS } from './ports';

const CI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: CI,
  // retries only on CI: local flakiness must surface immediately instead of being masked
  retries: CI ? 2 : 0,
  reporter: CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORTS.main}`,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // webkit/firefox run on the full matrix (nightly / pre-release), select via --project
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
  webServer: [
    {
      command: `node servers/serve.mjs fixtures/main/dist ${PORTS.main}`,
      url: `http://localhost:${PORTS.main}`,
      reuseExistingServer: !CI,
    },
    {
      command: `node servers/serve.mjs fixtures/sub-classic ${PORTS['sub-classic']}`,
      url: `http://localhost:${PORTS['sub-classic']}`,
      reuseExistingServer: !CI,
    },
    {
      command: `node servers/serve.mjs fixtures/sub-esm ${PORTS['sub-esm']}`,
      url: `http://localhost:${PORTS['sub-esm']}`,
      reuseExistingServer: !CI,
    },
    {
      command: `node servers/serve.mjs fixtures/sub-misbehaving ${PORTS['sub-misbehaving']}`,
      url: `http://localhost:${PORTS['sub-misbehaving']}`,
      reuseExistingServer: !CI,
    },
    {
      command: `node servers/serve.mjs ../examples/standalone-sandbox/dist ${PORTS['standalone-sandbox']}`,
      url: `http://localhost:${PORTS['standalone-sandbox']}`,
      reuseExistingServer: !CI,
    },
  ],
});
