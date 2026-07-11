import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import { chromium } from 'playwright';

import { runBrowserSample } from '../src/browser.mjs';
import { createFixtureServer } from '../src/server.mjs';
import { createStaticServer } from '../src/static-server.mjs';
import { PRODUCT_VARIANTS } from '../scenarios.mjs';

const hostRoot = fileURLToPath(new URL('../fixtures/host/dist', import.meta.url));

test('every benchmark variant reaches a painted core element and a settled app', async () => {
  const fixture = createFixtureServer({ chunkIntervalMs: 10, port: 0 });
  const host = createStaticServer({ port: 0, root: hostRoot });
  await Promise.all([fixture.start(), host.start()]);
  const browser = await chromium.launch({ headless: true });

  try {
    for (const variant of PRODUCT_VARIANTS) {
      const measurement = await runBrowserSample({
        browser,
        fixtureOrigin: fixture.origin,
        hostOrigin: host.origin,
        timeoutMs: 10_000,
        variant,
      });
      assert.ok(measurement.duration > 0, variant.id);
      assert.ok(measurement.t1 >= measurement.t0, variant.id);
      assert.equal(measurement.settled, true, variant.id);
    }
  } finally {
    await browser.close();
    await Promise.all([fixture.close(), host.close()]);
  }
});
