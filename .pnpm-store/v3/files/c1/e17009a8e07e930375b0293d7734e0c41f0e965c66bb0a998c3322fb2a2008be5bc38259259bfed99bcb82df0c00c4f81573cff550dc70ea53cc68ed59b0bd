import { Nullable, Arrayable } from './types.js';

interface CloneOptions {
    forceWritable?: boolean;
}
declare function notNullish<T>(v: T | null | undefined): v is NonNullable<T>;
declare function assertTypes(value: unknown, name: string, types: string[]): void;
declare function isPrimitive(value: unknown): boolean;
declare function slash(path: string): string;
declare function parseRegexp(input: string): RegExp;
declare function toArray<T>(array?: Nullable<Arrayable<T>>): Array<T>;
declare function isObject(item: unknown): boolean;
declare function getType(value: unknown): string;
declare function getOwnProperties(obj: any): (string | symbol)[];
declare function deepClone<T>(val: T, options?: CloneOptions): T;
declare function clone<T>(val: T, seen: WeakMap<any, any>, options?: CloneOptions): T;
declare function noop(): void;
declare function objectAttr(source: any, path: string, defaultValue?: undefined): any;
type DeferPromise<T> = Promise<T> & {
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
};
declare function createDefer<T>(): DeferPromise<T>;
/**
 * If code starts with a function call, will return its last index, respecting arguments.
 * This will return 25 - last ending character of toMatch ")"
 * Also works with callbacks
 * ```
 * toMatch({ test: '123' });
 * toBeAliased('123')
 * ```
 */
declare function getCallLastIndex(code: string): number | null;

export { assertTypes, clone, createDefer, deepClone, getCallLastIndex, getOwnProperties, getType, isObject, isPrimitive, noop, notNullish, objectAttr, parseRegexp, slash, toArray };
