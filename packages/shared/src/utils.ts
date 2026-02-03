/**
 * @author Kuitos
 * @since 2023-04-26
 */

// eslint-disable-next-line @typescript-eslint/unbound-method
export const { create, defineProperty, getOwnPropertyDescriptor, getOwnPropertyNames, freeze, keys } = Object;
export const hasOwnProperty = (caller: unknown, p: PropertyKey) => Object.prototype.hasOwnProperty.call(caller, p);

export class Deferred<T> {
  promise: Promise<T>;

  #status: 'pending' | 'fulfilled' | 'rejected' = 'pending';

  resolve!: (value: T | PromiseLike<T>) => void;

  reject!: (reason?: unknown) => void;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = (value) => {
        this.#status = 'fulfilled';
        resolve(value);
      };
      this.reject = (reason) => {
        this.#status = 'rejected';
        reject(reason);
      };
    });
  }

  isSettled(): boolean {
    return this.#status !== 'pending';
  }
}

export async function waitUntilSettled(promise: Promise<void>): Promise<void> {
  try {
    await promise;
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('waitUntilSettled error', e);
    }
  }
}

export function resolveUrl(uri: string, baseURI: string): string {
  // should not handle an entire url especially protocol-relative url, e.g. //example.com/foo.js
  // otherwise it may occur that the user previously stored the script src as //example.com/foo.js,
  // resulting in a conversion to http://example.com/foo.js which does not match the original stored key.
  if (uri.startsWith('//') || uri.startsWith('http://') || uri.startsWith('https://')) {
    return uri;
  }

  const publicPath = new URL(baseURI, window.location.href);
  const entireUrl = new URL(uri, publicPath);
  return entireUrl.toString();
}

/**
 * Check if the running environment support qiankun 3.0
 *
 */
export function isRuntimeCompatible(): boolean {
  return (
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    typeof Proxy === 'function' && typeof TransformStream === 'function' && typeof URL?.createObjectURL === 'function'
  );
}
