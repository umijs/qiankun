import assert from 'node:assert/strict';
import test from 'node:test';

import { runBrowserSample } from '../src/browser.mjs';

const VARIANT = {
  delivery: 'buffered',
  framework: 'qiankun',
  frameworkOptions: {},
};

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
      fixtureOrigin: 'http://127.0.0.1:7601',
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
      fixtureOrigin: 'http://127.0.0.1:7601',
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
      fixtureOrigin: 'http://127.0.0.1:7601',
      hostOrigin: 'http://127.0.0.1:7600',
      timeoutMs: 10,
      variant: VARIANT,
    }),
    /response: http:\/\/127\.0\.0\.1:7601\/missing\.css \(404\)/u,
  );
});
