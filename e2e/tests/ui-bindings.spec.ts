import { expect, type Page, test } from '@playwright/test';

type GatesWindow = {
  __HOST_GATES__: {
    events: () => string[];
    clearEvents: () => void;
    armBMount: () => void;
    isBMountEntered: () => boolean;
    resolveBMount: () => void;
    armBUnmount: () => void;
    isBUnmountEntered: () => boolean;
    resolveBUnmount: () => void;
  };
};

type StrictWindow = {
  __STRICT_E2E__: {
    probeSetups: number;
    probeCleanups: number;
    appEvents: string[];
  };
};

async function centerOf(page: Page, selector: string): Promise<{ x: number; y: number }> {
  const box = await page.locator(selector).boundingBox();
  if (!box) throw new Error(`${selector} boundingBox unavailable`);
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

async function hitTestIdAt(page: Page, x: number, y: number): Promise<string | null> {
  return page.evaluate(
    ([cx, cy]) => document.elementFromPoint(cx, cy)?.closest('[data-testid]')?.getAttribute('data-testid') ?? null,
    [x, y],
  );
}

test.describe('@qiankunjs/react host', () => {
  test('serializes development StrictMode double-setup/cleanup so only the final instance survives', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/react-strict-host.html');

    await expect(page.getByTestId('binding-title')).toHaveText('binding-a');
    await expect(page.getByTestId('binding-props')).toHaveText('label:strict-initial');
    await expect(page.getByTestId('binding-counters')).toHaveText('bootstrap:1,mount:2,update:0,unmount:1');
    await expect(page.locator('.qiankun-micro-app-container')).toHaveCount(1);

    const strictMetrics = await page.evaluate(() => (window as unknown as StrictWindow).__STRICT_E2E__);
    expect(strictMetrics.probeSetups).toBe(2);
    expect(strictMetrics.probeCleanups).toBe(1);
    expect(strictMetrics.appEvents).toEqual(['mount:a', 'mount-done:a', 'unmount:a', 'mount:a', 'mount-done:a']);

    await page.getByTestId('update-label').click();
    await expect(page.getByTestId('binding-props')).toHaveText('label:strict-updated');
    await expect(page.getByTestId('binding-counters')).toHaveText('bootstrap:1,mount:2,update:1,unmount:1');

    await page.getByTestId('toggle-app').click();
    await expect(page.locator('.qiankun-micro-app-container')).toHaveCount(0);
    await expect(page.locator('html')).toHaveAttribute('data-binding-a-unmounts', '2');

    await page.getByTestId('toggle-app').click();
    await expect(page.getByTestId('binding-counters')).toHaveText('bootstrap:1,mount:4,update:1,unmount:3');
    expect(errors).toEqual([]);
  });

  test('handles prop updates, gated rapid B->A mount/unmount races, and unmount cleanup', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/react-host.html');

    await expect(page.getByTestId('binding-title')).toHaveText('binding-a');
    await expect(page.getByTestId('binding-props')).toHaveText('label:initial');
    await expect(page.getByTestId('binding-counters')).toHaveText('bootstrap:1,mount:1,update:0,unmount:0');

    await page.getByTestId('update-label').click();
    await expect(page.getByTestId('binding-props')).toHaveText('label:updated');
    await expect(page.getByTestId('binding-counters')).toHaveText('bootstrap:1,mount:1,update:1,unmount:0');

    // Case 1: B mount gate suspended -> switch back to A -> release -> A wins with ordered lifecycle
    await page.evaluate(() => {
      (window as unknown as GatesWindow).__HOST_GATES__.clearEvents();
      (window as unknown as GatesWindow).__HOST_GATES__.armBMount();
    });
    await page.getByTestId('switch-b').click();
    await expect
      .poll(() => page.evaluate(() => (window as unknown as GatesWindow).__HOST_GATES__.isBMountEntered()))
      .toBe(true);

    await page.getByTestId('switch-a').click();
    expect(await page.evaluate(() => (window as unknown as GatesWindow).__HOST_GATES__.events())).toEqual([
      'unmount:a',
      'mount:b-start',
    ]);
    await expect(page.getByTestId('binding-title')).toHaveCount(0);

    await page.evaluate(() => {
      (window as unknown as GatesWindow).__HOST_GATES__.resolveBMount();
    });
    await expect(page.getByTestId('binding-title')).toHaveText('binding-a');
    await expect(page.getByTestId('binding-b-title')).toHaveCount(0);
    await expect(page.locator('html')).toHaveAttribute('data-binding-b-state', 'unmounted');
    expect(await page.evaluate(() => (window as unknown as GatesWindow).__HOST_GATES__.events())).toEqual([
      'unmount:a',
      'mount:b-start',
      'mount:b-done',
      'unmount:b-start',
      'unmount:b-done',
      'mount:a',
      'mount-done:a',
    ]);

    // Case 2: B unmount gate suspended -> switch A must wait behind B unmount until released
    await page.getByTestId('switch-b').click();
    await expect(page.getByTestId('binding-b-title')).toHaveText('binding-b');
    await expect(page.locator('html')).toHaveAttribute('data-binding-b-state', 'mounted');
    await page.evaluate(() => window.dispatchEvent(new CustomEvent('binding-b-ping')));
    await expect(page.locator('html')).toHaveAttribute('data-binding-b-pings', '1');

    await page.evaluate(() => {
      (window as unknown as GatesWindow).__HOST_GATES__.clearEvents();
      (window as unknown as GatesWindow).__HOST_GATES__.armBUnmount();
    });
    await page.getByTestId('switch-a').click();
    await expect
      .poll(() => page.evaluate(() => (window as unknown as GatesWindow).__HOST_GATES__.isBUnmountEntered()))
      .toBe(true);
    expect(await page.evaluate(() => (window as unknown as GatesWindow).__HOST_GATES__.events())).toEqual([
      'unmount:b-start',
    ]);
    await expect(page.getByTestId('binding-title')).toHaveCount(0);

    await page.evaluate(() => {
      (window as unknown as GatesWindow).__HOST_GATES__.resolveBUnmount();
    });
    await expect(page.getByTestId('binding-title')).toHaveText('binding-a');
    await expect(page.getByTestId('binding-b-title')).toHaveCount(0);
    expect(await page.evaluate(() => (window as unknown as GatesWindow).__HOST_GATES__.events())).toEqual([
      'unmount:b-start',
      'unmount:b-done',
      'mount:a',
      'mount-done:a',
    ]);
    await page.evaluate(() => window.dispatchEvent(new CustomEvent('binding-b-ping')));
    await expect(page.locator('html')).toHaveAttribute('data-binding-b-pings', '1');

    // Full unmount cleanup + remount reuse
    const unmountsBeforeToggle = Number((await page.locator('html').getAttribute('data-binding-a-unmounts')) ?? '0');
    await page.getByTestId('toggle-app').click();
    await expect(page.locator('.qiankun-micro-app-wrapper')).toHaveCount(0);
    await expect(page.locator('html')).toHaveAttribute('data-binding-a-unmounts', String(unmountsBeforeToggle + 1));

    await page.getByTestId('toggle-app').click();
    await expect(page.getByTestId('binding-counters')).toHaveText(
      `bootstrap:1,mount:4,update:1,unmount:${unmountsBeforeToggle + 1}`,
    );
    expect(errors).toEqual([]);
  });

  test('loader overlay paints above the positioned micro-app and intercepts pointer hits until mount settles', async ({
    page,
  }) => {
    await page.goto('/react-host.html?gated=1');

    await expect(page.getByTestId('host-loader')).toBeVisible();
    await expect(page.getByTestId('binding-action-btn')).toBeAttached();

    const { x, y } = await centerOf(page, '[data-testid="binding-action-btn"]');
    expect(await hitTestIdAt(page, x, y)).toBe('host-loader');

    await page.mouse.click(x, y);
    await expect(page.getByTestId('binding-clicks')).toHaveText('0');

    await page.getByTestId('resolve-mount').click();
    await expect(page.getByTestId('host-loader')).toHaveCount(0);

    await expect.poll(() => hitTestIdAt(page, x, y)).toBe('binding-action-btn');
    await page.mouse.click(x, y);
    await expect(page.getByTestId('binding-clicks')).toHaveText('1');
  });

  test('errorBoundary overlay paints above the positioned micro-app container', async ({ page }) => {
    await page.goto('/react-host.html?gated=1');

    await expect(page.getByTestId('host-loader')).toBeVisible();
    await expect(page.getByTestId('binding-action-btn')).toBeAttached();
    const { x, y } = await centerOf(page, '.host-app-container');

    await page.getByTestId('reject-mount').click();
    await expect(page.getByTestId('host-error')).toBeVisible();
    expect(await hitTestIdAt(page, x, y)).toBe('host-error');
  });
});

test.describe('@qiankunjs/vue host', () => {
  test('handles appProps updates, gated rapid B->A mount/unmount races, and external unmount cleanup', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/vue-host.html');

    await expect(page.getByTestId('binding-title')).toHaveText('binding-a');
    await expect(page.getByTestId('binding-props')).toHaveText('label:initial');
    await expect(page.getByTestId('binding-counters')).toHaveText('bootstrap:1,mount:1,update:0,unmount:0');

    await page.getByTestId('update-label').click();
    await expect(page.getByTestId('binding-props')).toHaveText('label:vue-updated');
    await expect(page.getByTestId('binding-counters')).toHaveText('bootstrap:1,mount:1,update:1,unmount:0');

    // Case 1: B mount gate suspended -> switch A -> release -> A wins without stale B DOM or listener
    await page.evaluate(() => {
      (window as unknown as GatesWindow).__HOST_GATES__.clearEvents();
      (window as unknown as GatesWindow).__HOST_GATES__.armBMount();
    });
    await page.getByTestId('switch-b').click();
    await expect
      .poll(() => page.evaluate(() => (window as unknown as GatesWindow).__HOST_GATES__.isBMountEntered()))
      .toBe(true);

    await page.getByTestId('switch-a').click();
    expect(await page.evaluate(() => (window as unknown as GatesWindow).__HOST_GATES__.events())).toEqual([
      'unmount:a',
      'mount:b-start',
    ]);
    await expect(page.getByTestId('binding-title')).toHaveCount(0);

    await page.evaluate(() => {
      (window as unknown as GatesWindow).__HOST_GATES__.resolveBMount();
    });
    await expect(page.getByTestId('binding-title')).toHaveText('binding-a');
    await expect(page.getByTestId('binding-b-title')).toHaveCount(0);
    await expect(page.locator('html')).toHaveAttribute('data-binding-b-state', 'unmounted');
    expect(await page.evaluate(() => (window as unknown as GatesWindow).__HOST_GATES__.events())).toEqual([
      'unmount:a',
      'mount:b-start',
      'mount:b-done',
      'unmount:b-start',
      'unmount:b-done',
      'mount:a',
      'mount-done:a',
    ]);

    // Case 2: Switch to B, verify live listener side effect, suspend B unmount -> verify A waits -> release
    await page.getByTestId('switch-b').click();
    await expect(page.getByTestId('binding-b-title')).toHaveText('binding-b');
    await expect(page.locator('html')).toHaveAttribute('data-binding-b-state', 'mounted');
    await page.evaluate(() => window.dispatchEvent(new CustomEvent('binding-b-ping')));
    await expect(page.locator('html')).toHaveAttribute('data-binding-b-pings', '1');

    await page.evaluate(() => {
      (window as unknown as GatesWindow).__HOST_GATES__.clearEvents();
      (window as unknown as GatesWindow).__HOST_GATES__.armBUnmount();
    });
    await page.getByTestId('switch-a').click();
    await expect
      .poll(() => page.evaluate(() => (window as unknown as GatesWindow).__HOST_GATES__.isBUnmountEntered()))
      .toBe(true);
    expect(await page.evaluate(() => (window as unknown as GatesWindow).__HOST_GATES__.events())).toEqual([
      'unmount:b-start',
    ]);
    await expect(page.getByTestId('binding-title')).toHaveCount(0);

    await page.evaluate(() => {
      (window as unknown as GatesWindow).__HOST_GATES__.resolveBUnmount();
    });
    await expect(page.getByTestId('binding-title')).toHaveText('binding-a');
    expect(await page.evaluate(() => (window as unknown as GatesWindow).__HOST_GATES__.events())).toEqual([
      'unmount:b-start',
      'unmount:b-done',
      'mount:a',
      'mount-done:a',
    ]);

    // Switch back to B, trigger Vue v-if unmount, prove real parcel.unmount & external side-effect stop
    await page.getByTestId('switch-b').click();
    await expect(page.getByTestId('binding-b-title')).toHaveText('binding-b');
    await page.evaluate(() => window.dispatchEvent(new CustomEvent('binding-b-ping')));
    await expect(page.locator('html')).toHaveAttribute('data-binding-b-pings', '2');

    const unmountsBeforeToggle = Number((await page.locator('html').getAttribute('data-binding-b-unmounts')) ?? '0');
    await page.getByTestId('toggle-app').click();
    await expect(page.getByTestId('binding-b-title')).toHaveCount(0);
    await expect(page.locator('.qiankun-micro-app-wrapper')).toHaveCount(0);
    await expect(page.locator('html')).toHaveAttribute('data-binding-b-state', 'unmounted');
    await expect(page.locator('html')).toHaveAttribute('data-binding-b-unmounts', String(unmountsBeforeToggle + 1));

    await page.evaluate(() => window.dispatchEvent(new CustomEvent('binding-b-ping')));
    await expect(page.locator('html')).toHaveAttribute('data-binding-b-pings', '2');
    expect(errors).toEqual([]);
  });

  test('loader overlay paints above the positioned micro-app and intercepts pointer hits until mount settles', async ({
    page,
  }) => {
    await page.goto('/vue-host.html?gated=1');

    await expect(page.getByTestId('host-loader')).toBeVisible();
    await expect(page.getByTestId('binding-action-btn')).toBeAttached();

    const { x, y } = await centerOf(page, '[data-testid="binding-action-btn"]');
    expect(await hitTestIdAt(page, x, y)).toBe('host-loader');

    await page.mouse.click(x, y);
    await expect(page.getByTestId('binding-clicks')).toHaveText('0');

    await page.getByTestId('resolve-mount').click();
    await expect(page.getByTestId('host-loader')).toHaveCount(0);

    await expect.poll(() => hitTestIdAt(page, x, y)).toBe('binding-action-btn');
    await page.mouse.click(x, y);
    await expect(page.getByTestId('binding-clicks')).toHaveText('1');
  });

  test('errorBoundary overlay paints above the positioned micro-app container', async ({ page }) => {
    await page.goto('/vue-host.html?gated=1');

    await expect(page.getByTestId('host-loader')).toBeVisible();
    await expect(page.getByTestId('binding-action-btn')).toBeAttached();
    const { x, y } = await centerOf(page, '.host-app-container');

    await page.getByTestId('reject-mount').click();
    await expect(page.getByTestId('host-error')).toBeVisible();
    expect(await hitTestIdAt(page, x, y)).toBe('host-error');
  });
});
