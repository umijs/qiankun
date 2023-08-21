import { Node, NodeClass } from './Node.js';
import { NodeFactory } from './NodeFactory.js';
export declare type VisitorFunction = (visitor: NodeFactory<Node, NodeClass>, node: Node, ...args: any[]) => any;
export interface Visitor {
    visitTree(tree: Node, ...args: any[]): any;
    visitNode(node: Node, ...args: any[]): any;
    visitDefault(node: Node, ...args: any[]): any;
    setNodeHandler(kind: string, handler: VisitorFunction): void;
    removeNodeHandler(kind: string): void;
    [property: string]: any;
}
export declare abstract class AbstractVisitor implements Visitor {
    protected nodeHandlers: Map<string, VisitorFunction>;
    protected static methodName(kind: string): string;
    constructor(factory: NodeFactory<Node, NodeClass>);
    visitTree(tree: Node, ...args: any[]): any;
    visitNode(node: Node, ...args: any[]): any;
    visitDefault(node: Node, ...args: any[]): void;
    setNodeHandler(kind: string, handler: VisitorFunction): void;
    removeNodeHandler(kind: string): void;
}
