/**
 * @author Kuitos
 * @since 2024-03-05
 */

import { type Fetch } from './utils';

export const makeFetchRetryable: (fetch: Fetch, retryTimes?: number) => Fetch = (fetch, retryTimes = 1) => {
  let retryCount = 0;

  const fetchWithRetryable: Fetch = async (input, init) => {
    try {
      return await fetch(input, init);
    } catch (e) {
      if (retryCount < retryTimes) {
        retryCount++;

        if (process.env.NODE_ENV === 'development') {
          console.debug(
            `[qiankun] fetch retrying --> url: ${
              typeof input === 'string' ? input : 'url' in input ? input.url : input.href
            } , time: ${retryCount}`,
          );
        }

        return await fetchWithRetryable(input, init);
      }

      throw e;
    }
  };

  return fetchWithRetryable;
};
