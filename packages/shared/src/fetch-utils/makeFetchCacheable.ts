/**
 * @author Kuitos
 * @since 2023-11-06
 * wrap fetch with lru cache
 */
import { noop, once } from 'lodash';
import { LRUCache } from './miniLruCache';
import { type Fetch, isValidResponse } from './utils';

const getCanonicalRequestUrl = (input: Parameters<Fetch>[0]): string => {
  if (typeof input !== 'string') {
    return 'url' in input ? input.url : input.href;
  }

  try {
    return new Request(input).url;
  } catch {
    // Preserve fetch's own handling for inputs that cannot be resolved in the
    // current environment (for example, a relative URL without a base URL).
    return input;
  }
};

const getEffectiveCredentials = (input: Parameters<Fetch>[0], init?: Parameters<Fetch>[1]): RequestCredentials => {
  if (init?.credentials !== undefined) {
    return init.credentials;
  }

  return typeof input !== 'string' && 'credentials' in input ? input.credentials : 'same-origin';
};

const getCacheKey = (input: Parameters<Fetch>[0], init?: Parameters<Fetch>[1]): string => {
  return JSON.stringify([getCanonicalRequestUrl(input), getEffectiveCredentials(input, init)]);
};

/** Ownership metadata of one download, kept apart from the response so tracking it never retains a body. */
type CacheLease = {
  key: string;
  controller: AbortController;
  owners: Set<symbol>;
};

type CacheEntry = {
  promise: Promise<Response>;
  lease: CacheLease;
};

type CachePool = LRUCache<string, CacheEntry>;

export type CacheableFetch = Fetch & { invalidate(): void };

const getGlobalCache = once((): CachePool => new LRUCache<string, CacheEntry>(50));

/** A signal belongs to this wrapper's lifetime, independently of other cache users. */
export const makeFetchCacheable = (fetch: Fetch, options: { signal?: AbortSignal } = {}): CacheableFetch => {
  const pool = getGlobalCache();
  const owner = Symbol('fetch-cache-owner');
  // Only keys are remembered, so a finished response stays collectable once the LRU drops it.
  const touchedKeys = new Set<string>();
  // Leases this wrapper is still waiting on or reading a body from, with the number of such uses.
  const inFlight = new Map<CacheLease, number>();
  // Aborted by every invalidation, cancelling whatever this wrapper still has in flight.
  let epoch = new AbortController();

  const isCached = (lease: CacheLease): boolean => pool.get(lease.key)?.lease === lease;

  const release = (lease: CacheLease): void => {
    lease.owners.delete(owner);
    // A shared download (including its response body) remains live until its
    // final owner releases it. Disposing one app must not abort another app.
    if (lease.owners.size === 0) lease.controller.abort();
  };

  /** Once nothing can look the lease up anymore, the owner's last finished use is its release. */
  const releaseIfEvicted = (lease: CacheLease): void => {
    if (!inFlight.has(lease) && !isCached(lease)) release(lease);
  };

  /**
   * Marks one use of `lease` as in flight until the returned settle function is called. An abort of
   * any signal settles the use first and then reports the reason to `onAbort`.
   */
  const hold = (
    lease: CacheLease,
    signals: Array<AbortSignal | null>,
    onAbort: (reason: unknown) => void,
  ): (() => boolean) => {
    const observed = signals.filter((signal): signal is AbortSignal => !!signal);
    let held = true;
    const settle = (): boolean => {
      if (!held) return false;
      held = false;
      observed.forEach((signal) => signal.removeEventListener('abort', abort));
      const uses = (inFlight.get(lease) ?? 1) - 1;
      if (uses > 0) inFlight.set(lease, uses);
      else inFlight.delete(lease);
      return true;
    };
    const abort = (): void => {
      const reason: unknown = observed.find((signal) => signal.aborted)?.reason;
      if (settle()) onAbort(reason);
    };

    inFlight.set(lease, (inFlight.get(lease) ?? 0) + 1);
    observed.forEach((signal) => signal.addEventListener('abort', abort, { once: true }));
    if (observed.some((signal) => signal.aborted)) abort();
    return settle;
  };

  /**
   * One response body can only be consumed once, so each caller reads its own clone. The clone is
   * wrapped to give the caller the cancellation a raw fetch would: aborting its signal errors only
   * its body, while other callers keep reading the shared download.
   */
  const deliver = (response: Response, lease: CacheLease, requestSignal: AbortSignal | null): Response => {
    const branch = response.clone();
    const source = branch.body;
    if (!source) return branch;

    const signals = [epoch.signal, requestSignal];
    let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
    let settle: () => boolean = () => true;
    let ended = false;
    const end = (): boolean => {
      if (ended) return false;
      ended = true;
      settle();
      releaseIfEvicted(lease);
      return true;
    };

    const body = new ReadableStream<Uint8Array>(
      {
        pull: async (controller) => {
          if (!reader) {
            const branchReader = source.getReader();
            reader = branchReader;
            // The use starts with the first read: an unread response is never kept alive by this wrapper.
            settle = hold(lease, signals, (reason) => {
              if (!end()) return;
              controller.error(reason);
              branchReader.cancel(reason).catch(noop);
            });
          }
          try {
            const { done, value } = await reader.read();
            if (ended) return;
            if (done) {
              end();
              controller.close();
            } else {
              controller.enqueue(value);
            }
          } catch (error) {
            if (end()) controller.error(error);
          }
        },
        cancel: (reason) => {
          if (!end()) return undefined;
          return reader ? reader.cancel(reason) : source.cancel(reason);
        },
      },
      // Pull only on demand, so the first read (not the delivery) marks the body as in flight.
      { highWaterMark: 0 },
    );

    const consumerResponse = new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
    // The Response constructor cannot set these network-derived fields; keep them as fetch reported.
    Object.defineProperties(consumerResponse, {
      url: { value: response.url },
      redirected: { value: response.redirected },
      type: { value: response.type },
    });
    return consumerResponse;
  };

  const invalidate = (): void => {
    const released = new Set(inFlight.keys());
    touchedKeys.forEach((key) => {
      const entry = pool.get(key);
      // Evict by identity: the key may since hold a newer generation this wrapper never touched.
      if (entry?.lease.owners.has(owner)) {
        pool.delete(key);
        released.add(entry.lease);
      }
    });
    touchedKeys.clear();

    const expired = epoch;
    epoch = new AbortController();
    expired.abort(
      options.signal?.aborted
        ? options.signal.reason
        : new DOMException('The fetch cache owner has been invalidated', 'AbortError'),
    );
    released.forEach(release);
  };
  options.signal?.addEventListener('abort', invalidate, { once: true });

  const cachedFetch: Fetch = async (input, init) => {
    const requestSignal =
      init?.signal !== undefined ? init.signal : typeof input !== 'string' && 'signal' in input ? input.signal : null;
    options.signal?.throwIfAborted();
    requestSignal?.throwIfAborted();

    const cacheKey = getCacheKey(input, init);
    let entry = pool.get(cacheKey);
    if (!entry) {
      const controller = new AbortController();
      const promise = fetch(input, { ...init, signal: controller.signal });
      const lease: CacheLease = { key: cacheKey, controller, owners: new Set() };
      entry = { promise, lease };
      pool.set(cacheKey, entry);
      const evict = (): void => {
        if (isCached(lease)) pool.delete(cacheKey);
      };
      // Only network failure invalidates the shared entry; a single caller's
      // cancellation below does not poison a request another scope still owns.
      void promise.then((response) => {
        if (!isValidResponse(response.status)) evict();
      }, evict);
    }
    const { promise, lease } = entry;
    lease.owners.add(owner);
    touchedKeys.add(cacheKey);

    return new Promise<Response>((resolve, reject) => {
      const settle = hold(lease, [epoch.signal, requestSignal], (reason) => {
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- Preserve the caller's AbortSignal reason, as native fetch does.
        reject(reason);
        releaseIfEvicted(lease);
      });
      // The lifetime may have ended while the request was being created.
      if (options.signal?.aborted) invalidate();
      promise.then(
        (response) => {
          if (settle()) resolve(deliver(response, lease, requestSignal));
        },
        (error: unknown) => {
          // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- Forward the transport's rejection unchanged.
          if (settle()) reject(error);
        },
      );
    });
  };

  return Object.assign(cachedFetch, { invalidate });
};
