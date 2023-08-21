import { generateFile } from '@umijs/utils';
import { Plugin } from './plugin';
export declare enum GeneratorType {
    generate = "generate",
    enable = "enable"
}
declare type IGeneratorOptsWithoutEnableCheck = {
    key: string;
    name: string;
    description: string;
    type: GeneratorType.generate;
    fn: {
        (opts: {
            args: any;
            generateFile: typeof generateFile;
            updatePackageJSON: {
                (opts: {
                    opts: object;
                    cwd?: string;
                }): void;
            };
            installDeps: {
                (opts: {
                    opts: {
                        devDependencies?: string[];
                        dependencies?: string[];
                    };
                    cwd?: string;
                }): void;
            };
        }): void;
    };
    plugin: Plugin;
};
declare type IGeneratorOptsWithEnableCheck = {
    key: string;
    name: string;
    description: string;
    type: GeneratorType.enable;
    checkEnable: {
        (opts: {
            args: any;
        }): boolean;
    };
    disabledDescription: string | (() => string);
    fn: {
        (opts: {
            args: any;
            generateFile: typeof generateFile;
            updatePackageJSON: {
                (opts: {
                    opts: object;
                    cwd?: string;
                }): void;
            };
            installDeps: {
                (opts: {
                    opts: {
                        devDependencies?: string[];
                        dependencies?: string[];
                    };
                    cwd?: string;
                }): void;
            };
        }): void;
    };
    plugin: Plugin;
};
export declare type Generator = IGeneratorOptsWithEnableCheck | IGeneratorOptsWithoutEnableCheck;
export declare function makeGenerator<T>(opts: T): T;
export {};
