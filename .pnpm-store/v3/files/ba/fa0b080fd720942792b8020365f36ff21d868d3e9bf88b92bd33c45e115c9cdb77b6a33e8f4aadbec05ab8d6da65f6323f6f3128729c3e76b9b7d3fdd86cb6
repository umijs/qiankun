import { MathDocument } from './MathDocument.js';
import { MathItem, ProtoItem } from './MathItem.js';
import { MmlNode } from './MmlTree/MmlNode.js';
import { MmlFactory } from './MmlTree/MmlFactory.js';
import { OptionList } from '../util/Options.js';
import { FunctionList } from '../util/FunctionList.js';
import { DOMAdaptor } from '../core/DOMAdaptor.js';
export interface InputJax<N, T, D> {
    name: string;
    processStrings: boolean;
    options: OptionList;
    preFilters: FunctionList;
    postFilters: FunctionList;
    adaptor: DOMAdaptor<N, T, D>;
    mmlFactory: MmlFactory;
    setAdaptor(adaptor: DOMAdaptor<N, T, D>): void;
    setMmlFactory(mmlFactory: MmlFactory): void;
    initialize(): void;
    reset(...args: any[]): void;
    findMath(which: N | string[], options?: OptionList): ProtoItem<N, T>[];
    compile(math: MathItem<N, T, D>, document: MathDocument<N, T, D>): MmlNode;
}
export declare abstract class AbstractInputJax<N, T, D> implements InputJax<N, T, D> {
    static NAME: string;
    static OPTIONS: OptionList;
    options: OptionList;
    preFilters: FunctionList;
    postFilters: FunctionList;
    adaptor: DOMAdaptor<N, T, D>;
    mmlFactory: MmlFactory;
    constructor(options?: OptionList);
    get name(): string;
    setAdaptor(adaptor: DOMAdaptor<N, T, D>): void;
    setMmlFactory(mmlFactory: MmlFactory): void;
    initialize(): void;
    reset(..._args: any[]): void;
    get processStrings(): boolean;
    findMath(_node: N | string[], _options?: OptionList): ProtoItem<N, T>[];
    abstract compile(math: MathItem<N, T, D>, document: MathDocument<N, T, D>): MmlNode;
    protected executeFilters(filters: FunctionList, math: MathItem<N, T, D>, document: MathDocument<N, T, D>, data: any): any;
}
