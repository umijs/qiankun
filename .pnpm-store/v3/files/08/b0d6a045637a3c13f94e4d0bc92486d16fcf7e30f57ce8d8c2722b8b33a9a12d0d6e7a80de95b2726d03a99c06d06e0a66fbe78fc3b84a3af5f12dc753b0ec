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
 * @fileoverview Configuration file for the upgreek package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Configuration} from '../Configuration.js';
import {Symbol} from '../Symbol.js';
import {CharacterMap} from '../SymbolMap.js';
import {TexConstant} from '../TexConstants.js';
import TexParser from '../TexParser.js';


/**
 * Handle greek mathchar as mi in normal variant.
 * @param {TexParser} parser The current tex parser.
 * @param {Symbol} mchar The parsed symbol.
 */
function mathchar0miNormal(parser: TexParser, mchar: Symbol) {
  const def = mchar.attributes || {};
  def.mathvariant = TexConstant.Variant.NORMAL;
  const node = parser.create('token', 'mi', def, mchar.char);
  parser.Push(node);
}

/**
 * Upright Greek characters.
 */
new CharacterMap('upgreek', mathchar0miNormal, {
  upalpha:        '\u03B1',
  upbeta:         '\u03B2',
  upgamma:        '\u03B3',
  updelta:        '\u03B4',
  upepsilon:      '\u03F5',
  upzeta:         '\u03B6',
  upeta:          '\u03B7',
  uptheta:        '\u03B8',
  upiota:         '\u03B9',
  upkappa:        '\u03BA',
  uplambda:       '\u03BB',
  upmu:           '\u03BC',
  upnu:           '\u03BD',
  upxi:           '\u03BE',
  upomicron:      '\u03BF',
  uppi:           '\u03C0',
  uprho:          '\u03C1',
  upsigma:        '\u03C3',
  uptau:          '\u03C4',
  upupsilon:      '\u03C5',
  upphi:          '\u03D5',
  upchi:          '\u03C7',
  uppsi:          '\u03C8',
  upomega:        '\u03C9',
  upvarepsilon:   '\u03B5',
  upvartheta:     '\u03D1',
  upvarpi:        '\u03D6',
  upvarrho:       '\u03F1',
  upvarsigma:     '\u03C2',
  upvarphi:       '\u03C6',

  Upgamma:        '\u0393',
  Updelta:        '\u0394',
  Uptheta:        '\u0398',
  Uplambda:       '\u039B',
  Upxi:           '\u039E',
  Uppi:           '\u03A0',
  Upsigma:        '\u03A3',
  Upupsilon:      '\u03A5',
  Upphi:          '\u03A6',
  Uppsi:          '\u03A8',
  Upomega:        '\u03A9'
});


export const UpgreekConfiguration = Configuration.create(
  'upgreek', {
    handler: {macro: ['upgreek']},
  }
);

