import { MmlFactory } from '../MmlFactory.js';
import { PropertyList } from '../../Tree/Node.js';
import { AbstractMmlBaseNode, MmlNode } from '../MmlNode.js';
export declare class TeXAtom extends AbstractMmlBaseNode {
    static defaults: PropertyList;
    protected texclass: number;
    get kind(): string;
    get arity(): number;
    get notParent(): boolean;
    constructor(factory: MmlFactory, attributes: PropertyList, children: MmlNode[]);
    setTeXclass(prev: MmlNode): MmlNode;
    adjustTeXclass(prev: MmlNode): MmlNode;
}
