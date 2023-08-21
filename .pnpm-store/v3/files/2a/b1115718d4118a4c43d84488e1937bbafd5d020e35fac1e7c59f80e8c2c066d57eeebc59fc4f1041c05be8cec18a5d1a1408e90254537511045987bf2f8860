/*************************************************************
 *
 *  Copyright (c) 2021-2022 The MathJax Consortium
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
 * @fileoverview Utilities file for the empheq package.
 *
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */


import ParseUtil from '../ParseUtil.js';
import TexParser from '../TexParser.js';
import {EnvList} from '../StackItem.js';
import {AbstractTags} from '../Tags.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {MmlMtable} from '../../../core/MmlTree/MmlNodes/mtable.js';
import {MmlMtd} from '../../../core/MmlTree/MmlNodes/mtd.js';
import {EmpheqBeginItem} from './EmpheqConfiguration.js';

export const EmpheqUtil = {

  /**
   * Create the needed envinronment and process it by the give function.
   *
   * @param {TexParser} parser   The active tex parser.
   * @param {string} env         The environment to create.
   * @param {Function} func      A function to process the environment.
   * @param {any[]} args         The arguments for func.
   */
  environment(parser: TexParser, env: string, func: Function, args: any[]) {
    const name = args[0];
    const item = parser.itemFactory.create(name + '-begin').setProperties({name: env, end: name});
    parser.Push(func(parser, item, ...args.slice(1)));
  },

  /**
   * Parse an options string.
   *
   * @param {string} text                   The string to parse.
   * @param {{[key:string]:number} allowed  Object containing options to allow
   * @return {EnvList}                      The parsed keys
   */
  splitOptions(text: string, allowed: {[key: string]: number} = null): EnvList {
    return ParseUtil.keyvalOptions(text, allowed, true);
  },

  /**
   * Find the number of columns in the table.
   *
   * @param {MmlMtable} table   The table whose columns to count.
   * @return {number}           The number of columns in the table.
   */
  columnCount(table: MmlMtable): number {
    let m = 0;
    for (const row of table.childNodes) {
      const n = row.childNodes.length - (row.isKind('mlabeledtr') ? 1 : 0);
      if (n > m) m = n;
    }
    return m;
  },

  /**
   * Create an mpadded element with no height and depth, but whose
   *   content is the given TeX code with a phantom that is the height and
   *   depth of the given table.
   *
   * @param {string} tex        The TeX code to put in the box.
   * @param {MmlTable} table    The table used to size the box.
   * @param {TexParser} parser  The active tex parser.
   * @param {string} env        The name of the current environment.
   * @return {MmlNode}          The mpadded element.
   */
  cellBlock(tex: string, table: MmlMtable, parser: TexParser, env: string): MmlNode {
    const mpadded = parser.create('node', 'mpadded', [], {height: 0, depth: 0, voffset: '-1height'});
    const result = new TexParser(tex, parser.stack.env, parser.configuration);
    const mml = result.mml();
    if (env && result.configuration.tags.label) {
      (result.configuration.tags.currentTag as any).env = env;
      (result.configuration.tags as AbstractTags).getTag(true);
    }
    for (const child of (mml.isInferred ? mml.childNodes : [mml])) {
      mpadded.appendChild(child);
    }
    mpadded.appendChild(parser.create('node', 'mphantom', [
      parser.create('node', 'mpadded', [table], {width: 0})
    ]));
    return mpadded;
  },

  /**
   * Make a copy of the table with only the first row and create a phantom element
   *   that has its height and depth.
   *
   * @param {MmlMtable} original   The original table.
   * @param {TexParser} parser     The active tex parser.
   * @return {MmlNode}             The resulting mphantom element.
   */
  topRowTable(original: MmlMtable, parser: TexParser): MmlNode {
    const table = ParseUtil.copyNode(original, parser);
    table.setChildren(table.childNodes.slice(0, 1));
    table.attributes.set('align', 'baseline 1');
    return original.factory.create('mphantom', {}, [parser.create('node', 'mpadded', [table],  {width: 0})]);
  },

  /**
   * Add an mpadded element that has zero height and depth but whose content is
   *   the cell block for the given TeX code followed by a struct the size of the top row.
   *
   * @param {MmlMtd} mtd         The mtd to add content to.
   * @param {string} tex         The TeX string to put into the cell.
   * @param {MmlMtable} table    The reference table used for its various heights.
   * @param {TexParser} parser   The active tex parser.
   * @param {srting} env         The current environment.
   */
  rowspanCell(mtd: MmlMtd, tex: string, table: MmlMtable, parser: TexParser, env: string) {
    mtd.appendChild(
      parser.create('node', 'mpadded', [
        this.cellBlock(tex, ParseUtil.copyNode(table, parser), parser, env),
        this.topRowTable(table, parser)
      ], {height: 0, depth: 0, voffset: 'height'})
    );
  },

  /**
   * Add something on the left of the original table.
   *
   * @param {MmlMtable} table     The table to modify.
   * @param {MmlMtable} original  The original table.
   * @param {string} left         The TeX code to add to the left.
   * @param {TexParser} parser    The active tex parser.
   * @param {string} env          The current environment.
   */
  left(table: MmlMtable, original: MmlMtable, left: string, parser: TexParser, env: string = '') {
    table.attributes.set('columnalign', 'right ' + (table.attributes.get('columnalign') || ''));
    table.attributes.set('columnspacing', '0em ' + (table.attributes.get('columnspacing') || ''));
    let mtd;
    for (const row of table.childNodes.slice(0).reverse()) {
      mtd = parser.create('node', 'mtd');
      row.childNodes.unshift(mtd);
      mtd.parent = row;
      if (row.isKind('mlabeledtr')) {
        row.childNodes[0] = row.childNodes[1];
        row.childNodes[1] = mtd;
      }
    }
    this.rowspanCell(mtd, left, original, parser, env);
  },

  /**
   * Add something on the right of the original table.
   *
   * @param {MmlMtable} table     The table to modify.
   * @param {MmlMtable} original  The original table.
   * @param {string} right        The TeX code to add to the right.
   * @param {TexParser} parser    The active tex parser.
   * @param {string} env          The current environment.
   */
  right(table: MmlMtable, original: MmlMtable, right: string, parser: TexParser, env: string = '') {
    if (table.childNodes.length === 0) {
      table.appendChild(parser.create('node', 'mtr'));
    }
    const m = EmpheqUtil.columnCount(table);
    const row = table.childNodes[0];
    while (row.childNodes.length < m) row.appendChild(parser.create('node', 'mtd'));
    const mtd = row.appendChild(parser.create('node', 'mtd')) as MmlMtd;
    EmpheqUtil.rowspanCell(mtd, right, original, parser, env);
    table.attributes.set(
      'columnalign',
      (table.attributes.get('columnalign') as string || '').split(/ /).slice(0, m).join(' ') + ' left'
    );
    table.attributes.set(
      'columnspacing',
      (table.attributes.get('columnspacing') as string || '').split(/ /).slice(0, m - 1).join(' ') + ' 0em'
    );
  },

  /**
   * Add the left- and right-hand material to the table.
   */
  adjustTable(empheq: EmpheqBeginItem, parser: TexParser) {
    const left = empheq.getProperty('left');
    const right = empheq.getProperty('right');
    if (left || right) {
      const table = empheq.Last;
      const original = ParseUtil.copyNode(table, parser);
      if (left) this.left(table, original, left, parser);
      if (right) this.right(table, original, right, parser);
    }
  },

  /**
   * The environments allowed to be used in the empheq environment.
   */
  allowEnv: {
    equation: true,
    align: true,
    gather: true,
    flalign: true,
    alignat: true,
    multline: true
  },

  /**
   * Checks to see if the given environment is one of the allowed ones.
   *
   * @param {string} env   The environment to check.
   * @return {boolean}     True if the environment is allowed.
   */
  checkEnv(env: string): boolean {
    return this.allowEnv.hasOwnProperty(env.replace(/\*$/, '')) || false;
  }

};
