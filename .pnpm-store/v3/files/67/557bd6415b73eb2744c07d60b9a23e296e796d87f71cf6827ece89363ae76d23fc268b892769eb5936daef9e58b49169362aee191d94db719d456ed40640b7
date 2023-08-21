import { Format } from '@umijs/bundler-utils/compiled/esbuild';
import { IBabelPlugin, IConfig } from './types';
interface IOpts {
    cwd: string;
    entry: Record<string, string>;
    config: IConfig;
    mode?: string;
    onBuildComplete?: Function;
    clean?: boolean;
    format?: Format;
    sourcemap?: boolean | 'inline' | 'external' | 'both';
    beforeBabelPlugins?: any[];
    beforeBabelPresets?: any[];
    extraBabelPlugins?: IBabelPlugin[];
    extraBabelPresets?: IBabelPlugin[];
    inlineStyle?: boolean;
}
export declare function build(opts: IOpts): Promise<import("@umijs/bundler-utils/compiled/esbuild").BuildResult>;
export {};
