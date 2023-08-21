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
 * @fileoverview  Implements the MmlMi node
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {PropertyList} from '../../Tree/Node.js';
import {AbstractMmlTokenNode, AbstractMmlNode, AttributeList, TEXCLASS} from '../MmlNode.js';

/*****************************************************************/
/**
 *  Implements the MmlMi node class (subclass of AbstractMmlTokenNode)
 */

export class MmlMi extends AbstractMmlTokenNode {

  /**
   * @override
   */
  public static defaults: PropertyList = {
    ...AbstractMmlTokenNode.defaults
  };

  /**
   * Pattern for operator names
   */
  public static operatorName: RegExp = /^[a-z][a-z0-9]*$/i;
  /**
   * Pattern for single-character texts
   */
  public static singleCharacter: RegExp =
    /^[\uD800-\uDBFF]?.[\u0300-\u036F\u1AB0-\u1ABE\u1DC0-\u1DFF\u20D0-\u20EF]*$/;

  /**
   * TeX class is ORD
   */
  protected texclass = TEXCLASS.ORD;

  /**
   * @override
   */
  public get kind() {
    return 'mi';
  }

  /**
   * Do the usual inheritance, then check the text length to see
   *   if mathvariant should be normal or italic.
   *
   * @override
   */
  public setInheritedAttributes(attributes: AttributeList = {},
                                display: boolean = false, level: number = 0, prime: boolean = false) {
    super.setInheritedAttributes(attributes, display, level, prime);
    let text = this.getText();
    if (text.match(MmlMi.singleCharacter) && !attributes.mathvariant) {
      this.attributes.setInherited('mathvariant', 'italic');
    }
  }

  /**
   * Mark multi-character texts as OP rather than ORD for spacing purposes
   *
   * @override
   */
  public setTeXclass(prev: AbstractMmlNode) {
    this.getPrevClass(prev);
    let name = this.getText();
    if (name.length > 1 && name.match(MmlMi.operatorName) &&
        this.attributes.get('mathvariant') === 'normal' &&
        this.getProperty('autoOP') === undefined &&
        this.getProperty('texClass') === undefined) {
      this.texClass = TEXCLASS.OP;
      this.setProperty('autoOP', true);
    }
    return this;
  }

}
