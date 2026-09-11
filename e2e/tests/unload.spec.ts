import { expect, test } from '@playwright/test';
import { SUB_APP_ENTRIES } from '../ports';
import { type E2EWindow, FIREFOX_ESM_LIMITATION, loadApp, readMainRealmGlobal } from './helpers';

test.describe('terminal unload', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  for (const name of ['sub-classic', 'sub-esm'] as const) {
    test(`${name} unload clears its container and reload fetches and evaluates a fresh entry`, async ({
      page,
      browserName,
    }) => {
      test.fail(name === 'sub-esm' && browserName === 'firefox', FIREFOX_ESM_LIMITATION);
      const kind = name === 'sub-classic' ? 'classic' : 'esm';
      const counters = kind === 'classic' ? 'bootstrap:1,mount:1,unmount:0' : 'mount:1,importedCount:1';
      const importMaps = page.locator('head > script[type="importmap"][data-qiankun="esm"]');
      await loadApp(page, name, undefined, 'first', undefined, 'shared');
      await expect(page.getByTestId(`${kind}-counters`)).toHaveText(counters);
      if (name === 'sub-esm') expect(await importMaps.count()).toBeGreaterThan(0);

      expect(await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.unload('first'))).toBe('NOT_LOADED');
      await expect(page.locator('#container-shared')).toBeEmpty();
      await expect(page.locator('#container-shared qiankun-head')).toHaveCount(0);
      await expect(importMaps).toHaveCount(0);
      expect(
        await readMainRealmGlobal(page, name === 'sub-classic' ? '__CLASSIC_POLLUTION__' : '__ESM_POLLUTION__'),
      ).toBeUndefined();
      expect(await readMainRealmGlobal(page, '__MAIN_GLOBAL__')).toBe('value-from-main');

      const entryRequest = page.waitForRequest((request) => request.url() === new URL(SUB_APP_ENTRIES[name]).href);
      const reloaded = loadApp(page, name, undefined, 'second', undefined, 'shared');
      await entryRequest;
      expect(await reloaded).toBe('MOUNTED');
      await expect(page.getByTestId(`${kind}-counters`)).toHaveText(counters);

      // A retired handle cannot dispose a later generation with the same key.
      await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.unload('first'));
      await expect(page.getByTestId(`${kind}-title`)).toBeVisible();
      await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.unload('second'));
      await expect(page.locator('#container-shared')).toBeEmpty();
    });
  }

  test('named unload cancels queued siblings and retires every handle in that generation', async ({ page }) => {
    await loadApp(page, 'sub-classic', undefined, 'holder', undefined, 'shared');
    await page.evaluate(() => {
      const api = (window as unknown as E2EWindow).__E2E__;
      api.loadDetached('sub-classic', 'waiter-a', 'shared');
      api.loadDetached('sub-classic', 'waiter-b', 'shared');
    });
    await expect
      .poll(() => page.evaluate(() => (window as unknown as E2EWindow).__E2E__.status('waiter-a')))
      .toBe('MOUNTING');

    await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.unloadNamed('sub-classic', 'shared'));

    for (const key of ['waiter-a', 'waiter-b']) {
      const outcome = await page.evaluate(
        (instanceKey) => (window as unknown as E2EWindow).__E2E__.mountOutcome(instanceKey),
        key,
      );
      expect(outcome.status).toBe('NOT_LOADED');
      expect(outcome.error).toContain('unloaded');
    }
    await expect(page.locator('#container-shared')).toBeEmpty();
    const staleMount = await page.evaluate(() =>
      (window as unknown as E2EWindow).__E2E__.remount('holder').then(
        () => 'unexpected mount',
        (error: unknown) => String(error),
      ),
    );
    expect(staleMount).toContain('unloaded');
    expect(await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.unmount('holder'))).toBe('NOT_LOADED');

    await loadApp(page, 'sub-classic', undefined, 'new-generation', undefined, 'shared');
    await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.unload('waiter-a'));
    await expect(page.getByTestId('classic-counters')).toHaveText('bootstrap:1,mount:1,unmount:0');
    await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.unload('new-generation'));
    await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.unloadNamed('sub-classic', 'shared'));
  });

  test('unloading one container preserves an independent same-name instance', async ({ page }) => {
    await loadApp(page, 'sub-classic', undefined, 'first');
    await loadApp(page, 'sub-classic', undefined, 'second');

    await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.unloadNamed('sub-classic', 'first'));

    await expect(page.locator('#container-first')).toBeEmpty();
    await expect(page.locator('#container-second').getByTestId('classic-counters')).toHaveText(
      'bootstrap:1,mount:1,unmount:0',
    );
    await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.unmount('second'));
    expect(await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.remount('second'))).toBe('MOUNTED');
    await expect(page.locator('#container-second').getByTestId('classic-counters')).toHaveText(
      'bootstrap:1,mount:2,unmount:1',
    );
    await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.unload('second'));
  });

  test('unload aborts an open native entry stream and releases the container for its waiter', async ({
    page,
    request,
  }) => {
    const key = 'native-stream-unload';
    const stateUrl = new URL('/__e2e__/entry-stream-state', SUB_APP_ENTRIES['sub-classic']);
    stateUrl.searchParams.set('key', key);
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    expect(
      await page.evaluate(
        (instanceKey) =>
          (window as unknown as E2EWindow).__E2E__.loadWithNetworkEntryStream(instanceKey, 'stream-shared'),
        key,
      ),
    ).toBe('MOUNTED');
    expect(await (await request.get(stateUrl.href)).json()).toEqual({ opened: true, closed: false });
    await page.evaluate(() =>
      (window as unknown as E2EWindow).__E2E__.loadDetached(
        'sub-classic-multiscript',
        'stream-waiter',
        'stream-shared',
      ),
    );
    await expect(page.getByTestId('classic-title')).toBeVisible();

    await page.evaluate((instanceKey) => (window as unknown as E2EWindow).__E2E__.unload(instanceKey), key);

    await expect.poll(async () => (await request.get(stateUrl.href)).json()).toEqual({ opened: true, closed: true });
    expect(await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.settle('stream-waiter'))).toBe('MOUNTED');
    await expect(page.getByTestId('load-marker')).toBeVisible();
    await expect(page.getByTestId('classic-title')).toHaveCount(0);
    expect(pageErrors).toEqual([]);
    await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.unload('stream-waiter'));
    await expect(page.locator('#container-stream-shared')).toBeEmpty();
  });

  test('unloadApplication retains registration and immediately reloads an active route', async ({ page }) => {
    await page.goto('/register.html#/classic');
    await expect(page.getByTestId('classic-counters')).toHaveText('bootstrap:1,mount:1,unmount:0');

    const entryRequest = page.waitForRequest(
      (request) => request.url() === new URL(SUB_APP_ENTRIES['sub-classic']).href,
    );
    await page.evaluate(() => window.__ROUTE_E2E__.unload('sub-classic'));
    await entryRequest;

    await expect(page.getByTestId('classic-counters')).toHaveText('bootstrap:1,mount:1,unmount:0');
    expect(await page.evaluate(() => location.hash)).toBe('#/classic');
    await page.evaluate(() => {
      location.hash = '#/none';
    });
    await expect(page.locator('#register-root')).toBeEmpty();
  });

  test('unloadApplication can wait for route unmount and reload on the next activation', async ({ page }) => {
    await page.goto('/register.html#/classic');
    await expect(page.getByTestId('classic-title')).toBeVisible();

    await page.evaluate(async () => {
      const unloaded = window.__ROUTE_E2E__.unload('sub-classic', { waitForUnmount: true });
      location.hash = '#/none';
      await unloaded;
    });
    await expect(page.locator('#register-root')).toBeEmpty();

    const entryRequest = page.waitForRequest(
      (request) => request.url() === new URL(SUB_APP_ENTRIES['sub-classic']).href,
    );
    await page.evaluate(() => {
      location.hash = '#/classic';
    });
    await entryRequest;
    await expect(page.getByTestId('classic-counters')).toHaveText('bootstrap:1,mount:1,unmount:0');
  });
});
