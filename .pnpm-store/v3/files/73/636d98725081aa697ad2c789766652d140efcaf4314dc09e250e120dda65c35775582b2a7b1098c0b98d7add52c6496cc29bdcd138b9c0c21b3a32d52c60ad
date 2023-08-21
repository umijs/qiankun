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
 * @fileoverview  Implements the CHTMLFontData class and AddCSS() function.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CharMap, CharOptions, CharData, VariantData, DelimiterData, FontData, DIRECTION} from '../common/FontData.js';
import {Usage} from './Usage.js';
import {StringMap} from './Wrapper.js';
import {StyleList, StyleData} from '../../util/StyleList.js';
import {em} from '../../util/lengths.js';

export * from '../common/FontData.js';

/****************************************************************************/

/**
 * Add the extra data needed for CharOptions in CHTML
 */
export interface CHTMLCharOptions extends CharOptions {
  c?: string;                   // the content value (for css)
  f?: string;                   // the font postfix (for css)
}

/**
 * Shorthands for CHTML char maps and char data
 */
export type CHTMLCharMap = CharMap<CHTMLCharOptions>;
export type CHTMLCharData = CharData<CHTMLCharOptions>;

/**
 * The extra data needed for a Variant in CHTML output
 */
export interface CHTMLVariantData extends VariantData<CHTMLCharOptions> {
  classes?: string;             // the classes to use for this variant
  letter: string;               // the font letter(s) for the default font for this variant
}

/**
 * The extra data needed for a Delimiter in CHTML output
 */
export interface CHTMLDelimiterData extends DelimiterData {
}

/****************************************************************************/

/**
 * The CHTML FontData class
 */
export class CHTMLFontData extends FontData<CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData> {
  /**
   * Default options
   */
  public static OPTIONS = {
    ...FontData.OPTIONS,
    fontURL: 'js/output/chtml/fonts/tex-woff-v2'
  };

  /**
   * @override
   */
  public static JAX = 'CHTML';

  /**
   * The default class names to use for each variant
   */
  protected static defaultVariantClasses: StringMap = {};

  /**
   * The default font letter to use for each variant
   */
  protected static defaultVariantLetters: StringMap = {};

  /**
   * The CSS styles needed for this font.
   */
  protected static defaultStyles = {
    'mjx-c::before': {
      display: 'block',
      width: 0
    }
  };

  /**
   * The default @font-face declarations with %%URL%% where the font path should go
   */
  protected static defaultFonts = {
    '@font-face /* 0 */': {
      'font-family': 'MJXZERO',
      src: 'url("%%URL%%/MathJax_Zero.woff") format("woff")'
    }
  };

  /***********************************************************************/

  /**
   * Data about the characters used (for adaptive CSS)
   */
  public charUsage: Usage<[string, number]> = new Usage<[string, number]>();

  /**
   * Data about the delimiters used (for adpative CSS)
   */
  public delimUsage: Usage<number> = new Usage<number>();

  /***********************************************************************/

  /**
   * @override
   */
  public static charOptions(font: CHTMLCharMap, n: number) {
    return super.charOptions(font, n) as CHTMLCharOptions;
  }

  /***********************************************************************/

  /**
   * @param {boolean} adapt   Whether to use adaptive CSS or not
   */
  public adaptiveCSS(adapt: boolean) {
    this.options.adaptiveCSS = adapt;
  }

  /**
   * Clear the cache of which characters have been used
   */
  public clearCache() {
    if (this.options.adaptiveCSS) {
      this.charUsage.clear();
      this.delimUsage.clear();
    }
  }

  /**
   * @override
   */
  public createVariant(name: string, inherit: string = null, link: string = null) {
    super.createVariant(name, inherit, link);
    let CLASS = (this.constructor as CHTMLFontDataClass);
    this.variant[name].classes = CLASS.defaultVariantClasses[name];
    this.variant[name].letter = CLASS.defaultVariantLetters[name];
  }

  /**
   * @override
   */
  public defineChars(name: string, chars: CHTMLCharMap) {
    super.defineChars(name, chars);
    const letter = this.variant[name].letter;
    for (const n of Object.keys(chars)) {
      const options = CHTMLFontData.charOptions(chars, parseInt(n));
      if (options.f === undefined) {
        options.f = letter;
      }
    }
  }

  /***********************************************************************/

  /**
   * @return {StyleList}  The (computed) styles for this font
   */
  get styles(): StyleList {
    const CLASS = this.constructor as typeof CHTMLFontData;
    //
    //  Include the default styles
    //
    const styles: StyleList = {...CLASS.defaultStyles};
    //
    //  Add fonts with proper URL
    //
    this.addFontURLs(styles, CLASS.defaultFonts, this.options.fontURL);
    //
    //  Add the styles for delimiters and characters
    //
    if (this.options.adaptiveCSS) {
      this.updateStyles(styles);
    } else {
      this.allStyles(styles);
    }
    //
    //  Return the final style sheet
    //
    return styles;
  }

  /**
   * Get the styles for any newly used characters and delimiters
   *
   * @param {StyleList} styles  The style list to add delimiter styles to.
   * @return {StyleList}        The modified style list.
   */
  public updateStyles(styles: StyleList): StyleList {
    for (const N of this.delimUsage.update()) {
      this.addDelimiterStyles(styles, N, this.delimiters[N]);
    }
    for (const [name, N] of this.charUsage.update()) {
      const variant = this.variant[name];
      this.addCharStyles(styles, variant.letter, N, variant.chars[N]);
    }
    return styles;
  }

  /**
   * @param {StyleList} styles  The style list to add characters to
   */
  protected allStyles(styles: StyleList) {
    //
    //  Create styles needed for the delimiters
    //
    for (const n of Object.keys(this.delimiters)) {
      const N = parseInt(n);
      this.addDelimiterStyles(styles, N, this.delimiters[N]);
    }
    //
    //  Add style for all character data
    //
    for (const name of Object.keys(this.variant)) {
      const variant = this.variant[name];
      const vletter = variant.letter;
      for (const n of Object.keys(variant.chars)) {
        const N = parseInt(n);
        const char = variant.chars[N];
        if ((char[3] || {}).smp) continue;
        if (char.length < 4) {
          (char as CHTMLCharData)[3] = {};
        }
        this.addCharStyles(styles, vletter, N, char);
      }
    }
  }

  /**
   * @param {StyleList} styles    The style object to add styles to
   * @param {StyleList} fonts     The default font-face directives with %%URL%% where the url should go
   * @param {string} url          The actual URL to insert into the src strings
   */
  protected addFontURLs(styles: StyleList, fonts: StyleList, url: string) {
    for (const name of Object.keys(fonts)) {
      const font = {...fonts[name]};
      font.src = (font.src as string).replace(/%%URL%%/, url);
      styles[name] = font;
    }
  }

  /*******************************************************/

  /**
   * @param {StyleList} styles         The style object to add styles to
   * @param {number} n                 The unicode character number of the delimiter
   * @param {CHTMLDelimiterData} data  The data for the delimiter whose CSS is to be added
   */
  protected addDelimiterStyles(styles: StyleList, n: number, data: CHTMLDelimiterData) {
    let c = this.charSelector(n);
    if (data.c && data.c !== n) {
      c = this.charSelector(data.c);
      styles['.mjx-stretched mjx-c' + c + '::before'] = {
        content: this.charContent(data.c)
      };
    }
    if (!data.stretch) return;
    if (data.dir === DIRECTION.Vertical) {
      this.addDelimiterVStyles(styles, c, data);
    } else {
      this.addDelimiterHStyles(styles, c, data);
    }
  }

  /*******************************************************/

  /**
   * @param {StyleList} styles         The style object to add styles to
   * @param {string} c                 The delimiter character string
   * @param {CHTMLDelimiterData} data  The data for the delimiter whose CSS is to be added
   */
  protected addDelimiterVStyles(styles: StyleList, c: string, data: CHTMLDelimiterData) {
    const HDW = data.HDW as CHTMLCharData;
    const [beg, ext, end, mid] = data.stretch;
    const Hb = this.addDelimiterVPart(styles, c, 'beg', beg, HDW);
    this.addDelimiterVPart(styles, c, 'ext', ext, HDW);
    const He = this.addDelimiterVPart(styles, c, 'end', end, HDW);
    const css: StyleData = {};
    if (mid) {
      const Hm = this.addDelimiterVPart(styles, c, 'mid', mid, HDW);
      css.height = '50%';
      styles['mjx-stretchy-v' + c + ' > mjx-mid'] = {
        'margin-top': this.em(-Hm / 2),
        'margin-bottom': this.em(-Hm / 2)
      };
    }
    if (Hb) {
      css['border-top-width'] = this.em0(Hb - .03);
    }
    if (He) {
      css['border-bottom-width'] = this.em0(He - .03);
      styles['mjx-stretchy-v' + c + ' > mjx-end'] = {'margin-top': this.em(-He)};
    }
    if (Object.keys(css).length) {
      styles['mjx-stretchy-v' + c + ' > mjx-ext'] = css;
    }
  }

  /**
   * @param {StyleList} styles  The style object to add styles to
   * @param {string} c          The vertical character whose part is being added
   * @param {string} part       The name of the part (beg, ext, end, mid) that is being added
   * @param {number} n          The unicode character to use for the part
   * @param {number} HDW        The height-depth-width data for the stretchy delimiter
   * @return {number}           The total height of the character
   */
  protected addDelimiterVPart(styles: StyleList, c: string, part: string, n: number, HDW: CHTMLCharData): number {
    if (!n) return 0;
    const data = this.getDelimiterData(n);
    const dw = (HDW[2] - data[2]) / 2;
    const css: StyleData = {content: this.charContent(n)};
    if (part !== 'ext') {
      css.padding = this.padding(data, dw);
    } else {
      css.width = this.em0(HDW[2]);
      if (dw) {
        css['padding-left'] = this.em0(dw);
      }
    }
    styles['mjx-stretchy-v' + c + ' mjx-' + part + ' mjx-c::before'] = css;
    return data[0] + data[1];
  }

  /*******************************************************/

  /**
   * @param {StyleList} styles         The style object to add styles to
   * @param {string} c                 The delimiter character string
   * @param {CHTMLDelimiterData} data  The data for the delimiter whose CSS is to be added
   */
  protected addDelimiterHStyles(styles: StyleList, c: string, data: CHTMLDelimiterData) {
    const [beg, ext, end, mid] = data.stretch;
    const HDW = data.HDW as CHTMLCharData;
    this.addDelimiterHPart(styles, c, 'beg', beg, HDW);
    this.addDelimiterHPart(styles, c, 'ext', ext, HDW);
    this.addDelimiterHPart(styles, c, 'end', end, HDW);
    if (mid) {
      this.addDelimiterHPart(styles, c, 'mid', mid, HDW);
      styles['mjx-stretchy-h' + c + ' > mjx-ext'] = {width: '50%'};
    }
  }

  /**
   * @param {StyleList} styles  The style object to add styles to
   * @param {string} c          The vertical character whose part is being added
   * @param {string} part       The name of the part (beg, ext, end, mid) that is being added
   * @param {number} n          The unicode character to use for the part
   * @param {CHTMLCharData} HDW The height-depth-width data for the stretchy character
   */
  protected addDelimiterHPart(styles: StyleList, c: string, part: string, n: number, HDW: CHTMLCharData) {
    if (!n) return;
    const data = this.getDelimiterData(n);
    const options = data[3] as CHTMLCharOptions;
    const css: StyleData = {content: (options && options.c ? '"' + options.c + '"' : this.charContent(n))};
    css.padding = this.padding(HDW as CHTMLCharData, 0, -HDW[2]);
    styles['mjx-stretchy-h' + c + ' mjx-' + part + ' mjx-c::before'] = css;
  }

  /*******************************************************/

  /**
   * @param {StyleList} styles  The style object to add styles to
   * @param {string} vletter    The variant class letter (e.g., `B`, `SS`) where this character is being defined
   * @param {number} n          The unicode character being defined
   * @param {CHTMLCharData} data     The bounding box data and options for the character
   */
  protected addCharStyles(styles: StyleList, vletter: string, n: number, data: CHTMLCharData) {
    const options = data[3] as CHTMLCharOptions;
    const letter = (options.f !== undefined ? options.f : vletter);
    const selector = 'mjx-c' + this.charSelector(n) + (letter ? '.TEX-' + letter : '');
    styles[selector + '::before'] = {
      padding: this.padding(data, 0, options.ic || 0),
      content: (options.c != null ? '"' + options.c + '"' : this.charContent(n))
    };
  }

  /***********************************************************************/

  /**
   * @param {number} n         The character number to find
   * @return {CHTMLCharData}   The data for that character to be used for stretchy delimiters
   */
  protected getDelimiterData(n: number): CHTMLCharData {
    return this.getChar('-smallop', n);
  }

  /**
   * @param {number} n  The number of ems
   * @return {string}   The string representing the number with units of "em"
   */
  public em(n: number): string {
    return em(n);
  }

  /**
   * @param {number} n  The number of ems (will be restricted to non-negative values)
   * @return {string}   The string representing the number with units of "em"
   */
  public em0(n: number): string {
    return em(Math.max(0, n));
  }

  /**
   * @param {CHTMLCharData} data   The [h, d, w] data for the character
   * @param {number} dw            The (optional) left offset of the glyph
   * @param {number} ic            The (optional) italic correction value
   * @return {string}              The padding string for the h, d, w.
   */
  public padding([h, d, w]: CHTMLCharData, dw: number = 0, ic: number = 0): string {
    return [h, w + ic, d, dw].map(this.em0).join(' ');
  }

  /**
   * @param {number} n  A unicode code point to be converted to character content for use with the
   *                    CSS rules for fonts (either a literal character for most ASCII values, or \nnnn
   *                    for higher values, or for the double quote and backslash characters).
   * @return {string}   The character as a properly encoded string in quotes.
   */
  public charContent(n: number): string {
    return '"' + (n >= 0x20 && n <= 0x7E && n !== 0x22 && n !== 0x27 && n !== 0x5C ?
                  String.fromCharCode(n) : '\\' + n.toString(16).toUpperCase()) + '"';
  }

  /**
   * @param {number} n  A unicode code point to be converted to a selector for use with the
   *                    CSS rules for fonts
   * @return {string}   The character as a selector value.
   */
  public charSelector(n: number): string {
    return '.mjx-c' + n.toString(16).toUpperCase();
  }

}

/**
 * The CHTMLFontData constructor class
 */
export type CHTMLFontDataClass = typeof CHTMLFontData;

/****************************************************************************/

/**
 * Data needed for AddCSS()
 */
export type CharOptionsMap = {[name: number]: CHTMLCharOptions};
export type CssMap = {[name: number]: number};

/**
 * @param {CHTMLCharMap} font        The font to augment
 * @param {CharOptionsMap} options   Any additional options for characters in the font
 * @return {CHTMLCharMap}            The augmented font
 */
export function AddCSS(font: CHTMLCharMap, options: CharOptionsMap): CHTMLCharMap {
  for (const c of Object.keys(options)) {
    const n = parseInt(c);
    Object.assign(FontData.charOptions(font, n), options[n]);
  }
  return font;
}
