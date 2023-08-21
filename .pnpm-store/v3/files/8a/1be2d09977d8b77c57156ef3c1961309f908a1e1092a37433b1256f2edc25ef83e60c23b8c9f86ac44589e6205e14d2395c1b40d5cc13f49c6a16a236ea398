import { OptionList } from '../util/Options.js';
import { InputJax } from './InputJax.js';
import { OutputJax } from './OutputJax.js';
import { MathList } from './MathList.js';
import { MathItem } from './MathItem.js';
import { MmlNode } from './MmlTree/MmlNode.js';
import { MmlFactory } from '../core/MmlTree/MmlFactory.js';
import { DOMAdaptor } from '../core/DOMAdaptor.js';
import { BitField } from '../util/BitField.js';
import { PrioritizedList } from '../util/PrioritizedList.js';
export declare type RenderDoc<N, T, D> = (document: MathDocument<N, T, D>) => boolean;
export declare type RenderMath<N, T, D> = (math: MathItem<N, T, D>, document: MathDocument<N, T, D>) => boolean;
export declare type RenderData<N, T, D> = {
    id: string;
    renderDoc: RenderDoc<N, T, D>;
    renderMath: RenderMath<N, T, D>;
    convert: boolean;
};
export declare type RenderAction<N, T, D> = [
    number
] | [
    number,
    string
] | [
    number,
    string,
    string
] | [
    number,
    RenderDoc<N, T, D>,
    RenderMath<N, T, D>
] | [
    number,
    boolean
] | [
    number,
    string,
    boolean
] | [
    number,
    string,
    string,
    boolean
] | [
    number,
    RenderDoc<N, T, D>,
    RenderMath<N, T, D>,
    boolean
];
export declare type RenderActions<N, T, D> = {
    [id: string]: RenderAction<N, T, D>;
};
export declare class RenderList<N, T, D> extends PrioritizedList<RenderData<N, T, D>> {
    static create<N, T, D>(actions: RenderActions<N, T, D>): RenderList<N, T, D>;
    static action<N, T, D>(id: string, action: RenderAction<N, T, D>): [RenderData<N, T, D>, number];
    protected static methodActions(method1: string, method2?: string): ((math: any, document: any) => boolean)[];
    renderDoc(document: MathDocument<N, T, D>, start?: number): void;
    renderMath(math: MathItem<N, T, D>, document: MathDocument<N, T, D>, start?: number): void;
    renderConvert(math: MathItem<N, T, D>, document: MathDocument<N, T, D>, end?: number): void;
    findID(id: string): RenderData<N, T, D> | null;
}
export declare type ContainerList<N> = string | N | (string | N | N[])[];
export declare type ResetList = {
    all?: boolean;
    processed?: boolean;
    inputJax?: any[];
    outputJax?: any[];
};
export declare const resetOptions: ResetList;
export declare const resetAllOptions: ResetList;
export interface MathDocument<N, T, D> {
    document: D;
    kind: string;
    options: OptionList;
    math: MathList<N, T, D>;
    renderActions: RenderList<N, T, D>;
    processed: BitField;
    inputJax: InputJax<N, T, D>[];
    outputJax: OutputJax<N, T, D>;
    adaptor: DOMAdaptor<N, T, D>;
    mmlFactory: MmlFactory;
    addRenderAction(id: string, ...action: any[]): void;
    removeRenderAction(id: string): void;
    render(): MathDocument<N, T, D>;
    rerender(start?: number): MathDocument<N, T, D>;
    convert(math: string, options?: OptionList): MmlNode | N;
    findMath(options?: OptionList): MathDocument<N, T, D>;
    compile(): MathDocument<N, T, D>;
    getMetrics(): MathDocument<N, T, D>;
    typeset(): MathDocument<N, T, D>;
    updateDocument(): MathDocument<N, T, D>;
    removeFromDocument(restore?: boolean): MathDocument<N, T, D>;
    state(state: number, restore?: boolean): MathDocument<N, T, D>;
    reset(options?: ResetList): MathDocument<N, T, D>;
    clear(): MathDocument<N, T, D>;
    concat(list: MathList<N, T, D>): MathDocument<N, T, D>;
    clearMathItemsWithin(containers: ContainerList<N>): MathItem<N, T, D>[];
    getMathItemsWithin(elements: ContainerList<N>): MathItem<N, T, D>[];
}
export declare abstract class AbstractMathDocument<N, T, D> implements MathDocument<N, T, D> {
    static KIND: string;
    static OPTIONS: OptionList;
    static ProcessBits: typeof BitField;
    document: D;
    options: OptionList;
    math: MathList<N, T, D>;
    renderActions: RenderList<N, T, D>;
    processed: BitField;
    inputJax: InputJax<N, T, D>[];
    outputJax: OutputJax<N, T, D>;
    adaptor: DOMAdaptor<N, T, D>;
    mmlFactory: MmlFactory;
    constructor(document: D, adaptor: DOMAdaptor<N, T, D>, options: OptionList);
    get kind(): string;
    addRenderAction(id: string, ...action: any[]): void;
    removeRenderAction(id: string): void;
    render(): this;
    rerender(start?: number): this;
    convert(math: string, options?: OptionList): any;
    findMath(_options?: OptionList): this;
    compile(): this;
    protected compileMath(math: MathItem<N, T, D>): void;
    compileError(math: MathItem<N, T, D>, err: Error): void;
    typeset(): this;
    typesetError(math: MathItem<N, T, D>, err: Error): void;
    getMetrics(): this;
    updateDocument(): this;
    removeFromDocument(_restore?: boolean): this;
    state(state: number, restore?: boolean): this;
    reset(options?: ResetList): this;
    clear(): this;
    concat(list: MathList<N, T, D>): this;
    clearMathItemsWithin(containers: ContainerList<N>): MathItem<N, T, D>[];
    getMathItemsWithin(elements: ContainerList<N>): MathItem<N, T, D>[];
}
export interface MathDocumentConstructor<D extends MathDocument<any, any, any>> {
    KIND: string;
    OPTIONS: OptionList;
    ProcessBits: typeof BitField;
    new (...args: any[]): D;
}
