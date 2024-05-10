/**
 * @author Kuitos
 * @since 2019-04-11
 */
import type { Freer, SandBox } from '../../interfaces';
import * as css from './css';
export declare function patchAtMounting(appName: string, elementGetter: () => HTMLElement | ShadowRoot, sandbox: SandBox, scopedCSS: boolean, excludeAssetFilter?: CallableFunction, speedySandBox?: boolean): Freer[];
export declare function patchAtBootstrapping(appName: string, elementGetter: () => HTMLElement | ShadowRoot, sandbox: SandBox, scopedCSS: boolean, excludeAssetFilter?: CallableFunction, speedySandBox?: boolean): Freer[];
export { css };
