import { SemanticNode } from './semantic_node';
import { SemanticTree } from './semantic_tree';
export declare type Sexp = number | Sexp[];
export declare class SemanticSkeleton {
    array: Sexp;
    parents: {
        [key: number]: number[];
    };
    levelsMap: {
        [key: number]: Sexp[];
    };
    static fromTree(tree: SemanticTree): SemanticSkeleton;
    static fromNode(node: SemanticNode): SemanticSkeleton;
    static fromString(skel: string): SemanticSkeleton;
    static simpleCollapseStructure(strct: Sexp): boolean;
    static contentCollapseStructure(strct: Sexp): boolean;
    static interleaveIds(first: Sexp, second: Sexp): Sexp;
    static collapsedLeafs(...args: Sexp[]): number[];
    static fromStructure(mml: Element, tree: SemanticTree): SemanticSkeleton;
    static combineContentChildren<T>(semantic: SemanticNode, content: T[], children: T[]): T[];
    private static makeSexp_;
    private static fromString_;
    private static fromNode_;
    private static tree_;
    private static addOwns_;
    private static realLeafs_;
    constructor(skeleton: Sexp);
    populate(): void;
    toString(): string;
    private populate_;
    isRoot(id: number): boolean;
    directChildren(id: number): number[];
    subtreeNodes(id: number): number[];
}
