import { expect, test } from '@playwright/test';
import { FIREFOX_ESM_LIMITATION, loadApp, loadAppWithStoragePlugin, readMainRealmGlobal, unmountApp } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('js sandbox isolation', () => {
  test('sub app window pollution is invisible from the main realm', async ({ page }) => {
    await loadApp(page, 'sub-classic');
    await expect(page.getByTestId('classic-title')).toBeVisible();

    expect(await readMainRealmGlobal(page, '__CLASSIC_POLLUTION__')).toBeUndefined();
  });

  test('classic scripts run when CSP omits unsafe-eval', async ({ page }) => {
    const response = await page.goto('/?csp-no-eval');
    expect(response?.ok()).toBe(true);
    const policy = response?.headers()['content-security-policy'];
    expect(policy).toContain('script-src');
    expect(policy).toContain('blob:');
    expect(policy).not.toContain("'unsafe-eval'");

    await loadApp(page, 'sub-classic');
    await expect(page.getByTestId('classic-title')).toHaveText('classic mounted');
  });

  test('main realm globals stay readable through the sandbox', async ({ page }) => {
    await loadApp(page, 'sub-classic');

    await expect(page.getByTestId('classic-main-global')).toHaveText('value-from-main');
  });

  test('sandbox globals exposes a value without polluting the main realm', async ({ page }) => {
    await loadApp(page, 'sub-classic', { sandbox: { globals: { __E2E_CLASSIC_EXTRA__: 'classic-extra' } } });

    await expect(page.getByTestId('classic-extra-global')).toHaveText('classic-extra');
    expect(await readMainRealmGlobal(page, '__E2E_CLASSIC_EXTRA__')).toBeUndefined();
  });

  test('a public-API-only plugin can prefix localStorage per compartment', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await loadAppWithStoragePlugin(page, 'first:', 'storage-first', 'one');
    await loadAppWithStoragePlugin(page, 'second:', 'storage-second', 'two');

    await expect(page.locator('#container-storage-first').getByTestId('storage-plugin-result')).toHaveText('one');
    await expect(page.locator('#container-storage-second').getByTestId('storage-plugin-result')).toHaveText('two');
    await expect(page.locator('#container-storage-first').getByTestId('storage-plugin-named-result')).toHaveText(
      'one-named',
    );
    await expect(page.locator('#container-storage-second').getByTestId('storage-plugin-named-result')).toHaveText(
      'two-named',
    );
    await expect(page.locator('#container-storage-first').getByTestId('storage-plugin-meta-result')).toHaveText(
      'has:true|keys:namedProbe,probe|descriptor:one-named|length:2|indexed:namedProbe,probe|deleted:true',
    );
    await expect(page.locator('#container-storage-second').getByTestId('storage-plugin-meta-result')).toHaveText(
      'has:true|keys:namedProbe,probe|descriptor:two-named|length:2|indexed:namedProbe,probe|deleted:true',
    );

    const stored = await page.evaluate(() => ({
      first: localStorage.getItem('first:probe'),
      firstNamed: localStorage.getItem('first:namedProbe'),
      firstDeleted: localStorage.getItem('first:deleteProbe'),
      second: localStorage.getItem('second:probe'),
      secondNamed: localStorage.getItem('second:namedProbe'),
      secondDeleted: localStorage.getItem('second:deleteProbe'),
      unprefixed: localStorage.getItem('probe'),
      unprefixedNamed: localStorage.getItem('namedProbe'),
    }));
    expect(stored).toEqual({
      first: 'one',
      firstNamed: 'one-named',
      firstDeleted: null,
      second: 'two',
      secondNamed: 'two-named',
      secondDeleted: null,
      unprefixed: null,
      unprefixedNamed: null,
    });
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
