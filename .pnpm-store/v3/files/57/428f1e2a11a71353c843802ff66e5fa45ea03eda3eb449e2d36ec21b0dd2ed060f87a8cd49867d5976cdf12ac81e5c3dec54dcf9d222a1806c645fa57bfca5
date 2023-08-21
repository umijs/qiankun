import Config from '@umijs/bundler-webpack/compiled/webpack-5-chain';
import { Env, IConfig } from '../types';
interface IOpts {
    config: Config;
    userConfig: IConfig;
    cwd: string;
    env: Env;
}
export declare function resolveDefine(opts: {
    define: any;
    publicPath?: string;
}): {
    'process.env': Record<string, any>;
};
export declare function addDefinePlugin(opts: IOpts): Promise<void>;
export {};
