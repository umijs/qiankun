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
import { scanDeclaredDunderNames, scanReferencedGlobals } from './identifier-scan';
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

type TextEdit = { kind: 'text'; start: number; end: number; replacement: string };
type DynamicImportEdit = {
  kind: 'dynamic-import';
  start: number;
  end: number;
  argumentStart: number;
  argumentEnd: number;
};
type Edit = TextEdit | DynamicImportEdit;
type EditNode = { edit: Edit; children: EditNode[] };

const stripTrailingComma = (source: string): string =>
  source.replace(/,((?:(?:\s+)|(?:\/\*[\s\S]*?\*\/)|(?:\/\/[^\r\n]*(?:\r?\n|$)))*)$/, '$1');

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
      edits.push({ kind: 'text', start: imp.s, end: imp.e, replacement: '__qk_import_meta' });
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
      edits.push({
        kind: 'text',
        start: imp.s,
        end: imp.e,
        replacement: buildSyntheticSpecifier(instanceKey, resolved),
      });
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
      edits.push({
        kind: 'dynamic-import',
        start: imp.ss,
        end: imp.se,
        argumentStart: imp.d + 1,
        argumentEnd: imp.se - 1,
      });
      usesImportMeta = true;
    }
  }

  // Binding sets = identifier scan ∩ (base set ∪ dunder flags), minus module-own import bindings and
  // retry exclusions (RFC §1). Single pass: the scan only admits base-set members or live-bindable
  // dunder names, so every survivor lands in exactly one group.
  // - base-set names get the immutable `const` snapshot (their values never change on the view);
  // - dunder feature flags (`__X__`, e.g. Vue's __VUE_OPTIONS_API__) are typically CREATED at runtime
  //   by one module and read bare by others — a snapshot would be stale, so they get mutable `let`
  //   bindings refreshed via __qk_track whenever the sandbox records a dunder global modification.
  //   Dunder names DECLARED in this module (webpack ESM output pattern) are pre-excluded to avoid a
  //   guaranteed redeclaration probe round each. Accepted deviation: a bare ASSIGNMENT (`__X__ = v`
  //   without a window./globalThis. prefix) writes the module-local binding only; real-world flag
  //   writers use explicit member writes.
  const declaredDunderNames = scanDeclaredDunderNames(source);
  const destructured: string[] = [];
  const liveBindings: string[] = [];
  for (const name of scanReferencedGlobals(source, globalsBaseSet)) {
    if (importBindings.has(name) || excludedNames?.has(name)) continue;
    if (globalsBaseSet.has(name)) {
      destructured.push(name);
    } else if (!declaredDunderNames.has(name)) {
      liveBindings.push(name);
    }
  }

  const needsRuntime = destructured.length > 0 || liveBindings.length > 0 || usesImportMeta;
  let header = '';
  if (needsRuntime) {
    // import bindings are initialized before the module body evaluates, so no TDZ by construction,
    // and no eval is involved, keeping the CSP requirement down to `script-src blob:` (RFC §1)
    header += `import { __qk_view, __qk_resolve, __qk_dynamic_import, __qk_track } from ${JSON.stringify(
      buildSyntheticSpecifier(instanceKey, runtimeModuleSubpath),
    )};\n`;
    if (destructured.length > 0) {
      header += `const { ${destructured.join(', ')} } = __qk_view;\n`;
    }
    if (liveBindings.length > 0) {
      header += `let { ${liveBindings.join(', ')} } = __qk_view;\n`;
      header += `__qk_track(() => ({ ${liveBindings.join(', ')} } = __qk_view));\n`;
    }
    if (usesImportMeta) {
      header += `const __qk_import_meta = { url: ${JSON.stringify(url)}, resolve: (s) => __qk_resolve(s, ${JSON.stringify(
        url,
      )}), hot: ${hotStubExpression}, env: {} };\n`;
    }
  }

  // Build a containment tree before rendering. Dynamic-import spans can contain other dynamic imports
  // or import.meta tokens; composing their children into the parent replacement keeps every nested
  // import on the runtime bridge instead of silently leaving the inner call native.
  edits.sort((a, b) => a.start - b.start || b.end - a.end);
  const editRoots: EditNode[] = [];
  const editStack: EditNode[] = [];
  edits.forEach((edit) => {
    while (editStack.length > 0 && edit.start >= editStack[editStack.length - 1].edit.end) {
      editStack.pop();
    }

    const node: EditNode = { edit, children: [] };
    if (editStack.length > 0) {
      const parent = editStack[editStack.length - 1];
      if (edit.end > parent.edit.end) {
        throw new QiankunError(`partially overlapping module rewrite spans in ${url}`);
      }
      parent.children.push(node);
    } else {
      editRoots.push(node);
    }
    editStack.push(node);
  });

  const renderRange = (start: number, end: number, nodes: EditNode[]): string => {
    const parts: string[] = [];
    let cursor = start;
    nodes.forEach(({ edit, children }) => {
      parts.push(source.slice(cursor, edit.start));
      if (edit.kind === 'text') {
        if (children.length > 0) {
          throw new QiankunError(`unexpected nested module rewrite span in ${url}`);
        }
        parts.push(edit.replacement);
      } else {
        const inner = stripTrailingComma(renderRange(edit.argumentStart, edit.argumentEnd, children));
        parts.push(`__qk_dynamic_import(${inner}, __qk_import_meta.url)`);
      }
      cursor = edit.end;
    });
    parts.push(source.slice(cursor, end));
    return parts.join('');
  };

  const injectedLines = header ? (header.match(/\n/g)?.length ?? 0) : 0;
  let code = header + renderRange(0, source.length, editRoots);
  code = remapSourceMappingUrl(code, url, injectedLines);
  code += `\n//# sourceURL=${url}\n`;

  return {
    code,
    deps: Array.from(deps),
    typedDeps: Array.from(typedDeps),
    // every injected binding name (snapshot const + live let), the redeclaration probe retry
    // must be able to exclude either kind
    destructured: [...destructured, ...liveBindings],
    injectedLines,
    needsRuntime,
  };
}
