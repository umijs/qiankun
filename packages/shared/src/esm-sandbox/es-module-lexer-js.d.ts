/**
 * es-module-lexer 2.3 exposes its CSP-safe parser through this subpath, but its
 * package exports are not understood by this repository's legacy Node resolver.
 * The runtime subpath exports only parse; reuse the package's canonical type.
 */
declare module 'es-module-lexer/js' {
  export { parse } from 'es-module-lexer';
}
