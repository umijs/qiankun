import { Configuration } from '@umijs/bundler-webpack/compiled/webpack';
import { IConfig } from '../types';
interface IOpts {
    cwd: string;
    port?: number;
    host?: string;
    ip?: string;
    webpackConfig: Configuration;
    userConfig: IConfig;
    beforeMiddlewares?: any[];
    afterMiddlewares?: any[];
    onDevCompileDone?: Function;
    onProgress?: Function;
    onBeforeMiddleware?: Function;
}
export declare function createServer(opts: IOpts): Promise<any>;
export {};
