import { SemanticNode } from '../semantic_tree/semantic_node';
import { Sexp } from '../semantic_tree/semantic_skeleton';
import { SemanticTree } from '../semantic_tree/semantic_tree';
export declare const SETTINGS: {
    collapsed: boolean;
    implicit: boolean;
    wiki: boolean;
};
export declare function enrich(mml: Element, semantic: SemanticTree): Element;
export declare function walkTree(semantic: SemanticNode): Element;
export declare function introduceNewLayer(children: Element[], semantic: SemanticNode): Element;
export declare function introduceLayerAboveLca(mrow: Element, lca: Element, children: Element[]): Element;
export declare function moveSemanticAttributes_(oldNode: Element, newNode: Element): void;
export declare function childrenSubset_(node: Element, newChildren: Element[]): Element[];
export declare function collateChildNodes_(node: Element, children: Element[], semantic: SemanticNode): Element[];
export declare function collectChildNodes_(node: Element): Element[];
export declare function mergeChildren_(node: Element, newChildren: Element[], semantic: SemanticNode): void;
export declare function insertNewChild_(node: Element, oldChild: Element, newChild: Element): void;
export declare function isDescendant_(child: Node, node: Node): boolean;
export declare function functionApplication_(oldNode: Element, newNode: Element): boolean;
export declare enum lcaType {
    VALID = "valid",
    INVALID = "invalid",
    PRUNED = "pruned"
}
export declare function mathmlLca_(children: Element[]): {
    type: lcaType;
    node: Element;
};
export declare function prunePath_(path: Element[], children: Element[]): Element[];
export declare function attachedElement_(nodes: Element[]): Element;
export declare function pathToRoot_(node: Element, opt_test?: (p1: Element) => boolean): Element[];
export declare function validLca_(left: Element, right: Element): boolean;
export declare function ascendNewNode(newNode: Element): Element;
export declare function descendNode_(node: Element): Element;
export declare function unitChild_(node: Element): boolean;
export declare function isIgnorable_(node: Element): boolean;
export declare function parentNode_(element: Element): Element;
export declare function addCollapsedAttribute(node: Element, collapsed: Sexp): void;
export declare function cloneContentNode(content: SemanticNode): Element;
export declare function rewriteMfenced(mml: Element): Element;
export declare function createInvisibleOperator_(operator: SemanticNode): Element;
export declare function setOperatorAttribute_(semantic: SemanticNode, content: Element[]): void;
export declare function getInnerNode(node: Element): Element;
export declare function collapsePunctuated(semantic: SemanticNode, opt_children?: Element[]): Sexp;
export declare function printNodeList__(title: string, nodes: NodeList): void;
