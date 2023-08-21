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
 * @fileoverview Configuration file for the unicode package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Configuration} from '../Configuration.js';
import {EnvList} from '../StackItem.js';
import TexParser from '../TexParser.js';
import TexError from '../TexError.js';
import {CommandMap} from '../SymbolMap.js';
import {ParseMethod} from '../Types.js';
import ParseUtil from '../ParseUtil.js';
import NodeUtil from '../NodeUtil.js';
import {numeric} from '../../../util/Entities.js';

// Namespace
export let UnicodeMethods: Record<string, ParseMethod> = {};

let UnicodeCache: {[key: number]: [number, number, string, number]} = {};

/**
 * Parse function for unicode macro.
 * @param {TexParser} parser The current tex parser.
 * @param {string} name The name of the macro.
 */
UnicodeMethods.Unicode = function(parser: TexParser, name: string) {
  let HD = parser.GetBrackets(name);
  let HDsplit = null;
  let font = null;
  if (HD) {
    if (HD.replace(/ /g, '').
        match(/^(\d+(\.\d*)?|\.\d+),(\d+(\.\d*)?|\.\d+)$/)) {
      HDsplit = HD.replace(/ /g, '').split(/,/);
      font = parser.GetBrackets(name);
    } else {
      font = HD;
    }
  }
  let n = ParseUtil.trimSpaces(parser.GetArgument(name)).replace(/^0x/, 'x');
  if (!n.match(/^(x[0-9A-Fa-f]+|[0-9]+)$/)) {
    throw new TexError('BadUnicode', 'Argument to \\unicode must be a number');
  }
  let N = parseInt(n.match(/^x/) ? '0' + n : n);
  if (!UnicodeCache[N]) {
    UnicodeCache[N] = [800, 200, font, N];
  } else if (!font) {
    font = UnicodeCache[N][2];
  }
  if (HDsplit) {
    UnicodeCache[N][0] = Math.floor(parseFloat(HDsplit[0]) * 1000);
    UnicodeCache[N][1] = Math.floor(parseFloat(HDsplit[1]) * 1000);
  }
  let variant = parser.stack.env.font as string;
  let def: EnvList = {};
  if (font) {
    UnicodeCache[N][2] = def.fontfamily = font.replace(/'/g, '\'');
    if (variant) {
      if (variant.match(/bold/)) {
        def.fontweight = 'bold';
      }
      if (variant.match(/italic|-mathit/)) {
        def.fontstyle = 'italic';
      }
    }
  } else if (variant) {
    def.mathvariant = variant;
  }
  let node = parser.create('token', 'mtext', def, numeric(n));
  NodeUtil.setProperty(node, 'unicode', true);
  parser.Push(node);
};


new CommandMap('unicode', {unicode: 'Unicode'}, UnicodeMethods);


export const UnicodeConfiguration = Configuration.create(
  'unicode', {handler: {macro: ['unicode']}}
);
