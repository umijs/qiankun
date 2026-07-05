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

    // occupy the shared container first, so the incoming app's loading races its unmount
    await page.evaluate(() => {
      location.hash = '#/classic';
    });
    await expect(page.getByTestId('classic-title')).toBeVisible();

    await page.evaluate(() => {
      location.hash = '#/multiscript';
    });
    await expect(page.getByTestId('load-marker')).toBeVisible();

    // the stylesheet injected during the loading phase must still apply after mount,
    // even though the previous app's unmount cleared the container mid-loading
    await expect(page.getByTestId('load-marker')).toHaveCSS('color', 'rgb(7, 8, 9)');
  });
});
