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
 * @fileoverview  Implements the CommonTeXAtom wrapper mixin for the MmlTeXAtom object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AnyWrapper, WrapperConstructor, Constructor} from '../Wrapper.js';
import {BBox} from '../../../util/BBox.js';
import {TEXCLASS} from '../../../core/MmlTree/MmlNode.js';

/*****************************************************************/
/**
 * The CommonTeXAtom interface
 */
export interface CommonTeXAtom extends AnyWrapper {
}

/**
 * Shorthand for the CommonTeXAtom constructor
 */
export type TeXAtomConstructor = Constructor<CommonTeXAtom>;

/*****************************************************************/
/**
 * The CommonTeXAtom wrapper mixin for the TeXAtom object
 *
 * @template T  The Wrapper class constructor type
 */
export function CommonTeXAtomMixin<T extends WrapperConstructor>(Base: T): TeXAtomConstructor & T {

  return class extends Base {

    /**
     * @override
     */
    public computeBBox(bbox: BBox, recompute: boolean = false) {
      super.computeBBox(bbox, recompute);
      if (this.childNodes[0] && this.childNodes[0].bbox.ic) {
        bbox.ic = this.childNodes[0].bbox.ic;
      }
      //
      // Center VCENTER atoms vertically
      //
      if (this.node.texClass === TEXCLASS.VCENTER) {
        const {h, d} = bbox;
        const a = this.font.params.axis_height;
        const dh = ((h + d) / 2 + a) - h;  // new height minus old height
        bbox.h += dh;
        bbox.d -= dh;
      }
    }

  };

}
