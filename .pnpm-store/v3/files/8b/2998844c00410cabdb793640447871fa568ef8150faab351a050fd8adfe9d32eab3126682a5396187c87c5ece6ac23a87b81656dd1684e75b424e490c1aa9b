import { PropertyList } from '../../Tree/Node.js';
import { MmlNode, AbstractMmlNode, AttributeList } from '../MmlNode.js';
export declare class MmlMtable extends AbstractMmlNode {
    static defaults: PropertyList;
    properties: {
        useHeight: boolean;
    };
    protected texclass: number;
    get kind(): string;
    get linebreakContainer(): boolean;
    setInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean): void;
    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, _prime: boolean): void;
    protected verifyChildren(options: PropertyList): void;
    setTeXclass(prev: MmlNode): this;
}
