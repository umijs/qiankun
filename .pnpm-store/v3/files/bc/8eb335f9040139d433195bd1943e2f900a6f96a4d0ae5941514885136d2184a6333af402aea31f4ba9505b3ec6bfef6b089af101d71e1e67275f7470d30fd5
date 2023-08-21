import { MathDocument } from './MathDocument.js';
import { InputJax } from './InputJax.js';
import { OptionList } from '../util/Options.js';
import { MmlNode } from './MmlTree/MmlNode.js';
export declare type Location<N, T> = {
    i?: number;
    n?: number;
    delim?: string;
    node?: N | T;
};
export declare type Metrics = {
    em: number;
    ex: number;
    containerWidth: number;
    lineWidth: number;
    scale: number;
};
export interface MathItem<N, T, D> {
    math: string;
    inputJax: InputJax<N, T, D>;
    display: boolean;
    isEscaped: boolean;
    start: Location<N, T>;
    end: Location<N, T>;
    root: MmlNode;
    typesetRoot: N;
    metrics: Metrics;
    inputData: OptionList;
    outputData: OptionList;
    render(document: MathDocument<N, T, D>): void;
    rerender(document: MathDocument<N, T, D>, start?: number): void;
    convert(document: MathDocument<N, T, D>, end?: number): void;
    compile(document: MathDocument<N, T, D>): void;
    typeset(document: MathDocument<N, T, D>): void;
    updateDocument(document: MathDocument<N, T, D>): void;
    removeFromDocument(restore: boolean): void;
    setMetrics(em: number, ex: number, cwidth: number, lwidth: number, scale: number): void;
    state(state?: number, restore?: boolean): number;
    reset(restore?: boolean): void;
}
export declare type ProtoItem<N, T> = {
    math: string;
    start: Location<N, T>;
    end: Location<N, T>;
    open?: string;
    close?: string;
    n?: number;
    display: boolean;
};
export declare function protoItem<N, T>(open: string, math: string, close: string, n: number, start: number, end: number, display?: boolean): ProtoItem<N, T>;
export declare abstract class AbstractMathItem<N, T, D> implements MathItem<N, T, D> {
    math: string;
    inputJax: InputJax<N, T, D>;
    display: boolean;
    start: Location<N, T>;
    end: Location<N, T>;
    root: MmlNode;
    typesetRoot: N;
    metrics: Metrics;
    inputData: OptionList;
    outputData: OptionList;
    protected _state: number;
    get isEscaped(): boolean;
    constructor(math: string, jax: InputJax<N, T, D>, display?: boolean, start?: Location<N, T>, end?: Location<N, T>);
    render(document: MathDocument<N, T, D>): void;
    rerender(document: MathDocument<N, T, D>, start?: number): void;
    convert(document: MathDocument<N, T, D>, end?: number): void;
    compile(document: MathDocument<N, T, D>): void;
    typeset(document: MathDocument<N, T, D>): void;
    updateDocument(_document: MathDocument<N, T, D>): void;
    removeFromDocument(_restore?: boolean): void;
    setMetrics(em: number, ex: number, cwidth: number, lwidth: number, scale: number): void;
    state(state?: number, restore?: boolean): number;
    reset(restore?: boolean): void;
}
export declare const STATE: {
    [state: string]: number;
};
export declare function newState(name: string, state: number): void;
