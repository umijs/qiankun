import { SemanticRole } from '../semantic_tree/semantic_meaning';
import { SemanticNode } from '../semantic_tree/semantic_node';
import { SemanticNodeFactory } from '../semantic_tree/semantic_node_factory';
import { Sexp } from '../semantic_tree/semantic_skeleton';
import { SemanticTree } from '../semantic_tree/semantic_tree';
export declare class RebuildStree {
    mathml: Element;
    factory: SemanticNodeFactory;
    nodeDict: {
        [key: string]: SemanticNode;
    };
    mmlRoot: Element;
    streeRoot: SemanticNode;
    stree: SemanticTree;
    xml: Element;
    static textContent(snode: SemanticNode, node: Element, ignore?: boolean): void;
    static isPunctuated(collapsed: Sexp): boolean;
    constructor(mathml: Element);
    getTree(): SemanticTree;
    assembleTree(node: Element): SemanticNode;
    makeNode(node: Element): SemanticNode;
    makePunctuation(id: number): SemanticNode;
    makePunctuated(snode: SemanticNode, collapsed: any, role: SemanticRole): void;
    makeEmpty(snode: SemanticNode, collapsed: number, role: SemanticRole): void;
    makeIndex(snode: SemanticNode, collapsed: Sexp, role: SemanticRole): void;
    postProcess(snode: SemanticNode, collapsed: string): SemanticNode;
    createNode(id: number): SemanticNode;
    private collapsedChildren_;
    private setParent;
}
