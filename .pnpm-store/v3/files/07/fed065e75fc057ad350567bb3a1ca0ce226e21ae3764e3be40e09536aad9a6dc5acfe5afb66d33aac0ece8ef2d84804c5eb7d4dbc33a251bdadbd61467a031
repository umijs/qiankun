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
 * @fileoverview  Implements the MmlMsubsup, MmlMsub, and MmlMsup nodes
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {PropertyList} from '../../Tree/Node.js';
import {AbstractMmlBaseNode, AttributeList} from '../MmlNode.js';

/*****************************************************************/
/**
 *  Implements the MmlMsubsup node class (subclass of AbstractMmlBaseNode)
 */

export class MmlMsubsup extends AbstractMmlBaseNode {

  /**
   * @override
   */
  public static defaults: PropertyList = {
    ...AbstractMmlBaseNode.defaults,
    subscriptshift: '',
    superscriptshift: ''
  };

  /**
   * @override
   */
  public get kind() {
    return 'msubsup';
  }

  /**
   * <msubsup> requires three children
   * @override
   */
  public get arity() {
    return 3;
  }

  /**
   * @return {number}  The position of the base element
   */
  public get base(): number {
    return 0;
  }

  /**
   * @return {number}  The position of the subscript (overridden in msup below)
   */
  public get sub(): number {
    return 1;
  }

  /**
   * @return {number}  The position of the superscript (overridden in msup below)
   */
  public get sup(): number {
    return 2;
  }

  /**
   * Super- and subscripts are not in displaymode, have scriptlevel increased, and prime style in subscripts.
   *
   * @override
   */
  protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {
    let nodes = this.childNodes;
    nodes[0].setInheritedAttributes(attributes, display, level, prime);
    nodes[1].setInheritedAttributes(attributes, false, level + 1, prime || this.sub === 1);
    if (!nodes[2]) {
      return;
    }
    nodes[2].setInheritedAttributes(attributes, false, level + 1, prime || this.sub === 2);
  }

}

/*****************************************************************/
/**
 *  Implements the MmlMsub node class (subclass of MmlMsubsup)
 */

export class MmlMsub extends MmlMsubsup {

  /**
   * @override
   */
  public static defaults: PropertyList = {
    ...MmlMsubsup.defaults
  };

  /**
   * @override
   */
  public get kind() {
    return 'msub';
  }

  /**
   * <msub> only gets two children
   * @override
   */
  public get arity() {
    return 2;
  }

}

/*****************************************************************/
/**
 *  Implements the MmlMsup node class (subclass of MmlMsubsup)
 */

export class MmlMsup extends MmlMsubsup {

  /**
   * @override
   */
  public static defaults: PropertyList = {
    ...MmlMsubsup.defaults
  };

  /**
   * @override
   */
  public get kind() {
    return 'msup';
  }

  /**
   * <msup> only gets two children
   * @override
   */
  get arity() {
    return 2;
  }

  /**
   * child 1 is superscript
   * @override
   */
  get sup() {
    return 1;
  }

  /**
   * child 2 is null (no subscript)
   * @override
   */
  get sub() {
    return 2;
  }

}

