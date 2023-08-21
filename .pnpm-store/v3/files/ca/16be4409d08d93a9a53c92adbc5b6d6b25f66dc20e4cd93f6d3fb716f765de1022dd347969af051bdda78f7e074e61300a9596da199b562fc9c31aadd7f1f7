export declare function parseModule(opts: {
    content: string;
    path: string;
}): Promise<readonly [imports: readonly import("../compiled/es-module-lexer").ImportSpecifier[], exports: readonly string[], facade: boolean]>;
export declare function parseModuleSync(opts: {
    content: string;
    path: string;
}): readonly [imports: readonly import("../compiled/es-module-lexer").ImportSpecifier[], exports: readonly string[], facade: boolean];
export declare function isDepPath(path: string): boolean;
export * from './https';
export * from './proxy';
export * from './types';
declare type Errors = {
    location?: {
        line: number;
        column: number;
    };
    text: string;
}[];
export declare function prettyPrintEsBuildErrors(errors: Errors | undefined, opts: {
    content: string;
    path: string;
}): void;
