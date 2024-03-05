/**
 * @author Kuitos
 * @since 2024-03-05
 * wrap fetch to throw error when response status is not 200~400
 */

import { type Fetch, isValidaResponse } from './utils';

export const makeFetchThrowable: (fetch: Fetch) => Fetch = (fetch) => {
  return async (url, init) => {
    const res = await fetch(url, init);
    if (!isValidaResponse(res.status)) {
      throw new Error(
        `[RESPONSE_ERROR_AS_STATUS_INVALID] ${res.status} ${res.statusText} ${
          typeof url === 'string' ? url : 'url' in url ? url.url : url.href
        } ${JSON.stringify(init)}`,
      );
    }

    return res;
  };
};
