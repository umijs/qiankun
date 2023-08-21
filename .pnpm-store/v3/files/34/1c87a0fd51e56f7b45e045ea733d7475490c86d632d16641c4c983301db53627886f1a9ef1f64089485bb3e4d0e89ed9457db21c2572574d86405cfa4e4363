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
 * @fileoverview    Configuration file for the colortbl package.
 *
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */

import {ArrayItem} from '../base/BaseItems.js';
import {Configuration, ParserConfiguration, ConfigurationHandler} from '../Configuration.js';
import {CommandMap} from '../SymbolMap.js';
import TexParser from '../TexParser.js';
import TexError from '../TexError.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';

import {TeX} from '../../tex.js';

/**
 * Information about table colors.
 */
export interface ColorData {
  cell: string;
  row: string;
  col: string[];
}

//
//  Sublcass the ArrayItem to handle colored entries
//
export class ColorArrayItem extends ArrayItem {
  /**
   *  Store current color for cell, row, and columns.
   */
  public color: ColorData = {
    cell: '',
    row: '',
    col: []
  };

  /**
   * True if any cell is colored (we will make sure the edge cells are full sized).
   */
  public hasColor: boolean = false;

  /**
   * @override
   */
  public EndEntry() {
    super.EndEntry();
    const cell = this.row[this.row.length - 1];
    const color = this.color.cell || this.color.row || this.color.col[this.row.length - 1];
    if (color) {
      cell.attributes.set('mathbackground', color);
      this.color.cell = '';
      this.hasColor = true;
    }
  }

  /**
   * @override
   */
  public EndRow() {
    super.EndRow();
    this.color.row = '';
  }

  /**
   * @override
   */
  public createMml() {
    //
    // If there is any color in the array, give it an empty frame,
    //   if there isn't one already.  This will make sure the color
    //   in edge cells extends past their contents.
    //
    const mml = super.createMml();
    let table = (mml.isKind('mrow') ? mml.childNodes[1] : mml) as MmlNode;
    if (table.isKind('menclose')) {
      table = table.childNodes[0].childNodes[0] as MmlNode;
    }
    if (this.hasColor && table.attributes.get('frame') === 'none') {
      table.attributes.set('frame', '');
    }
    return mml;
  }

}

//
//  Define macros for table coloring.
//
new CommandMap('colortbl', {
  cellcolor: ['TableColor', 'cell'],
  rowcolor:  ['TableColor', 'row'],
  columncolor: ['TableColor', 'col']
}, {
  /**
   * Add color to a column, row, or cell.
   *
   * @param {TexParser} parser       The active TeX parser
   * @param {string} name            The name of the macro that is being processed
   * @param {keyof ColorData} type   The type (col, row, cell) of color being added
   */
  TableColor(parser: TexParser, name: string, type: keyof ColorData) {
    const lookup = parser.configuration.packageData.get('color').model;  // use the color extension's color model
    const model = parser.GetBrackets(name, '');
    const color = lookup.getColor(model, parser.GetArgument(name));
    //
    // Check that we are in a colorable array.
    //
    const top = parser.stack.Top() as ColorArrayItem;
    if (!(top instanceof ColorArrayItem)) {
      throw new TexError('UnsupportedTableColor', 'Unsupported use of %1', parser.currentCS);
    }
    //
    //  Check the position of the macro and save the color.
    //
    if (type === 'col') {
      if (top.table.length) {
        throw new TexError('ColumnColorNotTop', '%1 must be in the top row', name);
      }
      top.color.col[top.row.length] = color;
      //
      // Ignore the left and right overlap options.
      //
      if (parser.GetBrackets(name, '')) {
        parser.GetBrackets(name, '');
      }
    } else {
      top.color[type] = color;
      if (type === 'row' && (top.Size() || top.row.length)) {
        throw new TexError('RowColorNotFirst', '%1 must be at the beginning of a row', name);
      }
    }
  }
});

/**
 * The configuration function for colortbl.
 *
 * @param {ParserConfiguration} config   The configuration being used.
 * @param {Tex} jax                      The TeX jax using this configuration.
 */
const config = function (config: ParserConfiguration, jax: TeX<any, any, any>) {
  //
  //  Make sure color is configured.  (It doesn't have to be included in tex.packages.)
  //
  if (!jax.parseOptions.packageData.has('color')) {
    ConfigurationHandler.get('color').config(config, jax);
  }
};

//
//  Create the color-table configuration.
//
export const ColortblConfiguration = Configuration.create('colortbl', {
  handler: {macro: ['colortbl']},
  items: {'array': ColorArrayItem},  // overrides original array class
  priority: 10,                      // make sure we are processed after the base package (to override its array)
  config: [config, 10]               // make sure we configure after the color package, if it is used.
});
