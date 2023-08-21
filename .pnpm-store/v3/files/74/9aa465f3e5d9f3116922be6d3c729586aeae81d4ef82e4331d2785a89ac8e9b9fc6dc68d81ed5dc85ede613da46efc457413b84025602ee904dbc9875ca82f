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
 * @fileoverview Mappings for the textcomp package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */


import {CommandMap} from '../SymbolMap.js';
import {TexConstant} from '../TexConstants.js';
import {TextMacrosMethods} from '../textmacros/TextMacrosMethods.js';
import TexParser from '../TexParser.js';
import ParseUtil from '../ParseUtil.js';
import {TextParser} from '../textmacros/TextParser.js';


/**
 * Identifiers from the Textcomp package.
 */
new CommandMap('textcomp-macros', {

  // Table 3: Predefined LATEX 2ε Text-Mode Commands
  'textasciicircum':     ['Insert', '\u005E'],
  'textasciitilde':      ['Insert', '\u007E'],
  'textasteriskcentered': ['Insert', '\u002A'],
  'textbackslash':       ['Insert', '\u005C'],
  'textbar':             ['Insert', '\u007C'],
  'textbraceleft':       ['Insert', '\u007B'],
  'textbraceright':      ['Insert', '\u007D'],
  'textbullet':          ['Insert', '\u2022'],
  'textdagger':          ['Insert', '\u2020'],
  'textdaggerdbl':       ['Insert', '\u2021'],
  'textellipsis':        ['Insert', '\u2026'],
  'textemdash':          ['Insert', '\u2014'],
  'textendash':          ['Insert', '\u2013'],
  'textexclamdown':      ['Insert', '\u00A1'],
  'textgreater':         ['Insert', '\u003E'],
  'textless':            ['Insert', '\u003C'],
  'textordfeminine':     ['Insert', '\u00AA'],
  'textordmasculine':    ['Insert', '\u00BA'],
  'textparagraph':       ['Insert', '\u00B6'],
  'textperiodcentered':  ['Insert', '\u00B7'],
  'textquestiondown':    ['Insert', '\u00BF'],
  'textquotedblleft':    ['Insert', '\u201C'],
  'textquotedblright':   ['Insert', '\u201D'],
  'textquoteleft':       ['Insert', '\u2018'],
  'textquoteright':      ['Insert', '\u2019'],
  'textsection':         ['Insert', '\u00A7'],
  'textunderscore':      ['Insert', '\u005F'],
  'textvisiblespace':    ['Insert', '\u2423'],

  // Table 12: textcomp Diacritics
  'textacutedbl':        ['Insert', '\u02DD'],
  'textasciiacute':      ['Insert', '\u00B4'],
  'textasciibreve':      ['Insert', '\u02D8'],
  'textasciicaron':      ['Insert', '\u02C7'],
  'textasciidieresis':   ['Insert', '\u00A8'],
  'textasciimacron':     ['Insert', '\u00AF'],
  'textgravedbl':        ['Insert', '\u02F5'],
  'texttildelow':        ['Insert', '\u02F7'],

  // Table 13: textcomp Currency Symbols
  'textbaht':            ['Insert', '\u0E3F'],
  'textcent':            ['Insert', '\u00A2'],
  'textcolonmonetary':   ['Insert', '\u20A1'],
  'textcurrency':        ['Insert', '\u00A4'],
  'textdollar':          ['Insert', '\u0024'],
  'textdong':            ['Insert', '\u20AB'],
  'texteuro':            ['Insert', '\u20AC'],
  'textflorin':          ['Insert', '\u0192'],
  'textguarani':         ['Insert', '\u20B2'],
  'textlira':            ['Insert', '\u20A4'],
  'textnaira':           ['Insert', '\u20A6'],
  'textpeso':            ['Insert', '\u20B1'],
  'textsterling':        ['Insert', '\u00A3'],
  'textwon':             ['Insert', '\u20A9'],
  'textyen':             ['Insert', '\u00A5'],

  // Table 15: textcomp Legal Symbols
  'textcircledP':        ['Insert', '\u2117'],
  'textcompwordmark':    ['Insert', '\u200C'],
  'textcopyleft':        ['Insert', '\u{1F12F}'],
  'textcopyright':       ['Insert', '\u00A9'],
  'textregistered':      ['Insert', '\u00AE'],
  'textservicemark':     ['Insert', '\u2120'],
  'texttrademark':       ['Insert', '\u2122'],

  // Table 20: Miscellaneous textcomp Symbol
  'textbardbl':          ['Insert', '\u2016'],
  'textbigcircle':       ['Insert', '\u25EF'],
  'textblank':           ['Insert', '\u2422'],
  'textbrokenbar':       ['Insert', '\u00A6'],
  'textdiscount':        ['Insert', '\u2052'],
  'textestimated':       ['Insert', '\u212E'],
  'textinterrobang':     ['Insert', '\u203D'],
  'textinterrobangdown': ['Insert', '\u2E18'],
  'textmusicalnote':     ['Insert', '\u266A'],
  'textnumero':          ['Insert', '\u2116'],
  'textopenbullet':      ['Insert', '\u25E6'],
  'textpertenthousand':  ['Insert', '\u2031'],
  'textperthousand':     ['Insert', '\u2030'],
  'textrecipe':          ['Insert', '\u211E'],
  'textreferencemark':   ['Insert', '\u203B'],
  // 'textthreequartersemdash'
  // 'texttwelveudash'

  // Table 51: textcomp Text-Mode Delimiters
  'textlangle':          ['Insert', '\u2329'],
  'textrangle':          ['Insert', '\u232A'],
  'textlbrackdbl':       ['Insert', '\u27E6'],
  'textrbrackdbl':       ['Insert', '\u27E7'],
  'textlquill':          ['Insert', '\u2045'],
  'textrquill':          ['Insert', '\u2046'],

  // Table 62: textcomp Text-Mode Math and Science Symbols
  'textcelsius':         ['Insert', '\u2103'],
  'textdegree':          ['Insert', '\u00B0'],
  'textdiv':             ['Insert', '\u00F7'],
  'textdownarrow':       ['Insert', '\u2193'],
  'textfractionsolidus': ['Insert', '\u2044'],
  'textleftarrow':       ['Insert', '\u2190'],
  'textlnot':            ['Insert', '\u00AC'],
  'textmho':             ['Insert', '\u2127'],
  'textminus':           ['Insert', '\u2212'],
  'textmu':              ['Insert', '\u00B5'],
  'textohm':             ['Insert', '\u2126'],
  'textonehalf':         ['Insert', '\u00BD'],
  'textonequarter':      ['Insert', '\u00BC'],
  'textonesuperior':     ['Insert', '\u00B9'],
  'textpm':              ['Insert', '\u00B1'],
  'textrightarrow':      ['Insert', '\u2192'],
  'textsurd':            ['Insert', '\u221A'],
  'textthreequarters':   ['Insert', '\u00BE'],
  'textthreesuperior':   ['Insert', '\u00B3'],
  'texttimes':           ['Insert', '\u00D7'],
  'texttwosuperior':     ['Insert', '\u00B2'],
  'textuparrow':         ['Insert', '\u2191'],

  // Table 110: textcomp Genealogical Symbols
  'textborn':            ['Insert', '\u002A'],
  'textdied':            ['Insert', '\u2020'],
  'textdivorced':        ['Insert', '\u26AE'],
  //  'textleaf'
  'textmarried':         ['Insert', '\u26AD'],

  // This is not the correct glyph
  'textcentoldstyle':    ['Insert', '\u00A2', TexConstant.Variant.OLDSTYLE],
  // This is not the correct glyph
  'textdollaroldstyle':  ['Insert', '\u0024', TexConstant.Variant.OLDSTYLE],

  // Table 16: textcomp Old-Style Numerals
  'textzerooldstyle':    ['Insert', '0', TexConstant.Variant.OLDSTYLE],
  'textoneoldstyle':     ['Insert', '1', TexConstant.Variant.OLDSTYLE],
  'texttwooldstyle':     ['Insert', '2', TexConstant.Variant.OLDSTYLE],
  'textthreeoldstyle':   ['Insert', '3', TexConstant.Variant.OLDSTYLE],
  'textfouroldstyle':    ['Insert', '4', TexConstant.Variant.OLDSTYLE],
  'textfiveoldstyle':    ['Insert', '5', TexConstant.Variant.OLDSTYLE],
  'textsixoldstyle':     ['Insert', '6', TexConstant.Variant.OLDSTYLE],
  'textsevenoldstyle':   ['Insert', '7', TexConstant.Variant.OLDSTYLE],
  'texteightoldstyle':   ['Insert', '8', TexConstant.Variant.OLDSTYLE],
  'textnineoldstyle':    ['Insert', '9', TexConstant.Variant.OLDSTYLE]
}, {
  Insert: function(parser: TexParser, name: string, c: string, font: string) {
    if (parser instanceof TextParser) {
      if (!font) {
        TextMacrosMethods.Insert(parser, name, c);
        return;
      }
      parser.saveText();
    }
    parser.Push(ParseUtil.internalText(
      parser, c, font ? {mathvariant: font} : {}));
  }
});
