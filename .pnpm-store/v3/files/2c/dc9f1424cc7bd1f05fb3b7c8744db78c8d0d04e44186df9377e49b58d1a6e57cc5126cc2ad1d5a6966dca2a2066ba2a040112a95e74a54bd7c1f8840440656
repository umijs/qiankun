import { DOMAdaptor } from '../core/DOMAdaptor.js';
import { OptionList } from '../util/Options.js';
export declare type Constructor<T> = (new (...args: any[]) => T);
export declare type AdaptorConstructor<N, T, D> = Constructor<DOMAdaptor<N, T, D>>;
export declare const NodeMixinOptions: OptionList;
export declare function NodeMixin<N, T, D, A extends AdaptorConstructor<N, T, D>>(Base: A, options?: typeof NodeMixinOptions): A;
