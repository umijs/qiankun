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
    await loadApp(page, 'sub-classic', { sandbox: { styleIsolation: true } });
    await expect(page.getByTestId('classic-title')).toBeVisible();

    // sub app styles still apply to its own DOM...
    await expect(page.getByTestId('classic-title')).toHaveCSS('color', RED);
    // ...but no longer affect the main app
    await expect(page.locator('#main-title')).toHaveCSS('color', BLUE);
  });

  test('a body-less entry keeps static and dynamically appended styles in the app container', async ({ page }) => {
    const STATIC = 'rgb(11, 12, 13)';
    const DYNAMIC_HEAD = 'rgb(21, 22, 23)';
    const DYNAMIC_BODY = 'rgb(31, 32, 33)';

    await loadApp(page, 'sub-classic-bodyless', { sandbox: { styleIsolation: true } });

    const container = page.locator('[data-name="sub-classic-bodyless"]');
    const virtualHead = container.locator(':scope > qiankun-head');

    // WritableDOM accepts a source entry without an explicit <body>; the sandbox exposes the app
    // container itself as document.body rather than inserting a body element into the live DOM.
    await expect(container.locator('body')).toHaveCount(0);
    await expect(virtualHead).toHaveCount(1);

    const staticStyle = virtualHead.locator(':scope > style[data-testid="bodyless-static-style"]');
    const dynamicHeadStyle = virtualHead.locator(':scope > style[data-testid="bodyless-dynamic-head-style"]');
    const dynamicBodyStyle = container.locator(':scope > style[data-testid="bodyless-dynamic-body-style"]');

    // Static head content and document.head insertions stay in the virtual head; document.body
    // insertions land directly in the app container. All three still pass through @scope isolation.
    await expect(staticStyle).toHaveCount(1);
    await expect(dynamicHeadStyle).toHaveCount(1);
    await expect(dynamicBodyStyle).toHaveCount(1);
    const scopedStyles = await Promise.all(
      [staticStyle, dynamicHeadStyle, dynamicBodyStyle].map((style) =>
        style.evaluate((element) => (element.textContent ?? '').trim().startsWith('@scope')),
      ),
    );
    expect(scopedStyles).toEqual([true, true, true]);

    await expect(page.getByTestId('bodyless-static-target')).toHaveCSS('color', STATIC);
    await expect(page.getByTestId('bodyless-dynamic-head-target')).toHaveCSS('color', DYNAMIC_HEAD);
    await expect(page.getByTestId('bodyless-dynamic-body-target')).toHaveCSS('color', DYNAMIC_BODY);
  });

  test('a fragment-wrapped innerHTML style (jQuery-style injection) is scoped too', async ({ page }) => {
    const INJECTED = 'rgb(1, 2, 3)';

    await loadApp(page, 'sub-classic-multiscript', { sandbox: { styleIsolation: true } });
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

  test('an app wrapping its own appendChild keeps its patch effective while styles stay piped and scoped', async ({
    page,
  }) => {
    const HEAD = 'rgb(61, 62, 63)';
    const BODY = 'rgb(71, 72, 73)';

    await loadApp(page, 'sub-classic-patched-append', { sandbox: { styleIsolation: true } });

    // the app wrapped the document.head/body appendChild it sees before injecting its styles —
    // the sandbox pipeline must run *underneath* that wrapper, not bypass it: both insertions
    // were observed by the app's own patch logic
    await expect(page.getByTestId('patched-append-observed')).toHaveText('head:style,body:style');

    // and delegating to the wrapped original still routed both styles through the pipeline
    const container = page.locator('[data-name="sub-classic-patched-append"]');
    const headStyle = container.locator(':scope > qiankun-head > style[data-testid="patched-append-head-style"]');
    const bodyStyle = container.locator(':scope > style[data-testid="patched-append-body-style"]');
    await expect(headStyle).toHaveCount(1);
    await expect(bodyStyle).toHaveCount(1);
    const scopedStyles = await Promise.all(
      [headStyle, bodyStyle].map((style) =>
        style.evaluate((element) => (element.textContent ?? '').trim().startsWith('@scope')),
      ),
    );
    expect(scopedStyles).toEqual([true, true]);

    await expect(page.getByTestId('patched-append-head-target')).toHaveCSS('color', HEAD);
    await expect(page.getByTestId('patched-append-body-target')).toHaveCSS('color', BODY);
  });

  test('a dynamically injected chunk-CSS link fires its load event and stays scoped', async ({ page }) => {
    const LAZY = 'rgb(4, 5, 6)';

    await loadApp(page, 'sub-classic-multiscript', { sandbox: { styleIsolation: true } });

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
