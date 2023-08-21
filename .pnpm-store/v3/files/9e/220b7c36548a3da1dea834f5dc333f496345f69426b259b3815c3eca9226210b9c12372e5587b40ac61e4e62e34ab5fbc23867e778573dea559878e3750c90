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
 * @fileoverview  Implements a lightweight DOM adaptor
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {LiteNode} from './Element.js';

/************************************************************/
/**
 * Implements a lightweight DocumentFragment or NodeList replacement
 *
 * @template N  The HTMLElement node class
 */
export class LiteList<N> {
  /**
   * The nodes held in the fragment
   */
  public nodes: N[] = [];

  /**
   * @param {N[]} children  The children for the fragment
   * @constructor
   */
  constructor(children: N[]) {
    this.nodes = [...children];
  }

  /**
   * @param {N} node  A node to append to the fragment
   */
  public append(node: N) {
    this.nodes.push(node);
  }

  /**
   * Make this class iterable (so it can be used with Array.from())
   */
  public [Symbol.iterator](): Iterator<LiteNode> {
    let i = 0;
    return {
      /**
       * @return {IteratorResult<LiteNode>}
       */
      next(): IteratorResult<LiteNode> {
        return (i === this.nodes.length ?
                {value: null, done: true} :
                {value: this.nodes[i++], done: false});
      }
    };
  }

}
