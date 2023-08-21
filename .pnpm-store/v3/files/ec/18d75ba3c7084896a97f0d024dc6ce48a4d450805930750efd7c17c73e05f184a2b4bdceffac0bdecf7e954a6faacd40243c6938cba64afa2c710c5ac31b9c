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
 * @fileoverview  Implements the MmlMspace node
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {PropertyList} from '../../Tree/Node.js';
import {MmlNode, AbstractMmlTokenNode, TEXCLASS} from '../MmlNode.js';

/*****************************************************************/
/**
 *  Implements the MmlMspace node class (subclass of AbstractMmlTokenNode)
 */

export class MmlMspace extends AbstractMmlTokenNode {

  /**
   * @override
   */
  public static defaults: PropertyList = {
    ...AbstractMmlTokenNode.defaults,
    width:  '0em',
    height: '0ex',
    depth:  '0ex',
    linebreak: 'auto'
  };

  /**
   * TeX class is ORD
   */
  protected texclass = TEXCLASS.NONE;

  /**
   * @override
   */
  public setTeXclass(prev: MmlNode): MmlNode {
    return prev;
  }

  /**
   * @override
   */
  public get kind() {
    return 'mspace';
  }

  /**
   * mspace can't have children
   * @override
   */
  public get arity() {
    return 0;
  }

  /**
   * @override
   */
  public get isSpacelike() {
    return true;
  }

  /**
   * Only process linebreak if the space has no explicit dimensions (according to spec)
   *
   * @override
   */
  public get hasNewline() {
    let attributes = this.attributes;
    return (attributes.getExplicit('width') == null && attributes.getExplicit('height') == null &&
            attributes.getExplicit('depth') == null && attributes.get('linebreak') === 'newline');
  }

}
