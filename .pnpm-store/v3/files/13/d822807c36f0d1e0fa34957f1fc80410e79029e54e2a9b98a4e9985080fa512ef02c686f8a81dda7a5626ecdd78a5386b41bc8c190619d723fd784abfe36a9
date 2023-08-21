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
 * @fileoverview  Implements the MathML version of the FindMath object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AbstractFindMath} from '../../core/FindMath.js';
import {DOMAdaptor} from '../../core/DOMAdaptor.js';
import {OptionList} from '../../util/Options.js';
import {ProtoItem} from '../../core/MathItem.js';

/**
 * The MathML namespace
 */
const NAMESPACE = 'http://www.w3.org/1998/Math/MathML';


/*****************************************************************/
/**
 *  Implements the FindMathML object (extends AbstractFindMath)
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class FindMathML<N, T, D> extends AbstractFindMath<N, T, D> {

  /**
   * @override
   */
  public static OPTIONS: OptionList = {};

  /**
   * The DOMAdaptor for the document being processed
   */
  public adaptor: DOMAdaptor<N, T, D>;

  /**
   * Locates math nodes, possibly with namespace prefixes.
   *  Store them in a set so that if found more than once, they will only
   *  appear in the list once.
   *
   * @override
   */
  public findMath(node: N) {
    let set = new Set<N>();
    this.findMathNodes(node, set);
    this.findMathPrefixed(node, set);
    const html = this.adaptor.root(this.adaptor.document);
    if (this.adaptor.kind(html) === 'html' &&  set.size === 0) {
      this.findMathNS(node, set);
    }
    return this.processMath(set);
  }

  /**
   * Find plain <math> tags
   *
   * @param {N} node       The container to seaerch for math
   * @param {Set<N>} set   The set in which to store the math nodes
   */
  protected findMathNodes(node: N, set: Set<N>) {
    for (const math of this.adaptor.tags(node, 'math')) {
      set.add(math);
    }
  }

  /**
   * Find <m:math> tags (or whatever prefixes there are)
   *
   * @param {N} node  The container to seaerch for math
   * @param {NodeSet} set   The set in which to store the math nodes
   */
  protected findMathPrefixed(node: N, set: Set<N>) {
    let html = this.adaptor.root(this.adaptor.document);
    for (const attr of this.adaptor.allAttributes(html)) {
      if (attr.name.substr(0, 6) === 'xmlns:' && attr.value === NAMESPACE) {
        let prefix = attr.name.substr(6);
        for (const math of this.adaptor.tags(node, prefix + ':math')) {
          set.add(math);
        }
      }
    }
  }

  /**
   * Find namespaced math in XHTML documents (is this really needed?)
   *
   * @param {N} node  The container to seaerch for math
   * @param {NodeSet} set   The set in which to store the math nodes
   */
  protected findMathNS(node: N, set: Set<N>) {
    for (const math of this.adaptor.tags(node, 'math', NAMESPACE)) {
      set.add(math);
    }
  }

  /**
   *  Produce the array of proto math items from the node set
   */
  protected processMath(set: Set<N>) {
    let math: ProtoItem<N, T>[] = [];
    for (const mml of Array.from(set)) {
      let display = (this.adaptor.getAttribute(mml, 'display') === 'block' ||
                     this.adaptor.getAttribute(mml, 'mode') === 'display');
      let start = {node: mml, n: 0, delim: ''};
      let end   = {node: mml, n: 0, delim: ''};
      math.push({math: this.adaptor.outerHTML(mml), start, end, display});
    }
    return math;
  }

}
