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
 * @fileoverview Configuration file for the centernot package.
 *
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */

import {Configuration} from '../Configuration.js';
import ParseOptions from '../ParseOptions.js';
import TexParser from '../TexParser.js';
import NodeUtil from '../NodeUtil.js';
import {CommandMap} from '../SymbolMap.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import BaseMethods from '../base/BaseMethods.js';

new CommandMap('centernot', {
  centerOver: 'CenterOver',
  centernot: ['Macro', '\\centerOver{#1}{{\u29F8}}', 1]
}, {
  /**
   * Implements \centerOver{base}{symbol}
   *
   * @param {TexParser} parser   The active tex parser.
   * @param {string} name        The name of the macro being processed.
   */
  CenterOver(parser: TexParser, name: string) {
    const arg = '{' + parser.GetArgument(name) + '}';
    const over = parser.ParseArg(name);
    const base = new TexParser(arg, parser.stack.env, parser.configuration).mml();
    let mml = parser.create('node', 'TeXAtom', [
      new TexParser(arg, parser.stack.env, parser.configuration).mml(),
      parser.create('node', 'mpadded', [
        parser.create('node', 'mpadded', [over], {width: 0, lspace: '-.5width'}),
        parser.create('node', 'mphantom', [base])
      ], {width: 0, lspace: '-.5width'})
    ]);
    parser.configuration.addNode('centerOver', base);
    parser.Push(mml);
  },
  Macro: BaseMethods.Macro
});

/**
 * Filter to copy texClass to the surrounding TeXAtom so that the negated
 *   item has the same class of the base.
 *
 * @param {ParseOptions} data   The active tex parser.
 */
export function filterCenterOver({data}: {data: ParseOptions}) {
  for (const base of data.getList('centerOver')) {
    const texClass = NodeUtil.getTexClass(base.childNodes[0].childNodes[0] as MmlNode);
    if (texClass !== null) {
      NodeUtil.setProperties(base.parent.parent.parent.parent.parent.parent, {texClass});
    }
  }
}


export const CenternotConfiguration = Configuration.create(
  'centernot', {
    handler: {macro: ['centernot']},
    postprocessors: [filterCenterOver]
  }
);
