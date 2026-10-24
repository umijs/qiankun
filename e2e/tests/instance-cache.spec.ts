import { expect, test } from '@playwright/test';
import { countLiveCompartments, FIREFOX_ESM_LIMITATION, loadApp, remountApp, unmountApp } from './helpers';

const idleTTL = 5 * 60 * 1000;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

for (const name of ['sub-classic', 'sub-esm'] as const) {
  test(`${name}: an old handle warm-remounts, expires, and cold-loads again`, async ({ page, browserName }) => {
    test.fail(name === 'sub-esm' && browserName === 'firefox', FIREFOX_ESM_LIMITATION);
    await loadApp(page, name);
    await page.clock.install();
    await unmountApp(page, name);
    expect(await remountApp(page, name)).toBe('MOUNTED');
    await expect(page.getByTestId(name === 'sub-classic' ? 'classic-counters' : 'esm-counters')).toHaveText(
      name === 'sub-classic' ? 'bootstrap:1,mount:2,unmount:1' : 'mount:2,importedCount:2',
    );

    await unmountApp(page, name);
    await page.clock.fastForward(idleTTL);
    await expect.poll(() => countLiveCompartments(page)).toBe(0);

    expect(await remountApp(page, name)).toBe('MOUNTED');
    await expect(page.getByTestId(name === 'sub-classic' ? 'classic-counters' : 'esm-counters')).toHaveText(
      name === 'sub-classic' ? 'bootstrap:1,mount:1,unmount:0' : 'mount:1,importedCount:1',
    );
    await page.clock.fastForward(idleTTL);
    expect(await countLiveCompartments(page)).toBe(1);
    await unmountApp(page, name);
  });
}

test('reclaiming an old idle sandbox preserves a different app in the same container', async ({
  page,
  browserName,
}) => {
  test.fail(browserName === 'firefox', FIREFOX_ESM_LIMITATION);
  await loadApp(page, 'sub-classic', undefined, 'old');
  await page.clock.install();
  await unmountApp(page, 'old');
  await loadApp(page, 'sub-esm', undefined, 'new', undefined, 'old');
  await page.clock.fastForward(idleTTL);
  await expect.poll(() => countLiveCompartments(page)).toBe(1);
  await expect(page.locator('#container-old').getByTestId('esm-title')).toBeVisible();
  await unmountApp(page, 'new');
  expect(await remountApp(page, 'old')).toBe('MOUNTED');
  await expect(page.locator('#container-old').getByTestId('classic-counters')).toHaveText(
    'bootstrap:1,mount:1,unmount:0',
  );
  await unmountApp(page, 'old');
});
