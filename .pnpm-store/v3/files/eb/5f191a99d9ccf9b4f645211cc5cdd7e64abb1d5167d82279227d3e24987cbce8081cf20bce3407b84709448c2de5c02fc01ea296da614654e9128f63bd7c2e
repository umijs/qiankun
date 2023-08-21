import { Minimatch } from 'minimatch';
import { IApi, IFatherBaseConfig, IFatherBuildTypes, IFatherBundleConfig, IFatherBundlessConfig, IFatherBundlessTypes, IFatherConfig } from '../types';
/**
 * declare bundler config
 */
export interface IBundleConfig extends IFatherBaseConfig, Omit<IFatherBundleConfig, 'entry' | 'output'> {
    type: IFatherBuildTypes.BUNDLE;
    bundler: 'webpack';
    entry: string;
    output: {
        filename: string;
        path: string;
    };
}
/**
 * declare bundless config
 */
export interface IBundlessConfig extends IFatherBaseConfig, Omit<IFatherBundlessConfig, 'input' | 'overrides'> {
    type: IFatherBuildTypes.BUNDLESS;
    format: IFatherBundlessTypes;
    input: string;
    output: NonNullable<IFatherBundlessConfig['output']>;
}
/**
 * declare union builder config
 */
export type IBuilderConfig = IBundleConfig | IBundlessConfig;
/**
 *
 * convert alias from tsconfig paths
 * @export
 * @param {string} cwd
 */
export declare function convertAliasByTsconfigPaths(cwd: string): {
    bundle: Record<string, string>;
    bundless: Record<string, string>;
};
/**
 * normalize user config to bundler configs
 * @param userConfig  config from user
 */
export declare function normalizeUserConfig(userConfig: IFatherConfig, pkg: IApi['pkg']): IBuilderConfig[];
declare class Minimatcher {
    matcher?: InstanceType<typeof Minimatch>;
    ignoreMatchers: InstanceType<typeof Minimatch>[];
    constructor(pattern: string, ignores?: string[]);
    match(filePath: string): boolean;
}
declare class ConfigProvider {
    pkg: ConstructorParameters<typeof ConfigProvider>[0];
    constructor(pkg: IApi['pkg']);
    onConfigChange(): void;
}
export declare class BundleConfigProvider extends ConfigProvider {
    type: IFatherBuildTypes;
    configs: IBundleConfig[];
    constructor(configs: IBundleConfig[], pkg: ConstructorParameters<typeof ConfigProvider>[0]);
}
export declare class BundlessConfigProvider extends ConfigProvider {
    type: IFatherBuildTypes;
    configs: IBundlessConfig[];
    input: string;
    output: string;
    matchers: InstanceType<typeof Minimatcher>[];
    constructor(configs: IBundlessConfig[], pkg: ConstructorParameters<typeof ConfigProvider>[0]);
    getConfigForFile(filePath: string): IBundlessConfig;
}
export declare function createConfigProviders(userConfig: IFatherConfig, pkg: IApi['pkg'], cwd: string): {
    bundless: {
        esm?: BundlessConfigProvider;
        cjs?: BundlessConfigProvider;
    };
    bundle?: BundleConfigProvider | undefined;
};
export {};
