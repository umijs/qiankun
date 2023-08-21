declare type Value = boolean | string;
export declare type State = {
    [key: string]: Value;
};
interface Flags {
    adjust?: boolean;
    preprocess?: boolean;
    correct?: boolean;
    translate?: boolean;
}
export declare type Correction = (text: string, parameter?: Value) => string;
export declare const ATTRIBUTE = "grammar";
export declare class Grammar {
    private static instance;
    currentFlags: Flags;
    private parameters_;
    private corrections_;
    private preprocessors_;
    private stateStack_;
    static getInstance(): Grammar;
    static parseInput(grammar: string): State;
    static parseState(stateStr: string): State;
    private static translateString_;
    private static translateUnit_;
    private static prepareUnit_;
    private static cleanUnit_;
    clear(): void;
    setParameter(parameter: string, value: Value): Value;
    getParameter(parameter: string): Value;
    setCorrection(correction: string, func: Correction): void;
    setPreprocessor(preprocessor: string, func: Correction): void;
    getCorrection(correction: string): Correction;
    getState(): string;
    pushState(assignment: {
        [key: string]: Value;
    }): void;
    popState(): void;
    setAttribute(node: Element): void;
    preprocess(text: string): string;
    correct(text: string): string;
    apply(text: string, opt_flags?: Flags): string;
    private runProcessors_;
    private constructor();
}
export declare function numbersToAlpha(text: string): string;
export {};
