import { Combiner, Transformer } from '../l10n/transformers';
export declare enum Font {
    BOLD = "bold",
    BOLDFRAKTUR = "bold-fraktur",
    BOLDITALIC = "bold-italic",
    BOLDSCRIPT = "bold-script",
    DOUBLESTRUCK = "double-struck",
    FULLWIDTH = "fullwidth",
    FRAKTUR = "fraktur",
    ITALIC = "italic",
    MONOSPACE = "monospace",
    NORMAL = "normal",
    SCRIPT = "script",
    SANSSERIF = "sans-serif",
    SANSSERIFITALIC = "sans-serif-italic",
    SANSSERIFBOLD = "sans-serif-bold",
    SANSSERIFBOLDITALIC = "sans-serif-bold-italic"
}
export declare enum Embellish {
    SUPER = "super",
    SUB = "sub",
    CIRCLED = "circled",
    PARENTHESIZED = "parenthesized",
    PERIOD = "period",
    NEGATIVECIRCLED = "negative-circled",
    DOUBLECIRCLED = "double-circled",
    CIRCLEDSANSSERIF = "circled-sans-serif",
    NEGATIVECIRCLEDSANSSERIF = "negative-circled-sans-serif",
    COMMA = "comma",
    SQUARED = "squared",
    NEGATIVESQUARED = "negative-squared"
}
export declare enum Base {
    LATINCAP = "latinCap",
    LATINSMALL = "latinSmall",
    GREEKCAP = "greekCap",
    GREEKSMALL = "greekSmall",
    DIGIT = "digit"
}
export declare const Domains_: {
    [key: string]: string[];
};
export declare function makeDomains_(): void;
export declare function generate(locale: string): void;
export declare function makeInterval([a, b]: [string, string], subst: {
    [key: string]: string | boolean;
}): string[];
export declare function getFont(font: string): {
    font: string;
    combiner: Combiner;
};
export declare function alphabetRules(keys: string[], unicodes: string[], letters: string[], font: string, category: string, cap: boolean): void;
export declare function numberRules(keys: string[], unicodes: string[], font: string, category: string, offset: number): void;
export declare function makeLetter(combiner: Combiner, key: string, unicode: string, letter: string | number, font: string, prefixes: {
    [key: string]: string;
}, category: string, transformers: {
    [key: string]: Transformer;
}, domains: string[]): void;
export declare type Alphabet = {
    interval: [string, string];
    base: Base;
    subst: {
        [key: string]: string | boolean;
    };
    category: string;
    font: Font | Embellish;
    capital?: boolean;
    offset?: number;
};
export declare const INTERVALS: Alphabet[];
