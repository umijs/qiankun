import { expect, test } from '@playwright/test';
import { PORTS } from '../ports';

test.beforeEach(async ({ page }) => {
  // Explicitly cacheable fixtures; the shared test server defaults to no-store.
  await page.route(`http://localhost:${PORTS['sub-classic']}/**`, async (route) => {
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), 'cache-control': 'public, max-age=60' } });
  });
  await page.addInitScript(() => {
    const create = URL.createObjectURL.bind(URL);
    const blobs: string[] = [];
    Reflect.set(window, '__CLASSIC_BLOBS__', blobs);
    URL.createObjectURL = (blob) => {
      if (blob instanceof Blob) void blob.text().then((source) => blobs.push(source));
      return create(blob);
    };
  });
  await page.goto('/?csp-no-eval');
});

const hitCount = async (page: import('@playwright/test').Page) =>
  page.evaluate(() => {
    const sources = Reflect.get(window, '__CLASSIC_BLOBS__') as string[];
    return sources.filter((source) => /window\["__qk_classic___compartment_globalThis__/.test(source)).length;
  });

test('prepares without business effects, consumes a compiled factory, remounts, and releases independently', async ({
  page,
}) => {
  const prepared = await page.evaluate(() => window.__E2E__.prepareClassic('ready'));
  expect(prepared[0].status).toBe('ready');
  expect(await page.evaluate(() => Reflect.get(window, '__CLASSIC_POLLUTION__'))).toBeUndefined();
  expect(await page.evaluate(() => window.__E2E__.liveCompartments())).toBe(0);
  expect(await page.evaluate(() => window.__E2E__.loadPrepared('sub-classic', 'ready', 'one'))).toBe('MOUNTED');
  await expect(page.getByTestId('classic-counters')).toHaveText('bootstrap:1,mount:1,unmount:0');
  expect(await hitCount(page)).toBe(1);
  await page.evaluate(() => window.__E2E__.disposeClassic('ready'));
  expect(await page.evaluate(() => window.__E2E__.classicPreparationStats('ready'))).toEqual({
    entries: 0,
    bytes: 0,
    preparedScripts: 0,
  });
  await page.evaluate(() => window.__E2E__.unmount('one'));
  await page.evaluate(() => window.__E2E__.loadPrepared('sub-classic', 'ready', 'two'));
  await expect(page.getByTestId('classic-counters')).toHaveText('bootstrap:1,mount:2,unmount:1');
  await page.evaluate(() => window.__E2E__.unload('two'));
});

test('creates independent execution closures for simultaneous instances', async ({ page }) => {
  await page.evaluate(() => window.__E2E__.prepareClassic('multi'));
  await page.evaluate(() =>
    Promise.all([
      window.__E2E__.loadPrepared('sub-classic', 'multi', 'left'),
      window.__E2E__.loadPrepared('sub-classic', 'multi', 'right'),
    ]),
  );
  await expect(page.locator('#container-left').getByTestId('classic-counters')).toHaveText(
    'bootstrap:1,mount:1,unmount:0',
  );
  await expect(page.locator('#container-right').getByTestId('classic-counters')).toHaveText(
    'bootstrap:1,mount:1,unmount:0',
  );
  expect(await hitCount(page)).toBe(2);
  await page.evaluate(() => Promise.all([window.__E2E__.unload('left'), window.__E2E__.unload('right')]));
  await page.evaluate(() => window.__E2E__.disposeClassic('multi'));
});

test('preserves external and inline script ordering', async ({ page }) => {
  await page.evaluate(() => window.__E2E__.prepareClassic('order', 'sub-classic-multiscript'));
  await page.evaluate(() => window.__E2E__.loadPrepared('sub-classic-multiscript', 'order', 'order'));
  await expect(page.getByTestId('script-order')).toHaveText('inline-saw:vendor-loaded,entry-saw:vendor-loaded');
  expect(await hitCount(page)).toBe(2);
  await page.evaluate(() => window.__E2E__.unload('order'));
  await page.evaluate(() => window.__E2E__.disposeClassic('order'));
});

test('falls back after disposal and for incompatible sandbox configuration', async ({ page }) => {
  await page.evaluate(() => window.__E2E__.prepareClassic('fallback'));
  await page.evaluate(() => window.__E2E__.disposeClassic('fallback'));
  await page.evaluate(() => window.__E2E__.loadPrepared('sub-classic', 'fallback', 'disposed'));
  expect(await hitCount(page)).toBe(0);
  await page.evaluate(() => window.__E2E__.unload('disposed'));
  await page.evaluate(() => window.__E2E__.prepareClassic('custom'));
  await page.evaluate(() =>
    window.__E2E__.loadPrepared('sub-classic', 'custom', 'custom', {
      sandbox: { globals: { __E2E_CLASSIC_EXTRA__: 'custom' } },
    }),
  );
  await expect(page.getByTestId('classic-extra-global')).toHaveText('custom');
  expect(await hitCount(page)).toBe(0);
  await page.evaluate(() => window.__E2E__.unload('custom'));
  await page.evaluate(() => window.__E2E__.disposeClassic('custom'));
});

test('cancels a pending transport and loads through the normal path', async ({ page }) => {
  let requested = false;
  let release: (() => void) | undefined;
  await page.route(`http://localhost:${PORTS['sub-classic']}/`, async (route) => {
    requested = true;
    await new Promise<void>((resolve) => {
      release = resolve;
    });
    await route.abort().catch(() => {});
  });
  const preparing = page.evaluate(() => window.__E2E__.prepareClassic('cancel'));
  await expect.poll(() => requested).toBe(true);
  await page.evaluate(() => window.__E2E__.disposeClassic('cancel'));
  expect((await preparing)[0].status).toBe('cancelled');
  release!();
  await page.unroute(`http://localhost:${PORTS['sub-classic']}/`);
  await page.evaluate(() => window.__E2E__.loadPrepared('sub-classic', 'cancel', 'normal'));
  await expect(page.getByTestId('classic-title')).toBeVisible();
  expect(await hitCount(page)).toBe(0);
  await page.evaluate(() => window.__E2E__.unload('normal'));
});

test('preserves defer order, strict UMD, top-level this/arguments, currentScript and hidden host bridges', async ({
  page,
}) => {
  const prepared = await page.evaluate(() => window.__E2E__.prepareClassic('semantics', 'sub-classic-prepared'));
  expect(prepared[0].preparedScripts).toBe(2);
  await page.evaluate(() => window.__E2E__.loadPrepared('sub-classic-prepared', 'semantics', 'semantics'));
  const probe = JSON.parse((await page.locator('#prepared-root').textContent())!) as Record<string, unknown>;
  expect(probe).toEqual({
    receiver: true,
    args: 0,
    src: `http://localhost:${PORTS['sub-classic']}/prepared-entry.js`,
    inline: 'undefined',
    order: 'vendor,entry',
    bridgeVisible: false,
    count: 1,
  });
  expect(await hitCount(page)).toBe(2);
  expect(await page.evaluate(() => Reflect.get(window, '__PREPARED_ORDER__'))).toBeUndefined();
  await page.evaluate(() => window.__E2E__.unload('semantics'));
  await page.evaluate(() => window.__E2E__.disposeClassic('semantics'));
});
