/**
 * @author Kuitos
 * @since 2026-07-04
 */
export { EsmSandboxEngine, type EsmSandboxEngineOpts } from './engine';
export { prepareEsmLexer } from './lexer';
export { moduleSourceInstanceKeyPlaceholder, precompileModuleSource } from './precompile';
export type { PrecompileModuleSourceOpts } from './precompile';
export { injectImportMapEntries, resetImportMapRegistry } from './import-map-registry';
export { registerEsmInstance, unregisterEsmInstance, type EsmInstance, type InstanceHandle } from './instance-registry';
export { rewriteModule, esmInternalPrefix, buildSyntheticSpecifier, runtimeModuleSubpath } from './rewrite';
export type { RewriteModuleOpts, ModuleRewriteResult } from './rewrite';
export { scanReferencedGlobals } from './identifier-scan';
export type {
  CompartmentModuleFacade,
  DocumentModule,
  ImportHook,
  ModuleDescriptor,
  ModuleNamespace,
  Modules,
  ModuleSource,
  ResolveHook,
} from './types';
