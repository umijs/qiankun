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
 * @fileoverview  Implements the CHTMLmtable wrapper for the MmlMtable object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper, CHTMLConstructor} from '../Wrapper.js';
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {CommonMtableMixin} from '../../common/Wrappers/mtable.js';
import {CHTMLmtr} from './mtr.js';
import {CHTMLmtd} from './mtd.js';
import {MmlMtable} from '../../../core/MmlTree/MmlNodes/mtable.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {StyleList} from '../../../util/StyleList.js';
import {isPercent} from '../../../util/string.js';
import {OptionList} from '../../../util/Options.js';

/*****************************************************************/
/**
 * The CHTMLmtable wrapper for the MmlMtable object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLmtable<N, T, D> extends
CommonMtableMixin<CHTMLmtd<any, any, any>, CHTMLmtr<any, any, any>, CHTMLConstructor<any, any, any>>(CHTMLWrapper) {

  /**
   * The mtable wrapper
   */
  public static kind = MmlMtable.prototype.kind;

  /**
   * @override
   */
  public static styles: StyleList = {
    'mjx-mtable': {
      'vertical-align': '.25em',
      'text-align': 'center',
      'position': 'relative',
      'box-sizing': 'border-box',
      'border-spacing': 0,            // prevent this from being inherited from an outer table
      'border-collapse': 'collapse'   // similarly here
    },
    'mjx-mstyle[size="s"] mjx-mtable': {
      'vertical-align': '.354em'
    },
    'mjx-labels': {
      position: 'absolute',
      left: 0,
      top: 0
    },
    'mjx-table': {
      'display': 'inline-block',
      'vertical-align': '-.5ex',
      'box-sizing': 'border-box'
    },
    'mjx-table > mjx-itable': {
      'vertical-align': 'middle',
      'text-align': 'left',
      'box-sizing': 'border-box'
    },
    'mjx-labels > mjx-itable': {
      position: 'absolute',
      top: 0
    },
    'mjx-mtable[justify="left"]': {
      'text-align': 'left'
    },
    'mjx-mtable[justify="right"]': {
      'text-align': 'right'
    },
    'mjx-mtable[justify="left"][side="left"]': {
      'padding-right': '0 ! important'
    },
    'mjx-mtable[justify="left"][side="right"]': {
      'padding-left': '0 ! important'
    },
    'mjx-mtable[justify="right"][side="left"]': {
      'padding-right': '0 ! important'
    },
    'mjx-mtable[justify="right"][side="right"]': {
      'padding-left': '0 ! important'
    },
    'mjx-mtable[align]': {
      'vertical-align': 'baseline'
    },
    'mjx-mtable[align="top"] > mjx-table': {
      'vertical-align': 'top'
    },
    'mjx-mtable[align="bottom"] > mjx-table': {
      'vertical-align': 'bottom'
    },
    'mjx-mtable[side="right"] mjx-labels': {
      'min-width': '100%'
    }
  };

  /**
   * The column for labels
   */
  public labels: N;

  /**
   * The inner table DOM node
   */
  public itable: N;

  /******************************************************************/

  /**
   * @override
   */
  constructor(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent: CHTMLWrapper<N, T, D> = null) {
    super(factory, node, parent);
    this.itable = this.html('mjx-itable');
    this.labels = this.html('mjx-itable');
  }

  /**
   * @override
   */
  public getAlignShift() {
    const data = super.getAlignShift();
    if (!this.isTop) {
      data[1] = 0;
    }
    return data;
  }

  /**
   * @override
   */
  public toCHTML(parent: N) {
    //
    //  Create the rows inside an mjx-itable (which will be used to center the table on the math axis)
    //
    const chtml = this.standardCHTMLnode(parent);
    this.adaptor.append(chtml, this.html('mjx-table', {}, [this.itable]));
    for (const child of this.childNodes) {
      child.toCHTML(this.itable);
    }
    //
    //  Pad the rows of the table, if needed
    //  Then set the column and row attributes for alignment, spacing, and lines
    //  Finally, add the frame, if needed
    //
    this.padRows();
    this.handleColumnSpacing();
    this.handleColumnLines();
    this.handleColumnWidths();
    this.handleRowSpacing();
    this.handleRowLines();
    this.handleRowHeights();
    this.handleFrame();
    this.handleWidth();
    this.handleLabels();
    this.handleAlign();
    this.handleJustify();
    this.shiftColor();
  }

  /**
   * Move background color (if any) to inner itable node so that labeled tables are
   * only colored on the main part of the table.
   */
  protected shiftColor() {
    const adaptor = this.adaptor;
    const color = adaptor.getStyle(this.chtml, 'backgroundColor');
    if (color) {
      adaptor.setStyle(this.chtml, 'backgroundColor', '');
      adaptor.setStyle(this.itable, 'backgroundColor', color);
    }
  }

  /******************************************************************/

  /**
   * Pad any short rows with extra cells
   */
  protected padRows() {
    const adaptor = this.adaptor;
    for (const row of adaptor.childNodes(this.itable) as N[]) {
      while (adaptor.childNodes(row).length < this.numCols) {
        adaptor.append(row, this.html('mjx-mtd', {'extra': true}));
      }
    }
  }

  /**
   * Set the inter-column spacing for all columns
   *  (Use frame spacing on the outsides, if needed, and use half the column spacing on each
   *   neighboring column, so that if column lines are needed, they fall in the middle
   *   of the column space.)
   */
  protected handleColumnSpacing() {
    const scale = (this.childNodes[0] ? 1 / this.childNodes[0].getBBox().rscale : 1);
    const spacing = this.getEmHalfSpacing(this.fSpace[0], this.cSpace, scale);
    const frame = this.frame;
    //
    //  For each row...
    //
    for (const row of this.tableRows) {
      let i = 0;
      //
      //  For each cell in the row...
      //
      for (const cell of row.tableCells) {
        //
        //  Get the left and right-hand spacing
        //
        const lspace = spacing[i++];
        const rspace = spacing[i];
        //
        //  Set the style for the spacing, if it is needed, and isn't the
        //  default already set in the mtd styles
        //
        const styleNode = (cell ? cell.chtml : this.adaptor.childNodes(row.chtml)[i] as N);
        if ((i > 1 && lspace !== '0.4em') || (frame && i === 1)) {
          this.adaptor.setStyle(styleNode, 'paddingLeft', lspace);
        }
        if ((i < this.numCols && rspace !== '0.4em') || (frame && i === this.numCols)) {
          this.adaptor.setStyle(styleNode, 'paddingRight', rspace);
        }
      }
    }
  }

  /**
   * Add borders to the left of cells to make the column lines
   */
  protected handleColumnLines() {
    if (this.node.attributes.get('columnlines') === 'none') return;
    const lines = this.getColumnAttributes('columnlines');
    for (const row of this.childNodes) {
      let i = 0;
      for (const cell of this.adaptor.childNodes(row.chtml).slice(1) as N[]) {
        const line = lines[i++];
        if (line === 'none') continue;
        this.adaptor.setStyle(cell, 'borderLeft', '.07em ' + line);
      }
    }
  }

  /**
   * Add widths to the cells for the column widths
   */
  protected handleColumnWidths() {
    for (const row of this.childNodes) {
      let i = 0;
      for (const cell of this.adaptor.childNodes(row.chtml) as N[]) {
        const w = this.cWidths[i++];
        if (w !== null) {
          const width = (typeof w === 'number' ? this.em(w) : w);
          this.adaptor.setStyle(cell, 'width', width);
          this.adaptor.setStyle(cell, 'maxWidth', width);
          this.adaptor.setStyle(cell, 'minWidth', width);
        }
      }
    }
  }

  /**
   * Set the inter-row spacing for all rows
   *  (Use frame spacing on the outsides, if needed, and use half the row spacing on each
   *   neighboring row, so that if row lines are needed, they fall in the middle
   *   of the row space.)
   */
  protected handleRowSpacing() {
    const scale = (this.childNodes[0] ? 1 / this.childNodes[0].getBBox().rscale : 1);
    const spacing = this.getEmHalfSpacing(this.fSpace[1], this.rSpace, scale);
    const frame = this.frame;
    //
    //  For each row...
    //
    let i = 0;
    for (const row of this.childNodes) {
      //
      //  Get the top and bottom spacing
      //
      const tspace = spacing[i++];
      const bspace = spacing[i];
      //
      //  For each cell in the row...
      //
      for (const cell of row.childNodes) {
        //
        //  Set the style for the spacing, if it is needed, and isn't the
        //  default already set in the mtd styles
        //
        if ((i > 1 && tspace !== '0.215em') || (frame && i === 1)) {
          this.adaptor.setStyle(cell.chtml, 'paddingTop', tspace);
        }
        if ((i < this.numRows && bspace !== '0.215em') || (frame && i === this.numRows)) {
          this.adaptor.setStyle(cell.chtml, 'paddingBottom', bspace);
        }
      }
    }
  }

  /**
   * Add borders to the tops of cells to make the row lines
   */
  protected handleRowLines() {
    if (this.node.attributes.get('rowlines') === 'none') return;
    const lines = this.getRowAttributes('rowlines');
    let i = 0;
    for (const row of this.childNodes.slice(1)) {
      const line = lines[i++];
      if (line === 'none') continue;
      for (const cell of this.adaptor.childNodes(row.chtml) as N[]) {
        this.adaptor.setStyle(cell, 'borderTop', '.07em ' + line);
      }
    }
  }

  /**
   * Adjust row heights for equal-sized rows
   */
  protected handleRowHeights() {
    if (this.node.attributes.get('equalrows')) {
      this.handleEqualRows();
    }
  }

  /**
   * Set the heights of all rows to be the same, and properly center
   * baseline or axis rows within the newly sized
   */
  protected handleEqualRows() {
    const space = this.getRowHalfSpacing();
    const {H, D, NH, ND} = this.getTableData();
    const HD = this.getEqualRowHeight();
    //
    // Loop through the rows and set their heights
    //
    for (let i = 0; i < this.numRows; i++) {
      const row = this.childNodes[i];
      this.setRowHeight(row, HD + space[i] + space[i + 1] + this.rLines[i]);
      if (HD !== NH[i] + ND[i]) {
        this.setRowBaseline(row, HD, (HD - H[i] + D[i]) / 2);
      }
    }
  }

  /**
   * @param {CHTMLWrapper} row   The row whose height is to be set
   * @param {number} HD          The height to be set for the row
   */
  protected setRowHeight(row: CHTMLWrapper<N, T, D>, HD: number) {
      this.adaptor.setStyle(row.chtml, 'height', this.em(HD));
  }

  /**
   * Make sure the baseline is in the right position for cells
   *   that are row aligned to baseline ot axis
   *
   * @param {CHTMLWrapper} row   The row to be set
   * @param {number} HD          The total height+depth for the row
   * @param {number] D           The new depth for the row
   */
  protected setRowBaseline(row: CHTMLWrapper<N, T, D>, HD: number, D: number) {
    const ralign = row.node.attributes.get('rowalign') as string;
    //
    //  Loop through the cells and set the strut height and depth.
    //    The strut is the last element in the cell.
    //
    for (const cell of row.childNodes) {
      if (this.setCellBaseline(cell, ralign, HD, D)) break;
    }
  }

  /**
   * Make sure the baseline is in the correct place for cells aligned on baseline or axis
   *
   * @param {CHTMLWrapper} cell  The cell to modify
   * @param {string} ralign      The alignment of the row
   * @param {number} HD          The total height+depth for the row
   * @param {number] D           The new depth for the row
   * @return {boolean}           True if no other cells in this row need to be processed
   */
  protected setCellBaseline(cell: CHTMLWrapper<N, T, D>, ralign: string, HD: number, D: number): boolean {
    const calign = cell.node.attributes.get('rowalign');
    if (calign === 'baseline' || calign === 'axis') {
      const adaptor = this.adaptor;
      const child = adaptor.lastChild(cell.chtml) as N;
      adaptor.setStyle(child, 'height', this.em(HD));
      adaptor.setStyle(child, 'verticalAlign', this.em(-D));
      const row = cell.parent;
      if ((!row.node.isKind('mlabeledtr') || cell !== row.childNodes[0]) &&
          (ralign === 'baseline' || ralign === 'axis')) {
        return true;
      }
    }
    return false;
  }

  /**
   * Add a frame to the mtable, if needed
   */
  protected handleFrame() {
    if (this.frame && this.fLine) {
      this.adaptor.setStyle(this.itable, 'border', '.07em ' + this.node.attributes.get('frame'));
    }
  }

  /**
   * Handle percentage widths and fixed widths
   */
  protected handleWidth() {
    const adaptor = this.adaptor;
    const {w, L, R} = this.getBBox();
    adaptor.setStyle(this.chtml, 'minWidth', this.em(L + w + R));
    let W = this.node.attributes.get('width') as string;
    if (isPercent(W)) {
      adaptor.setStyle(this.chtml, 'width', '');
      adaptor.setAttribute(this.chtml, 'width', 'full');
    } else if (!this.hasLabels) {
      if (W === 'auto') return;
      W = this.em(this.length2em(W) + 2 * this.fLine);
    }
    const table = adaptor.firstChild(this.chtml) as N;
    adaptor.setStyle(table, 'width', W);
    adaptor.setStyle(table, 'minWidth', this.em(w));
    if (L || R) {
      adaptor.setStyle(this.chtml, 'margin', '');
      const style = (this.node.attributes.get('data-width-includes-label') ? 'padding' : 'margin');
      if (L === R) {
        adaptor.setStyle(table, style, '0 ' + this.em(R));
      } else {
        adaptor.setStyle(table, style, '0 ' + this.em(R) + ' 0 ' + this.em(L));
      }
    }
    adaptor.setAttribute(this.itable, 'width', 'full');
  }

  /**
   * Handle alignment of table to surrounding baseline
   */
  protected handleAlign() {
    const [align, row] = this.getAlignmentRow();
    if (row === null) {
      if (align !== 'axis') {
        this.adaptor.setAttribute(this.chtml, 'align', align);
      }
    } else {
      const y = this.getVerticalPosition(row, align);
      this.adaptor.setAttribute(this.chtml, 'align', 'top');
      this.adaptor.setStyle(this.chtml, 'verticalAlign', this.em(y));
    }
  }

  /**
   * Mark the alignment of the table
   */
  protected handleJustify() {
    const align = this.getAlignShift()[0];
    if (align !== 'center') {
      this.adaptor.setAttribute(this.chtml, 'justify', align);
    }
  }

  /******************************************************************/

  /**
   * Handle addition of labels to the table
   */
  protected handleLabels() {
    if (!this.hasLabels) return;
    const labels = this.labels;
    const attributes = this.node.attributes;
    const adaptor = this.adaptor;
    //
    //  Set the side for the labels
    //
    const side = attributes.get('side') as string;
    adaptor.setAttribute(this.chtml, 'side', side);
    adaptor.setAttribute(labels, 'align', side);
    adaptor.setStyle(labels, side, '0');
    //
    //  Make sure labels don't overlap table
    //
    const [align, shift] = this.addLabelPadding(side);
    //
    //  Handle indentation
    //
    if (shift) {
      const table = adaptor.firstChild(this.chtml) as N;
      this.setIndent(table, align, shift);
    }
    //
    // Add the labels to the table
    //
    this.updateRowHeights();
    this.addLabelSpacing();
  }

  /**
   * @param {string} side         The side for the labels
   * @return {[string, number]}   The alignment and shift values
   */
  protected addLabelPadding(side: string): [string, number] {
    const [ , align, shift] = this.getPadAlignShift(side);
    const styles: OptionList = {};
    if (side === 'right' && !this.node.attributes.get('data-width-includes-label')) {
      const W = this.node.attributes.get('width') as string;
      const {w, L, R} = this.getBBox();
      styles.style = {
        width: (isPercent(W) ? 'calc(' + W + ' + ' + this.em(L + R) + ')' : this.em(L + w + R))
      };
    }
    this.adaptor.append(this.chtml, this.html('mjx-labels', styles, [this.labels]));
    return [align, shift] as [string, number];
  }

  /**
   * Update any rows that are not naturally tall enough for the labels,
   *   and set the baseline for labels that are baseline aligned.
   */
  protected updateRowHeights() {
    let {H, D, NH, ND} = this.getTableData();
    const space = this.getRowHalfSpacing();
    for (let i = 0; i < this.numRows; i++) {
      const row = this.childNodes[i];
      this.setRowHeight(row, H[i] + D[i] + space[i] + space[i + 1] + this.rLines[i]);
      if (H[i] !== NH[i] || D[i] !== ND[i]) {
        this.setRowBaseline(row, H[i] + D[i], D[i]);
      } else if (row.node.isKind('mlabeledtr')) {
        this.setCellBaseline(row.childNodes[0], '', H[i] + D[i], D[i]);
      }
    }
  }

  /**
   * Add spacing elements between the label rows to align them with the rest of the table
   */
  protected addLabelSpacing() {
    const adaptor = this.adaptor;
    const equal = this.node.attributes.get('equalrows') as boolean;
    const {H, D} = this.getTableData();
    const HD = (equal ? this.getEqualRowHeight() : 0);
    const space = this.getRowHalfSpacing();
    //
    //  Start with frame size and add in spacing, height and depth,
    //    and line thickness for each non-labeled row.
    //
    let h = this.fLine;
    let current = adaptor.firstChild(this.labels) as N;
    for (let i = 0; i < this.numRows; i++) {
      const row = this.childNodes[i];
      if (row.node.isKind('mlabeledtr')) {
        h && adaptor.insert(this.html('mjx-mtr', {style: {height: this.em(h)}}), current);
        adaptor.setStyle(current, 'height', this.em((equal ? HD : H[i] + D[i]) + space[i] + space[i + 1]));
        current = adaptor.next(current) as N;
        h = this.rLines[i];
      } else {
        h += space[i] + (equal ? HD : H[i] + D[i]) + space[i + 1] + this.rLines[i];
      }
    }
  }

}
