import { IBundlerConfigType, IConfig } from '@umijs/types';
import Config from 'webpack-chain';
interface IOpts {
    type: IBundlerConfigType;
    mfsu?: boolean;
    webpackConfig: Config;
    config: IConfig;
    isDev: boolean;
    disableCompress?: boolean;
    browserslist?: any;
    miniCSSExtractPluginPath?: string;
    miniCSSExtractPluginLoaderPath?: string;
}
interface ICreateCSSRuleOpts extends IOpts {
    lang: string;
    test: RegExp;
    loader?: string;
    options?: object;
}
export declare function createCSSRule({ webpackConfig, type, config, lang, test, isDev, loader, options, browserslist, miniCSSExtractPluginLoaderPath, }: ICreateCSSRuleOpts): void;
export default function ({ type, mfsu, config, webpackConfig, isDev, disableCompress, browserslist, miniCSSExtractPluginPath, miniCSSExtractPluginLoaderPath, }: IOpts): void;
export {};
