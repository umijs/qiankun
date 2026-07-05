import { expect, test } from '@playwright/test';
import { loadApp, loadAppExpectError, resetContainer } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('failure paths', () => {
  test('a 404 entry rejects the load and leaves the main app healthy', async ({ page }) => {
    const message = await loadAppExpectError(page, 'sub-missing');
    expect(message).toContain('404');

    // the failure must not break the main app: a healthy app still loads afterwards
    const status = await loadApp(page, 'sub-classic');
    expect(status).toBe('MOUNTED');
    await expect(page.getByTestId('classic-title')).toBeVisible();
  });

  test('a throwing mount rejects mountPromise with the app error', async ({ page }) => {
    const message = await loadAppExpectError(page, 'sub-misbehaving', undefined, 'sub-misbehaving', {
      behavior: 'mount-error',
    });
    expect(message).toContain('deliberate mount failure');
  });

  test('the same app recovers on a fresh container after a mount failure', async ({ page }) => {
    // first attempt fails inside the app's mount
    await loadAppExpectError(page, 'sub-misbehaving', undefined, 'sub-misbehaving', { behavior: 'mount-error' });

    // main apps typically retry on a freshly keyed container (same id / same position)
    await resetContainer(page, 'sub-misbehaving');

    const status = await loadApp(page, 'sub-misbehaving');
    expect(status).toBe('MOUNTED');
    await expect(page.getByTestId('misbehaving-content')).toHaveText('misbehaving mounted');
  });

  test('main app survives a sub app mount crash and can load other apps', async ({ page }) => {
    await loadAppExpectError(page, 'sub-misbehaving', undefined, 'sub-misbehaving', { behavior: 'mount-error' });

    const status = await loadApp(page, 'sub-classic');
    expect(status).toBe('MOUNTED');
    await expect(page.getByTestId('classic-title')).toBeVisible();
  });
});
