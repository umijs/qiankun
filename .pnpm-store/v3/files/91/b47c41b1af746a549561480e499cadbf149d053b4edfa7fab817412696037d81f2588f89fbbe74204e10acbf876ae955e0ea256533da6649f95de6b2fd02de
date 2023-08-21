/*************************************************************
 *
 *  Copyright (c) 2017-2022 The MathJax Consortium
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
 * @fileoverview Base methods for TeX Parsing.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Symbol} from './Symbol.js';
import TexParser from './TexParser.js';
import NodeUtil from './NodeUtil.js';
import {TexConstant} from './TexConstants.js';
import {MmlNode} from '../../core/MmlTree/MmlNode.js';
import ParseUtil from './ParseUtil.js';


namespace ParseMethods {

  /**
   * Handle a variable (a single letter or multi-letter if allowed).
   * @param {TexParser} parser The current tex parser.
   * @param {string} c The letter to transform into an mi.
   */
  export function variable(parser: TexParser, c: string) {
    // @test Identifier Font
    const def = ParseUtil.getFontDef(parser);
    const env = parser.stack.env;
    if (env.multiLetterIdentifiers && env.font !== '') {
      c = parser.string.substr(parser.i - 1).match(env.multiLetterIdentifiers as any as RegExp)[0];
      parser.i += c.length - 1;
      if (def.mathvariant === TexConstant.Variant.NORMAL && env.noAutoOP && c.length > 1) {
        def.autoOP = false;
      }
    }
    // @test Identifier
    const node = parser.create('token', 'mi', def, c);
    parser.Push(node);
  }


  /**
   * Handle a number (a sequence of digits, with decimal separator, etc.).
   * @param {TexParser} parser The current tex parser.
   * @param {string} c The first character of a number than can be parsed with
   *     the digits pattern.
   */
  export function digit(parser: TexParser, c: string) {
    let mml: MmlNode;
    const pattern = parser.configuration.options['digits'];
    const n = parser.string.slice(parser.i - 1).match(pattern);
    // @test Integer Font
    const def = ParseUtil.getFontDef(parser);
    if (n) {
      // @test Integer, Number, Decimal (European)
      mml = parser.create('token', 'mn', def, n[0].replace(/[{}]/g, ''));
      parser.i += n[0].length - 1;
    } else {
      // @test Decimal Point, Decimal Point European
      mml = parser.create('token', 'mo', def, c);
    }
    parser.Push(mml);
  }

  /**
   * Lookup a control-sequence and process it.
   * @param {TexParser} parser The current tex parser.
   * @param {string} c The string '\'.
   */
  export function controlSequence(parser: TexParser, _c: string) {
    const name = parser.GetCS();
    parser.parse('macro', [parser, name]);
  }


  /**
   * Handle normal mathchar (as an mi).
   * @param {TexParser} parser The current tex parser.
   * @param {Symbol} mchar The parsed symbol.
   */
  export function mathchar0mi(parser: TexParser, mchar: Symbol) {
    const def = mchar.attributes || {mathvariant: TexConstant.Variant.ITALIC};
    // @test Greek
    const node = parser.create('token', 'mi', def, mchar.char);
    parser.Push(node);
  }

  /**
   * Handle normal mathchar (as an mo).
   * @param {TexParser} parser The current tex parser.
   * @param {Symbol} mchar The parsed symbol.
   */
  export function mathchar0mo(parser: TexParser, mchar: Symbol) {
    const def = mchar.attributes || {};
    def['stretchy'] = false;
    // @test Large Set
    const node = parser.create('token', 'mo', def, mchar.char);
    NodeUtil.setProperty(node, 'fixStretchy', true);
    parser.configuration.addNode('fixStretchy', node);
    // PROBLEM: Attributes stop working when Char7 are explicitly set.
    parser.Push(node);
  }

  /**
   * Handle mathchar in current family.
   * @param {TexParser} parser The current tex parser.
   * @param {Symbol} mchar The parsed symbol.
   */
  export function mathchar7(parser: TexParser, mchar: Symbol) {
    const def = mchar.attributes || {mathvariant: TexConstant.Variant.NORMAL};
    if (parser.stack.env['font']) {
      // @test MathChar7 Single Font
      def['mathvariant'] = parser.stack.env['font'];
    }
    // @test MathChar7 Single, MathChar7 Operator, MathChar7 Multi
    const node = parser.create('token', 'mi', def, mchar.char);
    parser.Push(node);
  }

  /**
   * Handle delimiter.
   * @param {TexParser} parser The current tex parser.
   * @param {Symbol} delim The parsed delimiter symbol.
   */
  export function delimiter(parser: TexParser, delim: Symbol) {
    let def = delim.attributes || {};
    // @test Fenced2, Delimiter (AMS)
    def = Object.assign({fence: false, stretchy: false}, def);
    const node = parser.create('token', 'mo', def, delim.char);
    parser.Push(node);
  }


  /**
   * Parse an environment.
   * @param {TexParser} parser The current tex parser.
   * @param {string} env The name of the environment.
   * @param {Function} func The parse method for the environment.
   * @param {any[]} args A list of additional arguments.
   */
  export function environment(parser: TexParser, env: string, func: Function, args: any[]) {
    const end = args[0];
    let mml = parser.itemFactory.create('begin').setProperties({name: env, end: end});
    mml = func(parser, mml, ...args.slice(1));
    parser.Push(mml);
  }

}

export default ParseMethods;
