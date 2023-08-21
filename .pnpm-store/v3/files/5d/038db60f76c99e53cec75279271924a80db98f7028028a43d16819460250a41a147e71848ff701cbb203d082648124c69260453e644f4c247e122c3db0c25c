import { BuildOptions, TransformOptions } from '@umijs/bundler-utils/compiled/esbuild';
import type { Plugin } from '@umijs/bundler-vite/compiled/vite';
export declare enum Env {
    development = "development",
    production = "production"
}
export declare enum JSMinifier {
    terser = "terser",
    esbuild = "esbuild"
}
export interface ICopy {
    from: string;
    to: string;
}
export declare type IBabelPlugin = Function | string | [string, {
    [key: string]: any;
}] | [string, {
    [key: string]: any;
}, string];
export interface IConfig {
    alias?: Record<string, string>;
    autoCSSModules?: boolean;
    autoprefixer?: any;
    copy?: ICopy[] | string[];
    define?: {
        [key: string]: any;
    };
    extraBabelPlugins?: IBabelPlugin[];
    extraBabelPresets?: IBabelPlugin[];
    extraPostCSSPlugins?: any[];
    extraVitePlugins?: Plugin[];
    hash?: boolean;
    inlineLimit?: number;
    manifest?: boolean;
    normalCSSLoaderModules?: {
        [key: string]: any;
    };
    jsMinifier?: JSMinifier | boolean;
    jsMinifierOptions?: {
        [key: string]: any;
    };
    lessLoader?: {
        lessOptions: any;
    };
    outputPath?: string;
    polyfill?: {
        imports: string[];
    };
    postcssLoader?: {
        postcssOptions: any;
    };
    publicPath?: string;
    svgr?: TransformOptions;
    targets?: {
        [key: string]: any;
    };
    loader?: BuildOptions['loader'];
    modifyConfig?: (config: BuildOptions) => void | Promise<void>;
    [key: string]: any;
}
