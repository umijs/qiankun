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
 * @fileoverview  Implements the CommonTextNode wrapper mixin for the TextNode object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AnyWrapper, WrapperConstructor, Constructor} from '../Wrapper.js';
import {BBox} from '../../../util/BBox.js';
import {TextNode} from '../../../core/MmlTree/MmlNode.js';

/*****************************************************************/
/**
 * The CommonTextNode interface
 */
export interface CommonTextNode extends AnyWrapper {
  /**
   * @param {string} text     The text to remap
   * @param {string} variant  The variant for the character
   * @return {number[]}       The unicode points for the (remapped) text
   */
  remappedText(text: string, variant: string): number[];
}

/**
 * Shorthand for the CommonTextNode constructor
 */
export type TextNodeConstructor = Constructor<CommonTextNode>;

/*****************************************************************/
/**
 *  The CommonTextNode wrapper mixin for the TextNode object
 *
 * @template T  The Wrapper class constructor type
 */
export function CommonTextNodeMixin<T extends WrapperConstructor>(Base: T): TextNodeConstructor & T {

  return class extends Base {

    /**
     * @override
     */
    public computeBBox(bbox: BBox, _recompute: boolean = false) {
      const variant = this.parent.variant;
      const text = (this.node as TextNode).getText();
      if (variant === '-explicitFont') {
        //
        // Measure the size of the text (using the DOM if possible)
        //
        const font = this.jax.getFontData(this.parent.styles);
        const {w, h, d} = this.jax.measureText(text, variant, font);
        bbox.h = h;
        bbox.d = d;
        bbox.w = w;
      } else {
        const chars = this.remappedText(text, variant);
        bbox.empty();
        //
        // Loop through the characters and add them in one by one
        //
        for (const char of chars) {
          let [h, d, w, data] = this.getVariantChar(variant, char);
          if (data.unknown) {
            //
            // Measure unknown characters using the DOM (if possible)
            //
            const cbox = this.jax.measureText(String.fromCodePoint(char), variant);
            w = cbox.w;
            h = cbox.h;
            d = cbox.d;
          }
          //
          // Update the bounding box
          //
          bbox.w += w;
          if (h > bbox.h) bbox.h = h;
          if (d > bbox.d) bbox.d = d;
          bbox.ic = data.ic || 0;
          bbox.sk = data.sk || 0;
          bbox.dx = data.dx || 0;
        }
        if (chars.length > 1) {
          bbox.sk = 0;
        }
        bbox.clean();
      }
    }

    /**
     * @param {string} text     The text to remap
     * @param {string} variant  The variant for the character
     * @return {number[]}       The unicode points for the (remapped) text
     */
    public remappedText(text: string, variant: string): number[] {
      const c = this.parent.stretch.c;
      return (c ? [c] : this.parent.remapChars(this.unicodeChars(text, variant)));
    }

    /******************************************************/
    /*
     * TextNodes don't need these, since these properties
     *   are inherited from the parent nodes
     */

    /**
     * @override
     */
    public getStyles() {}

    /**
     * @override
     */
    public getVariant() {}

    /**
     * @override
     */
    public getScale() {}

    /**
     * @override
     */
    public getSpace() {}

  };

}
