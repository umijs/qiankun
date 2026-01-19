/**
 * @author Kuitos
 * @since 2024-03-05
 * wrap fetch to throw error when response status is not 200~400
 */

import { type Fetch, isValidResponse } from './utils';

export const makeFetchThrowable: (fetch: Fetch) => Fetch = (fetch) => {
  return async (url, init) => {
    const urlString = typeof url === 'string' ? url : 'url' in url ? url.url : url.href;

    let res: Response;
    try {
      res = await fetch(url, init);
    } catch (e) {
      // The error message of fetch failed is usually "Failed to fetch"
      // We need to prepend the url to the error message to make it easier to debug
      // e.g. "https://example.com/script.js Failed to fetch"
      try {
        if (e instanceof Error && !e.message.includes(urlString)) {
          e.message = `${urlString} ${e.message}`;
        }
      } catch (_) {
        // e.message may be readonly
      }
      throw e;
    }

    if (!isValidResponse(res.status)) {
      throw new Error(`${urlString} [RESPONSE_ERROR_AS_STATUS_INVALID] ${res.status} ${res.statusText}`);
    }

    return res;
  };
};
