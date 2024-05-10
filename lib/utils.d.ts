/// <reference types="lodash" />
import type { FrameworkConfiguration } from './interfaces';
export declare function toArray<T>(array: T | T[]): T[];
export declare function sleep(ms: number): Promise<unknown>;
/**
 * Run a callback before next task executing, and the invocation is idempotent in every singular task
 * That means even we called nextTask multi times in one task, only the first callback will be pushed to nextTick to be invoked.
 * @param cb
 */
export declare function nextTask(cb: () => void): void;
export declare function isConstructable(fn: () => any | FunctionConstructor): any;
export declare function isCallable(fn: any): boolean;
export declare function isPropertyFrozen(target: any, p?: PropertyKey): boolean;
export declare function isBoundedFunction(fn: CallableFunction): boolean | undefined;
export declare const isConstDestructAssignmentSupported: (() => boolean) & import("lodash").MemoizedFunction;
export declare const qiankunHeadTagName = "qiankun-head";
export declare function getDefaultTplWrapper(name: string, sandboxOpts: FrameworkConfiguration['sandbox']): (tpl: string) => string;
export declare function getWrapperId(name: string): string;
export declare const nativeGlobal: any;
export declare const nativeDocument: any;
/**
 * Get app instance name with the auto-increment approach
 * @param appName
 */
export declare const genAppInstanceIdByName: (appName: string) => string;
/** 校验子应用导出的 生命周期 对象是否正确 */
export declare function validateExportLifecycle(exports: any): boolean;
export declare class Deferred<T> {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
    constructor();
}
export declare function performanceGetEntriesByName(markName: string, type?: string): PerformanceEntryList | null;
export declare function performanceMark(markName: string): void;
export declare function performanceMeasure(measureName: string, markName: string): void;
export declare function isEnableScopedCSS(sandbox: FrameworkConfiguration['sandbox']): boolean;
/**
 * copy from https://developer.mozilla.org/zh-CN/docs/Using_XPath
 * @param el
 * @param document
 */
export declare function getXPathForElement(el: Node, document: Document): string | void;
export declare function getContainer(container: string | HTMLElement): HTMLElement | null;
export declare function getContainerXPath(container?: string | HTMLElement): string | void;
