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
 * @fileoverview Configuration file for the empheq package.
 *
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */


import {Configuration} from '../Configuration.js';
import {CommandMap, EnvironmentMap} from '../SymbolMap.js';
import ParseUtil from '../ParseUtil.js';
import TexParser from '../TexParser.js';
import TexError from '../TexError.js';
import {BeginItem} from '../base/BaseItems.js';
import {StackItem} from '../StackItem.js';
import {EmpheqUtil} from './EmpheqUtil.js';

/**
 * A StackItem for empheq environments.
 */
export class EmpheqBeginItem extends BeginItem {

  /**
   * @override
   */
  public get kind() {
    return 'empheq-begin';
  }

  /**
   * @override
   */
  public checkItem(item: StackItem) {
    if (item.isKind('end') && item.getName() === this.getName()) {
      this.setProperty('end', false);
    }
    return super.checkItem(item);
  }

}

/**
 * The methods that implement the empheq package.
 */
export const EmpheqMethods = {

  /**
   * Handle an empheq environment.
   *
   * @param {TexParser} parser        The active tex parser.
   * @param {EmpheqBeginItem} begin   The begin item for this environment.
   */
  Empheq(parser: TexParser, begin: EmpheqBeginItem) {
    if (parser.stack.env.closing === begin.getName()) {
      delete parser.stack.env.closing;
      parser.Push(parser.itemFactory.create('end').setProperty('name', parser.stack.global.empheq));
      parser.stack.global.empheq = '';
      const empheq = parser.stack.Top() as EmpheqBeginItem;
      EmpheqUtil.adjustTable(empheq, parser);
      parser.Push(parser.itemFactory.create('end').setProperty('name', 'empheq'));
    } else {
      ParseUtil.checkEqnEnv(parser);
      delete parser.stack.global.eqnenv;
      const opts = parser.GetBrackets('\\begin{' + begin.getName() + '}') || '';
      const [env, n] = (parser.GetArgument('\\begin{' + begin.getName() + '}') || '').split(/=/);
      if (!EmpheqUtil.checkEnv(env)) {
        throw new TexError('UnknownEnv', 'Unknown environment "%1"', env);
      }
      if (opts) {
        begin.setProperties(EmpheqUtil.splitOptions(opts, {left: 1, right: 1}));
      }
      parser.stack.global.empheq = env;
      parser.string = '\\begin{' + env + '}' + (n ? '{' + n + '}' : '') + parser.string.slice(parser.i);
      parser.i = 0;
      parser.Push(begin);
    }
  },

  /**
   * Create an <mo> with a given content
   *
   * @param {TexParser} parser   The active tex parser.
   * @param {string} name        The name of the macro being processed.
   * @param {string} c           The character for the <mo>
   */
  EmpheqMO(parser: TexParser, _name: string, c: string) {
    parser.Push(parser.create('token', 'mo', {}, c));
  },

  /**
   * Create a delimiter <mo> with a given character
   *
   * @param {TexParser} parser   The active tex parser.
   * @param {string} name        The name of the macro being processed.
   */
  EmpheqDelim(parser: TexParser, name: string) {
    const c = parser.GetDelimiter(name);
    parser.Push(parser.create('token', 'mo', {stretchy: true, symmetric: true}, c));
  }

};

//
//  Define an environment map to add the new empheq environment
//
new EnvironmentMap('empheq-env', EmpheqUtil.environment, {
  empheq: ['Empheq', 'empheq'],
}, EmpheqMethods);

//
//  Define the empheq characters
//
new CommandMap('empheq-macros', {
  empheqlbrace:    ['EmpheqMO', '{'],
  empheqrbrace:    ['EmpheqMO', '}'],
  empheqlbrack:    ['EmpheqMO', '['],
  empheqrbrack:    ['EmpheqMO', ']'],
  empheqlangle:    ['EmpheqMO', '\u27E8'],
  empheqrangle:    ['EmpheqMO', '\u27E9'],
  empheqlparen:    ['EmpheqMO', '('],
  empheqrparen:    ['EmpheqMO', ')'],
  empheqlvert:     ['EmpheqMO', '|'],
  empheqrvert:     ['EmpheqMO', '|'],
  empheqlVert:     ['EmpheqMO', '\u2016'],
  empheqrVert:     ['EmpheqMO', '\u2016'],
  empheqlfloor:    ['EmpheqMO', '\u230A'],
  empheqrfloor:    ['EmpheqMO', '\u230B'],
  empheqlceil:     ['EmpheqMO', '\u2308'],
  empheqrceil:     ['EmpheqMO', '\u2309'],
  empheqbiglbrace: ['EmpheqMO', '{'],
  empheqbigrbrace: ['EmpheqMO', '}'],
  empheqbiglbrack: ['EmpheqMO', '['],
  empheqbigrbrack: ['EmpheqMO', ']'],
  empheqbiglangle: ['EmpheqMO', '\u27E8'],
  empheqbigrangle: ['EmpheqMO', '\u27E9'],
  empheqbiglparen: ['EmpheqMO', '('],
  empheqbigrparen: ['EmpheqMO', ')'],
  empheqbiglvert:  ['EmpheqMO', '|'],
  empheqbigrvert:  ['EmpheqMO', '|'],
  empheqbiglVert:  ['EmpheqMO', '\u2016'],
  empheqbigrVert:  ['EmpheqMO', '\u2016'],
  empheqbiglfloor: ['EmpheqMO', '\u230A'],
  empheqbigrfloor: ['EmpheqMO', '\u230B'],
  empheqbiglceil:  ['EmpheqMO', '\u2308'],
  empheqbigrceil:  ['EmpheqMO', '\u2309'],
  empheql:          'EmpheqDelim',
  empheqr:          'EmpheqDelim',
  empheqbigl:       'EmpheqDelim',
  empheqbigr:       'EmpheqDelim'
}, EmpheqMethods);

//
//  Define the package for our new environment
//
export const EmpheqConfiguration = Configuration.create('empheq', {
  handler: {
    macro: ['empheq-macros'],
    environment: ['empheq-env'],
  },
  items: {
    [EmpheqBeginItem.prototype.kind]: EmpheqBeginItem
  }
});
