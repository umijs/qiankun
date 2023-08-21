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
 * @fileoverview  Implements the CommonMroot wrapper mixin for the MmlMroot object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {Constructor} from '../../common/Wrapper.js';
import {CommonMsqrt, MsqrtConstructor} from './msqrt.js';
import {CommonMo} from './mo.js';
import {BBox} from '../../../util/BBox.js';

/*****************************************************************/
/**
 * The CommonMroot interface
 */
export interface CommonMroot extends CommonMsqrt {
}

/**
 * Shorthand for the CommonMroot constructor
 */
export type MrootConstructor = Constructor<CommonMroot>;

/*****************************************************************/
/**
 * The CommonMroot wrapper mixin for the MmlMroot object (extends CommonMsqrt)
 *
 * @template T  The Wrapper class constructor type
 */
export function CommonMrootMixin<T extends MsqrtConstructor>(Base: T): MrootConstructor & T {

  return class extends Base {

    /**
     * @override
     */
    get surd() {
      return 2;
    }

    /**
     * @override
     */
    get root(): number {
      return 1;
    }

    /**
     * @override
     */
    public combineRootBBox(BBOX: BBox, sbox: BBox, H: number) {
      const bbox = this.childNodes[this.root].getOuterBBox();
      const h = this.getRootDimens(sbox, H)[1];
      BBOX.combine(bbox, 0, h);
    }

    /**
     * @override
     */
    public getRootDimens(sbox: BBox, H: number) {
      const surd = this.childNodes[this.surd] as CommonMo;
      const bbox = this.childNodes[this.root].getOuterBBox();
      const offset = (surd.size < 0 ? .5 : .6) * sbox.w;
      const {w, rscale} = bbox;
      const W = Math.max(w, offset / rscale);
      const dx = Math.max(0, W - w);
      const h = this.rootHeight(bbox, sbox, surd.size, H);
      const x = W * rscale - offset;
      return [x, h, dx];
    }

    /**
     * @param {BBox} rbox      The bbox of the root
     * @param {BBox} sbox      The bbox of the surd
     * @param {number} size    The size of the surd
     * @param {number} H       The height of the root as a whole
     * @return {number}        The height of the root within the surd
     */
    public rootHeight(rbox: BBox, sbox: BBox, size: number, H: number): number {
      const h = sbox.h + sbox.d;
      const b = (size < 0 ? 1.9 : .55 * h) - (h - H);
      return b + Math.max(0, rbox.d * rbox.rscale);
    }

  };

}
