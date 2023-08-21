import { AbstractMathDocument } from '../../core/MathDocument.js';
import { OptionList } from '../../util/Options.js';
import { HTMLMathItem } from './HTMLMathItem.js';
import { HTMLDomStrings } from './HTMLDomStrings.js';
import { DOMAdaptor } from '../../core/DOMAdaptor.js';
import { InputJax } from '../../core/InputJax.js';
import { ProtoItem, Location } from '../../core/MathItem.js';
import { StyleList } from '../../util/StyleList.js';
export declare type HTMLNodeArray<N, T> = [N | T, number][][];
export declare class HTMLDocument<N, T, D> extends AbstractMathDocument<N, T, D> {
    static KIND: string;
    static OPTIONS: OptionList;
    protected styles: StyleList[];
    domStrings: HTMLDomStrings<N, T, D>;
    constructor(document: any, adaptor: DOMAdaptor<N, T, D>, options: OptionList);
    protected findPosition(N: number, index: number, delim: string, nodes: HTMLNodeArray<N, T>): Location<N, T>;
    protected mathItem(item: ProtoItem<N, T>, jax: InputJax<N, T, D>, nodes: HTMLNodeArray<N, T>): HTMLMathItem<N, T, D>;
    findMath(options: OptionList): this;
    updateDocument(): this;
    protected addPageElements(): void;
    addStyleSheet(): void;
    protected findSheet(head: N, id: string): N;
    removeFromDocument(restore?: boolean): this;
    documentStyleSheet(): N;
    documentPageElements(): N;
    addStyles(styles: StyleList): void;
    getStyles(): StyleList[];
}
