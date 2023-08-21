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
 * @fileoverview  Implements the CommonMpadded wrapper mixin for the MmlMpadded object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AnyWrapper, WrapperConstructor, Constructor} from '../Wrapper.js';
import {BBox} from '../../../util/BBox.js';
import {Property} from '../../../core/Tree/Node.js';

/*****************************************************************/
/**
 * The CommonMpadded interface
 */
export interface CommonMpadded extends AnyWrapper {
  /**
   * Get the content bounding box, and the change in size and offsets
   *   as specified by the parameters
   *
   * @return {number[]}  The original height, depth, width, the changes in height, depth,
   *                    and width, and the horizontal and vertical offsets of the content
   */
  getDimens(): number[];

  /**
   * Get a particular dimension, which can be relative to any of the BBox dimensions,
   *   and can be an offset from the default size of the given dimension.
   *
   * @param {Property} length   The value to be converted to a length in ems
   * @param {BBox} bbox         The bbox of the mpadded content
   * @param {string=} d         The default dimension to use for relative sizes ('w', 'h', or 'd')
   * @param {number=} m         The minimum value allowed for the dimension
   * @return {number}           The final dimension in ems
   */
  dimen(length: Property, bbox: BBox, d?: string, m?: number): number;
}

/**
 * Shorthand for the CommonMpadded constructor
 */
export type MpaddedConstructor = Constructor<CommonMpadded>;

/*****************************************************************/
/**
 * The CommomMpadded wrapper for the MmlMpadded object
 *
 * @template T  The Wrapper class constructor type
 */
export function CommonMpaddedMixin<T extends WrapperConstructor>(Base: T): MpaddedConstructor & T {

  return class extends Base {

    /**
     * Get the content bounding box, and the change in size and offsets
     *   as specified by the parameters
     *
     * @return {number[]}  The original height, depth, width, the changes in height, depth,
     *                    and width, and the horizontal and vertical offsets of the content
     */
    public getDimens(): number[] {
      const values = this.node.attributes.getList('width', 'height', 'depth', 'lspace', 'voffset');
      const bbox = this.childNodes[0].getBBox();  // get unmodified bbox of children
      let {w, h, d} = bbox;
      let W = w, H = h, D = d, x = 0, y = 0, dx = 0;
      if (values.width !== '')   w = this.dimen(values.width, bbox, 'w', 0);
      if (values.height !== '')  h = this.dimen(values.height, bbox, 'h', 0);
      if (values.depth !== '')   d = this.dimen(values.depth, bbox, 'd', 0);
      if (values.voffset !== '') y = this.dimen(values.voffset, bbox);
      if (values.lspace !== '')  x = this.dimen(values.lspace, bbox);
      const align = this.node.attributes.get('data-align') as string;
      if (align) {
        dx = this.getAlignX(w, bbox, align);
      }
      return [H, D, W, h - H, d - D, w - W, x, y, dx];
    }

    /**
     * Get a particular dimension, which can be relative to any of the BBox dimensions,
     *   and can be an offset from the default size of the given dimension.
     *
     * @param {Property} length   The value to be converted to a length in ems
     * @param {BBox} bbox         The bbox of the mpadded content
     * @param {string} d          The default dimension to use for relative sizes ('w', 'h', or 'd')
     * @param {number} m          The minimum value allowed for the dimension
     * @return {number}           The final dimension in ems
     */
    public dimen(length: Property, bbox: BBox, d: string = '', m: number = null): number {
      length = String(length);
      const match = length.match(/width|height|depth/);
      const size = (match ? bbox[match[0].charAt(0) as (keyof BBox)] :
                    (d ? bbox[d as (keyof BBox)] : 0)) as number;
      let dimen = (this.length2em(length, size) || 0);
      if (length.match(/^[-+]/) && d) {
        dimen += size;
      }
      if (m != null) {
        dimen = Math.max(m, dimen);
      }
      return dimen;
    }

    /**
     * @override
     */
    public computeBBox(bbox: BBox, recompute: boolean = false) {
      const [H, D, W, dh, dd, dw] = this.getDimens();
      bbox.w = W + dw;
      bbox.h = H + dh;
      bbox.d = D + dd;
      this.setChildPWidths(recompute, bbox.w);
    }

    /**
     * @override
     */
    public getWrapWidth(_i: number) {
      return this.getBBox().w;
    }

    /**
     * @override
     */
    public getChildAlign(_i: number) {
      return this.node.attributes.get('data-align') as string || 'left';
    }
  };

}
