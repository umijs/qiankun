import { StackItem } from './StackItem.js';
import { Symbol } from './Symbol.js';
import TexParser from './TexParser.js';
export declare type Args = boolean | number | string | null;
export declare type Attributes = Record<string, Args>;
export declare type Environment = Record<string, Args>;
export declare type ParseInput = [TexParser, string];
export declare type ParseResult = void | boolean | StackItem;
export declare type ParseMethod = (parser: TexParser, c: string | Symbol | StackItem, ...rest: any[]) => ParseResult;
