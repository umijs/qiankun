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
 */
export function scanReferencedGlobals(source: string, globalsBaseSet: ReadonlySet<string>): string[] {
  const identifierPattern = /[A-Za-z_$][\w$]*/g;
  const hits = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = identifierPattern.exec(source))) {
    const token = match[0];
    if (globalsBaseSet.has(token)) {
      hits.add(token);
    }
  }
  return Array.from(hits);
}
