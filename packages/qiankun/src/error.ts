import { QiankunError, type QiankunErrorCode } from '@qiankunjs/shared';

// Re-export the shared constructor so loader, sandbox, and qiankun errors share one identity.
export { QiankunError, type QiankunErrorCode };

/** Loading exceeded its budget after acquiring the application's container. */
export class LoadAppTimeoutError extends QiankunError {
  constructor(
    public readonly appName: string,
    public readonly timeout: number,
    public readonly elapsed: number,
  ) {
    super(`App ${appName} loading timed out after ${Math.round(elapsed)} ms (timeout: ${timeout} ms)`, 'load-timeout');
    this.name = 'LoadAppTimeoutError';
  }
}
