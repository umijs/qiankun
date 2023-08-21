export interface TrieNode {
    kind: TrieNodeKind;
    getConstraint(): string;
    getKind(): TrieNodeKind;
    applyTest(object: any): boolean;
    addChild(node: TrieNode): TrieNode | null;
    getChild(constraint: string): TrieNode | null;
    getChildren(): TrieNode[];
    findChildren(object: any): TrieNode[];
    removeChild(constraint: string): void;
}
export declare enum TrieNodeKind {
    ROOT = "root",
    DYNAMIC = "dynamic",
    QUERY = "query",
    BOOLEAN = "boolean",
    STATIC = "static"
}
