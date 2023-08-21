/*************************************************************
 *
 *  Copyright (c) 2019-2022 The MathJax Consortium
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
 * @fileoverview Configuration file for the v2-compatible color package.
 *
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */

import {CommandMap} from '../SymbolMap.js';
import {Configuration} from '../Configuration.js';
import {ParseMethod} from '../Types.js';
import TexParser from '../TexParser.js';

export const ColorV2Methods: Record<string, ParseMethod> = {

  /**
   * Implements the v2 color macro
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  Color(parser: TexParser, name: string) {
    // @test Color Frac
    const color = parser.GetArgument(name);
    const old = parser.stack.env['color'];
    parser.stack.env['color'] = color;
    const math = parser.ParseArg(name);
    if (old) {
      parser.stack.env['color'] = old;
    } else {
      delete parser.stack.env['color'];
    }
    const node = parser.create('node', 'mstyle', [math], {mathcolor: color});
    parser.Push(node);
  }

};

/**
 * The color macros
 */
new CommandMap('colorv2', {color: 'Color'}, ColorV2Methods);

/**
 * The configuration for the color macros
 */
export const ColorConfiguration = Configuration.create(
  'colorv2', {handler: {macro: ['colorv2']}}
);
