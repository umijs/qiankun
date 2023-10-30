/**
 * @author Kuitos
 * @since 2023-04-26
 */
import { noop, once } from 'lodash';

// eslint-disable-next-line @typescript-eslint/unbound-method
export const { create, defineProperty, getOwnPropertyDescriptor, getOwnPropertyNames, freeze, keys } = Object;
export const hasOwnProperty = (caller: unknown, p: PropertyKey) => Object.prototype.hasOwnProperty.call(caller, p);

export class Deferred<T> {
  promise: Promise<T>;

  status: 'pending' | 'fulfilled' | 'rejected' = 'pending';

  resolve!: (value: T | PromiseLike<T>) => void;

  reject!: (reason?: unknown) => void;

  constructor(resolvedCb?: (value: T | PromiseLike<T>) => void, rejectedCb?: (reason?: unknown) => void) {
    const onceResolvedCb = resolvedCb ? once(resolvedCb) : noop;
    const onceRejectCb = rejectedCb ? once(rejectedCb) : noop;

    this.promise = new Promise((resolve, reject) => {
      this.resolve = (value: T | PromiseLike<T>) => {
        this.status = 'fulfilled';
        resolve(value);
        onceResolvedCb(value);
      };
      this.reject = (reason?: unknown) => {
        this.status = 'rejected';
        reject(reason);
        onceRejectCb(reason);
      };
    });
  }
}

export function getEntireUrl(uri: string, baseURI: string): string {
  const publicPath = new URL(baseURI, window.location.href);
  const entireUrl = new URL(uri, publicPath.toString());
  return entireUrl.toString();
}
