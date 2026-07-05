import { expect, test } from '@playwright/test';
import { FIREFOX_ESM_LIMITATION, loadApp, readMainRealmGlobal, unmountApp } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('js sandbox isolation', () => {
  test('sub app window pollution is invisible from the main realm', async ({ page }) => {
    await loadApp(page, 'sub-classic');
    await expect(page.getByTestId('classic-title')).toBeVisible();

    expect(await readMainRealmGlobal(page, '__CLASSIC_POLLUTION__')).toBeUndefined();
  });

  test('main realm globals stay readable through the sandbox', async ({ page }) => {
    await loadApp(page, 'sub-classic');

    await expect(page.getByTestId('classic-main-global')).toHaveText('value-from-main');
  });

  test('main realm stays clean after unmount', async ({ page }) => {
    await loadApp(page, 'sub-classic');
    await unmountApp(page, 'sub-classic');

    expect(await readMainRealmGlobal(page, '__CLASSIC_POLLUTION__')).toBeUndefined();
  });

  test('two sub apps pollute neither the main realm nor each other', async ({ page, browserName }) => {
    test.fail(browserName === 'firefox', FIREFOX_ESM_LIMITATION);
    await loadApp(page, 'sub-classic');
    await loadApp(page, 'sub-esm');

    await expect(page.getByTestId('classic-title')).toBeVisible();
    await expect(page.getByTestId('esm-title')).toBeVisible();

    expect(await readMainRealmGlobal(page, '__CLASSIC_POLLUTION__')).toBeUndefined();
    expect(await readMainRealmGlobal(page, '__ESM_POLLUTION__')).toBeUndefined();
  });

  test('leaked intervals are reclaimed by the sandbox on unmount', async ({ page }) => {
    await loadApp(page, 'sub-misbehaving');

    // condition-based wait: the leaked interval is demonstrably ticking
    const ticksLocator = page.locator('html');
    await expect.poll(async () => ticksLocator.getAttribute('data-leak-ticks'), { timeout: 5000 }).not.toBeNull();

    await unmountApp(page, 'sub-misbehaving');
    const ticksAtUnmount = await ticksLocator.getAttribute('data-leak-ticks');

    // negative assertion needs time passage: wait >4 interval periods (50ms each) in-page,
    // then the counter must not have advanced — the sandbox cleared the leaked interval
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 300)));
    await expect(ticksLocator).toHaveAttribute('data-leak-ticks', ticksAtUnmount!);
  });
});
