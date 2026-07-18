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

const getGlobalCache = once(() => {
  return new LRUCache<string, Promise<Response>>(50);
});

export const makeFetchCacheable: (fetch: Fetch) => Fetch = (fetch) => {
  const lruCache = getGlobalCache();

  const cachedFetch: Fetch = (input, init) => {
    const fetchInput = input;
    const cacheKey = getCacheKey(fetchInput, init);
    const wrapFetchPromise = async (promise: Promise<Response>): Promise<Response> => {
      try {
        const res = await promise;

        const { status } = res;
        if (!isValidResponse(status)) {
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
