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
 * @fileoverview Configuration file for the verb package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Configuration} from '../Configuration.js';
import {TexConstant} from '../TexConstants.js';
import TexParser from '../TexParser.js';
import {CommandMap} from '../SymbolMap.js';
import {ParseMethod} from '../Types.js';
import TexError from '../TexError.js';


// Namespace
export let VerbMethods: Record<string, ParseMethod> = {};


/**
 * Implements the verbatim notation \verb|...|.
 * @param {TexParser} parser The current tex parser.
 * @param {string} name The name of the calling macro.
 */
VerbMethods.Verb = function(parser: TexParser, name: string) {
  const c = parser.GetNext();
  const start = ++parser.i;
  if (c === '' ) {
    throw new TexError('MissingArgFor', 'Missing argument for %1', name);
  }
  while (parser.i < parser.string.length &&
         parser.string.charAt(parser.i) !== c) {
    parser.i++;
  }
  if (parser.i === parser.string.length) {
    throw new TexError('NoClosingDelim',
                       'Can\'t find closing delimiter for %1',
                       parser.currentCS);
  }
  const text = parser.string.slice(start, parser.i).replace(/ /g, '\u00A0');
  parser.i++;
  parser.Push(parser.create('token', 'mtext',
                            {mathvariant: TexConstant.Variant.MONOSPACE},
                            text));
};


new CommandMap('verb', {verb: 'Verb'}, VerbMethods);


export const VerbConfiguration = Configuration.create(
  'verb', {handler: {macro: ['verb']}}
);
