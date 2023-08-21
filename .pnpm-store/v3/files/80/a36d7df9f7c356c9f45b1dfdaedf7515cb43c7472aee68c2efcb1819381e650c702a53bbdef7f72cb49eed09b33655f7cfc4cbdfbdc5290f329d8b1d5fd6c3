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
 * @fileoverview  Implements the CssStyles class for handling stylesheets
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

/**
 * The data for a selector
 */
export type StyleData = {
  [property: string]: string | number;
};

/**
 * A list of selectors and their data (basically a stylesheet)
 */
export type StyleList = {
  [selector: string]: StyleData;
};

/******************************************************************************/
/**
 * The CssStyles class (for managing a collection of CSS style definitions)
 */

export class CssStyles {
  /**
   * The styles as they currently stand
   */
  protected styles: StyleList = {};

  /**
   * @return {string}  The styles as a CSS string
   */
  get cssText(): string {
    return this.getStyleString();
  }

  /**
   * @param {StyleList} styles  The initial styles to use, if any
   * @constructor
   */
  constructor(styles: StyleList = null) {
    this.addStyles(styles);
  }

  /**
   * @param {StyleList} styles  The styles to combine with the existing ones
   */
  public addStyles(styles: StyleList) {
    if (!styles) return;
    for (const style of Object.keys(styles)) {
      if (!this.styles[style]) {
        this.styles[style] = {};
      }
      Object.assign(this.styles[style], styles[style]);
    }
  }

  /**
   * @param {string[]} selectors  The selectors for the styles to remove
   */
  public removeStyles(...selectors: string[]) {
    for (const selector of selectors) {
      delete this.styles[selector];
    }
  }

  /**
   * Clear all the styles
   */
  public clear() {
    this.styles = {};
  }

  /**
   * @return {string} The CSS string for the style list
   */
  public getStyleString(): string {
    return this.getStyleRules().join('\n\n');
  }

  /**
   * @return {string[]}  An array of rule strings for the style list
   */
  public getStyleRules(): string[] {
    const selectors = Object.keys(this.styles);
    const defs: string[] = new Array(selectors.length);
    let i = 0;
    for (const selector of selectors) {
      defs[i++] = selector + ' {\n' + this.getStyleDefString(this.styles[selector]) + '\n}';
    }
    return defs;
  }

  /**
   * @param {StyleData} styles  The style data to be stringified
   * @return {string}           The CSS string for the given data
   */
  public getStyleDefString(styles: StyleData): string {
    const properties = Object.keys(styles);
    const values: string[] = new Array(properties.length);
    let i = 0;
    for (const property of properties) {
      values[i++] = '  ' + property + ': ' + styles[property] + ';';
    }
    return values.join('\n');
  }

}
