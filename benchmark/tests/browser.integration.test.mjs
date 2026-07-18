import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import { chromium } from 'playwright';

import { runBrowserSample } from '../src/browser.mjs';
import { CHROMIUM_LAUNCH_ARGS, createBenchmarkOrigins } from '../src/origins.mjs';
import { createFixtureServer } from '../src/server.mjs';
import { inspectCrossSiteIsolation } from '../src/site-isolation.mjs';
import { createStaticServer } from '../src/static-server.mjs';
import { SUITES } from '../scenarios.mjs';

const hostRoot = fileURLToPath(new URL('../fixtures/host/dist', import.meta.url));

test('every benchmark variant reaches a painted core element and a settled app', async () => {
  const fixture = createFixtureServer({ chunkIntervalMs: 10, port: 0 });
  const host = createStaticServer({ port: 0, root: hostRoot });
  await Promise.all([fixture.start(), host.start()]);
  const browser = await chromium.launch({ args: CHROMIUM_LAUNCH_ARGS, headless: true });

  try {
    const { fixtureOrigins } = createBenchmarkOrigins({
      fixtureOrigin: fixture.origin,
      hostOrigins: { candidate: host.origin },
    });
    const siteIsolationVariants = SUITES['site-isolation'].variants;
    const nativeCrossSite = siteIsolationVariants.find(({ id }) => id === 'native-iframe-cross-site');
    const wujieCrossSite = siteIsolationVariants.find(({ id }) => id === 'wujie-cross-site-entry');
    assert.ok(nativeCrossSite);
    assert.ok(wujieCrossSite);

    const siteIsolation = await inspectCrossSiteIsolation({
      browser,
      fixtureOrigins,
      hostOrigin: host.origin,
      nativeVariant: nativeCrossSite,
      timeoutMs: 10_000,
      wujieVariant: wujieCrossSite,
    });
    assert.equal(siteIsolation.crossSiteEntryOrigin, fixtureOrigins['cross-site']);
    assert.equal(siteIsolation.nativeIframe.oopif, true);
    assert.match(siteIsolation.nativeIframe.targetUrl, /^http:\/\/benchmark-app\.localhost:/u);
    assert.equal(siteIsolation.wujie.appSiteOopif, false);
    assert.equal(siteIsolation.wujie.targetUrl, null);

    const uniqueVariants = [
      ...new Map(
        Object.values(SUITES)
          .flatMap((suite) => suite.variants)
          .map((variant) => [variant.id, variant]),
      ).values(),
    ];
    for (const variant of uniqueVariants) {
      fixture.resetRequestCounts();
      let measurement;
      try {
        measurement = await runBrowserSample({
          browser,
          fixtureOrigins,
          hostOrigin: host.origin,
          timeoutMs: 10_000,
          variant,
        });
      } catch (error) {
        throw new Error(
          `${variant.id}: ${error instanceof Error ? error.message : String(error)}`,
          error instanceof Error ? { cause: error } : undefined,
        );
      }
      assert.ok(measurement.duration > 0, variant.id);
      assert.ok(measurement.t1 >= measurement.t0, variant.id);
      assert.equal(measurement.cleaned, true, variant.id);
      assert.equal(measurement.settled, true, variant.id);
      if (variant.id === 'qk-full-isolation') {
        assert.equal(fixture.getRequestCount('/app/entry.js'), 1, 'qiankun preload must satisfy the sandbox fetch');
        assert.equal(fixture.getRequestCount('/app/style.css'), 1, 'qiankun preload must satisfy the style fetch');
      }
    }
  } finally {
    await browser.close();
    await Promise.all([fixture.close(), host.close()]);
  }
});

test('RFC performance probes execute membrane get/set and ESM rewrite work', async () => {
  const host = createStaticServer({ port: 0, root: hostRoot });
  await host.start();
  const browser = await chromium.launch({ args: CHROMIUM_LAUNCH_ARGS, headless: true });

  try {
    const page = await browser.newPage();
    await page.goto(`${host.origin}/rfc-performance.html`, { waitUntil: 'load' });
    const measurements = await page.evaluate(async () => {
      if (!window.__RFC_PERFORMANCE__) throw new Error('RFC performance host API is unavailable');
      return Promise.all([
        window.__RFC_PERFORMANCE__.run('membrane-get', 50_000),
        window.__RFC_PERFORMANCE__.run('membrane-set', 50_000),
        window.__RFC_PERFORMANCE__.run('module-rewrite', 2),
      ]);
    });

    assert.deepEqual(
      measurements.map(({ metric }) => metric),
      ['membrane-get', 'membrane-set', 'module-rewrite'],
    );
    measurements.forEach((measurement) => {
      assert.ok(measurement.duration > 0, measurement.metric);
      assert.ok(Number.isFinite(measurement.checksum), measurement.metric);
    });
    assert.ok(measurements[2].bytesPerOperation > 0);
  } finally {
    await browser.close();
    await host.close();
  }
});

test('SSR phase diagnostics prove progressive paint before the full response', async () => {
  const chunkIntervalMs = 100;
  const fixture = createFixtureServer({ chunkIntervalMs, port: 0 });
  const host = createStaticServer({ port: 0, root: hostRoot });
  await Promise.all([fixture.start(), host.start()]);
  const browser = await chromium.launch({ args: CHROMIUM_LAUNCH_ARGS, headless: true });

  try {
    const { fixtureOrigins } = createBenchmarkOrigins({
      fixtureOrigin: fixture.origin,
      hostOrigins: { candidate: host.origin },
    });
    const variants = new Map(SUITES['ssr-streaming'].variants.map((variant) => [variant.id, variant]));
    const run = (id) =>
      runBrowserSample({
        browser,
        fixtureOrigins,
        hostOrigin: host.origin,
        timeoutMs: 10_000,
        variant: variants.get(id),
      });

    const progressive = await run('qk-v3-ssr-streamed');
    assert.ok(progressive.entryResponseEndDuration >= chunkIntervalMs * 2);
    assert.ok(progressive.duration < progressive.entryResponseEndDuration);
    assert.ok(progressive.settledDuration >= progressive.entryResponseEndDuration);

    const native = await run('native-iframe-ssr-streamed');
    assert.ok(native.duration < chunkIntervalMs * 2);
    assert.ok(native.settledDuration >= chunkIntervalMs * 2);
    assert.equal(native.entryResponseEndDuration, null);

    for (const id of [
      'qk-v3-ssr-delayed-buffered',
      'qk-v2-ssr-streamed',
      'wujie-ssr-streamed',
      'garfish-ssr-streamed',
    ]) {
      const buffered = await run(id);
      assert.ok(buffered.entryResponseEndDuration >= chunkIntervalMs * 2, id);
      assert.ok(buffered.duration >= buffered.entryResponseEndDuration, id);
    }
  } finally {
    await browser.close();
    await Promise.all([fixture.close(), host.close()]);
  }
});
