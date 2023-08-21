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
 * @fileoverview  Implements the CommonMfrac wrapper mixin for the MmlMfrac object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AnyWrapper, WrapperConstructor, Constructor} from '../Wrapper.js';
import {CommonMo} from './mo.js';
import {BBox} from '../../../util/BBox.js';
import {DIRECTION} from '../FontData.js';

/*****************************************************************/
/**
 * The CommonMfrac interface
 */
export interface CommonMfrac extends AnyWrapper {
  /**
   * @param {BBox} bbox        The buonding box to modify
   * @param {boolean} display  True for display-mode fractions
   * @param {number} t         The thickness of the line
   */
  getFractionBBox(bbox: BBox, display: boolean, t: number): void;

  /**
   * @param {boolean} display  True for display-mode fractions
   * @param {number} t         The thickness of the line
   * @return {Object}          The expanded rule thickness (T), and baseline offsets
   *                             for numerator and denomunator (u and v)
   */
  getTUV(display: boolean, t: number): {T: number, u: number, v: number};

  /**
   * @param {BBox} bbox        The bounding box to modify
   * @param {boolean} display  True for display-mode fractions
   */
  getAtopBBox(bbox: BBox, display: boolean): void;

  /**
   * @param {boolean} display  True for diplay-mode fractions
   * @return {Object}
   *    The vertical offsets of the numerator (u), the denominator (v),
   *    the separation between the two, and the bboxes themselves.
   */
  getUVQ(display: boolean): {u: number, v: number, q: number, nbox: BBox, dbox: BBox};

  /**
   * @param {BBox} bbox        The boundng box to modify
   * @param {boolean} display  True for display-mode fractions
   */
  getBevelledBBox(bbox: BBox, display: boolean): void;

  /**
   * @param {boolean} display  True for display-style fractions
   * @return {Object}          The height (H) of the bevel, horizontal offest (delta)
   *                             vertical offsets (u and v) of the parts, and
   *                             bounding boxes of the parts.
   */
  getBevelData(display: boolean): {H: number, delta: number, u: number, v: number, nbox: BBox, dbox: BBox};

  /**
   * @return {boolean}   True if in display mode, false otherwise
   */
  isDisplay(): boolean;
}

/**
 * Shorthand for the CommonMfrac constructor
 */
export type MfracConstructor = Constructor<CommonMfrac>;

/*****************************************************************/
/**
 * The CommonMfrac wrapper mixin for the MmlMfrac object
 *
 * @template T  The Wrapper class constructor type
 */
export function CommonMfracMixin<T extends WrapperConstructor>(Base: T): MfracConstructor & T {

  return class extends Base {

    /**
     * Wrapper for <mo> to use for bevelled fraction
     */
    public bevel: CommonMo = null;

    /**
     * Padding around fractions
     */
    public pad: number;

    /************************************************/

    /**
     * @override
     * @constructor
     */
    constructor(...args: any[]) {
      super(...args);
      this.pad = (this.node.getProperty('withDelims') as boolean ? 0 : this.font.params.nulldelimiterspace);
      //
      //  create internal bevel mo element
      //
      if (this.node.attributes.get('bevelled')) {
        const {H} = this.getBevelData(this.isDisplay());
        const bevel = this.bevel = this.createMo('/') as CommonMo;
        bevel.node.attributes.set('symmetric', true);
        bevel.canStretch(DIRECTION.Vertical);
        bevel.getStretchedVariant([H], true);
      }
    }

    /**
     * @override
     */
    public computeBBox(bbox: BBox, recompute: boolean = false) {
      bbox.empty();
      const {linethickness, bevelled} = this.node.attributes.getList('linethickness', 'bevelled');
      const display = this.isDisplay();
      let w = null as (number | null);
      if (bevelled) {
        this.getBevelledBBox(bbox, display);
      } else {
        const thickness = this.length2em(String(linethickness), .06);
        w = -2 * this.pad;
        if (thickness === 0) {
          this.getAtopBBox(bbox, display);
        } else {
          this.getFractionBBox(bbox, display, thickness);
          w -= .2;
        }
        w += bbox.w;
      }
      bbox.clean();
      this.setChildPWidths(recompute, w);
    }

    /************************************************/

    /**
     * @param {BBox} bbox        The buonding box to modify
     * @param {boolean} display  True for display-mode fractions
     * @param {number} t         The thickness of the line
     */
    public getFractionBBox(bbox: BBox, display: boolean, t: number) {
      const nbox = this.childNodes[0].getOuterBBox();
      const dbox = this.childNodes[1].getOuterBBox();
      const tex = this.font.params;
      const a = tex.axis_height;
      const {T, u, v} = this.getTUV(display, t);
      bbox.combine(nbox, 0, a + T + Math.max(nbox.d * nbox.rscale, u));
      bbox.combine(dbox, 0, a - T - Math.max(dbox.h * dbox.rscale, v));
      bbox.w += 2 * this.pad + .2;
    }

    /**
     * @param {boolean} display  True for display-mode fractions
     * @param {number} t         The thickness of the line
     * @return {Object}          The expanded rule thickness (T), and baseline offsets
     *                             for numerator and denomunator (u and v)
     */
    public getTUV(display: boolean, t: number): {T: number, u: number, v: number} {
      const tex = this.font.params;
      const a = tex.axis_height;
      const T = (display ? 3.5 : 1.5) * t;
      return {T: (display ? 3.5 : 1.5) * t,
              u: (display ? tex.num1 : tex.num2) - a - T,
              v: (display ? tex.denom1 : tex.denom2) + a - T};
    }

    /************************************************/

    /**
     * @param {BBox} bbox        The bounding box to modify
     * @param {boolean} display  True for display-mode fractions
     */
    public getAtopBBox(bbox: BBox, display: boolean) {
      const {u, v, nbox, dbox} = this.getUVQ(display);
      bbox.combine(nbox, 0, u);
      bbox.combine(dbox, 0, -v);
      bbox.w += 2 * this.pad;
    }

    /**
     * @param {boolean} display  True for diplay-mode fractions
     * @return {Object}
     *    The vertical offsets of the numerator (u), the denominator (v),
     *    the separation between the two, and the bboxes themselves.
     */
    public getUVQ(display: boolean): {u: number, v: number, q: number, nbox: BBox, dbox: BBox} {
      const nbox = this.childNodes[0].getOuterBBox();
      const dbox = this.childNodes[1].getOuterBBox();
      const tex = this.font.params;
      //
      //  Initial offsets (u, v)
      //  Minimum separation (p)
      //  Actual separation with initial positions (q)
      //
      let [u, v] = (display ? [tex.num1, tex.denom1] : [tex.num3, tex.denom2]);
      let p = (display ? 7 : 3) * tex.rule_thickness;
      let q = (u - nbox.d * nbox.scale) - (dbox.h * dbox.scale - v);
      //
      //  If actual separation is less than minimum, move them farther apart
      //
      if (q < p) {
        u += (p - q) / 2;
        v += (p - q) / 2;
        q = p;
      }
      return {u, v, q, nbox, dbox};
    }

    /************************************************/

    /**
     * @param {BBox} bbox        The boundng box to modify
     * @param {boolean} display  True for display-mode fractions
     */
    public getBevelledBBox(bbox: BBox, display: boolean) {
      const {u, v, delta, nbox, dbox} = this.getBevelData(display);
      const lbox = this.bevel.getOuterBBox();
      bbox.combine(nbox, 0, u);
      bbox.combine(lbox, bbox.w - delta / 2, 0);
      bbox.combine(dbox, bbox.w - delta / 2, v);
    }

    /**
     * @param {boolean} display  True for display-style fractions
     * @return {Object}          The height (H) of the bevel, horizontal offest (delta)
     *                             vertical offsets (u and v) of the parts, and
     *                             bounding boxes of the parts.
     */
    public getBevelData(display: boolean): {
      H: number, delta: number, u: number, v: number, nbox: BBox, dbox: BBox
    } {
      const nbox = this.childNodes[0].getOuterBBox();
      const dbox = this.childNodes[1].getOuterBBox();
      const delta = (display ? .4 : .15);
      const H = Math.max(nbox.scale * (nbox.h + nbox.d), dbox.scale * (dbox.h + dbox.d)) + 2 * delta;
      const a = this.font.params.axis_height;
      const u = nbox.scale * (nbox.d - nbox.h) / 2 + a + delta;
      const v = dbox.scale * (dbox.d - dbox.h) / 2 + a - delta;
      return {H, delta, u, v, nbox, dbox};
    }

    /************************************************/

    /**
     * @override
     */
    public canStretch(_direction: DIRECTION) {
      return false;
    }

    /**
     * @return {boolean}   True if in display mode, false otherwise
     */
    public isDisplay(): boolean {
      const {displaystyle, scriptlevel} = this.node.attributes.getList('displaystyle', 'scriptlevel');
      return displaystyle && scriptlevel === 0;
    }

    /**
     * @override
     */
    public getWrapWidth(i: number) {
      const attributes = this.node.attributes;
      if (attributes.get('bevelled')) {
        return this.childNodes[i].getOuterBBox().w;
      }
      const w = this.getBBox().w;
      const thickness = this.length2em(attributes.get('linethickness'));
      return w - (thickness ? .2 : 0) -  2 * this.pad;
    }

    /**
     * @override
     */
    public getChildAlign(i: number) {
      const attributes = this.node.attributes;
      return (attributes.get('bevelled') ? 'left' : attributes.get(['numalign', 'denomalign'][i]) as string);
    }

  };

}
