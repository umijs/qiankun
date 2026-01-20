/**
 * @author Kuitos
 * @since 2024-03-05
 */
import { expect, it, vi } from 'vitest';
import { makeFetchThrowable } from '../makeFetchThrowable';

const slogan = 'Hello Qiankun 3.0';

it('should throw error while response status is not 200~400', async () => {
  expect.assertions(2);
  const fetch = vi.fn(() => {
    return Promise.resolve(new Response(slogan, { status: 400 }));
  });
  const wrappedFetch = makeFetchThrowable(fetch);
  const url = 'https://success.qiankun.org';
  try {
    await wrappedFetch(url);
  } catch (e) {
    const error = e as unknown as Error;
    expect(error.message).include('RESPONSE_ERROR_AS_STATUS_INVALID');
    expect(error.message).include(url);
  }
});

it('should prepend url to error message while fetch failed', async () => {
  expect.assertions(1);
  const fetch = vi.fn(() => {
    return Promise.reject(new Error('Failed to fetch'));
  });
  const wrappedFetch = makeFetchThrowable(fetch);
  const url = 'https://fail.qiankun.org';
  try {
    await wrappedFetch(url);
  } catch (e) {
    const error = e as unknown as Error;
    expect(error.message).toBe(`${url} Failed to fetch`);
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

it('should still throw error when error.message is readonly', async () => {
  expect.assertions(1);
  const readonlyError = new TypeError('Network error');
  Object.defineProperty(readonlyError, 'message', {
    value: 'Network error',
    writable: false,
    configurable: false,
  });
  const fetch = vi.fn(() => {
    return Promise.reject(readonlyError);
  });
  const wrappedFetch = makeFetchThrowable(fetch);
  const url = 'https://readonly.qiankun.org';
  try {
    await wrappedFetch(url);
  } catch (e) {
    // The error should still be thrown even if message is readonly
    expect(e).toBe(readonlyError);
  }
});

it('should prepend url when url is a URL object', async () => {
  expect.assertions(1);
  const fetch = vi.fn(() => {
    return Promise.reject(new Error('Failed to fetch'));
  });
  const wrappedFetch = makeFetchThrowable(fetch);
  const url = new URL('https://url-object.qiankun.org/path');
  try {
    await wrappedFetch(url);
  } catch (e) {
    const error = e as unknown as Error;
    expect(error.message).toBe(`${url.href} Failed to fetch`);
  }
});

it('should prepend url when url is a Request object', async () => {
  expect.assertions(1);
  const fetch = vi.fn(() => {
    return Promise.reject(new Error('Failed to fetch'));
  });
  const wrappedFetch = makeFetchThrowable(fetch);
  const request = new Request('https://request-object.qiankun.org/path');
  try {
    await wrappedFetch(request);
  } catch (e) {
    const error = e as unknown as Error;
    expect(error.message).toBe(`${request.url} Failed to fetch`);
  }
});
