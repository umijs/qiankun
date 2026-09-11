export class QiankunError extends Error {
  constructor(message: string) {
    super(`[qiankun]: ${message}`);
  }
}

/** Loading exceeded its budget after acquiring the application's container. */
export class LoadAppTimeoutError extends QiankunError {
  constructor(
    public readonly appName: string,
    public readonly timeout: number,
    public readonly elapsed: number,
  ) {
    super(`App ${appName} loading timed out after ${Math.round(elapsed)} ms (timeout: ${timeout} ms)`);
    this.name = 'LoadAppTimeoutError';
  }
}
