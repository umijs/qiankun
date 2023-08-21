import { SemanticNode } from './semantic_node';
export declare class SemanticAnnotator {
    domain: string;
    name: string;
    func: (p1: SemanticNode) => any;
    active: boolean;
    constructor(domain: string, name: string, func: (p1: SemanticNode) => any);
    annotate(node: SemanticNode): void;
}
export declare class SemanticVisitor {
    domain: string;
    name: string;
    func: (p1: SemanticNode, p2: {
        [key: string]: any;
    }) => any;
    def: {
        [key: string]: any;
    };
    active: boolean;
    constructor(domain: string, name: string, func: (p1: SemanticNode, p2: {
        [key: string]: any;
    }) => any, def?: {
        [key: string]: any;
    });
    visit(node: SemanticNode, info: {
        [key: string]: any;
    }): any;
}
