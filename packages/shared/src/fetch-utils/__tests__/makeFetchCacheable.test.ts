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

it('invalidates entries touched by one wrapper while preserving unrelated warm entries', async () => {
  const fetch = vi.fn(async () => new Response(slogan));
  const prefetch = makeFetchCacheable(fetch);
  const app = makeFetchCacheable(fetch);
  const entryUrl = 'https://invalidate.qiankun.org/entry';
  const otherUrl = 'https://invalidate.qiankun.org/other';

  await prefetch(entryUrl);
  await prefetch(otherUrl);
  await app(entryUrl);
  expect(fetch).toHaveBeenCalledTimes(2);

  app.invalidate();
  await app(entryUrl);
  await app(otherUrl);
  expect(fetch).toHaveBeenCalledTimes(3);
});

it('does not let an old wrapper invalidate a replacement cache generation', async () => {
  const fetch = vi.fn(async () => new Response(slogan));
  const oldApp = makeFetchCacheable(fetch);
  const sibling = makeFetchCacheable(fetch);
  const newApp = makeFetchCacheable(fetch);
  const url = 'https://generation.qiankun.org/entry';

  await oldApp(url);
  await sibling(url);
  oldApp.invalidate();
  await newApp(url);
  sibling.invalidate();
  await newApp(url);

  expect(fetch).toHaveBeenCalledTimes(2);
});

it.each(['rejection', 'invalid response'] as const)(
  'does not evict a replacement request when an old request settles with %s',
  async (failure) => {
    let resolveOld!: (response: Response) => void;
    let rejectOld!: (reason: Error) => void;
    const oldPromise = new Promise<Response>((resolve, reject) => {
      resolveOld = resolve;
      rejectOld = reject;
    });
    const fetch = vi.fn(async () => new Response('new')).mockReturnValueOnce(oldPromise);
    const oldApp = makeFetchCacheable(fetch);
    const newApp = makeFetchCacheable(fetch);
    const url = `https://stale-${failure.replace(' ', '-')}.qiankun.org/entry`;
    const oldRequest = oldApp(url);
    const oldSettlement = oldRequest.catch(() => undefined);

    oldApp.invalidate();
    await newApp(url);
    if (failure === 'rejection') rejectOld(new Error('old request failed'));
    else resolveOld(new Response('old', { status: 500 }));
    await oldSettlement;
    expect(await (await newApp(url)).text()).toBe('new');
    expect(fetch).toHaveBeenCalledTimes(2);
  },
);

it('aborts the underlying request when its sole wrapper scope is aborted', async () => {
  let networkSignal: AbortSignal | undefined;
  const fetch = vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
    networkSignal = init?.signal ?? undefined;
    return new Promise<Response>((_resolve, reject) => {
      networkSignal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
    });
  });
  const scope = new AbortController();
  const app = makeFetchCacheable(fetch, { signal: scope.signal });
  const request = app('https://sole-scope.qiankun.org/');
  const rejection = expect(request).rejects.toThrow();

  scope.abort();

  await rejection;
  expect(networkSignal?.aborted).toBe(true);
  await expect(app('https://sole-scope.qiankun.org/')).rejects.toThrow();
  expect(fetch).toHaveBeenCalledOnce();
});

it('keeps a shared download live until every wrapper releases it', async () => {
  let networkSignal: AbortSignal | undefined;
  let resolveFetch!: (response: Response) => void;
  const fetch = vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
    networkSignal = init?.signal ?? undefined;
    return new Promise<Response>((resolve) => {
      resolveFetch = resolve;
    });
  });
  const scope = new AbortController();
  const first = makeFetchCacheable(fetch, { signal: scope.signal });
  const second = makeFetchCacheable(fetch);
  const url = 'https://shared-scope.qiankun.org/';
  const firstRequest = first(url);
  const rejection = expect(firstRequest).rejects.toThrow();
  const secondRequest = second(url);

  scope.abort();
  await rejection;
  expect(networkSignal?.aborted).toBe(false);
  resolveFetch(new Response('still live'));
  expect(await (await secondRequest).text()).toBe('still live');
  expect(fetch).toHaveBeenCalledOnce();

  second.invalidate();
  expect(networkSignal?.aborted).toBe(true);
});

it('aborts a sole scope response body even after the response headers were delivered', async () => {
  const fetch = vi.fn((_input: RequestInfo | URL, init?: RequestInit) =>
    Promise.resolve(
      new Response(
        new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(new TextEncoder().encode('partial'));
            init?.signal?.addEventListener('abort', () => {
              controller.error(new DOMException('body aborted', 'AbortError'));
            });
          },
        }),
      ),
    ),
  );
  const scope = new AbortController();
  const app = makeFetchCacheable(fetch, { signal: scope.signal });
  const response = await app('https://body-scope.qiankun.org/');
  const body = response.text();
  const rejection = expect(body).rejects.toThrow('body aborted');

  scope.abort();

  await rejection;
});

it('does not abort or evict a shared download when a per-call signal aborts', async () => {
  let resolveFetch!: (response: Response) => void;
  let networkSignal: AbortSignal | undefined;
  const fetch = vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
    networkSignal = init?.signal ?? undefined;
    return new Promise<Response>((resolve) => {
      resolveFetch = resolve;
    });
  });
  const app = makeFetchCacheable(fetch);
  const signal = new AbortController();
  const url = 'https://call-signal.qiankun.org/';
  const first = app(new Request(url, { signal: signal.signal }));
  const rejection = expect(first).rejects.toThrow();
  const second = app(url);
  signal.abort();
  await rejection;
  expect(networkSignal?.aborted).toBe(false);

  resolveFetch(new Response('shared'));
  expect(await (await second).text()).toBe('shared');
  await app(url);
  expect(fetch).toHaveBeenCalledOnce();
});
