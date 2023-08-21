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
 * @fileoverview Mappings for TeX parsing of the braket package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {CommandMap, MacroMap} from '../SymbolMap.js';
import BraketMethods from './BraketMethods.js';


/**
 * Macros for braket package.
 */
new CommandMap('Braket-macros', {
  bra: ['Macro', '{\\langle {#1} \\vert}', 1],
  ket: ['Macro', '{\\vert {#1} \\rangle}', 1],
  braket: ['Braket', '\u27E8', '\u27E9', false, Infinity],
  'set': ['Braket', '{', '}', false, 1],
  Bra: ['Macro', '{\\left\\langle {#1} \\right\\vert}', 1],
  Ket: ['Macro', '{\\left\\vert {#1} \\right\\rangle}', 1],
  Braket: ['Braket', '\u27E8', '\u27E9', true, Infinity],
  Set: ['Braket', '{', '}', true, 1],
  // Not part of the LaTeX package:
  ketbra: ['Macro', '{\\vert {#1} \\rangle\\langle {#2} \\vert}', 2],
  Ketbra: ['Macro', '{\\left\\vert {#1} \\right\\rangle\\left\\langle {#2} \\right\\vert}', 2],
  // Treatment of bar.
  '|': 'Bar'
}, BraketMethods);


/**
 * Character map for braket package.
 */
new MacroMap('Braket-characters', {
  '|': 'Bar'
}, BraketMethods);


