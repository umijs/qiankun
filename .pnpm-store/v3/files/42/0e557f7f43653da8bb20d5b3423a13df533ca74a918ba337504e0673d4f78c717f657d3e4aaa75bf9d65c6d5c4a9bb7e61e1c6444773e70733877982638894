import { MathDocumentConstructor } from '../../core/MathDocument.js';
import { MathItem } from '../../core/MathItem.js';
import { HTMLMathItem } from '../../handlers/html/HTMLMathItem.js';
import { HTMLDocument } from '../../handlers/html/HTMLDocument.js';
import { HTMLHandler } from '../../handlers/html/HTMLHandler.js';
export declare type Constructor<T> = new (...args: any[]) => T;
export declare type LazySet = Set<string>;
export declare class LazyList<N, T, D> {
    protected id: number;
    protected items: Map<string, LazyMathItem<N, T, D>>;
    add(math: LazyMathItem<N, T, D>): string;
    get(id: string): LazyMathItem<N, T, D>;
    delete(id: string): boolean;
}
export declare const LAZYID = "data-mjx-lazy";
export interface LazyMathItem<N, T, D> extends MathItem<N, T, D> {
    lazyCompile: boolean;
    lazyTypeset: boolean;
    lazyMarker: N;
    lazyTex: boolean;
}
export declare function LazyMathItemMixin<N, T, D, B extends Constructor<HTMLMathItem<N, T, D>>>(BaseMathItem: B): Constructor<LazyMathItem<N, T, D>> & B;
export interface LazyMathDocument<N, T, D> extends HTMLDocument<N, T, D> {
    lazyObserver: IntersectionObserver;
    lazyList: LazyList<N, T, D>;
    lazyAlwaysContainers: N[];
    lazyTypesetAll(): Promise<void>;
    lazyAlways(): void;
}
export declare function LazyMathDocumentMixin<N, T, D, B extends MathDocumentConstructor<HTMLDocument<N, T, D>>>(BaseDocument: B): MathDocumentConstructor<HTMLDocument<N, T, D>> & B;
export declare function LazyHandler<N, T, D>(handler: HTMLHandler<N, T, D>): HTMLHandler<N, T, D>;
