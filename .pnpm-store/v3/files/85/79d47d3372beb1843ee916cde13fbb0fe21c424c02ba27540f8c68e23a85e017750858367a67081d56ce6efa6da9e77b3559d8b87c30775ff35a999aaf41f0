import type { Node } from '../../domhandler';
import type { Cheerio } from '../cheerio';
/**
 * Encode a set of form elements as a string for submission.
 *
 * @category Forms
 * @returns The serialized form.
 * @see {@link https://api.jquery.com/serialize/}
 */
export declare function serialize<T extends Node>(this: Cheerio<T>): string;
interface SerializedField {
    name: string;
    value: string;
}
/**
 * Encode a set of form elements as an array of names and values.
 *
 * @category Forms
 * @example
 *
 * ```js
 * $('<form><input name="foo" value="bar" /></form>').serializeArray();
 * //=> [ { name: 'foo', value: 'bar' } ]
 * ```
 *
 * @returns The serialized form.
 * @see {@link https://api.jquery.com/serializeArray/}
 */
export declare function serializeArray<T extends Node>(this: Cheerio<T>): SerializedField[];
export {};
//# sourceMappingURL=forms.d.ts.map