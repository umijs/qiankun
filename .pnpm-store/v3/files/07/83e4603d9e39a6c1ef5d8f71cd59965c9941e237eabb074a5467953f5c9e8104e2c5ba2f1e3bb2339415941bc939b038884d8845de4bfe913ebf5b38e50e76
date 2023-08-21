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
 * @fileoverview    Macro and environment mappings for the mathtools package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */

import ParseMethods from '../ParseMethods.js';
import {CommandMap, EnvironmentMap, DelimiterMap} from '../SymbolMap.js';
import {TexConstant} from '../TexConstants.js';

import {MathtoolsMethods} from './MathtoolsMethods.js';

//
//  Mathtools macros that are not implemented:
//
//    \smashoperator[〈pos〉]{〈operator with limits〉}
//    \SwapAboveDisplaySkip
//    \noeqref{〈label,label,. . . 〉}
//    \intertext{〈text 〉}
//    \shortintertext{〈text 〉}
//    \reDeclarePairedDelimiterInnerWrapper{〈macro name〉}{〈star or nostarnonscaled or nostarscaled〉}{〈code〉}
//    \DeclareMathSizes{〈dimen〉}{〈dimen〉}{〈dimen〉}{〈dimen〉}
//    \newgathered{〈name〉}{〈pre_line〉}{〈post_line〉}{〈after〉}
//    \renewgathered{〈name〉}{〈pre_line〉}{〈post_line〉}{〈after〉}
//

/**
 * The macros for this package.
 */
new CommandMap('mathtools-macros', {

  shoveleft:  ['HandleShove', TexConstant.Align.LEFT],    // override AMS version
  shoveright: ['HandleShove', TexConstant.Align.RIGHT],   // override AMS version

  xleftrightarrow:    ['xArrow', 0x2194, 10, 10],
  xLeftarrow:         ['xArrow', 0x21D0, 12, 7],
  xRightarrow:        ['xArrow', 0x21D2, 7, 12],
  xLeftrightarrow:    ['xArrow', 0x21D4, 12, 12],
  xhookleftarrow:     ['xArrow', 0x21A9, 10, 5],
  xhookrightarrow:    ['xArrow', 0x21AA, 5, 10],
  xmapsto:            ['xArrow', 0x21A6, 10, 10],
  xrightharpoondown:  ['xArrow', 0x21C1, 5, 10],
  xleftharpoondown:   ['xArrow', 0x21BD, 10, 5],
  xrightleftharpoons: ['xArrow', 0x21CC, 10, 10],
  xrightharpoonup:    ['xArrow', 0x21C0, 5, 10],
  xleftharpoonup:     ['xArrow', 0x21BC, 10, 5],
  xleftrightharpoons: ['xArrow', 0x21CB, 10, 10],

  mathllap: ['MathLap', 'l', false],
  mathrlap: ['MathLap', 'r', false],
  mathclap: ['MathLap', 'c', false],
  clap:     ['MtLap', 'c'],
  textllap: ['MtLap', 'l'],
  textrlap: ['MtLap', 'r'],
  textclap: ['MtLap', 'c'],

  cramped: 'Cramped',
  crampedllap: ['MathLap', 'l', true],
  crampedrlap: ['MathLap', 'r', true],
  crampedclap: ['MathLap', 'c', true],
  crampedsubstack: ['Macro', '\\begin{crampedsubarray}{c}#1\\end{crampedsubarray}', 1],

  mathmbox:    'MathMBox',
  mathmakebox: 'MathMakeBox',

  overbracket:  'UnderOverBracket',
  underbracket: 'UnderOverBracket',

  refeq: 'HandleRef',

  MoveEqLeft: ['Macro', '\\hspace{#1em}&\\hspace{-#1em}', 1, '2'],
  Aboxed: 'Aboxed',

  ArrowBetweenLines: 'ArrowBetweenLines',
  vdotswithin: 'VDotsWithin',
  shortvdotswithin: 'ShortVDotsWithin',
  MTFlushSpaceAbove: 'FlushSpaceAbove',
  MTFlushSpaceBelow: 'FlushSpaceBelow',

  DeclarePairedDelimiter:     'DeclarePairedDelimiter',
  DeclarePairedDelimiterX:    'DeclarePairedDelimiterX',
  DeclarePairedDelimiterXPP:  'DeclarePairedDelimiterXPP',

  //
  //  Typos from initial release -- kept for backward compatibility for now
  //
  DeclarePairedDelimiters:    'DeclarePairedDelimiter',
  DeclarePairedDelimitersX:   'DeclarePairedDelimiterX',
  DeclarePairedDelimitersXPP: 'DeclarePairedDelimiterXPP',

  centercolon: ['CenterColon', true, true],
  ordinarycolon: ['CenterColon', false],
  MTThinColon: ['CenterColon', true, true, true],

  coloneqq:    ['Relation', ':=', '\u2254'],
  Coloneqq:    ['Relation', '::=', '\u2A74'],
  coloneq:     ['Relation', ':-'],
  Coloneq:     ['Relation', '::-'],
  eqqcolon:    ['Relation', '=:', '\u2255'],
  Eqqcolon:    ['Relation', '=::'],
  eqcolon:     ['Relation', '-:', '\u2239'],
  Eqcolon:     ['Relation', '-::'],
  colonapprox: ['Relation', ':\\approx'],
  Colonapprox: ['Relation', '::\\approx'],
  colonsim:    ['Relation', ':\\sim'],
  Colonsim:    ['Relation', '::\\sim'],
  dblcolon:    ['Relation', '::', '\u2237'],

  nuparrow:   ['NArrow', '\u2191', '.06em'],
  ndownarrow: ['NArrow', '\u2193', '.25em'],
  bigtimes:   ['Macro', '\\mathop{\\Large\\kern-.1em\\boldsymbol{\\times}\\kern-.1em}'],

  splitfrac:  ['SplitFrac', false],
  splitdfrac: ['SplitFrac', true],

  xmathstrut: 'XMathStrut',

  prescript: 'Prescript',

  newtagform: ['NewTagForm', false],
  renewtagform: ['NewTagForm', true],
  usetagform: 'UseTagForm',

  adjustlimits: [
    'MacroWithTemplate',
    '\\mathop{{#1}\\vphantom{{#3}}}_{{#2}\\vphantom{{#4}}}\\mathop{{#3}\\vphantom{{#1}}}_{{#4}\\vphantom{{#2}}}',
    4, , '_', , '_'
  ],

  mathtoolsset: 'SetOptions'

}, MathtoolsMethods);

/**
 *  The environments for this package.
 */
new EnvironmentMap('mathtools-environments', ParseMethods.environment, {
  dcases:  ['Array', null, '\\{', '', 'll', null, '.2em', 'D'],
  rcases:  ['Array', null, '', '\\}', 'll', null, '.2em'],
  drcases: ['Array', null, '', '\\}', 'll', null, '.2em', 'D'],
  'dcases*':  ['Cases', null, '{', '', 'D'],
  'rcases*':  ['Cases', null, '', '}'],
  'drcases*': ['Cases', null, '', '}', 'D'],
  'cases*':   ['Cases', null, '{', ''],

  'matrix*':  ['MtMatrix', null, null, null],
  'pmatrix*': ['MtMatrix', null, '(', ')'],
  'bmatrix*': ['MtMatrix', null, '[', ']'],
  'Bmatrix*': ['MtMatrix', null, '\\{', '\\}'],
  'vmatrix*': ['MtMatrix', null, '\\vert', '\\vert'],
  'Vmatrix*': ['MtMatrix', null, '\\Vert', '\\Vert'],

  'smallmatrix*':  ['MtSmallMatrix', null, null, null],
  psmallmatrix:    ['MtSmallMatrix', null, '(', ')', 'c'],
  'psmallmatrix*': ['MtSmallMatrix', null, '(', ')'],
  bsmallmatrix:    ['MtSmallMatrix', null, '[', ']', 'c'],
  'bsmallmatrix*': ['MtSmallMatrix', null, '[', ']'],
  Bsmallmatrix:    ['MtSmallMatrix', null, '\\{', '\\}', 'c'],
  'Bsmallmatrix*': ['MtSmallMatrix', null, '\\{', '\\}'],
  vsmallmatrix:    ['MtSmallMatrix', null, '\\vert', '\\vert', 'c'],
  'vsmallmatrix*': ['MtSmallMatrix', null, '\\vert', '\\vert'],
  Vsmallmatrix:    ['MtSmallMatrix', null, '\\Vert', '\\Vert', 'c'],
  'Vsmallmatrix*': ['MtSmallMatrix', null, '\\Vert', '\\Vert'],

  crampedsubarray: ['Array', null, null, null, null, '0em', '0.1em', 'S\'', 1],

  multlined: 'MtMultlined',

  spreadlines: ['SpreadLines', true],

  lgathered: ['AmsEqnArray', null, null, null, 'l', null, '.5em', 'D'],
  rgathered: ['AmsEqnArray', null, null, null, 'r', null, '.5em', 'D'],

}, MathtoolsMethods);

/**
 * The delimiters for this package.
 */
new DelimiterMap('mathtools-delimiters', ParseMethods.delimiter, {
  '\\lparen': '(',
  '\\rparen': ')'
});

/**
 * The special characters for this package.
 */
new CommandMap('mathtools-characters', {
  ':' : ['CenterColon', true]
}, MathtoolsMethods);
