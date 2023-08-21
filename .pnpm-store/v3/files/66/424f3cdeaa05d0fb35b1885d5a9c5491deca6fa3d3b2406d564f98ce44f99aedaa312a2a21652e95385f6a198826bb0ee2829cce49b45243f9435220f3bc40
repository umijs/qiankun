import { Handler } from '../core/Handler.js';
import { MathDocument, AbstractMathDocument, MathDocumentConstructor } from '../core/MathDocument.js';
import { MathItem, AbstractMathItem } from '../core/MathItem.js';
import { MmlNode } from '../core/MmlTree/MmlNode.js';
import { SerializedMmlVisitor } from '../core/MmlTree/SerializedMmlVisitor.js';
export declare class LimitedMmlVisitor extends SerializedMmlVisitor {
    protected getAttributes(node: MmlNode): string;
}
export declare type Constructor<T> = new (...args: any[]) => T;
export interface AssistiveMmlMathItem<N, T, D> extends MathItem<N, T, D> {
    assistiveMml(document: MathDocument<N, T, D>, force?: boolean): void;
}
export declare function AssistiveMmlMathItemMixin<N, T, D, B extends Constructor<AbstractMathItem<N, T, D>>>(BaseMathItem: B): Constructor<AssistiveMmlMathItem<N, T, D>> & B;
export interface AssistiveMmlMathDocument<N, T, D> extends AbstractMathDocument<N, T, D> {
    toMML: (node: MmlNode) => string;
    assistiveMml(): AssistiveMmlMathDocument<N, T, D>;
}
export declare function AssistiveMmlMathDocumentMixin<N, T, D, B extends MathDocumentConstructor<AbstractMathDocument<N, T, D>>>(BaseDocument: B): MathDocumentConstructor<AssistiveMmlMathDocument<N, T, D>> & B;
export declare function AssistiveMmlHandler<N, T, D>(handler: Handler<N, T, D>): Handler<N, T, D>;
