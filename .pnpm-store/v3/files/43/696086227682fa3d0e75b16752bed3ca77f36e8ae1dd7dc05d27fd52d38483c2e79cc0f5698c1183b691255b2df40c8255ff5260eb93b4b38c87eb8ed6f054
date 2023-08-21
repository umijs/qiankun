import { PropertyList } from '../../Tree/Node.js';
import { MmlNode, AbstractMmlNode } from '../MmlNode.js';
export declare class MmlMrow extends AbstractMmlNode {
    static defaults: PropertyList;
    protected _core: number;
    get kind(): string;
    get isSpacelike(): boolean;
    get isEmbellished(): boolean;
    core(): MmlNode;
    coreMO(): MmlNode;
    nonSpaceLength(): number;
    firstNonSpace(): MmlNode | null;
    lastNonSpace(): MmlNode | null;
    setTeXclass(prev: MmlNode): MmlNode;
}
export declare class MmlInferredMrow extends MmlMrow {
    static defaults: PropertyList;
    get kind(): string;
    get isInferred(): boolean;
    get notParent(): boolean;
    toString(): string;
}
