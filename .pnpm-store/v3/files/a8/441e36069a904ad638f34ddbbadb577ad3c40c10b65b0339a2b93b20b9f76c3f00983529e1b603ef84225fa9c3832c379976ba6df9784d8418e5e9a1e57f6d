/**
 * get parsed tsconfig.json for specific path
 */
export declare function getTsconfig(cwd: string): import("typescript").ParsedCommandLine | undefined;
/**
 * get declarations for specific files
 */
export default function getDeclarations(inputFiles: string[], opts: {
    cwd: string;
}): Promise<{
    file: string;
    content: string;
    sourceFile: string;
}[]>;
