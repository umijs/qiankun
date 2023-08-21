import type { ImportSpecifier } from '@umijs/bundler-utils/compiled/es-module-lexer';
import type { TransformOptions } from '@umijs/bundler-utils/compiled/esbuild';
export declare enum Mode {
    development = "development",
    production = "production"
}
export interface IEsbuildLoaderHandlerParams {
    code: string;
    filePath: string;
    imports: readonly ImportSpecifier[];
    exports: readonly string[];
}
export interface IEsbuildLoaderOpts extends Partial<TransformOptions> {
    handler?: Array<(opts: IEsbuildLoaderHandlerParams) => string>;
    implementation?: typeof import('@umijs/bundler-utils/compiled/esbuild');
}
