import type { Compiler } from 'webpack';
declare class CaseSensitivePathsPlugin {
    fs: Compiler['inputFileSystem'];
    context: string;
    cacheMap: Map<string, string[]>;
    deferrerMap: Map<string, Promise<string[]>>;
    /**
     * Check if resource need to be checked
     */
    isCheckable(res: string, type?: string, issuer?: string): boolean;
    /**
     * Check if file exists with case sensitive
     */
    checkFileExistsWithCase(res: string): Promise<unknown>;
    /**
     * reset this plugin, wait for the next compilation
     */
    reset(): void;
    apply(compiler: Compiler): void;
}
export = CaseSensitivePathsPlugin;
