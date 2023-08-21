import { logger } from '@umijs/utils';
import { EnableBy, Env, IPluginConfig } from '../types';
import { IOpts as ICommandOpts } from './command';
import { Generator } from './generator';
import { IOpts as IHookOpts } from './hook';
import { Plugin } from './plugin';
import { Service } from './service';
import type { IMetry } from './telemetry';
declare type Logger = typeof logger;
declare const resolveConfigModes: readonly ["strict", "loose"];
export declare type ResolveConfigMode = (typeof resolveConfigModes)[number];
declare type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;
export declare class PluginAPI {
    service: Service;
    plugin: Plugin;
    logger: Logger;
    telemetry: IMetry;
    constructor(opts: {
        service: Service;
        plugin: Plugin;
    });
    describe(opts: {
        key?: string;
        config?: IPluginConfig;
        enableBy?: EnableBy | ((enableByOpts: {
            userConfig: any;
            env: Env;
        }) => boolean);
    }): void;
    registerCommand(opts: Omit<ICommandOpts, 'plugin'> & {
        alias?: string | string[];
    }): void;
    registerGenerator(opts: DistributiveOmit<Generator, 'plugin'>): void;
    register(opts: Omit<IHookOpts, 'plugin'>): void;
    registerMethod(opts: {
        name: string;
        fn?: Function;
    }): void;
    registerPresets(source: Plugin[], presets: any[]): void;
    registerPlugins(source: Plugin[], plugins: any[]): void;
    skipPlugins(keys: string[]): void;
    static proxyPluginAPI(opts: {
        pluginAPI: PluginAPI;
        service: Service;
        serviceProps: string[];
        staticProps: Record<string, any>;
    }): PluginAPI;
}
export {};
