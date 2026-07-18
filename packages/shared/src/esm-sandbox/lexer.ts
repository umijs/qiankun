/**
 * @author Kuitos
 * @since 2026-07-04
 * CSP-safe wrapper around es-module-lexer's pure-JS parser.
 */
import { parse } from 'es-module-lexer/js';

/**
 * Keep the asynchronous preparation contract used by the loading pipeline. The pure-JS entry is
 * ready synchronously and, unlike the default WASM entry's string decoder, does not rely on eval.
 */
const lexerReady = Promise.resolve();
export const prepareEsmLexer = (): Promise<void> => lexerReady;

export { parse as parseModuleSyntax };
