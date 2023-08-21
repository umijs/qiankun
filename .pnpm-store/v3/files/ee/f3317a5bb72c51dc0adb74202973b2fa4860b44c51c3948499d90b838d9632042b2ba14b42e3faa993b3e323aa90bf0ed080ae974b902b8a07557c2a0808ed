import * as defaultWebpack from '@umijs/deps/compiled/webpack';
import { IBundlerConfigType, IConfig } from '@umijs/types';
export interface IOpts {
    cwd: string;
    config: IConfig;
    type: IBundlerConfigType;
    env: 'development' | 'production';
    entry?: {
        [key: string]: string;
    };
    hot?: boolean;
    port?: number;
    babelOpts?: object;
    babelOptsForDep?: object;
    mfsu?: boolean;
    targets?: any;
    browserslist?: any;
    bundleImplementor?: typeof defaultWebpack;
    modifyBabelOpts?: (opts: object, args?: any) => Promise<any>;
    modifyBabelPresetOpts?: (opts: object, args?: any) => Promise<any>;
    chainWebpack?: (webpackConfig: any, args: any) => Promise<any>;
    miniCSSExtractPluginPath?: string;
    miniCSSExtractPluginLoaderPath?: string;
    __disableTerserForTest?: boolean;
}
export default function getConfig(opts: IOpts): Promise<defaultWebpack.Configuration>;
