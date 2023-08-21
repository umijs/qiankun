import { HandlerConfig, FallbackConfig } from './MapHandler.js';
import { StackItemClass } from './StackItem.js';
import { TagsClass } from './Tags.js';
import { OptionList } from '../../util/Options.js';
import { SubHandlers } from './MapHandler.js';
import { FunctionList } from '../../util/FunctionList.js';
import { TeX } from '../tex.js';
import { PrioritizedList } from '../../util/PrioritizedList.js';
export declare type StackItemConfig = {
    [kind: string]: StackItemClass;
};
export declare type TagsConfig = {
    [kind: string]: TagsClass;
};
export declare type Processor<T> = [T, number];
export declare type ProtoProcessor<T> = Processor<T> | T;
export declare type ProcessorList = Processor<Function>[];
export declare type ConfigMethod = (c: ParserConfiguration, j: TeX<any, any, any>) => void;
export declare type InitMethod = (c: ParserConfiguration) => void;
export declare class Configuration {
    readonly name: string;
    readonly handler: HandlerConfig;
    readonly fallback: FallbackConfig;
    readonly items: StackItemConfig;
    readonly tags: TagsConfig;
    readonly options: OptionList;
    readonly nodes: {
        [key: string]: any;
    };
    readonly preprocessors: ProcessorList;
    readonly postprocessors: ProcessorList;
    readonly initMethod: Processor<InitMethod>;
    readonly configMethod: Processor<ConfigMethod>;
    priority: number;
    readonly parser: string;
    private static makeProcessor;
    private static _create;
    static create(name: string, config?: {
        handler?: HandlerConfig;
        fallback?: FallbackConfig;
        items?: StackItemConfig;
        tags?: TagsConfig;
        options?: OptionList;
        nodes?: {
            [key: string]: any;
        };
        preprocessors?: ProtoProcessor<Function>[];
        postprocessors?: ProtoProcessor<Function>[];
        init?: ProtoProcessor<InitMethod>;
        config?: ProtoProcessor<ConfigMethod>;
        priority?: number;
        parser?: string;
    }): Configuration;
    static local(config?: {
        handler?: HandlerConfig;
        fallback?: FallbackConfig;
        items?: StackItemConfig;
        tags?: TagsConfig;
        options?: OptionList;
        nodes?: {
            [key: string]: any;
        };
        preprocessors?: ProtoProcessor<Function>[];
        postprocessors?: ProtoProcessor<Function>[];
        init?: ProtoProcessor<InitMethod>;
        config?: ProtoProcessor<ConfigMethod>;
        priority?: number;
        parser?: string;
    }): Configuration;
    private constructor();
    get init(): InitMethod;
    get config(): ConfigMethod;
}
export declare namespace ConfigurationHandler {
    let set: (name: string, map: Configuration) => void;
    let get: (name: string) => Configuration;
    let keys: () => IterableIterator<string>;
}
export declare class ParserConfiguration {
    protected initMethod: FunctionList;
    protected configMethod: FunctionList;
    protected configurations: PrioritizedList<Configuration>;
    protected parsers: string[];
    handlers: SubHandlers;
    items: StackItemConfig;
    tags: TagsConfig;
    options: OptionList;
    nodes: {
        [key: string]: any;
    };
    constructor(packages: (string | [string, number])[], parsers?: string[]);
    init(): void;
    config(jax: TeX<any, any, any>): void;
    addPackage(pkg: (string | [string, number])): void;
    add(name: string, jax: TeX<any, any, any>, options?: OptionList): void;
    protected getPackage(name: string): Configuration;
    append(config: Configuration, priority?: number): void;
    private addFilters;
}
