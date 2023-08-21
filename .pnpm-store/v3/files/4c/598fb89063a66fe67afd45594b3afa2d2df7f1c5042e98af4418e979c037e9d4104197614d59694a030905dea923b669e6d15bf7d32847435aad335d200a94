import { Configuration } from '../../compiled/webpack';
import { Env, IConfig } from '../types';
export interface IOpts {
    cwd: string;
    rootDir?: string;
    env: Env;
    entry: Record<string, string>;
    extraBabelPresets?: any[];
    extraBabelPlugins?: any[];
    extraBabelIncludes?: Array<string | RegExp>;
    extraEsbuildLoaderHandler?: any[];
    babelPreset?: any;
    chainWebpack?: Function;
    modifyWebpackConfig?: Function;
    hash?: boolean;
    hmr?: boolean;
    staticPathPrefix?: string;
    userConfig: IConfig;
    analyze?: any;
    name?: string;
    cache?: {
        absNodeModulesPath?: string;
        buildDependencies?: string[];
        cacheDirectory?: string;
    };
    pkg?: Record<string, any>;
    disableCopy?: boolean;
}
export declare function getConfig(opts: IOpts): Promise<Configuration>;
