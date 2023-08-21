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
 * @fileoverview  Implements the CommonMsubsup wrapper mixin for the MmlMsubsup object
 *                and the special cases CommonMsub and CommonMsup
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AnyWrapper, Constructor} from '../Wrapper.js';
import {CommonScriptbase, ScriptbaseConstructor} from './scriptbase.js';
import {BBox} from '../../../util/BBox.js';
import {MmlMsubsup, MmlMsub, MmlMsup} from '../../../core/MmlTree/MmlNodes/msubsup.js';

/*****************************************************************/
/**
 * The CommonMsub interface
 *
 * @template W  The child-node Wrapper class
 */
export interface CommonMsub<W extends AnyWrapper> extends CommonScriptbase<W> {
}

/**
 * Shorthand for the CommonMsub constructor
 *
 * @template W  The child-node Wrapper class
 */
export type MsubConstructor<W extends AnyWrapper> = Constructor<CommonMsub<W>>;

/*****************************************************************/
/**
 * The CommonMsub wrapper mixin for the MmlMsub object
 *
 * @template W  The child-node Wrapper class
 * @template T  The Wrapper class constructor type
 */
export function CommonMsubMixin<
  W extends AnyWrapper,
  T extends ScriptbaseConstructor<W>
>(Base: T): MsubConstructor<W> & T {

  return class extends Base {

    /**
     * Do not include italic correction
     */
    public static useIC: boolean = false;

    /**
     * @override
     */
    public get scriptChild() {
      return this.childNodes[(this.node as MmlMsub).sub];
    }

    /**
     * Get the shift for the subscript
     *
     * @override
     */
    public getOffset() {
      return [0, -this.getV()];
    }

  };

}

/*****************************************************************/
/**
 * The CommonMsup interface
 *
 * @template W  The child-node Wrapper class
 */
export interface CommonMsup<W extends AnyWrapper> extends CommonScriptbase<W> {
}

/**
 * Shorthand for the CommonMsup constructor
 *
 * @template W  The child-node Wrapper class
 */
export type MsupConstructor<W extends AnyWrapper> = Constructor<CommonMsup<W>>;

/*****************************************************************/
/**
 * The CommonMsup wrapper mixin for the MmlMsup object
 *
 * @template W  The child-node Wrapper class
 * @template T  The Wrapper class constructor type
 */
export function CommonMsupMixin<
  W extends AnyWrapper,
  T extends ScriptbaseConstructor<W>
>(Base: T): MsupConstructor<W> & T {

  return class extends Base {

    /**
     * @override
     */
    public get scriptChild() {
      return this.childNodes[(this.node as MmlMsup).sup];
    }

    /**
     * Get the shift for the superscript
     *
     * @override
     */
    public getOffset() {
      const x = this.getAdjustedIc() - (this.baseRemoveIc ? 0 : this.baseIc);
      return [x, this.getU()];
    }

  };

}

/*****************************************************************/
/**
 * The CommonMsubsup interface
 *
 * @template W  The child-node Wrapper class
 */
export interface CommonMsubsup<W extends AnyWrapper> extends CommonScriptbase<W> {

  /**
   *  Cached values for the script offsets and separation (so if they are
   *  computed in computeBBox(), they don't have to be recomputed during output)
   */
  UVQ: number[];

  /**
   * The wrapper for the subscript
   */
  readonly subChild: W;

  /**
   * The wrapper for the superscript
   */
  readonly supChild: W;

  /**
   * Get the shift for the scripts and their separation (TeXBook Appendix G 18adef)
   *
   * @param {BBox} subbox     The bounding box of the superscript
   * @param {BBox} supbox     The bounding box of the subscript
   * @return {number[]}       The vertical offsets for super and subscripts, and the space between them
   */
  getUVQ(subbox?: BBox, supbox?: BBox): number[];
}

/**
 * Shorthand for the CommonMsubsup constructor
 *
 * @template W  The child-node Wrapper class
 */
export type MsubsupConstructor<W extends AnyWrapper> = Constructor<CommonMsubsup<W>>;

/*****************************************************************/
/**
 * The CommomMsubsup wrapper for the MmlMsubsup object
 *
 * @template W  The child-node Wrapper class
 * @template T  The Wrapper class constructor type
 */
export function CommonMsubsupMixin<
  W extends AnyWrapper,
  T extends ScriptbaseConstructor<W>
>(Base: T): MsubsupConstructor<W> & T {

  return class extends Base {

    /**
     * Do not include italic correction
     */
    public static useIC: boolean = false;

    /**
     *  Cached values for the script offsets and separation (so if they are
     *  computed in computeBBox(), they don't have to be recomputed during output)
     */
    public UVQ: number[] = null;

    /**
     * @return {W}  The wrapper for the subscript
     */
    public get subChild(): W {
      return this.childNodes[(this.node as MmlMsubsup).sub];
    }

    /**
     * @return {W}  The wrapper for the superscript
     */
    public get supChild(): W {
      return this.childNodes[(this.node as MmlMsubsup).sup];
    }

    /**
     * @override
     */
    public computeBBox(bbox: BBox, recompute: boolean = false) {
      const basebox = this.baseChild.getOuterBBox();
      const [subbox, supbox] = [this.subChild.getOuterBBox(), this.supChild.getOuterBBox()];
      bbox.empty();
      bbox.append(basebox);
      const w = this.getBaseWidth();
      const x = this.getAdjustedIc();
      const [u, v] = this.getUVQ();
      bbox.combine(subbox, w, v);
      bbox.combine(supbox, w + x, u);
      bbox.w += this.font.params.scriptspace;
      bbox.clean();
      this.setChildPWidths(recompute);
    }

    /**
     * Get the shift for the scripts and their separation (TeXBook Appendix G 18adef)
     *
     * @param {BBox} subbox     The bounding box of the superscript
     * @param {BBox} supbox     The bounding box of the subscript
     * @return {number[]}       The vertical offsets for super and subscripts, and the space between them
     */
    public getUVQ(
      subbox: BBox = this.subChild.getOuterBBox(),
      supbox: BBox = this.supChild.getOuterBBox()
    ): number[] {
      const basebox = this.baseCore.getOuterBBox();
      if (this.UVQ) return this.UVQ;
      const tex = this.font.params;
      const t = 3 * tex.rule_thickness;
      const subscriptshift = this.length2em(this.node.attributes.get('subscriptshift'), tex.sub2);
      const drop = this.baseCharZero(basebox.d * this.baseScale + tex.sub_drop * subbox.rscale);
      //
      // u and v are the veritcal shifts of the scripts, initially set to minimum values and then adjusted
      //
      let [u, v] = [this.getU(), Math.max(drop, subscriptshift)];
      //
      // q is the space currently between the super- and subscripts.
      // If it is less than 3 rule thicknesses,
      //   increase the subscript offset to make the space 3 rule thicknesses
      //   If the bottom of the superscript is below 4/5 of the x-height
      //     raise both the super- and subscripts by the difference
      //     (make the bottom of the superscript be at 4/5 the x-height, and the
      //      subscript 3 rule thickness below that).
      //
      let q = (u - supbox.d * supbox.rscale) - (subbox.h * subbox.rscale - v);
      if (q < t) {
        v += t - q;
        const p = (4 / 5) * tex.x_height - (u - supbox.d * supbox.rscale);
        if (p > 0) {
          u += p;
          v -= p;
        }
      }
      //
      // Make sure the shifts are at least the minimum amounts and
      // return the shifts and the space between the scripts
      //
      u = Math.max(this.length2em(this.node.attributes.get('superscriptshift'), u), u);
      v = Math.max(this.length2em(this.node.attributes.get('subscriptshift'), v), v);
      q = (u - supbox.d * supbox.rscale) - (subbox.h * subbox.rscale - v);
      this.UVQ = [u, -v, q];
      return this.UVQ;
    }

  };

}
