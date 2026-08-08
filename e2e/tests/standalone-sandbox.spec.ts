import { expect, test } from '@playwright/test';
import { PORTS } from '../ports';

const STANDALONE_ORIGIN = `http://localhost:${PORTS['standalone-sandbox']}`;
const FIREFOX_IMPORT_MAP_LIMITATION = 'Firefox does not support dynamically injected import maps';

test('standalone package isolates classic, ESM, DOM, styles, and side effects without unsafe-eval', async ({
  browserName,
  page,
}) => {
  test.fail(browserName === 'firefox', FIREFOX_IMPORT_MAP_LIMITATION);

  const response = await page.goto(`${STANDALONE_ORIGIN}/?csp-no-eval`);
  expect(response?.ok()).toBe(true);
  const policy = response?.headers()['content-security-policy'];
  expect(policy).toContain('script-src');
  expect(policy).toContain('blob:');
  expect(policy).not.toContain("'unsafe-eval'");

  const state = page.locator('[data-controller-state]');
  const container = page.locator('#sandbox-container');
  const widget = container.locator('.third-party-widget');
  await expect(state).toHaveAttribute('data-state', 'running');
  await expect(widget).toBeVisible();

  await expect(widget).toHaveAttribute('data-self-reference', 'true');
  await expect(widget).toHaveAttribute('data-dynamic-script', 'contained');
  await expect(container).toHaveAttribute('data-esm-status', 'esm-graph-ready:true');
  await expect(container.locator('qiankun-head')).toHaveCount(1);
  await expect(container.locator('script[data-consumed="true"]')).toHaveCount(1);
  const isolatedStyle = container.locator('qiankun-head style');
  await expect.poll(async () => isolatedStyle.textContent()).toContain('@scope ([data-name="pulseboard-widget"])');

  const realmState = await page.evaluate(() => ({
    classic: Reflect.has(window, '__STANDALONE_WIDGET__'),
    dynamic: Reflect.has(window, '__STANDALONE_DYNAMIC_SCRIPT__'),
    esm: Reflect.has(window, '__STANDALONE_ESM__'),
  }));
  expect(realmState).toEqual({ classic: false, dynamic: false, esm: false });

  const hostColor = await page
    .locator('[data-host-shared-label]')
    .evaluate((element) => getComputedStyle(element).color);
  const widgetColor = await widget.locator('.shared-label').evaluate((element) => getComputedStyle(element).color);
  expect(widgetColor).not.toBe(hostColor);

  const ticks = page.locator('[data-metric="ticks"]');
  await expect.poll(async () => Number(await ticks.textContent()), { timeout: 5000 }).toBeGreaterThan(0);
  await page.locator('[data-action="ping"]').click();
  await expect(page.locator('[data-metric="acks"]')).toHaveText('1');

  await page.locator('[data-action="dispose"]').click();
  await expect(state).toHaveAttribute('data-state', 'disposed');
  await expect(container.locator('qiankun-head')).toHaveCount(0);
  await expect(container).not.toHaveAttribute('data-name');
  await expect(widget).toHaveCount(0);

  const ticksAfterDispose = await ticks.textContent();
  await expect(state).toHaveAttribute('data-timer-cleanup', 'stopped', { timeout: 3000 });
  await expect(ticks).toHaveText(ticksAfterDispose!);
  await page.evaluate(() => window.dispatchEvent(new Event('standalone-widget:ping')));
  await expect(page.locator('[data-metric="acks"]')).toHaveText('1');
});

/**
 * A second controller taking over the same caller-owned container after a full classic-script
 * evaluation lifecycle. The container preparation of that second mount has to see a plain host
 * element again: nodes the compartment itself puts in the container while evaluating (its internal
 * blob script) are pipeline-internal, and must never make the container look like it already holds
 * streamed entry content — which would skip creating the virtual head the app then mounts into.
 */
test('a fresh controller re-prepares the same container after a classic evaluation', async ({ browserName, page }) => {
  test.fail(browserName === 'firefox', FIREFOX_IMPORT_MAP_LIMITATION);

  await page.goto(`${STANDALONE_ORIGIN}/`);

  const state = page.locator('[data-controller-state]');
  const container = page.locator('#sandbox-container');
  const widget = container.locator('.third-party-widget');
  await expect(state).toHaveAttribute('data-state', 'running');
  await expect(container.locator('qiankun-head')).toHaveCount(1);

  await page.locator('[data-action="dispose"]').click();
  await expect(state).toHaveAttribute('data-state', 'disposed');
  await expect(container.locator('qiankun-head')).toHaveCount(0);

  await page.locator('[data-action="run"]').click();
  await expect(state).toHaveAttribute('data-state', 'running');

  // exactly one virtual head — neither skipped nor duplicated — and the widget is live again
  await expect(container.locator('qiankun-head')).toHaveCount(1);
  await expect(widget).toBeVisible();
  await expect(widget).toHaveAttribute('data-dynamic-script', 'contained');
  await expect(container).toHaveAttribute('data-esm-status', 'esm-graph-ready:true');

  // and isolation still holds for the second controller
  const isolatedStyle = container.locator('qiankun-head style');
  await expect.poll(async () => isolatedStyle.textContent()).toContain('@scope ([data-name="pulseboard-widget"])');
  const realmState = await page.evaluate(() => ({
    classic: Reflect.has(window, '__STANDALONE_WIDGET__'),
    esm: Reflect.has(window, '__STANDALONE_ESM__'),
  }));
  expect(realmState).toEqual({ classic: false, esm: false });
});
