/*************************************************************
 *
 *  Copyright (c) 2018-2022 The MathJax Consortium
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
 * @fileoverview  Handles using MathJax global as config object, and to hold
 *                methods and data to be available to the page author
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {VERSION} from './version.js';

/**
 * The MathJax variable as a configuration object
 */
export interface MathJaxConfig {
  [name: string]: any;
}

/**
 * The object used to store class and other definitions
 * from the various MathJax modules so that they can be shared
 * among the various component webpack files
 */
export interface MathJaxLibrary {
  [name: string]: any;
}

/**
 * The MathJax global object structure
 */
export interface MathJaxObject {
  version: string;
  _: MathJaxLibrary;
  config: MathJaxConfig;
}

declare const global: {MathJax: MathJaxObject | MathJaxConfig};

/**
 * @param {any} x     An item to test if it is an object
 * @return {boolean}  True if the item is a non-null object
 */
export function isObject(x: any): boolean {
  return typeof x === 'object' && x !== null;
}

/**
 * Combine user-produced configuration with existing defaults.  Values
 * from src will replace those in dst.
 *
 * @param {any} dst      The destination config object (to be merged into)
 * @param {any} src      The source configuration object (to replace defaul values in dst}
 * @return {any}         The resulting (modified) config object
 */
export function combineConfig(dst: any, src: any): any {
  for (const id of Object.keys(src)) {
    if (id === '__esModule') continue;
    if (isObject(dst[id]) && isObject(src[id]) &&
        !(src[id] instanceof Promise) /* needed for IE polyfill */) {
      combineConfig(dst[id], src[id]);
    } else if (src[id] !== null && src[id] !== undefined) {
      dst[id] = src[id];
    }
  }
  return dst;
}

/**
 * Combine defaults into a configuration that may already have
 * user-provided values.  Values in src only go into dst if
 * there is not already a value for that key.
 *
 * @param {any} dst      The destination config object (to be merged into)
 * @param {string} name  The id of the configuration block to modify (created if doesn't exist)
 * @param {any} src      The source configuration object (to replace defaul values in dst}
 * @return {any}         The resulting (modified) config object
 */
export function combineDefaults(dst: any, name: string, src: any): any {
  if (!dst[name]) {
    dst[name] = {};
  }
  dst = dst[name];
  for (const id of Object.keys(src)) {
    if (isObject(dst[id]) && isObject(src[id])) {
      combineDefaults(dst, id, src[id]);
    } else if (dst[id] == null && src[id] != null) {
      dst[id] = src[id];
    }
  }
  return dst;
}

/**
 * Combine configuration or data with the existing MathJax object
 *
 * @param {any} config   The data to be merged into the MathJax object
 */
export function combineWithMathJax(config: any): MathJaxObject {
  return combineConfig(MathJax, config);
}


/**
 * Create the MathJax global, if it doesn't exist
 */
if (typeof global.MathJax === 'undefined') {
  global.MathJax = {} as MathJaxConfig;
}

/**
 * If the global is currently a config object, convert it to the
 * MathJaxObject containing the version, class library, and user
 * configuration.
 */
if (!(global.MathJax as MathJaxObject).version) {
  global.MathJax = {
    version: VERSION,
    _: {},
    config: global.MathJax
  };
}

/**
 * Export the global MathJax object for convenience
 */
export const MathJax = global.MathJax as MathJaxObject;
