import { InternalOptions } from './options';
import type { Node, Document } from '../domhandler';
import { BasicAcceptedElems } from './types';
import * as Attributes from './api/attributes';
import * as Traversing from './api/traversing';
import * as Manipulation from './api/manipulation';
import * as Css from './api/css';
import * as Forms from './api/forms';
declare type AttributesType = typeof Attributes;
declare type TraversingType = typeof Traversing;
declare type ManipulationType = typeof Manipulation;
declare type CssType = typeof Css;
declare type FormsType = typeof Forms;
export declare class Cheerio<T> implements ArrayLike<T> {
    length: number;
    [index: number]: T;
    options: InternalOptions;
    /**
     * The root of the document. Can be set by using the `root` argument of the constructor.
     *
     * @private
     */
    _root: Cheerio<Document> | undefined;
    /** @function */
    find: typeof Traversing.find;
    /**
     * Instance of cheerio. Methods are specified in the modules. Usage of this
     * constructor is not recommended. Please use $.load instead.
     *
     * @private
     * @param selector - The new selection.
     * @param context - Context of the selection.
     * @param root - Sets the root node.
     * @param options - Options for the instance.
     */
    constructor(selector?: T extends Node ? BasicAcceptedElems<T> : Cheerio<T> | T[], context?: BasicAcceptedElems<Node> | null, root?: BasicAcceptedElems<Document> | null, options?: InternalOptions);
    prevObject: Cheerio<Node> | undefined;
    /**
     * Make a cheerio object.
     *
     * @private
     * @param dom - The contents of the new object.
     * @param context - The context of the new object.
     * @returns The new cheerio object.
     */
    _make<T>(dom: Cheerio<T> | T[] | T | string, context?: BasicAcceptedElems<Node>): Cheerio<T>;
}
export interface Cheerio<T> extends AttributesType, TraversingType, ManipulationType, CssType, FormsType, Iterable<T> {
    cheerio: '[cheerio object]';
    splice: typeof Array.prototype.slice;
}
export {};
//# sourceMappingURL=cheerio.d.ts.map