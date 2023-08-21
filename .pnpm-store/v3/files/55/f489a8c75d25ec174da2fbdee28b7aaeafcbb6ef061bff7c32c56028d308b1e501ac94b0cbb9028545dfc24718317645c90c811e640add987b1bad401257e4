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
 * @fileoverview  Implements the CommonMi wrapper mixin for the MmlMi object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AnyWrapper, WrapperConstructor, Constructor} from '../Wrapper.js';
import {BBox} from '../../../util/BBox.js';

/*****************************************************************/
/**
 * The CommonMi interface
 */
export interface CommonMi extends AnyWrapper {
}

/**
 * Shorthand for the CommonMi constructor
 */
export type MiConstructor = Constructor<CommonMi>;

/*****************************************************************/
/**
 *  The CommonMi wrapper mixin for the MmlMi object
 *
 * @template T  The Wrapper class constructor type
 */
export function CommonMiMixin<T extends WrapperConstructor>(Base: T): MiConstructor & T {

  return class extends Base {

    /**
     * @override
     */
    public computeBBox(bbox: BBox, _recompute: boolean = false) {
      super.computeBBox(bbox);
      this.copySkewIC(bbox);
    }
  };

}
