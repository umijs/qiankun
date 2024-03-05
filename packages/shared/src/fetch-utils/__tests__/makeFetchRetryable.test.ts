// @vitest-environment edge-runtime
import { expect, it, vi } from 'vitest';
import { makeFetchRetryable } from '../makeFetchRetryable';

const slogan = 'Hello Qiankun 3.0';

it('should retry automatically while fetch throw error', async () => {
  const retryTimes = 3;
  let count = 0;
  const fetch = vi.fn(() => {
    if (count < retryTimes) {
      count++;
      throw new Error('network error');
    }
    return Promise.resolve(new Response(slogan, { status: 201 }));
  });
  const wrappedFetch = makeFetchRetryable(fetch, retryTimes);
  const url = 'https://success.qiankun.org';
  const res = await wrappedFetch(url);
  expect(res.status).toBe(201);
  expect(fetch).toHaveBeenCalledTimes(4);
});

it('should work well while response status is 200', async () => {
  const fetch = vi.fn(() => {
    return Promise.resolve(new Response(slogan, { status: 200 }));
  });
  const wrappedFetch = makeFetchRetryable(fetch);
  const url = 'https://success.qiankun.org';
  const res = await wrappedFetch(url);
  expect(res.status).toBe(200);
  expect(fetch).toHaveBeenCalledTimes(1);
});
