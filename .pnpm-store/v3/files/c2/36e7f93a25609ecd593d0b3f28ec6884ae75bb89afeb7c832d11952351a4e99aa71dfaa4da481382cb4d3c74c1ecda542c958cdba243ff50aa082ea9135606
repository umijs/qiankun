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
 * @fileoverview Configuration file for the action package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Configuration} from '../Configuration.js';
import TexParser from '../TexParser.js';
import {CommandMap} from '../SymbolMap.js';
import {ParseMethod} from '../Types.js';
import BaseMethods from '../base/BaseMethods.js';


// Namespace
export let ActionMethods: Record<string, ParseMethod> = {};

ActionMethods.Macro = BaseMethods.Macro;

/**
 * Implement \toggle {math1} {math2} ... \endtoggle
 *    (as an <maction actiontype="toggle">)
 * @param {TexParser} parser The current tex parser.
 * @param {string} name The name of the calling macro.
 */
ActionMethods.Toggle = function(parser: TexParser, name: string) {
  const children = [];
  let arg;
  while ((arg = parser.GetArgument(name)) !== '\\endtoggle') {
    children.push(
      new TexParser(arg, parser.stack.env, parser.configuration).mml());
  }
  parser.Push(
    parser.create('node', 'maction', children, {actiontype: 'toggle'}));
};


/**
 * Implement \mathtip{math}{tip}
 *   (an an <maction actiontype="tooltip">)
 * @param {TexParser} parser The current tex parser.
 * @param {string} name The name of the calling macro.
 */
ActionMethods.Mathtip = function(parser: TexParser, name: string) {
  const arg = parser.ParseArg(name);
  const tip = parser.ParseArg(name);
  parser.Push(
    parser.create('node', 'maction', [arg, tip], {actiontype: 'tooltip'}));
};


new CommandMap('action-macros', {
  toggle:  'Toggle',
  mathtip: 'Mathtip',
  texttip: ['Macro', '\\mathtip{#1}{\\text{#2}}', 2]
}, ActionMethods);


export const ActionConfiguration = Configuration.create(
  'action', {handler: {macro: ['action-macros']}}
);
