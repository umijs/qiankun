/**
 * Build-time-friendly ModuleSource linking with an instance-neutral key.
 */
import { rewriteModule } from './rewrite';
import { parseModuleSyntax } from './lexer';
import type { ModuleSource, ResolveHook } from './types';

/** Reserved key embedded in portable ModuleSource code until an engine instance consumes it. */
export const moduleSourceInstanceKeyPlaceholder = '__qk_precompiled_module__';

export type PrecompileModuleSourceOpts = {
  source: string;
  /** Canonical module URL used for dependency resolution, import.meta.url and sourceURL. */
  url: string;
  /** Globals that this artifact must read through the compartment view. */
  globalsBaseSet: Iterable<string>;
  /** Resolve every static dependency to the canonical key expected by importHook/modules. */
  resolveHook: ResolveHook;
};

/**
 * Pre-link a module without binding it to one Compartment instance.
 *
 * The returned object is safe to cache or serialize. EsmSandboxEngine relocates only
 * the reserved instance-key prefixes on generated static import specifiers when it
 * consumes the artifact; it does not fetch or run the rewrite pipeline again unless
 * collision probing requires a rebuild from the retained original source.
 */
export function precompileModuleSource(opts: PrecompileModuleSourceOpts): ModuleSource {
  const { source, url, globalsBaseSet, resolveHook } = opts;
  const { code, deps, typedDeps, destructured } = rewriteModule({
    source,
    url,
    instanceKey: moduleSourceInstanceKeyPlaceholder,
    globalsBaseSet: new Set(globalsBaseSet),
    resolveSpecifier: resolveHook,
  });

  return {
    instanceKey: moduleSourceInstanceKeyPlaceholder,
    source,
    code,
    deps,
    typedDeps,
    destructured,
    importMetaUrl: url,
  };
}

/**
 * Materialize a linked ModuleSource for one engine instance without treating
 * its placeholder as an unstructured text sentinel.
 *
 * Every instance-bearing reference emitted by rewriteModule is the leading
 * prefix of a static import specifier. Parsing those specifiers lets us edit
 * only that prefix: placeholder-looking user strings, comments, source URLs,
 * import.meta URLs, and canonical dependency URLs remain byte-for-byte intact.
 *
 * @internal
 */
export function relocateModuleSourceInstanceKey(source: ModuleSource, targetInstanceKey: string): ModuleSource {
  const materialized: ModuleSource = {
    instanceKey: targetInstanceKey,
    source: source.source,
    code: source.code,
    deps: [...source.deps],
    typedDeps: [...source.typedDeps],
    destructured: [...source.destructured],
    importMetaUrl: source.importMetaUrl,
  };
  if (source.instanceKey === targetInstanceKey) return materialized;

  const sourcePrefix = `${source.instanceKey}/`;
  const targetPrefix = `${targetInstanceKey}/`;
  const [imports] = parseModuleSyntax(source.code, source.importMetaUrl);
  const relocationOffsets = imports
    .filter((entry) => entry.d === -1 && source.code.slice(entry.s, entry.s + sourcePrefix.length) === sourcePrefix)
    .map((entry) => entry.s)
    .sort((a, b) => b - a);

  for (const offset of relocationOffsets) {
    materialized.code =
      materialized.code.slice(0, offset) + targetPrefix + materialized.code.slice(offset + sourcePrefix.length);
  }

  return materialized;
}
