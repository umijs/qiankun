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
 * @fileoverview  Implements the MmlMenclose node
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {PropertyList} from '../../Tree/Node.js';
import {MmlNode, AbstractMmlNode, TEXCLASS} from '../MmlNode.js';

/*****************************************************************/
/**
 *  Implements the MmlEnclose node class (subclass of AbstractMmlNode)
 */

export class MmlMenclose extends AbstractMmlNode {

  /**
   * @override
   */
  public static defaults: PropertyList = {
    ...AbstractMmlNode.defaults,
    notation: 'longdiv'
  };

  /**
   * TeX class is ORD
   */
  protected texclass = TEXCLASS.ORD;

  /**
   * The menclose kind
   * @override
   */
  public get kind() {
    return 'menclose';
  }

  /**
   * <menclose> has an inferred mrow
   * @override
   */
  public get arity() {
    return -1;
  }

  /**
   * <menclose> is a linebreak container
   * @override
   */
  public get linebreakContininer() {
    return true;
  }

  /**
   * @override
   */
  public setTeXclass(prev: MmlNode) {
    prev = this.childNodes[0].setTeXclass(prev);
    this.updateTeXclass(this.childNodes[0]);
    return prev;
  }

}
