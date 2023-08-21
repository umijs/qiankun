import { Node } from './Node.js';
import { WrapperFactory } from './WrapperFactory.js';
export interface Wrapper<N extends Node, W extends Wrapper<N, W>> {
    node: N;
    readonly kind: string;
    wrap(node: N, ...args: any[]): W;
}
export interface WrapperClass<N extends Node, W extends Wrapper<N, W>> {
    new (factory: WrapperFactory<N, W, WrapperClass<N, W>>, node: N, ...args: any[]): W;
}
export declare class AbstractWrapper<N extends Node, W extends Wrapper<N, W>> implements Wrapper<N, W> {
    node: N;
    protected factory: WrapperFactory<N, W, WrapperClass<N, W>>;
    get kind(): string;
    constructor(factory: WrapperFactory<N, W, WrapperClass<N, W>>, node: N);
    wrap(node: N): W;
}
