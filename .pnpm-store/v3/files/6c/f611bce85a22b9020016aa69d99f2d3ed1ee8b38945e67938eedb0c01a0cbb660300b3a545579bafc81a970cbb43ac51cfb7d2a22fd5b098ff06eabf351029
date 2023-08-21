import { VisitorContext } from "../types";
export interface ResolvedModule {
    /**
     * Absolute path to resolved module
     */
    resolvedPath: string | undefined;
    /**
     * Output path
     */
    outputPath: string;
    /**
     * Resolved to URL
     */
    isURL: boolean;
}
/**
 * Resolve a module name
 */
export declare function resolveModuleName(context: VisitorContext, moduleName: string): ResolvedModule | undefined;
