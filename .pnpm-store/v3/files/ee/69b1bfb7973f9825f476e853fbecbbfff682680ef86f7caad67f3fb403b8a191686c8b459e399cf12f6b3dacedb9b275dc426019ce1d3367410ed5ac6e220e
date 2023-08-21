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
 * @fileoverview  Implements a bounding-box object and operations on it
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {BIGDIMEN} from './lengths.js';

/**
 *  The data used to initialize a BBox
 */
export type BBoxData = {
  w?: number,
  h?: number,
  d?: number
};

/*****************************************************************/
/**
 *  The BBox class
 */

export class BBox {
  /**
   * Constant for pwidth of full width box
   */
  public static fullWidth = '100%';

  /**
   *  CSS styles that affect BBoxes
   */
  public static StyleAdjust: [string, string, number?][] = [
    ['borderTopWidth', 'h'],
    ['borderRightWidth', 'w'],
    ['borderBottomWidth', 'd'],
    ['borderLeftWidth', 'w', 0],
    ['paddingTop', 'h'],
    ['paddingRight', 'w'],
    ['paddingBottom', 'd'],
    ['paddingLeft', 'w', 0]
  ];

  /**
   *  These are the data stored for a bounding box
   */
  /* tslint:disable:jsdoc-require */
  public w: number;
  public h: number;
  public d: number;
  public scale: number;
  public rscale: number; // scale relative to the parent's scale
  public L: number;      // extra space on the left
  public R: number;      // extra space on the right
  public pwidth: string; // percentage width (for tables)
  public ic: number;     // italic correction
  public sk: number;     // skew
  public dx: number;     // offset for combining characters as accents
  /* tslint:enable */

  /**
   * @return {BBox}  A BBox initialized to zeros
   */
  public static zero(): BBox {
    return new BBox({h: 0, d: 0, w: 0});
  }

  /**
   * @return {BBox}  A BBox with height and depth not set
   */
  public static empty(): BBox {
    return new BBox();
  }

  /**
   * @param {BBoxData} def  The data with which to initialize the BBox
   *
   * @constructor
   */
  constructor(def: BBoxData = {w: 0, h: -BIGDIMEN, d: -BIGDIMEN}) {
    this.w = def.w || 0;
    this.h = ('h' in def ? def.h : -BIGDIMEN);
    this.d = ('d' in def ? def.d : -BIGDIMEN);
    this.L = this.R = this.ic = this.sk = this.dx = 0;
    this.scale = this.rscale = 1;
    this.pwidth = '';
  }

  /**
   * Set up a bbox for append() and combine() operations
   * @return {BBox}  the boox itself (for chaining calls)
   */
  public empty(): BBox {
    this.w = 0;
    this.h = this.d = -BIGDIMEN;
    return this;
  }

  /**
   * Convert any unspecified values into zeros
   */
  public clean () {
    if (this.w === -BIGDIMEN) this.w = 0;
    if (this.h === -BIGDIMEN) this.h = 0;
    if (this.d === -BIGDIMEN) this.d = 0;
  }

  /**
   * @param {number} scale  The scale to use to modify the bounding box size
   */
  public rescale(scale: number) {
    this.w *= scale;
    this.h *= scale;
    this.d *= scale;
  }

  /**
   * @param {BBox} cbox  A bounding to combine with this one
   * @param {number} x   An x-offest for the child bounding box
   * @param {number} y   A y-offset for the child bounding box
   */
  public combine(cbox: BBox, x: number = 0, y: number = 0) {
    let rscale = cbox.rscale;
    let w = x + rscale * (cbox.w + cbox.L + cbox.R);
    let h = y + rscale * cbox.h;
    let d = rscale * cbox.d - y;
    if (w > this.w) this.w = w;
    if (h > this.h) this.h = h;
    if (d > this.d) this.d = d;
  }

  /**
   * @param {BBox} cbox  A bounding box to be added to the right of this one
   */
  public append(cbox: BBox) {
    let scale = cbox.rscale;
    this.w += scale * (cbox.w + cbox.L + cbox.R);
    if (scale * cbox.h > this.h) {
      this.h = scale * cbox.h;
    }
    if (scale * cbox.d > this.d) {
      this.d = scale * cbox.d;
    }
  }

  /**
   * @param {BBox} cbox  The bounding box to use to overwrite this one
   */
  public updateFrom(cbox: BBox) {
    this.h = cbox.h;
    this.d = cbox.d;
    this.w = cbox.w;
    if (cbox.pwidth) {
      this.pwidth = cbox.pwidth;
    }
  }

}
