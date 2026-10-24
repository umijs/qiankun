import { expect, test } from '@playwright/test';
import { SUB_APP_ENTRIES } from '../ports';
import { type E2EWindow, loadApp } from './helpers';

type OutcomeWindow = E2EWindow & {
  __E2E__: {
    mountOutcome(key: string): Promise<{ status: string; error?: string; frameworkError?: { code: string } }>;
  };
};

test('native ESM support is checked once per document and leaves Classic loading usable', async ({
  page,
  browserName,
}) => {
  await page.goto('/');
  const probes = await page.evaluate(() => {
    let count = 0;
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node instanceof HTMLIFrameElement && node.dataset.qiankun === 'esm-capability') count++;
        }
      }
    });
    observer.observe(document, { subtree: true, childList: true });
    Object.assign(window, { __probeCount: () => count });
    return count;
  });
  expect(probes).toBe(0);
  for (const key of ['esm-first', 'esm-second']) {
    await page.evaluate((key) => (window as unknown as E2EWindow).__E2E__.loadDetached('sub-esm', key), key);
    const outcome = await page.evaluate((key) => (window as unknown as OutcomeWindow).__E2E__.mountOutcome(key), key);
    if (browserName === 'firefox') {
      expect(outcome).toMatchObject({ frameworkError: { code: 'esm-unsupported' } });
      expect(outcome.error).toContain('/zh-CN/errors/esm-unsupported');
    } else {
      expect(outcome.status).toBe('MOUNTED');
    }
  }
  expect(await page.evaluate(() => (window as unknown as { __probeCount(): number }).__probeCount())).toBe(1);
  await expect(page.locator('iframe[data-qiankun="esm-capability"]')).toHaveCount(0);
  expect(await loadApp(page, 'sub-classic')).toBe('MOUNTED');
});

for (const explicitEntry of [true, false]) {
  test(`a rejected late map returns the dedicated error (explicit entry: ${String(explicitEntry)})`, async ({
    page,
  }) => {
    // Simulate rejection of a late map in supporting browsers too. The first map still works.
    await page.addInitScript(() => {
      const append = Node.prototype.appendChild;
      Node.prototype.appendChild = function <T extends Node>(node: T): T {
        const result = append.call(this, node) as T;
        if (node instanceof HTMLIFrameElement && node.dataset.qiankun === 'esm-capability') {
          const head = node.contentDocument!.head;
          const appendToHead = head.appendChild.bind(head);
          let maps = 0;
          head.appendChild = <N extends Node>(child: N): N => {
            if (child.nodeName === 'SCRIPT' && (child as unknown as HTMLScriptElement).type === 'importmap') {
              if (++maps === 2) return child;
            }
            return appendToHead(child);
          };
        }
        return result;
      };
    });
    if (!explicitEntry) {
      await page.route(`${SUB_APP_ENTRIES['sub-esm']}/`, async (route) => {
        const response = await route.fetch();
        await route.fulfill({ response, body: (await response.text()).replace(' entry>', '>') });
      });
    }
    await page.goto('/');
    await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.loadDetached('sub-esm'));
    const outcome = await page.evaluate(() => (window as unknown as OutcomeWindow).__E2E__.mountOutcome('sub-esm'));
    expect(outcome).toMatchObject({ frameworkError: { code: 'esm-unsupported' } });
    expect(outcome.error).not.toContain('lifecycle-missing');
    await expect(page.locator('iframe[data-qiankun="esm-capability"]')).toHaveCount(0);
    expect(await loadApp(page, 'sub-classic')).toBe('MOUNTED');
  });
}

test('an enforced CSP blocking probe import maps returns a diagnostic check failure', async ({ page }) => {
  await page.goto('/?csp-no-inline-script');
  await page.evaluate(() => (window as unknown as E2EWindow).__E2E__.loadDetached('sub-esm'));
  const outcome = await page.evaluate(() => (window as unknown as OutcomeWindow).__E2E__.mountOutcome('sub-esm'));
  expect(outcome).toMatchObject({ frameworkError: { code: 'esm-capability-check-failed' } });
  await expect(page.locator('iframe[data-qiankun="esm-capability"]')).toHaveCount(0);
});
