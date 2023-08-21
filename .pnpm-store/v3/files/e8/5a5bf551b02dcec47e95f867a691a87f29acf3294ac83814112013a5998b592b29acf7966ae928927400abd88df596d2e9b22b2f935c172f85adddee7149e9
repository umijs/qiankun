import { MathJaxObject as MJObject, MathJaxConfig as MJConfig } from './global.js';
import { MathDocument } from '../core/MathDocument.js';
import { MmlNode } from '../core/MmlTree/MmlNode.js';
import { Handler } from '../core/Handler.js';
import { InputJax } from '../core/InputJax.js';
import { OutputJax } from '../core/OutputJax.js';
import { CommonOutputJax } from '../output/common/OutputJax.js';
import { DOMAdaptor } from '../core/DOMAdaptor.js';
import { TeX } from '../input/tex.js';
export interface MathJaxConfig extends MJConfig {
    startup?: {
        input?: string[];
        output?: string;
        handler?: string;
        adaptor?: string;
        document?: any;
        elements?: any[];
        typeset?: boolean;
        ready?: () => void;
        pageReady?: () => void;
        invalidOption?: 'fatal' | 'warn';
        optionError?: (message: string, key: string) => void;
        [name: string]: any;
    };
}
export declare type MATHDOCUMENT = MathDocument<any, any, any>;
export declare type HANDLER = Handler<any, any, any>;
export declare type DOMADAPTOR = DOMAdaptor<any, any, any>;
export declare type INPUTJAX = InputJax<any, any, any>;
export declare type OUTPUTJAX = OutputJax<any, any, any>;
export declare type COMMONJAX = CommonOutputJax<any, any, any, any, any, any, any>;
export declare type TEX = TeX<any, any, any>;
export declare type HandlerExtension = (handler: HANDLER) => HANDLER;
export interface MathJaxObject extends MJObject {
    config: MathJaxConfig;
    startup: {
        constructors: {
            [name: string]: any;
        };
        input: INPUTJAX[];
        output: OUTPUTJAX;
        handler: HANDLER;
        adaptor: DOMADAPTOR;
        elements: any[];
        document: MATHDOCUMENT;
        promise: Promise<void>;
        registerConstructor(name: string, constructor: any): void;
        useHandler(name: string, force?: boolean): void;
        useAdaptor(name: string, force?: boolean): void;
        useOutput(name: string, force?: boolean): void;
        useInput(name: string, force?: boolean): void;
        extendHandler(extend: HandlerExtension): void;
        toMML(node: MmlNode): string;
        defaultReady(): void;
        defaultPageReady(): Promise<void>;
        getComponents(): void;
        makeMethods(): void;
        makeTypesetMethods(): void;
        makeOutputMethods(iname: string, oname: string, input: INPUTJAX): void;
        makeMmlMethods(name: string, input: INPUTJAX): void;
        makeResetMethod(name: string, input: INPUTJAX): void;
        getInputJax(): INPUTJAX[];
        getOutputJax(): OUTPUTJAX;
        getAdaptor(): DOMADAPTOR;
        getHandler(): HANDLER;
    };
    [name: string]: any;
}
export declare namespace Startup {
    const constructors: {
        [name: string]: any;
    };
    let input: INPUTJAX[];
    let output: OUTPUTJAX;
    let handler: HANDLER;
    let adaptor: DOMADAPTOR;
    let elements: any[];
    let document: MATHDOCUMENT;
    let promiseResolve: () => void;
    let promiseReject: (reason: any) => void;
    let promise: Promise<void>;
    let pagePromise: Promise<void>;
    function toMML(node: MmlNode): string;
    function registerConstructor(name: string, constructor: any): void;
    function useHandler(name: string, force?: boolean): void;
    function useAdaptor(name: string, force?: boolean): void;
    function useInput(name: string, force?: boolean): void;
    function useOutput(name: string, force?: boolean): void;
    function extendHandler(extend: HandlerExtension, priority?: number): void;
    function defaultReady(): void;
    function defaultPageReady(): Promise<void>;
    function getComponents(): void;
    function makeMethods(): void;
    function makeTypesetMethods(): void;
    function makeOutputMethods(iname: string, oname: string, input: INPUTJAX): void;
    function makeMmlMethods(name: string, input: INPUTJAX): void;
    function makeResetMethod(name: string, input: INPUTJAX): void;
    function getInputJax(): INPUTJAX[];
    function getOutputJax(): OUTPUTJAX;
    function getAdaptor(): DOMADAPTOR;
    function getHandler(): HANDLER;
    function getDocument(root?: any): MathDocument<any, any, any>;
}
export declare const MathJax: MathJaxObject;
export declare const CONFIG: {
    [name: string]: any;
    input?: string[];
    output?: string;
    handler?: string;
    adaptor?: string;
    document?: any;
    elements?: any[];
    typeset?: boolean;
    ready?: () => void;
    pageReady?: () => void;
    invalidOption?: 'fatal' | 'warn';
    optionError?: (message: string, key: string) => void;
};
