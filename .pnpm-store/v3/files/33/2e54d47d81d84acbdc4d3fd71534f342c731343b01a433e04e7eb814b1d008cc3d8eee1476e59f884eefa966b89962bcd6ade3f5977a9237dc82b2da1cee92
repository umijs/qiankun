interface StripLiteralOptions {
    /**
     * Will be called for each string literal. Return false to skip stripping.
     */
    filter?: (s: string) => boolean;
    /**
     * Fill the stripped literal with this character.
     * It must be a single character.
     *
     * @default ' '
     */
    fillChar?: string;
}

/**
 * Strip literal using Acorn's tokenizer.
 *
 * Will throw error if the input is not valid JavaScript.
 */
declare function stripLiteralAcorn(code: string, options?: StripLiteralOptions): string;
/**
 * Returns a function that returns whether the position is
 * in a literal using Acorn's tokenizer.
 *
 * Will throw error if the input is not valid JavaScript.
 */
declare function createIsLiteralPositionAcorn(code: string): (position: number) => boolean;

/**
 * Strip literal using RegExp.
 *
 * This will be faster and can work on non-JavaScript input.
 * But will have some caveats on distinguish strings and comments.
 */
declare function stripLiteralRegex(code: string, options?: StripLiteralOptions): string;

/**
 * Strip literal from code.
 *
 * Using Acorn's tokenizer first, and fallback to Regex if Acorn fails.
 */
declare function stripLiteral(code: string, options?: StripLiteralOptions): string;
/**
 * Strip literal from code, return more detailed information.
 *
 * Using Acorn's tokenizer first, and fallback to Regex if Acorn fails.
 */
declare function stripLiteralDetailed(code: string, options?: StripLiteralOptions): {
    mode: 'acorn' | 'regex';
    result: string;
    acorn: {
        tokens: any[];
        error?: any;
    };
};

export { StripLiteralOptions, createIsLiteralPositionAcorn, stripLiteral, stripLiteralAcorn, stripLiteralDetailed, stripLiteralRegex };
