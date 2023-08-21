export declare enum ApplyPluginsType {
    compose = "compose",
    modify = "modify",
    event = "event"
}
interface IPlugin {
    path?: string;
    apply: object;
}
interface IOpts {
    validKeys?: string[];
}
export default class Plugin {
    validKeys: string[];
    hooks: {
        [key: string]: any;
    };
    constructor(opts?: IOpts);
    register(plugin: IPlugin): void;
    getHooks(keyWithDot: string): any;
    applyPlugins({ key, type, initialValue, args, async, }: {
        key: string;
        type: ApplyPluginsType;
        initialValue?: any;
        args?: object;
        async?: boolean;
    }): any;
}
export {};
