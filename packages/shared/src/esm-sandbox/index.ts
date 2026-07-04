/**
 * @author Kuitos
 * @since 2026-07-04
 */
export { EsmSandboxEngine, type EsmSandboxEngineOpts } from './engine';
export { prepareEsmLexer } from './lexer';
export { injectImportMapEntries, resetImportMapRegistry } from './import-map-registry';
export { registerEsmRealm, unregisterEsmRealm, type EsmRealm, type RealmHandle } from './realm-registry';
export { rewriteModule, esmInternalPrefix, buildSyntheticSpecifier, runtimeModuleSubpath } from './rewrite';
export type { RewriteModuleOpts, ModuleRewriteResult } from './rewrite';
export { scanReferencedGlobals } from './identifier-scan';
