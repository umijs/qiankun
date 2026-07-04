/**
 * @author Kuitos
 * @since 2026-07-04
 * Per-module rewrite pipeline (RFC §1-§4, §15):
 * - specifier rewrite to instance-unique synthetic specifiers (import map indirection)
 * - import.meta -> __qk_import_meta
 * - dynamic import(x) -> __qk_dynamic_import(x, __qk_import_meta.url)
 * - top injection bootstrapped through the per-instance runtime module import (zero eval, no TDZ)
 * - sourceMappingURL offset merge and sourceURL append
 */
import { QiankunError } from '../reporter/QiankunError';
import { scanReferencedGlobals } from './identifier-scan';
import { parseImportBindings } from './import-bindings';
import { parseModuleSyntax } from './lexer';
import { remapSourceMappingUrl } from './source-map';

export const esmInternalPrefix = '__qk_';
export const runtimeModuleSubpath = '__runtime__';

export const buildSyntheticSpecifier = (instanceKey: string, url: string): string => `${instanceKey}/${url}`;

// unconditional noop hot context so `import.meta.hot.accept()` style calls of Vite dev modules never throw (RFC §13)
const hotStubExpression =
  '{ accept: () => {}, acceptExports: () => {}, dispose: () => {}, prune: () => {}, invalidate: () => {}, decline: () => {}, on: () => {}, off: () => {}, send: () => {}, data: {} }';

export type RewriteModuleOpts = {
  source: string;
  /** original module URL, used as import.meta.url, specifier resolution base and sourceURL */
  url: string;
  instanceKey: string;
  globalsBaseSet: ReadonlySet<string>;
  /** resolve a specifier against a base URL to the absolute (canonical) URL */
  resolveSpecifier: (specifier: string, baseUrl: string) => string;
  /** names excluded from the destructuring set, accumulated by redeclaration SyntaxError retries */
  excludedNames?: ReadonlySet<string>;
};

export type ModuleRewriteResult = {
  code: string;
  /** absolute URLs of all static JS dependencies the engine must fetch and rewrite (incl. re-exports) */
  deps: string[];
  /**
   * absolute URLs of static typed-module imports (`with { type: 'json' | 'css' | ... }`). They are not
   * fetched/rewritten; the engine maps their synthetic specifier straight to the original URL so the
   * browser loads them natively with the preserved attribute clause (RFC §14).
   */
  typedDeps: string[];
  /** the finally injected destructuring set */
  destructured: string[];
  /** lines injected before the original first line, drives the source map offset merge */
  injectedLines: number;
  /** whether the module imports the per-instance runtime module */
  needsRuntime: boolean;
};

type Edit = { start: number; end: number; replacement: string };

export function rewriteModule(opts: RewriteModuleOpts): ModuleRewriteResult {
  const { source, url, instanceKey, globalsBaseSet, resolveSpecifier, excludedNames } = opts;

  const [imports] = parseModuleSyntax(source, url);

  const edits: Edit[] = [];
  const deps = new Set<string>();
  const typedDeps = new Set<string>();
  const importBindings = new Set<string>();
  let usesImportMeta = false;

  for (const imp of imports) {
    if (imp.d === -2) {
      // import.meta: replace the whole [s, e) token span, never a naive string replace (RFC §2/§3)
      edits.push({ start: imp.s, end: imp.e, replacement: '__qk_import_meta' });
      usesImportMeta = true;
    } else if (imp.d === -1) {
      // static import or re-export, both carry their specifier span in the imports array
      const specifier = imp.n;
      if (specifier === undefined) continue;
      if (specifier.startsWith(esmInternalPrefix)) {
        // never pass through synthetic specifiers from user code, they could reach foreign runtime modules (RFC §1)
        throw new QiankunError(`synthetic specifier ${specifier} is not allowed in module ${url}`);
      }
      const resolved = resolveSpecifier(specifier, url);
      // still rewrite the specifier to the synthetic form; the `with { type }` clause that follows the
      // specifier span stays untouched, so a typed import keeps its attributes (RFC §14)
      edits.push({ start: imp.s, end: imp.e, replacement: buildSyntheticSpecifier(instanceKey, resolved) });
      if (imp.a > -1) {
        typedDeps.add(resolved);
      } else {
        deps.add(resolved);
      }

      const statement = source.slice(imp.ss, imp.se);
      if (statement.startsWith('import')) {
        parseImportBindings(statement).forEach((binding) => importBindings.add(binding));
      }
    } else if (
      imp.a > -1 &&
      source
        .slice(imp.a, imp.se - 1)
        .trim()
        .startsWith('{')
    ) {
      // typed dynamic import (`import('./x.json', { with: { type: 'json' } })`, RFC §14): leave the
      // native call untouched so the browser loads it with its attributes. An absolute specifier works
      // as-is; a relative one (resolved against the blob URL) is an accepted v1 limitation — use an
      // absolute URL. Not rewriting keeps a two-argument `import()` out of the (babel-parsed) source.
      // (a trailing comma `import('x',)` also sets imp.a > -1 but has no `{`, so it falls through below)
      continue;
    } else {
      // dynamic import: `import(x)` -> `__qk_dynamic_import(x, __qk_import_meta.url)`.
      // imp.d is the exact index of the `(` (robust against a comment between the keyword and paren);
      // rewrite the whole [ss, se) call so a trailing comma cannot produce an elided argument.
      const inner = source.slice(imp.d + 1, imp.se - 1).replace(/,\s*$/, '');
      edits.push({ start: imp.ss, end: imp.se, replacement: `__qk_dynamic_import(${inner}, __qk_import_meta.url)` });
      usesImportMeta = true;
    }
  }

  // destructuring set = identifier scan ∩ base set, minus module-own import bindings and retry exclusions (RFC §1)
  const destructured = scanReferencedGlobals(source, globalsBaseSet).filter(
    (name) => !importBindings.has(name) && !excludedNames?.has(name),
  );

  const needsRuntime = destructured.length > 0 || usesImportMeta;
  let header = '';
  if (needsRuntime) {
    // import bindings are initialized before the module body evaluates, so no TDZ by construction,
    // and no eval is involved, keeping the CSP requirement down to `script-src blob:` (RFC §1)
    header += `import { __qk_view, __qk_resolve, __qk_dynamic_import } from ${JSON.stringify(
      buildSyntheticSpecifier(instanceKey, runtimeModuleSubpath),
    )};\n`;
    if (destructured.length > 0) {
      header += `const { ${destructured.join(', ')} } = __qk_view;\n`;
    }
    if (usesImportMeta) {
      header += `const __qk_import_meta = { url: ${JSON.stringify(url)}, resolve: (s) => __qk_resolve(s, ${JSON.stringify(
        url,
      )}), hot: ${hotStubExpression}, env: {} };\n`;
    }
  }

  // assemble once in ascending order: push each untouched gap then the replacement (O(n) instead of
  // O(edits × length) re-slicing). Overlapping edits — only possible with nested dynamic import like
  // `import(import(x))`, where the outer [ss,se) already contains the inner call — drop the inner edit
  // (the inner import stays native; a rare, benign edge, never a corrupted splice).
  edits.sort((a, b) => a.start - b.start || a.end - b.end);
  const parts: string[] = [header];
  let cursor = 0;
  for (const edit of edits) {
    if (edit.start < cursor) continue;
    parts.push(source.slice(cursor, edit.start), edit.replacement);
    cursor = edit.end;
  }
  parts.push(source.slice(cursor));

  const injectedLines = header ? (header.match(/\n/g)?.length ?? 0) : 0;
  let code = parts.join('');
  code = remapSourceMappingUrl(code, url, injectedLines);
  code += `\n//# sourceURL=${url}\n`;

  return {
    code,
    deps: Array.from(deps),
    typedDeps: Array.from(typedDeps),
    destructured,
    injectedLines,
    needsRuntime,
  };
}
