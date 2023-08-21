import { AuditoryDescription } from '../audio/auditory_description';
import { AxisOrder, DynamicCstr, DynamicCstrParser } from './dynamic_cstr';
import { Action, Precondition, SpeechRule } from './speech_rule';
import { SpeechRuleContext } from './speech_rule_context';
import { SpeechRuleEvaluator } from './speech_rule_evaluator';
import { SpeechRuleFunction } from './speech_rule_functions';
import { SpeechRuleStore } from './speech_rule_store';
export declare abstract class BaseRuleStore implements SpeechRuleEvaluator, SpeechRuleStore {
    context: SpeechRuleContext;
    parseOrder: AxisOrder;
    parser: DynamicCstrParser;
    locale: string;
    modality: string;
    domain: string;
    parseMethods: any;
    initialized: boolean;
    inherits: BaseRuleStore;
    kind: string;
    customTranscriptions: {
        [key: string]: string;
    };
    protected preconditions: Map<string, Condition>;
    private speechRules_;
    private rank;
    private static compareStaticConstraints_;
    private static comparePreconditions_;
    constructor();
    defineRule(name: string, dynamic: string, action: string, prec: string, ...args: string[]): SpeechRule;
    addRule(rule: SpeechRule): void;
    deleteRule(rule: SpeechRule): void;
    findRule(pred: (rule: SpeechRule) => boolean): SpeechRule;
    findAllRules(pred: (rule: SpeechRule) => boolean): SpeechRule[];
    evaluateDefault(node: Node): AuditoryDescription[];
    evaluateWhitespace(_str: string): AuditoryDescription[];
    evaluateCustom(str: string): AuditoryDescription;
    evaluateCharacter(str: string): AuditoryDescription;
    abstract evaluateString(str: string): AuditoryDescription[];
    abstract initialize(): void;
    removeDuplicates(rule: SpeechRule): void;
    getSpeechRules(): SpeechRule[];
    setSpeechRules(rules: SpeechRule[]): void;
    getPreconditions(): Map<string, Condition>;
    parseCstr(cstr: string): DynamicCstr;
    parsePrecondition(query: string, rest: string[]): Precondition;
    parseAction(action: string): Action;
    parse(ruleSet: RulesJson): void;
    parseRules(rules: string[][]): void;
    generateRules(generator: string): void;
    defineAction(name: string, action: string): void;
    getFullPreconditions(name: string): Condition;
    definePrecondition(name: string, dynamic: string, prec: string, ...args: string[]): void;
    inheritRules(): void;
    ignoreRules(name: string, ...cstrs: string[]): void;
    private parsePrecondition_;
}
export declare class Condition {
    private base;
    private _conditions;
    private constraints;
    private allCstr;
    constructor(base: DynamicCstr, condition: Precondition);
    get conditions(): [DynamicCstr, Precondition][];
    addConstraint(dynamic: DynamicCstr): void;
    addBaseCondition(cond: Precondition): void;
    addFullCondition(cond: Precondition): void;
    private addCondition;
}
export interface RulesJson {
    modality?: string;
    domain?: string;
    locale?: string;
    kind?: string;
    inherits?: string;
    functions?: {
        [key: string]: SpeechRuleFunction;
    };
    rules?: any[];
    annotators?: any[];
}
