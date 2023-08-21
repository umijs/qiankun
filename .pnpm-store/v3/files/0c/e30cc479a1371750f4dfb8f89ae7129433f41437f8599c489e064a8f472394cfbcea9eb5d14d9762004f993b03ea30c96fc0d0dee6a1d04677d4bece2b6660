import { Compilation } from '@umijs/bundler-webpack/compiled/webpack';
import { DeadCodeParams } from '../types';
export interface Options extends DeadCodeParams {
    patterns: string[];
    exclude: string[];
    failOnHint: boolean;
    detectUnusedFiles: boolean;
    detectUnusedExport: boolean;
}
export declare const ignores: string[];
declare const detectDeadCode: (compilation: Compilation, options: Options) => void;
export default detectDeadCode;
