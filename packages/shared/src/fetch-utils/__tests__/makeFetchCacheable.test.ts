// @vitest-environment edge-runtime

import { expect, it, vi } from 'vitest';
import { makeFetchCacheable } from '../makeFetchCacheable';

const slogan = 'Hello Qiankun 3.0';

type Settled<T> = { status: 'fulfilled'; value: T } | { status: 'rejected'; reason: unknown };

const settle = <T>(promise: Promise<T>): Promise<Settled<T>> =>
  promise.then(
    (value) => ({ status: 'fulfilled', value }),
    (reason: unknown) => ({ status: 'rejected', reason }),
  );

const abortRejection = { status: 'rejected', reason: expect.objectContaining({ name: 'AbortError' }) };

/** A transport whose body stays open until the test pushes/closes it; network abort errors both phases. */
const createStreamingTransport = ({ delayHeaders = false } = {}) => {
  const encoder = new TextEncoder();
  let bodyController: ReadableStreamDefaultController<Uint8Array> | undefined;
  let networkSignal: AbortSignal | undefined;
  const fetch = vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
    const signal = init?.signal ?? undefined;
    networkSignal = signal;
    return new Promise<Response>((resolve, reject) => {
      signal?.addEventListener('abort', () => reject(signal.reason));
      if (delayHeaders) return;
      resolve(
        new Response(
          new ReadableStream<Uint8Array>({
            start(controller) {
              bodyController = controller;
              controller.enqueue(encoder.encode('partial'));
              signal?.addEventListener('abort', () => controller.error(signal.reason));
            },
          }),
        ),
      );
    });
  });

  return {
    fetch,
    networkSignal: () => networkSignal,
    push: (text: string) => bodyController?.enqueue(encoder.encode(text)),
    close: () => bodyController?.close(),
  };
};

it('should just call fetch once while multiple request invoked parallel', () => {
  const fetch = vi.fn(() => {
    return Promise.resolve(new Response(slogan, { status: 200, statusText: 'OK' }));
  });
  const wrappedFetch = makeFetchCacheable(fetch);
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
  const wrappedFetch = makeFetchCacheable(fetch);
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
  const wrappedFetch = makeFetchCacheable(fetch);
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
  const wrappedFetch = makeFetchCacheable(fetch);

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
  const wrappedFetch = makeFetchCacheable(fetch);
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
  const wrappedFetch = makeFetchCacheable(fetch);

  const url = 'https://error.qiankun.org';
  await expect(wrappedFetch(url)).rejects.toThrow('error');
  await expect(wrappedFetch(url)).rejects.toThrow('error');

  expect(fetch).toHaveBeenCalledTimes(2);
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
  const transport = createStreamingTransport();
  const scope = new AbortController();
  const app = makeFetchCacheable(transport.fetch, { signal: scope.signal });
  const response = await app('https://body-scope.qiankun.org/');
  const body = settle(response.text());

  scope.abort();

  // Like a raw fetch, the caller's body rejects with its own abort reason.
  expect(await body).toEqual({ status: 'rejected', reason: scope.signal.reason });
  expect(transport.networkSignal()?.aborted).toBe(true);
});

it('cancels only the unloaded owner body when another owner still reads the shared download', async () => {
  const transport = createStreamingTransport();
  const firstScope = new AbortController();
  const first = makeFetchCacheable(transport.fetch, { signal: firstScope.signal });
  const second = makeFetchCacheable(transport.fetch);
  const url = 'https://shared-body-scope.qiankun.org/';
  const [firstResponse, secondResponse] = await Promise.all([first(url), second(url)]);
  const firstBody = settle(firstResponse.text());
  const secondBody = settle(secondResponse.text());

  firstScope.abort();
  expect(await firstBody).toEqual({ status: 'rejected', reason: firstScope.signal.reason });
  // The sibling still reads the shared download, so the network request stays live.
  expect(transport.networkSignal()?.aborted).toBe(false);
  transport.push('-after-unload');
  transport.close();

  expect(await secondBody).toEqual({ status: 'fulfilled', value: 'partial-after-unload' });
  expect(transport.fetch).toHaveBeenCalledOnce();
});

it('cancels only the caller body when its per-call signal aborts after the headers arrived', async () => {
  const transport = createStreamingTransport();
  const app = makeFetchCacheable(transport.fetch);
  const url = 'https://call-signal-body.qiankun.org/';
  const call = new AbortController();
  const [firstResponse, secondResponse] = await Promise.all([app(url, { signal: call.signal }), app(url)]);
  const firstBody = settle(firstResponse.text());
  const secondBody = settle(secondResponse.text());

  call.abort();
  transport.push('-after-abort');
  transport.close();

  expect(await firstBody).toEqual({ status: 'rejected', reason: call.signal.reason });
  expect(await secondBody).toEqual({ status: 'fulfilled', value: 'partial-after-abort' });
  expect(transport.networkSignal()?.aborted).toBe(false);
  // The shared entry stays cached for later callers.
  expect(await (await app(url)).text()).toBe('partial-after-abort');
  expect(transport.fetch).toHaveBeenCalledOnce();
});

it('rejects a body read that starts after the caller signal already aborted', async () => {
  const transport = createStreamingTransport();
  const app = makeFetchCacheable(transport.fetch);
  const call = new AbortController();
  const response = await app('https://late-body-read.qiankun.org/', { signal: call.signal });

  call.abort();

  expect(await settle(response.text())).toEqual({ status: 'rejected', reason: call.signal.reason });
  expect(transport.networkSignal()?.aborted).toBe(false);
});

it('aborts the shared download when the last reading owner releases it', async () => {
  const transport = createStreamingTransport();
  const firstScope = new AbortController();
  const first = makeFetchCacheable(transport.fetch, { signal: firstScope.signal });
  const second = makeFetchCacheable(transport.fetch);
  const url = 'https://last-reading-owner.qiankun.org/';
  const [firstResponse, secondResponse] = await Promise.all([first(url), second(url)]);
  const firstBody = settle(firstResponse.text());
  const secondBody = settle(secondResponse.text());

  firstScope.abort();
  expect(transport.networkSignal()?.aborted).toBe(false);
  second.invalidate();

  expect(transport.networkSignal()?.aborted).toBe(true);
  expect(await firstBody).toMatchObject({ status: 'rejected' });
  expect(await secondBody).toEqual(abortRejection);
});

it('aborts an evicted download when its last reader cancels the body', async () => {
  const transport = createStreamingTransport();
  const first = makeFetchCacheable(transport.fetch);
  const second = makeFetchCacheable(transport.fetch);
  const url = 'https://cancelled-evicted-body.qiankun.org/';
  const [firstResponse, secondResponse] = await Promise.all([first(url), second(url)]);
  const reader = secondResponse.body!.getReader();
  await reader.read();

  // The unread response of `first` does not keep its owner's claim once `first` releases it.
  first.invalidate();
  expect(transport.networkSignal()?.aborted).toBe(false);
  await reader.cancel('done');

  expect(transport.networkSignal()?.aborted).toBe(true);
  expect(firstResponse.bodyUsed).toBe(false);
});

it('keeps a delivered but unread response readable when another owner unloads', async () => {
  const transport = createStreamingTransport();
  const first = makeFetchCacheable(transport.fetch);
  const second = makeFetchCacheable(transport.fetch);
  const url = 'https://unread-sibling.qiankun.org/';
  await first(url);
  const secondResponse = await second(url);

  first.invalidate();
  expect(transport.networkSignal()?.aborted).toBe(false);
  const body = settle(secondResponse.text());
  transport.close();

  expect(await body).toEqual({ status: 'fulfilled', value: 'partial' });
});

it('removes its abort listeners once the body has been read', async () => {
  const transport = createStreamingTransport();
  const app = makeFetchCacheable(transport.fetch);
  const call = new AbortController();
  const addListener = vi.spyOn(call.signal, 'addEventListener');
  const removeListener = vi.spyOn(call.signal, 'removeEventListener');
  const response = await app('https://listener-cleanup.qiankun.org/', { signal: call.signal });
  const body = response.text();
  transport.close();

  expect(await body).toBe('partial');
  const abortListeners = (spy: typeof addListener) =>
    spy.mock.calls.filter(([type]) => type === 'abort').map(([, listener]) => listener);
  expect(abortListeners(addListener)).toHaveLength(2);
  expect(abortListeners(removeListener)).toEqual(abortListeners(addListener));
  // A later abort has nothing left to cancel.
  call.abort();
  expect(transport.networkSignal()?.aborted).toBe(false);
});

it('aborts a slow request when its only owner invalidates', async () => {
  const transport = createStreamingTransport({ delayHeaders: true });
  const app = makeFetchCacheable(transport.fetch);
  const url = 'https://slow-sole-owner.qiankun.org/';
  const request = settle(app(url));

  app.invalidate();

  expect(await request).toEqual(abortRejection);
  expect(transport.networkSignal()?.aborted).toBe(true);
  // The wrapper stays usable and starts a fresh request.
  void app(url).catch(() => undefined);
  expect(transport.fetch).toHaveBeenCalledTimes(2);
});

it('re-requests updated content after an owner unloads', async () => {
  let version = 1;
  const fetch = vi.fn(async () => new Response(`v${version}`));
  const app = makeFetchCacheable(fetch);
  const url = 'https://content-update.qiankun.org/entry';

  expect(await (await app(url)).text()).toBe('v1');
  version = 2;
  expect(await (await app(url)).text()).toBe('v1');

  app.invalidate();
  expect(await (await app(url)).text()).toBe('v2');
  expect(fetch).toHaveBeenCalledTimes(2);
});

it('preserves response metadata and null bodies', async () => {
  const redirected = new Response('moved body', {
    status: 201,
    statusText: 'Created',
    headers: { 'content-type': 'text/javascript', 'x-qiankun': 'yes' },
  });
  Object.defineProperties(redirected, {
    url: { value: 'https://metadata.qiankun.org/final.js' },
    redirected: { value: true },
  });
  const fetch = vi.fn(async () => new Response(null, { status: 204 })).mockImplementationOnce(async () => redirected);
  const app = makeFetchCacheable(fetch);

  const response = await app('https://metadata.qiankun.org/start.js');
  expect(response.status).toBe(201);
  expect(response.statusText).toBe('Created');
  expect(response.ok).toBe(true);
  expect(response.headers.get('content-type')).toBe('text/javascript');
  expect(response.headers.get('x-qiankun')).toBe('yes');
  expect(response.url).toBe('https://metadata.qiankun.org/final.js');
  expect(response.redirected).toBe(true);
  expect(response.type).toBe(redirected.type);
  expect(await response.text()).toBe('moved body');

  const empty = await app('https://metadata.qiankun.org/empty');
  expect(empty.status).toBe(204);
  expect(empty.body).toBeNull();
  expect(await empty.text()).toBe('');
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
