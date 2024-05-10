/**
 * @author Kuitos
 * @since 2020-10-13
 */
import type { Freer, SandBox } from '../../../interfaces';
declare const elementAttachedSymbol: unique symbol;
declare global {
    interface HTMLElement {
        [elementAttachedSymbol]: string;
    }
}
export declare function patchStrictSandbox(appName: string, appWrapperGetter: () => HTMLElement | ShadowRoot, sandbox: SandBox, mounting?: boolean, scopedCSS?: boolean, excludeAssetFilter?: CallableFunction, speedySandbox?: boolean): Freer;
export {};
