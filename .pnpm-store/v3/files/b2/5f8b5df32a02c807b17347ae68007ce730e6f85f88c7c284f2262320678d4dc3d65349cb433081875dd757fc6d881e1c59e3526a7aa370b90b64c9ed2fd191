import { AuditoryDescription } from '../audio/auditory_description';
import { SemanticType } from '../semantic_tree/semantic_meaning';
import { SemanticNode } from '../semantic_tree/semantic_node';
export declare function openingFraction(node: Element): string;
export declare function closingFraction(node: Element): string;
export declare function overFraction(node: Element): string;
export declare function overBevelledFraction(node: Element): string;
export declare function hyperFractionBoundary(node: Element): Element[];
export declare function nestedRadical(node: Element, postfix: string): string;
export declare function radicalNestingDepth(node: Element, opt_depth?: number): number;
export declare function openingRadical(node: Element): string;
export declare function closingRadical(node: Element): string;
export declare function indexRadical(node: Element): string;
export declare function enlargeFence(text: string): string;
export declare const NUMBER_PROPAGATORS_: SemanticType[];
export declare const NUMBER_INHIBITORS_: SemanticType[];
export declare function checkParent_(node: SemanticNode, info: {
    [key: string]: boolean;
}): boolean;
export declare function propagateNumber(node: SemanticNode, info: {
    [key: string]: any;
}): any[];
export declare function relationIterator(nodes: Element[], context: string): () => AuditoryDescription[];
export declare function implicitIterator(nodes: Element[], context: string): () => AuditoryDescription[];
