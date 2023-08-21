import { AbstractMathItem, Location } from '../../core/MathItem.js';
import { InputJax } from '../../core/InputJax.js';
import { HTMLDocument } from './HTMLDocument.js';
export declare class HTMLMathItem<N, T, D> extends AbstractMathItem<N, T, D> {
    get adaptor(): import("../../core/DOMAdaptor.js").DOMAdaptor<N, T, D>;
    constructor(math: string, jax: InputJax<N, T, D>, display?: boolean, start?: Location<N, T>, end?: Location<N, T>);
    updateDocument(_html: HTMLDocument<N, T, D>): void;
    updateStyleSheet(document: HTMLDocument<N, T, D>): void;
    removeFromDocument(restore?: boolean): void;
}
