import { expect, test } from '@playwright/test';
import { FIREFOX_ESM_LIMITATION } from './helpers';

test.describe('registerMicroApps + activeRule routing', () => {
  test('classic app mounts and unmounts as its route activates', async ({ page }) => {
    await page.goto('/register.html');

    // no active rule matches yet
    await expect(page.locator('#register-title')).toBeVisible();
    await expect(page.getByTestId('classic-title')).toHaveCount(0);

    await page.evaluate(() => {
      location.hash = '#/classic';
    });
    await expect(page.getByTestId('classic-title')).toBeVisible();

    await page.evaluate(() => {
      location.hash = '#/none';
    });
    await expect(page.getByTestId('classic-title')).toHaveCount(0);
    await expect(page.locator('#register-root')).toBeEmpty();
  });

  test('route switch swaps apps and history back re-activates the previous one', async ({ page, browserName }) => {
    test.fail(browserName === 'firefox', FIREFOX_ESM_LIMITATION);

    await page.goto('/register.html');

    await page.evaluate(() => {
      location.hash = '#/classic';
    });
    await expect(page.getByTestId('classic-title')).toBeVisible();

    // route switch: classic unmounts, esm mounts into the same container
    await page.evaluate(() => {
      location.hash = '#/esm';
    });
    await expect(page.getByTestId('esm-title')).toBeVisible();
    await expect(page.getByTestId('classic-title')).toHaveCount(0);

    await page.goBack();
    await expect(page.getByTestId('classic-title')).toBeVisible();
    await expect(page.getByTestId('esm-title')).toHaveCount(0);
  });

  test('loading-phase dynamic styles survive replacing another app in a shared container', async ({ page }) => {
    await page.goto('/register.html');

    // occupy the shared container first, so the incoming app contends with its unmount
    await page.evaluate(() => {
      location.hash = '#/classic';
    });
    await expect(page.getByTestId('classic-title')).toBeVisible();

    // stamp every streamed appearance of the incoming app's static root: the occupancy gate
    // serializes the switch, so the entry must stream exactly once — no wipe, no pure-HTML replay
    await page.evaluate(() => {
      const container = document.getElementById('register-root')!;
      const stamps = { count: 0 };
      (window as unknown as Record<string, unknown>).__STREAM_STAMPS__ = stamps;
      const observer = new MutationObserver(() => {
        const root = container.querySelector('#multiscript-root') as (Element & { __streamStamp?: number }) | null;
        if (root && root.__streamStamp === undefined) {
          stamps.count += 1;
          root.__streamStamp = stamps.count;
        }
      });
      observer.observe(container, { subtree: true, childList: true });
    });

    await page.evaluate(() => {
      location.hash = '#/multiscript';
    });
    await expect(page.getByTestId('load-marker')).toBeVisible();

    // the stylesheet injected during the loading phase must apply after mount — it never
    // detaches, because the previous app's unmount can no longer clear the container mid-loading
    await expect(page.getByTestId('load-marker')).toHaveCSS('color', 'rgb(7, 8, 9)');

    // exactly one streaming render across the whole switch
    expect(
      await page.evaluate(() => (window as unknown as Record<string, unknown>).__STREAM_STAMPS__ as { count: number }),
    ).toEqual({ count: 1 });
  });

  test('rapid A→B→A navigation neither deadlocks nor starves the shared container', async ({ page }) => {
    await page.goto('/register.html');

    await page.evaluate(() => {
      location.hash = '#/classic';
    });
    await expect(page.getByTestId('classic-title')).toBeVisible();

    // flip forward and immediately back: B loads (and streams under its load hold) but is no
    // longer active when its mount turn comes — its hold must be released at load settle, or
    // A's remount would starve forever
    await page.evaluate(() => {
      location.hash = '#/multiscript';
    });
    await page.evaluate(() => {
      location.hash = '#/classic';
    });
    await expect(page.getByTestId('classic-title')).toBeVisible();

    // and the container keeps taking later occupants
    await page.evaluate(() => {
      location.hash = '#/multiscript';
    });
    await expect(page.getByTestId('load-marker')).toBeVisible();
    await expect(page.getByTestId('classic-title')).toHaveCount(0);
  });
});
