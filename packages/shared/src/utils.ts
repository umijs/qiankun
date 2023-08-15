/**
 * @author Kuitos
 * @since 2023-04-26
 */

// eslint-disable-next-line @typescript-eslint/unbound-method
export const { create, defineProperty, getOwnPropertyDescriptor, getOwnPropertyNames, freeze, keys } = Object;
export const hasOwnProperty = (caller: unknown, p: PropertyKey) => Object.prototype.hasOwnProperty.call(caller, p);

export class Deferred<T> {
  promise: Promise<T>;

  resolve!: (value: T | PromiseLike<T>) => void;

  reject!: (reason?: unknown) => void;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

export function getEntireUrl(uri: string, baseURI: string): string {
  const publicPath = new URL(baseURI, window.location.href);
  const entireUrl = new URL(uri, publicPath.toString());
  return entireUrl.toString();
}
