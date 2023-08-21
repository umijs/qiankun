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
 * @fileoverview Configuration file for the enclose package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Configuration} from '../Configuration.js';
import TexParser from '../TexParser.js';
import {CommandMap} from '../SymbolMap.js';
import {ParseMethod} from '../Types.js';
import ParseUtil from '../ParseUtil.js';


/**
 * The attributes allowed in \enclose{notation}[attributes]{math}
 * @type {{[key: string]: number}}
 */
export const ENCLOSE_OPTIONS: {[key: string]: number} = {
  'data-arrowhead': 1,
  color: 1,
  mathcolor: 1,
  background: 1,
  mathbackground: 1,
  'data-padding': 1,
  'data-thickness': 1
};


// Namespace
export let EncloseMethods: Record<string, ParseMethod> = {};


/**
 * Implements \enclose{notation}[attr]{math}
 * (create <menclose notation="notation">math</menclose>)
 * @param {TexParser} parser The current tex parser.
 * @param {string} name The name of the calling macro.
 */
EncloseMethods.Enclose = function(parser: TexParser, name: string) {
  let notation = parser.GetArgument(name).replace(/,/g, ' ');
  const attr = parser.GetBrackets(name, '');
  const math = parser.ParseArg(name);
  const def = ParseUtil.keyvalOptions(attr, ENCLOSE_OPTIONS);
  def.notation = notation;
  parser.Push(parser.create('node', 'menclose', [math], def));
};


new CommandMap('enclose', {enclose: 'Enclose'}, EncloseMethods);


export const EncloseConfiguration = Configuration.create(
  'enclose', {handler: {macro: ['enclose']}}
);


