import type { SandBox } from '../interfaces';
import { SandBoxType } from '../interfaces';
declare const globalVariableWhiteList: string[];
export declare const cachedGlobals: string[];
/**
 * 基于 Proxy 实现的沙箱
 */
export default class ProxySandbox implements SandBox {
    /** window 值变更记录 */
    private updatedValueSet;
    private document;
    name: string;
    type: SandBoxType;
    proxy: WindowProxy;
    sandboxRunning: boolean;
    latestSetProp: PropertyKey | null;
    active(): void;
    inactive(): void;
    patchDocument(doc: Document): void;
    globalWhitelistPrevDescriptor: {
        [p in (typeof globalVariableWhiteList)[number]]: PropertyDescriptor | undefined;
    };
    globalContext: typeof window;
    constructor(name: string, globalContext?: Window & typeof globalThis, opts?: {
        speedy: boolean;
    });
    private registerRunningApp;
}
export {};
