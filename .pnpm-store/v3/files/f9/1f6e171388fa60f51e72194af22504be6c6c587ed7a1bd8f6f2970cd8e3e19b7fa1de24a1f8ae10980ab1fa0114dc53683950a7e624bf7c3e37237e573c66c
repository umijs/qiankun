import { SemanticNode } from '../semantic_tree/semantic_node';
export interface EnrichCase {
    getMathml(): Element;
}
export interface Case {
    test: (p1: SemanticNode) => boolean;
    constr: (p1: SemanticNode) => EnrichCase;
}
export declare function getCase(node: SemanticNode): EnrichCase;
export declare const factory: Case[];
