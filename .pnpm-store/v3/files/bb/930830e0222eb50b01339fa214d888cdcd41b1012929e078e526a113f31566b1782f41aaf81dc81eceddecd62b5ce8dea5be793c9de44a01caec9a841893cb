import { Dep } from '../dep/dep';
import { MFSU } from '../mfsu/mfsu';
interface IOpts {
    mfsu: MFSU;
}
export declare class DepBuilder {
    opts: IOpts;
    completeFns: Function[];
    isBuilding: boolean;
    constructor(opts: IOpts);
    buildWithWebpack(opts: {
        onBuildComplete: Function;
        deps: Dep[];
    }): Promise<unknown>;
    buildWithESBuild(opts: {
        onBuildComplete: Function;
        deps: Dep[];
    }): Promise<void>;
    buildWithWorker(opts: {
        onBuildComplete: Function;
        deps: Dep[];
    }): Promise<void>;
    build(opts: {
        deps: Dep[];
        useWorker: boolean;
    }): Promise<void>;
    onBuildComplete(fn: Function): void;
    writeMFFiles(opts: {
        deps: Dep[];
    }): Promise<void>;
    getWebpackConfig(opts: {
        deps: Dep[];
    }): import("webpack").Configuration;
}
export {};
