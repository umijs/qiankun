import { Handler } from '../core/Handler.js';
import { MathDocument, AbstractMathDocument, MathDocumentConstructor } from '../core/MathDocument.js';
import { MathItem, AbstractMathItem } from '../core/MathItem.js';
import { MmlNode } from '../core/MmlTree/MmlNode.js';
import { MathML } from '../input/mathml.js';
export declare type Constructor<T> = new (...args: any[]) => T;
export interface EnrichedMathItem<N, T, D> extends MathItem<N, T, D> {
    enrich(document: MathDocument<N, T, D>, force?: boolean): void;
    attachSpeech(document: MathDocument<N, T, D>): void;
}
export declare function EnrichedMathItemMixin<N, T, D, B extends Constructor<AbstractMathItem<N, T, D>>>(BaseMathItem: B, MmlJax: MathML<N, T, D>, toMathML: (node: MmlNode) => string): Constructor<EnrichedMathItem<N, T, D>> & B;
export interface EnrichedMathDocument<N, T, D> extends AbstractMathDocument<N, T, D> {
    enrich(): EnrichedMathDocument<N, T, D>;
    attachSpeech(): EnrichedMathDocument<N, T, D>;
    enrichError(doc: EnrichedMathDocument<N, T, D>, math: EnrichedMathItem<N, T, D>, err: Error): void;
}
export declare function EnrichedMathDocumentMixin<N, T, D, B extends MathDocumentConstructor<AbstractMathDocument<N, T, D>>>(BaseDocument: B, MmlJax: MathML<N, T, D>): MathDocumentConstructor<EnrichedMathDocument<N, T, D>> & B;
export declare function EnrichHandler<N, T, D>(handler: Handler<N, T, D>, MmlJax: MathML<N, T, D>): Handler<N, T, D>;
