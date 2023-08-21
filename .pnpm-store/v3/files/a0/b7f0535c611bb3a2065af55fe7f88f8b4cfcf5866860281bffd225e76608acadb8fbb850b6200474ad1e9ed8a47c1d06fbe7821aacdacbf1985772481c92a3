/// <reference types="koa-compose" />
import { Node as BabelNode } from '@babel/types';
import * as Koa from 'koa';
import { DefaultTreeNode as Parse5Node } from 'parse5';
import { Logger, LogLevel } from './support/logger';
export declare type HTMLASTTransform = (ast: Parse5Node) => Parse5Node;
export declare type HTMLSourceStrategy = (html: string, transform: HTMLASTTransform) => string;
export declare type HTMLParser = (html: string) => Parse5Node;
export declare type HTMLSerializer = (ast: Parse5Node) => string;
export declare type JSModuleASTTransform = (ast: BabelNode) => BabelNode;
export declare type JSModuleSourceStrategy = (js: string, transform: JSModuleASTTransform) => string;
export declare type JSParser = (js: string) => BabelNode;
export declare type JSSerializer = (ast: BabelNode) => string;
export declare type SpecifierTransform = (baseURL: string, specifier: string, logger: Logger) => string | undefined;
export declare type ModuleSpecifierTransformOptions = {
    logger?: Logger | false;
    logLevel?: LogLevel;
    htmlParser?: HTMLParser;
    htmlSerializer?: HTMLSerializer;
    jsParser?: JSParser;
    jsSerializer?: JSSerializer;
};
export declare const moduleSpecifierTransform: (specifierTransform: SpecifierTransform, options?: ModuleSpecifierTransformOptions) => import("koa-compose").Middleware<Koa.ParameterizedContext<any, {}>>;
//# sourceMappingURL=koa-module-specifier-transform.d.ts.map