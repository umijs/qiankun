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
 * @fileoverview  Implements the CommonMenclose wrapper mixin for the MmlMenclose object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AnyWrapper, WrapperConstructor, Constructor, AnyWrapperClass} from '../Wrapper.js';
import * as Notation from '../Notation.js';
import {CommonMsqrt} from './msqrt.js';
import {BBox} from '../../../util/BBox.js';
import {AbstractMmlNode} from '../../../core/MmlTree/MmlNode.js';
import {split} from '../../../util/string.js';

/*****************************************************************/
/**
 * The CommonMenclose interface
 *
 * @template W  The menclose wrapper type
 */
export interface CommonMenclose<W extends AnyWrapper, S extends CommonMsqrt, N> extends AnyWrapper {
  /**
   *  The notations active on this menclose, and the one to use for the child, if any
   */
  notations: Notation.List<W, N>;
  renderChild: Notation.Renderer<W, N>;

  /**
   * fake msqrt for radial notation (if used)
   */
  msqrt: S;

  /**
   * The padding, thickness, and shape of the arrow head
   *   (may be overridden using data-padding, data-thickness, and data-arrowhead attibutes)
   */
  padding: number;
  thickness: number;
  arrowhead: {x: number, y: number, dx: number};

  /**
   * The top, right, bottom, and left padding, added by notations
   */
  TRBL: Notation.PaddingData;

  /**
   * Look up the data-* attributes and override the default values
   */
  getParameters(): void;

  /**
   *  Get the notations given in the notation attribute
   *    and check if any are used to render the child nodes
   */
  getNotations(): void;

  /**
   *  Remove any redundant notations
   */
  removeRedundantNotations(): void;

  /**
   *  Run any initialization needed by notations in use
   */
  initializeNotations(): void;

  /**
   * @return {Notation.PaddingData}  Array of the maximum extra space from the notations along each side
   */
  getBBoxExtenders(): Notation.PaddingData;

  /**
   * @return {Notation.PaddingData}  Array of padding (i.e., BBox minus border) along each side
   */
  getPadding(): Notation.PaddingData;

  /**
   * Each entry in X gets replaced by the corresponding one in Y if it is larger
   *
   * @param {Notation.PaddingData} X   An array of numbers
   * @param {Notation.PaddingData} Y   An array of numbers that replace smaller ones in X
   */
  maximizeEntries(X: Notation.PaddingData, Y: Notation.PaddingData): void;

  /**
   * Get the offset amount for the given direction for vertical and horizontal centering
   *
   * @param {string} direction    The direction 'X' or 'Y' for the offset
   * @return {number}             The amount of offset in that direction
   */
  getOffset(direction: string): number;

  /**
   * @param {number} w    The width of the box whose diagonal is needed
   * @param {number} h    The height of the box whose diagonal is needed
   * @return {number[]}   The angle and width of the diagonal of the box
   */
  getArgMod(w: number, h: number): [number, number];

  /**
   * Create an arrow for output
   *
   * @param {number} w         The length of the arrow
   * @param {number} a         The angle for the arrow
   * @param {boolean} double   True if this is a double-headed arrow
   * @param {string} offset    'X' for vertical arrow, 'Y' for horizontal
   * @param {number} trans     Distance to translate in the offset direction
   * @return {N}               The newly created arrow
   */
  arrow(w: number, a: number, double: boolean, offset?: string, trans?: number): N;

  /**
   * Get the angle and width of a diagonal arrow, plus the x and y extension
   *   past the content bounding box
   */
  arrowData(): {a: number, W: number, x: number, y: number};

  /**
   * Get the angle and width for a diagonal arrow
   *
   * @return {[number, number]}   The angle and width
   */
  arrowAW(): [number, number];

  /**
   * Create an unattached msqrt wrapper to render the 'radical' notation.
   *   We replace the inferred mrow of the msqrt with the one from the menclose
   *   but without changing the parent pointer, so as not to detach it from
   *   the menclose (which would desrtoy the original MathML tree).
   *
   * @param {W} child   The inferred mrow that is the child of this menclose
   * @return {S}        The newly created (but detached) msqrt wrapper
   */
  createMsqrt(child: W): S;

  /**
   * @return {number[]}  The differences between the msqrt bounding box
   *                     and its child bounding box (i.e., the extra space
   *                     created by the radical symbol).
   */
  sqrtTRBL(): number[];
}

/**
 * The CommonMenclose class interface
 *
 * @template W  The menclose wrapper type
 * @templare N  The DOM node class
 */
export interface CommonMencloseClass<W extends AnyWrapper, N> extends AnyWrapperClass {
  /**
   *  The definitions of the various notations
   */
  notations: Notation.DefList<W, N>;
}

/**
 * Shorthand for the CommonMenclose constructor
 *
 * @template W  The menclose wrapper type
 */
export type MencloseConstructor<W extends AnyWrapper, S extends CommonMsqrt, N> = Constructor<CommonMenclose<W, S, N>>;

/*****************************************************************/
/**
 * The CommonMenclose wrapper mixin for the MmlMenclose object
 *
 * @template W  The menclose wrapper type
 * @templare N  The DOM node class
 * @templare S  The msqrt wrapper class
 * @template T  The Wrapper class constructor type
 */
export function CommonMencloseMixin<
  W extends AnyWrapper,
  S extends CommonMsqrt,
  N,
  T extends WrapperConstructor
>(Base: T): MencloseConstructor<W, S, N> & T {

  return class extends Base {

    /**
     *  The notations active on this menclose, if any
     */
    public notations: Notation.List<W, N> = {};

    /**
     *  The notation to use for the child, if any
     */
    public renderChild: Notation.Renderer<W, N> = null;

    /**
     * fake msqrt for radial notation (if used)
     */
    public msqrt: S = null;

    /**
     * The padding of the arrow head (may be overridden using data-padding attibute)
     */
    public padding: number = Notation.PADDING;
    /**
     * The thickness of the arrow head (may be overridden using data-thickness attibute)
     */
    public thickness: number = Notation.THICKNESS;
    /**
     * The shape of the arrow head (may be overridden using data-arrowhead attibutes)
     */
    public arrowhead = {x: Notation.ARROWX, y: Notation.ARROWY, dx: Notation.ARROWDX};

    /**
     * The top, right, bottom, and left padding (added by notations)
     */
    public TRBL: Notation.PaddingData = [0, 0, 0, 0];

    /**
     * @override
     * @constructor
     */
    constructor(...args: any[]) {
      super(...args);
      this.getParameters();
      this.getNotations();
      this.removeRedundantNotations();
      this.initializeNotations();
      this.TRBL = this.getBBoxExtenders();
    }

    /**
     * Look up the data-* attributes and override the default values
     */
    public getParameters() {
      const attributes = this.node.attributes;
      const padding = attributes.get('data-padding');
      if (padding !== undefined) {
        this.padding = this.length2em(padding, Notation.PADDING);
      }
      const thickness = attributes.get('data-thickness');
      if (thickness !== undefined) {
        this.thickness = this.length2em(thickness, Notation.THICKNESS);
      }
      const arrowhead = attributes.get('data-arrowhead') as string;
      if (arrowhead !== undefined) {
        let [x, y, dx] = split(arrowhead);
        this.arrowhead = {
          x: (x ? parseFloat(x) : Notation.ARROWX),
          y: (y ? parseFloat(y) : Notation.ARROWY),
          dx: (dx ? parseFloat(dx) : Notation.ARROWDX)
        };
      }
    }

    /**
     *  Get the notations given in the notation attribute
     *    and check if any are used to render the child nodes
     */
    public getNotations() {
      const Notations = (this.constructor as CommonMencloseClass<W, N>).notations;
      for (const name of split(this.node.attributes.get('notation') as string)) {
        const notation = Notations.get(name);
        if (notation) {
          this.notations[name] = notation;
          if (notation.renderChild) {
            this.renderChild = notation.renderer;
          }
        }
      }
    }

    /**
     *  Remove any redundant notations
     */
    public removeRedundantNotations() {
      for (const name of Object.keys(this.notations)) {
        if (this.notations[name]) {
          const remove = this.notations[name].remove || '';
          for (const notation of remove.split(/ /)) {
            delete this.notations[notation];
          }
        }
      }
    }

    /**
     *  Run any initialization needed by notations in use
     */
    public initializeNotations() {
      for (const name of Object.keys(this.notations)) {
        const init = this.notations[name].init;
        init && init(this as any);
      }
    }

    /********************************************************/

    /**
     * @override
     */
    public computeBBox(bbox: BBox, recompute: boolean = false) {
      //
      //  Combine the BBox from the child and add the extenders
      //
      let [T, R, B, L] = this.TRBL;
      const child = this.childNodes[0].getBBox();
      bbox.combine(child, L, 0);
      bbox.h += T;
      bbox.d += B;
      bbox.w += R;
      this.setChildPWidths(recompute);
    }

    /**
     * @return {Notation.PaddingData}  Array of the maximum extra space from the notations along each side
     */
    public getBBoxExtenders(): Notation.PaddingData {
      let TRBL = [0, 0, 0, 0] as Notation.PaddingData;
      for (const name of Object.keys(this.notations)) {
        this.maximizeEntries(TRBL, this.notations[name].bbox(this as any));
      }
      return TRBL;
    }

    /**
     * @return {Notation.PaddingData}  Array of padding (i.e., BBox minus border) along each side
     */
    public getPadding(): Notation.PaddingData {
      let BTRBL = [0, 0, 0, 0] as Notation.PaddingData;
      for (const name of Object.keys(this.notations)) {
        const border = this.notations[name].border;
        if (border) {
          this.maximizeEntries(BTRBL, border(this as any));
        }
      }
      return [0, 1, 2, 3].map(i => this.TRBL[i] - BTRBL[i]) as Notation.PaddingData;
    }

    /**
     * Each entry in X gets replaced by the corresponding one in Y if it is larger
     *
     * @param {Notation.PaddingData} X   An array of numbers
     * @param {Notation.PaddingData} Y   An array of numbers that replace smaller ones in X
     */
    public maximizeEntries(X: Notation.PaddingData, Y: Notation.PaddingData) {
      for (let i = 0; i < X.length; i++) {
        if (X[i] < Y[i]) {
          X[i] = Y[i];
        }
      }
    }

    /********************************************************/

    /**
     * Get the offset amount for the given direction for vertical and horizontal centering
     *
     * @param {string} direction    The direction 'X' or 'Y' for the offset
     * @return {number}             The amount of offset in that direction
     */
    public getOffset(direction: string): number {
      let [T, R, B, L] = this.TRBL;
      const d = (direction === 'X' ? R - L : B - T) / 2;
      return (Math.abs(d) > .001 ? d : 0);
    }

    /**
     * @param {number} w    The width of the box whose diagonal is needed
     * @param {number} h    The height of the box whose diagonal is needed
     * @return {number[]}   The angle and width of the diagonal of the box
     */
    public getArgMod(w: number, h: number): [number, number] {
      return [Math.atan2(h, w), Math.sqrt(w * w + h * h)];
    }

    /**
     * Create an arrow using an svg element
     *
     * @param {number} w        The length of the arrow
     * @param {number} a        The angle for the arrow
     * @param {boolean} double  True if this is a double-headed arrow
     * @param {string} offset   'X' for vertical arrow, 'Y' for horizontal
     * @param {number} dist     Distance to translate in the offset direction
     * @return {N}              The newly created arrow
     */
    public arrow(_w: number, _a: number, _double: boolean, _offset: string = '', _dist: number = 0): N {
      return null as N;
    }

    /**
     * Get the angle and width of a diagonal arrow, plus the x and y extension
     *   past the content bounding box
     *
     * @return {Object}  The angle, width, and x and y extentions
     */
    public arrowData(): {a: number, W: number, x: number, y: number} {
      const [p, t] = [this.padding, this.thickness];
      const r = t * (this.arrowhead.x + Math.max(1, this.arrowhead.dx));
      const {h, d, w} = this.childNodes[0].getBBox();
      const H = h + d;
      const R = Math.sqrt(H * H + w * w);
      const x = Math.max(p, r * w / R);
      const y = Math.max(p, r * H / R);
      const [a, W] = this.getArgMod(w + 2 * x, H + 2 * y);
      return {a, W, x, y};
    }

    /**
     * Get the angle and width for a diagonal arrow
     *
     * @return {[number, number]}   The angle and width
     */
    public arrowAW(): [number, number] {
      const {h, d, w} = this.childNodes[0].getBBox();
      const [T, R, B, L] = this.TRBL;
      return this.getArgMod(L + w + R, T + h + d + B);
    }

    /********************************************************/

    /**
     * Create an unattached msqrt wrapper to render the 'radical' notation.
     *   We replace the inferred mrow of the msqrt with the one from the menclose
     *   but without changing the parent pointer, so as not to detach it from
     *   the menclose (which would desrtoy the original MathML tree).
     *
     * @param {W} child   The inferred mrow that is the child of this menclose
     * @return {S}        The newly created (but detached) msqrt wrapper
     */
    public createMsqrt(child: W): S {
      const mmlFactory = (this.node as AbstractMmlNode).factory;
      const mml = mmlFactory.create('msqrt');
      mml.inheritAttributesFrom(this.node);
      mml.childNodes[0] = child.node;
      const node = this.wrap(mml) as S;
      node.parent = this;
      return node;
    }

    /**
     * @return {number[]}  The differences between the msqrt bounding box
     *                     and its child bounding box (i.e., the extra space
     *                     created by the radical symbol).
     */
    public sqrtTRBL(): [number, number, number, number] {
      const bbox = this.msqrt.getBBox();
      const cbox = this.msqrt.childNodes[0].getBBox();
      return [bbox.h - cbox.h, 0, bbox.d - cbox.d, bbox.w - cbox.w];
    }

  };
}
