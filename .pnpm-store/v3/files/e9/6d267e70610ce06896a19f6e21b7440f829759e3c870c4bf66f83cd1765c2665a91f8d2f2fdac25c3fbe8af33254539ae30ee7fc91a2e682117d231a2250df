import { AuditoryDescription } from '../audio/auditory_description';
import { BaseRuleStore } from './base_rule_store';
import { RulesJson } from './base_rule_store';
import { DynamicCstr } from './dynamic_cstr';
import { State as GrammarState } from './grammar';
import { SpeechRule } from './speech_rule';
import { SpeechRuleContext } from './speech_rule_context';
import { Trie } from '../indexing/trie';
export declare class SpeechRuleEngine {
    private static instance;
    trie: Trie;
    private evaluators_;
    static getInstance(): SpeechRuleEngine;
    static debugSpeechRule(rule: SpeechRule, node: Node): void;
    static debugNamedSpeechRule(name: string, node: Node): void;
    evaluateNode(node: Element): AuditoryDescription[];
    toString(): string;
    runInSetting(settings: {
        [feature: string]: string | boolean;
    }, callback: () => AuditoryDescription[]): AuditoryDescription[];
    addStore(set: RulesJson): void;
    processGrammar(context: SpeechRuleContext, node: Node, grammar: GrammarState): void;
    addEvaluator(store: BaseRuleStore): void;
    getEvaluator(locale: string, modality: string): (p1: Node) => AuditoryDescription[];
    enumerate(opt_info?: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
    private constructor();
    private evaluateNode_;
    private evaluateTree_;
    private evaluateNodeList_;
    private addLayout;
    private addPersonality_;
    private addExternalAttributes_;
    private addRelativePersonality_;
    private updateConstraint_;
    private makeSet_;
    lookupRule(node: Node, dynamic: DynamicCstr): SpeechRule;
    lookupRules(node: Node, dynamic: DynamicCstr): SpeechRule[];
    private pickMostConstraint_;
}
export declare function storeFactory(set: RulesJson): BaseRuleStore;
