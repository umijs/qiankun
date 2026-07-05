import { expect, test } from '@playwright/test';
import { loadApp } from './helpers';

const BLUE = 'rgb(0, 0, 255)';
const RED = 'rgb(255, 0, 0)';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('runtime style isolation (@scope)', () => {
  test('without styleIsolation the sub app global css leaks into the main app (control)', async ({ page }) => {
    await expect(page.locator('#main-title')).toHaveCSS('color', BLUE);

    await loadApp(page, 'sub-classic');
    await expect(page.getByTestId('classic-title')).toBeVisible();

    // sub-classic ships `h1 { color: red }`: unscoped it wins over the main rule by document order
    await expect(page.locator('#main-title')).toHaveCSS('color', RED);
  });

  test('with styleIsolation the sub app css stays inside its container', async ({ page }) => {
    await loadApp(page, 'sub-classic', { styleIsolation: true });
    await expect(page.getByTestId('classic-title')).toBeVisible();

    // sub app styles still apply to its own DOM...
    await expect(page.getByTestId('classic-title')).toHaveCSS('color', RED);
    // ...but no longer affect the main app
    await expect(page.locator('#main-title')).toHaveCSS('color', BLUE);
  });
});
