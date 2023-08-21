import { AuditoryDescription } from '../audio/auditory_description';
import { Span } from '../audio/span';
declare abstract class FunctionsStore<S> {
    private prefix;
    private store;
    protected constructor(prefix: string, store: {
        [key: string]: S;
    });
    add(name: string, func: S): void;
    addStore(store: FunctionsStore<S>): void;
    lookup(name: string): S;
    private checkCustomFunctionSyntax_;
}
export declare type CustomQuery = (p1: Node) => Node[];
export declare class CustomQueries extends FunctionsStore<CustomQuery> {
    constructor();
}
export declare type CustomString = (p1: Node) => string | Span[];
export declare class CustomStrings extends FunctionsStore<CustomString> {
    constructor();
}
export declare type ContextFunction = (p1: Node[] | Node, p2: string | null) => () => string | AuditoryDescription[];
export declare class ContextFunctions extends FunctionsStore<ContextFunction> {
    constructor();
}
export declare type CustomGenerator = (store?: any, flag?: boolean) => string[] | void;
export declare class CustomGenerators extends FunctionsStore<CustomGenerator> {
    constructor();
}
export declare type SpeechRuleStore = CustomQueries | CustomStrings | ContextFunctions | CustomGenerators;
export declare type SpeechRuleFunction = CustomQuery | CustomString | ContextFunction | CustomGenerator;
export {};
