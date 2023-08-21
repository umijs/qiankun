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
 * @fileoverview  Implements the a base mixin for CommonMsubsup, CommonMunderover
 *                and their relatives.  (Since munderover can become msubsup
 *                when movablelimits is set, munderover needs to be able to
 *                do the same thing as msubsup in some cases.)
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AnyWrapper, WrapperConstructor, Constructor, AnyWrapperClass} from '../Wrapper.js';
import {CommonMo} from './mo.js';
import {CommonMunderover} from './munderover.js';
import {TEXCLASS} from '../../../core/MmlTree/MmlNode.js';
import {MmlMsubsup} from '../../../core/MmlTree/MmlNodes/msubsup.js';
import {MmlMo} from '../../../core/MmlTree/MmlNodes/mo.js';
import {BBox} from '../../../util/BBox.js';
import {DIRECTION} from '../FontData.js';

/*****************************************************************/
/**
 * The CommonScriptbase interface
 *
 * @template W  The child-node Wrapper class
 */
export interface CommonScriptbase<W extends AnyWrapper> extends AnyWrapper {

  /**
   * The core mi or mo of the base (or the base itself if there isn't one)
   */
  readonly baseCore: W;

  /**
   * The base element's wrapper
   */
  readonly baseChild: W;

  /**
   * The relative scaling of the base compared to the munderover/msubsup
   */
  readonly baseScale: number;

  /**
   * The italic correction of the base (if any)
   */
  readonly baseIc: number;

  /**
   * True if base italic correction should be removed (msub and msubsup or mathaccents)
   */
  readonly baseRemoveIc: boolean;

  /**
   * True if the base is a single character
   */
  readonly baseIsChar: boolean;

  /**
   * True if the base has an accent under or over
   */
  readonly baseHasAccentOver: boolean;
  readonly baseHasAccentUnder: boolean;

  /**
   * True if this is an overline or underline
   */
  readonly isLineAbove: boolean;
  readonly isLineBelow: boolean;

  /**
   * True if this is an msup with script that is a math accent
   */
  readonly isMathAccent: boolean;

  /**
   * The script element's wrapper (overridden in subclasses)
   */
  readonly scriptChild: W;

  /***************************************************************************/
  /*
   *  Methods for information about the core element for the base
   */

  /**
   * @return {W}    The wrapper for the base core mi or mo (or whatever)
   */
  getBaseCore(): W;

  /**
   * @return {W}    The base fence item or null
   */
  getSemanticBase(): W;

  /**
   * Recursively retrieves an element for a given fencepointer.
   *
   * @param {W} fence The potential fence.
   * @param {string} id The fencepointer id.
   * @return {W} The original fence the scripts belong to.
   */
  getBaseFence(fence: W, id: string): W;

  /**
   * @return {number}   The scaling factor for the base core relative to the munderover/msubsup
   */
  getBaseScale(): number;

  /**
   * The base's italic correction (properly scaled)
   */
  getBaseIc(): number;

  /**
   * An adjusted italic correction (for slightly better results)
   */
  getAdjustedIc(): number;

  /**
   * @return {boolean}  True if the base is an mi, mn, or mo (not a largeop) consisting of
   *                    a single unstretched character
   */
  isCharBase(): boolean;

  /**
   * Determine if the under- and overscripts are under- or overlines.
   */
  checkLineAccents(): void;

  /**
   * @param {W} script   The script node to check for being a line
   */
  isLineAccent(script: W): boolean;

  /***************************************************************************/
  /*
   *  Methods for sub-sup nodes
   */

  /**
   * @return {number}    The base child's width without the base italic correction (if not needed)
   */
  getBaseWidth(): number;

  /**
   * Get the shift for the script (implemented in subclasses)
   *
   * @return {number[]}   The horizontal and vertical offsets for the script
   */
  getOffset(): number[];

  /**
   * @param {number} n    The value to use if the base isn't a (non-large-op, unstretched) char
   * @return {number}     Either n or 0
   */
  baseCharZero(n: number): number;

  /**
   * Get the shift for a subscript (TeXBook Appendix G 18ab)
   *
   * @return {number}     The vertical offset for the script
   */
  getV(): number;

  /**
   * Get the shift for a superscript (TeXBook Appendix G 18acd)
   *
   * @return {number}     The vertical offset for the script
   */
  getU(): number;

  /***************************************************************************/
  /*
   *  Methods for under-over nodes
   */

  /**
   * @return {boolean}  True if the base has movablelimits (needed by munderover)
   */
  hasMovableLimits(): boolean;

  /**
   * Get the separation and offset for overscripts (TeXBoox Appendix G 13, 13a)
   *
   * @param {BBox} basebox  The bounding box of the base
   * @param {BBox} overbox  The bounding box of the overscript
   * @return {number[]}     The separation between their boxes, and the offset of the overscript
   */
  getOverKU(basebox: BBox, overbox: BBox): number[];

  /**
   * Get the separation and offset for underscripts (TeXBoox Appendix G 13, 13a)
   *
   * @param {BBox} basebox   The bounding box of the base
   * @param {BBox} underbox  The bounding box of the underscript
   * @return {number[]}      The separation between their boxes, and the offset of the underscript
   */
  getUnderKV(basebox: BBox, underbox: BBox): number[];

  /**
   * @param {BBox[]} boxes     The bounding boxes whose offsets are to be computed
   * @param {number[]=} delta  The initial x offsets of the boxes
   * @return {number[]}        The actual offsets needed to center the boxes in the stack
   */
  getDeltaW(boxes: BBox[], delta?: number[]): number[];

  /**
   * @param {boolean=} noskew   Whether to ignore the skew amount
   * @return {number}           The offset for under and over
   */
  getDelta(noskew?: boolean): number;

  /**
   * Handle horizontal stretching of children to match greatest width
   *  of all children
   */
  stretchChildren(): void;

}

export interface CommonScriptbaseClass extends AnyWrapperClass {
  /**
   * Set to true for munderover/munder/mover/msup (Appendix G 13)
   */
  useIC: boolean;
}

/**
 * Shorthand for the CommonScriptbase constructor
 *
 * @template W  The child-node Wrapper class
 */
export type ScriptbaseConstructor<W extends AnyWrapper> = Constructor<CommonScriptbase<W>>;

/*****************************************************************/
/**
 * A base class for msup/msub/msubsup and munder/mover/munderover
 * wrapper mixin implementations
 *
 * @template W  The child-node Wrapper class
 * @template T  The Wrapper class constructor type
 */
export function CommonScriptbaseMixin<
  W extends AnyWrapper,
  T extends WrapperConstructor
>(Base: T): ScriptbaseConstructor<W> & T {

  return class extends Base {

    /**
     * Set to false for msubsup/msub (Appendix G 13)
     */
    public static useIC: boolean = true;

    /**
     * The core mi or mo of the base (or the base itself if there isn't one)
     */
    public baseCore: W;

    /**
     * The base element's wrapper
     */
    public baseScale: number = 1;

    /**
     * The relative scaling of the base compared to the munderover/msubsup
     */
    public baseIc: number = 0;

    /**
     * True if base italic correction should be removed (msub and msubsup or mathaccents)
     */
    public baseRemoveIc: boolean = false;

    /**
     * True if the base is a single character
     */
    public baseIsChar: boolean = false;

    /**
     * True if the base has an accent under or over
     */
    public baseHasAccentOver: boolean = null;
    public baseHasAccentUnder: boolean = null;

    /**
     * True if this is an overline or underline
     */
    public isLineAbove: boolean = false;
    public isLineBelow: boolean = false;

    /**
     * True if this is an msup with script that is a math accent
     */
    public isMathAccent: boolean = false;

    /**
     * @return {W}  The base element's wrapper
     */
    public get baseChild(): W {
      return this.childNodes[(this.node as MmlMsubsup).base];
    }

    /**
     * @return {W}  The script element's wrapper (overridden in subclasses)
     */
    public get scriptChild(): W {
      return this.childNodes[1];
    }

    /**
     * @override
     */
    constructor(...args: any[]) {
      super(...args);
      //
      //  Find the base core
      //
      const core = this.baseCore = this.getBaseCore();
      if (!core) return;
      //
      // Get information about the base element
      //
      this.setBaseAccentsFor(core);
      this.baseScale = this.getBaseScale();
      this.baseIc = this.getBaseIc();
      this.baseIsChar = this.isCharBase();
      //
      //  Determine if we are setting a mathaccent
      //
      this.isMathAccent = this.baseIsChar &&
        (this.scriptChild && !!this.scriptChild.coreMO().node.getProperty('mathaccent')) as boolean;
      //
      // Check for overline/underline accents
      //
      this.checkLineAccents();
      //
      //  Check if the base is a mi or mo that needs italic correction removed
      //
      this.baseRemoveIc = !this.isLineAbove && !this.isLineBelow &&
        (!(this.constructor as CommonScriptbaseClass).useIC || this.isMathAccent);
    }

    /***************************************************************************/
    /*
     *  Methods for information about the core element for the base
     */

    /**
     * @return {W}    The wrapper for the base core mi or mo (or whatever)
     */
    public getBaseCore(): W {
      let core = this.getSemanticBase() || this.childNodes[0];
      while (core &&
             ((core.childNodes.length === 1 &&
               (core.node.isKind('mrow') ||
                (core.node.isKind('TeXAtom') && core.node.texClass !== TEXCLASS.VCENTER) ||
                core.node.isKind('mstyle') || core.node.isKind('mpadded') ||
                core.node.isKind('mphantom') || core.node.isKind('semantics'))) ||
              (core.node.isKind('munderover') && core.isMathAccent)))  {
        this.setBaseAccentsFor(core);
        core = core.childNodes[0];
      }
      if (!core) {
        this.baseHasAccentOver = this.baseHasAccentUnder = false;
      }
      return core || this.childNodes[0];
    }

    /**
     * @param {W} core   The element to check for accents
     */
    public setBaseAccentsFor(core: W) {
      if (core.node.isKind('munderover')) {
        if (this.baseHasAccentOver === null) {
          this.baseHasAccentOver = !!core.node.attributes.get('accent');
        }
        if (this.baseHasAccentUnder === null) {
          this.baseHasAccentUnder = !!core.node.attributes.get('accentunder');
        }
      }
    }

    /**
     * @return {W}    The base fence item or null
     */
    public getSemanticBase(): W {
      let fence = this.node.attributes.getExplicit('data-semantic-fencepointer') as string;
      return this.getBaseFence(this.baseChild, fence);
    }

    /**
     * Recursively retrieves an element for a given fencepointer.
     *
     * @param {W} fence The potential fence.
     * @param {string} id The fencepointer id.
     * @return {W} The original fence the scripts belong to.
     */
    public getBaseFence(fence: W, id: string): W {
      if (!fence || !fence.node.attributes || !id) {
        return null;
      }
      if (fence.node.attributes.getExplicit('data-semantic-id') === id) {
        return fence;
      }
      for (const child of fence.childNodes) {
        const result = this.getBaseFence(child, id);
        if (result) {
          return result;
        }
      }
      return null;
    }

    /**
     * @return {number}   The scaling factor for the base core relative to the munderover/msubsup
     */
    public getBaseScale(): number {
      let child = this.baseCore as any;
      let scale = 1;
      while (child && child !== this) {
        const bbox = child.getOuterBBox();
        scale *= bbox.rscale;
        child = child.parent;
      }
      return scale;
    }

    /**
     * The base's italic correction (properly scaled)
     */
    public getBaseIc(): number {
      return this.baseCore.getOuterBBox().ic * this.baseScale;
    }

    /**
     * An adjusted italic correction (for slightly better results)
     */
    public getAdjustedIc(): number {
      const bbox = this.baseCore.getOuterBBox();
      return (bbox.ic ? 1.05 * bbox.ic + .05 : 0) * this.baseScale;
    }

    /**
     * @return {boolean}  True if the base is an mi, mn, or mo consisting of a single character
     */
    public isCharBase(): boolean {
      let base = this.baseCore;
      return (((base.node.isKind('mo') && (base as any).size === null) ||
               base.node.isKind('mi') || base.node.isKind('mn')) &&
              base.bbox.rscale === 1 && Array.from(base.getText()).length === 1);
    }

    /**
     * Determine if the under- and overscripts are under- or overlines.
     */
    public checkLineAccents() {
      if (!this.node.isKind('munderover')) return;
      if (this.node.isKind('mover')) {
        this.isLineAbove = this.isLineAccent(this.scriptChild);
      } else if (this.node.isKind('munder')) {
        this.isLineBelow = this.isLineAccent(this.scriptChild);
      } else {
        const mml = this as unknown as CommonMunderover<W>;
        this.isLineAbove = this.isLineAccent(mml.overChild);
        this.isLineBelow = this.isLineAccent(mml.underChild);
      }
    }

    /**
     * @param {W} script   The script node to check for being a line
     * @return {boolean}   True if the script is U+2015
     */
    public isLineAccent(script: W): boolean {
      const node = script.coreMO().node;
      return (node.isToken && (node as MmlMo).getText() === '\u2015');
    }

    /***************************************************************************/
    /*
     *  Methods for sub-sup nodes
     */

    /**
     * @return {number}    The base child's width without the base italic correction (if not needed)
     */
    public getBaseWidth(): number {
      const bbox = this.baseChild.getOuterBBox();
      return bbox.w * bbox.rscale - (this.baseRemoveIc ? this.baseIc : 0) + this.font.params.extra_ic;
    }

    /**
     * This gives the common bbox for msub and msup.  It is overridden
     * for all the others (msubsup, munder, mover, munderover).
     *
     * @override
     */
    public computeBBox(bbox: BBox, recompute: boolean = false) {
      const w = this.getBaseWidth();
      const [x, y] = this.getOffset();
      bbox.append(this.baseChild.getOuterBBox());
      bbox.combine(this.scriptChild.getOuterBBox(), w + x, y);
      bbox.w += this.font.params.scriptspace;
      bbox.clean();
      this.setChildPWidths(recompute);
    }

    /**
     * Get the shift for the script (implemented in subclasses)
     *
     * @return {[number, number]}   The horizontal and vertical offsets for the script
     */
    public getOffset(): [number, number] {
      return [0, 0];
    }

    /**
     * @param {number} n    The value to use if the base isn't a (non-large-op, unstretched) char
     * @return {number}     Either n or 0
     */
    public baseCharZero(n: number): number {
      const largeop = !!this.baseCore.node.attributes.get('largeop');
      const scale = this.baseScale;
      return (this.baseIsChar && !largeop && scale === 1 ? 0 : n);
    }

    /**
     * Get the shift for a subscript (TeXBook Appendix G 18ab)
     *
     * @return {number}     The vertical offset for the script
     */
    public getV(): number {
      const bbox = this.baseCore.getOuterBBox();
      const sbox = this.scriptChild.getOuterBBox();
      const tex = this.font.params;
      const subscriptshift = this.length2em(this.node.attributes.get('subscriptshift'), tex.sub1);
      return Math.max(
        this.baseCharZero(bbox.d * this.baseScale + tex.sub_drop * sbox.rscale),
        subscriptshift,
        sbox.h * sbox.rscale - (4 / 5) * tex.x_height
      );
    }

    /**
     * Get the shift for a superscript (TeXBook Appendix G 18acd)
     *
     * @return {number}     The vertical offset for the script
     */
    public getU(): number {
      const bbox = this.baseCore.getOuterBBox();
      const sbox = this.scriptChild.getOuterBBox();
      const tex = this.font.params;
      const attr = this.node.attributes.getList('displaystyle', 'superscriptshift');
      const prime = this.node.getProperty('texprimestyle');
      const p = prime ? tex.sup3 : (attr.displaystyle ? tex.sup1 : tex.sup2);
      const superscriptshift = this.length2em(attr.superscriptshift, p);
      return Math.max(
        this.baseCharZero(bbox.h * this.baseScale - tex.sup_drop * sbox.rscale),
        superscriptshift,
        sbox.d * sbox.rscale + (1 / 4) * tex.x_height
      );
    }

    /***************************************************************************/
    /*
     *  Methods for under-over nodes
     */

    /**
     * @return {boolean}  True if the base has movablelimits (needed by munderover)
     */
    public hasMovableLimits(): boolean {
      const display = this.node.attributes.get('displaystyle');
      const mo = this.baseChild.coreMO().node;
      return (!display && !!mo.attributes.get('movablelimits'));
    }

    /**
     * Get the separation and offset for overscripts (TeXBoox Appendix G 13, 13a)
     *
     * @param {BBox} basebox  The bounding box of the base
     * @param {BBox} overbox  The bounding box of the overscript
     * @return {[number, number]}     The separation between their boxes, and the offset of the overscript
     */
    public getOverKU(basebox: BBox, overbox: BBox): [number, number] {
      const accent = this.node.attributes.get('accent') as boolean;
      const tex = this.font.params;
      const d = overbox.d * overbox.rscale;
      const t = tex.rule_thickness * tex.separation_factor;
      const delta = (this.baseHasAccentOver ? t : 0);
      const T = (this.isLineAbove ? 3 * tex.rule_thickness : t);
      const k = (accent ? T : Math.max(tex.big_op_spacing1, tex.big_op_spacing3 - Math.max(0, d))) - delta;
      return [k, basebox.h * basebox.rscale + k + d];
    }

    /**
     * Get the separation and offset for underscripts (TeXBoox Appendix G 13, 13a)
     *
     * @param {BBox} basebox   The bounding box of the base
     * @param {BBox} underbox  The bounding box of the underscript
     * @return {[number, number]}      The separation between their boxes, and the offset of the underscript
     */
    public getUnderKV(basebox: BBox, underbox: BBox): [number, number] {
      const accent = this.node.attributes.get('accentunder') as boolean;
      const tex = this.font.params;
      const h = underbox.h * underbox.rscale;
      const t = tex.rule_thickness * tex.separation_factor;
      const delta = (this.baseHasAccentUnder ? t : 0);
      const T = (this.isLineBelow ? 3 * tex.rule_thickness : t);
      const k = (accent ? T : Math.max(tex.big_op_spacing2, tex.big_op_spacing4 - h)) - delta;
      return [k, -(basebox.d * basebox.rscale + k + h)];
    }

    /**
     * @param {BBox[]} boxes     The bounding boxes whose offsets are to be computed
     * @param {number[]=} delta  The initial x offsets of the boxes
     * @return {number[]}        The actual offsets needed to center the boxes in the stack
     */
    public getDeltaW(boxes: BBox[], delta: number[] = [0, 0, 0]): number[] {
      const align = this.node.attributes.get('align');
      const widths = boxes.map(box => box.w * box.rscale);
      widths[0] -= (this.baseRemoveIc && !this.baseCore.node.attributes.get('largeop') ? this.baseIc : 0);
      const w = Math.max(...widths);
      const dw = [] as number[];
      let m = 0;
      for (const i of widths.keys()) {
        dw[i] = (align === 'center' ? (w - widths[i]) / 2 :
                 align === 'right' ? w - widths[i] : 0) + delta[i];
        if (dw[i] < m) {
          m = -dw[i];
        }
      }
      if (m) {
        for (const i of dw.keys()) {
          dw[i] += m;
        }
      }
      [1, 2].map(i => dw[i] += (boxes[i] ? boxes[i].dx * boxes[0].scale : 0));
      return dw;
    }

    /**
     * @param {boolean=} noskew   Whether to ignore the skew amount
     * @return {number}           The offset for under and over
     */
    public getDelta(noskew: boolean = false): number {
      const accent = this.node.attributes.get('accent');
      const {sk, ic} = this.baseCore.getOuterBBox();
      return ((accent && !noskew ? sk : 0) + this.font.skewIcFactor * ic) * this.baseScale;
    }

    /**
     * Handle horizontal stretching of children to match greatest width
     *  of all children
     */
    public stretchChildren() {
      let stretchy: AnyWrapper[] = [];
      //
      //  Locate and count the stretchy children
      //
      for (const child of this.childNodes) {
        if (child.canStretch(DIRECTION.Horizontal)) {
          stretchy.push(child);
        }
      }
      let count = stretchy.length;
      let nodeCount = this.childNodes.length;
      if (count && nodeCount > 1) {
        let W = 0;
        //
        //  If all the children are stretchy, find the largest one,
        //  otherwise, find the width of the non-stretchy children.
        //
        let all = (count > 1 && count === nodeCount);
        for (const child of this.childNodes) {
          const noStretch = (child.stretch.dir === DIRECTION.None);
          if (all || noStretch) {
            const {w, rscale} = child.getOuterBBox(noStretch);
            if (w * rscale > W) W = w * rscale;
          }
        }
        //
        //  Stretch the stretchable children
        //
        for (const child of stretchy) {
          (child.coreMO() as CommonMo).getStretchedVariant([W / child.bbox.rscale]);
        }
      }
    }

  };

}
