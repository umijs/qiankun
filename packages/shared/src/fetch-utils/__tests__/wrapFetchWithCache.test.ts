// @vitest-environment edge-runtime

import { expect, it, vi } from 'vitest';
import { wrapFetchWithCache } from '../wrapFetchWithCache';

const slogan = 'Hello Qiankun 3.0';

it('should just call fetch once while multiple request invoked parallel', () => {
  const fetch = vi.fn(() => {
    return Promise.resolve(new Response(slogan, { status: 200, statusText: 'OK' }));
  });
  const wrappedFetch = wrapFetchWithCache(fetch);
  const url = 'https://success.qiankun.org';
  wrappedFetch(url);
  wrappedFetch(url);
  wrappedFetch(url);

  expect(fetch).toHaveBeenCalledOnce();
});

it('should support read response body as a stream multi times', async () => {
  const fetch = vi.fn(() => {
    return Promise.resolve(new Response(slogan, { status: 200, statusText: 'OK' }));
  });
  const wrappedFetch = wrapFetchWithCache(fetch);

  const url = 'https://stream.qiankun.org';
  const response1 = await wrappedFetch(url);
  const bodyStream1 = response1.body!;
  expect(bodyStream1.locked).toBe(false);
  const reader = bodyStream1.getReader();
  const { done, value } = await reader.read();
  expect(done).toBe(false);
  expect(value).toStrictEqual(new TextEncoder().encode('Hello Qiankun 3.0'));
  expect(bodyStream1.locked).toBe(true);

  const response2 = await wrappedFetch(url);
  const bodyStream2 = response2.body!;
  expect(bodyStream2.locked).toBe(false);
});

it('should clear cache while respond error with invalid status code', async () => {
  const fetch = vi.fn(() => {
    return Promise.resolve(new Response(slogan, { status: 400 }));
  });
  const wrappedFetch = wrapFetchWithCache(fetch);
  const url = 'https://errorStatusCode.qiankun.org';

  const response1 = await wrappedFetch(url);
  const result1 = await response1.text();
  expect(result1).toBe(slogan);

  const response2 = await wrappedFetch(url);
  const result2 = await response2.text();
  expect(result2).toBe(slogan);

  expect(fetch).toHaveBeenCalledTimes(2);
});

it('should clear cache while respond error', async () => {
  const fetch = vi.fn(() => {
    return Promise.reject(new Error('error'));
  });
  const wrappedFetch = wrapFetchWithCache(fetch);

  const url = 'https://error.qiankun.org';
  await expect(wrappedFetch(url)).rejects.toThrow('error');
  await expect(wrappedFetch(url)).rejects.toThrow('error');

  expect(fetch).toHaveBeenCalledTimes(2);
});
