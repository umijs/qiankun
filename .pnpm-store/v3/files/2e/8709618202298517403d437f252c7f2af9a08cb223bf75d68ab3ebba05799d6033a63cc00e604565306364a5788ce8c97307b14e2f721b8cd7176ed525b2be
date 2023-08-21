import { AuditoryDescription } from '../audio/auditory_description';
import { BaseRuleStore, RulesJson } from './base_rule_store';
export declare class MathStore extends BaseRuleStore {
    annotators: string[];
    constructor();
    initialize(): void;
    annotations(): void;
    defineAlias(name: string, prec: string, ...args: string[]): void;
    defineRulesAlias(name: string, query: string, ...args: string[]): void;
    defineSpecializedRule(name: string, oldDynamic: string, newDynamic: string, opt_action?: string): void;
    defineSpecialized(name: string, _old: string, dynamic: string): void;
    evaluateString(str: string): AuditoryDescription[];
    parse(ruleSet: RulesJson): void;
    private addAlias_;
    static regexp: {
        NUMBER: string;
        DECIMAL_MARK: string;
        DIGIT_GROUP: string;
    };
    private matchNumber_;
}
