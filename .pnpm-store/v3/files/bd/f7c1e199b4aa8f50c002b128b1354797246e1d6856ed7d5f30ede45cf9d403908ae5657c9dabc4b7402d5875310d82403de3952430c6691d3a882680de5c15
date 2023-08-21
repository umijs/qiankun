export interface FactoryNode {
    readonly kind: string;
}
export interface FactoryNodeClass<N extends FactoryNode> {
    new (factory: Factory<N, FactoryNodeClass<N>>, ...args: any[]): N;
}
export interface Factory<N extends FactoryNode, C extends FactoryNodeClass<N>> {
    create(kind: string): N;
    setNodeClass(kind: string, nodeClass: C): void;
    getNodeClass(kind: string): C;
    deleteNodeClass(kind: string): void;
    nodeIsKind(node: N, kind: string): boolean;
    getKinds(): string[];
}
export declare abstract class AbstractFactory<N extends FactoryNode, C extends FactoryNodeClass<N>> implements Factory<N, C> {
    static defaultNodes: {};
    defaultKind: string;
    protected nodeMap: Map<string, C>;
    protected node: {
        [kind: string]: (...args: any[]) => N;
    };
    constructor(nodes?: {
        [kind: string]: C;
    });
    create(kind: string, ...args: any[]): N;
    setNodeClass(kind: string, nodeClass: C): void;
    getNodeClass(kind: string): C;
    deleteNodeClass(kind: string): void;
    nodeIsKind(node: N, kind: string): boolean;
    getKinds(): string[];
}
