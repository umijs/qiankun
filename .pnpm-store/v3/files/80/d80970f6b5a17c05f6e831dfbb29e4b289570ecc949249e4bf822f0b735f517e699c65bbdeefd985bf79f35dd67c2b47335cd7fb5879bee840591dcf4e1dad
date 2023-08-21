/*************************************************************
 *
 *  Copyright (c) 2009-2022 The MathJax Consortium
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
 * @fileoverview StackItems needed for parsing AMS math commands.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */


import {ArrayItem, EqnArrayItem} from '../base/BaseItems.js';
import ParseUtil from '../ParseUtil.js';
import NodeUtil from '../NodeUtil.js';
import TexError from '../TexError.js';
import {TexConstant} from '../TexConstants.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';


/**
 * Item dealing with multiline environments as a special case of arrays. Note,
 * that all other AMS equation environments (e.g., align, split) can be handled
 * by the regular EqnArrayItem class.
 *
 * Handles tagging information according to the given tagging style.
 */
export class MultlineItem extends ArrayItem {

  /**
   * @override
   */
  constructor(factory: any, ...args: any[]) {
    super(factory);
    this.factory.configuration.tags.start('multline', true, args[0]);
  }


  /**
   * @override
   */
  get kind() {
    return 'multline';
  }


  /**
   * @override
   */
  public EndEntry() {
    if (this.table.length) {
      ParseUtil.fixInitialMO(this.factory.configuration, this.nodes);
    }
    const shove = this.getProperty('shove');
    const mtd = this.create('node',
                            'mtd', this.nodes, shove ? {columnalign: shove} : {});
    this.setProperty('shove', null);
    this.row.push(mtd);
    this.Clear();
  }

  /**
   * @override
   */
  public EndRow() {
    if (this.row.length !== 1) {
      // @test MultlineRowsOneCol
      throw new TexError(
        'MultlineRowsOneCol',
        'The rows within the %1 environment must have exactly one column',
        'multline');
    }
    let row = this.create('node', 'mtr', this.row);
    this.table.push(row);
    this.row = [];
  }

  /**
   * @override
   */
  public EndTable() {
    super.EndTable();
    if (this.table.length) {
      let m = this.table.length - 1, label = -1;
      if (!NodeUtil.getAttribute(
        NodeUtil.getChildren(this.table[0])[0], 'columnalign')) {
        NodeUtil.setAttribute(NodeUtil.getChildren(this.table[0])[0],
                              'columnalign', TexConstant.Align.LEFT);
      }
      if (!NodeUtil.getAttribute(
        NodeUtil.getChildren(this.table[m])[0], 'columnalign')) {
        NodeUtil.setAttribute(NodeUtil.getChildren(this.table[m])[0],
                              'columnalign', TexConstant.Align.RIGHT);
      }
      let tag = this.factory.configuration.tags.getTag();
      if (tag) {
        label = (this.arraydef.side === TexConstant.Align.LEFT ? 0 : this.table.length - 1);
        const mtr = this.table[label];
        const mlabel = this.create('node', 'mlabeledtr',
                                   [tag].concat(NodeUtil.getChildren(mtr)));
        NodeUtil.copyAttributes(mtr, mlabel);
        this.table[label] = mlabel;
      }
    }
    this.factory.configuration.tags.end();
  }
}

/**
 * StackItem for handling flalign, xalignat, and xxalignat environments.
 */
export class FlalignItem extends EqnArrayItem {

  /**
   * @override
   */
  get kind() {
    return 'flalign';
  }


  /**
   * @override
   */
  constructor(factory: any, public name: string, public numbered: boolean,
              public padded: boolean, public center: boolean) {
    super(factory);
    this.factory.configuration.tags.start(name, numbered, numbered);
  }

  /**
   * @override
   */
  public EndEntry() {
    super.EndEntry();
    const n = this.getProperty('xalignat') as number;
    if (!n) return;
    if (this.row.length > n) {
      throw new TexError('XalignOverflow', 'Extra %1 in row of %2', '&', this.name);
    }
  }


  /**
   * @override
   */
  public EndRow() {
    let cell: MmlNode;
    let row = this.row;
    //
    //  For xalignat and xxalignat, pad the row to the expected number if it is too short.
    //
    const n = this.getProperty('xalignat') as number;
    while (row.length < n) {
      row.push(this.create('node', 'mtd'));
    }
    //
    //  Insert padding cells between pairs of entries, as needed for "fit" columns,
    //    and include initial and end cells if that is needed.
    //
    this.row = [];
    if (this.padded) {
      this.row.push(this.create('node', 'mtd'));
    }
    while ((cell = row.shift())) {
      this.row.push(cell);
      cell = row.shift();
      if (cell) this.row.push(cell);
      if (row.length || this.padded) {
        this.row.push(this.create('node', 'mtd'));
      }
    }
    //
    if (this.row.length > this.maxrow) {
      this.maxrow = this.row.length;
    }
    super.EndRow();
    //
    // For full-width environments with labels that aren't supposed to take up space,
    //   move the label into a zero-width mpadded element that laps in the proper direction.
    //
    const mtr = this.table[this.table.length - 1];
    if (this.getProperty('zeroWidthLabel') && mtr.isKind('mlabeledtr')) {
      const mtd = NodeUtil.getChildren(mtr)[0];
      const side = this.factory.configuration.options['tagSide'];
      const def = {width: 0, ...(side === 'right' ? {lspace: '-1width'} : {})};
      const mpadded = this.create('node', 'mpadded', NodeUtil.getChildren(mtd), def);
      mtd.setChildren([mpadded]);
    }
  }


  /**
   * @override
   */
  public EndTable() {
    super.EndTable();
    if (this.center) {
      //
      //  If there is only one equation (one pair):
      //    Don't make it 100%, and don't change the indentalign.
      //
      if (this.maxrow <= 2) {
        const def = this.arraydef;
        delete def.width;
        delete this.global.indentalign;
      }
    }
  }

}
