/*************************************************************
 *
 *  Copyright (c) 2018-2022 Omar Al-Ithawi and The MathJax Consortium
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
 * @fileoverview Utility functions and classes for the color package.
 *
 * @author i@omardo.com (Omar Al-Ithawi)
 */


import TexError from '../TexError.js';
import {COLORS} from './ColorConstants.js';

type ColorModelProcessor = (def: string) => string;
const ColorModelProcessors: Map<string, ColorModelProcessor> = new Map<string, ColorModelProcessor>();


export class ColorModel {

  /**
   * User defined colors.
   *
   * This variable is local to the parser, so two parsers in the same
   * JavaScript thread can have two different sets of user-defined colors.
   */
  private userColors: Map<string, string> = new Map<string, string>();

  /**
   * Converts a color model from string representation to its CSS format `#44ff00`
   *
   * @param {string} model The coloring model type: `rgb` `RGB` or `gray`.
   * @param {string} def The color definition: `0.5,0,1`, `128,0,255`, `0.5`.
   * @return {string} The color definition in CSS format e.g. `#44ff00`.
   */
  private normalizeColor(model: string, def: string): string {
    if (!model || model === 'named') {
      // Allow to define colors directly by using the CSS format e.g. `#888`
      return def;
    }

    if (ColorModelProcessors.has(model)) {
      const modelProcessor = ColorModelProcessors.get(model);
      return modelProcessor(def);
    }

    throw new TexError('UndefinedColorModel', 'Color model \'%1\' not defined', model);
  }

  /**
   * Look up a color based on its model and definition.
   *
   * @param {string} model The coloring model type: `named`, `rgb` `RGB` or `gray`.
   * @param {string} def The color definition: `red, `0.5,0,1`, `128,0,255`, `0.5`.
   * @return {string} The color definition in CSS format e.g. `#44ff00`.
   */
  public getColor(model: string, def: string): string {
    if (!model || model === 'named') {
      return this.getColorByName(def);
    }

    return this.normalizeColor(model, def);
  }

  /**
   * Get a named color.
   *
   * @param {string} name The color name e.g. `darkblue`.
   * @return {string} The color definition in CSS format e.g. `#44ff00`.
   *
   * To retain backward compatilbity with MathJax v2 this method returns
   * unknown as-is, this is useful for both passing through CSS format colors like `#ff0`,
   * or even standard CSS color names that this plugin is unaware of.
   *
   * In TeX format, this would help to let `\textcolor{#f80}{\text{Orange}}` show an
   * orange word.
   */
  private getColorByName(name: string): string {
    if (this.userColors.has(name)) {
      return this.userColors.get(name);
    }

    if (COLORS.has(name)) {
      return COLORS.get(name);
    }

    // Pass the color name as-is to CSS
    return name;
  }

  /**
   * Create a new user-defined color.
   *
   * This color is local to the parser, so another MathJax parser won't be poluted.
   *
   * @param {string} model The coloring model type: e.g. `rgb`, `RGB` or `gray`.
   * @param {string} name The color name: `darkblue`.
   * @param {string} def The color definition in the color model format: `128,0,255`.
   */
  public defineColor(model: string, name: string, def: string) {
    const normalized = this.normalizeColor(model, def);
    this.userColors.set(name, normalized);
  }
}


/**
 * Get an rgb color.
 *
 * @param {OptionList} parserOptions The parser options object.
 * @param {string} rgb The color definition in rgb: `0.5,0,1`.
 * @return {string} The color definition in CSS format e.g. `#44ff00`.
 */
ColorModelProcessors.set('rgb', function (rgb: string): string {
  const rgbParts: string[] = rgb.trim().split(/\s*,\s*/);
  let RGB: string = '#';

  if (rgbParts.length !== 3) {
    throw new TexError('ModelArg1', 'Color values for the %1 model require 3 numbers', 'rgb');
  }

  for (const rgbPart of rgbParts) {
    if (!rgbPart.match(/^(\d+(\.\d*)?|\.\d+)$/)) {
      throw new TexError('InvalidDecimalNumber', 'Invalid decimal number');
    }

    const n = parseFloat(rgbPart);
    if (n < 0 || n > 1) {
      throw new TexError('ModelArg2',
                         'Color values for the %1 model must be between %2 and %3',
                         'rgb', '0', '1');
    }

    let pn = Math.floor(n * 255).toString(16);
    if (pn.length < 2) {
      pn = '0' + pn;
    }

    RGB += pn;
  }

  return RGB;
});

/**
 * Get an RGB color.
 *
 * @param {OptionList} parserOptions The parser options object.
 * @param {string} rgb The color definition in RGB: `128,0,255`.
 * @return {string} The color definition in CSS format e.g. `#44ff00`.
 */
ColorModelProcessors.set('RGB', function (rgb: string): string {
  const rgbParts: string[] = rgb.trim().split(/\s*,\s*/);
  let RGB = '#';

  if (rgbParts.length !== 3) {
    throw new TexError('ModelArg1', 'Color values for the %1 model require 3 numbers', 'RGB');
  }

  for (const rgbPart of rgbParts) {
    if (!rgbPart.match(/^\d+$/)) {
      throw new TexError('InvalidNumber', 'Invalid number');
    }

    const n = parseInt(rgbPart);
    if (n > 255) {
      throw new TexError('ModelArg2',
                         'Color values for the %1 model must be between %2 and %3',
                         'RGB', '0', '255');
    }

    let pn = n.toString(16);
    if (pn.length < 2) {
      pn = '0' + pn;
    }
    RGB += pn;
  }
  return RGB;
});

/**
 * Get a gray-scale value.
 *
 * @param {OptionList} parserOptions The parser options object.
 * @param {string} gray The color definition in RGB: `0.5`.
 * @return {string} The color definition in CSS format e.g. `#808080`.
 */
ColorModelProcessors.set('gray', function (gray: string): string {
  if (!gray.match(/^\s*(\d+(\.\d*)?|\.\d+)\s*$/)) {
    throw new TexError('InvalidDecimalNumber', 'Invalid decimal number');
  }

  const n: number = parseFloat(gray);
  if (n < 0 || n > 1) {
    throw new TexError('ModelArg2',
                       'Color values for the %1 model must be between %2 and %3',
                       'gray', '0', '1');
  }
  let pn = Math.floor(n * 255).toString(16);
  if (pn.length < 2) {
    pn = '0' + pn;
  }

  return `#${pn}${pn}${pn}`;
});
