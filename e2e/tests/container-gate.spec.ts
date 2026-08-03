import { expect, test } from '@playwright/test';
import { loadApp } from './helpers';
import type { E2EWindow } from './helpers';

/**
 * Container occupancy gate (docs/rfcs/container-occupancy-gate.md): micro apps sharing one
 * container element take FIFO turns for their DOM writes. These tests drive the imperative
 * loadMicroApp playground — the "caller forgot to await/unmount" shapes the gate serializes.
 */
test.describe('container occupancy gate', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('a second app waits for an occupied container and takes over after unmount', async ({ page }) => {
    await loadApp(page, 'sub-classic', undefined, 'gate-holder', undefined, 'gate-shared');
    await expect(page.getByTestId('classic-title')).toBeVisible();

    // fired without unmounting the holder: pre-gate this silently stomped the mounted app
    await page.evaluate(() =>
      (window as unknown as E2EWindow).__E2E__.loadDetached('sub-classic-multiscript', 'gate-waiter', 'gate-shared'),
    );

    // the waiter must neither wipe the holder's DOM nor mount into it
    await expect(page.getByTestId('classic-title')).toBeVisible();
    await expect(page.getByTestId('load-marker')).toHaveCount(0);
    expect(await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.status('gate-waiter'))).not.toBe(
      'MOUNTED',
    );

    await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.unmount('gate-holder'));
    expect(await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.settle('gate-waiter'))).toBe('MOUNTED');
    await expect(page.getByTestId('load-marker')).toBeVisible();
    await expect(page.getByTestId('classic-title')).toHaveCount(0);
  });

  test('the serialized handoff covers a remounting waiter as well', async ({ page }) => {
    // first life of the waiter app on this container, then a clean unmount
    await loadApp(page, 'sub-classic-multiscript', undefined, 'gate-remount-waiter', undefined, 'gate-remount-shared');
    await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.unmount('gate-remount-waiter'));

    // another app occupies the shared container, the waiter comes back without an unmount await
    await loadApp(page, 'sub-classic', undefined, 'gate-remount-holder', undefined, 'gate-remount-shared');
    await page.evaluate(() =>
      (window as unknown as E2EWindow).__E2E__.loadDetached(
        'sub-classic-multiscript',
        'gate-remount-waiter',
        'gate-remount-shared',
      ),
    );
    await expect(page.getByTestId('classic-title')).toBeVisible();

    await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.unmount('gate-remount-holder'));
    expect(await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.settle('gate-remount-waiter'))).toBe(
      'MOUNTED',
    );
    // the remount replays the entry html inside the critical section — loading-phase styles included
    await expect(page.getByTestId('load-marker')).toBeVisible();
    await expect(page.getByTestId('load-marker')).toHaveCSS('color', 'rgb(7, 8, 9)');
  });

  test('racing two loads into one container serializes FIFO — the first call mounts, the second takes over after unmount', async ({
    page,
  }) => {
    await page.evaluate(() => {
      const api = (window as unknown as E2EWindow).__E2E__;
      api.loadDetached('sub-classic', 'race-a', 'race-shared');
      api.loadDetached('sub-classic-multiscript', 'race-b', 'race-shared');
    });

    // the first call owns the container and mounts fully — a hung gate would time this out
    expect(await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.settle('race-a'))).toBe('MOUNTED');
    await expect(page.getByTestId('classic-title')).toBeVisible();
    // the second call must neither leave its own DOM behind nor mount into the winner's container
    await expect(page.getByTestId('load-marker')).toHaveCount(0);
    expect(await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.status('race-b'))).not.toBe('MOUNTED');

    // FIFO handoff: once the winner unmounts, the queued app takes over fully functional —
    // its mount replays the entry inside the critical section, loading-phase styles included
    await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.unmount('race-a'));
    expect(await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.settle('race-b'))).toBe('MOUNTED');
    await expect(page.getByTestId('load-marker')).toBeVisible();
    await expect(page.getByTestId('load-marker')).toHaveCSS('color', 'rgb(7, 8, 9)');
    await expect(page.getByTestId('classic-title')).toHaveCount(0);
  });

  test('a mount-failed app releases the container for the next one', async ({ page }) => {
    // single-spa marks it SKIP_BECAUSE_BROKEN and never runs its unmount chain
    const failure = await page.evaluate(() =>
      (window as unknown as E2EWindow).__E2E__
        .load('sub-misbehaving', undefined, 'gate-broken-mount', {
          behavior: 'mount-error',
        })
        .then(
          (status: string) => `unexpectedly mounted: ${status}`,
          (error: unknown) => String(error),
        ),
    );
    expect(failure).toContain('deliberate mount failure');

    // the fallback release must keep the container acquirable
    await loadApp(page, 'sub-classic', undefined, 'gate-after-broken-mount', undefined, 'gate-broken-mount');
    await expect(page.getByTestId('classic-title')).toBeVisible();
  });

  test('an unmount-failed app releases the container for the next one', async ({ page }) => {
    await loadApp(page, 'sub-misbehaving', undefined, 'gate-broken-unmount', { behavior: 'unmount-error' });
    await expect(page.getByTestId('misbehaving-content')).toBeVisible();

    const failure = await page.evaluate(() =>
      (window as unknown as E2EWindow).__E2E__.unmount('gate-broken-unmount').then(
        (status: string) => `unexpectedly unmounted: ${status}`,
        (error: unknown) => String(error),
      ),
    );
    expect(failure).toContain('deliberate unmount failure');

    // the chain broke before clearContainer — the fallback release must still have fired
    await loadApp(page, 'sub-classic', undefined, 'gate-after-broken-unmount', undefined, 'gate-broken-unmount');
    await expect(page.getByTestId('classic-title')).toBeVisible();
  });
});
