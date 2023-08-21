import { Compiler, ProgressPlugin } from '@umijs/bundler-webpack/compiled/webpack';
interface IOpts {
    name?: string;
}
declare class UmiProgressPlugin extends ProgressPlugin {
    options: IOpts;
    constructor(options?: IOpts);
    apply(compiler: Compiler): void;
    updateProgress(opts: {
        percent: number;
        message: string;
        details: any[];
    }): void;
}
export default UmiProgressPlugin;
