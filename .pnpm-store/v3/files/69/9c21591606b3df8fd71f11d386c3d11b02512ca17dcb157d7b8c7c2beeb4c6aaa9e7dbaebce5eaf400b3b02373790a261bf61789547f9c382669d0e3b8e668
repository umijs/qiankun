import { MathDocument, AbstractMathDocument, MathDocumentConstructor } from './MathDocument.js';
import { OptionList } from '../util/Options.js';
import { DOMAdaptor } from '../core/DOMAdaptor.js';
export interface Handler<N, T, D> {
    name: string;
    adaptor: DOMAdaptor<N, T, D>;
    priority: number;
    documentClass: MathDocumentConstructor<AbstractMathDocument<N, T, D>>;
    handlesDocument(document: any): boolean;
    create(document: any, options: OptionList): MathDocument<N, T, D>;
}
export declare abstract class AbstractHandler<N, T, D> implements Handler<N, T, D> {
    static NAME: string;
    adaptor: DOMAdaptor<N, T, D>;
    priority: number;
    documentClass: MathDocumentConstructor<AbstractMathDocument<N, T, D>>;
    constructor(adaptor: DOMAdaptor<N, T, D>, priority?: number);
    get name(): string;
    handlesDocument(_document: any): boolean;
    create(document: any, options: OptionList): MathDocument<N, T, D>;
}
