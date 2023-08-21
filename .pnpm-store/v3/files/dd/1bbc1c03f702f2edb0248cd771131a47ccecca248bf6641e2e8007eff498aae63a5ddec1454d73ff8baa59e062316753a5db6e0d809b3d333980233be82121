/*************************************************************
 *  Copyright (c) 2020-2022 MathJax Consortium
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
 * @fileoverview    Configuration file for the mathtools package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */

import {Configuration} from '../Configuration.js';
import {CommandMap} from '../SymbolMap.js';
import NodeUtil from '../NodeUtil.js';
import {expandable} from '../../../util/Options.js';
import {ParserConfiguration} from '../Configuration.js';
import {TeX} from '../../tex.js';
import ParseOptions from '../ParseOptions.js';

import './MathtoolsMappings.js';
import {MathtoolsUtil} from './MathtoolsUtil.js';
import {MathtoolsTagFormat} from './MathtoolsTags.js';
import {MultlinedItem} from './MathtoolsItems.js';

/**
 * The name of the paried-delimiters command map.
 */
export const PAIREDDELIMS = 'mathtools-paired-delims';

/**
 * Create the paired-delimiters command map, and link it into the configuration.
 * @param {ParserConfiguration} config   The current configuration.
 */
function initMathtools(config: ParserConfiguration) {
  new CommandMap(PAIREDDELIMS, {}, {});
  config.append(Configuration.local({handler: {macro: [PAIREDDELIMS]}, priority: -5}));
}

/**
 * Add any pre-defined paired delimiters, and subclass the configured tag format.
 * @param {ParserConfiguration} config   The current configuration.
 * @param {TeX} jac                      The TeX input jax
 */
function configMathtools(config: ParserConfiguration, jax: TeX<any, any, any>) {
  const parser = jax.parseOptions;
  const pairedDelims = parser.options.mathtools.pairedDelimiters;
  for (const cs of Object.keys(pairedDelims)) {
    MathtoolsUtil.addPairedDelims(parser, cs, pairedDelims[cs]);
  }
  MathtoolsTagFormat(config, jax);
}

/**
 * A filter to fix up mmultiscripts elements.
 * @param {ParseOptions} data   The parse options.
 */
export function fixPrescripts({data}: {data: ParseOptions}) {
  for (const node of data.getList('mmultiscripts')) {
    if (!node.getProperty('fixPrescript')) continue;
    const childNodes = NodeUtil.getChildren(node);
    let n = 0;
    for (const i of [1, 2]) {
      if (!childNodes[i]) {
        NodeUtil.setChild(node, i, data.nodeFactory.create('node', 'none'));
        n++;
      }
    }
    for (const i of [4, 5]) {
      if (NodeUtil.isType(childNodes[i], 'mrow') && NodeUtil.getChildren(childNodes[i]).length === 0) {
        NodeUtil.setChild(node, i, data.nodeFactory.create('node', 'none'));
      }
    }
    if (n === 2) {
      childNodes.splice(1, 2);
    }
  }
}

/**
 * The configuration for the mathtools package
 */
export const MathtoolsConfiguration = Configuration.create(
  'mathtools', {
    handler: {
      macro: ['mathtools-macros', 'mathtools-delimiters'],
      environment: ['mathtools-environments'],
      delimiter: ['mathtools-delimiters'],
      character: ['mathtools-characters']
    },
    items: {
      [MultlinedItem.prototype.kind]: MultlinedItem
    },
    init: initMathtools,
    config: configMathtools,
    postprocessors: [[fixPrescripts, -6]],
    options: {
      mathtools: {
        'multlinegap': '1em',                   // horizontal space for multlined environments
        'multlined-pos': 'c',                   // default alignment for multlined environments
        'firstline-afterskip': '',              // space for first line of multlined (overrides multlinegap)
        'lastline-preskip': '',                 // space for last line of multlined (overrides multlinegap)
        'smallmatrix-align': 'c',               // default alignment for smallmatrix environments
        'shortvdotsadjustabove': '.2em',        // space to remove above \shortvdots
        'shortvdotsadjustbelow': '.2em',        // space to remove below \shortvdots
        'centercolon': false,                   // true to have colon automatically centered
        'centercolon-offset': '.04em',          // vertical adjustment for centered colons
        'thincolon-dx': '-.04em',               // horizontal adjustment for thin colons (e.g., \coloneqq)
        'thincolon-dw': '-.08em',               // width adjustment for thin colons
        'use-unicode': false,                   // true to use unicode characters rather than multi-character
                                                //   version for \coloneqq, etc., when possible
        'prescript-sub-format': '',             // format for \prescript subscript
        'prescript-sup-format': '',             // format for \prescript superscript
        'prescript-arg-format': '',             // format for \prescript base
        'allow-mathtoolsset': true,             // true to allow \mathtoolsset to change settings
        pairedDelimiters: expandable({}),       // predefined paired delimiters
                                                //     name: [left, right, body, argcount, pre, post]
        tagforms: expandable({}),               // tag form definitions
                                                //     name: [left, right, format]
       }
    }
  }
);
