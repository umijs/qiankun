import type { IApi } from '../../../types';
import type { IBundlessConfig } from '../../config';
import type { ILoaderOutput } from './types';
/**
 * loader item type
 */
export interface ILoaderItem {
    id: string;
    test: string | RegExp | ((path: string) => boolean);
    loader: string;
    options?: Record<string, any>;
}
/**
 * add loader
 * @param item  loader item
 */
export declare function addLoader(item: ILoaderItem): void;
/**
 * loader module base on webpack loader-runner
 */
declare const _default: (fileAbsPath: string, opts: {
    config: IBundlessConfig;
    pkg: IApi['pkg'];
    cwd: string;
    itemDistAbsPath: string;
}) => Promise<void | ILoaderOutput>;
export default _default;
