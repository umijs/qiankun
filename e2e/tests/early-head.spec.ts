import { expect, test } from '@playwright/test';
import { SUB_APP_ENTRIES } from '../ports';
import { type E2EWindow, loadApp, unmountApp } from './helpers';

const APP_NAME = 'sub-classic-early-head';
const ENTRY_URL = SUB_APP_ENTRIES[APP_NAME];
const STYLESHEET_URL = new URL('./early-head.css', ENTRY_URL).href;

test('the first document.head access in a single-chunk entry already isolates and records styles', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const probe = document.createElement('h1');
    probe.id = 'host-probe';
    probe.textContent = 'host style probe';
    document.body.appendChild(probe);
  });
  const hostProbe = page.locator('#host-probe');
  await expect(hostProbe).toHaveCSS('color', 'rgb(0, 0, 255)');
  await expect(hostProbe).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');

  const stylesheetRequests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).pathname === '/early-head.css') stylesheetRequests.push(request.url());
  });

  const status = await page.evaluate(
    async ({ appName, entryURL }) => {
      const nativeFetch = window.fetch.bind(window);
      return (window as unknown as E2EWindow).__E2E__.load(appName, {
        sandbox: { styleIsolation: true },
        fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
          const response = await nativeFetch(input, init);
          if (String(input) !== entryURL) return response;
          // A server's single res.end() can still become multiple network chunks. Buffer the
          // real fixture response, then deliver exactly one chunk to the streaming loader.
          const bytes = new Uint8Array(await response.arrayBuffer());
          return new Response(
            new ReadableStream<Uint8Array>({
              start(controller) {
                controller.enqueue(bytes);
                controller.close();
              },
            }),
            { headers: response.headers, status: response.status, statusText: response.statusText },
          );
        },
      });
    },
    { appName: APP_NAME, entryURL: ENTRY_URL },
  );
  expect(status).toBe('MOUNTED');

  const container = page.locator(`[data-name="${APP_NAME}"]`);
  const head = container.locator(':scope > qiankun-head');
  const style = head.getByTestId('early-head-style');
  const link = head.getByTestId('early-head-link');
  const scopePrefix = `@scope ([data-name="${APP_NAME}"])`;

  await expect(page.getByTestId('early-head-status')).toHaveText('patched:true,scoped:true,bootstrap:1,mount:1');
  await expect(style).toHaveCount(1);
  await expect.poll(() => style.textContent()).toContain(scopePrefix);
  await expect(link).toHaveCount(1);
  await expect(link).toHaveAttribute('data-href', STYLESHEET_URL);
  await expect(link).toHaveAttribute('href', /^blob:/);
  expect(
    await link.evaluate(async (element) => {
      const href = (element as HTMLLinkElement).href;
      return (await fetch(href)).text();
    }),
  ).toContain(scopePrefix);
  expect(stylesheetRequests).toEqual([STYLESHEET_URL]);
  await expect(page.getByTestId('early-head-style-target')).toHaveCSS('color', 'rgb(81, 82, 83)');
  await expect(page.getByTestId('early-head-link-target')).toHaveCSS('background-color', 'rgb(91, 92, 93)');
  await expect(hostProbe).toHaveCSS('color', 'rgb(0, 0, 255)');
  await expect(hostProbe).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');

  expect(await unmountApp(page, APP_NAME)).toBe('NOT_MOUNTED');
  await expect(container).toBeEmpty();
  await expect(page.getByTestId('early-head-style')).toHaveCount(0);
  await expect(page.getByTestId('early-head-link')).toHaveCount(0);

  expect(await loadApp(page, APP_NAME, { sandbox: { styleIsolation: true } })).toBe('MOUNTED');
  // Only cached lifecycles run on remount: the inline script cannot recreate either style.
  await expect(page.getByTestId('early-head-status')).toHaveText('patched:true,scoped:true,bootstrap:1,mount:2');
  await expect(style).toHaveCount(1);
  await expect.poll(() => style.textContent()).toContain(scopePrefix);
  await expect(link).toHaveCount(1);
  await expect(link).toHaveAttribute('data-href', STYLESHEET_URL);
  await expect(link).toHaveAttribute('href', /^blob:/);
  await expect(page.getByTestId('early-head-style-target')).toHaveCSS('color', 'rgb(81, 82, 83)');
  await expect(page.getByTestId('early-head-link-target')).toHaveCSS('background-color', 'rgb(91, 92, 93)');
  await expect(hostProbe).toHaveCSS('color', 'rgb(0, 0, 255)');
  await expect(hostProbe).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');

  expect(await unmountApp(page, APP_NAME)).toBe('NOT_MOUNTED');
  await expect(container).toBeEmpty();
});
