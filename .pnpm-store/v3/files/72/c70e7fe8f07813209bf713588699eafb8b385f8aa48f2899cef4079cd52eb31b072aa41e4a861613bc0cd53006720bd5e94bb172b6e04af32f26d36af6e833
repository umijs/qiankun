import { OptionList } from '../util/Options.js';
import { MathDocument } from './MathDocument.js';
import { MathItem } from './MathItem.js';
import { DOMAdaptor } from '../core/DOMAdaptor.js';
import { FunctionList } from '../util/FunctionList.js';
export interface OutputJax<N, T, D> {
    name: string;
    options: OptionList;
    postFilters: FunctionList;
    adaptor: DOMAdaptor<N, T, D>;
    setAdaptor(adaptor: DOMAdaptor<N, T, D>): void;
    initialize(): void;
    reset(...args: any[]): void;
    typeset(math: MathItem<N, T, D>, document?: MathDocument<N, T, D>): N;
    escaped(math: MathItem<N, T, D>, document?: MathDocument<N, T, D>): N;
    getMetrics(document: MathDocument<N, T, D>): void;
    styleSheet(document: MathDocument<N, T, D>): N;
    pageElements(document: MathDocument<N, T, D>): N;
}
export declare abstract class AbstractOutputJax<N, T, D> implements OutputJax<N, T, D> {
    static NAME: string;
    static OPTIONS: OptionList;
    options: OptionList;
    postFilters: FunctionList;
    adaptor: DOMAdaptor<N, T, D>;
    constructor(options?: OptionList);
    get name(): string;
    setAdaptor(adaptor: DOMAdaptor<N, T, D>): void;
    initialize(): void;
    reset(..._args: any[]): void;
    abstract typeset(math: MathItem<N, T, D>, document?: MathDocument<N, T, D>): N;
    abstract escaped(math: MathItem<N, T, D>, document?: MathDocument<N, T, D>): N;
    getMetrics(_document: MathDocument<N, T, D>): void;
    styleSheet(_document: MathDocument<N, T, D>): N;
    pageElements(_document: MathDocument<N, T, D>): N;
    protected executeFilters(filters: FunctionList, math: MathItem<N, T, D>, document: MathDocument<N, T, D>, data: any): any;
}
