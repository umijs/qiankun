import { SymbolMap } from './SymbolMap.js';
import { ParseInput, ParseResult, ParseMethod } from './Types.js';
export declare type HandlerType = 'delimiter' | 'macro' | 'character' | 'environment';
export declare type HandlerConfig = {
    [P in HandlerType]?: string[];
};
export declare type FallbackConfig = {
    [P in HandlerType]?: ParseMethod;
};
export declare namespace MapHandler {
    let register: (map: SymbolMap) => void;
    let getMap: (name: string) => SymbolMap;
}
export declare class SubHandler {
    private _configuration;
    private _fallback;
    add(maps: string[], fallback: ParseMethod, priority?: number): void;
    parse(input: ParseInput): ParseResult;
    lookup<T>(symbol: string): T;
    contains(symbol: string): boolean;
    toString(): string;
    applicable(symbol: string): SymbolMap;
    retrieve(name: string): SymbolMap;
    private warn;
}
export declare class SubHandlers {
    private map;
    add(handlers: HandlerConfig, fallbacks: FallbackConfig, priority?: number): void;
    set(name: HandlerType, subHandler: SubHandler): void;
    get(name: HandlerType): SubHandler;
    retrieve(name: string): SymbolMap;
    keys(): IterableIterator<string>;
}
