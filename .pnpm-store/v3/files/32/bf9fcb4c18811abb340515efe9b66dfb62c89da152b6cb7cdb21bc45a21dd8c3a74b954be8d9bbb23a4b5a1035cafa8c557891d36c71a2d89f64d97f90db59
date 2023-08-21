import { PropertyList } from '../../Tree/Node.js';
import { AbstractMmlNode, AbstractMmlBaseNode } from '../MmlNode.js';
export declare class MmlSemantics extends AbstractMmlBaseNode {
    static defaults: PropertyList;
    get kind(): string;
    get arity(): number;
    get notParent(): boolean;
}
export declare class MmlAnnotationXML extends AbstractMmlNode {
    static defaults: PropertyList;
    get kind(): string;
    protected setChildInheritedAttributes(): void;
}
export declare class MmlAnnotation extends MmlAnnotationXML {
    static defaults: {
        [x: string]: import("../../Tree/Node.js").Property;
    };
    properties: {
        isChars: boolean;
    };
    get kind(): string;
}
