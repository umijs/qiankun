import { SREError } from '../common/engine';
import { DynamicCstr } from './dynamic_cstr';
import * as Grammar from './grammar';
import { SpeechRuleContext } from './speech_rule_context';
export declare class SpeechRule {
    name: string;
    dynamicCstr: DynamicCstr;
    precondition: Precondition;
    action: Action;
    context: SpeechRuleContext;
    constructor(name: string, dynamicCstr: DynamicCstr, precondition: Precondition, action: Action);
    toString(): string;
}
export declare enum ActionType {
    NODE = "NODE",
    MULTI = "MULTI",
    TEXT = "TEXT",
    PERSONALITY = "PERSONALITY"
}
export interface ComponentType {
    type: ActionType;
    content?: string;
    attributes?: Attributes;
    grammar?: Grammar.State;
}
export declare class Component {
    type: ActionType;
    content: string;
    attributes: Attributes;
    grammar: Grammar.State;
    static grammarFromString(grammar: string): Grammar.State;
    static fromString(input: string): Component;
    static attributesFromString(attrs: string): {
        [key: string]: string | Grammar.State;
    };
    constructor({ type, content, attributes, grammar }: ComponentType);
    toString(): string;
    grammarToString(): string;
    getGrammar(): string[];
    attributesToString(): string;
    getAttributes(): string[];
}
declare type Attributes = {
    [key: string]: string;
};
export declare class Action {
    components: Component[];
    static fromString(input: string): Action;
    constructor(components: Component[]);
    toString(): string;
}
export declare class Precondition {
    query: string;
    private static queryPriorities;
    private static attributePriorities;
    constraints: string[];
    priority: number;
    rank: number;
    private static constraintValue;
    toString(): string;
    constructor(query: string, ...cstr: string[]);
    private calculatePriority;
    private presetPriority;
}
export declare class OutputError extends SREError {
    name: string;
    constructor(msg: string);
}
export {};
