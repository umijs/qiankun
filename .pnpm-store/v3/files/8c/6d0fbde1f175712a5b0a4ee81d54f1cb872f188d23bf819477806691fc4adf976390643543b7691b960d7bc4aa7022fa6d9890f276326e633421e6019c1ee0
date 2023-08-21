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
 * @fileoverview  Implements the CommonMath wrapper mixin for the MmlMath object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AnyWrapper, WrapperConstructor, Constructor} from '../Wrapper.js';

/*****************************************************************/
/**
 * The CommonMath interface
 */
export interface CommonMath extends AnyWrapper {
}

/**
 * Shorthand for the CommonMath constructor
 */
export type MathConstructor = Constructor<CommonMath>;

/*****************************************************************/
/**
 *  The CommonMath wrapper mixin for the MmlMath object
 *
 * @template T  The Wrapper class constructor type
 */
export function CommonMathMixin<T extends WrapperConstructor>(Base: T): MathConstructor & T {

  return class extends Base {

    /**
     * @override
     */
    public getWrapWidth(_i: number) {
      return (this.parent ? this.getBBox().w : this.metrics.containerWidth / this.jax.pxPerEm);
    }

  };

}
