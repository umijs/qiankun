import assert from 'node:assert/strict';
import test from 'node:test';

import { runBrowserSample } from '../src/browser.mjs';
import { createBenchmarkOrigins, resolveVariantEntryOrigin } from '../src/origins.mjs';

const VARIANT = {
  delivery: 'buffered',
  entrySite: 'same-site',
  framework: 'qiankun',
  frameworkOptions: {},
  htmlFixture: 'ssr',
};

const FIXTURE_ORIGINS = {
  'cross-site': 'http://benchmark-app.localhost:7601',
  'same-site': 'http://127.0.0.1:7601',
};

test('createBenchmarkOrigins preserves the fixture port while changing the cross-site hostname', () => {
  const hostOrigins = { candidate: 'http://127.0.0.1:7600' };
  const origins = createBenchmarkOrigins({ fixtureOrigin: FIXTURE_ORIGINS['same-site'], hostOrigins });

  assert.deepEqual(origins, { fixtureOrigins: FIXTURE_ORIGINS, hostOrigins });
  assert.notEqual(
    new URL(origins.fixtureOrigins['cross-site']).hostname,
    new URL(origins.fixtureOrigins['same-site']).hostname,
  );
});

test('resolveVariantEntryOrigin requires an origin for the declared entry site', () => {
  assert.equal(resolveVariantEntryOrigin(VARIANT, FIXTURE_ORIGINS), FIXTURE_ORIGINS['same-site']);
  assert.equal(
    resolveVariantEntryOrigin({ ...VARIANT, entrySite: 'cross-site' }, FIXTURE_ORIGINS),
    FIXTURE_ORIGINS['cross-site'],
  );
  assert.throws(
    () => resolveVariantEntryOrigin({ ...VARIANT, entrySite: 'missing' }, FIXTURE_ORIGINS),
    /fixture origin is unavailable for entry site: missing/u,
  );
});

test('runBrowserSample sends the variant entry-site origin to the host page', async () => {
  let evaluationOptions;
  const page = {
    evaluate: async (_callback, options) => {
      evaluationOptions = options;
      return { duration: 10, settled: true, t0: 1, t1: 11 };
    },
    goto: async () => {},
    on: () => {},
  };
  const browser = {
    newContext: async () => ({
      close: async () => {},
      newPage: async () => page,
    }),
  };

  await runBrowserSample({
    browser,
    fixtureOrigins: FIXTURE_ORIGINS,
    hostOrigin: 'http://127.0.0.1:7600',
    timeoutMs: 10,
    variant: { ...VARIANT, entrySite: 'cross-site', framework: 'native' },
  });

  assert.equal(evaluationOptions.entryOrigin, FIXTURE_ORIGINS['cross-site']);
  assert.equal(evaluationOptions.htmlFixture, 'ssr');
});

test('runBrowserSample times out a hung benchmark and closes its context', { timeout: 1_000 }, async () => {
  let contextClosed = false;
  const page = {
    evaluate: () => new Promise(() => {}),
    goto: async () => {},
    on: () => {},
  };
  const context = {
    close: async () => {
      contextClosed = true;
    },
    newPage: async () => page,
  };
  const browser = {
    newContext: async () => context,
  };

  await assert.rejects(
    runBrowserSample({
      browser,
      fixtureOrigins: FIXTURE_ORIGINS,
      hostOrigin: 'http://127.0.0.1:7600',
      timeoutMs: 10,
      variant: VARIANT,
    }),
    /benchmark sample timed out after 10ms/u,
  );
  assert.equal(contextClosed, true);
});

test('runBrowserSample closes its context when page creation fails', async () => {
  let contextClosed = false;
  const browser = {
    newContext: async () => ({
      close: async () => {
        contextClosed = true;
      },
      newPage: async () => {
        throw new Error('page creation failed');
      },
    }),
  };

  await assert.rejects(
    runBrowserSample({
      browser,
      fixtureOrigins: FIXTURE_ORIGINS,
      hostOrigin: 'http://127.0.0.1:7600',
      timeoutMs: 10,
      variant: VARIANT,
    }),
    /page creation failed/u,
  );
  assert.equal(contextClosed, true);
});

test('runBrowserSample rejects HTTP error responses', async () => {
  const handlers = new Map();
  const page = {
    evaluate: async () => {
      handlers.get('response')?.({
        status: () => 404,
        url: () => 'http://127.0.0.1:7601/missing.css',
      });
      return { duration: 10, settled: true, t0: 1, t1: 11 };
    },
    goto: async () => {},
    on: (event, handler) => handlers.set(event, handler),
  };
  const browser = {
    newContext: async () => ({
      close: async () => {},
      newPage: async () => page,
    }),
  };

  await assert.rejects(
    runBrowserSample({
      browser,
      fixtureOrigins: FIXTURE_ORIGINS,
      hostOrigin: 'http://127.0.0.1:7600',
      timeoutMs: 10,
      variant: VARIANT,
    }),
    /response: http:\/\/127\.0\.0\.1:7601\/missing\.css \(404\)/u,
  );
});

test('runBrowserSample rejects adapters that fetch fixture resources before t0', async () => {
  const handlers = new Map();
  const page = {
    evaluate: async () => ({ cleaned: true, duration: 10, settled: true, t0: 1, t1: 11 }),
    goto: async () => {
      handlers.get('request')?.({
        url: () => `${FIXTURE_ORIGINS['same-site']}/app/index.html?delivery=buffered`,
      });
    },
    on: (event, handler) => handlers.set(event, handler),
  };
  const browser = {
    newContext: async () => ({
      close: async () => {},
      newPage: async () => page,
    }),
  };

  await assert.rejects(
    runBrowserSample({
      browser,
      fixtureOrigins: FIXTURE_ORIGINS,
      hostOrigin: 'http://127.0.0.1:7600',
      timeoutMs: 10,
      variant: VARIANT,
    }),
    /framework adapter fetched the fixture before t0/u,
  );
});
