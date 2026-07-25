import { expect, test } from '@playwright/test';
import { loadApp, readMainRealmGlobal, unmountApp } from './helpers';

const OUTER_STYLE = 'rgb(41, 42, 43)';
const INNER_HEAD_STYLE = 'rgb(21, 22, 23)';
const INNER_BODY_STYLE = 'rgb(31, 32, 33)';
const CROSS_STYLE = 'rgb(51, 52, 53)';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('nested sandboxes (a sub app hosting its own sub app)', () => {
  test('each app owns the nodes its own container receives, not the ones its realm created', async ({ page }) => {
    await loadApp(page, 'sub-nested', { sandbox: { styleIsolation: true } });

    const outerContainer = page.locator('[data-name="sub-nested"]');
    const innerContainer = page.locator('[data-name="nested-inner"]');
    await expect(outerContainer).toHaveCount(1);
    // the inner app is mounted inside the outer app's own DOM
    await expect(outerContainer.locator('[data-name="nested-inner"]')).toHaveCount(1);

    // Every element below was created through a chain of proxied documents (inner sandbox
    // delegating to the outer one), so creator identity is ambiguous by construction. Ownership
    // must follow the container that received the node.
    const outerStyle = outerContainer.locator(':scope > qiankun-head > style[data-testid="nested-outer-style"]');
    const innerHeadStyle = innerContainer.locator(
      ':scope > qiankun-head > style[data-testid="bodyless-dynamic-head-style"]',
    );
    const innerBodyStyle = innerContainer.locator(':scope > style[data-testid="bodyless-dynamic-body-style"]');
    await expect(outerStyle).toHaveCount(1);
    await expect(innerHeadStyle).toHaveCount(1);
    await expect(innerBodyStyle).toHaveCount(1);

    const preludes = await Promise.all(
      [outerStyle, innerHeadStyle, innerBodyStyle].map((style) =>
        style.evaluate((element) => (element.textContent ?? '').trim().split('{')[0].trim()),
      ),
    );
    expect(preludes).toEqual([
      '@scope ([data-name="sub-nested"])',
      '@scope ([data-name="nested-inner"])',
      '@scope ([data-name="nested-inner"])',
    ]);

    // and the scoped rules really apply to the app that owns them
    await expect(page.getByTestId('nested-outer-target')).toHaveCSS('color', OUTER_STYLE);
    await expect(page.getByTestId('bodyless-dynamic-head-target')).toHaveCSS('color', INNER_HEAD_STYLE);
    await expect(page.getByTestId('bodyless-dynamic-body-target')).toHaveCSS('color', INNER_BODY_STYLE);
  });

  test('a node created by the outer app but inserted into the inner container belongs to the inner app', async ({
    page,
  }) => {
    await loadApp(page, 'sub-nested', { sandbox: { styleIsolation: true } });

    const innerContainer = page.locator('[data-name="nested-inner"]');
    const crossStyle = innerContainer.locator(':scope > style[data-testid="nested-cross-style"]');
    await expect(crossStyle).toHaveCount(1);

    // The creator realm (outer) and the receiving container (inner) disagree here — the container
    // wins, so the rule carries the inner app's scope root and applies inside it.
    const prelude = await crossStyle.evaluate((element) => (element.textContent ?? '').trim().split('{')[0].trim());
    expect(prelude).toBe('@scope ([data-name="nested-inner"])');
    await expect(page.getByTestId('nested-cross-target')).toHaveCSS('color', CROSS_STYLE);
  });

  test('neither nesting level leaks its globals into the main realm', async ({ page }) => {
    await loadApp(page, 'sub-nested', { sandbox: { styleIsolation: true } });
    await expect(page.getByTestId('bodyless-dynamic-head-target')).toBeVisible();

    expect(await readMainRealmGlobal(page, '__NESTED_OUTER_POLLUTION__')).toBeUndefined();
    // the lifecycle globals of both levels stay inside their own sandbox
    const exposedLifecycles = await page.evaluate(() => ({
      outer: Reflect.has(window, 'sub-nested'),
      inner: Reflect.has(window, 'sub-classic-bodyless'),
    }));
    expect(exposedLifecycles).toEqual({ outer: false, inner: false });
  });

  test('unmounting the outer app tears the inner one down with it', async ({ page }) => {
    await loadApp(page, 'sub-nested', { sandbox: { styleIsolation: true } });
    await expect(page.locator('[data-name="nested-inner"]')).toHaveCount(1);

    await unmountApp(page, 'sub-nested');

    await expect(page.locator('[data-name="nested-inner"]')).toHaveCount(0);
    await expect(page.getByTestId('bodyless-dynamic-head-target')).toHaveCount(0);
    await expect(page.getByTestId('nested-outer-target')).toHaveCount(0);
    expect(await readMainRealmGlobal(page, '__NESTED_OUTER_POLLUTION__')).toBeUndefined();
  });
});
