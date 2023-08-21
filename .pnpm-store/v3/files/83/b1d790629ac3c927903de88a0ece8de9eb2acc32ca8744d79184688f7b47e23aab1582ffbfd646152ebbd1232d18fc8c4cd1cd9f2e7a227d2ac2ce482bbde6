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
 * @fileoverview Mappings for TeX parsing for Bussproofs package commands.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import BussproofsMethods from './BussproofsMethods.js';
import ParseMethods from '../ParseMethods.js';
import {CommandMap, EnvironmentMap} from '../SymbolMap.js';


/**
 * Macros for bussproofs etc.
 */
new CommandMap('Bussproofs-macros', {
  AxiomC:           'Axiom',
  UnaryInfC:        ['Inference', 1],
  BinaryInfC:       ['Inference', 2],
  TrinaryInfC:      ['Inference', 3],
  QuaternaryInfC:   ['Inference', 4],
  QuinaryInfC:      ['Inference', 5],
  RightLabel:       ['Label', 'right'],
  LeftLabel:        ['Label', 'left'],
  // Abbreviations are automatically enabled
  AXC:              'Axiom',
  UIC:              ['Inference', 1],
  BIC:              ['Inference', 2],
  TIC:              ['Inference', 3],
  RL:               ['Label', 'right'],
  LL:               ['Label', 'left'],

  noLine:           ['SetLine', 'none', false],
  singleLine:       ['SetLine', 'solid', false],
  solidLine:        ['SetLine', 'solid', false],
  dashedLine:       ['SetLine', 'dashed', false],
  // Not yet implemented in CSS!
  // doubleLine:       ['SetLine', 'double', false],
  // dottedLine:       ['SetLine', 'dotted', false],

  alwaysNoLine:           ['SetLine', 'none', true],
  alwaysSingleLine:       ['SetLine', 'solid', true],
  alwaysSolidLine:        ['SetLine', 'solid', true],
  alwaysDashedLine:       ['SetLine', 'dashed', true],
  // Not yet implemented in CSS!
  // alwaysDoubleLine:       ['SetLine', 'double', true],
  // alwaysDottedLine:       ['SetLine', 'dotted', true],

  rootAtTop: ['RootAtTop', true],
  alwaysRootAtTop: ['RootAtTop', true],

  rootAtBottom: ['RootAtTop', false],
  alwaysRootAtBottom: ['RootAtTop', false],
  // TODO: always commands should be persistent.

  fCenter:         'FCenter',
  Axiom:           'AxiomF',
  UnaryInf:        ['InferenceF', 1],
  BinaryInf:        ['InferenceF', 2],
  TrinaryInf:        ['InferenceF', 3],
  QuaternaryInf:        ['InferenceF', 4],
  QuinaryInf:        ['InferenceF', 5]
}, BussproofsMethods);


new EnvironmentMap('Bussproofs-environments', ParseMethods.environment, {
  prooftree:        ['Prooftree', null, false]
}, BussproofsMethods);
