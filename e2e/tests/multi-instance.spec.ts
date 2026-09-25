import { expect, test } from '@playwright/test';
import {
  countLiveCompartments,
  FIREFOX_ESM_LIMITATION,
  loadApp,
  readMainRealmGlobal,
  resetContainer,
  unmountApp,
} from './helpers';

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

  test('new tabs mount independently after removing an earlier sibling container', async ({ page }) => {
    for (const key of ['tab-a', 'tab-b', 'tab-c']) {
      expect(await loadApp(page, 'sub-classic', undefined, key)).toBe('MOUNTED');
    }
    expect(await countLiveCompartments(page)).toBe(3);

    await unmountApp(page, 'tab-a');
    await page.locator('#container-tab-a').evaluate((container) => container.remove());

    // The new third sibling occupies tab-c's original XPath, but it is a different element. It
    // takes over the removed tab's idle sandbox and never waits for a mounted sibling.
    expect(await loadApp(page, 'sub-classic', undefined, 'tab-d')).toBe('MOUNTED');
    await expect(page.locator('#containers > div')).toHaveCount(3);
    expect(await countLiveCompartments(page)).toBe(3);

    for (const key of ['tab-b', 'tab-c']) {
      const container = page.locator(`#container-${key}`);
      await expect(container.getByTestId('classic-title')).toBeVisible();
      await expect(container.getByTestId('classic-counters')).toHaveText('bootstrap:1,mount:1,unmount:0');
    }
    await expect(page.locator('#container-tab-d').getByTestId('classic-counters')).toHaveText(
      'bootstrap:1,mount:2,unmount:1',
    );
    expect(await readMainRealmGlobal(page, '__CLASSIC_POLLUTION__')).toBeUndefined();

    for (const key of ['tab-b', 'tab-c', 'tab-d']) {
      await unmountApp(page, key);
      await expect(page.locator(`#container-${key}`)).toBeEmpty();
    }
  });

  test('a container re-created on every mount keeps one warm sandbox', async ({ page }) => {
    // The <MicroApp> bindings render a fresh container element on each mount and only call
    // unmount() when the component goes away.
    const rounds = 5;
    for (let round = 1; round <= rounds; round++) {
      expect(await loadApp(page, 'sub-classic', undefined, 'route')).toBe('MOUNTED');
      await expect(page.locator('#container-route').getByTestId('classic-counters')).toHaveText(
        `bootstrap:1,mount:${String(round)},unmount:${String(round - 1)}`,
      );
      expect(await countLiveCompartments(page)).toBe(1);
      await unmountApp(page, 'route');
      await expect(page.locator('#container-route')).toBeEmpty();
      await resetContainer(page, 'route');
    }
    expect(await countLiveCompartments(page)).toBe(1);
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
