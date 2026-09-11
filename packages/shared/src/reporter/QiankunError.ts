/** Stable identifiers: keep existing codes when moving call sites or rewording messages. */
export type QiankunErrorCode =
  | 'custom-error'
  | 'lifecycle-missing'
  | 'entry-duplicate'
  | 'entry-script-failed'
  | 'entry-body-missing'
  | 'container-required'
  | 'container-head-missing'
  | 'module-hooks-conflict'
  | 'compartment-disposed'
  | 'module-descriptor-invalid'
  | 'module-registration-sealed'
  | 'module-unresolved'
  | 'module-specifier-reserved'
  | 'module-resolve-invalid'
  | 'module-redirect-cycle'
  | 'module-context-missing'
  | 'module-rewrite-invalid';

export class QiankunError extends Error {
  readonly code: QiankunErrorCode;

  constructor(message: string, code: QiankunErrorCode = 'custom-error') {
    super(`[qiankun]: ${message}\nSee https://www.qiankunjs.com/zh-CN/errors/${code}`);
    this.code = code;
  }
}
