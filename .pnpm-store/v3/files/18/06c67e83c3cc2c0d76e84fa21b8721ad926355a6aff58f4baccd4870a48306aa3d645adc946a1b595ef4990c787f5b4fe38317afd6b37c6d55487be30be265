import type { webpack } from '@umijs/types';
interface IOpts {
    sideEffects: string[];
    pkgPath: string;
}
/**
 * webpack plugin for add extra sideEffects item if user configured sideEffects in package.json
 */
export default class docSideEffectsWebpackPlugin {
    opts: IOpts;
    constructor(opts: IOpts);
    apply(compiler: webpack.Compiler): void;
}
export {};
