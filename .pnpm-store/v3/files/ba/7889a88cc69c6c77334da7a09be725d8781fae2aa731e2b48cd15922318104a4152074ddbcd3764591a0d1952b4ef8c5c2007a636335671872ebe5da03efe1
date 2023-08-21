export { assertTypes, clone, createDefer, deepClone, getCallLastIndex, getOwnProperties, getType, isObject, isPrimitive, noop, notNullish, objectAttr, parseRegexp, slash, toArray } from './helpers.js';
export { ArgumentsType, Arrayable, Awaitable, Constructable, DeepMerge, ErrorWithDiff, MergeInsertions, MutableArray, Nullable, ParsedStack } from './types.js';
import { PrettyFormatOptions } from 'pretty-format';

declare function stringify(object: unknown, maxDepth?: number, { maxLength, ...options }?: PrettyFormatOptions & {
    maxLength?: number;
}): string;

declare function getSafeTimers(): {
    nextTick: any;
    setTimeout: any;
    setInterval: any;
    clearInterval: any;
    clearTimeout: any;
    setImmediate: any;
    clearImmediate: any;
};
declare function setSafeTimers(): void;

declare function shuffle<T>(array: T[], seed?: number): T[];

interface LoupeOptions {
    showHidden?: boolean | undefined;
    depth?: number | null | undefined;
    colors?: boolean | undefined;
    customInspect?: boolean | undefined;
    showProxy?: boolean | undefined;
    maxArrayLength?: number | null | undefined;
    maxStringLength?: number | null | undefined;
    breakLength?: number | undefined;
    compact?: boolean | number | undefined;
    sorted?: boolean | ((a: string, b: string) => number) | undefined;
    getters?: 'get' | 'set' | boolean | undefined;
    numericSeparator?: boolean | undefined;
    truncate?: number;
}
declare function format(...args: unknown[]): string;
declare function inspect(obj: unknown, options?: LoupeOptions): any;
declare function objDisplay(obj: unknown, options?: LoupeOptions): string;

declare const SAFE_TIMERS_SYMBOL: unique symbol;
declare const SAFE_COLORS_SYMBOL: unique symbol;

declare const colorsMap: {
    readonly bold: readonly ["\u001B[1m", "\u001B[22m", "\u001B[22m\u001B[1m"];
    readonly dim: readonly ["\u001B[2m", "\u001B[22m", "\u001B[22m\u001B[2m"];
    readonly italic: readonly ["\u001B[3m", "\u001B[23m"];
    readonly underline: readonly ["\u001B[4m", "\u001B[24m"];
    readonly inverse: readonly ["\u001B[7m", "\u001B[27m"];
    readonly hidden: readonly ["\u001B[8m", "\u001B[28m"];
    readonly strikethrough: readonly ["\u001B[9m", "\u001B[29m"];
    readonly black: readonly ["\u001B[30m", "\u001B[39m"];
    readonly red: readonly ["\u001B[31m", "\u001B[39m"];
    readonly green: readonly ["\u001B[32m", "\u001B[39m"];
    readonly yellow: readonly ["\u001B[33m", "\u001B[39m"];
    readonly blue: readonly ["\u001B[34m", "\u001B[39m"];
    readonly magenta: readonly ["\u001B[35m", "\u001B[39m"];
    readonly cyan: readonly ["\u001B[36m", "\u001B[39m"];
    readonly white: readonly ["\u001B[37m", "\u001B[39m"];
    readonly gray: readonly ["\u001B[90m", "\u001B[39m"];
    readonly bgBlack: readonly ["\u001B[40m", "\u001B[49m"];
    readonly bgRed: readonly ["\u001B[41m", "\u001B[49m"];
    readonly bgGreen: readonly ["\u001B[42m", "\u001B[49m"];
    readonly bgYellow: readonly ["\u001B[43m", "\u001B[49m"];
    readonly bgBlue: readonly ["\u001B[44m", "\u001B[49m"];
    readonly bgMagenta: readonly ["\u001B[45m", "\u001B[49m"];
    readonly bgCyan: readonly ["\u001B[46m", "\u001B[49m"];
    readonly bgWhite: readonly ["\u001B[47m", "\u001B[49m"];
};
type ColorName = keyof typeof colorsMap;
type ColorsMethods = {
    [Key in ColorName]: {
        (input: unknown): string;
        open: string;
        close: string;
    };
};
type Colors = ColorsMethods & {
    isColorSupported: boolean;
    reset: (input: unknown) => string;
};
declare function getDefaultColors(): Colors;
declare function getColors(): Colors;
declare function createColors(isTTY?: boolean): Colors;
declare function setupColors(colors: Colors): void;

interface ErrorOptions {
    message?: string;
    stackTraceLimit?: number;
}
/**
 * Get original stacktrace without source map support the most performant way.
 * - Create only 1 stack frame.
 * - Rewrite prepareStackTrace to bypass "support-stack-trace" (usually takes ~250ms).
 */
declare function createSimpleStackTrace(options?: ErrorOptions): string;

declare const lineSplitRE: RegExp;
declare function positionToOffset(source: string, lineNumber: number, columnNumber: number): number;
declare function offsetToLineNumber(source: string, offset: number): number;

export { SAFE_COLORS_SYMBOL, SAFE_TIMERS_SYMBOL, createColors, createSimpleStackTrace, format, getColors, getDefaultColors, getSafeTimers, inspect, lineSplitRE, objDisplay, offsetToLineNumber, positionToOffset, setSafeTimers, setupColors, shuffle, stringify };
