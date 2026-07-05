import { expect, test } from '@playwright/test';
import { loadApp, unmountApp } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('classic sub app lifecycle', () => {
  test('mounts and renders into its container', async ({ page }) => {
    const status = await loadApp(page, 'sub-classic');
    expect(status).toBe('MOUNTED');

    await expect(page.getByTestId('classic-title')).toHaveText('classic mounted');
    await expect(page.getByTestId('classic-counters')).toHaveText('bootstrap:1,mount:1,unmount:0');
  });

  test('unmount clears the container', async ({ page }) => {
    await loadApp(page, 'sub-classic');
    await expect(page.getByTestId('classic-title')).toBeVisible();

    const status = await unmountApp(page, 'sub-classic');
    expect(status).toBe('NOT_MOUNTED');

    await expect(page.getByTestId('classic-title')).toHaveCount(0);
    await expect(page.locator('#container-sub-classic')).toBeEmpty();
  });

  test('external scripts block later scripts, matching native document order', async ({ page }) => {
    // vendor.js (external) -> inline capture -> entry: both later scripts must observe the
    // vendor global, i.e. the transpiled external script kept its blocking semantics
    const status = await loadApp(page, 'sub-classic-multiscript');
    expect(status).toBe('MOUNTED');

    await expect(page.getByTestId('script-order')).toHaveText('inline-saw:vendor-loaded,entry-saw:vendor-loaded');
  });

  test('a 404 non-entry script fires its error path and the stream continues', async ({ page }) => {
    // native semantics: a failed external script emits an error event and parsing goes on;
    // the blocking walk must not deadlock on the script that can never load
    const status = await loadApp(page, 'sub-classic-broken-asset');
    expect(status).toBe('MOUNTED');

    await expect(page.getByTestId('broken-asset-mounted')).toHaveText('mounted despite 404 vendor');
  });

  test('remount reuses cached lifecycles without re-executing scripts', async ({ page }) => {
    await loadApp(page, 'sub-classic');
    await unmountApp(page, 'sub-classic');

    const status = await loadApp(page, 'sub-classic');
    expect(status).toBe('MOUNTED');

    // bootstrap stays at 1 (cached, not re-run), mount increments: the entry script was NOT evaluated again
    await expect(page.getByTestId('classic-counters')).toHaveText('bootstrap:1,mount:2,unmount:1');
  });
});
