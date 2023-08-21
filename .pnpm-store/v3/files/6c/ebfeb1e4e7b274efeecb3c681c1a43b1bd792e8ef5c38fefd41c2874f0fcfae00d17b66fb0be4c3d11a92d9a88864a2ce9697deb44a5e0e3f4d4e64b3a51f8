import Service from '../Service/Service';
interface IChanged {
    key: string;
    pluginId: string;
}
interface IOpts {
    cwd: string;
    service: Service;
    localConfig?: boolean;
    configFiles?: string[];
}
export default class Config {
    cwd: string;
    service: Service;
    config?: object;
    localConfig?: boolean;
    configFile?: string | null;
    configFiles: string[];
    constructor(opts: IOpts);
    getDefaultConfig(): Promise<{}>;
    getConfig({ defaultConfig }: {
        defaultConfig: object;
    }): {};
    getUserConfig(): {};
    addAffix(file: string, affix: string): string;
    requireConfigs(configFiles: string[]): any[];
    mergeConfig(...configs: object[]): {};
    getConfigFile(): string | null;
    getWatchFilesAndDirectories(): string[];
    watch(opts: {
        userConfig: object;
        onChange: (args: {
            userConfig: any;
            pluginChanged: IChanged[];
            valueChanged: IChanged[];
        }) => void;
    }): () => void;
}
export {};
