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
 * @fileoverview Configuration for the Base LaTeX parser.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Configuration} from '../Configuration.js';
import {MapHandler} from '../MapHandler.js';
import TexError from '../TexError.js';
import NodeUtil from '../NodeUtil.js';
import TexParser from '../TexParser.js';
import {CharacterMap} from '../SymbolMap.js';
import * as bitem from './BaseItems.js';
import {AbstractTags} from '../Tags.js';
import './BaseMappings.js';
import {getRange} from '../../../core/MmlTree/OperatorDictionary.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import ParseOptions from '../ParseOptions.js';

/**
 * Remapping some ASCII characters to their Unicode operator equivalent.
 */
new CharacterMap('remap', null, {
  '-':   '\u2212',
  '*':   '\u2217',
  '`':   '\u2018'   // map ` to back quote
});


/**
 * Default handling of characters (as <mo> elements).
 * @param {TexParser} parser The calling parser.
 * @param {string} char The character to parse.
 */
export function Other(parser: TexParser, char: string) {
  const font = parser.stack.env['font'];
  let def = font ?
    // @test Other Font
    {mathvariant: parser.stack.env['font']} : {};
  const remap = (MapHandler.getMap('remap') as CharacterMap).lookup(char);
  const range = getRange(char);
  const type = (range ? range[3] : 'mo');
  // @test Other
  // @test Other Remap
  let mo = parser.create('token', type, def, (remap ? remap.char : char));
  range[4] && mo.attributes.set('mathvariant', range[4]);
  if (type === 'mo') {
    NodeUtil.setProperty(mo, 'fixStretchy', true);
    parser.configuration.addNode('fixStretchy', mo);
  }
  parser.Push(mo);
}


/**
 * Handle undefined control sequence.
 * @param {TexParser} parser The calling parser.
 * @param {string} name The name of the control sequence.
 */
function csUndefined(_parser: TexParser, name: string) {
  // @test Undefined-CS
  throw new TexError('UndefinedControlSequence',
                      'Undefined control sequence %1', '\\' + name);
}


/**
 * Handle undefined environments.
 * @param {TexParser} parser The calling parser.
 * @param {string} name The name of the control sequence.
 */
function envUndefined(_parser: TexParser, env: string) {
  // @test Undefined-Env
  throw new TexError('UnknownEnv', 'Unknown environment \'%1\'', env);
}

/**
 * Filter for removing spacing following \nonscript
 * @param{ParseOptions} data The active tex parser.
 */
function filterNonscript({data}: {data: ParseOptions}) {
  for (const mml of data.getList('nonscript')) {
    //
    //  This is the list of mspace elements or mrow > mstyle > mspace
    //    that followed \nonscript macros to be tested for removal.
    //
    if (mml.attributes.get('scriptlevel') > 0) {
      //
      //  The mspace needs to be removed, since we are in a script style.
      //  Remove it from the DOM and from the list of mspace elements.
      //
      const parent = mml.parent;
      parent.childNodes.splice(parent.childIndex(mml), 1);
      data.removeFromList(mml.kind, [mml]);
      //
      //  If it is an mrow > mstyle > mspace, then we have just
      //    removed the mrow from its list, and must remove
      //    the mstyle and mspace from their lists as well.
      //
      if (mml.isKind('mrow')) {
        const mstyle = mml.childNodes[0] as MmlNode;
        data.removeFromList('mstyle', [mstyle]);
        data.removeFromList('mspace', mstyle.childNodes[0].childNodes as MmlNode[]);
      }
    } else if (mml.isKind('mrow')) {
      //
      // This is an mrow > mstyle > mspace  but we're not in a script
      //   style, so remove the mrow that we had added in the NonscriptItem.
      //
      mml.parent.replaceChild(mml.childNodes[0], mml);
      data.removeFromList('mrow', [mml]);
    }
  }
}


/**
 * @constructor
 * @extends {AbstractTags}
 */
export class BaseTags extends AbstractTags { }


/**
 * The base configuration.
 * @type {Configuration}
 */
export const BaseConfiguration: Configuration = Configuration.create(
  'base',  {
    handler: {
      character: ['command', 'special', 'letter', 'digit'],
      delimiter: ['delimiter'],
      // Note, that the position of the delimiters here is important!
      macro: ['delimiter', 'macros', 'mathchar0mi', 'mathchar0mo', 'mathchar7'],
      environment: ['environment']
    },
    fallback: {
      character: Other,
      macro: csUndefined,
      environment: envUndefined
    },
    items: {
      // BaseItems
      [bitem.StartItem.prototype.kind]: bitem.StartItem,
      [bitem.StopItem.prototype.kind]: bitem.StopItem,
      [bitem.OpenItem.prototype.kind]: bitem.OpenItem,
      [bitem.CloseItem.prototype.kind]: bitem.CloseItem,
      [bitem.PrimeItem.prototype.kind]: bitem.PrimeItem,
      [bitem.SubsupItem.prototype.kind]: bitem.SubsupItem,
      [bitem.OverItem.prototype.kind]: bitem.OverItem,
      [bitem.LeftItem.prototype.kind]: bitem.LeftItem,
      [bitem.Middle.prototype.kind]: bitem.Middle,
      [bitem.RightItem.prototype.kind]: bitem.RightItem,
      [bitem.BeginItem.prototype.kind]: bitem.BeginItem,
      [bitem.EndItem.prototype.kind]: bitem.EndItem,
      [bitem.StyleItem.prototype.kind]: bitem.StyleItem,
      [bitem.PositionItem.prototype.kind]: bitem.PositionItem,
      [bitem.CellItem.prototype.kind]: bitem.CellItem,
      [bitem.MmlItem.prototype.kind]: bitem.MmlItem,
      [bitem.FnItem.prototype.kind]: bitem.FnItem,
      [bitem.NotItem.prototype.kind]: bitem.NotItem,
      [bitem.NonscriptItem.prototype.kind]: bitem.NonscriptItem,
      [bitem.DotsItem.prototype.kind]: bitem.DotsItem,
      [bitem.ArrayItem.prototype.kind]: bitem.ArrayItem,
      [bitem.EqnArrayItem.prototype.kind]: bitem.EqnArrayItem,
      [bitem.EquationItem.prototype.kind]: bitem.EquationItem
    },
    options: {
      maxMacros: 1000,
      baseURL: (typeof(document) === 'undefined' ||
                document.getElementsByTagName('base').length === 0) ?
                '' : String(document.location).replace(/#.*$/, '')
    },
    tags: {
      base: BaseTags
    },
    postprocessors: [[filterNonscript, -4]]
  }
);
