import { SemanticNode } from './semantic_node';
export declare const LEAFTAGS: string[];
export declare const IGNORETAGS: string[];
export declare const EMPTYTAGS: string[];
export declare const DISPLAYTAGS: string[];
export declare const directSpeechKeys: string[];
export declare function hasMathTag(node: Element): boolean;
export declare function hasLeafTag(node: Element): boolean;
export declare function hasIgnoreTag(node: Element): boolean;
export declare function hasEmptyTag(node: Element): boolean;
export declare function hasDisplayTag(node: Element): boolean;
export declare function isOrphanedGlyph(node: Element): boolean;
export declare function purgeNodes(nodes: Element[]): Element[];
export declare function isZeroLength(length: string): boolean;
export declare function addAttributes(to: SemanticNode, from: Element): void;
export declare function getEmbellishedInner(node: SemanticNode): SemanticNode;
export interface Slice {
    head: SemanticNode[];
    div: SemanticNode;
    tail: SemanticNode[];
}
export declare function sliceNodes(nodes: SemanticNode[], pred: (p1: SemanticNode) => boolean, opt_reverse?: boolean): Slice;
export interface Partition {
    rel: SemanticNode[];
    comp: SemanticNode[][];
}
export declare function partitionNodes(nodes: SemanticNode[], pred: (p1: SemanticNode) => boolean): Partition;
