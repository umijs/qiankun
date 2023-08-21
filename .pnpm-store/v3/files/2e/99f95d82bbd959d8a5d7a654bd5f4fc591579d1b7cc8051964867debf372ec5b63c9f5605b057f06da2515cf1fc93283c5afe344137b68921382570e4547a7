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
 * @fileoverview  Implements the CommonMspace wrapper mixin for the MmlMspace object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AnyWrapper, WrapperConstructor, Constructor} from '../Wrapper.js';
import {BBox} from '../../../util/BBox.js';

/*****************************************************************/
/**
 * The CommonMspance interface
 */
export interface CommonMspace extends AnyWrapper {
}

/**
 * Shorthand for the CommonMspace constructor
 */
export type MspaceConstructor = Constructor<CommonMspace>;

/*****************************************************************/
/**
 * The CommonMspace wrapper mixin for the MmlMspace object
 *
 * @template T  The Wrapper class constructor type
 */
export function CommonMspaceMixin<T extends WrapperConstructor>(Base: T): MspaceConstructor & T {

  return class extends Base {

    /**
     * @override
     */
    public computeBBox(bbox: BBox, _recompute: boolean = false) {
      const attributes = this.node.attributes;
      bbox.w = this.length2em(attributes.get('width'), 0);
      bbox.h = this.length2em(attributes.get('height'), 0);
      bbox.d = this.length2em(attributes.get('depth'), 0);
    }

    /**
     * No contents, so no need for variant class
     *
     * @override
     */
    public handleVariant() {
    }

  };

}
