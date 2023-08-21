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
 * @fileoverview  Implements the SVGFontData class for font data in SVG output.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CharMap, CharOptions, CharData, VariantData, DelimiterData, FontData} from '../common/FontData.js';
export * from '../common/FontData.js';

export type CharStringMap = {[name: number]: string};

/**
 * Add the extra data needed for CharOptions in SVG
 */
export interface SVGCharOptions extends CharOptions {
  c?: string;                   // the character value (overrides default value)
  p?: string;                   // svg path
}

/**
 * Shorthands for SVG char maps and char data
 */
export type SVGCharMap = CharMap<SVGCharOptions>;
export type SVGCharData = CharData<SVGCharOptions>;

/**
 * The extra data needed for a Variant in SVG output
 */
export interface SVGVariantData extends VariantData<SVGCharOptions> {
  cacheID: string;
}

/**
 * the extra data neede for a Delimiter in SVG output
 */
export interface SVGDelimiterData extends DelimiterData {
}


/****************************************************************************/

/**
 * The SVG FontData class
 */
export class SVGFontData extends FontData<SVGCharOptions, SVGVariantData, SVGDelimiterData> {

  /**
   * @override
   */
  public static OPTIONS = {
    ...FontData.OPTIONS,
    dynamicPrefix: './output/svg/fonts'
  };

  /**
   * @override
   */
  public static JAX = 'SVG';

  /**
   * @override
   */
  public static charOptions(font: SVGCharMap, n: number) {
    return super.charOptions(font, n) as SVGCharOptions;
  }

}

export type SVGFontDataClass = typeof SVGFontData;

/****************************************************************************/

/**
 * @param {CharMap} font        The font to augment
 * @param {CharStringMap} paths     The path data to use for each character
 * @param {CharStringMap} content   The string to use for remapped characters
 * @return {SVGCharMap}            The augmented font
 */
export function AddPaths(font: SVGCharMap, paths: CharStringMap, content: CharStringMap): SVGCharMap {
  for (const c of Object.keys(paths)) {
    const n = parseInt(c);
    SVGFontData.charOptions(font, n).p = paths[n];
  }
  for (const c of Object.keys(content)) {
    const n = parseInt(c);
    SVGFontData.charOptions(font, n).c = content[n];
  }
  return font;
}
