const BROWSER_CONTEXT_OPTIONS = {
  colorScheme: 'light',
  deviceScaleFactor: 1,
  locale: 'en-US',
  reducedMotion: 'reduce',
  serviceWorkers: 'block',
  timezoneId: 'UTC',
  viewport: { height: 720, width: 1280 },
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

export async function runBrowserSample({ browser, fixtureOrigin, hostOrigin, timeoutMs, variant }) {
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

    await page.goto(`${hostOrigin}/${variant.framework}.html`, {
      timeout: timeoutMs,
      waitUntil: 'load',
    });
    const measurement = await withTimeout(
      page.evaluate(
        async ({ delivery, entryOrigin, frameworkOptions, timeout }) => {
          if (!window.__BENCHMARK__) throw new Error('benchmark host API is unavailable');
          return window.__BENCHMARK__.run({
            entry: `${entryOrigin}/app?delivery=${delivery}`,
            frameworkOptions,
            timeoutMs: timeout,
          });
        },
        {
          delivery: variant.delivery,
          entryOrigin: fixtureOrigin,
          frameworkOptions: variant.frameworkOptions,
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
