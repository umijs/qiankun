import { SpeechRule } from '../rule_engine/speech_rule';
import { TrieNode, TrieNodeKind } from './trie_node';
export declare class AbstractTrieNode<T> implements TrieNode {
    constraint: string;
    test: ((p1: T) => boolean) | null;
    kind: TrieNodeKind;
    private children_;
    constructor(constraint: string, test: ((p1: T) => boolean) | null);
    getConstraint(): string;
    getKind(): TrieNodeKind;
    applyTest(object: T): boolean;
    addChild(node: TrieNode): TrieNode;
    getChild(constraint: string): TrieNode;
    getChildren(): TrieNode[];
    findChildren(object: T): TrieNode[];
    removeChild(constraint: string): void;
    toString(): string;
}
export declare class StaticTrieNode extends AbstractTrieNode<Node> {
    private rule_;
    constructor(constraint: string, test: ((p1: Node) => boolean) | null);
    getRule(): SpeechRule | null;
    setRule(rule: SpeechRule): void;
    toString(): string;
}
