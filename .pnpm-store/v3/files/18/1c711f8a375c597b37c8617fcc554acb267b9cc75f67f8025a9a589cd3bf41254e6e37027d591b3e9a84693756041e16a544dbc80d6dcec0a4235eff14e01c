import { MFSU } from '../mfsu/mfsu';
export declare class Dep {
    file: string;
    version: string;
    cwd: string;
    shortFile: string;
    normalizedFile: string;
    filePath: string;
    excludeNodeNatives: boolean;
    importer: string | undefined;
    constructor(opts: {
        file: string;
        version: string;
        cwd: string;
        excludeNodeNatives: boolean;
        importer?: string;
    });
    private normalizePath;
    buildExposeContent(): Promise<string>;
    getRealFile(): Promise<string | null>;
    static buildDeps(opts: {
        deps: Record<string, {
            file: string;
            version: string;
            importer?: string;
        }>;
        cwd: string;
        mfsu: MFSU;
    }): Dep[];
    static getDepVersion(opts: {
        dep: string;
        cwd: string;
    }): string;
}
