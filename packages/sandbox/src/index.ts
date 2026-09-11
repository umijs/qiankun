export * from './core/sandbox';
export * from './core/compartment';
export * from './consts';
// For qiankun's internal use only; not part of the public API contract.
export { isNativePassthroughNode, markNodeForNativePassthrough } from './core/nativePassthrough';
export { esmDestructurableGlobals } from './core/esm-globals';
export { moduleSourceInstanceKeyPlaceholder, precompileModuleSource } from '@qiankunjs/shared';
export type { Free, IsolationPlugin, IsolationPluginConfig, IsolationPluginContext, Rebuild } from './patchers';
export type {
  CompartmentModuleFacade,
  DocumentModule,
  ImportHook,
  ModuleDescriptor,
  ModuleNamespace,
  Modules,
  ModuleSource,
  PrecompileModuleSourceOpts,
  ResolveHook,
} from '@qiankunjs/shared';
