import { expect, test } from '@playwright/test';
import { FIREFOX_ESM_LIMITATION, loadApp, readMainRealmGlobal, unmountApp } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('multiple instances', () => {
  test('two instances of the same app run in independent sandboxes', async ({ page }) => {
    await loadApp(page, 'sub-classic', undefined, 'a');
    await loadApp(page, 'sub-classic', undefined, 'b');

    await expect(page.locator('#container-a [data-testid="classic-title"]')).toBeVisible();
    await expect(page.locator('#container-b [data-testid="classic-title"]')).toBeVisible();

    // each instance evaluated the entry script in its own sandbox: independent closures
    await expect(page.locator('#container-a [data-testid="classic-counters"]')).toHaveText(
      'bootstrap:1,mount:1,unmount:0',
    );
    await expect(page.locator('#container-b [data-testid="classic-counters"]')).toHaveText(
      'bootstrap:1,mount:1,unmount:0',
    );

    expect(await readMainRealmGlobal(page, '__CLASSIC_POLLUTION__')).toBeUndefined();
  });

  test('unmounting one instance leaves the other untouched', async ({ page }) => {
    await loadApp(page, 'sub-classic', undefined, 'a');
    await loadApp(page, 'sub-classic', undefined, 'b');

    await unmountApp(page, 'a');

    await expect(page.locator('#container-a')).toBeEmpty();
    await expect(page.locator('#container-b [data-testid="classic-title"]')).toBeVisible();
  });

  test('classic and esm apps coexist and unmount independently', async ({ page, browserName }) => {
    test.fail(browserName === 'firefox', FIREFOX_ESM_LIMITATION);
    await loadApp(page, 'sub-classic');
    await loadApp(page, 'sub-esm');

    await unmountApp(page, 'sub-esm');

    await expect(page.locator('#container-sub-esm')).toBeEmpty();
    await expect(page.getByTestId('classic-title')).toBeVisible();
  });
});
