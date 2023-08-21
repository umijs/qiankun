import { PropertyList } from '../../Tree/Node.js';
import { AbstractMmlBaseNode, AttributeList } from '../MmlNode.js';
export declare class MmlMunderover extends AbstractMmlBaseNode {
    static defaults: PropertyList;
    protected static ACCENTS: string[];
    get kind(): string;
    get arity(): number;
    get base(): number;
    get under(): number;
    get over(): number;
    get linebreakContainer(): boolean;
    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean): void;
    protected getScriptlevel(accent: string, force: boolean, level: number): number;
    protected setInheritedAccent(n: number, accent: string, display: boolean, level: number, prime: boolean, force: boolean): void;
}
export declare class MmlMunder extends MmlMunderover {
    static defaults: PropertyList;
    get kind(): string;
    get arity(): number;
}
export declare class MmlMover extends MmlMunderover {
    static defaults: PropertyList;
    protected static ACCENTS: string[];
    get kind(): string;
    get arity(): number;
    get over(): number;
    get under(): number;
}
