import type { ExtendedLoaderContext } from 'loader-runner';
import type { IApi } from '../../../types';
import type { IBundlessConfig } from '../../config';
type SourceMap = string | null | undefined;
export interface ILoaderOutput {
    content: string;
    options: {
        ext?: string;
        declaration?: boolean;
        map?: SourceMap;
    };
}
export interface ILoaderContext {
    /**
     * final bundless config
     */
    config: IBundlessConfig;
    /**
     * project package.json
     */
    pkg: IApi['pkg'];
}
/**
 * normal loader type (base on webpack loader)
 */
export type IBundlessLoader = (this: Omit<ExtendedLoaderContext, 'async'> & ILoaderContext & {
    cwd: string;
    itemDistAbsPath: string;
    /**
     * configure output options for current file
     */
    setOutputOptions: (options: ILoaderOutput['options']) => void;
    /**
     * complete async method type
     */
    async: () => (err: Error | null, result?: ILoaderOutput['content']) => void;
}, content: string) => ILoaderOutput['content'] | void;
type IJSTransformerResult = [ILoaderOutput['content'], SourceMap?];
/**
 * bundless transformer type
 */
export type IJSTransformer = (this: ILoaderContext & {
    paths: {
        cwd: string;
        fileAbsPath: string;
        itemDistAbsPath: string;
    };
}, content: Parameters<IBundlessLoader>[0]) => IJSTransformerResult | Promise<IJSTransformerResult>;
export {};
