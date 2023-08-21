import { Charset, Plugin } from '@umijs/bundler-utils/compiled/esbuild';
import { IConfig } from '../types';
export interface StylePluginOptions {
    /**
     * whether to minify the css code.
     * @default true
     */
    minify?: boolean;
    /**
     * css charset.
     * @default 'utf8'
     */
    charset?: Charset;
    inlineStyle?: boolean;
    config?: IConfig;
}
export declare function style({ minify, charset, inlineStyle, config, }?: StylePluginOptions): Plugin;
