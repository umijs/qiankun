import { Node, PropertyList } from './Node.js';
import { Factory, FactoryNodeClass, AbstractFactory } from './Factory.js';
export interface NodeFactory<N extends Node, C extends FactoryNodeClass<N>> extends Factory<N, C> {
    create(kind: string, properties?: PropertyList, children?: N[]): N;
}
export declare abstract class AbstractNodeFactory<N extends Node, C extends FactoryNodeClass<N>> extends AbstractFactory<N, C> {
    create(kind: string, properties?: PropertyList, children?: N[]): N;
}
