import type { Compiler } from 'webpack';
export interface IBuildDepPluginOpts {
    onCompileDone: Function;
    onFileChange?: (c: Compiler) => Promise<any>;
    beforeCompile?: () => Promise<any>;
}
export declare class BuildDepPlugin {
    private opts;
    constructor(opts: IBuildDepPluginOpts);
    apply(compiler: Compiler): void;
}
