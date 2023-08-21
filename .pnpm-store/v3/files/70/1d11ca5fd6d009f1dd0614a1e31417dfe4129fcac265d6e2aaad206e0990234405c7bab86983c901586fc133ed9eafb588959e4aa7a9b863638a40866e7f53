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
 * @fileoverview  Defines the operator dictionary structure
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {PropertyList} from '../Tree/Node.js';
import {TEXCLASS} from './MmlNode.js';

/**
 * Types needed for the operator dictionary
 */
export type OperatorDef = [number, number, number, PropertyList];
export type OperatorList = {[name: string]: OperatorDef};
export type RangeDef = [number, number, number, string, string?];

/**
 * @param {number} lspace            The operator's MathML left-hand spacing
 * @param {number} rspace            The operator's MathML right-hand spacing
 * @param {number} texClass          The default TeX class for the operator
 * @param {PropertyList} properties  Any default properties from the operator dictionary
 * @return {OperatorDef}             The operator definition array
 */
export function OPDEF(lspace: number, rspace: number, texClass: number = TEXCLASS.BIN,
                      properties: PropertyList = null): OperatorDef {
                        return [lspace, rspace, texClass, properties] as OperatorDef;
                      }

/**
 *  The various kinds of operators in the dictionary
 */
export const MO = {
  ORD:        OPDEF(0, 0, TEXCLASS.ORD),
  ORD11:      OPDEF(1, 1, TEXCLASS.ORD),
  ORD21:      OPDEF(2, 1, TEXCLASS.ORD),
  ORD02:      OPDEF(0, 2, TEXCLASS.ORD),
  ORD55:      OPDEF(5, 5, TEXCLASS.ORD),
  NONE:       OPDEF(0, 0, TEXCLASS.NONE),
  OP:         OPDEF(1, 2, TEXCLASS.OP, {largeop: true, movablelimits: true, symmetric: true}),
  OPFIXED:    OPDEF(1, 2, TEXCLASS.OP, {largeop: true, movablelimits: true}),
  INTEGRAL:   OPDEF(0, 1, TEXCLASS.OP, {largeop: true, symmetric: true}),
  INTEGRAL2:  OPDEF(1, 2, TEXCLASS.OP, {largeop: true, symmetric: true}),
  BIN3:       OPDEF(3, 3, TEXCLASS.BIN),
  BIN4:       OPDEF(4, 4, TEXCLASS.BIN),
  BIN01:      OPDEF(0, 1, TEXCLASS.BIN),
  BIN5:       OPDEF(5, 5, TEXCLASS.BIN),
  TALLBIN:    OPDEF(4, 4, TEXCLASS.BIN, {stretchy: true}),
  BINOP:      OPDEF(4, 4, TEXCLASS.BIN, {largeop: true, movablelimits: true}),
  REL:        OPDEF(5, 5, TEXCLASS.REL),
  REL1:       OPDEF(1, 1, TEXCLASS.REL, {stretchy: true}),
  REL4:       OPDEF(4, 4, TEXCLASS.REL),
  RELSTRETCH: OPDEF(5, 5, TEXCLASS.REL, {stretchy: true}),
  RELACCENT:  OPDEF(5, 5, TEXCLASS.REL, {accent: true}),
  WIDEREL:    OPDEF(5, 5, TEXCLASS.REL, {accent: true, stretchy: true}),
  OPEN:       OPDEF(0, 0, TEXCLASS.OPEN, {fence: true, stretchy: true, symmetric: true}),
  CLOSE:      OPDEF(0, 0, TEXCLASS.CLOSE, {fence: true, stretchy: true, symmetric: true}),
  INNER:      OPDEF(0, 0, TEXCLASS.INNER),
  PUNCT:      OPDEF(0, 3, TEXCLASS.PUNCT),
  ACCENT:     OPDEF(0, 0, TEXCLASS.ORD, {accent: true}),
  WIDEACCENT: OPDEF(0, 0, TEXCLASS.ORD, {accent: true, stretchy: true})
};

/**
 *  The default TeX classes for the various unicode blocks, and their names
 */
export const RANGES: RangeDef[] = [
  [0x0020, 0x007F, TEXCLASS.REL, 'mo'], // Basic Latin
  [0x00A0, 0x00BF, TEXCLASS.ORD, 'mo'], // Latin-1 Supplement symbols
  [0x00C0, 0x024F, TEXCLASS.ORD, 'mi'], // Latin-1 Supplement, Latin Extended-A, Latin Extended-B
  [0x02B0, 0x036F, TEXCLASS.ORD, 'mo'], // Spacing modifier letters, Combining Diacritical Marks
  [0x0370, 0x1A20, TEXCLASS.ORD, 'mi'], // Greek and Coptic (through) Tai Tham
  [0x1AB0, 0x1AFF, TEXCLASS.ORD, 'mo'], // Combining Diacritical Marks Extended
  [0x1B00, 0x1DBF, TEXCLASS.ORD, 'mi'], // Balinese (through) Phonetic Extensions Supplement
  [0x1DC0, 0x1DFF, TEXCLASS.ORD, 'mo'], // Combining Diacritical Marks Supplement
  [0x1E00, 0x1FFF, TEXCLASS.ORD, 'mi'], // Latin Extended Additional, Greek Extended
  [0x2000, 0x206F, TEXCLASS.ORD, 'mo'], // General Punctuation
  [0x2070, 0x209F, TEXCLASS.ORD, 'mo'], // Superscript and Subscripts (through) Combining Diacritical Marks for Symbols
  [0x2100, 0x214F, TEXCLASS.ORD, 'mi'], // Letterlike Symbols
  [0x2150, 0x218F, TEXCLASS.ORD, 'mn'], // Number Forms
  [0x2190, 0x21FF, TEXCLASS.REL, 'mo'], // Arrows
  [0x2200, 0x22FF, TEXCLASS.BIN, 'mo'], // Mathematical Operators
  [0x2300, 0x23FF, TEXCLASS.ORD, 'mo'], // Miscellaneous Technical
  [0x2460, 0x24FF, TEXCLASS.ORD, 'mn'], // Enclosed Alphanumerics
  [0x2500, 0x27EF, TEXCLASS.ORD, 'mo'], // Box Drawing (though) Miscellaneous Math Symbols-A
  [0x27F0, 0x27FF, TEXCLASS.REL, 'mo'], // Supplemental Arrows-A
  [0x2800, 0x28FF, TEXCLASS.ORD, 'mtext'], // Braille Patterns
  [0x2900, 0x297F, TEXCLASS.REL, 'mo'], // Supplemental Arrows-B
  [0x2980, 0x29FF, TEXCLASS.ORD, 'mo'], // Miscellaneous Math Symbols-B
  [0x2A00, 0x2AFF, TEXCLASS.BIN, 'mo'], // Supplemental Math Operators
  [0x2B00, 0x2B2F, TEXCLASS.ORD, 'mo'], // Miscellaneous Symbols and Arrows
  [0x2B30, 0x2B4F, TEXCLASS.REL, 'mo'], //   Arrows from above
  [0x2B50, 0x2BFF, TEXCLASS.ORD, 'mo'], //   Rest of above
  [0x2C00, 0x2DE0, TEXCLASS.ORD, 'mi'], // Glagolitic (through) Ethipoc Extended
  [0x2E00, 0x2E7F, TEXCLASS.ORD, 'mo'], // Supplemental Punctuation
  [0x2E80, 0x2FDF, TEXCLASS.ORD, 'mi', 'normal'], // CJK Radicals Supplement (through) Kangxi Radicals
  [0x2FF0, 0x303F, TEXCLASS.ORD, 'mo'], // Ideographic Desc. Characters, CJK Symbols and Punctuation
  [0x3040, 0xA49F, TEXCLASS.ORD, 'mi', 'normal'], // Hiragana (through) Yi Radicals
  [0xA4D0, 0xA82F, TEXCLASS.ORD, 'mi'], // Lisu (through) Syloti Nagri
  [0xA830, 0xA83F, TEXCLASS.ORD, 'mn'], // Common Indic Number FormsArabic Presentation Forms-A
  [0xA840, 0xD7FF, TEXCLASS.ORD, 'mi'], // Phags-pa (though) Hangul Jamo Extended-B
  [0xF900, 0xFAFF, TEXCLASS.ORD, 'mi', 'normal'], // CJK Compatibility Ideographs
  [0xFB00, 0xFDFF, TEXCLASS.ORD, 'mi'], // Alphabetic Presentation Forms (though) Arabic Presentation Forms-A
  [0xFE00, 0xFE6F, TEXCLASS.ORD, 'mo'], // Variation Selector (through) Small Form Variants
  [0xFE70, 0x100FF, TEXCLASS.ORD, 'mi'], // Arabic Presentation Forms-B (through) Linear B Ideograms
  [0x10100, 0x1018F, TEXCLASS.ORD, 'mn'], // Aegean Numbers, Ancient Greek Numbers
  [0x10190, 0x123FF, TEXCLASS.ORD, 'mi', 'normal'], // Ancient Symbols (through) Cuneiform
  [0x12400, 0x1247F, TEXCLASS.ORD, 'mn'], // Cuneiform Numbers and Punctuation
  [0x12480, 0x1BC9F, TEXCLASS.ORD, 'mi', 'normal'], // Early Dynastic Cuneiform (through) Duployan
  [0x1BCA0, 0x1D25F, TEXCLASS.ORD, 'mo'], // Shorthand Format Controls (through) TaiXuan Jing Symbols
  [0x1D360, 0x1D37F, TEXCLASS.ORD, 'mn'], // Counting Rod Numerals
  [0x1D400, 0x1D7CD, TEXCLASS.ORD, 'mi'], // Math Alphanumeric Symbols
  [0x1D7CE, 0x1D7FF, TEXCLASS.ORD, 'mn'], //   Numerals from above
  [0x1DF00, 0x1F7FF, TEXCLASS.ORD, 'mo'], // Mahjong Tiles (through) Geometric Shapes Extended
  [0x1F800, 0x1F8FF, TEXCLASS.REL, 'mo'], // Supplemental Arrows-C
  [0x1F900, 0x1F9FF, TEXCLASS.ORD, 'mo'], // Supplemental Symbols and Pictographs
  [0x20000, 0x2FA1F, TEXCLASS.ORD, 'mi', 'normnal'], // CJK Unified Ideographs Ext. B (through) CJK Sompatibility Ideographs Supp.
];

/**
 * Get the Unicode range for the first character of a string
 *
 * @param {string} text      The character to check
 * @return {RangeDef|null}   The range containing that character, or null
 */
export function getRange(text: string): RangeDef | null {
  const n = text.codePointAt(0);
  for (const range of RANGES) {
    if (n <= range[1]) {
      if (n >= range[0]) {
        return range;
      }
      break;
    }
  }
  return null;
}

/**
 * The default MathML spacing for the various TeX classes.
 */
export const MMLSPACING = [
  [0, 0],  // ORD
  [1, 2],  // OP
  [3, 3],  // BIN
  [4, 4],  // REL
  [0, 0],  // OPEN
  [0, 0],  // CLOSE
  [0, 3]   // PUNCT
];

/**
 *  The operator dictionary, with sections for the three forms:  prefix, postfix, and infix
 */
export const OPTABLE: {[form: string]: OperatorList} = {
  prefix: {
    '(': MO.OPEN,            // left parenthesis
    '+': MO.BIN01,           // plus sign
    '-': MO.BIN01,           // hyphen-minus
    '[': MO.OPEN,            // left square bracket
    '{': MO.OPEN,            // left curly bracket
    '|': MO.OPEN,            // vertical line
    '||': [0, 0, TEXCLASS.BIN, {fence: true, stretchy: true, symmetric: true}], // multiple character operator: ||
    '|||': [0, 0, TEXCLASS.ORD, {fence: true, stretchy: true, symmetric: true}], // multiple character operator: |||
    '\u00AC': MO.ORD21,      // not sign
    '\u00B1': MO.BIN01,      // plus-minus sign
    '\u2016': [0, 0, TEXCLASS.ORD, {fence: true, stretchy: true}], // double vertical line
    '\u2018': [0, 0, TEXCLASS.OPEN, {fence: true}], // left single quotation mark
    '\u201C': [0, 0, TEXCLASS.OPEN, {fence: true}], // left double quotation mark
    '\u2145': MO.ORD21,      // double-struck italic capital d
    '\u2146': OPDEF(2, 0, TEXCLASS.ORD),  // double-struck italic small d
    '\u2200': MO.ORD21,      // for all
    '\u2202': MO.ORD21,      // partial differential
    '\u2203': MO.ORD21,      // there exists
    '\u2204': MO.ORD21,      // there does not exist
    '\u2207': MO.ORD21,      // nabla
    '\u220F': MO.OP,         // n-ary product
    '\u2210': MO.OP,         // n-ary coproduct
    '\u2211': MO.OP,         // n-ary summation
    '\u2212': MO.BIN01,      // minus sign
    '\u2213': MO.BIN01,      // minus-or-plus sign
    '\u221A': [1, 1, TEXCLASS.ORD, {stretchy: true}], // square root
    '\u221B': MO.ORD11,      // cube root
    '\u221C': MO.ORD11,      // fourth root
    '\u2220': MO.ORD,        // angle
    '\u2221': MO.ORD,        // measured angle
    '\u2222': MO.ORD,        // spherical angle
    '\u222B': MO.INTEGRAL,   // integral
    '\u222C': MO.INTEGRAL,   // double integral
    '\u222D': MO.INTEGRAL,   // triple integral
    '\u222E': MO.INTEGRAL,   // contour integral
    '\u222F': MO.INTEGRAL,   // surface integral
    '\u2230': MO.INTEGRAL,   // volume integral
    '\u2231': MO.INTEGRAL,   // clockwise integral
    '\u2232': MO.INTEGRAL,   // clockwise contour integral
    '\u2233': MO.INTEGRAL,   // anticlockwise contour integral
    '\u22C0': MO.OP,         // n-ary logical and
    '\u22C1': MO.OP,         // n-ary logical or
    '\u22C2': MO.OP,         // n-ary intersection
    '\u22C3': MO.OP,         // n-ary union
    '\u2308': MO.OPEN,       // left ceiling
    '\u230A': MO.OPEN,       // left floor
    '\u2329': MO.OPEN,       // left-pointing angle bracket
    '\u2772': MO.OPEN,       // light left tortoise shell bracket ornament
    '\u27E6': MO.OPEN,       // mathematical left white square bracket
    '\u27E8': MO.OPEN,       // mathematical left angle bracket
    '\u27EA': MO.OPEN,       // mathematical left double angle bracket
    '\u27EC': MO.OPEN,       // mathematical left white tortoise shell bracket
    '\u27EE': MO.OPEN,       // mathematical left flattened parenthesis
    '\u2980': [0, 0, TEXCLASS.ORD, {fence: true, stretchy: true}], // triple vertical bar delimiter
    '\u2983': MO.OPEN,       // left white curly bracket
    '\u2985': MO.OPEN,       // left white parenthesis
    '\u2987': MO.OPEN,       // z notation left image bracket
    '\u2989': MO.OPEN,       // z notation left binding bracket
    '\u298B': MO.OPEN,       // left square bracket with underbar
    '\u298D': MO.OPEN,       // left square bracket with tick in top corner
    '\u298F': MO.OPEN,       // left square bracket with tick in bottom corner
    '\u2991': MO.OPEN,       // left angle bracket with dot
    '\u2993': MO.OPEN,       // left arc less-than bracket
    '\u2995': MO.OPEN,       // double left arc greater-than bracket
    '\u2997': MO.OPEN,       // left black tortoise shell bracket
    '\u29FC': MO.OPEN,       // left-pointing curved angle bracket
    '\u2A00': MO.OP,         // n-ary circled dot operator
    '\u2A01': MO.OP,         // n-ary circled plus operator
    '\u2A02': MO.OP,         // n-ary circled times operator
    '\u2A03': MO.OP,         // n-ary union operator with dot
    '\u2A04': MO.OP,         // n-ary union operator with plus
    '\u2A05': MO.OP,         // n-ary square intersection operator
    '\u2A06': MO.OP,         // n-ary square union operator
    '\u2A07': MO.OP,         // two logical and operator
    '\u2A08': MO.OP,         // two logical or operator
    '\u2A09': MO.OP,         // n-ary times operator
    '\u2A0A': MO.OP,         // modulo two sum
    '\u2A0B': MO.INTEGRAL2,  // summation with integral
    '\u2A0C': MO.INTEGRAL,   // quadruple integral operator
    '\u2A0D': MO.INTEGRAL2,  // finite part integral
    '\u2A0E': MO.INTEGRAL2,  // integral with double stroke
    '\u2A0F': MO.INTEGRAL2,  // integral average with slash
    '\u2A10': MO.OP,         // circulation function
    '\u2A11': MO.OP,         // anticlockwise integration
    '\u2A12': MO.OP,         // line integration with rectangular path around pole
    '\u2A13': MO.OP,         // line integration with semicircular path around pole
    '\u2A14': MO.OP,         // line integration not including the pole
    '\u2A15': MO.INTEGRAL2,  // integral around a point operator
    '\u2A16': MO.INTEGRAL2,  // quaternion integral operator
    '\u2A17': MO.INTEGRAL2,  // integral with leftwards arrow with hook
    '\u2A18': MO.INTEGRAL2,  // integral with times sign
    '\u2A19': MO.INTEGRAL2,  // integral with intersection
    '\u2A1A': MO.INTEGRAL2,  // integral with union
    '\u2A1B': MO.INTEGRAL2,  // integral with overbar
    '\u2A1C': MO.INTEGRAL2,  // integral with underbar
    '\u2AFC': MO.OP,         // large triple vertical bar operator
    '\u2AFF': MO.OP,         // n-ary white vertical bar
  },
  postfix: {
    '!!': OPDEF(1, 0),       // multiple character operator: !!
    '!': [1, 0, TEXCLASS.CLOSE, null], // exclamation mark
    '"': MO.ACCENT,          // quotation mark
    '&': MO.ORD,             // ampersand
    ')': MO.CLOSE,           // right parenthesis
    '++': OPDEF(0, 0),       // multiple character operator: ++
    '--': OPDEF(0, 0),       // multiple character operator: --
    '..': OPDEF(0, 0),       // multiple character operator: ..
    '...': MO.ORD,           // multiple character operator: ...
    '\'': MO.ACCENT,         // apostrophe
    ']': MO.CLOSE,           // right square bracket
    '^': MO.WIDEACCENT,      // circumflex accent
    '_': MO.WIDEACCENT,      // low line
    '`': MO.ACCENT,          // grave accent
    '|': MO.CLOSE,           // vertical line
    '}': MO.CLOSE,           // right curly bracket
    '~': MO.WIDEACCENT,      // tilde
    '||': [0, 0, TEXCLASS.BIN, {fence: true, stretchy: true, symmetric: true}], // multiple character operator: ||
    '|||': [0, 0, TEXCLASS.ORD, {fence: true, stretchy: true, symmetric: true}], // multiple character operator: |||
    '\u00A8': MO.ACCENT,     // diaeresis
    '\u00AA': MO.ACCENT,     // feminie ordinal indicator
    '\u00AF': MO.WIDEACCENT, // macron
    '\u00B0': MO.ORD,        // degree sign
    '\u00B2': MO.ACCENT,     // superscript 2
    '\u00B3': MO.ACCENT,     // superscript 3
    '\u00B4': MO.ACCENT,     // acute accent
    '\u00B8': MO.ACCENT,     // cedilla
    '\u00B9': MO.ACCENT,     // superscript 1
    '\u00BA': MO.ACCENT,     // masculine ordinal indicator
    '\u02C6': MO.WIDEACCENT, // modifier letter circumflex accent
    '\u02C7': MO.WIDEACCENT, // caron
    '\u02C9': MO.WIDEACCENT, // modifier letter macron
    '\u02CA': MO.ACCENT,     // modifier letter acute accent
    '\u02CB': MO.ACCENT,     // modifier letter grave accent
    '\u02CD': MO.WIDEACCENT, // modifier letter low macron
    '\u02D8': MO.ACCENT,     // breve
    '\u02D9': MO.ACCENT,     // dot above
    '\u02DA': MO.ACCENT,     // ring above
    '\u02DC': MO.WIDEACCENT, // small tilde
    '\u02DD': MO.ACCENT,     // double acute accent
    '\u02F7': MO.WIDEACCENT, // modifier letter low tilde
    '\u0302': MO.WIDEACCENT, // combining circumflex accent
    '\u0311': MO.ACCENT,     // combining inverted breve
    '\u03F6': MO.REL,        // greek reversed lunate epsilon symbol
    '\u2016': [0, 0, TEXCLASS.ORD, {fence: true, stretchy: true}], // double vertical line
    '\u2019': [0, 0, TEXCLASS.CLOSE, {fence: true}], // right single quotation mark
    '\u201A': MO.ACCENT,     // single low-9 quotation mark
    '\u201B': MO.ACCENT,     // single high-reversed-9 quotation mark
    '\u201D': [0, 0, TEXCLASS.CLOSE, {fence: true}],  // right double quotation mark
    '\u201E': MO.ACCENT,     // double low-9 quotation mark
    '\u201F': MO.ACCENT,     // double high-reversed-9 quotation mark
    '\u2032': MO.ORD,        // prime
    '\u2033': MO.ACCENT,     // double prime
    '\u2034': MO.ACCENT,     // triple prime
    '\u2035': MO.ACCENT,     // reversed prime
    '\u2036': MO.ACCENT,     // reversed double prime
    '\u2037': MO.ACCENT,     // reversed triple prime
    '\u203E': MO.WIDEACCENT, // overline
    '\u2057': MO.ACCENT,     // quadruple prime
    '\u20DB': MO.ACCENT,     // combining three dots above
    '\u20DC': MO.ACCENT,     // combining four dots above
    '\u2309': MO.CLOSE,      // right ceiling
    '\u230B': MO.CLOSE,      // right floor
    '\u232A': MO.CLOSE,      // right-pointing angle bracket
    '\u23B4': MO.WIDEACCENT, // top square bracket
    '\u23B5': MO.WIDEACCENT, // bottom square bracket
    '\u23DC': MO.WIDEACCENT, // top parenthesis
    '\u23DD': MO.WIDEACCENT, // bottom parenthesis
    '\u23DE': MO.WIDEACCENT, // top curly bracket
    '\u23DF': MO.WIDEACCENT, // bottom curly bracket
    '\u23E0': MO.WIDEACCENT, // top tortoise shell bracket
    '\u23E1': MO.WIDEACCENT, // bottom tortoise shell bracket
    '\u25A0': MO.BIN3,       // black square
    '\u25A1': MO.BIN3,       // white square
    '\u25AA': MO.BIN3,       // black small square
    '\u25AB': MO.BIN3,       // white small square
    '\u25AD': MO.BIN3,       // white rectangle
    '\u25AE': MO.BIN3,       // black vertical rectangle
    '\u25AF': MO.BIN3,       // white vertical rectangle
    '\u25B0': MO.BIN3,       // black parallelogram
    '\u25B1': MO.BIN3,       // white parallelogram
    '\u25B2': MO.BIN4,       // black up-pointing triangle
    '\u25B4': MO.BIN4,       // black up-pointing small triangle
    '\u25B6': MO.BIN4,       // black right-pointing triangle
    '\u25B7': MO.BIN4,       // white right-pointing triangle
    '\u25B8': MO.BIN4,       // black right-pointing small triangle
    '\u25BC': MO.BIN4,       // black down-pointing triangle
    '\u25BE': MO.BIN4,       // black down-pointing small triangle
    '\u25C0': MO.BIN4,       // black left-pointing triangle
    '\u25C1': MO.BIN4,       // white left-pointing triangle
    '\u25C2': MO.BIN4,       // black left-pointing small triangle
    '\u25C4': MO.BIN4,       // black left-pointing pointer
    '\u25C5': MO.BIN4,       // white left-pointing pointer
    '\u25C6': MO.BIN4,       // black diamond
    '\u25C7': MO.BIN4,       // white diamond
    '\u25C8': MO.BIN4,       // white diamond containing black small diamond
    '\u25C9': MO.BIN4,       // fisheye
    '\u25CC': MO.BIN4,       // dotted circle
    '\u25CD': MO.BIN4,       // circle with vertical fill
    '\u25CE': MO.BIN4,       // bullseye
    '\u25CF': MO.BIN4,       // black circle
    '\u25D6': MO.BIN4,       // left half black circle
    '\u25D7': MO.BIN4,       // right half black circle
    '\u25E6': MO.BIN4,       // white bullet
    '\u266D': MO.ORD02,      // music flat sign
    '\u266E': MO.ORD02,      // music natural sign
    '\u266F': MO.ORD02,      // music sharp sign
    '\u2773': MO.CLOSE,      // light right tortoise shell bracket ornament
    '\u27E7': MO.CLOSE,      // mathematical right white square bracket
    '\u27E9': MO.CLOSE,      // mathematical right angle bracket
    '\u27EB': MO.CLOSE,      // mathematical right double angle bracket
    '\u27ED': MO.CLOSE,      // mathematical right white tortoise shell bracket
    '\u27EF': MO.CLOSE,      // mathematical right flattened parenthesis
    '\u2980': [0, 0, TEXCLASS.ORD, {fence: true, stretchy: true}], // triple vertical bar delimiter
    '\u2984': MO.CLOSE,      // right white curly bracket
    '\u2986': MO.CLOSE,      // right white parenthesis
    '\u2988': MO.CLOSE,      // z notation right image bracket
    '\u298A': MO.CLOSE,      // z notation right binding bracket
    '\u298C': MO.CLOSE,      // right square bracket with underbar
    '\u298E': MO.CLOSE,      // right square bracket with tick in bottom corner
    '\u2990': MO.CLOSE,      // right square bracket with tick in top corner
    '\u2992': MO.CLOSE,      // right angle bracket with dot
    '\u2994': MO.CLOSE,      // right arc greater-than bracket
    '\u2996': MO.CLOSE,      // double right arc less-than bracket
    '\u2998': MO.CLOSE,      // right black tortoise shell bracket
    '\u29FD': MO.CLOSE,      // right-pointing curved angle bracket
  },
  infix: {
    '!=': MO.BIN4,           // multiple character operator: !=
    '#': MO.ORD,             // #
    '$': MO.ORD,             // $
    '%': [3, 3, TEXCLASS.ORD, null], // percent sign
    '&&': MO.BIN4,           // multiple character operator: &&
    '': MO.ORD,              // empty <mo>
    '*': MO.BIN3,            // asterisk
    '**': OPDEF(1, 1),       // multiple character operator: **
    '*=': MO.BIN4,           // multiple character operator: *=
    '+': MO.BIN4,            // plus sign
    '+=': MO.BIN4,           // multiple character operator: +=
    ',': [0, 3, TEXCLASS.PUNCT, {linebreakstyle: 'after', separator: true}], // comma
    '-': MO.BIN4,            // hyphen-minus
    '-=': MO.BIN4,           // multiple character operator: -=
    '->': MO.BIN5,           // multiple character operator: ->
    '.': [0, 3, TEXCLASS.PUNCT, {separator: true}], // \ldotp
    '/': MO.ORD11,           // solidus
    '//': OPDEF(1, 1),       // multiple character operator: //
    '/=': MO.BIN4,           // multiple character operator: /=
    ':': [1, 2, TEXCLASS.REL, null], // colon
    ':=': MO.BIN4,           // multiple character operator: :=
    ';': [0, 3, TEXCLASS.PUNCT, {linebreakstyle: 'after', separator: true}], // semicolon
    '<': MO.REL,             // less-than sign
    '<=': MO.BIN5,           // multiple character operator: <=
    '<>': OPDEF(1, 1),       // multiple character operator: <>
    '=': MO.REL,             // equals sign
    '==': MO.BIN4,           // multiple character operator: ==
    '>': MO.REL,             // greater-than sign
    '>=': MO.BIN5,           // multiple character operator: >=
    '?': [1, 1, TEXCLASS.CLOSE, null], // question mark
    '@': MO.ORD11,           // commercial at
    '\\': MO.ORD,            // reverse solidus
    '^': MO.ORD11,           // circumflex accent
    '_': MO.ORD11,           // low line
    '|': [2, 2, TEXCLASS.ORD, {fence: true, stretchy: true, symmetric: true}], // vertical line
    '||': [2, 2, TEXCLASS.BIN, {fence: true, stretchy: true, symmetric: true}], // multiple character operator: ||
    '|||': [2, 2, TEXCLASS.ORD, {fence: true, stretchy: true, symmetric: true}], // multiple character operator: |||
    '\u00B1': MO.BIN4,       // plus-minus sign
    '\u00B7': MO.BIN4,       // middle dot
    '\u00D7': MO.BIN4,       // multiplication sign
    '\u00F7': MO.BIN4,       // division sign
    '\u02B9': MO.ORD,        // prime
    '\u0300': MO.ACCENT,     // \grave
    '\u0301': MO.ACCENT,     // \acute
    '\u0303': MO.WIDEACCENT, // \tilde
    '\u0304': MO.ACCENT,     // \bar
    '\u0306': MO.ACCENT,     // \breve
    '\u0307': MO.ACCENT,     // \dot
    '\u0308': MO.ACCENT,     // \ddot
    '\u030C': MO.ACCENT,     // \check
    '\u0332': MO.WIDEACCENT, // horizontal line
    '\u0338': MO.REL4,       // \not
    '\u2015': [0, 0, TEXCLASS.ORD, {stretchy: true}], // horizontal line
    '\u2017': [0, 0, TEXCLASS.ORD, {stretchy: true}], // horizontal line
    '\u2020': MO.BIN3,       // \dagger
    '\u2021': MO.BIN3,       // \ddagger
    '\u2022': MO.BIN4,       // bullet
    '\u2026': MO.INNER,      // horizontal ellipsis
    '\u2043': MO.BIN4,       // hyphen bullet
    '\u2044': MO.TALLBIN,    // fraction slash
    '\u2061': MO.NONE,       // function application
    '\u2062': MO.NONE,       // invisible times
    '\u2063': [0, 0, TEXCLASS.NONE, {linebreakstyle: 'after', separator: true}], // invisible separator
    '\u2064': MO.NONE,       // invisible plus
    '\u20D7': MO.ACCENT,     // \vec
    '\u2111': MO.ORD,        // \Im
    '\u2113': MO.ORD,        // \ell
    '\u2118': MO.ORD,        // \wp
    '\u211C': MO.ORD,        // \Re
    '\u2190': MO.WIDEREL,    // leftwards arrow
    '\u2191': MO.RELSTRETCH, // upwards arrow
    '\u2192': MO.WIDEREL,    // rightwards arrow
    '\u2193': MO.RELSTRETCH, // downwards arrow
    '\u2194': MO.WIDEREL,    // left right arrow
    '\u2195': MO.RELSTRETCH, // up down arrow
    '\u2196': MO.RELSTRETCH, // north west arrow
    '\u2197': MO.RELSTRETCH, // north east arrow
    '\u2198': MO.RELSTRETCH, // south east arrow
    '\u2199': MO.RELSTRETCH, // south west arrow
    '\u219A': MO.RELACCENT,  // leftwards arrow with stroke
    '\u219B': MO.RELACCENT,  // rightwards arrow with stroke
    '\u219C': MO.WIDEREL,    // leftwards wave arrow
    '\u219D': MO.WIDEREL,    // rightwards wave arrow
    '\u219E': MO.WIDEREL,    // leftwards two headed arrow
    '\u219F': MO.WIDEREL,    // upwards two headed arrow
    '\u21A0': MO.WIDEREL,    // rightwards two headed arrow
    '\u21A1': MO.RELSTRETCH, // downwards two headed arrow
    '\u21A2': MO.WIDEREL,    // leftwards arrow with tail
    '\u21A3': MO.WIDEREL,    // rightwards arrow with tail
    '\u21A4': MO.WIDEREL,    // leftwards arrow from bar
    '\u21A5': MO.RELSTRETCH, // upwards arrow from bar
    '\u21A6': MO.WIDEREL,    // rightwards arrow from bar
    '\u21A7': MO.RELSTRETCH, // downwards arrow from bar
    '\u21A8': MO.RELSTRETCH, // up down arrow with base
    '\u21A9': MO.WIDEREL,    // leftwards arrow with hook
    '\u21AA': MO.WIDEREL,    // rightwards arrow with hook
    '\u21AB': MO.WIDEREL,    // leftwards arrow with loop
    '\u21AC': MO.WIDEREL,    // rightwards arrow with loop
    '\u21AD': MO.WIDEREL,    // left right wave arrow
    '\u21AE': MO.RELACCENT,  // left right arrow with stroke
    '\u21AF': MO.RELSTRETCH, // downwards zigzag arrow
    '\u21B0': MO.RELSTRETCH, // upwards arrow with tip leftwards
    '\u21B1': MO.RELSTRETCH, // upwards arrow with tip rightwards
    '\u21B2': MO.RELSTRETCH, // downwards arrow with tip leftwards
    '\u21B3': MO.RELSTRETCH, // downwards arrow with tip rightwards
    '\u21B4': MO.RELSTRETCH, // rightwards arrow with corner downwards
    '\u21B5': MO.RELSTRETCH, // downwards arrow with corner leftwards
    '\u21B6': MO.RELACCENT,  // anticlockwise top semicircle arrow
    '\u21B7': MO.RELACCENT,  // clockwise top semicircle arrow
    '\u21B8': MO.REL,        // north west arrow to long bar
    '\u21B9': MO.WIDEREL,    // leftwards arrow to bar over rightwards arrow to bar
    '\u21BA': MO.REL,        // anticlockwise open circle arrow
    '\u21BB': MO.REL,        // clockwise open circle arrow
    '\u21BC': MO.WIDEREL,    // leftwards harpoon with barb upwards
    '\u21BD': MO.WIDEREL,    // leftwards harpoon with barb downwards
    '\u21BE': MO.RELSTRETCH, // upwards harpoon with barb rightwards
    '\u21BF': MO.RELSTRETCH, // upwards harpoon with barb leftwards
    '\u21C0': MO.WIDEREL,    // rightwards harpoon with barb upwards
    '\u21C1': MO.WIDEREL,    // rightwards harpoon with barb downwards
    '\u21C2': MO.RELSTRETCH, // downwards harpoon with barb rightwards
    '\u21C3': MO.RELSTRETCH, // downwards harpoon with barb leftwards
    '\u21C4': MO.WIDEREL,    // rightwards arrow over leftwards arrow
    '\u21C5': MO.RELSTRETCH, // upwards arrow leftwards of downwards arrow
    '\u21C6': MO.WIDEREL,    // leftwards arrow over rightwards arrow
    '\u21C7': MO.WIDEREL,    // leftwards paired arrows
    '\u21C8': MO.RELSTRETCH, // upwards paired arrows
    '\u21C9': MO.WIDEREL,    // rightwards paired arrows
    '\u21CA': MO.RELSTRETCH, // downwards paired arrows
    '\u21CB': MO.WIDEREL,    // leftwards harpoon over rightwards harpoon
    '\u21CC': MO.WIDEREL,    // rightwards harpoon over leftwards harpoon
    '\u21CD': MO.RELACCENT,  // leftwards double arrow with stroke
    '\u21CE': MO.RELACCENT,  // left right double arrow with stroke
    '\u21CF': MO.RELACCENT,  // rightwards double arrow with stroke
    '\u21D0': MO.WIDEREL,    // leftwards double arrow
    '\u21D1': MO.RELSTRETCH, // upwards double arrow
    '\u21D2': MO.WIDEREL,    // rightwards double arrow
    '\u21D3': MO.RELSTRETCH, // downwards double arrow
    '\u21D4': MO.WIDEREL,    // left right double arrow
    '\u21D5': MO.RELSTRETCH, // up down double arrow
    '\u21D6': MO.RELSTRETCH, // north west double arrow
    '\u21D7': MO.RELSTRETCH, // north east double arrow
    '\u21D8': MO.RELSTRETCH, // south east double arrow
    '\u21D9': MO.RELSTRETCH, // south west double arrow
    '\u21DA': MO.WIDEREL,    // leftwards triple arrow
    '\u21DB': MO.WIDEREL,    // rightwards triple arrow
    '\u21DC': MO.WIDEREL,    // leftwards squiggle arrow
    '\u21DD': MO.WIDEREL,    // rightwards squiggle arrow
    '\u21DE': MO.REL,        // upwards arrow with double stroke
    '\u21DF': MO.REL,        // downwards arrow with double stroke
    '\u21E0': MO.WIDEREL,    // leftwards dashed arrow
    '\u21E1': MO.RELSTRETCH, // upwards dashed arrow
    '\u21E2': MO.WIDEREL,    // rightwards dashed arrow
    '\u21E3': MO.RELSTRETCH, // downwards dashed arrow
    '\u21E4': MO.WIDEREL,    // leftwards arrow to bar
    '\u21E5': MO.WIDEREL,    // rightwards arrow to bar
    '\u21E6': MO.WIDEREL,    // leftwards white arrow
    '\u21E7': MO.RELSTRETCH, // upwards white arrow
    '\u21E8': MO.WIDEREL,    // rightwards white arrow
    '\u21E9': MO.RELSTRETCH, // downwards white arrow
    '\u21EA': MO.RELSTRETCH, // upwards white arrow from bar
    '\u21EB': MO.RELSTRETCH, // upwards white arrow on pedestal
    '\u21EC': MO.RELSTRETCH, // upwards white arrow on pedestal with horizontal bar
    '\u21ED': MO.RELSTRETCH, // upwards white arrow on pedestal with vertical bar
    '\u21EE': MO.RELSTRETCH, // upwards white double arrow
    '\u21EF': MO.RELSTRETCH, // upwards white double arrow on pedestal
    '\u21F0': MO.WIDEREL,    // rightwards white arrow from wall
    '\u21F1': MO.REL,        // north west arrow to corner
    '\u21F2': MO.REL,        // south east arrow to corner
    '\u21F3': MO.RELSTRETCH, // up down white arrow
    '\u21F4': MO.RELACCENT,  // right arrow with small circle
    '\u21F5': MO.RELSTRETCH, // downwards arrow leftwards of upwards arrow
    '\u21F6': MO.WIDEREL,    // three rightwards arrows
    '\u21F7': MO.RELACCENT,  // leftwards arrow with vertical stroke
    '\u21F8': MO.RELACCENT,  // rightwards arrow with vertical stroke
    '\u21F9': MO.RELACCENT,  // left right arrow with vertical stroke
    '\u21FA': MO.RELACCENT,  // leftwards arrow with double vertical stroke
    '\u21FB': MO.RELACCENT,  // rightwards arrow with double vertical stroke
    '\u21FC': MO.RELACCENT,  // left right arrow with double vertical stroke
    '\u21FD': MO.WIDEREL,    // leftwards open-headed arrow
    '\u21FE': MO.WIDEREL,    // rightwards open-headed arrow
    '\u21FF': MO.WIDEREL,    // left right open-headed arrow
    '\u2201': OPDEF(1, 2, TEXCLASS.ORD), // complement
    '\u2205': MO.ORD,        // \emptyset
    '\u2206': MO.BIN3,       // increment
    '\u2208': MO.REL,        // element of
    '\u2209': MO.REL,        // not an element of
    '\u220A': MO.REL,        // small element of
    '\u220B': MO.REL,        // contains as member
    '\u220C': MO.REL,        // does not contain as member
    '\u220D': MO.REL,        // small contains as member
    '\u220E': MO.BIN3,       // end of proof
    '\u2212': MO.BIN4,       // minus sign
    '\u2213': MO.BIN4,       // minus-or-plus sign
    '\u2214': MO.BIN4,       // dot plus
    '\u2215': MO.TALLBIN,    // division slash
    '\u2216': MO.BIN4,       // set minus
    '\u2217': MO.BIN4,       // asterisk operator
    '\u2218': MO.BIN4,       // ring operator
    '\u2219': MO.BIN4,       // bullet operator
    '\u221D': MO.REL,        // proportional to
    '\u221E': MO.ORD,        // \infty
    '\u221F': MO.REL,        // right angle
    '\u2223': MO.REL,        // divides
    '\u2224': MO.REL,        // does not divide
    '\u2225': MO.REL,        // parallel to
    '\u2226': MO.REL,        // not parallel to
    '\u2227': MO.BIN4,       // logical and
    '\u2228': MO.BIN4,       // logical or
    '\u2229': MO.BIN4,       // intersection
    '\u222A': MO.BIN4,       // union
    '\u2234': MO.REL,        // therefore
    '\u2235': MO.REL,        // because
    '\u2236': MO.REL,        // ratio
    '\u2237': MO.REL,        // proportion
    '\u2238': MO.BIN4,       // dot minus
    '\u2239': MO.REL,        // excess
    '\u223A': MO.BIN4,       // geometric proportion
    '\u223B': MO.REL,        // homothetic
    '\u223C': MO.REL,        // tilde operator
    '\u223D': MO.REL,        // reversed tilde
    '\u223D\u0331': MO.BIN3, // reversed tilde with underline
    '\u223E': MO.REL,        // inverted lazy s
    '\u223F': MO.BIN3,       // sine wave
    '\u2240': MO.BIN4,       // wreath product
    '\u2241': MO.REL,        // not tilde
    '\u2242': MO.REL,        // minus tilde
    '\u2242\u0338': MO.REL,  // minus tilde with slash
    '\u2243': MO.REL,        // asymptotically equal to
    '\u2244': MO.REL,        // not asymptotically equal to
    '\u2245': MO.REL,        // approximately equal to
    '\u2246': MO.REL,        // approximately but not actually equal to
    '\u2247': MO.REL,        // neither approximately nor actually equal to
    '\u2248': MO.REL,        // almost equal to
    '\u2249': MO.REL,        // not almost equal to
    '\u224A': MO.REL,        // almost equal or equal to
    '\u224B': MO.REL,        // triple tilde
    '\u224C': MO.REL,        // all equal to
    '\u224D': MO.REL,        // equivalent to
    '\u224E': MO.REL,        // geometrically equivalent to
    '\u224E\u0338': MO.REL,  // geometrically equivalent to with slash
    '\u224F': MO.REL,        // difference between
    '\u224F\u0338': MO.REL,  // difference between with slash
    '\u2250': MO.REL,        // approaches the limit
    '\u2251': MO.REL,        // geometrically equal to
    '\u2252': MO.REL,        // approximately equal to or the image of
    '\u2253': MO.REL,        // image of or approximately equal to
    '\u2254': MO.REL,        // colon equals
    '\u2255': MO.REL,        // equals colon
    '\u2256': MO.REL,        // ring in equal to
    '\u2257': MO.REL,        // ring equal to
    '\u2258': MO.REL,        // corresponds to
    '\u2259': MO.REL,        // estimates
    '\u225A': MO.REL,        // equiangular to
    '\u225B': MO.REL,        // star equals
    '\u225C': MO.REL,        // delta equal to
    '\u225D': MO.REL,        // equal to by definition
    '\u225E': MO.REL,        // measured by
    '\u225F': MO.REL,        // questioned equal to
    '\u2260': MO.REL,        // not equal to
    '\u2261': MO.REL,        // identical to
    '\u2262': MO.REL,        // not identical to
    '\u2263': MO.REL,        // strictly equivalent to
    '\u2264': MO.REL,        // less-than or equal to
    '\u2265': MO.REL,        // greater-than or equal to
    '\u2266': MO.REL,        // less-than over equal to
    '\u2266\u0338': MO.REL,  // less-than over equal to with slash
    '\u2267': MO.REL,        // greater-than over equal to
    '\u2268': MO.REL,        // less-than but not equal to
    '\u2269': MO.REL,        // greater-than but not equal to
    '\u226A': MO.REL,        // much less-than
    '\u226A\u0338': MO.REL,  // much less than with slash
    '\u226B': MO.REL,        // much greater-than
    '\u226B\u0338': MO.REL,  // much greater than with slash
    '\u226C': MO.REL,        // between
    '\u226D': MO.REL,        // not equivalent to
    '\u226E': MO.REL,        // not less-than
    '\u226F': MO.REL,        // not greater-than
    '\u2270': MO.REL,        // neither less-than nor equal to
    '\u2271': MO.REL,        // neither greater-than nor equal to
    '\u2272': MO.REL,        // less-than or equivalent to
    '\u2273': MO.REL,        // greater-than or equivalent to
    '\u2274': MO.REL,        // neither less-than nor equivalent to
    '\u2275': MO.REL,        // neither greater-than nor equivalent to
    '\u2276': MO.REL,        // less-than or greater-than
    '\u2277': MO.REL,        // greater-than or less-than
    '\u2278': MO.REL,        // neither less-than nor greater-than
    '\u2279': MO.REL,        // neither greater-than nor less-than
    '\u227A': MO.REL,        // precedes
    '\u227B': MO.REL,        // succeeds
    '\u227C': MO.REL,        // precedes or equal to
    '\u227D': MO.REL,        // succeeds or equal to
    '\u227E': MO.REL,        // precedes or equivalent to
    '\u227F': MO.REL,        // succeeds or equivalent to
    '\u227F\u0338': MO.REL,  // succeeds or equivalent to with slash
    '\u2280': MO.REL,        // does not precede
    '\u2281': MO.REL,        // does not succeed
    '\u2282': MO.REL,        // subset of
    '\u2282\u20D2': MO.REL,  // subset of with vertical line
    '\u2283': MO.REL,        // superset of
    '\u2283\u20D2': MO.REL,  // superset of with vertical line
    '\u2284': MO.REL,        // not a subset of
    '\u2285': MO.REL,        // not a superset of
    '\u2286': MO.REL,        // subset of or equal to
    '\u2287': MO.REL,        // superset of or equal to
    '\u2288': MO.REL,        // neither a subset of nor equal to
    '\u2289': MO.REL,        // neither a superset of nor equal to
    '\u228A': MO.REL,        // subset of with not equal to
    '\u228B': MO.REL,        // superset of with not equal to
    '\u228C': MO.BIN4,       // multiset
    '\u228D': MO.BIN4,       // multiset multiplication
    '\u228E': MO.BIN4,       // multiset union
    '\u228F': MO.REL,        // square image of
    '\u228F\u0338': MO.REL,  // square image of with slash
    '\u2290': MO.REL,        // square original of
    '\u2290\u0338': MO.REL,  // square original of with slash
    '\u2291': MO.REL,        // square image of or equal to
    '\u2292': MO.REL,        // square original of or equal to
    '\u2293': MO.BIN4,       // square cap
    '\u2294': MO.BIN4,       // square cup
    '\u2295': MO.BIN4,       // circled plus
    '\u2296': MO.BIN4,       // circled minus
    '\u2297': MO.BIN4,       // circled times
    '\u2298': MO.BIN4,       // circled division slash
    '\u2299': MO.BIN4,       // circled dot operator
    '\u229A': MO.BIN4,       // circled ring operator
    '\u229B': MO.BIN4,       // circled asterisk operator
    '\u229C': MO.BIN4,       // circled equals
    '\u229D': MO.BIN4,       // circled dash
    '\u229E': MO.BIN4,       // squared plus
    '\u229F': MO.BIN4,       // squared minus
    '\u22A0': MO.BIN4,       // squared times
    '\u22A1': MO.BIN4,       // squared dot operator
    '\u22A2': MO.REL,        // right tack
    '\u22A3': MO.REL,        // left tack
    '\u22A4': MO.ORD55,      // down tack
    '\u22A5': MO.REL,        // up tack
    '\u22A6': MO.REL,        // assertion
    '\u22A7': MO.REL,        // models
    '\u22A8': MO.REL,        // true
    '\u22A9': MO.REL,        // forces
    '\u22AA': MO.REL,        // triple vertical bar right turnstile
    '\u22AB': MO.REL,        // double vertical bar double right turnstile
    '\u22AC': MO.REL,        // does not prove
    '\u22AD': MO.REL,        // not true
    '\u22AE': MO.REL,        // does not force
    '\u22AF': MO.REL,        // negated double vertical bar double right turnstile
    '\u22B0': MO.REL,        // precedes under relation
    '\u22B1': MO.REL,        // succeeds under relation
    '\u22B2': MO.REL,        // normal subgroup of
    '\u22B3': MO.REL,        // contains as normal subgroup
    '\u22B4': MO.REL,        // normal subgroup of or equal to
    '\u22B5': MO.REL,        // contains as normal subgroup or equal to
    '\u22B6': MO.REL,        // original of
    '\u22B7': MO.REL,        // image of
    '\u22B8': MO.REL,        // multimap
    '\u22B9': MO.REL,        // hermitian conjugate matrix
    '\u22BA': MO.BIN4,       // intercalate
    '\u22BB': MO.BIN4,       // xor
    '\u22BC': MO.BIN4,       // nand
    '\u22BD': MO.BIN4,       // nor
    '\u22BE': MO.BIN3,       // right angle with arc
    '\u22BF': MO.BIN3,       // right triangle
    '\u22C4': MO.BIN4,       // diamond operator
    '\u22C5': MO.BIN4,       // dot operator
    '\u22C6': MO.BIN4,       // star operator
    '\u22C7': MO.BIN4,       // division times
    '\u22C8': MO.REL,        // bowtie
    '\u22C9': MO.BIN4,       // left normal factor semidirect product
    '\u22CA': MO.BIN4,       // right normal factor semidirect product
    '\u22CB': MO.BIN4,       // left semidirect product
    '\u22CC': MO.BIN4,       // right semidirect product
    '\u22CD': MO.REL,        // reversed tilde equals
    '\u22CE': MO.BIN4,       // curly logical or
    '\u22CF': MO.BIN4,       // curly logical and
    '\u22D0': MO.REL,        // double subset
    '\u22D1': MO.REL,        // double superset
    '\u22D2': MO.BIN4,       // double intersection
    '\u22D3': MO.BIN4,       // double union
    '\u22D4': MO.REL,        // pitchfork
    '\u22D5': MO.REL,        // equal and parallel to
    '\u22D6': MO.REL,        // less-than with dot
    '\u22D7': MO.REL,        // greater-than with dot
    '\u22D8': MO.REL,        // very much less-than
    '\u22D9': MO.REL,        // very much greater-than
    '\u22DA': MO.REL,        // less-than equal to or greater-than
    '\u22DB': MO.REL,        // greater-than equal to or less-than
    '\u22DC': MO.REL,        // equal to or less-than
    '\u22DD': MO.REL,        // equal to or greater-than
    '\u22DE': MO.REL,        // equal to or precedes
    '\u22DF': MO.REL,        // equal to or succeeds
    '\u22E0': MO.REL,        // does not precede or equal
    '\u22E1': MO.REL,        // does not succeed or equal
    '\u22E2': MO.REL,        // not square image of or equal to
    '\u22E3': MO.REL,        // not square original of or equal to
    '\u22E4': MO.REL,        // square image of or not equal to
    '\u22E5': MO.REL,        // square original of or not equal to
    '\u22E6': MO.REL,        // less-than but not equivalent to
    '\u22E7': MO.REL,        // greater-than but not equivalent to
    '\u22E8': MO.REL,        // precedes but not equivalent to
    '\u22E9': MO.REL,        // succeeds but not equivalent to
    '\u22EA': MO.REL,        // not normal subgroup of
    '\u22EB': MO.REL,        // does not contain as normal subgroup
    '\u22EC': MO.REL,        // not normal subgroup of or equal to
    '\u22ED': MO.REL,        // does not contain as normal subgroup or equal
    '\u22EE': MO.ORD55,      // vertical ellipsis
    '\u22EF': MO.INNER,      // midline horizontal ellipsis
    '\u22F0': MO.REL,        // up right diagonal ellipsis
    '\u22F1': [5, 5, TEXCLASS.INNER, null], // down right diagonal ellipsis
    '\u22F2': MO.REL,        // element of with long horizontal stroke
    '\u22F3': MO.REL,        // element of with vertical bar at end of horizontal stroke
    '\u22F4': MO.REL,        // small element of with vertical bar at end of horizontal stroke
    '\u22F5': MO.REL,        // element of with dot above
    '\u22F6': MO.REL,        // element of with overbar
    '\u22F7': MO.REL,        // small element of with overbar
    '\u22F8': MO.REL,        // element of with underbar
    '\u22F9': MO.REL,        // element of with two horizontal strokes
    '\u22FA': MO.REL,        // contains with long horizontal stroke
    '\u22FB': MO.REL,        // contains with vertical bar at end of horizontal stroke
    '\u22FC': MO.REL,        // small contains with vertical bar at end of horizontal stroke
    '\u22FD': MO.REL,        // contains with overbar
    '\u22FE': MO.REL,        // small contains with overbar
    '\u22FF': MO.REL,        // z notation bag membership
    '\u2305': MO.BIN3,       // barwedge
    '\u2306': MO.BIN3,       // doublebarwedge
    '\u2322': MO.REL4,       // \frown
    '\u2323': MO.REL4,       // \smile
    '\u2329': MO.OPEN,       // langle
    '\u232A': MO.CLOSE,      // rangle
    '\u23AA': MO.ORD,        // \bracevert
    '\u23AF': [0, 0, TEXCLASS.ORD, {stretchy: true}], // \underline
    '\u23B0': MO.OPEN,       // \lmoustache
    '\u23B1': MO.CLOSE,      // \rmoustache
    '\u2500': MO.ORD,        // horizontal line
    '\u25B3': MO.BIN4,       // white up-pointing triangle
    '\u25B5': MO.BIN4,       // white up-pointing small triangle
    '\u25B9': MO.BIN4,       // white right-pointing small triangle
    '\u25BD': MO.BIN4,       // white down-pointing triangle
    '\u25BF': MO.BIN4,       // white down-pointing small triangle
    '\u25C3': MO.BIN4,       // white left-pointing small triangle
    '\u25EF': MO.BIN3,       // \bigcirc
    '\u2660': MO.ORD,        // \spadesuit
    '\u2661': MO.ORD,        // \heartsuit
    '\u2662': MO.ORD,        // \diamondsuit
    '\u2663': MO.ORD,        // \clubsuit
    '\u2758': MO.REL,        // light vertical bar
    '\u27F0': MO.RELSTRETCH, // upwards quadruple arrow
    '\u27F1': MO.RELSTRETCH, // downwards quadruple arrow
    '\u27F5': MO.WIDEREL,    // long leftwards arrow
    '\u27F6': MO.WIDEREL,    // long rightwards arrow
    '\u27F7': MO.WIDEREL,    // long left right arrow
    '\u27F8': MO.WIDEREL,    // long leftwards double arrow
    '\u27F9': MO.WIDEREL,    // long rightwards double arrow
    '\u27FA': MO.WIDEREL,    // long left right double arrow
    '\u27FB': MO.WIDEREL,    // long leftwards arrow from bar
    '\u27FC': MO.WIDEREL,    // long rightwards arrow from bar
    '\u27FD': MO.WIDEREL,    // long leftwards double arrow from bar
    '\u27FE': MO.WIDEREL,    // long rightwards double arrow from bar
    '\u27FF': MO.WIDEREL,    // long rightwards squiggle arrow
    '\u2900': MO.RELACCENT,  // rightwards two-headed arrow with vertical stroke
    '\u2901': MO.RELACCENT,  // rightwards two-headed arrow with double vertical stroke
    '\u2902': MO.RELACCENT,  // leftwards double arrow with vertical stroke
    '\u2903': MO.RELACCENT,  // rightwards double arrow with vertical stroke
    '\u2904': MO.RELACCENT,  // left right double arrow with vertical stroke
    '\u2905': MO.RELACCENT,  // rightwards two-headed arrow from bar
    '\u2906': MO.RELACCENT,  // leftwards double arrow from bar
    '\u2907': MO.RELACCENT,  // rightwards double arrow from bar
    '\u2908': MO.REL,        // downwards arrow with horizontal stroke
    '\u2909': MO.REL,        // upwards arrow with horizontal stroke
    '\u290A': MO.RELSTRETCH, // upwards triple arrow
    '\u290B': MO.RELSTRETCH, // downwards triple arrow
    '\u290C': MO.WIDEREL,    // leftwards double dash arrow
    '\u290D': MO.WIDEREL,    // rightwards double dash arrow
    '\u290E': MO.WIDEREL,    // leftwards triple dash arrow
    '\u290F': MO.WIDEREL,    // rightwards triple dash arrow
    '\u2910': MO.WIDEREL,    // rightwards two-headed triple dash arrow
    '\u2911': MO.RELACCENT,  // rightwards arrow with dotted stem
    '\u2912': MO.RELSTRETCH, // upwards arrow to bar
    '\u2913': MO.RELSTRETCH, // downwards arrow to bar
    '\u2914': MO.RELACCENT,  // rightwards arrow with tail with vertical stroke
    '\u2915': MO.RELACCENT,  // rightwards arrow with tail with double vertical stroke
    '\u2916': MO.RELACCENT,  // rightwards two-headed arrow with tail
    '\u2917': MO.RELACCENT,  // rightwards two-headed arrow with tail with vertical stroke
    '\u2918': MO.RELACCENT,  // rightwards two-headed arrow with tail with double vertical stroke
    '\u2919': MO.RELACCENT,  // leftwards arrow-tail
    '\u291A': MO.RELACCENT,  // rightwards arrow-tail
    '\u291B': MO.RELACCENT,  // leftwards double arrow-tail
    '\u291C': MO.RELACCENT,  // rightwards double arrow-tail
    '\u291D': MO.RELACCENT,  // leftwards arrow to black diamond
    '\u291E': MO.RELACCENT,  // rightwards arrow to black diamond
    '\u291F': MO.RELACCENT,  // leftwards arrow from bar to black diamond
    '\u2920': MO.RELACCENT,  // rightwards arrow from bar to black diamond
    '\u2921': MO.RELSTRETCH, // north west and south east arrow
    '\u2922': MO.RELSTRETCH, // north east and south west arrow
    '\u2923': MO.REL,        // north west arrow with hook
    '\u2924': MO.REL,        // north east arrow with hook
    '\u2925': MO.REL,        // south east arrow with hook
    '\u2926': MO.REL,        // south west arrow with hook
    '\u2927': MO.REL,        // north west arrow and north east arrow
    '\u2928': MO.REL,        // north east arrow and south east arrow
    '\u2929': MO.REL,        // south east arrow and south west arrow
    '\u292A': MO.REL,        // south west arrow and north west arrow
    '\u292B': MO.REL,        // rising diagonal crossing falling diagonal
    '\u292C': MO.REL,        // falling diagonal crossing rising diagonal
    '\u292D': MO.REL,        // south east arrow crossing north east arrow
    '\u292E': MO.REL,        // north east arrow crossing south east arrow
    '\u292F': MO.REL,        // falling diagonal crossing north east arrow
    '\u2930': MO.REL,        // rising diagonal crossing south east arrow
    '\u2931': MO.REL,        // north east arrow crossing north west arrow
    '\u2932': MO.REL,        // north west arrow crossing north east arrow
    '\u2933': MO.RELACCENT,  // wave arrow pointing directly right
    '\u2934': MO.REL,        // arrow pointing rightwards then curving upwards
    '\u2935': MO.REL,        // arrow pointing rightwards then curving downwards
    '\u2936': MO.REL,        // arrow pointing downwards then curving leftwards
    '\u2937': MO.REL,        // arrow pointing downwards then curving rightwards
    '\u2938': MO.REL,        // right-side arc clockwise arrow
    '\u2939': MO.REL,        // left-side arc anticlockwise arrow
    '\u293A': MO.RELACCENT,  // top arc anticlockwise arrow
    '\u293B': MO.RELACCENT,  // bottom arc anticlockwise arrow
    '\u293C': MO.RELACCENT,  // top arc clockwise arrow with minus
    '\u293D': MO.RELACCENT,  // top arc anticlockwise arrow with plus
    '\u293E': MO.REL,        // lower right semicircular clockwise arrow
    '\u293F': MO.REL,        // lower left semicircular anticlockwise arrow
    '\u2940': MO.REL,        // anticlockwise closed circle arrow
    '\u2941': MO.REL,        // clockwise closed circle arrow
    '\u2942': MO.RELACCENT,  // rightwards arrow above short leftwards arrow
    '\u2943': MO.RELACCENT,  // leftwards arrow above short rightwards arrow
    '\u2944': MO.RELACCENT,  // short rightwards arrow above leftwards arrow
    '\u2945': MO.RELACCENT,  // rightwards arrow with plus below
    '\u2946': MO.RELACCENT,  // leftwards arrow with plus below
    '\u2947': MO.RELACCENT,  // rightwards arrow through x
    '\u2948': MO.RELACCENT,  // left right arrow through small circle
    '\u2949': MO.REL,        // upwards two-headed arrow from small circle
    '\u294A': MO.RELACCENT,  // left barb up right barb down harpoon
    '\u294B': MO.RELACCENT,  // left barb down right barb up harpoon
    '\u294C': MO.REL,        // up barb right down barb left harpoon
    '\u294D': MO.REL,        // up barb left down barb right harpoon
    '\u294E': MO.WIDEREL,    // left barb up right barb up harpoon
    '\u294F': MO.RELSTRETCH, // up barb right down barb right harpoon
    '\u2950': MO.WIDEREL,    // left barb down right barb down harpoon
    '\u2951': MO.RELSTRETCH, // up barb left down barb left harpoon
    '\u2952': MO.WIDEREL,    // leftwards harpoon with barb up to bar
    '\u2953': MO.WIDEREL,    // rightwards harpoon with barb up to bar
    '\u2954': MO.RELSTRETCH, // upwards harpoon with barb right to bar
    '\u2955': MO.RELSTRETCH, // downwards harpoon with barb right to bar
    '\u2956': MO.RELSTRETCH, // leftwards harpoon with barb down to bar
    '\u2957': MO.RELSTRETCH, // rightwards harpoon with barb down to bar
    '\u2958': MO.RELSTRETCH, // upwards harpoon with barb left to bar
    '\u2959': MO.RELSTRETCH, // downwards harpoon with barb left to bar
    '\u295A': MO.WIDEREL,    // leftwards harpoon with barb up from bar
    '\u295B': MO.WIDEREL,    // rightwards harpoon with barb up from bar
    '\u295C': MO.RELSTRETCH, // upwards harpoon with barb right from bar
    '\u295D': MO.RELSTRETCH, // downwards harpoon with barb right from bar
    '\u295E': MO.WIDEREL,    // leftwards harpoon with barb down from bar
    '\u295F': MO.WIDEREL,    // rightwards harpoon with barb down from bar
    '\u2960': MO.RELSTRETCH, // upwards harpoon with barb left from bar
    '\u2961': MO.RELSTRETCH, // downwards harpoon with barb left from bar
    '\u2962': MO.RELACCENT,  // leftwards harpoon with barb up above leftwards harpoon with barb down
    '\u2963': MO.REL,        // upwards harpoon with barb left beside upwards harpoon with barb right
    '\u2964': MO.RELACCENT,  // rightwards harpoon with barb up above rightwards harpoon with barb down
    '\u2965': MO.REL,        // downwards harpoon with barb left beside downwards harpoon with barb right
    '\u2966': MO.RELACCENT,  // leftwards harpoon with barb up above rightwards harpoon with barb up
    '\u2967': MO.RELACCENT,  // leftwards harpoon with barb down above rightwards harpoon with barb down
    '\u2968': MO.RELACCENT,  // rightwards harpoon with barb up above leftwards harpoon with barb up
    '\u2969': MO.RELACCENT,  // rightwards harpoon with barb down above leftwards harpoon with barb down
    '\u296A': MO.RELACCENT,  // leftwards harpoon with barb up above long dash
    '\u296B': MO.RELACCENT,  // leftwards harpoon with barb down below long dash
    '\u296C': MO.RELACCENT,  // rightwards harpoon with barb up above long dash
    '\u296D': MO.RELACCENT,  // rightwards harpoon with barb down below long dash
    '\u296E': MO.RELSTRETCH, // upwards harpoon with barb left beside downwards harpoon with barb right
    '\u296F': MO.RELSTRETCH, // downwards harpoon with barb left beside upwards harpoon with barb right
    '\u2970': MO.RELACCENT,  // right double arrow with rounded head
    '\u2971': MO.RELACCENT,  // equals sign above rightwards arrow
    '\u2972': MO.RELACCENT,  // tilde operator above rightwards arrow
    '\u2973': MO.RELACCENT,  // leftwards arrow above tilde operator
    '\u2974': MO.RELACCENT,  // rightwards arrow above tilde operator
    '\u2975': MO.RELACCENT,  // rightwards arrow above almost equal to
    '\u2976': MO.RELACCENT,  // less-than above leftwards arrow
    '\u2977': MO.RELACCENT,  // leftwards arrow through less-than
    '\u2978': MO.RELACCENT,  // greater-than above rightwards arrow
    '\u2979': MO.RELACCENT,  // subset above rightwards arrow
    '\u297A': MO.RELACCENT,  // leftwards arrow through subset
    '\u297B': MO.RELACCENT,  // superset above leftwards arrow
    '\u297C': MO.RELACCENT,  // left fish tail
    '\u297D': MO.RELACCENT,  // right fish tail
    '\u297E': MO.REL,        // up fish tail
    '\u297F': MO.REL,        // down fish tail
    '\u2981': MO.BIN3,       // z notation spot
    '\u2982': MO.BIN3,       // z notation type colon
    '\u2999': MO.BIN3,       // dotted fence
    '\u299A': MO.BIN3,       // vertical zigzag line
    '\u299B': MO.BIN3,       // measured angle opening left
    '\u299C': MO.BIN3,       // right angle variant with square
    '\u299D': MO.BIN3,       // measured right angle with dot
    '\u299E': MO.BIN3,       // angle with s inside
    '\u299F': MO.BIN3,       // acute angle
    '\u29A0': MO.BIN3,       // spherical angle opening left
    '\u29A1': MO.BIN3,       // spherical angle opening up
    '\u29A2': MO.BIN3,       // turned angle
    '\u29A3': MO.BIN3,       // reversed angle
    '\u29A4': MO.BIN3,       // angle with underbar
    '\u29A5': MO.BIN3,       // reversed angle with underbar
    '\u29A6': MO.BIN3,       // oblique angle opening up
    '\u29A7': MO.BIN3,       // oblique angle opening down
    '\u29A8': MO.BIN3,       // measured angle with open arm ending in arrow pointing up and right
    '\u29A9': MO.BIN3,       // measured angle with open arm ending in arrow pointing up and left
    '\u29AA': MO.BIN3,       // measured angle with open arm ending in arrow pointing down and right
    '\u29AB': MO.BIN3,       // measured angle with open arm ending in arrow pointing down and left
    '\u29AC': MO.BIN3,       // measured angle with open arm ending in arrow pointing right and up
    '\u29AD': MO.BIN3,       // measured angle with open arm ending in arrow pointing left and up
    '\u29AE': MO.BIN3,       // measured angle with open arm ending in arrow pointing right and down
    '\u29AF': MO.BIN3,       // measured angle with open arm ending in arrow pointing left and down
    '\u29B0': MO.BIN3,       // reversed empty set
    '\u29B1': MO.BIN3,       // empty set with overbar
    '\u29B2': MO.BIN3,       // empty set with small circle above
    '\u29B3': MO.BIN3,       // empty set with right arrow above
    '\u29B4': MO.BIN3,       // empty set with left arrow above
    '\u29B5': MO.BIN3,       // circle with horizontal bar
    '\u29B6': MO.BIN4,       // circled vertical bar
    '\u29B7': MO.BIN4,       // circled parallel
    '\u29B8': MO.BIN4,       // circled reverse solidus
    '\u29B9': MO.BIN4,       // circled perpendicular
    '\u29BA': MO.BIN4,       // circle divided by horizontal bar and top half divided by vertical bar
    '\u29BB': MO.BIN4,       // circle with superimposed x
    '\u29BC': MO.BIN4,       // circled anticlockwise-rotated division sign
    '\u29BD': MO.BIN4,       // up arrow through circle
    '\u29BE': MO.BIN4,       // circled white bullet
    '\u29BF': MO.BIN4,       // circled bullet
    '\u29C0': MO.REL,        // circled less-than
    '\u29C1': MO.REL,        // circled greater-than
    '\u29C2': MO.BIN3,       // circle with small circle to the right
    '\u29C3': MO.BIN3,       // circle with two horizontal strokes to the right
    '\u29C4': MO.BIN4,       // squared rising diagonal slash
    '\u29C5': MO.BIN4,       // squared falling diagonal slash
    '\u29C6': MO.BIN4,       // squared asterisk
    '\u29C7': MO.BIN4,       // squared small circle
    '\u29C8': MO.BIN4,       // squared square
    '\u29C9': MO.BIN3,       // two joined squares
    '\u29CA': MO.BIN3,       // triangle with dot above
    '\u29CB': MO.BIN3,       // triangle with underbar
    '\u29CC': MO.BIN3,       // s in triangle
    '\u29CD': MO.BIN3,       // triangle with serifs at bottom
    '\u29CE': MO.REL,        // right triangle above left triangle
    '\u29CF': MO.REL,        // left triangle beside vertical bar
    '\u29CF\u0338': MO.REL,  // left triangle beside vertical bar with slash
    '\u29D0': MO.REL,        // vertical bar beside right triangle
    '\u29D0\u0338': MO.REL,  // vertical bar beside right triangle with slash
    '\u29D1': MO.REL,        // bowtie with left half black
    '\u29D2': MO.REL,        // bowtie with right half black
    '\u29D3': MO.REL,        // black bowtie
    '\u29D4': MO.REL,        // times with left half black
    '\u29D5': MO.REL,        // times with right half black
    '\u29D6': MO.BIN4,       // white hourglass
    '\u29D7': MO.BIN4,       // black hourglass
    '\u29D8': MO.BIN3,       // left wiggly fence
    '\u29D9': MO.BIN3,       // right wiggly fence
    '\u29DB': MO.BIN3,       // right double wiggly fence
    '\u29DC': MO.BIN3,       // incomplete infinity
    '\u29DD': MO.BIN3,       // tie over infinity
    '\u29DE': MO.REL,        // infinity negated with vertical bar
    '\u29DF': MO.BIN3,       // double-ended multimap
    '\u29E0': MO.BIN3,       // square with contoured outline
    '\u29E1': MO.REL,        // increases as
    '\u29E2': MO.BIN4,       // shuffle product
    '\u29E3': MO.REL,        // equals sign and slanted parallel
    '\u29E4': MO.REL,        // equals sign and slanted parallel with tilde above
    '\u29E5': MO.REL,        // identical to and slanted parallel
    '\u29E6': MO.REL,        // gleich stark
    '\u29E7': MO.BIN3,       // thermodynamic
    '\u29E8': MO.BIN3,       // down-pointing triangle with left half black
    '\u29E9': MO.BIN3,       // down-pointing triangle with right half black
    '\u29EA': MO.BIN3,       // black diamond with down arrow
    '\u29EB': MO.BIN3,       // black lozenge
    '\u29EC': MO.BIN3,       // white circle with down arrow
    '\u29ED': MO.BIN3,       // black circle with down arrow
    '\u29EE': MO.BIN3,       // error-barred white square
    '\u29EF': MO.BIN3,       // error-barred black square
    '\u29F0': MO.BIN3,       // error-barred white diamond
    '\u29F1': MO.BIN3,       // error-barred black diamond
    '\u29F2': MO.BIN3,       // error-barred white circle
    '\u29F3': MO.BIN3,       // error-barred black circle
    '\u29F4': MO.REL,        // rule-delayed
    '\u29F5': MO.BIN4,       // reverse solidus operator
    '\u29F6': MO.BIN4,       // solidus with overbar
    '\u29F7': MO.BIN4,       // reverse solidus with horizontal stroke
    '\u29F8': MO.BIN3,       // big solidus
    '\u29F9': MO.BIN3,       // big reverse solidus
    '\u29FA': MO.BIN3,       // double plus
    '\u29FB': MO.BIN3,       // triple plus
    '\u29FE': MO.BIN4,       // tiny
    '\u29FF': MO.BIN4,       // miny
    '\u2A1D': MO.BIN3,       // join
    '\u2A1E': MO.BIN3,       // large left triangle operator
    '\u2A1F': MO.BIN3,       // z notation schema composition
    '\u2A20': MO.BIN3,       // z notation schema piping
    '\u2A21': MO.BIN3,       // z notation schema projection
    '\u2A22': MO.BIN4,       // plus sign with small circle above
    '\u2A23': MO.BIN4,       // plus sign with circumflex accent above
    '\u2A24': MO.BIN4,       // plus sign with tilde above
    '\u2A25': MO.BIN4,       // plus sign with dot below
    '\u2A26': MO.BIN4,       // plus sign with tilde below
    '\u2A27': MO.BIN4,       // plus sign with subscript two
    '\u2A28': MO.BIN4,       // plus sign with black triangle
    '\u2A29': MO.BIN4,       // minus sign with comma above
    '\u2A2A': MO.BIN4,       // minus sign with dot below
    '\u2A2B': MO.BIN4,       // minus sign with falling dots
    '\u2A2C': MO.BIN4,       // minus sign with rising dots
    '\u2A2D': MO.BIN4,       // plus sign in left half circle
    '\u2A2E': MO.BIN4,       // plus sign in right half circle
    '\u2A2F': MO.BIN4,       // vector or cross product
    '\u2A30': MO.BIN4,       // multiplication sign with dot above
    '\u2A31': MO.BIN4,       // multiplication sign with underbar
    '\u2A32': MO.BIN4,       // semidirect product with bottom closed
    '\u2A33': MO.BIN4,       // smash product
    '\u2A34': MO.BIN4,       // multiplication sign in left half circle
    '\u2A35': MO.BIN4,       // multiplication sign in right half circle
    '\u2A36': MO.BIN4,       // circled multiplication sign with circumflex accent
    '\u2A37': MO.BIN4,       // multiplication sign in double circle
    '\u2A38': MO.BIN4,       // circled division sign
    '\u2A39': MO.BIN4,       // plus sign in triangle
    '\u2A3A': MO.BIN4,       // minus sign in triangle
    '\u2A3B': MO.BIN4,       // multiplication sign in triangle
    '\u2A3C': MO.BIN4,       // interior product
    '\u2A3D': MO.BIN4,       // righthand interior product
    '\u2A3E': MO.BIN4,       // z notation relational composition
    '\u2A3F': MO.BIN4,       // amalgamation or coproduct
    '\u2A40': MO.BIN4,       // intersection with dot
    '\u2A41': MO.BIN4,       // union with minus sign
    '\u2A42': MO.BIN4,       // union with overbar
    '\u2A43': MO.BIN4,       // intersection with overbar
    '\u2A44': MO.BIN4,       // intersection with logical and
    '\u2A45': MO.BIN4,       // union with logical or
    '\u2A46': MO.BIN4,       // union above intersection
    '\u2A47': MO.BIN4,       // intersection above union
    '\u2A48': MO.BIN4,       // union above bar above intersection
    '\u2A49': MO.BIN4,       // intersection above bar above union
    '\u2A4A': MO.BIN4,       // union beside and joined with union
    '\u2A4B': MO.BIN4,       // intersection beside and joined with intersection
    '\u2A4C': MO.BIN4,       // closed union with serifs
    '\u2A4D': MO.BIN4,       // closed intersection with serifs
    '\u2A4E': MO.BIN4,       // double square intersection
    '\u2A4F': MO.BIN4,       // double square union
    '\u2A50': MO.BIN4,       // closed union with serifs and smash product
    '\u2A51': MO.BIN4,       // logical and with dot above
    '\u2A52': MO.BIN4,       // logical or with dot above
    '\u2A53': MO.BIN4,       // double logical and
    '\u2A54': MO.BIN4,       // double logical or
    '\u2A55': MO.BIN4,       // two intersecting logical and
    '\u2A56': MO.BIN4,       // two intersecting logical or
    '\u2A57': MO.BIN4,       // sloping large or
    '\u2A58': MO.BIN4,       // sloping large and
    '\u2A59': MO.REL,        // logical or overlapping logical and
    '\u2A5A': MO.BIN4,       // logical and with middle stem
    '\u2A5B': MO.BIN4,       // logical or with middle stem
    '\u2A5C': MO.BIN4,       // logical and with horizontal dash
    '\u2A5D': MO.BIN4,       // logical or with horizontal dash
    '\u2A5E': MO.BIN4,       // logical and with double overbar
    '\u2A5F': MO.BIN4,       // logical and with underbar
    '\u2A60': MO.BIN4,       // logical and with double underbar
    '\u2A61': MO.BIN4,       // small vee with underbar
    '\u2A62': MO.BIN4,       // logical or with double overbar
    '\u2A63': MO.BIN4,       // logical or with double underbar
    '\u2A64': MO.BIN4,       // z notation domain antirestriction
    '\u2A65': MO.BIN4,       // z notation range antirestriction
    '\u2A66': MO.REL,        // equals sign with dot below
    '\u2A67': MO.REL,        // identical with dot above
    '\u2A68': MO.REL,        // triple horizontal bar with double vertical stroke
    '\u2A69': MO.REL,        // triple horizontal bar with triple vertical stroke
    '\u2A6A': MO.REL,        // tilde operator with dot above
    '\u2A6B': MO.REL,        // tilde operator with rising dots
    '\u2A6C': MO.REL,        // similar minus similar
    '\u2A6D': MO.REL,        // congruent with dot above
    '\u2A6E': MO.REL,        // equals with asterisk
    '\u2A6F': MO.REL,        // almost equal to with circumflex accent
    '\u2A70': MO.REL,        // approximately equal or equal to
    '\u2A71': MO.BIN4,       // equals sign above plus sign
    '\u2A72': MO.BIN4,       // plus sign above equals sign
    '\u2A73': MO.REL,        // equals sign above tilde operator
    '\u2A74': MO.REL,        // double colon equal
    '\u2A75': MO.REL,        // two consecutive equals signs
    '\u2A76': MO.REL,        // three consecutive equals signs
    '\u2A77': MO.REL,        // equals sign with two dots above and two dots below
    '\u2A78': MO.REL,        // equivalent with four dots above
    '\u2A79': MO.REL,        // less-than with circle inside
    '\u2A7A': MO.REL,        // greater-than with circle inside
    '\u2A7B': MO.REL,        // less-than with question mark above
    '\u2A7C': MO.REL,        // greater-than with question mark above
    '\u2A7D': MO.REL,        // less-than or slanted equal to
    '\u2A7D\u0338': MO.REL,  // less-than or slanted equal to with slash
    '\u2A7E': MO.REL,        // greater-than or slanted equal to
    '\u2A7E\u0338': MO.REL,  // greater-than or slanted equal to with slash
    '\u2A7F': MO.REL,        // less-than or slanted equal to with dot inside
    '\u2A80': MO.REL,        // greater-than or slanted equal to with dot inside
    '\u2A81': MO.REL,        // less-than or slanted equal to with dot above
    '\u2A82': MO.REL,        // greater-than or slanted equal to with dot above
    '\u2A83': MO.REL,        // less-than or slanted equal to with dot above right
    '\u2A84': MO.REL,        // greater-than or slanted equal to with dot above left
    '\u2A85': MO.REL,        // less-than or approximate
    '\u2A86': MO.REL,        // greater-than or approximate
    '\u2A87': MO.REL,        // less-than and single-line not equal to
    '\u2A88': MO.REL,        // greater-than and single-line not equal to
    '\u2A89': MO.REL,        // less-than and not approximate
    '\u2A8A': MO.REL,        // greater-than and not approximate
    '\u2A8B': MO.REL,        // less-than above double-line equal above greater-than
    '\u2A8C': MO.REL,        // greater-than above double-line equal above less-than
    '\u2A8D': MO.REL,        // less-than above similar or equal
    '\u2A8E': MO.REL,        // greater-than above similar or equal
    '\u2A8F': MO.REL,        // less-than above similar above greater-than
    '\u2A90': MO.REL,        // greater-than above similar above less-than
    '\u2A91': MO.REL,        // less-than above greater-than above double-line equal
    '\u2A92': MO.REL,        // greater-than above less-than above double-line equal
    '\u2A93': MO.REL,        // less-than above slanted equal above greater-than above slanted equal
    '\u2A94': MO.REL,        // greater-than above slanted equal above less-than above slanted equal
    '\u2A95': MO.REL,        // slanted equal to or less-than
    '\u2A96': MO.REL,        // slanted equal to or greater-than
    '\u2A97': MO.REL,        // slanted equal to or less-than with dot inside
    '\u2A98': MO.REL,        // slanted equal to or greater-than with dot inside
    '\u2A99': MO.REL,        // double-line equal to or less-than
    '\u2A9A': MO.REL,        // double-line equal to or greater-than
    '\u2A9B': MO.REL,        // double-line slanted equal to or less-than
    '\u2A9C': MO.REL,        // double-line slanted equal to or greater-than
    '\u2A9D': MO.REL,        // similar or less-than
    '\u2A9E': MO.REL,        // similar or greater-than
    '\u2A9F': MO.REL,        // similar above less-than above equals sign
    '\u2AA0': MO.REL,        // similar above greater-than above equals sign
    '\u2AA1': MO.REL,        // double nested less-than
    '\u2AA1\u0338': MO.REL,  // double nested less-than with slash
    '\u2AA2': MO.REL,        // double nested greater-than
    '\u2AA2\u0338': MO.REL,  // double nested greater-than with slash
    '\u2AA3': MO.REL,        // double nested less-than with underbar
    '\u2AA4': MO.REL,        // greater-than overlapping less-than
    '\u2AA5': MO.REL,        // greater-than beside less-than
    '\u2AA6': MO.REL,        // less-than closed by curve
    '\u2AA7': MO.REL,        // greater-than closed by curve
    '\u2AA8': MO.REL,        // less-than closed by curve above slanted equal
    '\u2AA9': MO.REL,        // greater-than closed by curve above slanted equal
    '\u2AAA': MO.REL,        // smaller than
    '\u2AAB': MO.REL,        // larger than
    '\u2AAC': MO.REL,        // smaller than or equal to
    '\u2AAD': MO.REL,        // larger than or equal to
    '\u2AAE': MO.REL,        // equals sign with bumpy above
    '\u2AAF': MO.REL,        // precedes above single-line equals sign
    '\u2AAF\u0338': MO.REL,  // precedes above single-line equals sign with slash
    '\u2AB0': MO.REL,        // succeeds above single-line equals sign
    '\u2AB0\u0338': MO.REL,  // succeeds above single-line equals sign with slash
    '\u2AB1': MO.REL,        // precedes above single-line not equal to
    '\u2AB2': MO.REL,        // succeeds above single-line not equal to
    '\u2AB3': MO.REL,        // precedes above equals sign
    '\u2AB4': MO.REL,        // succeeds above equals sign
    '\u2AB5': MO.REL,        // precedes above not equal to
    '\u2AB6': MO.REL,        // succeeds above not equal to
    '\u2AB7': MO.REL,        // precedes above almost equal to
    '\u2AB8': MO.REL,        // succeeds above almost equal to
    '\u2AB9': MO.REL,        // precedes above not almost equal to
    '\u2ABA': MO.REL,        // succeeds above not almost equal to
    '\u2ABB': MO.REL,        // double precedes
    '\u2ABC': MO.REL,        // double succeeds
    '\u2ABD': MO.REL,        // subset with dot
    '\u2ABE': MO.REL,        // superset with dot
    '\u2ABF': MO.REL,        // subset with plus sign below
    '\u2AC0': MO.REL,        // superset with plus sign below
    '\u2AC1': MO.REL,        // subset with multiplication sign below
    '\u2AC2': MO.REL,        // superset with multiplication sign below
    '\u2AC3': MO.REL,        // subset of or equal to with dot above
    '\u2AC4': MO.REL,        // superset of or equal to with dot above
    '\u2AC5': MO.REL,        // subset of above equals sign
    '\u2AC6': MO.REL,        // superset of above equals sign
    '\u2AC7': MO.REL,        // subset of above tilde operator
    '\u2AC8': MO.REL,        // superset of above tilde operator
    '\u2AC9': MO.REL,        // subset of above almost equal to
    '\u2ACA': MO.REL,        // superset of above almost equal to
    '\u2ACB': MO.REL,        // subset of above not equal to
    '\u2ACC': MO.REL,        // superset of above not equal to
    '\u2ACD': MO.REL,        // square left open box operator
    '\u2ACE': MO.REL,        // square right open box operator
    '\u2ACF': MO.REL,        // closed subset
    '\u2AD0': MO.REL,        // closed superset
    '\u2AD1': MO.REL,        // closed subset or equal to
    '\u2AD2': MO.REL,        // closed superset or equal to
    '\u2AD3': MO.REL,        // subset above superset
    '\u2AD4': MO.REL,        // superset above subset
    '\u2AD5': MO.REL,        // subset above subset
    '\u2AD6': MO.REL,        // superset above superset
    '\u2AD7': MO.REL,        // superset beside subset
    '\u2AD8': MO.REL,        // superset beside and joined by dash with subset
    '\u2AD9': MO.REL,        // element of opening downwards
    '\u2ADA': MO.REL,        // pitchfork with tee top
    '\u2ADB': MO.REL,        // transversal intersection
    '\u2ADD': MO.REL,        // nonforking
    '\u2ADD\u0338': MO.REL,  // nonforking with slash
    '\u2ADE': MO.REL,        // short left tack
    '\u2ADF': MO.REL,        // short down tack
    '\u2AE0': MO.REL,        // short up tack
    '\u2AE1': MO.REL,        // perpendicular with s
    '\u2AE2': MO.REL,        // vertical bar triple right turnstile
    '\u2AE3': MO.REL,        // double vertical bar left turnstile
    '\u2AE4': MO.REL,        // vertical bar double left turnstile
    '\u2AE5': MO.REL,        // double vertical bar double left turnstile
    '\u2AE6': MO.REL,        // long dash from left member of double vertical
    '\u2AE7': MO.REL,        // short down tack with overbar
    '\u2AE8': MO.REL,        // short up tack with underbar
    '\u2AE9': MO.REL,        // short up tack above short down tack
    '\u2AEA': MO.REL,        // double down tack
    '\u2AEB': MO.REL,        // double up tack
    '\u2AEC': MO.REL,        // double stroke not sign
    '\u2AED': MO.REL,        // reversed double stroke not sign
    '\u2AEE': MO.REL,        // does not divide with reversed negation slash
    '\u2AEF': MO.REL,        // vertical line with circle above
    '\u2AF0': MO.REL,        // vertical line with circle below
    '\u2AF1': MO.REL,        // down tack with circle below
    '\u2AF2': MO.REL,        // parallel with horizontal stroke
    '\u2AF3': MO.REL,        // parallel with tilde operator
    '\u2AF4': MO.BIN4,       // triple vertical bar binary relation
    '\u2AF5': MO.BIN4,       // triple vertical bar with horizontal stroke
    '\u2AF6': MO.BIN4,       // triple colon operator
    '\u2AF7': MO.REL,        // triple nested less-than
    '\u2AF8': MO.REL,        // triple nested greater-than
    '\u2AF9': MO.REL,        // double-line slanted less-than or equal to
    '\u2AFA': MO.REL,        // double-line slanted greater-than or equal to
    '\u2AFB': MO.BIN4,       // triple solidus binary relation
    '\u2AFD': MO.BIN4,       // double solidus operator
    '\u2AFE': MO.BIN3,       // white vertical bar
    '\u2B45': MO.RELSTRETCH, // leftwards quadruple arrow
    '\u2B46': MO.RELSTRETCH, // rightwards quadruple arrow
    '\u3008': MO.OPEN,       // langle
    '\u3009': MO.CLOSE,      // rangle
    '\uFE37': MO.WIDEACCENT, // horizontal brace down
    '\uFE38': MO.WIDEACCENT, // horizontal brace up
  }
};

//
//  These are not in the W3C table, but we need them for \widehat and \underline
//
OPTABLE.infix['^'] = MO.WIDEREL;
OPTABLE.infix['_'] = MO.WIDEREL;

//
//  Remove from Appendix C, but perhaps that was a mistake?
//
OPTABLE.infix['\u2ADC'] = MO.REL;
