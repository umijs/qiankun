/**
 * @author Kuitos
 * @since 2024-03-05
 */
import { expect, it, vi } from 'vitest';
import { makeFetchThrowable } from '../makeFetchThrowable';

const slogan = 'Hello Qiankun 3.0';

it('should throw error while response status is not 200~400', async () => {
  const fetch = vi.fn(() => {
    return Promise.resolve(new Response(slogan, { status: 400 }));
  });
  const wrappedFetch = makeFetchThrowable(fetch);
  const url = 'https://success.qiankun.org';
  try {
    await wrappedFetch(url);
  } catch (e) {
    expect((e as unknown as Error).message).include('RESPONSE_ERROR_AS_STATUS_INVALID');
  }
});

it('should work well while response status is 200', async () => {
  const fetch = vi.fn(() => {
    return Promise.resolve(new Response(slogan, { status: 200 }));
  });
  const wrappedFetch = makeFetchThrowable(fetch);
  const url = 'https://success.qiankun.org';
  const res = await wrappedFetch(url);
  expect(res.status).toBe(200);
});
