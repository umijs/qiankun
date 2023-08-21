import { Span } from '../audio/span';
import * as srf from './speech_rule_functions';
export declare class SpeechRuleContext {
    customQueries: srf.CustomQueries;
    customStrings: srf.CustomStrings;
    contextFunctions: srf.ContextFunctions;
    customGenerators: srf.CustomGenerators;
    applyCustomQuery(node: Node, funcName: string): Node[];
    applySelector(node: Node, expr: string): Node[];
    applyQuery(node: Node, expr: string): Node;
    applyConstraint(node: Node, expr: string): boolean;
    constructString(node: Node, expr: string): string | Span[];
    parse(functions: [string, srf.SpeechRuleFunction][] | {
        [key: string]: srf.SpeechRuleFunction;
    }): void;
}
