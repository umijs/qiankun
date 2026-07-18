export * from './core/sandbox';
export * from './core/compartment';
export * from './consts';
export { esmDestructurableGlobals } from './core/esm-globals';
export { moduleSourceInstanceKeyPlaceholder, precompileModuleSource } from '@qiankunjs/shared';
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
