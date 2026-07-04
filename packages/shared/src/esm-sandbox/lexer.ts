/**
 * @author Kuitos
 * @since 2026-07-04
 * thin wrapper around es-module-lexer to make the wasm initialization preloadable
 */
import { init, parse } from 'es-module-lexer';
import { once } from 'lodash';

/**
 * Preload the wasm lexer. Safe to call multiple times, the initialization only happens once.
 * Called ahead of time in qiankun start() so the first micro app loading does not pay the wasm
 * instantiation cost, while the transpiler pipeline always awaits it as the final safety net.
 */
export const prepareEsmLexer: () => Promise<void> = once(() => Promise.resolve(init).then(() => undefined));

export { parse as parseModuleSyntax };
