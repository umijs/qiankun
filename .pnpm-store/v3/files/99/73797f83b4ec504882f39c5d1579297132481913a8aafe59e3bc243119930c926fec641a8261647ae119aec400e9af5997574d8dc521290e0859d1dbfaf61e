import { SemanticMeaningCollator } from './semantic_default';
import { SemanticNode } from './semantic_node';
import { SemanticParser } from './semantic_parser';
import './semantic_heuristics';
export declare class SemanticTree {
    mathml: Element;
    parser: SemanticParser<Element>;
    root: SemanticNode;
    collator: SemanticMeaningCollator;
    static empty(): SemanticTree;
    static fromNode(semantic: SemanticNode, opt_mathml?: Element): SemanticTree;
    static fromRoot(semantic: SemanticNode, opt_mathml?: Element): SemanticTree;
    static fromXml(xml: Element): SemanticTree;
    constructor(mathml: Element);
    xml(opt_brief?: boolean): Element;
    toString(opt_brief?: boolean): string;
    formatXml(opt_brief?: boolean): string;
    displayTree(): void;
    replaceNode(oldNode: SemanticNode, newNode: SemanticNode): void;
    toJson(): any;
}
