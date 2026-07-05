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

  test('a fragment-wrapped innerHTML style (jQuery-style injection) is scoped too', async ({ page }) => {
    const INJECTED = 'rgb(1, 2, 3)';

    await loadApp(page, 'sub-classic-multiscript', { styleIsolation: true });
    await expect(page.getByTestId('script-order')).toBeVisible();

    // the injected style was routed into the app container and @scope-wrapped...
    const styleInfo = await page.evaluate(() => {
      const style = document.querySelector('style[data-testid="fragment-style"]');
      return style
        ? {
            inContainer: !!style.closest('[data-name="sub-classic-multiscript"]'),
            scoped: (style.textContent ?? '').trim().startsWith('@scope'),
          }
        : null;
    });
    expect(styleInfo).toEqual({ inContainer: true, scoped: true });

    // ...so its body rule never reaches the main realm
    const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bodyBg).not.toBe(INJECTED);
  });

  test('a dynamically injected chunk-CSS link fires its load event and stays scoped', async ({ page }) => {
    const LAZY = 'rgb(4, 5, 6)';

    await loadApp(page, 'sub-classic-multiscript', { styleIsolation: true });

    // the app resolves its "chunk CSS loaded" promise on the link's own load event
    // (the mini-css-extract-plugin pattern) — the transpiled link must keep firing it
    await expect(page.getByTestId('lazy-css-status')).toHaveText('lazy-css:loaded');

    // the link kept its identity (attributes survive) and now carries the scoped blob stylesheet
    const href = await page.getByTestId('lazy-link').getAttribute('href');
    expect(href).toMatch(/^blob:/);

    // the scoped css applies inside the container...
    await expect(page.getByTestId('lazy-css-status')).toHaveCSS('color', LAZY);
    // ...while its body rule never reaches the main realm
    const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bodyBg).not.toBe(LAZY);
  });
});
