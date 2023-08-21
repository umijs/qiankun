import * as utils from '@umijs/utils';
import Html from '../Html/Html';
import Logger from '../Logger/Logger';
import { EnableBy } from './enums';
import Service from './Service';
import { ICommand, IHook, IPlugin, IPluginConfig, IPreset } from './types';
interface IOpts {
    id: string;
    key: string;
    service: Service;
}
export default class PluginAPI {
    id: string;
    key: string;
    service: Service;
    Html: typeof Html;
    utils: typeof utils;
    logger: Logger;
    constructor(opts: IOpts);
    describe({ id, key, config, enableBy, }?: {
        id?: string;
        key?: string;
        config?: IPluginConfig;
        onChange?: any;
        enableBy?: EnableBy | (() => boolean);
    }): void;
    register(hook: IHook): void;
    registerCommand(command: ICommand): void;
    registerPresets(presets: (IPreset | string)[]): void;
    registerPlugins(plugins: (IPlugin | string)[]): void;
    registerMethod({ name, fn, exitsError, }: {
        name: string;
        fn?: Function;
        exitsError?: boolean;
    }): void;
    skipPlugins(pluginIds: string[]): void;
}
export {};
