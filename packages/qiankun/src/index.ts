export * from './apis/loadMicroApp';
export * from './apis/registerMicroApps';
export * from './apis/isRuntimeCompatible';
export * from './apis/prefetch';
export * from './apis/effects';
export * from './apis/errorHandler';
export { QiankunError, LoadAppTimeoutError, type QiankunErrorCode } from './error';
export type * from './types';
export { precompileModuleSource } from '@qiankunjs/sandbox';
export { navigateToUrl } from '@qiankunjs/single-spa';

export {
  prepareClassicApps,
  type ClassicPreparation,
  type ClassicPreparationOptions,
  type ClassicPreparationResult,
} from './apis/prepareClassicApps';
