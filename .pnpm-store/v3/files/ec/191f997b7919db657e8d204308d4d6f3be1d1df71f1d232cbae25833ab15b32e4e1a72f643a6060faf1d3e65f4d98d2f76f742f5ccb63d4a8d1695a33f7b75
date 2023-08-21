import { Node } from './Node.js';
import { Wrapper, WrapperClass } from './Wrapper.js';
import { Factory, AbstractFactory } from './Factory.js';
export interface WrapperFactory<N extends Node, W extends Wrapper<N, W>, C extends WrapperClass<N, W>> extends Factory<W, C> {
    wrap(node: N, ...args: any[]): W;
}
export declare abstract class AbstractWrapperFactory<N extends Node, W extends Wrapper<N, W>, C extends WrapperClass<N, W>> extends AbstractFactory<W, C> implements WrapperFactory<N, W, C> {
    wrap(node: N, ...args: any[]): W;
}
