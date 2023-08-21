import { MmlNode } from '../../core/MmlTree/MmlNode.js';
import { ComplexityVisitor } from './visitor.js';
export declare type CollapseFunction = (node: MmlNode, complexity: number) => number;
export declare type CollapseFunctionMap = Map<string, CollapseFunction>;
export declare type TypeRole<T> = {
    [type: string]: T | {
        [role: string]: T;
    };
};
export declare class Collapse {
    static NOCOLLAPSE: number;
    complexity: ComplexityVisitor;
    cutoff: TypeRole<number>;
    marker: TypeRole<string>;
    collapse: CollapseFunctionMap;
    private idCount;
    constructor(visitor: ComplexityVisitor);
    check(node: MmlNode, complexity: number): number;
    protected defaultCheck(node: MmlNode, complexity: number, type: string): number;
    protected recordCollapse(node: MmlNode, complexity: number, text: string): number;
    protected unrecordCollapse(node: MmlNode): void;
    protected canUncollapse(node: MmlNode, n: number, m?: number): MmlNode | null;
    protected uncollapseChild(complexity: number, node: MmlNode, n: number, m?: number): number;
    protected splitAttribute(node: MmlNode, id: string): string[];
    protected getText(node: MmlNode): string;
    protected findChildText(node: MmlNode, id: string): string;
    protected findChild(node: MmlNode, id: string): MmlNode | null;
    makeCollapse(node: MmlNode): void;
    makeActions(nodes: MmlNode[]): void;
    private makeId;
    makeAction(node: MmlNode): void;
    addMrow(node: MmlNode): MmlNode;
}
