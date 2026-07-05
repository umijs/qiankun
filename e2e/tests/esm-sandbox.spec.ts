import { expect, test } from '@playwright/test';
import { FIREFOX_ESM_LIMITATION, loadApp, readMainRealmGlobal, unmountApp } from './helpers';

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

  test('window pollution from the esm app is invisible from the main realm', async ({ page }) => {
    await loadApp(page, 'sub-esm');
    await expect(page.getByTestId('esm-title')).toBeVisible();

    expect(await readMainRealmGlobal(page, '__ESM_POLLUTION__')).toBeUndefined();
  });

  test('main realm globals stay readable inside the esm sandbox', async ({ page }) => {
    await loadApp(page, 'sub-esm');

    await expect(page.getByTestId('esm-main-global')).toHaveText('value-from-main');
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
});
