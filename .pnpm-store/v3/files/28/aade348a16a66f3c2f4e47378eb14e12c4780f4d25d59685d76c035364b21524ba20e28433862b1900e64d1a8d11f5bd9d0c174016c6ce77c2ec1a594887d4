import { TSESTreeOptions, ParserServices } from './parser-options';
import { TSESTree } from './ts-estree';
declare type AST<T extends TSESTreeOptions> = TSESTree.Program & (T['range'] extends true ? {
    range: [number, number];
} : {}) & (T['tokens'] extends true ? {
    tokens: TSESTree.Token[];
} : {}) & (T['comment'] extends true ? {
    comments: TSESTree.Comment[];
} : {});
export interface ParseAndGenerateServicesResult<T extends TSESTreeOptions> {
    ast: AST<T>;
    services: ParserServices;
}
export declare const version: string;
export declare function parse<T extends TSESTreeOptions = TSESTreeOptions>(code: string, options?: T): AST<T>;
export declare function parseAndGenerateServices<T extends TSESTreeOptions = TSESTreeOptions>(code: string, options: T): ParseAndGenerateServicesResult<T>;
export { TSESTreeOptions, ParserServices };
export * from './ts-estree';
//# sourceMappingURL=parser.d.ts.map