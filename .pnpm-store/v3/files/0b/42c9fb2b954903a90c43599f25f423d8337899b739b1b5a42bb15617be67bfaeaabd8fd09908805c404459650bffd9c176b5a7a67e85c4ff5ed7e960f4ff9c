import * as tr from './transformers';
export interface Messages {
    MS: {
        [msg: string]: string;
    };
    MSroots: {
        [msg: string]: string;
    };
    font: {
        [msg: string]: string | [string, string];
    };
    embellish: {
        [msg: string]: string | [string, string];
    };
    role: {
        [msg: string]: string | [string, string];
    };
    enclose: {
        [msg: string]: string | [string, string];
    };
    navigate: {
        [msg: string]: string;
    };
    regexp: {
        [msg: string]: string;
    };
    unitTimes: string;
}
export declare function MESSAGES(): Messages;
export interface Numbers {
    zero?: string;
    ones?: string[];
    tens?: string[];
    large?: string[];
    special?: {
        [key: string]: string | string[];
    };
    wordOrdinal: tr.Transformer;
    numericOrdinal: tr.Transformer;
    numberToWords: tr.Transformer;
    numberToOrdinal: tr.GrammarCase;
    vulgarSep: string;
    numSep: string;
}
export declare function NUMBERS(): Numbers;
export interface Alphabets {
    latinSmall: string[];
    latinCap: string[];
    greekSmall: string[];
    greekCap: string[];
    capPrefix: {
        [key: string]: string;
    };
    smallPrefix: {
        [key: string]: string;
    };
    digitPrefix: {
        [key: string]: string;
    };
    languagePrefix?: {
        [key: string]: string;
    };
    digitTrans: {
        [key: string]: tr.Transformer;
    };
    letterTrans: {
        [key: string]: tr.Transformer;
    };
    combiner: tr.Combiner;
}
export declare function ALPHABETS(): Alphabets;
export interface Functions {
    fracNestDepth: (node: Element) => boolean;
    radicalNestDepth: (count: number) => string;
    combineRootIndex: (name: string, index: string) => string;
    combineNestedFraction: tr.Combiner;
    combineNestedRadical: tr.Combiner;
    fontRegexp: (font: string) => RegExp;
    si: tr.SiCombiner;
    plural: tr.Transformer;
}
export declare function FUNCTIONS(): Functions;
export interface SubIso {
    default: string;
    current: string;
    all: string[];
}
export declare function SUBISO(): SubIso;
