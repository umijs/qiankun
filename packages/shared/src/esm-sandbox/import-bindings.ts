/**
 * @author Kuitos
 * @since 2026-07-04
 */

const identifierLike = /^[A-Za-z_$]/;

/**
 * Extract the local binding names introduced by a static import statement, so they can be excluded
 * from the injected destructuring set (a same-named `const` would be a duplicate lexical declaration).
 *
 * Re-export statements (`export ... from '...'`) and side-effect imports introduce no local bindings.
 */
export function parseImportBindings(statement: string): string[] {
  // Match strings and comments FIRST so their contents are captured as whole tokens and dropped:
  // a global name inside an in-statement comment (`import { x } /* window */ from '...'`) must not be
  // mistaken for a binding and wrongly excluded from the destructuring set (that would be an escape).
  // Strings come before the `//` comment alt so a `//` inside a specifier URL is not read as a comment.
  const tokens = (
    statement.match(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\/\*[\s\S]*?\*\/|\/\/[^\n]*|[A-Za-z_$][\w$]*|[{}*,]/g) ?? []
  ).filter((token) => !token.startsWith('/*') && !token.startsWith('//'));
  if (tokens[0] !== 'import') {
    return [];
  }

  const bindings: string[] = [];
  let inBraces = false;
  let entryLastIdentifier: string | undefined;

  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i];

    if (!inBraces) {
      if (token === 'from') break;
      // side-effect import: `import './foo.js'`
      if (token.startsWith('"') || token.startsWith("'")) break;
      if (token === '{') {
        inBraces = true;
        entryLastIdentifier = undefined;
        continue;
      }
      if (token === '*' || token === ',') continue;
      if (token === 'as') {
        // namespace import: `* as ns`
        const next = tokens[++i];
        if (next && identifierLike.test(next)) {
          bindings.push(next);
        }
        continue;
      }
      if (identifierLike.test(token)) {
        // default import binding
        bindings.push(token);
      }
    } else {
      if (token === ',' || token === '}') {
        if (entryLastIdentifier) {
          bindings.push(entryLastIdentifier);
        }
        entryLastIdentifier = undefined;
        if (token === '}') {
          inBraces = false;
        }
        continue;
      }
      // for `orig as local` the local wins as it appears last, string import names are skipped naturally
      if (identifierLike.test(token)) {
        entryLastIdentifier = token;
      }
    }
  }

  return bindings;
}
