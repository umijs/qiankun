import { Attributes, Args, ParseMethod, ParseInput, ParseResult } from './Types.js';
import { Symbol, Macro } from './Symbol.js';
export interface SymbolMap {
    name: string;
    parser: ParseMethod;
    contains(symbol: string): boolean;
    parserFor(symbol: string): ParseMethod;
    parse([env, symbol]: ParseInput): ParseResult;
}
export declare function parseResult(result: ParseResult): ParseResult;
export declare abstract class AbstractSymbolMap<T> implements SymbolMap {
    private _name;
    private _parser;
    constructor(_name: string, _parser: ParseMethod);
    get name(): string;
    abstract contains(symbol: string): boolean;
    parserFor(symbol: string): ParseMethod;
    parse([env, symbol]: ParseInput): ParseResult;
    set parser(parser: ParseMethod);
    get parser(): ParseMethod;
    abstract lookup(symbol: string): T;
}
export declare class RegExpMap extends AbstractSymbolMap<string> {
    private _regExp;
    constructor(name: string, parser: ParseMethod, _regExp: RegExp);
    contains(symbol: string): boolean;
    lookup(symbol: string): string;
}
export declare abstract class AbstractParseMap<K> extends AbstractSymbolMap<K> {
    private map;
    lookup(symbol: string): K;
    contains(symbol: string): boolean;
    add(symbol: string, object: K): void;
    remove(symbol: string): void;
}
export declare class CharacterMap extends AbstractParseMap<Symbol> {
    constructor(name: string, parser: ParseMethod, json: {
        [index: string]: string | [string, Attributes];
    });
}
export declare class DelimiterMap extends CharacterMap {
    parse([env, symbol]: ParseInput): ParseResult;
}
export declare class MacroMap extends AbstractParseMap<Macro> {
    constructor(name: string, json: {
        [index: string]: string | Args[];
    }, functionMap: Record<string, ParseMethod>);
    parserFor(symbol: string): ParseMethod;
    parse([env, symbol]: ParseInput): ParseResult;
}
export declare class CommandMap extends MacroMap {
    parse([env, symbol]: ParseInput): ParseResult;
}
export declare class EnvironmentMap extends MacroMap {
    constructor(name: string, parser: ParseMethod, json: {
        [index: string]: string | Args[];
    }, functionMap: Record<string, ParseMethod>);
    parse([env, symbol]: ParseInput): ParseResult;
}
