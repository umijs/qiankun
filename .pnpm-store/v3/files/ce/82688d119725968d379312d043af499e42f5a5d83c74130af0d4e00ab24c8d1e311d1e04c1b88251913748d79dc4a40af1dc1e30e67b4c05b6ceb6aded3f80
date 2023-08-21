import type { BuildResult } from '@umijs/bundler-utils/compiled/esbuild';
import { yParser } from '@umijs/utils';
import { Config } from '../config/config';
import { ApplyPluginsType, ConfigChangeType, EnableBy, Env, IEvent, IFrameworkType, IModify, ServiceStage } from '../types';
import { Command } from './command';
import { Generator } from './generator';
import { Hook } from './hook';
import { Plugin } from './plugin';
import { Telemetry } from './telemetry';
interface IOpts {
    cwd: string;
    env: Env;
    plugins?: string[];
    presets?: string[];
    frameworkName?: string;
    defaultConfigFiles?: string[];
}
export declare class Service {
    private opts;
    appData: {
        deps?: Record<string, {
            version: string;
            matches: string[];
            subpaths: string[];
            external?: boolean;
        }>;
        framework?: IFrameworkType;
        prepare?: {
            buildResult: BuildResult;
            fileImports?: Record<string, Declaration[]>;
        };
        mpa?: {
            entry?: {
                [key: string]: string;
            }[];
        };
        [key: string]: any;
    };
    args: yParser.Arguments;
    commands: Record<string, Command>;
    generators: Record<string, Generator>;
    config: Record<string, any>;
    configSchemas: Record<string, any>;
    configDefaults: Record<string, any>;
    configOnChanges: Record<string, any>;
    cwd: string;
    env: Env;
    hooks: Record<string, Hook[]>;
    name: string;
    paths: {
        cwd?: string;
        absSrcPath?: string;
        absPagesPath?: string;
        absApiRoutesPath?: string;
        absTmpPath?: string;
        absNodeModulesPath?: string;
        absOutputPath?: string;
    };
    plugins: Record<string, Plugin>;
    keyToPluginMap: Record<string, Plugin>;
    pluginMethods: Record<string, {
        plugin: Plugin;
        fn: Function;
    }>;
    skipPluginIds: Set<string>;
    stage: ServiceStage;
    userConfig: Record<string, any>;
    configManager: Config | null;
    pkg: {
        name?: string;
        version?: string;
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
        [key: string]: any;
    };
    pkgPath: string;
    telemetry: Telemetry;
    constructor(opts: IOpts);
    applyPlugins<T>(opts: {
        key: string;
        type?: ApplyPluginsType.event;
        initialValue?: any;
        args?: any;
        sync: true;
    }): typeof opts.initialValue | T;
    applyPlugins<T>(opts: {
        key: string;
        type?: ApplyPluginsType;
        initialValue?: any;
        args?: any;
    }): Promise<typeof opts.initialValue | T>;
    run(opts: {
        name: string;
        args?: any;
    }): Promise<void>;
    getPaths(): Promise<{
        cwd: string;
        absSrcPath: string;
        absPagesPath: string;
        absApiRoutesPath: string;
        absTmpPath: string;
        absNodeModulesPath: string;
        absOutputPath: string;
    }>;
    resolveConfig(): Promise<{
        config: any;
        defaultConfig: any;
    }>;
    _profilePlugins(): void;
    initPreset(opts: {
        preset: Plugin;
        presets: Plugin[];
        plugins: Plugin[];
    }): Promise<void>;
    initPlugin(opts: {
        plugin: Plugin;
        presets?: Plugin[];
        plugins: Plugin[];
    }): Promise<any>;
    isPluginEnable(hook: Hook | string): boolean;
    commandGuessHelper(commands: string[], currentCmd: string): void;
    get frameworkName(): string;
}
export interface IServicePluginAPI {
    appData: typeof Service.prototype.appData;
    applyPlugins: typeof Service.prototype.applyPlugins;
    args: typeof Service.prototype.args;
    config: typeof Service.prototype.config;
    cwd: typeof Service.prototype.cwd;
    generators: typeof Service.prototype.generators;
    pkg: typeof Service.prototype.pkg;
    pkgPath: typeof Service.prototype.pkgPath;
    name: typeof Service.prototype.name;
    paths: Required<typeof Service.prototype.paths>;
    userConfig: typeof Service.prototype.userConfig;
    env: typeof Service.prototype.env;
    isPluginEnable: typeof Service.prototype.isPluginEnable;
    onCheck: IEvent<null>;
    onStart: IEvent<null>;
    modifyAppData: IModify<typeof Service.prototype.appData, null>;
    modifyConfig: IModify<typeof Service.prototype.config, {
        paths: Record<string, string>;
    }>;
    modifyDefaultConfig: IModify<typeof Service.prototype.config, null>;
    modifyPaths: IModify<typeof Service.prototype.paths, null>;
    modifyTelemetryStorage: IModify<typeof Service.prototype.telemetry, null>;
    ApplyPluginsType: typeof ApplyPluginsType;
    ConfigChangeType: typeof ConfigChangeType;
    EnableBy: typeof EnableBy;
    ServiceStage: typeof ServiceStage;
    registerPresets: (presets: any[]) => void;
    registerPlugins: (plugins: (Plugin | {})[]) => void;
}
declare type DeclareKind = 'value' | 'type';
declare type Declaration = {
    type: 'ImportDeclaration';
    source: string;
    specifiers: Array<SimpleImportSpecifier>;
    importKind: DeclareKind;
    start: number;
    end: number;
} | {
    type: 'DynamicImport';
    source: string;
    start: number;
    end: number;
} | {
    type: 'ExportNamedDeclaration';
    source: string;
    specifiers: Array<SimpleExportSpecifier>;
    exportKind: DeclareKind;
    start: number;
    end: number;
} | {
    type: 'ExportAllDeclaration';
    source: string;
    start: number;
    end: number;
};
declare type SimpleImportSpecifier = {
    type: 'ImportDefaultSpecifier';
    local: string;
} | {
    type: 'ImportNamespaceSpecifier';
    local: string;
    imported: string;
} | {
    type: 'ImportNamespaceSpecifier';
    local?: string;
};
declare type SimpleExportSpecifier = {
    type: 'ExportDefaultSpecifier';
    exported: string;
} | {
    type: 'ExportNamespaceSpecifier';
    exported?: string;
} | {
    type: 'ExportSpecifier';
    exported: string;
    local: string;
};
export {};
