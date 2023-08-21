import { IBundleConfig, IBundlessConfig } from '../builder/config';
import type { IApi } from '../types';
export type IDoctorReport = {
    type: 'error' | 'warn';
    problem: string;
    solution: string;
}[];
/**
 * register all built-in rules
 */
export declare function registerRules(api: IApi): void;
/**
 * get top-level source dirs from configs
 */
export declare function getSourceDirs(bundleConfigs: IBundleConfig[], bundlessConfigs: IBundlessConfig[]): string[];
declare const _default: (api: IApi) => Promise<IDoctorReport>;
export default _default;
