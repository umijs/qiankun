import { PluginType } from '../enums';
import { IPackage, IPlugin } from '../types';
interface IOpts {
    pkg: IPackage;
    cwd: string;
}
interface IResolvePresetsOpts extends IOpts {
    presets: string[];
    userConfigPresets: string[];
}
interface IResolvePluginsOpts extends IOpts {
    plugins: string[];
    userConfigPlugins: string[];
}
export declare function isPluginOrPreset(type: PluginType, name: string): boolean;
export declare function pathToObj({ type, path, cwd, }: {
    type: PluginType;
    path: string;
    cwd: string;
}): {
    id: any;
    key: string;
    path: string;
    apply(): any;
    defaultConfig: null;
};
export declare function resolvePresets(opts: IResolvePresetsOpts): {
    id: any;
    key: string;
    path: string;
    apply(): any;
    defaultConfig: null;
}[];
export declare function resolvePlugins(opts: IResolvePluginsOpts): {
    id: any;
    key: string;
    path: string;
    apply(): any;
    defaultConfig: null;
}[];
export declare function isValidPlugin(plugin: IPlugin): "" | Function;
export {};
