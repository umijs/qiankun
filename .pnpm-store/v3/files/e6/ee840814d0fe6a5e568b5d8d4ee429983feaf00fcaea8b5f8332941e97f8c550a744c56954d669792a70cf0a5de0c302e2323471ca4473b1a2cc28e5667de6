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
 * @fileoverview  Implements the CcommonMtr wrapper mixin for the MmlMtr object
 *                and CommonMlabeledtr wrapper mixin for MmlMlabeledtr
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AnyWrapper, WrapperConstructor, Constructor} from '../Wrapper.js';
import {CommonMo} from './mo.js';
import {BBox} from '../../../util/BBox.js';
import {DIRECTION} from '../FontData.js';

/*****************************************************************/
/**
 * The CommonMtr interface
 *
 * @template C  The class for table cells
 */
export interface CommonMtr<C extends AnyWrapper> extends AnyWrapper {

  /**
   * The number of mtd's in the mtr
   */
  readonly numCells: number;

  /**
   * True if this is a labeled row
   */
  readonly labeled: boolean;

  /**
   * The child nodes that are part of the table (no label node)
   */
  readonly tableCells: C[];

  /**
   * @override;
   */
  childNodes: C[];

  /**
   * @param {number} i   The index of the child to get (skipping labels)
   * @return {C}         The ith child node wrapper
   */
  getChild(i: number): C;

  /**
   * @return {BBox[]}  An array of the bounding boxes for the mtd's in the row
   */
  getChildBBoxes(): BBox[];

  /**
   * Handle vertical stretching of cells to match height of
   *  other cells in the row.
   *
   * @param {number[]=} HD   The total height and depth for the row [H, D]
   *
   * If this isn't specified, the maximum height and depth is computed.
   */
  stretchChildren(HD?: number[]): void;

}

/**
 * Shorthand for the CommonMtr constructor
 *
 * @template C  The class for table cells
 */
export type MtrConstructor<C extends AnyWrapper> = Constructor<CommonMtr<C>>;

/*****************************************************************/
/**
 * The CommonMtr wrapper for the MmlMtr object
 *
 * @template C  The class for table cells
 * @template T  The Wrapper class constructor type
 */
export function CommonMtrMixin<
  C extends AnyWrapper,
  T extends WrapperConstructor
>(Base: T): MtrConstructor<C> & T {

  return class extends Base {

    /**
     * @override
     */
    get fixesPWidth() {
      return false;
    }

    /**
     * @return {number}   The number of mtd's in the mtr
     */
    get numCells(): number {
      return this.childNodes.length;
    }

    /**
     * @return {boolean}   True if this is a labeled row
     */
    get labeled(): boolean {
      return false;
    }

    /**
     * @return {C[]}  The child nodes that are part of the table (no label node)
     */
    get tableCells(): C[] {
      return this.childNodes;
    }

    /**
     * @param {number} i   The index of the child to get (skipping labels)
     * @return {C}         The ith child node wrapper
     */
    public getChild(i: number): C {
      return this.childNodes[i];
    }

    /**
     * @return {BBox[]}  An array of the bounding boxes for the mtd's in the row
     */
    public getChildBBoxes(): BBox[] {
      return this.childNodes.map(cell => cell.getBBox());
    }

    /**
     * Handle vertical stretching of cells to match height of
     *  other cells in the row.
     *
     * @param {number[]} HD   The total height and depth for the row [H, D]
     *
     * If this isn't specified, the maximum height and depth is computed.
     */
    public stretchChildren(HD: number[] = null) {
      let stretchy: AnyWrapper[] = [];
      let children = (this.labeled ? this.childNodes.slice(1) : this.childNodes);
      //
      //  Locate and count the stretchy children
      //
      for (const mtd of children) {
        const child = mtd.childNodes[0];
        if (child.canStretch(DIRECTION.Vertical)) {
          stretchy.push(child);
        }
      }
      let count = stretchy.length;
      let nodeCount = this.childNodes.length;
      if (count && nodeCount > 1) {
        if (HD === null) {
          let H = 0, D = 0;
          //
          //  If all the children are stretchy, find the largest one,
          //  otherwise, find the height and depth of the non-stretchy
          //  children.
          //
          let all = (count > 1 && count === nodeCount);
          for (const mtd of children) {
            const child = mtd.childNodes[0];
            const noStretch = (child.stretch.dir === DIRECTION.None);
            if (all || noStretch) {
              const {h, d} = child.getBBox(noStretch);
              if (h > H) {
                H = h;
              }
              if (d > D) {
                D = d;
              }
            }
          }
          HD = [H, D];
        }
        //
        //  Stretch the stretchable children
        //
        for (const child of stretchy) {
          (child.coreMO() as CommonMo).getStretchedVariant(HD);
        }
      }
    }

  };

}

/*****************************************************************/
/**
 * The CommonMlabeledtr interface
 *
 * @template C  The class for table cells
 */
export interface CommonMlabeledtr<C extends AnyWrapper> extends CommonMtr<C> {
}

/**
 * Shorthand for the CommonMlabeledtr constructor
 *
 * @template C  The class for table cells
 */
export type MlabeledtrConstructor<C extends AnyWrapper> = Constructor<CommonMlabeledtr<C>>;

/*****************************************************************/
/**
 * The CommonMlabeledtr wrapper mixin for the MmlMlabeledtr object
 *
 * @template C  The class for table cells
 * @template T  The Wrapper class constructor type
 */
export function CommonMlabeledtrMixin<
  C extends AnyWrapper,
  T extends MtrConstructor<C>
>(Base: T): MlabeledtrConstructor<C> & T {

  return class extends Base {

    /**
     * @override
     */
    get numCells() {
      //
      //  Don't include the label mtd
      //
      return Math.max(0, this.childNodes.length - 1);
    }

    /**
     * @override
     */
    get labeled() {
      return true;
    }

    /**
     * @override
     */
    get tableCells() {
      return this.childNodes.slice(1) as C[];
    }

    /**
     * @override
     */
    public getChild(i: number) {
      return this.childNodes[i + 1] as C;
    }

    /**
     * @override
     */
    public getChildBBoxes() {
      //
      //  Don't include the label mtd
      //
      return this.childNodes.slice(1).map(cell => cell.getBBox());
    }

  };

}
