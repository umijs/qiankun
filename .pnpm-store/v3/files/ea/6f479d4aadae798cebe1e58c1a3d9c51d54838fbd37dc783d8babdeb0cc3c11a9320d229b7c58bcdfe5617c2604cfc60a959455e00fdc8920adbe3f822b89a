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
 * @fileoverview Configuration file for the extpfeil package. Note that this is
 *     based on AMS package and Newcommand utilities.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Configuration, ParserConfiguration} from '../Configuration.js';
import TexParser from '../TexParser.js';
import {CommandMap} from '../SymbolMap.js';
import {ParseMethod} from '../Types.js';
import {AmsMethods} from '../ams/AmsMethods.js';
import NewcommandUtil from '../newcommand/NewcommandUtil.js';
import {NewcommandConfiguration} from '../newcommand/NewcommandConfiguration.js';
import TexError from '../TexError.js';


// Namespace
export let ExtpfeilMethods: Record<string, ParseMethod> = {};

ExtpfeilMethods.xArrow = AmsMethods.xArrow;

/**
 * Implements \Newextarrow to define a new arrow.
 * @param {TexParser} parser The current tex parser.
 * @param {string} name The name of the calling macro.
 */
ExtpfeilMethods.NewExtArrow = function(parser: TexParser, name: string) {
  let cs = parser.GetArgument(name);
  const space = parser.GetArgument(name);
  const chr = parser.GetArgument(name);
  if (!cs.match(/^\\([a-z]+|.)$/i)) {
    throw new TexError('NewextarrowArg1',
               'First argument to %1 must be a control sequence name', name);
  }
  if (!space.match(/^(\d+),(\d+)$/)) {
    throw new TexError(
      'NewextarrowArg2',
      'Second argument to %1 must be two integers separated by a comma',
      name);
  }
  if (!chr.match(/^(\d+|0x[0-9A-F]+)$/i)) {
    throw new TexError(
      'NewextarrowArg3',
      'Third argument to %1 must be a unicode character number',
      name);
  }
  cs = cs.substr(1);
  let spaces = space.split(',');
  NewcommandUtil.addMacro(parser, cs, ExtpfeilMethods.xArrow,
                          [parseInt(chr), parseInt(spaces[0]), parseInt(spaces[1])]);
};


new CommandMap('extpfeil', {
  xtwoheadrightarrow: ['xArrow', 0x21A0, 12, 16],
  xtwoheadleftarrow:  ['xArrow', 0x219E, 17, 13],
  xmapsto:            ['xArrow', 0x21A6, 6, 7],
  xlongequal:         ['xArrow', 0x003D, 7, 7],
  xtofrom:            ['xArrow', 0x21C4, 12, 12],
  Newextarrow:        'NewExtArrow'
}, ExtpfeilMethods);


let init = function(config: ParserConfiguration) {
  NewcommandConfiguration.init(config);
};

export const ExtpfeilConfiguration = Configuration.create(
  'extpfeil', {
    handler: {macro: ['extpfeil']},
    init: init
  }
);
