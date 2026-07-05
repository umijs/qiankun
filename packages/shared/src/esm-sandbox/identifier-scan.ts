/**
 * @author Kuitos
 * @since 2026-07-04
 */

/**
 * Single-pass identifier token scan over the raw module source, intersected with the globals base set.
 *
 * Superset-safe by design: any real bare global reference is guaranteed to appear as a full token in
 * the source text (no misses, a miss would mean a sandbox escape), while false hits inside strings or
 * comments only add an unused name to the destructuring set (harmless). Therefore no lexical analysis
 * of string/comment/template boundaries is needed here.
 *
 * Besides the base set, dunder-style identifiers (`__X__`) are also collected: it is the bundler
 * feature-flag idiom (e.g. Vue's `__VUE_OPTIONS_API__`) where modules create such globals at runtime
 * and read them back as bare identifiers — invisible to any static whitelist. They are bound live
 * (see rewriteModule); a false positive that collides with a module-own declaration is healed by the
 * redeclaration probe retry, exactly like base-set collisions.
 *
 * Known boundary: runtime-created globals with NON-dunder names read as bare identifiers are not
 * covered — such reads resolve against the real global scope, not the sandbox view.
 */
export function scanReferencedGlobals(source: string, globalsBaseSet: ReadonlySet<string>): string[] {
  const identifierPattern = /[A-Za-z_$][\w$]*/g;
  const hits = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = identifierPattern.exec(source))) {
    const token = match[0];
    if (globalsBaseSet.has(token) || isLiveBindableDunderName(token)) {
      hits.add(token);
    }
  }
  return Array.from(hits);
}

const dunderNamePattern = /^__[\w$]+__$/;
// Object.prototype legacy accessors and internal names must never become bindings
const excludedDunderNames = new Set([
  '__proto__',
  '__defineGetter__',
  '__defineSetter__',
  '__lookupGetter__',
  '__lookupSetter__',
]);

/** dunder identifiers (`__X__`) that qualify for the live global binding injection */
export function isLiveBindableDunderName(token: string): boolean {
  return dunderNamePattern.test(token) && !token.startsWith('__qk_') && !excludedDunderNames.has(token);
}

const dunderDeclarationPattern = /\b(?:var|let|const|class|function)\s*\*?\s+(__[\w$]+__)\b/g;

/**
 * Dunder names DECLARED somewhere in the module source (webpack ESM output declares
 * __webpack_exports__/__WEBPACK_DEFAULT_EXPORT__ etc. at module top level). Binding those live
 * would guarantee one redeclaration probe round per name, so the rewriter pre-excludes them.
 * Superset caveat: a name declared only in a nested scope but ALSO read bare at top level loses
 * its live binding — rare enough that the cheap regex wins; the probe retry stays as the safety
 * net for any collision this scan misses.
 */
export function scanDeclaredDunderNames(source: string): Set<string> {
  const declared = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = dunderDeclarationPattern.exec(source))) {
    declared.add(match[1]);
  }
  return declared;
}
