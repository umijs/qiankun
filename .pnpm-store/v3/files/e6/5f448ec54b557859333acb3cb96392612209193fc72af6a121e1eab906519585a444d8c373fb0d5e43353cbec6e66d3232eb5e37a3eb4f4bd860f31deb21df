import type { IDemoOpts } from './options';
export interface IDepAnalyzeResult {
    dependencies: Record<string, {
        version: string;
        css?: string;
    }>;
    files: Record<string, {
        import: string;
        fileAbsPath: string;
    }>;
}
export declare const LOCAL_DEP_EXT: string[];
export declare const LOCAL_MODULE_EXT: string[];
export declare const PLAIN_TEXT_EXT: string[];
export declare const isHostPackage: (packageName: string) => string;
declare function analyzeDeps(raw: string, { isTSX, fileAbsPath, entryAbsPath, files, }: IDemoOpts & {
    entryAbsPath?: string;
    files?: IDepAnalyzeResult['files'];
}): IDepAnalyzeResult;
export declare function getCSSForDep(dep: string): string;
export default analyzeDeps;
