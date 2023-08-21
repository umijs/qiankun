import { PropertyList } from '../../Tree/Node.js';
import { MmlNode, AbstractMmlNode, AttributeList } from '../MmlNode.js';
export declare class MmlMtr extends AbstractMmlNode {
    static defaults: PropertyList;
    get kind(): string;
    get linebreakContainer(): boolean;
    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean): void;
    protected verifyChildren(options: PropertyList): void;
    setTeXclass(prev: MmlNode): this;
}
export declare class MmlMlabeledtr extends MmlMtr {
    get kind(): string;
    get arity(): number;
}
