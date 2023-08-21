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
 * @fileoverview  Implements the MmlMunderover node
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {PropertyList} from '../../Tree/Node.js';
import {AbstractMmlBaseNode, AttributeList} from '../MmlNode.js';

/*****************************************************************/
/**
 *  Implements the MmlMunderover node class (subclass of AbstractMmlNode)
 */

export class MmlMunderover extends AbstractMmlBaseNode {

  /**
   * @override
   */
  public static defaults: PropertyList = {
    ...AbstractMmlBaseNode.defaults,
    accent: false,
    accentunder: false,
    align: 'center'
  };

  /**
   * The names of attributes controling accents for each child node (reversed for mover below)
   */
  protected static ACCENTS = ['', 'accentunder', 'accent'];

  /**
   * @override
   */
  public get kind() {
    return 'munderover';
  }

  /**
   * <munderover> requires three children
   * @override
   */
  public get arity() {
    return 3;
  }

  /**
   * @return {number}  The base is child 0
   */
  public get base(): number {
    return 0;
  }

  /**
   * @return {number}  Child 1 goes under (overridden by mover below)
   */
  public get under(): number {
    return 1;
  }

  /**
   * @return {number}  Child 2 goes over (overridden by mover below)
   */
  public get over(): number {
    return 2;
  }

  /**
   * <munderover> can contain line breaks
   * @override
   */
  public get linebreakContainer() {
    return true;
  }

  /**
   * Base is in prime style if there is an over node
   * Force scriptlevel change if converted to sub-sup by movablelimits on the base in non-display mode
   * Adjust displaystyle, scriptlevel, and primestyle for the under/over nodes and check if accent
   *   values have changed due to the inheritance (e.g., settings in operator dictionary)
   *
   * @override
   */
  protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {
    let nodes = this.childNodes;
    nodes[0].setInheritedAttributes(attributes, display, level, prime || !!nodes[this.over]);
    let force = !!(!display && nodes[0].coreMO().attributes.get('movablelimits'));
    let ACCENTS = (this.constructor as typeof MmlMunderover).ACCENTS;
    nodes[1].setInheritedAttributes(attributes, false,
                                    this.getScriptlevel(ACCENTS[1], force, level),
                                    prime || this.under === 1);
    this.setInheritedAccent(1, ACCENTS[1], display, level, prime, force);
    if (!nodes[2]) {
      return;
    }
    nodes[2].setInheritedAttributes(attributes, false,
                                    this.getScriptlevel(ACCENTS[2], force, level),
                                    prime || this.under === 2);
    this.setInheritedAccent(2, ACCENTS[2], display, level, prime, force);
  }

  /**
   * @param {string} accent  The name of the accent attribute to check ("accent" or "accentunder")
   * @param {boolean} force  True if the scriptlevel change is to be forced to occur
   * @param {number} level   The current scriptlevel
   * @return {number}        The new script level based on the accent attribute
   */
  protected getScriptlevel(accent: string, force: boolean, level: number): number {
    if (force || !this.attributes.get(accent)) {
      level++;
    }
    return level;
  }

  /**
   * Check if an under or over accent should cause the appropriate accent attribute to be inherited
   *   on the munderover node, and if it is not the default, re-inherit the scriptlevel, since that
   *   is affected by the accent attribute
   *
   * @param {number} n         The index of the node to check
   * @param {string} accent    The name of the accent attribute to check ("accent" or "accentunder")
   * @param {boolean} display  The displaystyle
   * @param {number} level     The scriptlevel
   * @param {number} prime     The TeX prime style
   * @param {boolean} force    Whether to force the scriptlevel change
   */
  protected setInheritedAccent(n: number, accent: string, display: boolean, level: number,
                               prime: boolean, force: boolean) {
    let node = this.childNodes[n];
    if (this.attributes.getExplicit(accent) == null && node.isEmbellished) {
      let value = node.coreMO().attributes.get('accent');
      this.attributes.setInherited(accent, value);
      if (value !== this.attributes.getDefault(accent)) {
        node.setInheritedAttributes({}, display, this.getScriptlevel(accent, force, level), prime);
      }
    }
  }

}

/*****************************************************************/
/**
 *  Implements the MmlMunder node class (subclass of MmlMunderover)
 */

export class MmlMunder extends MmlMunderover {

  /**
   * @override
   */
  public static defaults: PropertyList = {
      ...MmlMunderover.defaults
  };

  /**
   * @override
   */
  public get kind() {
    return 'munder';
  }

  /**
   * <munder> has only two children
   * @override
   */
  public get arity() {
    return 2;
  }

}

/*****************************************************************/
/**
 *  Implements the MmlMover node class (subclass of MmlMunderover)
 */

export class MmlMover extends MmlMunderover {

  /**
   * @override
   */
  public static defaults: PropertyList = {
      ...MmlMunderover.defaults
  };
  /**
   *  The first child is the over accent (second never occurs)
   */
  protected static ACCENTS = ['', 'accent', 'accentunder'];

  /**
   * @override
   */
  public get kind() {
    return 'mover';
  }

  /**
   * <mover> has only two children
   * @override
   */
  get arity() {
    return 2;
  }

  /**
   * Child 1 is the over node
   * @override
   */
  public get over() {
    return 1;
  }

  /**
   * Child 2 is the null (the under node)
   * @override
   */
  public get under() {
    return 2;
  }

}
