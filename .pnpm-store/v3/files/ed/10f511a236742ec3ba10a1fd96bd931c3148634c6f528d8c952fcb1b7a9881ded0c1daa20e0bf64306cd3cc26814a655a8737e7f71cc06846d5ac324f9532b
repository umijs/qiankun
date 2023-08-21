/*************************************************************
 *
 *  Copyright (c) 2019-2022 The MathJax Consortium
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
 * @fileoverview  Implements the FontCache object for SVG output
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVG} from '../svg.js';

export class FontCache<N, T, D> {

  /**
   * The SVG jax that owsn this cache
   */
  protected jax: SVG<N, T, D>;

  /**
   * The cache of font character IDs to their paths
   */
  protected cache: Map<string, string> = new Map();

  /**
   * The SVG <defs> element for storing the cache
   */
  protected defs: N = null;

  /**
   * A string to use to make per-equation cache IDs unique
   */
  protected localID: string = '';

  /**
   * A number used to make localID values to use for each equation
   */
  protected nextID: number = 0;

  /**
   * @param {SVG} jax  The SVG jax owning this font cache
   */
  constructor(jax: SVG<N, T, D>) {
    this.jax = jax;
  }

  /**
   * Cache a character from a particular variant and return the cache ID
   *
   * @param {string} variant   The variant name for the character
   * @param {string} C         The character to be cached
   * @param {string} path      The SVG path data for the character
   * @return {string}          The id for the cached <path> element
   */
  public cachePath(variant: string, C: string, path: string): string {
    const id = 'MJX-' + this.localID + (this.jax.font.getVariant(variant).cacheID || '') + '-' + C;
    if (!this.cache.has(id)) {
      this.cache.set(id, path);
      this.jax.adaptor.append(this.defs, this.jax.svg('path', {id: id, d: path}));
    }
    return id;
  }

  /**
   * Clear the localID value
   */
  public clearLocalID() {
    this.localID = '';
  }

  /**
   * Use a localID (for font-specific caching), either with a specific string,
   * or from the nextID number.
   */
  public useLocalID(id: string = null) {
    this.localID = (id == null ? ++this.nextID : id) + (id === '' ? '' : '-');
  }

  /**
   * Clear the cache
   */
  public clearCache() {
    this.cache = new Map();
    this.defs = this.jax.svg('defs');
  }

  /**
   * Return the font cache <defs> element
   */
  public getCache() {
    return this.defs;
  }

}
