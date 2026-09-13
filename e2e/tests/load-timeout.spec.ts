import { expect, test } from '@playwright/test';
import { SUB_APP_ENTRIES } from '../ports';
import { type E2EWindow, loadApp, readMainRealmGlobal } from './helpers';

const streamStateUrl = (key: string): string => {
  const url = new URL('/__e2e__/entry-stream-state', SUB_APP_ENTRIES['sub-classic']);
  url.searchParams.set('key', key);
  return url.href;
};

test.describe('loading timeout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('a timed-out native HTML stream closes its connection and releases its container for a successor', async ({
    page,
    request,
  }) => {
    const key = 'native-stream-timeout';
    const timeout = 2_000;
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    await page.evaluate(
      ({ key, timeout }) => {
        (window as unknown as E2EWindow).__E2E__.loadNetworkEntryDetached(key, 'timeout-shared', { timeout });
      },
      { key, timeout },
    );
    await expect(page.locator('#container-timeout-shared #classic-root')).toBeVisible();
    await expect(page.getByTestId('classic-title')).toHaveCount(0);
    expect(await (await request.get(streamStateUrl(key))).json()).toEqual({ opened: true, closed: false });
    await page.evaluate(() =>
      (window as unknown as E2EWindow).__E2E__.loadDetached(
        'sub-classic-multiscript',
        'timeout-successor',
        'timeout-shared',
      ),
    );

    const outcome = await page.evaluate((key) => (window as unknown as E2EWindow).__E2E__.mountOutcome(key), key);
    expect(outcome.error).toContain('timed out');
    expect(outcome.timeoutError).toMatchObject({ appName: 'sub-classic', timeout });
    expect(outcome.timeoutError!.elapsed).toBeGreaterThanOrEqual(timeout);
    await expect
      .poll(async () => (await request.get(streamStateUrl(key))).json())
      .toEqual({ opened: true, closed: true });
    expect(await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.settle('timeout-successor'))).toBe(
      'MOUNTED',
    );
    await expect(page.getByTestId('load-marker')).toBeVisible();
    await expect(page.locator('#container-timeout-shared #classic-root')).toHaveCount(0);
    expect(await readMainRealmGlobal(page, '__CLASSIC_POLLUTION__')).toBeUndefined();
    expect(pageErrors).toEqual([]);
    await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.unload('timeout-successor'));
    await expect(page.locator('#container-timeout-shared')).toBeEmpty();

    // The timed-out name/container can load again, and its retired handle must
    // never dispose of the replacement generation when the caller cleans it up.
    expect(await loadApp(page, 'sub-classic', undefined, 'timeout-retry', undefined, 'timeout-shared')).toBe('MOUNTED');
    await page.evaluate((key) => (window as unknown as E2EWindow).__E2E__.unload(key), key);
    await expect(page.getByTestId('classic-counters')).toHaveText('bootstrap:1,mount:1,unmount:0');
    expect(await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.status('timeout-retry'))).toBe('MOUNTED');
    await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.unload('timeout-retry'));
    await expect(page.locator('#container-timeout-shared')).toBeEmpty();
  });

  test('start timeout applies to manual loads and local zero preserves early streaming mount', async ({
    page,
    request,
  }) => {
    const timeout = 1_000;
    await page.evaluate((timeout) => {
      const api = (window as unknown as E2EWindow).__E2E__;
      api.configureTimeout(timeout);
      api.loadNetworkEntryDetached('default-timeout', 'default-timeout');
    }, timeout);

    expect(
      await page.evaluate(() =>
        (window as unknown as E2EWindow).__E2E__.loadWithNetworkEntryStream('timeout-disabled', 'timeout-disabled', {
          timeout: 0,
        }),
      ),
    ).toBe('MOUNTED');
    const outcome = await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.mountOutcome('default-timeout'));
    expect(outcome.timeoutError).toMatchObject({ appName: 'sub-classic', timeout });
    await expect(page.locator('#container-default-timeout')).toBeEmpty();
    await expect(page.locator('#container-timeout-disabled').getByTestId('classic-title')).toBeVisible();
    expect(await (await request.get(streamStateUrl('timeout-disabled'))).json()).toEqual({
      opened: true,
      closed: false,
    });
    expect(await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.status('timeout-disabled'))).toBe(
      'MOUNTED',
    );
    await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.unload('timeout-disabled'));
    await expect
      .poll(async () => (await request.get(streamStateUrl('timeout-disabled'))).json())
      .toEqual({ opened: true, closed: true });
    await expect(page.locator('#container-timeout-disabled')).toBeEmpty();
  });
});
