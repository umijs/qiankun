import { expect, test } from '@playwright/test';
import { PORTS } from '../ports';
import {
  FIREFOX_ESM_LIMITATION,
  loadApp,
  loadAppWithPrecompiledHook,
  readHookMetrics,
  readMainRealmGlobal,
  unmountApp,
} from './helpers';

const SUB_ESM_ORIGIN = `http://localhost:${PORTS['sub-esm']}`;
const PRELOADED_MODULE_PATH = '/modules/preloaded.js';

// Expected failure, not a skip: the day Firefox starts passing, playwright reports
// "passed unexpectedly" and we know to lift the annotation.
test.fail(({ browserName }) => browserName === 'firefox', FIREFOX_ESM_LIMITATION);

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('esm sub app under sandbox', () => {
  test('mounts with its module graph resolved', async ({ page }) => {
    const status = await loadApp(page, 'sub-esm');
    expect(status).toBe('MOUNTED');

    await expect(page.getByTestId('esm-title')).toHaveText('esm mounted');
    // importedCount proves ./lib/counter.js executed inside the same sandboxed graph
    await expect(page.getByTestId('esm-counters')).toHaveText('mount:1,importedCount:1');
  });

  test('mounts when CSP allows blob scripts but omits unsafe-eval', async ({ page }) => {
    const response = await page.goto('/?csp-no-eval');
    expect(response?.ok()).toBe(true);
    const policy = response?.headers()['content-security-policy'];
    expect(policy).toContain('script-src');
    expect(policy).toContain('blob:');
    expect(policy).not.toContain("'unsafe-eval'");

    const status = await loadApp(page, 'sub-esm');
    expect(status).toBe('MOUNTED');
    await expect(page.getByTestId('esm-title')).toHaveText('esm mounted');
  });

  test('window pollution from the esm app is invisible from the main realm', async ({ page }) => {
    await loadApp(page, 'sub-esm');
    await expect(page.getByTestId('esm-title')).toBeVisible();

    expect(await readMainRealmGlobal(page, '__ESM_POLLUTION__')).toBeUndefined();
  });

  test('main realm globals stay readable inside the esm sandbox', async ({ page }) => {
    await loadApp(page, 'sub-esm');

    await expect(page.getByTestId('esm-main-global')).toHaveText('value-from-main');
  });

  test('sandbox globals participates in ESM global rewriting without leaking', async ({ page }) => {
    await loadApp(page, 'sub-esm', { sandbox: { globals: { e2eExtraGlobal: 'esm-extra' } } });

    await expect(page.getByTestId('esm-extra-global')).toHaveText('esm-extra');
    expect(await readMainRealmGlobal(page, 'e2eExtraGlobal')).toBeUndefined();
  });

  test('a custom importHook can mount a precompiled module without fetching or rewriting it', async ({ page }) => {
    const key = 'precompiled-hook';
    const status = await loadAppWithPrecompiledHook(page, key);
    expect(status).toBe('MOUNTED');
    await expect(page.locator(`#container-${key}`).getByTestId('precompiled-hook')).toHaveText(
      'static dependency:linked-path:value-from-main:sub-esm',
    );
    expect(await readHookMetrics(page, key)).toEqual({ hookCalls: 2, moduleFetches: 0 });
    expect(await readMainRealmGlobal(page, '__PRECOMPILED_HOOK_POLLUTION__')).toBeUndefined();
  });

  test('runtime-created dunder globals stay readable as bare identifiers across modules', async ({ page }) => {
    await loadApp(page, 'sub-esm');

    // __RUNTIME_FLAG__ written by a dep module at eval time, read bare by the entry;
    // __SELF_FLAG__ written after its reader module's bindings were created (live-binding path)
    await expect(page.getByTestId('esm-flags')).toHaveText('runtime:flag-on,self:self-on');

    // the flags live in the sandbox only, never on the main realm
    expect(await readMainRealmGlobal(page, '__RUNTIME_FLAG__')).toBeUndefined();
    expect(await readMainRealmGlobal(page, '__SELF_FLAG__')).toBeUndefined();
  });

  test('remount reuses the cached module namespace', async ({ page }) => {
    await loadApp(page, 'sub-esm');
    await unmountApp(page, 'sub-esm');
    const status = await loadApp(page, 'sub-esm');
    expect(status).toBe('MOUNTED');

    // module-level state survives remount: the graph was cached, not re-evaluated
    await expect(page.getByTestId('esm-counters')).toHaveText('mount:2,importedCount:2');
  });

  test('modulepreload is rewritten to a preload-as-fetch warm-up that the module pipeline reuses', async ({
    page,
    request,
  }) => {
    // isolate from CI retries / --repeat-each residue; the module is only ever requested
    // by this test's fixture graph, so parallel workers cannot pollute the count
    await request.get(`${SUB_ESM_ORIGIN}/__e2e__/reset-request-count?path=${PRELOADED_MODULE_PATH}`);

    const status = await loadApp(page, 'sub-esm-preload');
    expect(status).toBe('MOUNTED');
    await expect(page.getByTestId('esm-preload-marker')).toHaveText('preloaded:on');

    // rewritten in place, classic-path alignment (RFC §10.1): href kept, modulepreload's
    // cors semantics mapped onto the preload so it can match the pipeline fetch().
    // Scoped to the container: the main app is a vite build with its own modulepreloads.
    const container = page.locator('#container-sub-esm-preload');
    const rewritten = container.locator(`link[rel="preload"][as="fetch"][href$="${PRELOADED_MODULE_PATH}"]`);
    await expect(rewritten).toHaveAttribute('crossorigin', 'anonymous');
    await expect(container.locator('link[rel="modulepreload"]')).toHaveCount(0);

    // the warm-up request really came from the rewritten link, not from the pipeline fetch...
    const initiators = await page.evaluate(
      (url) => performance.getEntriesByName(url).map((entry) => (entry as PerformanceResourceTiming).initiatorType),
      `${SUB_ESM_ORIGIN}${PRELOADED_MODULE_PATH}`,
    );
    expect(initiators).toContain('link');

    // ...and it is the only server hit: the pipeline fetch() was served from the browser
    // preload cache. The fixture server sends Cache-Control: no-store, so a preload-cache
    // miss cannot hide in the HTTP cache — it would surface as a second request here.
    const counter = await request.get(`${SUB_ESM_ORIGIN}/__e2e__/request-count?path=${PRELOADED_MODULE_PATH}`);
    expect(((await counter.json()) as { count: number }).count).toBe(1);
  });

  test('resolves concurrent dynamic imports with colliding modules without flushing stale import map entries', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => {
      errors.push(err.message);
    });

    const status = await loadApp(page, 'sub-esm-concurrent-dynamic');
    expect(status).toBe('MOUNTED');
    await expect(page.getByTestId('esm-concurrent-shared')).toHaveText('a:shared-colliding|b:shared-colliding');
    await expect(page.getByTestId('esm-concurrent-independent')).toHaveText('independent-colliding|fast-ok');
    expect(errors).toEqual([]);
    expect(await readMainRealmGlobal(page, '__CONCURRENT_SHARED__')).toBeUndefined();
    expect(await readMainRealmGlobal(page, '__CONCURRENT_INDEPENDENT__')).toBeUndefined();
  });

  test('awaits an in-flight shared colliding probe across concurrent native graphs', async ({ page }) => {
    await page.goto('/esm-race.html');
    const result = await page.evaluate(() =>
      (
        window as unknown as {
          __ESM_RACE__: {
            verifySharedProbeBarrier(): Promise<{
              initialCollisionProbeCalls: number;
              bSettledDuringGate: boolean;
              aSettledDuringGate: boolean;
              sharedInImportMapDuringGate: boolean;
              branchA: unknown;
              branchB: unknown;
              sandboxValue: unknown;
              mainValue: unknown;
            }>;
          };
        }
      ).__ESM_RACE__.verifySharedProbeBarrier(),
    );

    expect(result.initialCollisionProbeCalls).toBe(1);
    expect(result.bSettledDuringGate).toBe(false);
    expect(result.aSettledDuringGate).toBe(false);
    expect(result.sharedInImportMapDuringGate).toBe(false);
    expect(result.branchA).toBe('a:shared-colliding');
    expect(result.branchB).toBe('b:shared-colliding');
    expect(result.sandboxValue).toBe('shared-colliding');
    expect(result.mainValue).toBeUndefined();
  });

  test('does not flush another graph’s un-probed colliding import map entry while a sibling graph completes', async ({
    page,
  }) => {
    await page.goto('/esm-race.html');
    const result = await page.evaluate(() =>
      (
        window as unknown as {
          __ESM_RACE__: {
            verifyIndependentFlushBarrier(): Promise<{
              fastResult: unknown;
              slowInImportMapWhilePending: boolean;
              slowSettledWhilePending: boolean;
              slowResult: unknown;
              slowInImportMapAfterRelease: boolean;
              sandboxValue: unknown;
              mainValue: unknown;
            }>;
          };
        }
      ).__ESM_RACE__.verifyIndependentFlushBarrier(),
    );

    expect(result.fastResult).toBe('fast-ok');
    expect(result.slowInImportMapWhilePending).toBe(false);
    expect(result.slowSettledWhilePending).toBe(false);
    expect(result.slowResult).toBe('independent-colliding');
    expect(result.slowInImportMapAfterRelease).toBe(true);
    expect(result.sandboxValue).toBe('independent-colliding');
    expect(result.mainValue).toBeUndefined();
  });

  test('concurrent module graph preparation does not publish provisional blob URLs before probe settles', async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => pageErrors.push(err.message));

    let releaseDelayed!: () => void;
    const delayedGate = new Promise<void>((resolve) => {
      releaseDelayed = resolve;
    });
    let markDelayedRequested!: () => void;
    const delayedRequested = new Promise<void>((resolve) => {
      markDelayedRequested = resolve;
    });
    let releaseFast!: () => void;
    const fastGate = new Promise<void>((resolve) => {
      releaseFast = resolve;
    });

    await page.route(`${SUB_ESM_ORIGIN}/modules/delayed.js`, async (route) => {
      markDelayedRequested();
      await delayedGate;
      await route.continue();
    });
    await page.route(`${SUB_ESM_ORIGIN}/concurrent-fast.js`, async (route) => {
      await fastGate;
      await route.continue();
    });

    const readImportMapSpecifiers = () =>
      page.evaluate(() => {
        const scripts = document.querySelectorAll('script[type="importmap"][data-qiankun="esm"]');
        return Array.from(scripts).flatMap((s) => Object.keys(JSON.parse(s.textContent || '{}').imports ?? {}));
      });

    const loadPromise = loadApp(page, 'sub-esm-concurrent');

    try {
      // Wait until shared-collision.js has been fetched while Graph A is still blocked on delayed.js.
      await Promise.all([page.waitForResponse(`${SUB_ESM_ORIGIN}/modules/shared-collision.js`), delayedRequested]);
      // Let fetch().text() + compileModuleSource() finish creating shared-collision's provisional module entry.
      await page.evaluate(() => Promise.resolve());

      // Release Graph B (concurrent-fast.js) and wait until its own import map is injected.
      releaseFast();
      await expect
        .poll(readImportMapSpecifiers)
        .toEqual(expect.arrayContaining([expect.stringContaining('/concurrent-fast.js')]));

      // Graph B's flush must not expose Graph A's unprobed shared-collision.js blob URL.
      const midSpecifiers = await readImportMapSpecifiers();
      expect(midSpecifiers.some((spec) => spec.includes('/modules/shared-collision.js'))).toBe(false);

      // Now unblock delayed.js so Graph A probes shared-collision.js (collides on `history`,
      // rebuilds & revokes its old blob URL), publishes the settled URL, and mounts cleanly.
      releaseDelayed();
      expect(await loadPromise).toBe('MOUNTED');
      await expect(page.getByTestId('esm-concurrent-result')).toHaveText('42:slow-ok:local-history');
      await expect(page.getByTestId('esm-concurrent-fast')).toHaveText('fast-done');
      expect(consoleErrors).toEqual([]);
      expect(pageErrors).toEqual([]);
      expect(await readMainRealmGlobal(page, '__SHARED_COLLISION_HISTORY__')).toBeUndefined();
      expect(await readMainRealmGlobal(page, '__CONCURRENT_FAST_RAN__')).toBeUndefined();
    } finally {
      releaseFast();
      releaseDelayed();
      await loadPromise.catch(() => undefined);
    }
  });
});
