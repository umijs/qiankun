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
 * @fileoverview  Implements the MmlMroot node
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {PropertyList} from '../../Tree/Node.js';
import {MmlNode, AbstractMmlNode, AttributeList, TEXCLASS} from '../MmlNode.js';

/*****************************************************************/
/**
 *  Implements the MmlMroot node class (subclass of AbstractMmlNode)
 */

export class MmlMroot extends AbstractMmlNode {

  /**
   * @override
   */
  public static defaults: PropertyList = {
    ...AbstractMmlNode.defaults
  };

  /**
   * TeX class is ORD
   */
  protected texclass = TEXCLASS.ORD;

  /**
   * @override
   */
  public get kind() {
    return 'mroot';
  }

  /**
   * <mroot> requires two children
   * @override
   */
  public get arity() {
    return 2;
  }

  /**
   * Set the TeX class for the content of the root and the root separately.
   * Return ourself as the previous item.
   *
   * @override
   */
  public setTeXclass(prev: MmlNode) {
    this.getPrevClass(prev);
    this.childNodes[0].setTeXclass(null);
    this.childNodes[1].setTeXclass(null);
    return this;
  }

  /**
   * Set the children display/level/prime for the base and root.
   *
   * @override
   */
  protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {
    this.childNodes[0].setInheritedAttributes(attributes, display, level, true);
    this.childNodes[1].setInheritedAttributes(attributes, false, level + 2, prime);
  }

}
