/**
 * @author Kuitos
 * @since 2023-11-06
 */
import { LRUCache } from 'lru-cache';

type Fetch = typeof window.fetch;

const getCacheKey = (input: Parameters<Fetch>[0]): string => {
  return typeof input === 'string' ? input : 'url' in input ? input.url : input.href;
};

export const wrapFetchWithLruCache: (fetch: Fetch) => Fetch = (fetch) => {
  const lruCache = new LRUCache<string, Promise<Response>>({
    max: 50,
    ttl: 60 * 60,
  });

  const cachedFetch: Fetch = async (input, init) => {
    const fetchInput = input as Parameters<Fetch>[0];
    const cacheKey = getCacheKey(fetchInput);

    const cachedPromise = lruCache.get(cacheKey);
    if (cachedPromise) {
      const res = await cachedPromise;
      return res.clone();
    }

    const promise = fetch(fetchInput, init).catch((e) => {
      lruCache.delete(cacheKey);
      throw e;
    });
    lruCache.set(cacheKey, promise);
    return promise;
  };

  return cachedFetch;
};
