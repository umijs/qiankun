import { EnableBy, Env, IPluginConfig } from '../types';
declare type PluginType = 'plugin' | 'preset';
interface IOpts {
    path: string;
    cwd: string;
    type: PluginType;
}
export interface IPluginObject {
    id: string;
    key: string;
    apply?: Function;
    config?: IPluginConfig;
    enableBy?: EnableBy | (() => boolean);
}
export declare class Plugin {
    private cwd;
    type: PluginType;
    path: string;
    id: string;
    key: string;
    apply: Function;
    config: IPluginConfig;
    time: {
        register?: number;
        hooks: Record<string, number[]>;
    };
    enableBy: EnableBy | ((opts: {
        userConfig: any;
        config: any;
        env: Env;
    }) => boolean);
    constructor(opts: IOpts);
    merge(opts: {
        key?: string;
        config?: IPluginConfig;
        enableBy?: any;
    }): void;
    getId(opts: {
        pkg: any;
        isPkgEntry: boolean;
        pkgJSONPath: string | null;
    }): any;
    getKey(opts: {
        pkg: any;
        isPkgEntry: boolean;
    }): string;
    static isPluginOrPreset(type: 'plugin' | 'preset', name: string): boolean;
    static stripNoneUmiScope(name: string): string;
    static getPluginsAndPresets(opts: {
        cwd: string;
        pkg: any;
        userConfig: any;
        plugins?: string[];
        presets?: string[];
        prefix: string;
    }): {
        presets: Plugin[];
        plugins: Plugin[];
    };
}
export {};
