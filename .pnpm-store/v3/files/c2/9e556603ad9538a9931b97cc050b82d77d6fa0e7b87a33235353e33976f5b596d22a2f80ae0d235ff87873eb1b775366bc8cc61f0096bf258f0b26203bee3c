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
 * @fileoverview Configuration file for the boldsymbol package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {Configuration} from '../Configuration.js';
import NodeUtil from '../NodeUtil.js';
import TexParser from '../TexParser.js';
import {TexConstant} from '../TexConstants.js';
import {CommandMap} from '../SymbolMap.js';
import {ParseMethod} from '../Types.js';
import {NodeFactory} from '../NodeFactory.js';
import ParseOptions from '../ParseOptions.js';

let BOLDVARIANT: {[key: string]: string} = {};
BOLDVARIANT[TexConstant.Variant.NORMAL] = TexConstant.Variant.BOLD;
BOLDVARIANT[TexConstant.Variant.ITALIC]    = TexConstant.Variant.BOLDITALIC;
BOLDVARIANT[TexConstant.Variant.FRAKTUR]   = TexConstant.Variant.BOLDFRAKTUR;
BOLDVARIANT[TexConstant.Variant.SCRIPT]    = TexConstant.Variant.BOLDSCRIPT;
BOLDVARIANT[TexConstant.Variant.SANSSERIF] = TexConstant.Variant.BOLDSANSSERIF;
BOLDVARIANT['-tex-calligraphic']   = '-tex-bold-calligraphic';
BOLDVARIANT['-tex-oldstyle']       = '-tex-bold-oldstyle';
BOLDVARIANT['-tex-mathit']         = TexConstant.Variant.BOLDITALIC;


// Namespace
export let BoldsymbolMethods: Record<string, ParseMethod> = {};


/**
 * Parse function for boldsymbol macro.
 * @param {TexParser} parser The current tex parser.
 * @param {string} name The name of the macro.
 */
BoldsymbolMethods.Boldsymbol = function(parser: TexParser, name: string) {
  let boldsymbol = parser.stack.env['boldsymbol'];
  parser.stack.env['boldsymbol'] = true;
  let mml = parser.ParseArg(name);
  parser.stack.env['boldsymbol'] = boldsymbol;
  parser.Push(mml);
};


new CommandMap('boldsymbol', {boldsymbol: 'Boldsymbol'}, BoldsymbolMethods);


/**
 * Creates token nodes in bold font if possible.
 * @param {NodeFactory} factory The current node factory.
 * @param {string} kind The type of token node to create.
 * @param {any} def Properties for the node.
 * @param {string} text The text content.
 * @return {MmlNode} The generated token node.
 */
export function createBoldToken(factory: NodeFactory, kind: string,
                                def: any, text: string): MmlNode  {
  let token = NodeFactory.createToken(factory, kind, def, text);
  if (kind !== 'mtext' &&
      factory.configuration.parser.stack.env['boldsymbol']) {
    NodeUtil.setProperty(token, 'fixBold', true);
    factory.configuration.addNode('fixBold', token);
  }
  return token;
}


/**
 * Postprocessor to rewrite token nodes to bold font, if possible.
 * @param {ParseOptions} data The parse options.
 */
export function rewriteBoldTokens(arg: {data: ParseOptions}) {
  for (let node of arg.data.getList('fixBold')) {
    if (NodeUtil.getProperty(node, 'fixBold')) {
      let variant = NodeUtil.getAttribute(node, 'mathvariant') as string;
      if (variant == null) {
        NodeUtil.setAttribute(node, 'mathvariant', TexConstant.Variant.BOLD);
      } else {
        NodeUtil.setAttribute(node,
                              'mathvariant', BOLDVARIANT[variant] || variant);
      }
      NodeUtil.removeProperties(node, 'fixBold');
    }
  }
}


export const BoldsymbolConfiguration = Configuration.create(
    'boldsymbol', {
        handler: {macro: ['boldsymbol']},
        nodes: {'token': createBoldToken},
        postprocessors: [rewriteBoldTokens]
    }
);
