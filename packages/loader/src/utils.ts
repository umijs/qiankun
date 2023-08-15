/**
 * @author Kuitos
 * @since 2023-04-26
 */

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
