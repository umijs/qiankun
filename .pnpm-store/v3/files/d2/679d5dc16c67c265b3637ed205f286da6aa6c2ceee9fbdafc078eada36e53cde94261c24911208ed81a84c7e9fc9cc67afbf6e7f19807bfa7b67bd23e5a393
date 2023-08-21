/*************************************************************
 *
 *  Copyright (c) 2020-2022 The MathJax Consortium
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
 * @fileoverview  Support functions for the safe extension
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {length2em} from '../../util/lengths.js';
import {Safe, FilterFunction} from './safe.js';

/**
 * The default attribute-filtering functions
 */
export const SafeMethods: {[name: string]: FilterFunction<any, any, any>} = {

  /**
   * Filter HREF URL's
   *
   * @param {Safe<N,T,D>} safe  The Safe object being used
   * @param {string} url        The URL being tested
   * @return {string|null}      The URL if OK and null if not
   *
   * @template N  The HTMLElement node class
   * @template T  The Text node class
   * @template D  The Document class
   */
  filterURL<N, T, D>(safe: Safe<N, T, D>, url: string): string | null {
    const protocol = (url.match(/^\s*([a-z]+):/i) || [null, ''])[1].toLowerCase();
    const allow = safe.allow.URLs;
    return (allow === 'all' || (allow === 'safe' &&
                                (safe.options.safeProtocols[protocol] || !protocol))) ? url : null;
  },

  /**
   * Filter a class list
   *
   * @param {Safe<N,T,D>} safe  The Safe object being used
   * @param {string} list       The class list being tested
   * @return {string|null}      The class list if OK and null if not
   *
   * @template N  The HTMLElement node class
   * @template T  The Text node class
   * @template D  The Document class
   */
  filterClassList<N, T, D>(safe: Safe<N, T, D>, list: string): string | null {
    const classes = list.trim().replace(/\s\s+/g, ' ').split(/ /);
    return classes.map((name) => this.filterClass(safe, name) || '').join(' ').trim().replace(/\s\s+/g, '');
  },

  /**
   * Filter a class name
   *
   * @param {Safe<N,T,D>} safe  The Safe object being used
   * @param {string} CLASS      The class being tested
   * @return {string|null}      The class if OK and null if not
   *
   * @template N  The HTMLElement node class
   * @template T  The Text node class
   * @template D  The Document class
   */
  filterClass<N, T, D>(safe: Safe<N, T, D>, CLASS: string): string | null {
    const allow = safe.allow.classes;
    return (allow === 'all' || (allow === 'safe' && CLASS.match(safe.options.classPattern))) ? CLASS : null;
  },

  /**
   * Filter ids
   *
   * @param {Safe<N,T,D>} safe  The Safe object being used
   * @param {string} id         The id being tested
   * @return {string|null}      The id if OK and null if not
   *
   * @template N  The HTMLElement node class
   * @template T  The Text node class
   * @template D  The Document class
   */
  filterID<N, T, D>(safe: Safe<N, T, D>, id: string): string | null {
    const allow = safe.allow.cssIDs;
    return (allow === 'all' || (allow === 'safe' && id.match(safe.options.idPattern))) ? id : null;
  },

  /**
   * Filter style strings
   *
   * @param {Safe<N,T,D>} safe  The Safe object being used
   * @param {string} styles     The style string being tested
   * @return {string}           The sanitized style string
   *
   * @template N  The HTMLElement node class
   * @template T  The Text node class
   * @template D  The Document class
   */
  filterStyles<N, T, D>(safe: Safe<N, T, D>, styles: string): string {
    if (safe.allow.styles === 'all') return styles;
    if (safe.allow.styles !== 'safe') return null;
    const adaptor = safe.adaptor;
    const options = safe.options;
    try {
      //
      //  Create div1 with styles set to the given styles, and div2 with blank styles
      //
      const div1 = adaptor.node('div', {style: styles});
      const div2 = adaptor.node('div');
      //
      //  Check each allowed style and transfer OK ones to div2
      //  If the style has Top/Right/Bottom/Left, look at all four separately
      //
      for (const style of Object.keys(options.safeStyles)) {
        if (options.styleParts[style]) {
          for (const sufix of ['Top', 'Right', 'Bottom', 'Left']) {
            const name = style + sufix;
            const value = this.filterStyle(safe, name, div1);
            if (value) {
              adaptor.setStyle(div2, name, value);
            }
          }
        } else {
          const value = this.filterStyle(safe, style, div1);
          if (value) {
            adaptor.setStyle(div2, style, value);
          }
        }
      }
      //
      //  Return the div2 style string
      //
      styles = adaptor.allStyles(div2);
    } catch (err) {
      styles = '';
    }
    return styles;
  },

  /**
   * Filter an individual name:value style pair
   *
   * @param {Safe<N,T,D>} safe  The Safe object being used
   * @param {string} style      The style name being tested
   * @param {N} div             The temp DIV node containing the style object to be tested
   * @return {string|null}      The sanitized style string or null if invalid
   *
   * @template N  The HTMLElement node class
   * @template T  The Text node class
   * @template D  The Document class
   */
  filterStyle<N, T, D>(safe: Safe<N, T, D>, style: string, div: N): string | null {
    const value = safe.adaptor.getStyle(div, style);
    if (typeof value !== 'string' || value === '' || value.match(/^\s*calc/) ||
        (value.match(/javascript:/) && !safe.options.safeProtocols.javascript) ||
        (value.match(/data:/) && !safe.options.safeProtocols.data)) {
      return null;
    }
    const name = style.replace(/Top|Right|Left|Bottom/, '');
    if (!safe.options.safeStyles[style] && !safe.options.safeStyles[name]) {
      return null;
    }
    return this.filterStyleValue(safe, style, value, div);
  },

  /**
   * Filter a style's value, handling compound values (e.g., borders that have widths as well as styles and colors)
   *
   * @param {Safe<N,T,D>} safe  The Safe object being used
   * @param {string} style      The style name being tested
   * @param {string} value      The value of the style to test
   * @param {N} div             The temp DIV node containing the style object to be tested
   * @return {string|null}      The sanitized style string or null if invalid
   *
   * @template N  The HTMLElement node class
   * @template T  The Text node class
   * @template D  The Document class
   */
  filterStyleValue<N, T, D>(safe: Safe<N, T, D>, style: string, value: string, div: N): string | null {
    const name = safe.options.styleLengths[style];
    if (!name) {
      return value;
    }
    if (typeof name !== 'string') {
      return this.filterStyleLength(safe, style, value);
    }
    const length = this.filterStyleLength(safe, name, safe.adaptor.getStyle(div, name));
    if (!length) {
      return null;
    }
    safe.adaptor.setStyle(div, name, length);
    return safe.adaptor.getStyle(div, style);
  },

  /**
   * Filter a length value
   *
   * @param {Safe<N,T,D>} safe  The Safe object being used
   * @param {string} style      The style name being tested
   * @param {string} value      The value of the style to test
   * @return {string|null}      The sanitized length value
   *
   * @template N  The HTMLElement node class
   * @template T  The Text node class
   * @template D  The Document class
   */
  filterStyleLength<N, T, D>(safe: Safe<N, T, D>, style: string, value: string): string | null {
    if (!value.match(/^(.+)(em|ex|ch|rem|px|mm|cm|in|pt|pc|%)$/)) return null;
    const em = length2em(value, 1);
    const lengths = safe.options.styleLengths[style];
    const [m, M] = (Array.isArray(lengths) ? lengths : [-safe.options.lengthMax, safe.options.lengthMax]);
    return (m <= em && em <= M ? value : (em < m ? m : M).toFixed(3).replace(/\.?0+$/, '') + 'em');
  },

  /**
   * Filter a font size
   *
   * @param {Safe<N,T,D>} safe  The Safe object being used
   * @param {string} size       The font size to test
   * @return {string|null}      The sanitized style string or null if invalid
   *
   * @template N  The HTMLElement node class
   * @template T  The Text node class
   * @template D  The Document class
   */
  filterFontSize<N, T, D>(safe: Safe<N, T, D>, size: string): string | null {
    return this.filterStyleLength(safe, 'fontSize', size);
  },

  /**
   * Filter scriptsizemultiplier
   *
   * @param {Safe<N,T,D>} safe  The Safe object being used
   * @param {string} size       The script size multiplier to test
   * @return {string}           The sanitized size
   *
   * @template N  The HTMLElement node class
   * @template T  The Text node class
   * @template D  The Document class
   */
  filterSizeMultiplier<N, T, D>(safe: Safe<N, T, D>, size: string): string {
    const [m, M] = safe.options.scriptsizemultiplierRange || [-Infinity, Infinity];
    return Math.min(M, Math.max(m, parseFloat(size))).toString();
  },

  /**
   *  Filter scriptLevel
   *
   * @param {Safe<N,T,D>} safe  The Safe object being used
   * @param {string} size       The scriptlevel to test
   * @return {string|null}      The sanitized scriptlevel or null
   *
   * @template N  The HTMLElement node class
   * @template T  The Text node class
   * @template D  The Document class
   */
  filterScriptLevel<N, T, D>(safe: Safe<N, T, D>, level: string): string | null {
    const [m, M] = safe.options.scriptlevelRange || [-Infinity, Infinity];
    return Math.min(M, Math.max(m, parseInt(level))).toString();
  },

  /**
   * Filter a data-* attribute
   *
   * @param {Safe<N,T,D>} safe  The Safe object being used
   * @param {string} value      The attribute's value
   * @param {string} id         The attribute's id (e.g., data-mjx-variant)
   * @return {number|null}      The sanitized value or null
   *
   * @template N  The HTMLElement node class
   * @template T  The Text node class
   * @template D  The Document class
   */
  filterData<N, T, D>(safe: Safe<N, T, D>, value: string, id: string): string | null {
    return (id.match(safe.options.dataPattern) ? value : null);
  }

};
