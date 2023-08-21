/*************************************************************
 *
 *  Copyright (c) 2018-2022 The MathJax Consortium
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
 * @fileoverview  Implements the CommonMn wrapper mixin for the MmlMn object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AnyWrapper, WrapperConstructor, Constructor} from '../Wrapper.js';

/*****************************************************************/
/**
 * The CommonMn interface
 */
export interface CommonMn extends AnyWrapper {
}

/**
 * Shorthand for the CommonMn constructor
 */
export type MnConstructor = Constructor<CommonMn>;

/*****************************************************************/
/**
 * The CommonMn wrapper mixin for the MmlMn object
 *
 * @template T  The Wrapper class constructor type
 */
export function CommonMnMixin<T extends WrapperConstructor>(Base: T): MnConstructor & T {

  return class extends Base {

    /**
     * @override
     */
    public remapChars(chars: number[]) {
      //
      //  Convert a leading hyphen to a minus
      //
      if (chars.length) {
        const text = this.font.getRemappedChar('mn', chars[0]);
        if (text) {
          const c = this.unicodeChars(text, this.variant);
          if (c.length === 1) {
            chars[0] = c[0];
          } else {
            chars = c.concat(chars.slice(1));
          }
        }
      }
      return chars;
    }
  };

}
