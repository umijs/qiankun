/// <reference types="node" />
import { BabelRegister, NodeEnv } from '@umijs/utils';
import { EventEmitter } from 'events';
import Config from '../Config/Config';
import { ApplyPluginsType, ConfigChangeType, EnableBy, ServiceStage } from './enums';
import PluginAPI from './PluginAPI';
import { ICommand, IHook, IPackage, IPlugin, IPreset } from './types';
export interface IServiceOpts {
    cwd: string;
    pkg?: IPackage;
    presets?: string[];
    plugins?: string[];
    configFiles?: string[];
    env?: NodeEnv;
}
interface IConfig {
    presets?: string[];
    plugins?: string[];
    [key: string]: any;
}
export default class Service extends EventEmitter {
    cwd: string;
    pkg: IPackage;
    skipPluginIds: Set<string>;
    stage: ServiceStage;
    commands: {
        [name: string]: ICommand | string;
    };
    plugins: {
        [id: string]: IPlugin;
    };
    pluginMethods: {
        [name: string]: Function;
    };
    initialPresets: IPreset[];
    initialPlugins: IPlugin[];
    _extraPresets: IPreset[];
    _extraPlugins: IPlugin[];
    userConfig: IConfig;
    configInstance: Config;
    config: IConfig | null;
    babelRegister: BabelRegister;
    hooksByPluginId: {
        [id: string]: IHook[];
    };
    hooks: {
        [key: string]: IHook[];
    };
    paths: {
        cwd?: string;
        absNodeModulesPath?: string;
        absSrcPath?: string;
        absPagesPath?: string;
        absOutputPath?: string;
        absTmpPath?: string;
    };
    env: string | undefined;
    ApplyPluginsType: typeof ApplyPluginsType;
    EnableBy: typeof EnableBy;
    ConfigChangeType: typeof ConfigChangeType;
    ServiceStage: typeof ServiceStage;
    args: any;
    constructor(opts: IServiceOpts);
    setStage(stage: ServiceStage): void;
    resolvePackage(): any;
    loadEnv(): void;
    init(): Promise<void>;
    initPresetsAndPlugins(): Promise<void>;
    getPluginAPI(opts: any): PluginAPI;
    applyAPI(opts: {
        apply: Function;
        api: PluginAPI;
    }): Promise<any>;
    initPreset(preset: IPreset): Promise<void>;
    initPlugin(plugin: IPlugin): Promise<void>;
    getPluginOptsWithKey(key: string): any;
    registerPlugin(plugin: IPlugin): void;
    isPluginEnable(pluginId: string): any;
    hasPlugins(pluginIds: string[]): boolean;
    hasPresets(presetIds: string[]): boolean;
    applyPlugins(opts: {
        key: string;
        type: ApplyPluginsType;
        initialValue?: any;
        args?: any;
    }): Promise<any>;
    run({ name, args }: {
        name: string;
        args?: any;
    }): Promise<void>;
    runCommand({ name, args }: {
        name: string;
        args?: any;
    }): Promise<void>;
}
export {};
