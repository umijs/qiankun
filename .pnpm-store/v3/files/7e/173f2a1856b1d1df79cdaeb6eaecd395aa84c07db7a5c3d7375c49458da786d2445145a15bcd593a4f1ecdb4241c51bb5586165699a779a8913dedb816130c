/*************************************************************
 *
 *  Copyright (c) 2022-2022 The MathJax Consortium
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
 * @fileoverview  Implements a mixin for node-based adaptors that overrides
 *                the methods that obtain DOM node sizes, when those aren't
 *                available from the DOM itself.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {DOMAdaptor} from '../core/DOMAdaptor.js';
import {userOptions, defaultOptions, OptionList} from '../util/Options.js';

/**
 * A constructor for a given class
 *
 * @template T   The class to construct
 */
export type Constructor<T> = (new(...args: any[]) => T);

/**
 * The type of an Adaptor class
 */
export type AdaptorConstructor<N, T, D> = Constructor<DOMAdaptor<N, T, D>>;

/**
 * The options to the NodeMixin
 */
export const NodeMixinOptions: OptionList = {
  badCSS: true,     // getComputedStyles() is not implemented in the DOM
  badSizes: true,   // element sizes (e.g., ClientWidth, etc.) are not implemented in the DOM
};

/**
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export function NodeMixin<N, T, D, A extends AdaptorConstructor<N, T, D>>(
  Base: A,
  options: typeof NodeMixinOptions = {}
): A {

  options = userOptions(defaultOptions({}, NodeMixinOptions), options);

  return class NodeAdaptor extends Base {

    /**
     * The default options
     */
    public static OPTIONS: OptionList = {
      ...(options.badCSS ? {
        fontSize: 16,          // We can't compute the font size, so always use this
        fontFamily: 'Times',   // We can't compute the font family, so always use this
      } : {}),
      ...(options.badSizes ? {
        cjkCharWidth: 1,       // Width (in em units) of full width characters
        unknownCharWidth: .6,  // Width (in em units) of unknown (non-full-width) characters
        unknownCharHeight: .8, // Height (in em units) of unknown characters
      } : {})
    };

    /**
     * Pattern to identify CJK (i.e., full-width) characters
     */
    public static cjkPattern = new RegExp([
      '[',
      '\u1100-\u115F', // Hangul Jamo
      '\u2329\u232A',  // LEFT-POINTING ANGLE BRACKET, RIGHT-POINTING ANGLE BRACKET
      '\u2E80-\u303E', // CJK Radicals Supplement ... CJK Symbols and Punctuation
      '\u3040-\u3247', // Hiragana ... Enclosed CJK Letters and Months
      '\u3250-\u4DBF', // Enclosed CJK Letters and Months ... CJK Unified Ideographs Extension A
      '\u4E00-\uA4C6', // CJK Unified Ideographs ... Yi Radicals
      '\uA960-\uA97C', // Hangul Jamo Extended-A
      '\uAC00-\uD7A3', // Hangul Syllables
      '\uF900-\uFAFF', // CJK Compatibility Ideographs
      '\uFE10-\uFE19', // Vertical Forms
      '\uFE30-\uFE6B', // CJK Compatibility Forms ... Small Form Variants
      '\uFF01-\uFF60\uFFE0-\uFFE6', // Halfwidth and Fullwidth Forms
      '\u{1B000}-\u{1B001}', // Kana Supplement
      '\u{1F200}-\u{1F251}', // Enclosed Ideographic Supplement
      '\u{20000}-\u{3FFFD}', // CJK Unified Ideographs Extension B ... Tertiary Ideographic Plane
      ']'
    ].join(''), 'gu');

    /**
     * The options for the instance
     */
    public options: OptionList;

    /**
     * @param {any} window          The window to work with
     * @param {OptionList} options  The options for the adaptor
     * @constructor
     */
    constructor(...args: any[]) {
      super(args[0]);
      let CLASS = this.constructor as typeof NodeAdaptor;
      this.options = userOptions(defaultOptions({}, CLASS.OPTIONS), args[1]);
    }

    /**
     * For DOMs that don't handle CSS well, use the font size from the options
     *
     * @override
     */
    public fontSize(node: N) {
      return (options.badCSS ? this.options.fontSize : super.fontSize(node));
    }

    /**
     * For DOMs that don't handle CSS well, use the font family from the options
     *
     * @override
     */
    public fontFamily(node: N) {
      return (options.badCSS ? this.options.fontFamily : super.fontFamily(node));
    }

    /**
     * @override
     */
    public nodeSize(node: N, em: number = 1, local: boolean = null) {
      if (!options.badSizes) {
        return super.nodeSize(node, em, local);
      }
      const text = this.textContent(node);
      const non = Array.from(text.replace(NodeAdaptor.cjkPattern, '')).length;  // # of non-CJK chars
      const CJK = Array.from(text).length - non;                                // # of cjk chars
      return [
        CJK * this.options.cjkCharWidth + non * this.options.unknownCharWidth,
        this.options.unknownCharHeight
      ] as [number, number];
    }

    /**
     * @override
     */
    public nodeBBox(node: N) {
      return (options.badSizes ? {left: 0, right: 0, top: 0, bottom: 0} : super.nodeBBox(node));
    }

  };

}
