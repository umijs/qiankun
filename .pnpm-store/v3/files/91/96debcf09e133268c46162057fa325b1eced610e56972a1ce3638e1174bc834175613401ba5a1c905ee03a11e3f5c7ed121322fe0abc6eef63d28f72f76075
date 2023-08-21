import { SpeechRuleContext } from '../rule_engine/speech_rule_context';
import { AbstractTrieNode } from './abstract_trie_node';
import { StaticTrieNode } from './abstract_trie_node';
import { TrieNode, TrieNodeKind } from './trie_node';
export declare function getNode(kind: TrieNodeKind, constraint: string, context: SpeechRuleContext): TrieNode | null;
export declare class RootTrieNode extends AbstractTrieNode<Node> {
    constructor();
}
export declare class DynamicTrieNode extends AbstractTrieNode<string> {
    constructor(constraint: string);
}
export declare function constraintTest_(constraint: string): ((p1: Node) => boolean) | null;
export declare class QueryTrieNode extends StaticTrieNode {
    private context;
    constructor(constraint: string, context: SpeechRuleContext);
    applyTest(object: Node): boolean;
}
export declare class BooleanTrieNode extends StaticTrieNode {
    private context;
    constructor(constraint: string, context: SpeechRuleContext);
    applyTest(object: Node): boolean;
}
