import ts, { GetCanonicalFileName, SourceFile } from "typescript";
import { VisitorContext } from "../types";
/**
 * Determine output file path for source file
 */
export declare function getOutputDirForSourceFile(context: VisitorContext, sourceFile: SourceFile): string;
/**
 * Determine if moduleName matches config in paths
 */
export declare function isModulePathsMatch(context: VisitorContext, moduleName: string): boolean;
/**
 * Create barebones EmitHost (for no-Program transform)
 */
export declare function createSyntheticEmitHost(compilerOptions: ts.CompilerOptions, tsInstance: typeof ts, getCanonicalFileName: GetCanonicalFileName, fileNames: string[]): ts.EmitHost;
/**
 * Get ts-node register info
 */
export declare function getTsNodeRegistrationProperties(tsInstance: typeof ts): {
    compilerOptions: ts.CompilerOptions & object & {
        outDir: string | undefined;
    };
    fileNames: string[];
    tsNodeOptions: import("ts-node").RegisterOptions;
} | undefined;
