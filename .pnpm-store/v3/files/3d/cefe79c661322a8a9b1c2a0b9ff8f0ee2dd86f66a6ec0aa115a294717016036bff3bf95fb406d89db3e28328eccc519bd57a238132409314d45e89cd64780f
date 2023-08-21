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
 * @fileoverview  Implements the CommonMtable wrapper mixin for the MmlMtable object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AnyWrapper, WrapperConstructor, Constructor} from '../Wrapper.js';
import {CommonMtr} from './mtr.js';
import {CommonMo} from './mo.js';
import {BBox} from '../../../util/BBox.js';
import {DIRECTION} from '../FontData.js';
import {split, isPercent} from '../../../util/string.js';
import {sum, max} from '../../../util/numeric.js';

/*****************************************************************/
/**
 * The heights, depths, and widths of the rows and columns
 * Plus the natural height and depth (i.e., without the labels)
 * Plus the label column width
 */
export type TableData = {
  H: number[];
  D: number[];
  W: number[];
  NH: number[];
  ND: number[];
  L: number;
};

/**
 * An array of table dimensions
 */
export type ColumnWidths = (string | number | null)[];

/*****************************************************************/
/**
 * The CommonMtable interface
 *
 * @template C   The class for table cells
 * @template R   The class for table rows
 */
export interface CommonMtable<C extends AnyWrapper, R extends CommonMtr<C>> extends AnyWrapper {

  /**
   * The number of columns and rows in the table
   */
  numCols: number;
  numRows: number;

  /**
   * True if there are labeled rows
   */
  hasLabels: boolean;

  /**
   * True if this mtable is the top element, or in a top-most mrow
   */
  isTop: boolean;

  /**
   * The parent node of this table (skipping non-parents and mrows)
   *   and the position of the table as a child node
   */
  container: AnyWrapper;
  containerI: number;

  /**
   * The spacing and line data
   */
  frame: boolean;
  fLine: number;
  fSpace: number[];
  cSpace: number[];
  rSpace: number[];
  cLines: number[];
  rLines: number[];
  cWidths: (number | string)[];

  /**
   * The bounding box information for the table rows and columns
   */
  data: TableData;

  /**
   * The table cells that have percentage-width content
   */
  pwidthCells: [C, number][];

  /**
   * The full width of a percentage-width table
   */
  pWidth: number;

  /**
   * The rows of the table
   */
  readonly tableRows: R[];

  /**
   * @override
   */
  childNodes: R[];

  /**
   * Find the container and the child position of the table
   */
  findContainer(): void;

  /**
   * If the table has a precentage width or has labels, set the pwidth of the bounding box
   */
  getPercentageWidth(): void;

  /**
   * Stretch the rows to the equal height or natural height
   */
  stretchRows(): void;

  /**
   * Stretch the columns to their proper widths
   */
  stretchColumns(): void;

  /**
   * Handle horizontal stretching within the ith column
   *
   * @param {number} i   The column number
   * @param {number} W   The computed width of the column (or null of not computed)
   */
  stretchColumn(i: number, W: number): void;

  /**
   * Determine the row heights and depths, the column widths,
   * and the natural width and height of the table.
   *
   * @return {TableData}  The dimensions of the rows and columns
   */
  getTableData(): TableData;

  /**
   * @param {C} cell         The cell whose height, depth, and width are to be added into the H, D, W arrays
   * @param {number} i       The column number for the cell
   * @param {number} j       The row number for the cell
   * @param {string} align   The row alignment
   * @param {number[]} H     The maximum height for each of the rows
   * @param {number[]} D     The maximum depth for each of the rows
   * @param {number[]} W     The maximum width for each column
   * @param {number} M       The current height for items aligned top and bottom
   * @return {number}        The updated value for M
   */
  updateHDW(cell: C, i: number, j: number, align: string, H: number[], D: number[], W: number[], M: number): number;

  /**
   * Extend the H and D of a row to cover the maximum height needed by top/bottom aligned items
   *
   * @param {number} i     The row whose hight and depth should be adjusted
   * @param {number[]} H   The row heights
   * @param {number[]} D   The row depths
   * @param {number} M     The maximum height of top/bottom aligned items
   */
  extendHD(i: number, H: number[], D: number[], M: number): void;

  /**
   * Set cell widths for columns with percentage width children
   */
  setColumnPWidths(): void;

  /**
   * @param {number} height   The total height of the table
   * @return {number[]}       The [height, depth] for the aligned table
   */
  getBBoxHD(height: number): number[];

  /**
   * Get bbox left and right amounts to cover labels
   */
  getBBoxLR(): number[];

  /**
   * @param {string} side                 The side for the labels
   * @return {[number, string, number]}   The padding, alignment, and shift amounts
   */
  getPadAlignShift(side: string): [number, string, number];

  /**
   * @return {number}    The true width of the table (without labels)
   */
  getWidth(): number;

  /**
   * @return {number}   The maximum height of a row
   */
  getEqualRowHeight(): number;

  /**
   * @return {number[]}   The array of computed widths
   */
  getComputedWidths(): number[];

  /**
   * Determine the column widths that can be computed (and need to be set).
   * The resulting arrays will have numbers for fixed-size arrays,
   *   strings for percentage sizes that can't be determined now,
   *   and null for stretchy columns tht will expand to fill the extra space.
   * Depending on the width specified for the table, different column
   *  values can be determined.
   *
   * @return {ColumnWidths}  The array of widths
   */
  getColumnWidths(): ColumnWidths;

  /**
   * For tables with equal columns, get the proper amount per row.
   *
   * @return {ColumnWidths}  The array of widths
   */
  getEqualColumns(width: string): ColumnWidths;

  /**
   * For tables with width="auto", auto and fit columns
   * will end up being natural width, so don't need to
   * set those explicitly.
   *
   * @return {ColumnWidths}  The array of widths
   */
  getColumnWidthsAuto(swidths: string[]): ColumnWidths;

  /**
   * For tables with percentage widths, let 'fit' columns (or 'auto'
   * columns if there are not 'fit' ones) will stretch automatically,
   * but for 'auto' columns (when there are 'fit' ones), set the size
   * to the natural size of the column.
   *
   * @param {string[]} widths  Strings giving the widths
   * @return {ColumnWidths}    The array of widths
   */
  getColumnWidthsPercent(widths: string[]): ColumnWidths;

  /**
   * For fixed-width tables, compute the column widths of all columns.
   *
   * @return {ColumnWidths}  The array of widths
   */
  getColumnWidthsFixed(swidths: string[], width: number): ColumnWidths;

  /**
   * @param {number} i      The row number (starting at 0)
   * @param {string} align  The alignment on that row
   * @return {number}       The offest of the alignment position from the top of the table
   */
  getVerticalPosition(i: number, align: string): number;

  /**
   * @param {number} fspace   The frame spacing to use
   * @param {number[]} space  The array of spacing values to convert to strings
   * @param {number} scale    A scaling factor to use for the sizes
   * @return {string[]}       The half-spacing as stings with units of "em"
   *                           with frame spacing at the beginning and end
   */
  getEmHalfSpacing(fspace: number, space: number[], scale?: number): string[];

  /**
   * @return {number[]}   The half-spacing for rows with frame spacing at the ends
   */
  getRowHalfSpacing(): number[];

  /**
   * @return {number[]}   The half-spacing for columns with frame spacing at the ends
   */
  getColumnHalfSpacing(): number[];

  /**
   * @return {[string,number|null]}  The alignment and row number (based at 0) or null
   */
  getAlignmentRow(): [string, number | null];

  /**
   * @param {string} name           The name of the attribute to get as an array
   * @param {number=} i             Return this many fewer than numCols entries
   * @return {string[]}             The array of values in the given attribute, split at spaces,
   *                                 padded to the number of table columns (minus 1) by repeating the last entry
   */
  getColumnAttributes(name: string, i?: number): string[];

  /**
   * @param {string} name           The name of the attribute to get as an array
   * @param {number=} i             Return this many fewer than numRows entries
   * @return {string[]}             The array of values in the given attribute, split at spaces,
   *                                 padded to the number of table rows (minus 1) by repeating the last entry
   */
  getRowAttributes(name: string, i?: number): string[];

  /**
   * @param {string} name           The name of the attribute to get as an array
   * @return {string[]}             The array of values in the given attribute, split at spaces
   *                                 (after leading and trailing spaces are removed, and multiple
   *                                  spaces have been collapsed to one).
   */
  getAttributeArray(name: string): string[];

  /**
   * Adds "em" to a list of dimensions, after dividing by n (defaults to 1).
   *
   * @param {string[]} list   The array of dimensions (in em's)
   * @param {nunber=} n       The number to divide each dimension by after converted
   * @return {string[]}       The array of values with "em" added
   */
  addEm(list: number[], n?: number): string[];

  /**
   * Converts an array of dimensions (with arbitrary units) to an array of numbers
   *   representing the dimensions in units of em's.
   *
   * @param {string[]} list   The array of dimensions to be turned into em's
   * @return {number[]}       The array of values converted to em's
   */
  convertLengths(list: string[]): number[];

}

/**
 * Shorthand for the CommonMtable constructor
 */
export type MtableConstructor<C extends AnyWrapper, R extends CommonMtr<C>> = Constructor<CommonMtable<C, R>>;

/*****************************************************************/
/**
 * The CommonMtable wrapper mixin for the MmlMtable object
 *
 * @template C  The table cell class
 * @temlpate R  the table row class
 * @template T  The Wrapper class constructor type
 */
export function CommonMtableMixin<
  C extends AnyWrapper,
  R extends CommonMtr<C>,
  T extends WrapperConstructor
>(Base: T): MtableConstructor<C, R> & T {

  return class extends Base {

    /**
     * The number of columns in the table
     */
    public numCols: number = 0;
    /**
     * The number of rows in the table
     */
    public numRows: number = 0;

    /**
     * True if there are labeled rows
     */
    public hasLabels: boolean;

    /**
     * True if this mtable is the top element, or in a top-most mrow
     */
    public isTop: boolean;

    /**
     * The parent node of this table (skipping non-parents and mrows)
     */
    public container: AnyWrapper;
    /**
     * The position of the table as a child node of its container
     */
    public containerI: number;

    /**
     * True if there is a frame
     */
    public frame: boolean;
    /**
     * The size of the frame line (or 0 if none)
     */
    public fLine: number;
    /**
     * frame spacing on the left and right
     */
    public fSpace: number[];
    /**
     * The spacing between columns
     */
    public cSpace: number[];
    /**
     * The spacing between rows
     */
    public rSpace: number[];
    /**
     * The width of columns lines (or 0 if no line for the column)
     */
    public cLines: number[];
    /**
     * The width of row lines (or 0 if no lone for that row)
     */
    public rLines: number[];
    /**
     * The column widths (or percentages, etc.)
     */
    public cWidths: (number | string)[];

    /**
     * The bounding box information for the table rows and columns
     */
    public data: TableData = null;

    /**
     * The table cells that have percentage-width content
     */
    public pwidthCells: [C, number][] = [];

    /**
     * The full width of a percentage-width table
     */
    public pWidth: number = 0;

    /**
     * @return {R[]}  The rows of the table
     */
    get tableRows(): R[] {
      return this.childNodes;
    }

    /******************************************************************/

    /**
     * @override
     * @constructor
     */
    constructor(...args: any[]) {
      super(...args);
      //
      // Determine the number of columns and rows, and whether the table is stretchy
      //
      this.numCols = max(this.tableRows.map(row => row.numCells));
      this.numRows = this.childNodes.length;
      this.hasLabels = this.childNodes.reduce((value, row) => value || row.node.isKind('mlabeledtr'), false);
      this.findContainer();
      this.isTop = !this.container || (this.container.node.isKind('math') && !this.container.parent);
      if (this.isTop) {
        this.jax.table = this;
      }
      this.getPercentageWidth();
      //
      // Get the frame, row, and column parameters
      //
      const attributes = this.node.attributes;
      this.frame = attributes.get('frame') !== 'none';
      this.fLine = (this.frame && attributes.get('frame') ? .07 : 0);
      this.fSpace = (this.frame ? this.convertLengths(this.getAttributeArray('framespacing')) : [0, 0]);
      this.cSpace = this.convertLengths(this.getColumnAttributes('columnspacing'));
      this.rSpace = this.convertLengths(this.getRowAttributes('rowspacing'));
      this.cLines = this.getColumnAttributes('columnlines').map(x => (x === 'none' ? 0 : .07));
      this.rLines = this.getRowAttributes('rowlines').map(x => (x === 'none' ? 0 : .07));
      this.cWidths = this.getColumnWidths();
      //
      // Stretch the rows and columns
      //
      this.stretchRows();
      this.stretchColumns();
    }

    /**
     * Find the container and the child position of the table
     */
    public findContainer() {
      let node = this as AnyWrapper;
      let parent = node.parent as AnyWrapper;
      while (parent && (parent.node.notParent || parent.node.isKind('mrow'))) {
        node = parent;
        parent = parent.parent;
      }
      this.container = parent;
      this.containerI = node.node.childPosition();
    }

    /**
     * If the table has a precentage width or has labels, set the pwidth of the bounding box
     */
    public getPercentageWidth() {
      if (this.hasLabels) {
        this.bbox.pwidth = BBox.fullWidth;
      } else {
        const width = this.node.attributes.get('width') as string;
        if (isPercent(width)) {
          this.bbox.pwidth = width;
        }
      }
    }

    /**
     * Stretch the rows to the equal height or natural height
     */
    public stretchRows() {
      const equal = this.node.attributes.get('equalrows') as boolean;
      const HD = (equal ? this.getEqualRowHeight() : 0);
      const {H, D} = (equal ? this.getTableData() : {H: [0], D: [0]});
      const rows = this.tableRows;
      for (let i = 0; i < this.numRows; i++) {
        const hd = (equal ? [(HD + H[i] - D[i]) / 2, (HD - H[i] + D[i]) / 2] : null);
        rows[i].stretchChildren(hd);
      }
    }

    /**
     * Stretch the columns to their proper widths
     */
    public stretchColumns() {
      for (let i = 0; i < this.numCols; i++) {
        const width = (typeof this.cWidths[i] === 'number' ? this.cWidths[i] as number : null);
        this.stretchColumn(i, width);
      }
    }

    /**
     * Handle horizontal stretching within the ith column
     *
     * @param {number} i   The column number
     * @param {number} W   The computed width of the column (or null of not computed)
     */
    public stretchColumn(i: number, W: number) {
      let stretchy: AnyWrapper[] = [];
      //
      //  Locate and count the stretchy children
      //
      for (const row of this.tableRows) {
        const cell = row.getChild(i);
        if (cell) {
          const child = cell.childNodes[0];
          if (child.stretch.dir === DIRECTION.None &&
              child.canStretch(DIRECTION.Horizontal)) {
            stretchy.push(child);
          }
        }
      }
      let count = stretchy.length;
      let nodeCount = this.childNodes.length;
      if (count && nodeCount > 1) {
        if (W === null) {
          W = 0;
          //
          //  If all the children are stretchy, find the largest one,
          //  otherwise, find the width of the non-stretchy children.
          //
          let all = (count > 1 && count === nodeCount);
          for (const row of this.tableRows) {
            const cell = row.getChild(i);
            if (cell) {
              const child = cell.childNodes[0];
              const noStretch = (child.stretch.dir === DIRECTION.None);
              if (all || noStretch) {
                const {w} = child.getBBox(noStretch);
                if (w > W) {
                  W = w;
                }
              }
            }
          }
        }
        //
        //  Stretch the stretchable children
        //
        for (const child of stretchy) {
          (child.coreMO() as CommonMo).getStretchedVariant([W]);
        }
      }
    }

    /******************************************************************/

    /**
     * Determine the row heights and depths, the column widths,
     * and the natural width and height of the table.
     *
     * @return {TableData}  The dimensions of the rows and columns
     */
    public getTableData(): TableData {
      if (this.data) {
        return this.data;
      }
      const H = new Array(this.numRows).fill(0);
      const D = new Array(this.numRows).fill(0);
      const W = new Array(this.numCols).fill(0);
      const NH = new Array(this.numRows);
      const ND = new Array(this.numRows);
      const LW = [0];
      const rows = this.tableRows;
      for (let j = 0; j < rows.length; j++) {
        let M = 0;
        const row = rows[j];
        const align = row.node.attributes.get('rowalign') as string;
        for (let i = 0; i < row.numCells; i++) {
          const cell = row.getChild(i);
          M = this.updateHDW(cell, i, j, align, H, D, W, M);
          this.recordPWidthCell(cell, i);
        }
        NH[j] = H[j];
        ND[j] = D[j];
        if (row.labeled) {
          M = this.updateHDW(row.childNodes[0], 0, j, align, H, D, LW, M);
        }
        this.extendHD(j, H, D, M);
        this.extendHD(j, NH, ND, M);
      }
      const L = LW[0];
      this.data = {H, D, W, NH, ND, L};
      return this.data;
    }

    /**
     * @override
     */
    public updateHDW(
      cell: C, i: number, j: number, align: string, H: number[], D: number[], W: number[], M: number
    ): number {
      let {h, d, w} = cell.getBBox();
      const scale = cell.parent.bbox.rscale;
      if (cell.parent.bbox.rscale !== 1) {
        h *= scale;
        d *= scale;
        w *= scale;
      }
      if (this.node.getProperty('useHeight')) {
        if (h < .75) h = .75;
        if (d < .25) d = .25;
      }
      let m = 0;
      align = cell.node.attributes.get('rowalign') as string || align;
      if (align !== 'baseline' && align !== 'axis') {
        m = h + d;
        h = d = 0;
      }
      if (h > H[j]) H[j] = h;
      if (d > D[j]) D[j] = d;
      if (m > M) M = m;
      if (W && w > W[i]) W[i] = w;
      return M;
    }

    /**
     * @override
     */
    public extendHD(i: number, H: number[], D: number[], M: number) {
      const d = (M - (H[i] + D[i])) / 2;
      if (d < .00001) return;
      H[i] += d;
      D[i] += d;
    }

    /**
     * @param {C} cell     The cell to check for percentage widths
     * @param {number} i   The column index of the cell
     */
    public recordPWidthCell(cell: C, i: number) {
      if (cell.childNodes[0] && cell.childNodes[0].getBBox().pwidth) {
        this.pwidthCells.push([cell, i]);
      }
    }

    /**
     * @override
     */
    public computeBBox(bbox: BBox, _recompute: boolean = false) {
      const {H, D} = this.getTableData();
      let height, width;
      //
      // For equal rows, use the common height and depth for all rows
      // Otherwise, use the height and depths for each row separately.
      // Add in the spacing, line widths, and frame size.
      //
      if (this.node.attributes.get('equalrows') as boolean) {
        const HD = this.getEqualRowHeight();
        height = sum([].concat(this.rLines, this.rSpace)) + HD * this.numRows;
      } else {
        height = sum(H.concat(D, this.rLines, this.rSpace));
      }
      height += 2 * (this.fLine + this.fSpace[1]);
      //
      //  Get the widths of all columns
      //
      const CW = this.getComputedWidths();
      //
      //  Get the expected width of the table
      //
      width = sum(CW.concat(this.cLines, this.cSpace)) + 2 * (this.fLine + this.fSpace[0]);
      //
      //  If the table width is not 'auto', determine the specified width
      //    and pick the larger of the specified and computed widths.
      //
      const w = this.node.attributes.get('width') as string;
      if (w !== 'auto') {
        width = Math.max(this.length2em(w, 0) + 2 * this.fLine, width);
      }
      //
      //  Return the bounding box information
      //
      let [h, d] = this.getBBoxHD(height);
      bbox.h = h;
      bbox.d = d;
      bbox.w = width;
      let [L, R] = this.getBBoxLR();
      bbox.L = L;
      bbox.R = R;
      //
      //  Handle cell widths if width is not a percentage
      //
      if (!isPercent(w)) {
        this.setColumnPWidths();
      }
    }

    /**
     * @override
     */
    public setChildPWidths(_recompute: boolean, cwidth: number, _clear: boolean) {
      const width = this.node.attributes.get('width') as string;
      if (!isPercent(width)) return false;
      if (!this.hasLabels) {
        this.bbox.pwidth = '';
        this.container.bbox.pwidth = '';
      }
      const {w, L, R} = this.bbox;
      const labelInWidth = this.node.attributes.get('data-width-includes-label') as boolean;
      const W = Math.max(w, this.length2em(width, Math.max(cwidth, L + w + R))) - (labelInWidth ? L + R : 0);
      const cols = (this.node.attributes.get('equalcolumns') as boolean ?
                    Array(this.numCols).fill(this.percent(1 / Math.max(1, this.numCols))) :
                    this.getColumnAttributes('columnwidth', 0));
      this.cWidths = this.getColumnWidthsFixed(cols, W);
      const CW = this.getComputedWidths();
      this.pWidth = sum(CW.concat(this.cLines, this.cSpace)) + 2 * (this.fLine + this.fSpace[0]);
      if (this.isTop) {
        this.bbox.w = this.pWidth;
      }
      this.setColumnPWidths();
      if (this.pWidth !== w) {
        this.parent.invalidateBBox();
      }
      return this.pWidth !== w;
    }

    /**
     * Finalize any cells that have percentage-width content
     */
    public setColumnPWidths() {
      const W = this.cWidths as number[];
      for (const [cell, i] of this.pwidthCells) {
        if (cell.setChildPWidths(false, W[i])) {
          cell.invalidateBBox();
          cell.getBBox();
        }
      }
    }

    /**
     * @param {number} height   The total height of the table
     * @return {[number, number]}  The [height, depth] for the aligned table
     */
    public getBBoxHD(height: number): [number, number] {
      const [align, row] = this.getAlignmentRow();
      if (row === null) {
        const a = this.font.params.axis_height;
        const h2 = height / 2;
        const HD: {[key: string]: [number, number]} = {
          top: [0, height],
          center: [h2, h2],
          bottom: [height, 0],
          baseline: [h2, h2],
          axis: [h2 + a, h2 - a]
        };
        return HD[align] || [h2, h2];
      } else {
        const y = this.getVerticalPosition(row, align);
        return [y, height - y];
      }
    }

    /**
     * Get bbox left and right amounts to cover labels
     */
    public getBBoxLR() {
      if (this.hasLabels) {
        const attributes = this.node.attributes;
        const side = attributes.get('side') as string;
        let [pad, align] = this.getPadAlignShift(side);
        //
        // If labels are included in the width,
        //   remove the frame spacing if there is no frame line (added by multline)
        //   and use left or right justification rather than centering so that
        //   there is no extra space reserved for the label on the opposite side,
        //   (as there usually is to center the equation).
        //
        const labels = this.hasLabels && !!attributes.get('data-width-includes-label');
        if (labels && this.frame && this.fSpace[0]) {
          pad -= this.fSpace[0];
        }
        return (align === 'center' && !labels ? [pad, pad] :
                side === 'left' ? [pad, 0] : [0, pad]);
      }
      return [0, 0];
    }

    /**
     * @param {string} side                 The side for the labels
     * @return {[number, string, number]}   The padding, alignment, and shift amounts
     */
    public getPadAlignShift(side: string): [number, string, number] {
      //
      //  Make sure labels don't overlap table
      //
      const {L} = this.getTableData();
      const sep = this.length2em(this.node.attributes.get('minlabelspacing'));
      let pad = L + sep;
      const [lpad, rpad] = (this.styles == null ? ['', ''] :
                            [this.styles.get('padding-left'), this.styles.get('padding-right')]);
      if (lpad || rpad) {
        pad = Math.max(pad, this.length2em(lpad || '0'), this.length2em(rpad || '0'));
      }
      //
      //  Handle indentation
      //
      let [align, shift] = this.getAlignShift();
      if (align === side) {
        shift = (side === 'left' ? Math.max(pad, shift) - pad : Math.min(-pad, shift) + pad);
      }
      return [pad, align, shift] as [number, string, number];
    }

    /**
     * @override
     */
    public getAlignShift() {
      return (this.isTop ? super.getAlignShift() :
              [this.container.getChildAlign(this.containerI), 0] as [string, number]);
    }

    /**
     * @return {number}    The true width of the table (without labels)
     */
    public getWidth(): number {
      return this.pWidth || this.getBBox().w;
    }

    /******************************************************************/

    /**
     * @return {number}   The maximum height of a row
     */
    public getEqualRowHeight(): number {
      const {H, D} = this.getTableData();
      const HD = Array.from(H.keys()).map(i => H[i] + D[i]);
      return Math.max.apply(Math, HD);
    }

    /**
     * @return {number[]}   The array of computed widths
     */
    public getComputedWidths(): number[] {
      const W = this.getTableData().W;
      let CW = Array.from(W.keys()).map(i => {
        return (typeof this.cWidths[i] === 'number' ? this.cWidths[i] as number : W[i]);
      });
      if (this.node.attributes.get('equalcolumns') as boolean) {
        CW = Array(CW.length).fill(max(CW));
      }
      return CW;
    }

    /**
     * Determine the column widths that can be computed (and need to be set).
     * The resulting arrays will have numbers for fixed-size arrays,
     *   strings for percentage sizes that can't be determined now,
     *   and null for stretchy columns that will expand to fill the extra space.
     * Depending on the width specified for the table, different column
     *  values can be determined.
     *
     * @return {(string|number|null)[]}  The array of widths
     */
    public getColumnWidths(): (string | number | null)[] {
      const width = this.node.attributes.get('width') as string;
      if (this.node.attributes.get('equalcolumns') as boolean) {
        return this.getEqualColumns(width);
      }
      const swidths = this.getColumnAttributes('columnwidth', 0);
      if (width === 'auto') {
        return this.getColumnWidthsAuto(swidths);
      }
      if (isPercent(width)) {
        return this.getColumnWidthsPercent(swidths);
      }
      return this.getColumnWidthsFixed(swidths, this.length2em(width));
    }

    /**
     * For tables with equal columns, get the proper amount per column.
     *
     * @param {string} width   The width attribute of the table
     * @return {(string|number|null)[]}  The array of widths
     */
    public getEqualColumns(width: string): (string | number | null)[] {
      const n = Math.max(1, this.numCols);
      let cwidth;
      if (width === 'auto') {
        const {W} = this.getTableData();
        cwidth = max(W);
      } else if (isPercent(width)) {
        cwidth = this.percent(1 / n);
      } else {
        const w = sum([].concat(this.cLines, this.cSpace)) + 2 * this.fSpace[0];
        cwidth = Math.max(0, this.length2em(width) - w) / n;
      }
      return Array(this.numCols).fill(cwidth);
    }

    /**
     * For tables with width="auto", auto and fit columns
     * will end up being natural width, so don't need to
     * set those explicitly.
     *
     * @param {string[]} swidths   The split and padded columnwidths attribute
     * @return {ColumnWidths}  The array of widths
     */
    public getColumnWidthsAuto(swidths: string[]): ColumnWidths {
      return swidths.map(x => {
        if (x === 'auto' || x === 'fit') return null;
        if (isPercent(x)) return x;
        return this.length2em(x);
      });
    }

    /**
     * For tables with percentage widths, the 'fit' columns (or 'auto'
     * columns if there are not 'fit' ones) will stretch automatically,
     * but for 'auto' columns (when there are 'fit' ones), set the size
     * to the natural size of the column.
     *
     * @param {string[]} swidths   The split and padded columnwidths attribute
     * @return {ColumnWidths}      The array of widths
     */
    public getColumnWidthsPercent(swidths: string[]): ColumnWidths {
      const hasFit = swidths.indexOf('fit') >= 0;
      const {W} = (hasFit ? this.getTableData() : {W: null});
      return Array.from(swidths.keys()).map(i => {
        const x = swidths[i];
        if (x === 'fit') return null;
        if (x === 'auto') return (hasFit ? W[i] : null);
        if (isPercent(x)) return x;
        return this.length2em(x);
      });
    }

    /**
     * For fixed-width tables, compute the column widths of all columns.
     *
     * @param {string[]} swidths   The split and padded columnwidths attribute
     * @param {number} width       The width of the table
     * @return {ColumnWidths}      The array of widths
     */
    public getColumnWidthsFixed(swidths: string[], width: number): ColumnWidths {
      //
      // Get the indices of the fit and auto columns, and the number of fit or auto entries.
      // If there are fit or auto columns, get the column widths.
      //
      const indices = Array.from(swidths.keys());
      const fit = indices.filter(i => swidths[i] === 'fit');
      const auto = indices.filter(i => swidths[i] === 'auto');
      const n = fit.length || auto.length;
      const {W} = (n ? this.getTableData() : {W: null});
      //
      // Determine the space remaining from the fixed width after the
      //   separation and lines have been removed (cwidth), and
      //   after the width of the columns have been removed (dw).
      //
      const cwidth = width - sum([].concat(this.cLines, this.cSpace)) - 2 * this.fSpace[0];
      let dw = cwidth;
      indices.forEach(i => {
        const x = swidths[i];
        dw -= (x === 'fit' || x === 'auto' ? W[i] : this.length2em(x, cwidth));
      });
      //
      // Get the amount of extra space per column, or 0 (fw)
      //
      const fw = (n && dw > 0 ? dw / n : 0);
      //
      // Return the column widths (plus extra space for those that are stretching
      //
      return indices.map(i => {
        const x = swidths[i];
        if (x === 'fit') return W[i] + fw;
        if (x === 'auto') return W[i] + (fit.length === 0 ? fw : 0);
        return this.length2em(x, cwidth);
      });
    }

    /**
     * @param {number} i      The row number (starting at 0)
     * @param {string} align  The alignment on that row
     * @return {number}       The offest of the alignment position from the top of the table
     */
    public getVerticalPosition(i: number, align: string): number {
      const equal = this.node.attributes.get('equalrows') as boolean;
      const {H, D} = this.getTableData();
      const HD = (equal ? this.getEqualRowHeight() : 0);
      const space = this.getRowHalfSpacing();
      //
      //  Start with frame size and add in spacing, height and depth,
      //    and line thickness for each row.
      //
      let y = this.fLine;
      for (let j = 0; j < i; j++) {
        y += space[j] + (equal ? HD : H[j] + D[j]) + space[j + 1] + this.rLines[j];
      }
      //
      //  For equal rows, get updated height and depth
      //
      const [h, d] = (equal ? [(HD + H[i] - D[i]) / 2, (HD - H[i] + D[i]) / 2] : [H[i], D[i]]);
      //
      //  Add the offset into the specified row
      //
      const offset: {[name: string]: number} = {
        top: 0,
        center: space[i] + (h + d) / 2,
        bottom: space[i] + h + d + space[i + 1],
        baseline: space[i] + h,
        axis: space[i] + h - .25
      };
      y += offset[align] || 0;
      //
      //  Return the final result
      //
      return y;
    }

    /******************************************************************/

    /**
     * @param {number} fspace   The frame spacing to use
     * @param {number[]} space  The array of spacing values to convert to strings
     * @param {number} scale    A scaling factor to use for the sizes
     * @return {string[]}       The half-spacing as stings with units of "em"
     *                           with frame spacing at the beginning and end
     */
    public getEmHalfSpacing(fspace: number, space: number[], scale: number = 1): string[] {
      //
      //  Get the column spacing values, and add the frame spacing values at the left and right
      //
      const fspaceEm = this.em(fspace * scale);
      const spaceEm = this.addEm(space, 2 / scale);
      spaceEm.unshift(fspaceEm);
      spaceEm.push(fspaceEm);
      return spaceEm;
    }

    /**
     * @return {number[]}   The half-spacing for rows with frame spacing at the ends
     */
    public getRowHalfSpacing(): number[] {
      const space = this.rSpace.map(x => x / 2);
      space.unshift(this.fSpace[1]);
      space.push(this.fSpace[1]);
      return space;
    }

    /**
     * @return {number[]}   The half-spacing for columns with frame spacing at the ends
     */
    public getColumnHalfSpacing(): number[] {
      const space = this.cSpace.map(x => x / 2);
      space.unshift(this.fSpace[0]);
      space.push(this.fSpace[0]);
      return space;
    }

    /**
     * @return {[string,number|null]}  The alignment and row number (based at 0) or null
     */
    public getAlignmentRow(): [string, number] {
      const [align, row] = split(this.node.attributes.get('align') as string);
      if (row == null) return [align, null];
      let i = parseInt(row);
      if (i < 0) i += this.numRows + 1;
      return [align, i < 1 || i > this.numRows ? null : i - 1];
    }

    /**
     * @param {string} name           The name of the attribute to get as an array
     * @param {number=} i             Return this many fewer than numCols entries
     * @return {string[]}             The array of values in the given attribute, split at spaces,
     *                                 padded to the number of table columns (minus 1) by repeating the last entry
     */
    public getColumnAttributes(name: string, i: number = 1): string[] | null {
      const n = this.numCols - i;
      const columns = this.getAttributeArray(name);
      if (columns.length === 0) return null;
      while (columns.length < n) {
        columns.push(columns[columns.length - 1]);
      }
      if (columns.length > n) {
        columns.splice(n);
      }
      return columns;
    }

    /**
     * @param {string} name           The name of the attribute to get as an array
     * @param {number=} i             Return this many fewer than numRows entries
     * @return {string[]}             The array of values in the given attribute, split at spaces,
     *                                 padded to the number of table rows (minus 1) by repeating the last entry
     */
    public getRowAttributes(name: string, i: number = 1): string[] | null {
      const n = this.numRows - i;
      const rows = this.getAttributeArray(name);
      if (rows.length === 0) return null;
      while (rows.length < n) {
        rows.push(rows[rows.length - 1]);
      }
      if (rows.length > n) {
        rows.splice(n);
      }
      return rows;
    }

    /**
     * @param {string} name           The name of the attribute to get as an array
     * @return {string[]}             The array of values in the given attribute, split at spaces
     *                                 (after leading and trailing spaces are removed, and multiple
     *                                  spaces have been collapsed to one).
     */
    public getAttributeArray(name: string): string[] {
      const value = this.node.attributes.get(name) as string;
      if (!value) return [this.node.attributes.getDefault(name) as string];
      return split(value);
    }

    /**
     * Adds "em" to a list of dimensions, after dividing by n (defaults to 1).
     *
     * @param {string[]} list   The array of dimensions (in em's)
     * @param {nunber=} n       The number to divide each dimension by after converted
     * @return {string[]}       The array of values with "em" added
     */
    public addEm(list: number[], n: number = 1): string[] | null {
      if (!list) return null;
      return list.map(x => this.em(x / n));
    }

    /**
     * Converts an array of dimensions (with arbitrary units) to an array of numbers
     *   representing the dimensions in units of em's.
     *
     * @param {string[]} list   The array of dimensions to be turned into em's
     * @return {number[]}       The array of values converted to em's
     */
    public convertLengths(list: string[]): number[] | null {
      if (!list) return null;
      return list.map(x => this.length2em(x));
    }
  };

}
