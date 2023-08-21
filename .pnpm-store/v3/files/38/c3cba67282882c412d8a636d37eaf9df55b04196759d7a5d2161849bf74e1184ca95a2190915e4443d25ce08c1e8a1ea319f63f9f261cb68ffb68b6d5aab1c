import { MathDocument, MathDocumentConstructor } from '../../core/MathDocument.js';
import { Handler } from '../../core/Handler.js';
import { Safe } from './safe.js';
export declare type Constructor<T> = new (...args: any[]) => T;
export interface SafeMathDocument<N, T, D> extends MathDocument<N, T, D> {
    safe: Safe<N, T, D>;
}
export declare function SafeMathDocumentMixin<N, T, D, B extends MathDocumentConstructor<MathDocument<N, T, D>>>(BaseDocument: B): Constructor<SafeMathDocument<N, T, D>> & B;
export declare function SafeHandler<N, T, D>(handler: Handler<N, T, D>): Handler<N, T, D>;
