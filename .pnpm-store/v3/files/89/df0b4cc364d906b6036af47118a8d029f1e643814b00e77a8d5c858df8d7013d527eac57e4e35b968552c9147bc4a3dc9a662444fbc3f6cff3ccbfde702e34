import { SemanticNode } from '../semantic_tree/semantic_node';
import { AbstractEnrichCase } from './abstract_enrich_case';
export declare class CaseEmbellished extends AbstractEnrichCase {
    fenced: SemanticNode;
    fencedMml: Element;
    fencedMmlNodes: Element[];
    ofence: SemanticNode;
    ofenceMml: Element;
    ofenceMap: {
        [key: number]: Element;
    };
    cfence: SemanticNode;
    cfenceMml: Element;
    cfenceMap: {
        [key: number]: Element;
    };
    parentCleanup: Element[];
    static test(semantic: SemanticNode): boolean;
    private static makeEmptyNode_;
    private static fencedMap_;
    constructor(semantic: SemanticNode);
    getMathml(): Element;
    private fencedElement;
    private getFenced_;
    private getFencedMml_;
    private getFencesMml_;
    private rewrite_;
    private specialCase_;
    private introduceNewLayer_;
    private fullFence;
    private cleanupParents_;
}
