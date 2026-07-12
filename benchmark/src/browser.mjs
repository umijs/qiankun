import { resolveVariantEntryOrigin } from './origins.mjs';
import { getVariantHostPage } from '../frameworks.mjs';

export const BROWSER_CONTEXT_OPTIONS = {
  colorScheme: 'light',
  deviceScaleFactor: 1,
  locale: 'en-US',
  reducedMotion: 'reduce',
  serviceWorkers: 'block',
  timezoneId: 'UTC',
  viewport: { height: 720, width: 1280 },
};

export const MEASUREMENT_CONTRACT = {
  diagnostics: ['framework settlement', 'HTML response end', 'paint lead before response end'],
  end: 'core element is paintable and survives two animation frames',
  start: 'immediately before the prepared framework adapter invokes mount',
  version: 4,
};

async function withTimeout(promise, timeoutMs) {
  let timeout;
  const timeoutPromise = new Promise((_, reject) => {
    timeout = setTimeout(() => reject(new Error(`benchmark sample timed out after ${timeoutMs}ms`)), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeout);
  }
}

export async function runBrowserSample({ browser, fixtureOrigins, hostOrigin, timeoutMs, variant }) {
  const context = await browser.newContext(BROWSER_CONTEXT_OPTIONS);
  try {
    const page = await context.newPage();
    const errors = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(`console: ${message.text()}`);
    });
    page.on('pageerror', (error) => errors.push(`page: ${error.message}`));
    page.on('requestfailed', (request) => {
      errors.push(`request: ${request.url()} (${request.failure()?.errorText ?? 'failed'})`);
    });
    page.on('response', (response) => {
      const status = response.status();
      if (status >= 400) errors.push(`response: ${response.url()} (${status})`);
    });

    const fixtureOriginSet = new Set(Object.values(fixtureOrigins));
    const fixtureRequestsBeforeRun = [];
    let runStarted = false;
    page.on('request', (request) => {
      if (runStarted) return;
      const url = new URL(request.url());
      if (fixtureOriginSet.has(url.origin)) fixtureRequestsBeforeRun.push(url.href);
    });

    await page.goto(`${hostOrigin}/${getVariantHostPage(variant)}`, {
      timeout: timeoutMs,
      waitUntil: 'load',
    });
    if (fixtureRequestsBeforeRun.length > 0) {
      throw new Error(`framework adapter fetched the fixture before t0: ${fixtureRequestsBeforeRun[0]}`);
    }
    runStarted = true;
    const measurement = await withTimeout(
      page.evaluate(
        async ({ delivery, entryOrigin, frameworkOptions, htmlFixture, timeout }) => {
          if (!window.__BENCHMARK__) throw new Error('benchmark host API is unavailable');
          const entryUrl = new URL('/app/index.html', entryOrigin);
          entryUrl.searchParams.set('delivery', delivery);
          if (htmlFixture) entryUrl.searchParams.set('fixture', htmlFixture);
          return window.__BENCHMARK__.run({
            entry: entryUrl.href,
            frameworkOptions,
            timeoutMs: timeout,
          });
        },
        {
          delivery: variant.delivery,
          entryOrigin: resolveVariantEntryOrigin(variant, fixtureOrigins),
          frameworkOptions: variant.frameworkOptions,
          htmlFixture: variant.htmlFixture ?? null,
          timeout: timeoutMs,
        },
      ),
      timeoutMs,
    );
    if (errors.length > 0) throw new Error(errors.join('\n'));
    return measurement;
  } finally {
    await context.close();
  }
}
