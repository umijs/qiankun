import { IConfig } from '@umijs/types';
declare type env = 'development' | 'production';
interface IOpts {
    config: IConfig;
    env: 'development' | 'production';
    targets?: object;
}
export declare function getBabelPresetOpts(opts: IOpts): {
    nodeEnv: "development" | "production";
    dynamicImportNode: boolean;
    autoCSSModules: boolean;
    svgr: boolean;
    env: {
        targets: object | undefined;
    };
    import: never[];
};
export declare function getBabelOpts({ cwd, config, presetOpts, }: {
    cwd: string;
    config: IConfig;
    presetOpts: object;
}): {
    presets: (string | Function | (string | object)[] | [string, any, (string | undefined)?])[];
    plugins: (string | Function | [string, any, (string | undefined)?])[];
    sourceType: string;
    babelrc: boolean;
    cacheDirectory: string | boolean;
};
export declare function getBabelDepsOpts({ env, cwd, config, }: {
    env: env;
    cwd: string;
    config: IConfig;
}): {
    presets: (string | {
        nodeEnv: env;
        dynamicImportNode: boolean;
    })[][];
    sourceType: string;
    babelrc: boolean;
    cacheDirectory: string | boolean;
};
export {};
