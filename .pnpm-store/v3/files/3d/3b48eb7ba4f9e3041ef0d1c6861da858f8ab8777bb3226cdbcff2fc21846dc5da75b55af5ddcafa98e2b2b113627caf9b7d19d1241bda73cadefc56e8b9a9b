import { NodeFactory } from './NodeFactory.js';
export declare type Property = string | number | boolean;
export declare type PropertyList = {
    [key: string]: Property;
};
export interface Node {
    readonly kind: string;
    readonly factory: NodeFactory<Node, NodeClass>;
    parent: Node;
    childNodes: Node[];
    setProperty(name: string, value: Property): void;
    getProperty(name: string): Property;
    getPropertyNames(): string[];
    getAllProperties(): PropertyList;
    removeProperty(...names: string[]): void;
    isKind(kind: string): boolean;
    setChildren(children: Node[]): void;
    appendChild(child: Node): Node;
    replaceChild(newChild: Node, oldChild: Node): Node;
    removeChild(child: Node): Node;
    childIndex(child: Node): number;
    copy(): Node;
    findNodes(kind: string): Node[];
    walkTree(func: (node: Node, data?: any) => void, data?: any): void;
}
export interface NodeClass {
    new (factory: NodeFactory<Node, NodeClass>, properties?: PropertyList, children?: Node[]): Node;
}
export declare abstract class AbstractNode implements Node {
    readonly factory: NodeFactory<Node, NodeClass>;
    parent: Node;
    protected properties: PropertyList;
    childNodes: Node[];
    constructor(factory: NodeFactory<Node, NodeClass>, properties?: PropertyList, children?: Node[]);
    get kind(): string;
    setProperty(name: string, value: Property): void;
    getProperty(name: string): Property;
    getPropertyNames(): string[];
    getAllProperties(): PropertyList;
    removeProperty(...names: string[]): void;
    isKind(kind: string): boolean;
    setChildren(children: Node[]): void;
    appendChild(child: Node): Node;
    replaceChild(newChild: Node, oldChild: Node): Node;
    removeChild(child: Node): Node;
    childIndex(node: Node): number;
    copy(): AbstractNode;
    findNodes(kind: string): Node[];
    walkTree(func: (node: Node, data?: any) => void, data?: any): any;
    toString(): string;
}
export declare abstract class AbstractEmptyNode extends AbstractNode {
    setChildren(_children: Node[]): void;
    appendChild(child: Node): Node;
    replaceChild(_newChild: Node, oldChild: Node): Node;
    childIndex(_node: Node): number;
    walkTree(func: (node: Node, data?: any) => void, data?: any): any;
    toString(): string;
}
