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
 * @fileoverview Configuration file for the AMS package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Configuration} from '../Configuration.js';
import TexParser from '../TexParser.js';

/**
 * Generates a red version of the undefined control sequence, instead of
 * throwing an error.
 * @param {TexParser} parser The calling parser.
 * @param {string} name The macro name.
 */
function noUndefined(parser: TexParser, name: string) {
  const textNode = parser.create('text', '\\' + name);
  const options = parser.options.noundefined || {};
  const def = {} as {[name: string]: string};
  for (const id of ['color', 'background', 'size']) {
    if (options[id]) {
      def['math' + id] = options[id];
    }
  }
  parser.Push(parser.create('node', 'mtext', [], def, textNode));
}

export const NoUndefinedConfiguration = Configuration.create(
  'noundefined', {
    fallback: {macro: noUndefined},
    options: {
      noundefined: {
        color: 'red',
        background: '',
        size: ''
      }
    },
    priority: 3
  }
);


