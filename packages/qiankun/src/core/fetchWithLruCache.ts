/**
 * @author Kuitos
 * @since 2023-11-06
 */

export const wrapFetchWithLruCache: (fetch: typeof window.fetch) => typeof window.fetch = (fetch) => {
  return fetch;
};
