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
 * @fileoverview  Implements the CommonMsqrt wrapper for the MmlMsqrt object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AnyWrapper, WrapperConstructor, Constructor} from '../Wrapper.js';
import {CommonMo} from './mo.js';
import {BBox} from '../../../util/BBox.js';
import {DIRECTION} from '../FontData.js';

/*****************************************************************/
/**
 * The CommonMsqrt interface
 */
export interface CommonMsqrt extends AnyWrapper {
  /**
   * The index of the base of the root in childNodes
   */
  readonly base: number;

  /**
   * The index of the surd in childNodes
   */
  readonly surd: number;

  /**
   * The index of the root in childNodes (or null if none)
   */
  readonly root: number;

  /**
   * The requested height of the stretched surd character
   */
  surdH: number;

  /**
   * Combine the bounding box of the root (overridden in mroot)
   *
   * @param {BBox} bbox  The bounding box so far
   * @param {BBox} sbox  The bounding box of the surd
   * @param {number} H   The height of the root as a whole
   */
  combineRootBBox(bbox: BBox, sbox: BBox, H: number): void;

  /**
   * @param {BBox} sbox  The bounding box for the surd character
   * @return {number[]}  The p, q, and x values for the TeX layout computations
   */
  getPQ(sbox: BBox): number[];

  /**
   * @param {BBox} sbox  The bounding box of the surd
   * @param {number} H   The height of the root as a whole
   * @return {number[]}  The x offset of the surd, and the height, x offset, and scale of the root
   */
  getRootDimens(sbox: BBox, H: Number): number[];

}

/**
 * Shorthand for the CommonMsqrt constructor
 */
export type MsqrtConstructor = Constructor<CommonMsqrt>;

/*****************************************************************/
/**
 * The CommonMsqrt wrapper mixin for the MmlMsqrt object
 *
 * @template T  The Wrapper class constructor type
 */
export function CommonMsqrtMixin<T extends WrapperConstructor>(Base: T): MsqrtConstructor & T {

  return class extends Base {

    /**
     * @return {number}  The index of the base of the root in childNodes
     */
    get base(): number {
      return 0;
    }

    /**
     * @return {number}  The index of the surd in childNodes
     */
    get surd(): number {
      return 1;
    }

    /**
     * @return {number}  The index of the root in childNodes (or null if none)
     */
    get root(): number {
      return null;
    }

    /**
     * The requested height of the stretched surd character
     */
    public surdH: number;

    /**
     * Add the surd character so we can display it later
     *
     * @override
     */
    constructor(...args: any[]) {
      super(...args);
      const surd = this.createMo('\u221A');
      surd.canStretch(DIRECTION.Vertical);
      const {h, d} = this.childNodes[this.base].getOuterBBox();
      const t = this.font.params.rule_thickness;
      const p = (this.node.attributes.get('displaystyle') ? this.font.params.x_height : t);
      this.surdH = h + d + 2 * t + p / 4;
      (surd as CommonMo).getStretchedVariant([this.surdH - d, d], true);
    }

    /**
     * @override
     */
    public createMo(text: string) {
      const node = super.createMo(text);
      this.childNodes.push(node);
      return node;
    }

    /**
     * @override
     */
    public computeBBox(bbox: BBox, recompute: boolean = false) {
      const surdbox = this.childNodes[this.surd].getBBox();
      const basebox = new BBox(this.childNodes[this.base].getOuterBBox());
      const q = this.getPQ(surdbox)[1];
      const t = this.font.params.rule_thickness;
      const H = basebox.h + q + t;
      const [x] = this.getRootDimens(surdbox, H);
      bbox.h = H + t;
      this.combineRootBBox(bbox, surdbox, H);
      bbox.combine(surdbox, x, H - surdbox.h);
      bbox.combine(basebox, x + surdbox.w, 0);
      bbox.clean();
      this.setChildPWidths(recompute);
    }

    /**
     * Combine the bounding box of the root (overridden in mroot)
     *
     * @param {BBox} bbox  The bounding box so far
     * @param {BBox} sbox  The bounding box of the surd
     * @param {number} H   The height of the root as a whole
     */
    public combineRootBBox(_bbox: BBox, _sbox: BBox, _H: number) {
    }

    /**
     * @param {BBox} sbox  The bounding box for the surd character
     * @return {[number, number]}  The p, q, and x values for the TeX layout computations
     */
    public getPQ(sbox: BBox): [number, number] {
      const t = this.font.params.rule_thickness;
      const p = (this.node.attributes.get('displaystyle') ? this.font.params.x_height : t);
      const q = (sbox.h + sbox.d > this.surdH ?
                 ((sbox.h + sbox.d) - (this.surdH - 2 * t - p / 2)) / 2 :
                 t + p / 4);
      return [p, q];
    }

    /**
     * @param {BBox} sbox  The bounding box of the surd
     * @param {number} H   The height of the root as a whole
     * @return {[number, number, number, number]} The x offset of the surd, and
     *     the height, x offset, and scale of the root
     */
    public getRootDimens(_sbox: BBox, _H: number): [number, number, number, number] {
      return [0, 0, 0, 0];
    }

  };

}
