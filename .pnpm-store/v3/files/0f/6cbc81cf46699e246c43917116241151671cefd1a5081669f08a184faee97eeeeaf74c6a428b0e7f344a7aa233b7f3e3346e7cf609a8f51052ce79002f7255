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
 * @fileoverview Base mappings for TeX Parsing.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import *  as sm from '../SymbolMap.js';
import {TexConstant} from '../TexConstants.js';
import BaseMethods from './BaseMethods.js';
import ParseMethods from '../ParseMethods.js';
import ParseUtil from '../ParseUtil.js';
import {TEXCLASS} from '../../../core/MmlTree/MmlNode.js';
import {MATHSPACE, em} from '../../../util/lengths.js';


/**
 * Letter pattern for parsing identifiers and operators.
 */
new sm.RegExpMap('letter', ParseMethods.variable, /[a-z]/i);


/**
 * Digit pattern for parsing numbers.
 */
new sm.RegExpMap('digit', ParseMethods.digit, /[0-9.,]/);


/**
 * Pattern for spotting start of commands.
 */
new sm.RegExpMap('command', ParseMethods.controlSequence, /^\\/ );


/**
 * Treatment of special characters in LaTeX.
 */
new sm.MacroMap('special', {

  // This is now handled with a RegExp!
  // '\\':  'ControlSequence',

  '{':   'Open',
  '}':   'Close',
  '~':   'Tilde',
  '^':   'Superscript',
  '_':   'Subscript',
  ' ':   'Space',
  '\t':  'Space',
  '\r':  'Space',
  '\n':  'Space',
  '\'':  'Prime',
  '%':   'Comment',
  '&':   'Entry',
  '#':   'Hash',
  '\u00A0': 'Space',
  '\u2019': 'Prime'
}, BaseMethods);


/**
 * Macros for identifiers.
 */
new sm.CharacterMap('mathchar0mi', ParseMethods.mathchar0mi, {
  // Lower-case greek
  alpha:        '\u03B1',
  beta:         '\u03B2',
  gamma:        '\u03B3',
  delta:        '\u03B4',
  epsilon:      '\u03F5',
  zeta:         '\u03B6',
  eta:          '\u03B7',
  theta:        '\u03B8',
  iota:         '\u03B9',
  kappa:        '\u03BA',
  lambda:       '\u03BB',
  mu:           '\u03BC',
  nu:           '\u03BD',
  xi:           '\u03BE',
  omicron:      '\u03BF', // added for completeness
  pi:           '\u03C0',
  rho:          '\u03C1',
  sigma:        '\u03C3',
  tau:          '\u03C4',
  upsilon:      '\u03C5',
  phi:          '\u03D5',
  chi:          '\u03C7',
  psi:          '\u03C8',
  omega:        '\u03C9',
  varepsilon:   '\u03B5',
  vartheta:     '\u03D1',
  varpi:        '\u03D6',
  varrho:       '\u03F1',
  varsigma:     '\u03C2',
  varphi:       '\u03C6',

  // Ord symbols
  S:            ['\u00A7', {mathvariant: TexConstant.Variant.NORMAL}],
  aleph:        ['\u2135', {mathvariant: TexConstant.Variant.NORMAL}],
  hbar:         ['\u210F', {variantForm: true}],
  imath:        '\u0131',
  jmath:        '\u0237',
  ell:          '\u2113',
  wp:           ['\u2118', {mathvariant: TexConstant.Variant.NORMAL}],
  Re:           ['\u211C', {mathvariant: TexConstant.Variant.NORMAL}],
  Im:           ['\u2111', {mathvariant: TexConstant.Variant.NORMAL}],
  partial:      ['\u2202', {mathvariant: TexConstant.Variant.ITALIC}],
  infty:        ['\u221E', {mathvariant: TexConstant.Variant.NORMAL}],
  prime:        ['\u2032', {variantForm: true}],
  emptyset:     ['\u2205', {mathvariant: TexConstant.Variant.NORMAL}],
  nabla:        ['\u2207', {mathvariant: TexConstant.Variant.NORMAL}],
  top:          ['\u22A4', {mathvariant: TexConstant.Variant.NORMAL}],
  bot:          ['\u22A5', {mathvariant: TexConstant.Variant.NORMAL}],
  angle:        ['\u2220', {mathvariant: TexConstant.Variant.NORMAL}],
  triangle:     ['\u25B3', {mathvariant: TexConstant.Variant.NORMAL}],
  backslash:    ['\u2216', {mathvariant: TexConstant.Variant.NORMAL}],
  forall:       ['\u2200', {mathvariant: TexConstant.Variant.NORMAL}],
  exists:       ['\u2203', {mathvariant: TexConstant.Variant.NORMAL}],
  neg:          ['\u00AC', {mathvariant: TexConstant.Variant.NORMAL}],
  lnot:         ['\u00AC', {mathvariant: TexConstant.Variant.NORMAL}],
  flat:         ['\u266D', {mathvariant: TexConstant.Variant.NORMAL}],
  natural:      ['\u266E', {mathvariant: TexConstant.Variant.NORMAL}],
  sharp:        ['\u266F', {mathvariant: TexConstant.Variant.NORMAL}],
  clubsuit:     ['\u2663', {mathvariant: TexConstant.Variant.NORMAL}],
  diamondsuit:  ['\u2662', {mathvariant: TexConstant.Variant.NORMAL}],
  heartsuit:    ['\u2661', {mathvariant: TexConstant.Variant.NORMAL}],
  spadesuit:    ['\u2660', {mathvariant: TexConstant.Variant.NORMAL}]
});


/**
 * Macros for operators.
 */
new sm.CharacterMap('mathchar0mo', ParseMethods.mathchar0mo, {
  surd:         '\u221A',

  // big ops
  coprod:       ['\u2210', {texClass: TEXCLASS.OP,
                            movesupsub: true}],
  bigvee:       ['\u22C1', {texClass: TEXCLASS.OP,
                            movesupsub: true}],
  bigwedge:     ['\u22C0', {texClass: TEXCLASS.OP,
                            movesupsub: true}],
  biguplus:     ['\u2A04', {texClass: TEXCLASS.OP,
                            movesupsub: true}],
  bigcap:       ['\u22C2', {texClass: TEXCLASS.OP,
                            movesupsub: true}],
  bigcup:       ['\u22C3', {texClass: TEXCLASS.OP,
                            movesupsub: true}],
  'int':        ['\u222B', {texClass: TEXCLASS.OP}],
  intop:        ['\u222B', {texClass: TEXCLASS.OP,
                            movesupsub: true, movablelimits: true}],
  iint:         ['\u222C', {texClass: TEXCLASS.OP}],
  iiint:        ['\u222D', {texClass: TEXCLASS.OP}],
  prod:         ['\u220F', {texClass: TEXCLASS.OP,
                            movesupsub: true}],
  sum:          ['\u2211', {texClass: TEXCLASS.OP,
                            movesupsub: true}],
  bigotimes:    ['\u2A02', {texClass: TEXCLASS.OP,
                            movesupsub: true}],
  bigoplus:     ['\u2A01', {texClass: TEXCLASS.OP,
                            movesupsub: true}],
  bigodot:      ['\u2A00', {texClass: TEXCLASS.OP,
                            movesupsub: true}],
  oint:         ['\u222E', {texClass: TEXCLASS.OP}],
  bigsqcup:     ['\u2A06', {texClass: TEXCLASS.OP,
                            movesupsub: true}],
  smallint:     ['\u222B', {largeop: false}],

  // binary operations
  triangleleft:      '\u25C3',
  triangleright:     '\u25B9',
  bigtriangleup:     '\u25B3',
  bigtriangledown:   '\u25BD',
  wedge:        '\u2227',
  land:         '\u2227',
  vee:          '\u2228',
  lor:          '\u2228',
  cap:          '\u2229',
  cup:          '\u222A',
  ddagger:      '\u2021',
  dagger:       '\u2020',
  sqcap:        '\u2293',
  sqcup:        '\u2294',
  uplus:        '\u228E',
  amalg:        '\u2A3F',
  diamond:      '\u22C4',
  bullet:       '\u2219',
  wr:           '\u2240',
  div:          '\u00F7',
  divsymbol:    '\u00F7',
  odot:         ['\u2299', {largeop: false}],
  oslash:       ['\u2298', {largeop: false}],
  otimes:       ['\u2297', {largeop: false}],
  ominus:       ['\u2296', {largeop: false}],
  oplus:        ['\u2295', {largeop: false}],
  mp:           '\u2213',
  pm:           '\u00B1',
  circ:         '\u2218',
  bigcirc:      '\u25EF',
  setminus:     '\u2216',
  cdot:         '\u22C5',
  ast:          '\u2217',
  times:        '\u00D7',
  star:         '\u22C6',


  // Relations
  propto:       '\u221D',
  sqsubseteq:   '\u2291',
  sqsupseteq:   '\u2292',
  parallel:     '\u2225',
  mid:          '\u2223',
  dashv:        '\u22A3',
  vdash:        '\u22A2',
  leq:          '\u2264',
  le:           '\u2264',
  geq:          '\u2265',
  ge:           '\u2265',
  lt:           '\u003C',
  gt:           '\u003E',
  succ:         '\u227B',
  prec:         '\u227A',
  approx:       '\u2248',
  succeq:       '\u2AB0',  // or '227C',
  preceq:       '\u2AAF',  // or '227D',
  supset:       '\u2283',
  subset:       '\u2282',
  supseteq:     '\u2287',
  subseteq:     '\u2286',
  'in':         '\u2208',
  ni:           '\u220B',
  notin:        '\u2209',
  owns:         '\u220B',
  gg:           '\u226B',
  ll:           '\u226A',
  sim:          '\u223C',
  simeq:        '\u2243',
  perp:         '\u22A5',
  equiv:        '\u2261',
  asymp:        '\u224D',
  smile:        '\u2323',
  frown:        '\u2322',
  ne:           '\u2260',
  neq:          '\u2260',
  cong:         '\u2245',
  doteq:        '\u2250',
  bowtie:       '\u22C8',
  models:       '\u22A8',

  notChar:      '\u29F8',


  // Arrows
  Leftrightarrow:     '\u21D4',
  Leftarrow:          '\u21D0',
  Rightarrow:         '\u21D2',
  leftrightarrow:     '\u2194',
  leftarrow:          '\u2190',
  gets:               '\u2190',
  rightarrow:         '\u2192',
  to:                ['\u2192', {accent: false}],
  mapsto:             '\u21A6',
  leftharpoonup:      '\u21BC',
  leftharpoondown:    '\u21BD',
  rightharpoonup:     '\u21C0',
  rightharpoondown:   '\u21C1',
  nearrow:            '\u2197',
  searrow:            '\u2198',
  nwarrow:            '\u2196',
  swarrow:            '\u2199',
  rightleftharpoons:  '\u21CC',
  hookrightarrow:     '\u21AA',
  hookleftarrow:      '\u21A9',
  longleftarrow:      '\u27F5',
  Longleftarrow:      '\u27F8',
  longrightarrow:     '\u27F6',
  Longrightarrow:     '\u27F9',
  Longleftrightarrow: '\u27FA',
  longleftrightarrow: '\u27F7',
  longmapsto:         '\u27FC',


  // Misc.
  ldots:            '\u2026',
  cdots:            '\u22EF',
  vdots:            '\u22EE',
  ddots:            '\u22F1',
  dotsc:            '\u2026',  // dots with commas
  dotsb:            '\u22EF',  // dots with binary ops and relations
  dotsm:            '\u22EF',  // dots with multiplication
  dotsi:            '\u22EF',  // dots with integrals
  dotso:            '\u2026',  // other dots

  ldotp:            ['\u002E', {texClass: TEXCLASS.PUNCT}],
  cdotp:            ['\u22C5', {texClass: TEXCLASS.PUNCT}],
  colon:            ['\u003A', {texClass: TEXCLASS.PUNCT}]
});


/**
 * Macros for special characters and identifiers.
 */
new sm.CharacterMap('mathchar7', ParseMethods.mathchar7, {
  Gamma:        '\u0393',
  Delta:        '\u0394',
  Theta:        '\u0398',
  Lambda:       '\u039B',
  Xi:           '\u039E',
  Pi:           '\u03A0',
  Sigma:        '\u03A3',
  Upsilon:      '\u03A5',
  Phi:          '\u03A6',
  Psi:          '\u03A8',
  Omega:        '\u03A9',

  '_':          '\u005F',
  '#':          '\u0023',
  '$':          '\u0024',
  '%':          '\u0025',
  '&':          '\u0026',
  And:          '\u0026'
});


/**
 * Macros for delimiters.
 */
new sm.DelimiterMap('delimiter', ParseMethods.delimiter, {
  '(':                '(',
  ')':                ')',
  '[':                '[',
  ']':                ']',
  '<':                '\u27E8',
  '>':                '\u27E9',
  '\\lt':             '\u27E8',
  '\\gt':             '\u27E9',
  '/':                '/',
  '|':                ['|', {texClass: TEXCLASS.ORD}],
  '.':                '',
  '\\\\':             '\\',
  '\\lmoustache':     '\u23B0',  // non-standard
  '\\rmoustache':     '\u23B1',  // non-standard
  '\\lgroup':         '\u27EE',  // non-standard
  '\\rgroup':         '\u27EF',  // non-standard
  '\\arrowvert':      '\u23D0',
  '\\Arrowvert':      '\u2016',
  '\\bracevert':      '\u23AA',  // non-standard
  '\\Vert':           ['\u2016', {texClass: TEXCLASS.ORD}],
  '\\|':              ['\u2016', {texClass: TEXCLASS.ORD}],
  '\\vert':           ['|', {texClass: TEXCLASS.ORD}],
  '\\uparrow':        '\u2191',
  '\\downarrow':      '\u2193',
  '\\updownarrow':    '\u2195',
  '\\Uparrow':        '\u21D1',
  '\\Downarrow':      '\u21D3',
  '\\Updownarrow':    '\u21D5',
  '\\backslash':      '\\',
  '\\rangle':         '\u27E9',
  '\\langle':         '\u27E8',
  '\\rbrace':         '}',
  '\\lbrace':         '{',
  '\\}':              '}',
  '\\{':              '{',
  '\\rceil':          '\u2309',
  '\\lceil':          '\u2308',
  '\\rfloor':         '\u230B',
  '\\lfloor':         '\u230A',
  '\\lbrack':         '[',
  '\\rbrack':         ']'
});


/**
 * Macros for LaTeX commands.
 */
new sm.CommandMap('macros', {
  displaystyle:      ['SetStyle', 'D', true, 0],
  textstyle:         ['SetStyle', 'T', false, 0],
  scriptstyle:       ['SetStyle', 'S', false, 1],
  scriptscriptstyle: ['SetStyle', 'SS', false, 2],

  rm:                ['SetFont', TexConstant.Variant.NORMAL],
  mit:               ['SetFont', TexConstant.Variant.ITALIC],
  oldstyle:          ['SetFont', TexConstant.Variant.OLDSTYLE],
  cal:               ['SetFont', TexConstant.Variant.CALLIGRAPHIC],
  it:                ['SetFont', TexConstant.Variant.MATHITALIC], // needs special handling
  bf:                ['SetFont', TexConstant.Variant.BOLD],
  bbFont:            ['SetFont', TexConstant.Variant.DOUBLESTRUCK],
  scr:               ['SetFont', TexConstant.Variant.SCRIPT],
  frak:              ['SetFont', TexConstant.Variant.FRAKTUR],
  sf:                ['SetFont', TexConstant.Variant.SANSSERIF],
  tt:                ['SetFont', TexConstant.Variant.MONOSPACE],

  mathrm:            ['MathFont', TexConstant.Variant.NORMAL],
  mathup:            ['MathFont', TexConstant.Variant.NORMAL],
  mathnormal:        ['MathFont', ''],
  mathbf:            ['MathFont', TexConstant.Variant.BOLD],
  mathbfup:          ['MathFont', TexConstant.Variant.BOLD],
  mathit:            ['MathFont', TexConstant.Variant.MATHITALIC],
  mathbfit:          ['MathFont', TexConstant.Variant.BOLDITALIC],
  mathbb:            ['MathFont', TexConstant.Variant.DOUBLESTRUCK],
  Bbb:               ['MathFont', TexConstant.Variant.DOUBLESTRUCK],
  mathfrak:          ['MathFont', TexConstant.Variant.FRAKTUR],
  mathbffrak:        ['MathFont', TexConstant.Variant.BOLDFRAKTUR],
  mathscr:           ['MathFont', TexConstant.Variant.SCRIPT],
  mathbfscr:         ['MathFont', TexConstant.Variant.BOLDSCRIPT],
  mathsf:            ['MathFont', TexConstant.Variant.SANSSERIF],
  mathsfup:          ['MathFont', TexConstant.Variant.SANSSERIF],
  mathbfsf:          ['MathFont', TexConstant.Variant.BOLDSANSSERIF],
  mathbfsfup:        ['MathFont', TexConstant.Variant.BOLDSANSSERIF],
  mathsfit:          ['MathFont', TexConstant.Variant.SANSSERIFITALIC],
  mathbfsfit:        ['MathFont', TexConstant.Variant.SANSSERIFBOLDITALIC],
  mathtt:            ['MathFont', TexConstant.Variant.MONOSPACE],
  mathcal:           ['MathFont', TexConstant.Variant.CALLIGRAPHIC],
  mathbfcal:         ['MathFont', TexConstant.Variant.BOLDCALLIGRAPHIC],

  symrm:             ['MathFont', TexConstant.Variant.NORMAL],
  symup:             ['MathFont', TexConstant.Variant.NORMAL],
  symnormal:         ['MathFont', ''],
  symbf:             ['MathFont', TexConstant.Variant.BOLD],
  symbfup:           ['MathFont', TexConstant.Variant.BOLD],
  symit:             ['MathFont', TexConstant.Variant.ITALIC],
  symbfit:           ['MathFont', TexConstant.Variant.BOLDITALIC],
  symbb:             ['MathFont', TexConstant.Variant.DOUBLESTRUCK],
  symfrak:           ['MathFont', TexConstant.Variant.FRAKTUR],
  symbffrak:         ['MathFont', TexConstant.Variant.BOLDFRAKTUR],
  symscr:            ['MathFont', TexConstant.Variant.SCRIPT],
  symbfscr:          ['MathFont', TexConstant.Variant.BOLDSCRIPT],
  symsf:             ['MathFont', TexConstant.Variant.SANSSERIF],
  symsfup:           ['MathFont', TexConstant.Variant.SANSSERIF],
  symbfsf:           ['MathFont', TexConstant.Variant.BOLDSANSSERIF],
  symbfsfup:         ['MathFont', TexConstant.Variant.BOLDSANSSERIF],
  symsfit:           ['MathFont', TexConstant.Variant.SANSSERIFITALIC],
  symbfsfit:         ['MathFont', TexConstant.Variant.SANSSERIFBOLDITALIC],
  symtt:             ['MathFont', TexConstant.Variant.MONOSPACE],
  symcal:            ['MathFont', TexConstant.Variant.CALLIGRAPHIC],
  symbfcal:          ['MathFont', TexConstant.Variant.BOLDCALLIGRAPHIC],

  textrm:            ['HBox', null, TexConstant.Variant.NORMAL],
  textup:            ['HBox', null, TexConstant.Variant.NORMAL],
  textnormal:        ['HBox'],
  textit:            ['HBox', null, TexConstant.Variant.ITALIC],
  textbf:            ['HBox', null, TexConstant.Variant.BOLD],
  textsf:            ['HBox', null, TexConstant.Variant.SANSSERIF],
  texttt:            ['HBox', null, TexConstant.Variant.MONOSPACE],

  tiny:              ['SetSize', 0.5],
  Tiny:              ['SetSize', 0.6],  // non-standard
  scriptsize:        ['SetSize', 0.7],
  small:             ['SetSize', 0.85],
  normalsize:        ['SetSize', 1.0],
  large:             ['SetSize', 1.2],
  Large:             ['SetSize', 1.44],
  LARGE:             ['SetSize', 1.73],
  huge:              ['SetSize', 2.07],
  Huge:              ['SetSize', 2.49],

  arcsin:             'NamedFn',
  arccos:             'NamedFn',
  arctan:             'NamedFn',
  arg:                'NamedFn',
  cos:                'NamedFn',
  cosh:               'NamedFn',
  cot:                'NamedFn',
  coth:               'NamedFn',
  csc:                'NamedFn',
  deg:                'NamedFn',
  det:                'NamedOp',
  dim:                'NamedFn',
  exp:                'NamedFn',
  gcd:                'NamedOp',
  hom:                'NamedFn',
  inf:                'NamedOp',
  ker:                'NamedFn',
  lg:                 'NamedFn',
  lim:                'NamedOp',
  liminf:            ['NamedOp', 'lim&thinsp;inf'],
  limsup:            ['NamedOp', 'lim&thinsp;sup'],
  ln:                 'NamedFn',
  log:                'NamedFn',
  max:                'NamedOp',
  min:                'NamedOp',
  Pr:                 'NamedOp',
  sec:                'NamedFn',
  sin:                'NamedFn',
  sinh:               'NamedFn',
  sup:                'NamedOp',
  tan:                'NamedFn',
  tanh:               'NamedFn',

  limits:            ['Limits', 1],
  nolimits:          ['Limits', 0],

  overline:            ['UnderOver', '2015'],
  underline:           ['UnderOver', '2015'],
  overbrace:           ['UnderOver', '23DE', 1],
  underbrace:          ['UnderOver', '23DF', 1],
  overparen:           ['UnderOver', '23DC'],
  underparen:          ['UnderOver', '23DD'],
  overrightarrow:      ['UnderOver', '2192'],
  underrightarrow:     ['UnderOver', '2192'],
  overleftarrow:       ['UnderOver', '2190'],
  underleftarrow:      ['UnderOver', '2190'],
  overleftrightarrow:  ['UnderOver', '2194'],
  underleftrightarrow: ['UnderOver', '2194'],

  overset:            'Overset',
  underset:           'Underset',
  overunderset:       'Overunderset',
  stackrel:           ['Macro', '\\mathrel{\\mathop{#2}\\limits^{#1}}', 2],
  stackbin:           ['Macro', '\\mathbin{\\mathop{#2}\\limits^{#1}}', 2],

  over:               'Over',
  overwithdelims:     'Over',
  atop:               'Over',
  atopwithdelims:     'Over',
  above:              'Over',
  abovewithdelims:    'Over',
  brace:             ['Over', '{', '}'],
  brack:             ['Over', '[', ']'],
  choose:            ['Over', '(', ')'],

  frac:               'Frac',
  sqrt:               'Sqrt',
  root:               'Root',
  uproot:            ['MoveRoot', 'upRoot'],
  leftroot:          ['MoveRoot', 'leftRoot'],

  left:               'LeftRight',
  right:              'LeftRight',
  middle:             'LeftRight',

  llap:               'Lap',
  rlap:               'Lap',
  raise:              'RaiseLower',
  lower:              'RaiseLower',
  moveleft:           'MoveLeftRight',
  moveright:          'MoveLeftRight',

  ',':               ['Spacer', MATHSPACE.thinmathspace],
  ':':               ['Spacer', MATHSPACE.mediummathspace],
  '>':               ['Spacer', MATHSPACE.mediummathspace],
  ';':               ['Spacer', MATHSPACE.thickmathspace],
  '!':               ['Spacer', MATHSPACE.negativethinmathspace],
  enspace:           ['Spacer', .5],
  quad:              ['Spacer', 1],
  qquad:             ['Spacer', 2],
  thinspace:         ['Spacer', MATHSPACE.thinmathspace],
  negthinspace:      ['Spacer', MATHSPACE.negativethinmathspace],

  hskip:              'Hskip',
  hspace:             'Hskip',
  kern:               'Hskip',
  mskip:              'Hskip',
  mspace:             'Hskip',
  mkern:              'Hskip',
  rule:               'rule',
  Rule:              ['Rule'],
  Space:             ['Rule', 'blank'],
  nonscript:          'Nonscript',

  big:               ['MakeBig', TEXCLASS.ORD, 0.85],
  Big:               ['MakeBig', TEXCLASS.ORD, 1.15],
  bigg:              ['MakeBig', TEXCLASS.ORD, 1.45],
  Bigg:              ['MakeBig', TEXCLASS.ORD, 1.75],
  bigl:              ['MakeBig', TEXCLASS.OPEN, 0.85],
  Bigl:              ['MakeBig', TEXCLASS.OPEN, 1.15],
  biggl:             ['MakeBig', TEXCLASS.OPEN, 1.45],
  Biggl:             ['MakeBig', TEXCLASS.OPEN, 1.75],
  bigr:              ['MakeBig', TEXCLASS.CLOSE, 0.85],
  Bigr:              ['MakeBig', TEXCLASS.CLOSE, 1.15],
  biggr:             ['MakeBig', TEXCLASS.CLOSE, 1.45],
  Biggr:             ['MakeBig', TEXCLASS.CLOSE, 1.75],
  bigm:              ['MakeBig', TEXCLASS.REL, 0.85],
  Bigm:              ['MakeBig', TEXCLASS.REL, 1.15],
  biggm:             ['MakeBig', TEXCLASS.REL, 1.45],
  Biggm:             ['MakeBig', TEXCLASS.REL, 1.75],

  mathord:           ['TeXAtom', TEXCLASS.ORD],
  mathop:            ['TeXAtom', TEXCLASS.OP],
  mathopen:          ['TeXAtom', TEXCLASS.OPEN],
  mathclose:         ['TeXAtom', TEXCLASS.CLOSE],
  mathbin:           ['TeXAtom', TEXCLASS.BIN],
  mathrel:           ['TeXAtom', TEXCLASS.REL],
  mathpunct:         ['TeXAtom', TEXCLASS.PUNCT],
  mathinner:         ['TeXAtom', TEXCLASS.INNER],

  vcenter:           ['TeXAtom', TEXCLASS.VCENTER],

  buildrel:           'BuildRel',

  hbox:               ['HBox', 0],
  text:               'HBox',
  mbox:               ['HBox', 0],
  fbox:               'FBox',
  boxed:              ['Macro', '\\fbox{$\\displaystyle{#1}$}', 1],
  framebox:           'FrameBox',

  strut:              'Strut',
  mathstrut:         ['Macro', '\\vphantom{(}'],
  phantom:            'Phantom',
  vphantom:          ['Phantom', 1, 0],
  hphantom:          ['Phantom', 0, 1],
  smash:              'Smash',

  acute:             ['Accent', '00B4'],  // or 0301 or 02CA
  grave:             ['Accent', '0060'],  // or 0300 or 02CB
  ddot:              ['Accent', '00A8'],  // or 0308
  tilde:             ['Accent', '007E'],  // or 0303 or 02DC
  bar:               ['Accent', '00AF'],  // or 0304 or 02C9
  breve:             ['Accent', '02D8'],  // or 0306
  check:             ['Accent', '02C7'],  // or 030C
  hat:               ['Accent', '005E'],  // or 0302 or 02C6
  vec:               ['Accent', '2192'],  // or 20D7
  dot:               ['Accent', '02D9'],  // or 0307
  widetilde:         ['Accent', '007E', 1], // or 0303 or 02DC
  widehat:           ['Accent', '005E', 1], // or 0302 or 02C6

  matrix:             'Matrix',
  array:              'Matrix',
  pmatrix:           ['Matrix', '(', ')'],
  cases:             ['Matrix', '{', '', 'left left', null, '.1em', null,
                      true],
  eqalign:           ['Matrix', null, null, 'right left',
                      em(MATHSPACE.thickmathspace), '.5em', 'D'],
  displaylines:      ['Matrix', null, null, 'center', null, '.5em', 'D'],
  cr:                 'Cr',
  '\\':               'CrLaTeX',
  newline:           ['CrLaTeX', true],
  hline:             ['HLine', 'solid'],
  hdashline:         ['HLine', 'dashed'],
  //      noalign:            'HandleNoAlign',
  eqalignno:         ['Matrix', null, null, 'right left',
                      em(MATHSPACE.thickmathspace), '.5em', 'D', null,
                      'right'],
  leqalignno:        ['Matrix', null, null, 'right left',
                      em(MATHSPACE.thickmathspace), '.5em', 'D', null,
                      'left'],
  hfill:              'HFill',
  hfil:               'HFill',   // \hfil treated as \hfill for now
  hfilll:             'HFill',   // \hfilll treated as \hfill for now

  //  TeX substitution macros
  bmod:              ['Macro', '\\mmlToken{mo}[lspace="thickmathspace"' +
                      ' rspace="thickmathspace"]{mod}'],
  pmod:              ['Macro', '\\pod{\\mmlToken{mi}{mod}\\kern 6mu #1}', 1],
  mod:               ['Macro', '\\mathchoice{\\kern18mu}{\\kern12mu}' +
                      '{\\kern12mu}{\\kern12mu}\\mmlToken{mi}{mod}\\,\\,#1',
                      1],
  pod:               ['Macro', '\\mathchoice{\\kern18mu}{\\kern8mu}' +
                      '{\\kern8mu}{\\kern8mu}(#1)', 1],
  iff:               ['Macro', '\\;\\Longleftrightarrow\\;'],
  skew:              ['Macro', '{{#2{#3\\mkern#1mu}\\mkern-#1mu}{}}', 3],

  pmb:               ['Macro', '\\rlap{#1}\\kern1px{#1}', 1],
  TeX:               ['Macro', 'T\\kern-.14em\\lower.5ex{E}\\kern-.115em X'],
  LaTeX:             ['Macro', 'L\\kern-.325em\\raise.21em' +
                      '{\\scriptstyle{A}}\\kern-.17em\\TeX'],
  ' ':               ['Macro', '\\text{ }'],

  //  Specially handled
  not:                'Not',
  dots:               'Dots',
  space:              'Tilde',
  '\u00A0':           'Tilde',


  //  LaTeX
  begin:              'BeginEnd',
  end:                'BeginEnd',

  label:              'HandleLabel',
  ref:                'HandleRef',
  nonumber:           'HandleNoTag',

  // Internal use:
  mathchoice:         'MathChoice',
  mmlToken:           'MmlToken'
}, BaseMethods);


/**
 * Macros for LaTeX environments.
 */
new sm.EnvironmentMap('environment', ParseMethods.environment, {
  array:         ['AlignedArray'],
  equation:      ['Equation', null, true],
  eqnarray:      ['EqnArray', null, true, true, 'rcl',
                  ParseUtil.cols(0, MATHSPACE.thickmathspace), '.5em']
}, BaseMethods);


/**
 * Mapping for negated operators.
 */
new sm.CharacterMap('not_remap', null, {
  '\u2190': '\u219A',
  '\u2192': '\u219B',
  '\u2194': '\u21AE',
  '\u21D0': '\u21CD',
  '\u21D2': '\u21CF',
  '\u21D4': '\u21CE',
  '\u2208': '\u2209',
  '\u220B': '\u220C',
  '\u2223': '\u2224',
  '\u2225': '\u2226',
  '\u223C': '\u2241',
  '\u007E': '\u2241',
  '\u2243': '\u2244',
  '\u2245': '\u2247',
  '\u2248': '\u2249',
  '\u224D': '\u226D',
  '\u003D': '\u2260',
  '\u2261': '\u2262',
  '\u003C': '\u226E',
  '\u003E': '\u226F',
  '\u2264': '\u2270',
  '\u2265': '\u2271',
  '\u2272': '\u2274',
  '\u2273': '\u2275',
  '\u2276': '\u2278',
  '\u2277': '\u2279',
  '\u227A': '\u2280',
  '\u227B': '\u2281',
  '\u2282': '\u2284',
  '\u2283': '\u2285',
  '\u2286': '\u2288',
  '\u2287': '\u2289',
  '\u22A2': '\u22AC',
  '\u22A8': '\u22AD',
  '\u22A9': '\u22AE',
  '\u22AB': '\u22AF',
  '\u227C': '\u22E0',
  '\u227D': '\u22E1',
  '\u2291': '\u22E2',
  '\u2292': '\u22E3',
  '\u22B2': '\u22EA',
  '\u22B3': '\u22EB',
  '\u22B4': '\u22EC',
  '\u22B5': '\u22ED',
  '\u2203': '\u2204'
});
