import { PropertyList } from '../../Tree/Node.js';
import { AbstractMmlBaseNode, AttributeList } from '../MmlNode.js';
export declare class MmlMsubsup extends AbstractMmlBaseNode {
    static defaults: PropertyList;
    get kind(): string;
    get arity(): number;
    get base(): number;
    get sub(): number;
    get sup(): number;
    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean): void;
}
export declare class MmlMsub extends MmlMsubsup {
    static defaults: PropertyList;
    get kind(): string;
    get arity(): number;
}
export declare class MmlMsup extends MmlMsubsup {
    static defaults: PropertyList;
    get kind(): string;
    get arity(): number;
    get sup(): number;
    get sub(): number;
}
