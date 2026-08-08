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
});
