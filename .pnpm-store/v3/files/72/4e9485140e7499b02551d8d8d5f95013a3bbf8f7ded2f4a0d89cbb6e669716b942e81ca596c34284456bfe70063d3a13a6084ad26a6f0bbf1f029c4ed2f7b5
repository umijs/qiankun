import { ParsedStack, ErrorWithDiff } from './types.js';

declare type GeneratedColumn = number;
declare type SourcesIndex = number;
declare type SourceLine = number;
declare type SourceColumn = number;
declare type NamesIndex = number;
declare type SourceMapSegment = [GeneratedColumn] | [GeneratedColumn, SourcesIndex, SourceLine, SourceColumn] | [GeneratedColumn, SourcesIndex, SourceLine, SourceColumn, NamesIndex];

interface SourceMapV3 {
    file?: string | null;
    names: string[];
    sourceRoot?: string;
    sources: (string | null)[];
    sourcesContent?: (string | null)[];
    version: 3;
}
interface EncodedSourceMap extends SourceMapV3 {
    mappings: string;
}
interface DecodedSourceMap extends SourceMapV3 {
    mappings: SourceMapSegment[][];
}
declare type OriginalMapping = {
    source: string | null;
    line: number;
    column: number;
    name: string | null;
};
declare type InvalidOriginalMapping = {
    source: null;
    line: null;
    column: null;
    name: null;
};
declare type GeneratedMapping = {
    line: number;
    column: number;
};
declare type InvalidGeneratedMapping = {
    line: null;
    column: null;
};
declare type Bias = typeof GREATEST_LOWER_BOUND | typeof LEAST_UPPER_BOUND;
declare type SourceMapInput = string | Ro<EncodedSourceMap> | Ro<DecodedSourceMap> | TraceMap;
declare type Needle = {
    line: number;
    column: number;
    bias?: Bias;
};
declare type SourceNeedle = {
    source: string;
    line: number;
    column: number;
    bias?: Bias;
};
declare abstract class SourceMap {
    version: SourceMapV3['version'];
    file: SourceMapV3['file'];
    names: SourceMapV3['names'];
    sourceRoot: SourceMapV3['sourceRoot'];
    sources: SourceMapV3['sources'];
    sourcesContent: SourceMapV3['sourcesContent'];
    resolvedSources: SourceMapV3['sources'];
}
declare type Ro<T> = T extends Array<infer V> ? V[] | Readonly<V[]> | RoArray<V> | Readonly<RoArray<V>> : T extends object ? T | Readonly<T> | RoObject<T> | Readonly<RoObject<T>> : T;
declare type RoArray<T> = Ro<T>[];
declare type RoObject<T> = {
    [K in keyof T]: T[K] | Ro<T[K]>;
};

declare const LEAST_UPPER_BOUND = -1;
declare const GREATEST_LOWER_BOUND = 1;
/**
 * A higher-level API to find the source/line/column associated with a generated line/column
 * (think, from a stack trace). Line is 1-based, but column is 0-based, due to legacy behavior in
 * `source-map` library.
 */
declare let originalPositionFor: (map: TraceMap, needle: Needle) => OriginalMapping | InvalidOriginalMapping;
/**
 * Finds the generated line/column position of the provided source/line/column source position.
 */
declare let generatedPositionFor: (map: TraceMap, needle: SourceNeedle) => GeneratedMapping | InvalidGeneratedMapping;
declare class TraceMap implements SourceMap {
    version: SourceMapV3['version'];
    file: SourceMapV3['file'];
    names: SourceMapV3['names'];
    sourceRoot: SourceMapV3['sourceRoot'];
    sources: SourceMapV3['sources'];
    sourcesContent: SourceMapV3['sourcesContent'];
    resolvedSources: string[];
    private _encoded;
    private _decoded;
    private _decodedMemo;
    private _bySources;
    private _bySourceMemos;
    constructor(map: SourceMapInput, mapUrl?: string | null);
}

interface StackTraceParserOptions {
    ignoreStackEntries?: (RegExp | string)[];
    getSourceMap?: (file: string) => unknown;
}
declare function parseSingleFFOrSafariStack(raw: string): ParsedStack | null;
declare function parseSingleStack(raw: string): ParsedStack | null;
declare function parseSingleV8Stack(raw: string): ParsedStack | null;
declare function parseStacktrace(stack: string, options?: StackTraceParserOptions): ParsedStack[];
declare function parseErrorStacktrace(e: ErrorWithDiff, options?: StackTraceParserOptions): ParsedStack[];

export { SourceMapInput, StackTraceParserOptions, TraceMap, generatedPositionFor, originalPositionFor, parseErrorStacktrace, parseSingleFFOrSafariStack, parseSingleStack, parseSingleV8Stack, parseStacktrace };
