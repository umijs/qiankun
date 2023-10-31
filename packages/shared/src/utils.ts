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
    this.promise = new Promise((resolve, reject) => {
      this.resolve = (value: T | PromiseLike<T>) => {
        this.#status = 'fulfilled';
        resolve(value);
      };
      this.reject = (reason?: unknown) => {
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
  } catch {
    // do nothing
  }
}

export function getEntireUrl(uri: string, baseURI: string): string {
  const publicPath = new URL(baseURI, window.location.href);
  const entireUrl = new URL(uri, publicPath.toString());
  return entireUrl.toString();
}
