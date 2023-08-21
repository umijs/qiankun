import joi from '@umijs/utils/compiled/@hapi/joi';
import zod, { z } from '@umijs/utils/compiled/zod';
export declare enum Env {
    development = "development",
    production = "production",
    test = "test"
}
export declare enum PluginType {
    preset = "preset",
    plugin = "plugin"
}
export interface IPluginConfig {
    default?: any;
    schema?: {
        (joi: joi.Root & {
            zod: typeof z;
        }): joi.Schema | zod.Schema;
    };
    onChange?: string | Function;
}
export declare enum ServiceStage {
    uninitialized = 0,
    init = 1,
    initPresets = 2,
    initPlugins = 3,
    resolveConfig = 4,
    collectAppData = 5,
    onCheck = 6,
    onStart = 7,
    runCommand = 8
}
export declare enum ConfigChangeType {
    reload = "reload",
    regenerateTmpFiles = "regenerateTmpFiles"
}
export declare type ChangeTypeValue = string | `${ConfigChangeType}` | Function;
export declare type IOnChangeTypes = Record<string, ChangeTypeValue>;
export declare enum ApplyPluginsType {
    add = "add",
    modify = "modify",
    event = "event"
}
export declare enum EnableBy {
    register = "register",
    config = "config"
}
export interface IRoute {
    path: string;
    absPath: string;
    file?: string;
    id: string;
    parentId?: string;
    [key: string]: any;
}
export interface IEvent<T> {
    (fn: {
        (args: T): void;
    }): void;
    (args: {
        fn: {
            (args: T): void;
        };
        name?: string;
        before?: string | string[];
        stage?: number;
    }): void;
}
export interface IModify<T, U> {
    (fn: {
        (initialValue: T, args: U): T;
    }): void;
    (fn: {
        (initialValue: T, args: U): Promise<T>;
    }): void;
    (args: {
        fn: {
            (initialValue: T, args: U): T;
        };
        name?: string;
        before?: string | string[];
        stage?: number;
    }): void;
    (args: {
        fn: {
            (initialValue: T, args: U): Promise<T>;
        };
        name?: string;
        before?: string | string[];
        stage?: number;
    }): void;
}
export interface IAdd<T, U> {
    (fn: {
        (args: T): U | U[];
    }): void;
    (fn: {
        (args: T): Promise<U | U[]>;
    }): void;
    (args: {
        fn: {
            (args: T): U | U[];
        };
        name?: string;
        before?: string | string[];
        stage?: number;
    }): void;
    (args: {
        fn: {
            (args: T): Promise<U | U[]>;
        };
        name?: string;
        before?: string | string[];
        stage?: number;
    }): void;
}
export declare type IFrameworkType = 'vue' | 'react';
