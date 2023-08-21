import type { CheerioAPI, Cheerio } from '.';
import { Node, Document } from '../domhandler';
import { CheerioOptions } from './options';
/**
 * Renders the document.
 *
 * @param options - Options for the renderer.
 * @returns The rendered document.
 */
export declare function html(this: CheerioAPI | void, options?: CheerioOptions): string;
/**
 * Renders the document.
 *
 * @param dom - Element to render.
 * @param options - Options for the renderer.
 * @returns The rendered document.
 */
export declare function html(this: CheerioAPI | void, dom?: string | ArrayLike<Node> | Node, options?: CheerioOptions): string;
/**
 * Render the document as XML.
 *
 * @param dom - Element to render.
 * @returns THe rendered document.
 */
export declare function xml(this: CheerioAPI, dom?: string | ArrayLike<Node> | Node): string;
/**
 * Render the document as text.
 *
 * @param elements - Elements to render.
 * @returns The rendered document.
 */
export declare function text(this: CheerioAPI | void, elements?: ArrayLike<Node>): string;
/**
 * Parses a string into an array of DOM nodes. The `context` argument has no
 * meaning for Cheerio, but it is maintained for API compatibility with jQuery.
 *
 * @param data - Markup that will be parsed.
 * @param context - Will be ignored. If it is a boolean it will be used as the
 *   value of `keepScripts`.
 * @param keepScripts - If false all scripts will be removed.
 * @returns The parsed DOM.
 * @alias Cheerio.parseHTML
 * @see {@link https://api.jquery.com/jQuery.parseHTML/}
 */
export declare function parseHTML(this: CheerioAPI, data: string, context?: unknown | boolean, keepScripts?: boolean): Node[];
export declare function parseHTML(this: CheerioAPI, data?: '' | null): null;
/**
 * Sometimes you need to work with the top-level root element. To query it, you
 * can use `$.root()`.
 *
 * @example
 *
 * ```js
 * $.root().append('<ul id="vegetables"></ul>').html();
 * //=> <ul id="fruits">...</ul><ul id="vegetables"></ul>
 * ```
 *
 * @returns Cheerio instance wrapping the root node.
 * @alias Cheerio.root
 */
export declare function root(this: CheerioAPI): Cheerio<Document>;
/**
 * Checks to see if the `contained` DOM element is a descendant of the
 * `container` DOM element.
 *
 * @param container - Potential parent node.
 * @param contained - Potential child node.
 * @returns Indicates if the nodes contain one another.
 * @alias Cheerio.contains
 * @see {@link https://api.jquery.com/jQuery.contains/}
 */
export declare function contains(container: Node, contained: Node): boolean;
interface WritableArrayLike<T> extends ArrayLike<T> {
    length: number;
    [n: number]: T;
}
/**
 * $.merge().
 *
 * @param arr1 - First array.
 * @param arr2 - Second array.
 * @returns `arr1`, with elements of `arr2` inserted.
 * @alias Cheerio.merge
 * @see {@link https://api.jquery.com/jQuery.merge/}
 */
export declare function merge<T>(arr1: WritableArrayLike<T>, arr2: ArrayLike<T>): ArrayLike<T> | undefined;
export {};
//# sourceMappingURL=static.d.ts.map