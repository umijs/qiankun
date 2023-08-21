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
 * @fileoverview  Utility functions for handling dimensions (lengths)
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

/**
 *  A very large number
 */
export const BIGDIMEN = 1000000;

/**
 *  Sizes of various units in pixels
 */
export const UNITS: {[unit: string]: number} = {
  px: 1,
  'in': 96,            // 96 px to an inch
  cm: 96 / 2.54,       // 2.54 cm to an inch
  mm: 96 / 25.4        // 10 mm to a cm
};

/**
 *  Sizes of various relative units in em's
 */
export const RELUNITS: {[unit: string]: number} = {
  em: 1,
  ex: .431,        // this.TEX.x_height;
  pt: 1 / 10,      // 10 pt to an em
  pc: 12 / 10,     // 12 pc to a pt
  mu: 1 / 18       // 18mu to an em for the scriptlevel
};

/**
 *  The various named spaces
 */
export const MATHSPACE: {[name: string]: number} = {
  /* tslint:disable:whitespace */
  veryverythinmathspace:           1/18,
  verythinmathspace:               2/18,
  thinmathspace:                   3/18,
  mediummathspace:                 4/18,
  thickmathspace:                  5/18,
  verythickmathspace:              6/18,
  veryverythickmathspace:          7/18,
  negativeveryverythinmathspace:  -1/18,
  negativeverythinmathspace:      -2/18,
  negativethinmathspace:          -3/18,
  negativemediummathspace:        -4/18,
  negativethickmathspace:         -5/18,
  negativeverythickmathspace:     -6/18,
  negativeveryverythickmathspace: -7/18,
  /* tslint:enable */

  thin:   .04,
  medium: .06,
  thick:  .1,

  normal:  1,
  big:     2,
  small:   1 / Math.sqrt(2),

  infinity:  BIGDIMEN
};


/**
 * @param {string|number} length  A dimension (giving number and units) to be converted to ems
 * @param {number} size           The default size of the dimension (for percentage values)
 * @param {number} scale          The current scaling factor (to handle absolute units)
 * @param {number} em             The size of an em in pixels
 * @return {number}               The dimension converted to ems
 */
export function length2em(length: string | number, size: number = 0, scale: number = 1, em: number = 16): number {
  if (typeof length !== 'string') {
    length = String(length);
  }
  if (length === '' || length == null) {
    return size;
  }
  if (MATHSPACE[length]) {
    return MATHSPACE[length];
  }
  let match = length.match(/^\s*([-+]?(?:\.\d+|\d+(?:\.\d*)?))?(pt|em|ex|mu|px|pc|in|mm|cm|%)?/);
  if (!match) {
    return size;
  }
  let m = parseFloat(match[1] || '1'), unit = match[2];
  if (UNITS.hasOwnProperty(unit)) {
    return m * UNITS[unit] / em / scale;
  }
  if (RELUNITS.hasOwnProperty(unit)) {
    return m * RELUNITS[unit];
  }
  if (unit === '%') {
    return m / 100 * size;  // percentage of the size
  }
  return m * size;            // relative to size
}

/**
 * @param {number} m  A number to be shown as a percent
 * @return {string}   The number m as a percent
 */
export function percent(m: number): string {
  return (100 * m).toFixed(1).replace(/\.?0+$/, '') + '%';
}

/**
 * @param {number} m  A number to be shown in ems
 * @return {string}   The number with units of ems
 */
export function em(m: number): string {
  if (Math.abs(m) < .001) return '0';
  return (m.toFixed(3).replace(/\.?0+$/, '')) + 'em';
}

/**
 * @param {number} m   A number to be shown in ems, but rounded to pixel boundaries
 * @param {number} em  The number of pixels in an em
 * @return {string}    The number with units of em
 */
export function emRounded(m: number, em: number = 16): string {
  m = (Math.round(m * em) + .05) / em;
  if (Math.abs(m) < .001) return '0em';
  return m.toFixed(3).replace(/\.?0+$/, '') + 'em';
}


/**
 * @param {number} m   A number of em's to be shown as pixels
 * @param {number} M   The minimum number of pixels to allow
 * @param {number} em  The number of pixels in an em
 * @return {string}    The number with units of px
 */
export function px(m: number, M: number = -BIGDIMEN, em: number = 16): string {
  m *= em;
  if (M && m < M) m = M;
  if (Math.abs(m) < .1) return '0';
  return m.toFixed(1).replace(/\.0$/, '') + 'px';
}
