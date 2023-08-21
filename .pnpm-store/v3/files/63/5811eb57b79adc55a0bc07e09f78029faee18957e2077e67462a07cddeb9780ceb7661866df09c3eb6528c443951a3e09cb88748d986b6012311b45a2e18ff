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
 * @fileoverview  Implements the SVGmtr wrapper for the MmlMtr object
 *                and SVGmlabeledtr for MmlMlabeledtr
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVGWrapper, SVGConstructor, Constructor} from '../Wrapper.js';
import {CommonMtrMixin} from '../../common/Wrappers/mtr.js';
import {CommonMlabeledtrMixin} from '../../common/Wrappers/mtr.js';
import {SVGmtd} from './mtd.js';
import {MmlMtr, MmlMlabeledtr} from '../../../core/MmlTree/MmlNodes/mtr.js';


/**
 * The data needed for placeCell()
 */
export type SizeData = {
  x: number,
  y: number,
  w: number,
  lSpace: number,
  rSpace: number,
  lLine: number,
  rLine: number
};

/*****************************************************************/
/**
 * The SVGmtr wrapper for the MmlMtr object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class SVGmtr<N, T, D> extends
CommonMtrMixin<SVGmtd<any, any, any>, SVGConstructor<any, any, any>>(SVGWrapper) {

  /**
   * The mtr wrapper
   */
  public static kind = MmlMtr.prototype.kind;

  /**
   * The height of the row
   */
  public H: number;
  /**
   * The depth of the row
   */
  public D: number;
  /**
   * The space above the row
   */
  public tSpace: number;
  /**
   * The space below the row
   */
  public bSpace: number;
  /**
   * The line space above the row
   */
  public tLine: number;
  /**
   * The line space below the row
   */
  public bLine: number;

  /**
   * @override
   */
  public toSVG(parent: N) {
    const svg = this.standardSVGnode(parent);
    this.placeCells(svg);
    this.placeColor();
  }

  /**
   * Set the location of the cell contents in the row and expand the cell background colors
   *
   * @param {N} svg   The container for the table
   */
  protected placeCells(svg: N) {
    const cSpace = this.parent.getColumnHalfSpacing();
    const cLines = [this.parent.fLine, ...this.parent.cLines, this.parent.fLine];
    const cWidth = this.parent.getComputedWidths();
    const scale = 1 / this.getBBox().rscale;
    let x = cLines[0];
    for (let i = 0; i < this.numCells; i++) {
      const child = this.getChild(i);
      child.toSVG(svg);
      x += this.placeCell(child, {
        x: x, y: 0, lSpace: cSpace[i] * scale, rSpace: cSpace[i + 1] * scale, w: cWidth[i] * scale,
        lLine: cLines[i] * scale, rLine: cLines[i + 1] * scale
      });
    }
  }

  /**
   * @param {SVGmtd} cell      The cell to place
   * @param {SizeData} sizes   The positioning information
   * @return {number}          The new x position
   */
  public placeCell(cell: SVGmtd<N, T, D>, sizes: SizeData): number {
    const {x, y, lSpace, w, rSpace, lLine, rLine} = sizes;
    const scale = 1 / this.getBBox().rscale;
    const [h, d] = [this.H * scale, this.D * scale];
    const [t, b] = [this.tSpace * scale, this.bSpace * scale];
    const [dx, dy] = cell.placeCell(x + lSpace, y, w, h, d);
    const W = lSpace + w + rSpace;
    cell.placeColor(-(dx + lSpace + lLine / 2), -(d + b + dy), W + (lLine + rLine) / 2, h + d + t + b);
    return W + rLine;
  }

  /**
   * Expand the backgound color to fill the entire row
   */
  protected placeColor() {
    const scale = 1 / this.getBBox().rscale;
    const adaptor = this.adaptor;
    const child = this.firstChild();
    if (child && adaptor.kind(child) === 'rect' && adaptor.getAttribute(child, 'data-bgcolor')) {
      const [TL, BL] = [(this.tLine / 2) * scale, (this.bLine / 2) * scale];
      const [TS, BS] = [this.tSpace * scale, this.bSpace * scale];
      const [H, D] = [this.H * scale, this.D * scale];
      adaptor.setAttribute(child, 'y', this.fixed(-(D + BS + BL)));
      adaptor.setAttribute(child, 'width', this.fixed(this.parent.getWidth() * scale));
      adaptor.setAttribute(child, 'height', this.fixed(TL + TS + H + D + BS + BL));
    }
  }

}

/*****************************************************************/
/**
 * The SVGlabeledmtr wrapper for the MmlMlabeledtr object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
// @ts-ignore
export class SVGmlabeledtr<N, T, D> extends
CommonMlabeledtrMixin<SVGmtd<any, any, any>, Constructor<SVGmtr<any, any, any>>>(SVGmtr) {

  /**
   * The mlabeledtr wrapper
   */
  public static kind = MmlMlabeledtr.prototype.kind;

  /**
   * @override
   */
  public toSVG(parent: N) {
    super.toSVG(parent);
    const child = this.childNodes[0];
    if (child) {
      child.toSVG(this.parent.labels);
    }
  }

}
