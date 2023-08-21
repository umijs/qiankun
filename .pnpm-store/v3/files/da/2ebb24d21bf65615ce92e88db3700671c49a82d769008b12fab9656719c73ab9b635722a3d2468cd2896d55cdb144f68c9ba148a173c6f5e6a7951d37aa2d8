import { yParser } from '@umijs/utils';
import { Plugin } from './plugin';
import { ResolveConfigMode } from './pluginAPI';
export interface IOpts {
    name: string;
    description?: string;
    options?: string;
    details?: string;
    fn: {
        ({ args }: {
            args: yParser.Arguments;
        }): void;
    };
    plugin: Plugin;
    configResolveMode?: ResolveConfigMode;
}
export declare class Command {
    name: string;
    description?: string;
    options?: string;
    details?: string;
    configResolveMode: ResolveConfigMode;
    fn: {
        ({ args }: {
            args: yParser.Arguments;
        }): void;
    };
    plugin: Plugin;
    constructor(opts: IOpts);
}
