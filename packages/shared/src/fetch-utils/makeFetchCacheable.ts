/**
 * @author Kuitos
 * @since 2023-11-06
 * wrap fetch with lru cache
 */
import { once } from 'lodash';
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

type CacheEntry = {
  key: string;
  promise: Promise<Response>;
  controller: AbortController;
  owners: Set<symbol>;
};

export type CacheableFetch = Fetch & { invalidate(): void };

const getGlobalCache = once(() => new LRUCache<string, CacheEntry>(50));

/** A signal belongs to this wrapper's lifetime, independently of other cache users. */
export const makeFetchCacheable = (fetch: Fetch, options: { signal?: AbortSignal } = {}): CacheableFetch => {
  const lruCache = getGlobalCache();
  const owner = Symbol('fetch-cache-owner');
  const touchedEntries = new Set<CacheEntry>();

  const evict = (entry: CacheEntry): void => {
    if (lruCache.get(entry.key) === entry) lruCache.delete(entry.key);
  };

  const invalidate = (): void => {
    touchedEntries.forEach((entry) => {
      evict(entry);
      entry.owners.delete(owner);
      // A shared download (including its response body) remains live until its
      // final scope is released. Disposing one app must not abort another app.
      if (entry.owners.size === 0) entry.controller.abort();
    });
    touchedEntries.clear();
  };
  options.signal?.addEventListener('abort', invalidate, { once: true });

  const cachedFetch: Fetch = async (input, init) => {
    const requestSignal =
      init?.signal !== undefined ? init.signal : typeof input !== 'string' && 'signal' in input ? input.signal : null;
    const signals = [options.signal, requestSignal].filter((signal): signal is AbortSignal => !!signal);
    signals.forEach((signal) => signal.throwIfAborted());

    const cacheKey = getCacheKey(input, init);
    let entry = lruCache.get(cacheKey);
    if (!entry) {
      const controller = new AbortController();
      const promise = fetch(input, { ...init, signal: controller.signal });
      entry = { key: cacheKey, promise, controller, owners: new Set() };
      lruCache.set(cacheKey, entry);
      const createdEntry = entry;
      // Only network failure invalidates the shared entry; a single caller's
      // cancellation below does not poison a request another scope still owns.
      void promise.then(
        (response) => {
          if (!isValidResponse(response.status)) evict(createdEntry);
        },
        () => evict(createdEntry),
      );
    }
    entry.owners.add(owner);
    touchedEntries.add(entry);
    if (options.signal?.aborted) invalidate();

    const cleanups: Array<() => void> = [];
    try {
      const response = await new Promise<Response>((resolve, reject) => {
        signals.forEach((signal) => {
          const onAbort = (): void => {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- Preserve the caller's AbortSignal reason, as native fetch does.
            reject(signal.reason);
          };
          signal.addEventListener('abort', onAbort, { once: true });
          cleanups.push(() => signal.removeEventListener('abort', onAbort));
          if (signal.aborted) onAbort();
        });
        void entry.promise.then(resolve, reject);
      });
      // One response body can only be consumed once; each caller gets its own stream.
      return response.clone();
    } finally {
      cleanups.forEach((cleanup) => cleanup());
    }
  };

  return Object.assign(cachedFetch, { invalidate });
};
