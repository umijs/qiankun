/**
 * Stable identifiers: keep existing codes when moving call sites or rewording messages.
 * Every code needs a zh-CN and an English page under docs/errors plus an entry in both indexes.
 */
export const qiankunErrorCodes = [
  'lifecycle-missing',
  'entry-duplicate',
  'entry-script-failed',
  'entry-body-missing',
  'container-required',
  'container-head-missing',
  'module-hooks-conflict',
  'compartment-disposed',
  'module-descriptor-invalid',
  'module-registration-sealed',
  'module-unresolved',
  'module-specifier-reserved',
  'module-resolve-invalid',
  'module-redirect-cycle',
  'module-context-missing',
  'module-rewrite-invalid',
  'app-unloaded',
  'app-teardown-failed',
  'sandbox-mount-conflict',
  'app-not-mounted',
  'app-already-mounted',
  'load-timeout',
  'load-timeout-invalid',
] as const;

export type QiankunErrorCode = (typeof qiankunErrorCodes)[number];

export class QiankunError extends Error {
  readonly code: QiankunErrorCode;
  /** The failure this error stems from, set only when there is one. */
  declare readonly cause?: unknown;

  constructor(message: string, code: QiankunErrorCode, options?: { cause?: unknown }) {
    super(`[qiankun]: ${message}\nSee https://www.qiankunjs.com/zh-CN/errors/${code}`);
    this.code = code;
    // Defined like the native `cause` option (non-enumerable); the ES2018 lib types lack it.
    if (options && 'cause' in options) {
      Object.defineProperty(this, 'cause', { value: options.cause, writable: true, configurable: true });
    }
  }
}
