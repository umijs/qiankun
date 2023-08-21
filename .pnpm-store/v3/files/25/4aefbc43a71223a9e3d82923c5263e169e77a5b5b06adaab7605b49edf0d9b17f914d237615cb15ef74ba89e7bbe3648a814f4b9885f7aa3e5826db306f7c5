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
 * @fileoverview  Implements the SVGmtd wrapper for the MmlMtd object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVGWrapper, SVGConstructor} from '../Wrapper.js';
import {CommonMtdMixin} from '../../common/Wrappers/mtd.js';
import {MmlMtd} from '../../../core/MmlTree/MmlNodes/mtd.js';

/*****************************************************************/
/**
 * The SVGmtd wrapper for the MmlMtd object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
// @ts-ignore
export class SVGmtd<N, T, D> extends
CommonMtdMixin<SVGConstructor<any, any, any>>(SVGWrapper) {

  /**
   * The mtd wrapper
   */
  public static kind = MmlMtd.prototype.kind;

  /**
   * @param {number} x    The x offset of the left side of the cell
   * @param {number} y    The y offset of the baseline of the cell
   * @param {number} W    The width of the cell
   * @param {number} H    The height of the cell
   * @param {number} D    The depth of the cell
   * @return {[number, number]}   The x and y offsets used
   */
  public placeCell(x: number, y: number, W: number, H: number, D: number): [number, number] {
    const bbox = this.getBBox();
    const h = Math.max(bbox.h, .75);
    const d = Math.max(bbox.d, .25);
    const calign = this.node.attributes.get('columnalign') as string;
    const ralign = this.node.attributes.get('rowalign') as string;
    const alignX = this.getAlignX(W, bbox, calign);
    const alignY = this.getAlignY(H, D, h, d, ralign);
    this.place(x + alignX, y + alignY);
    return [alignX, alignY];
  }

  /**
   * @param {number} x    The x offset of the left side of the cell
   * @param {number} y    The y position of the bottom of the cell
   * @param {number} W    The width of the cell
   * @param {number} H    The height + depth of the cell
   */
  public placeColor(x: number, y: number, W: number, H: number) {
    const adaptor = this.adaptor;
    const child = this.firstChild();
    if (child && adaptor.kind(child) === 'rect' && adaptor.getAttribute(child, 'data-bgcolor')) {
      adaptor.setAttribute(child, 'x', this.fixed(x));
      adaptor.setAttribute(child, 'y', this.fixed(y));
      adaptor.setAttribute(child, 'width', this.fixed(W));
      adaptor.setAttribute(child, 'height', this.fixed(H));
    }
  }

}
