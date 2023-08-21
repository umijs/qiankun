/*************************************************************
 *
 *  Copyright (c) 2017-2022 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 * @fileoverview  Implements the CommonMs wrapper mixin for the MmlMs object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AnyWrapper, WrapperConstructor, Constructor} from '../Wrapper.js';

/*****************************************************************/
/**
 * The CommonMs interface
 */
export interface CommonMs extends AnyWrapper {
  /**
   * Create a text wrapper with the given text;
   *
   * @param {string} text  The text for the wrapped element
   * @return {CommonWrapper}   The wrapped text node
   */
  createText(text: string): AnyWrapper;
}

/**
 * Shorthand for the CommonMs constructor
 */
export type MsConstructor = Constructor<CommonMs>;

/*****************************************************************/
/**
 * The CommonMs wrapper mixin for the MmlMs object
 *
 * @template T  The Wrapper class constructor type
 */
export function CommonMsMixin<T extends WrapperConstructor>(Base: T): MsConstructor & T {

  return class extends Base {

    /**
     * Add the quote characters to the wrapper children so they will be output
     *
     * @override
     */
    constructor(...args: any[]) {
      super(...args);
      const attributes = this.node.attributes;
      let quotes = attributes.getList('lquote', 'rquote');
      if (this.variant !== 'monospace') {
        if (!attributes.isSet('lquote') && quotes.lquote === '"') quotes.lquote = '\u201C';
        if (!attributes.isSet('rquote') && quotes.rquote === '"') quotes.rquote = '\u201D';
      }
      this.childNodes.unshift(this.createText(quotes.lquote as string));
      this.childNodes.push(this.createText(quotes.rquote as string));
    }

    /**
     * Create a text wrapper with the given text;
     *
     * @param {string} text   The text for the wrapped element
     * @return {AnyWrapper}   The wrapped text node
     */
    public createText(text: string): AnyWrapper {
      const node = this.wrap(this.mmlText(text));
      node.parent = this;
      return node;
    }
  };

}
