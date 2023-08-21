import type { ImportSpecifier } from '@umijs/bundler-utils/compiled/es-module-lexer';
interface IParams {
    cache: Map<string, any>;
    opts: any;
}
interface IOpts {
    code: string;
    imports: ImportSpecifier[];
    filePath: string;
}
export declare function getImportHandlerV4(params: {
    resolveImportSource: (source: string) => string;
}): (opts: IOpts) => string;
export default function getAwaitImportHandler(params: IParams): (opts: IOpts) => string;
export {};
