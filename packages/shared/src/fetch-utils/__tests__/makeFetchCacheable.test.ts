// @vitest-environment edge-runtime

import { describe, expect, it, vi } from 'vitest';
import { makeFetchCacheable } from '../makeFetchCacheable';

const slogan = 'Hello Qiankun 3.0';

describe.each(['assets', 'modules'] as const)('%s cache', (cacheScope) => {
  it('should just call fetch once while multiple request invoked parallel', () => {
    const fetch = vi.fn(() => {
      return Promise.resolve(new Response(slogan, { status: 200, statusText: 'OK' }));
    });
    const wrappedFetch = makeFetchCacheable(fetch, cacheScope);
    const url = 'https://success.qiankun.org';
    wrappedFetch(url);
    wrappedFetch(url);
    wrappedFetch(url);

    expect(fetch).toHaveBeenCalledOnce();
  });

  it('should cache by the canonical URL and effective credentials', () => {
    const fetch = vi.fn(() => {
      return Promise.resolve(new Response(slogan, { status: 200, statusText: 'OK' }));
    });
    const wrappedFetch = makeFetchCacheable(fetch, cacheScope);
    const url = 'https://canonical-credentials.qiankun.org';

    wrappedFetch(url);
    wrappedFetch(new URL(`${url}/`), { credentials: 'same-origin' });
    wrappedFetch(new Request(`${url}/`));
    wrappedFetch(url, { credentials: 'include' });

    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('should let init credentials override Request credentials', () => {
    const fetch = vi.fn(() => {
      return Promise.resolve(new Response(slogan, { status: 200, statusText: 'OK' }));
    });
    const wrappedFetch = makeFetchCacheable(fetch, cacheScope);
    const url = 'https://request-credentials.qiankun.org/';

    wrappedFetch(new Request(url, { credentials: 'include' }), {
      credentials: 'omit',
    });
    wrappedFetch(new Request(url, { credentials: 'omit' }));
    wrappedFetch(new Request(url, { credentials: 'include' }));

    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('should support read response body as a stream multi times', async () => {
    const fetch = vi.fn(() => {
      return Promise.resolve(new Response(slogan, { status: 200, statusText: 'OK' }));
    });
    const wrappedFetch = makeFetchCacheable(fetch, cacheScope);

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
    const wrappedFetch = makeFetchCacheable(fetch, cacheScope);
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
    const wrappedFetch = makeFetchCacheable(fetch, cacheScope);

    const url = 'https://error.qiankun.org';
    await expect(wrappedFetch(url)).rejects.toThrow('error');
    await expect(wrappedFetch(url)).rejects.toThrow('error');

    expect(fetch).toHaveBeenCalledTimes(2);
  });
});

it('uses the shared asset cache by default', async () => {
  const fetch = vi.fn(() => Promise.resolve(new Response(slogan)));
  const defaultFetch = makeFetchCacheable(fetch);
  const assetFetch = makeFetchCacheable(fetch, 'assets');
  const url = 'https://default-assets.qiankun.org/entry.html';

  await defaultFetch(url);
  await assetFetch(url);

  expect(fetch).toHaveBeenCalledOnce();
});

it('reuses a 270-module graph across wrappers without evicting entry HTML or styles', async () => {
  const fetch = vi.fn(() => Promise.resolve(new Response(slogan)));
  const assetFetch = makeFetchCacheable(fetch);
  const firstModuleFetch = makeFetchCacheable(fetch, 'modules');
  const nextModuleFetch = makeFetchCacheable(fetch, 'modules');
  const entryUrl = 'https://large-graph.qiankun.org/entry.html';
  const styleUrl = 'https://large-graph.qiankun.org/style.css';
  const moduleUrls = Array.from({ length: 270 }, (_, index) => `https://large-graph.qiankun.org/${String(index)}.js`);

  await assetFetch(entryUrl);
  await assetFetch(styleUrl);
  for (const moduleFetch of [firstModuleFetch, nextModuleFetch]) {
    await Promise.all(
      moduleUrls.map(async (url) => {
        const response = await moduleFetch(url);
        expect(await response.text()).toBe(slogan);
      }),
    );
  }
  await assetFetch(entryUrl);
  await assetFetch(styleUrl);

  expect(fetch).toHaveBeenCalledTimes(272);
});

it('does not let asset requests evict module responses or share a cache entry with them', async () => {
  const fetch = vi.fn(() => Promise.resolve(new Response(slogan)));
  const assetFetch = makeFetchCacheable(fetch);
  const moduleFetch = makeFetchCacheable(fetch, 'modules');
  const moduleUrl = 'https://asset-pressure.qiankun.org/module.js';

  await moduleFetch(moduleUrl);
  await assetFetch(moduleUrl);
  expect(fetch).toHaveBeenCalledTimes(2);

  await Promise.all(
    Array.from({ length: 60 }, (_, index) => assetFetch(`https://asset-pressure.qiankun.org/${String(index)}.css`)),
  );
  await moduleFetch(moduleUrl);

  expect(fetch).toHaveBeenCalledTimes(62);
});

it.each([
  ['assets', 50],
  ['modules', 512],
] as const)('bounds the %s cache at %i entries and retains recently used responses', async (cacheScope, capacity) => {
  const fetch = vi.fn(() => Promise.resolve(new Response(slogan)));
  const cachedFetch = makeFetchCacheable(fetch, cacheScope);
  const urls = Array.from(
    { length: capacity + 1 },
    (_, index) => `https://cache-capacity.qiankun.org/${String(index)}.js`,
  );

  await Promise.all(urls.slice(0, capacity).map((url) => cachedFetch(url)));
  await cachedFetch(urls[0]);
  await cachedFetch(urls[capacity]);
  await cachedFetch(urls[0]);
  expect(fetch).toHaveBeenCalledTimes(capacity + 1);

  await cachedFetch(urls[1]);
  expect(fetch).toHaveBeenCalledTimes(capacity + 2);
});
