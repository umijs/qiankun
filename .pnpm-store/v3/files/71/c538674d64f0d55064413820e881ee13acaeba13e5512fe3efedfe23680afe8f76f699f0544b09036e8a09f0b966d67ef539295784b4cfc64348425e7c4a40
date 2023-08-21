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
 * @fileoverview  Implements the MmlMmultiscripts node
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {PropertyList} from '../../Tree/Node.js';
import {AbstractMmlNode, AttributeList} from '../MmlNode.js';
import {MmlMsubsup} from './msubsup.js';

/*****************************************************************/
/**
 *  Implements the MmlMmultiscripts node class (subclass of MmlMsubsup)
 */

export class MmlMmultiscripts extends MmlMsubsup {

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
    return 'mmultiscripts';
  }

  /**
   * <mmultiscripts> requires at least one child (the base)
   * @override
   */
  public get arity() {
    return 1;
  }

  /**
   * Push the inherited values to the base
   * Make sure the number of pre- and post-scripts are even by adding mrows, if needed.
   * For the scripts, use displaystyle = false, scriptlevel + 1, and
   *   set the primestyle in the subscripts.
   *
   * @override
   */
  protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {
    this.childNodes[0].setInheritedAttributes(attributes, display, level, prime);
    let prescripts = false;
    for (let i = 1, n = 0; i < this.childNodes.length; i++) {
      let child = this.childNodes[i];
      if (child.isKind('mprescripts')) {
        if (!prescripts) {
          prescripts = true;
          if (i % 2 === 0) {
            let mrow = this.factory.create('mrow');
            this.childNodes.splice(i, 0, mrow);
            mrow.parent = this;
            i++;
          }
        }
      } else {
        let primestyle = prime || (n % 2 === 0);
        child.setInheritedAttributes(attributes, false, level + 1, primestyle);
        n++;
      }
    }
    if (this.childNodes.length % 2 === (prescripts ? 1 : 0)) {
      this.appendChild(this.factory.create('mrow'));
      this.childNodes[this.childNodes.length - 1].setInheritedAttributes(attributes, false, level + 1, prime);
    }
  }

  /**
   * Check that mprescripts only occurs once, and that the number of pre- and post-scripts are even.
   *
   * @override
   */
  protected verifyChildren(options: PropertyList) {
    let prescripts = false;
    let fix = options['fixMmultiscripts'];
    for (let i = 0; i < this.childNodes.length; i++) {
      let child = this.childNodes[i];
      if (child.isKind('mprescripts')) {
        if (prescripts) {
          child.mError(child.kind + ' can only appear once in ' + this.kind, options, true);
        } else {
          prescripts = true;
          if (i % 2 === 0 && !fix) {
            this.mError('There must be an equal number of prescripts of each type', options);
          }
        }
      }
    }
    if (this.childNodes.length % 2 === (prescripts ? 1 : 0) && !fix) {
      this.mError('There must be an equal number of scripts of each type', options);
    }
    super.verifyChildren(options);
  }

}

/*****************************************************************/
/**
 *  Implements the MmlMprescripts node class (subclass of AbstractMmlNode)
 */

export class MmlMprescripts extends AbstractMmlNode {

  /**
   * @override
   */
  public static defaults: PropertyList = {
    ...AbstractMmlNode.defaults
  };

  /**
   * @return {string}  The mprescripts kind
   */
  public get kind(): string {
    return 'mprescripts';
  }

  /**
   * @return {number}  <mprescripts> can have no children
   */
  public get arity(): number {
    return 0;
  }

  /**
   * Check that parent is mmultiscripts
   *
   * @override
   */
  public verifyTree(options: PropertyList) {
    super.verifyTree(options);
    if (this.parent && !this.parent.isKind('mmultiscripts')) {
      this.mError(this.kind + ' must be a child of mmultiscripts', options, true);
    }
  }

}

/*****************************************************************/
/**
 *  Implements the MmlNone node class (subclass of AbstractMmlNode)
 */

export class MmlNone extends AbstractMmlNode {

  /**
   * @override
   */
  public static defaults: PropertyList = {
    ...AbstractMmlNode.defaults
  };

  /**
   * @return {string}  The none kind
   */
  public get kind(): string {
    return 'none';
  }

  /**
   * @return {number}  <none> can have no children
   */
  public get arity(): number {
    return 0;
  }

  /**
   * Check that parent is mmultiscripts
   *
   * @override
   */
  public verifyTree(options: PropertyList) {
    super.verifyTree(options);
    if (this.parent && !this.parent.isKind('mmultiscripts')) {
      this.mError(this.kind + ' must be a child of mmultiscripts', options, true);
    }
  }

}
