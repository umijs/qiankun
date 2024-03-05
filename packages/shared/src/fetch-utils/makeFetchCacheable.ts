/**
 * @author Kuitos
 * @since 2023-11-06
 * wrap fetch with lru cache
 */
import { once } from 'lodash';
import { LRUCache } from './miniLruCache';
import { type Fetch, isValidaResponse } from './utils';

const getCacheKey = (input: Parameters<Fetch>[0]): string => {
  return typeof input === 'string' ? input : 'url' in input ? input.url : input.href;
};

const getGlobalCache = once(() => {
  return new LRUCache<string, Promise<Response>>(50);
});

export const makeFetchCacheable: (fetch: Fetch) => Fetch = (fetch) => {
  const lruCache = getGlobalCache();

  const cachedFetch: Fetch = (input, init) => {
    const fetchInput = input;
    const cacheKey = getCacheKey(fetchInput);
    const wrapFetchPromise = async (promise: Promise<Response>): Promise<Response> => {
      try {
        const res = await promise;

        const { status } = res;
        if (!isValidaResponse(status)) {
          lruCache.delete(cacheKey);
        }

        // must clone the response as one response body can only be read once as a stream
        return res.clone();
      } catch (e) {
        lruCache.delete(cacheKey);
        throw e;
      }
    };

    const cachedFetchPromise = lruCache.get(cacheKey);
    if (cachedFetchPromise) {
      return wrapFetchPromise(cachedFetchPromise);
    }

    const fetchPromise = fetch(fetchInput, init);
    lruCache.set(cacheKey, fetchPromise);

    return wrapFetchPromise(fetchPromise);
  };

  return cachedFetch;
};
