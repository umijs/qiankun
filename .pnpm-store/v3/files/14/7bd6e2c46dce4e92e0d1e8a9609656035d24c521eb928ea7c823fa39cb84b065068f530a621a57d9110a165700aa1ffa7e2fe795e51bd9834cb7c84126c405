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
 * @fileoverview  Implements the MmlMtext node
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {PropertyList} from '../../Tree/Node.js';
import {AbstractMmlTokenNode, TEXCLASS} from '../MmlNode.js';

/*****************************************************************/
/**
 *  Implements the MmlMtext node class (subclass of AbstractMmlTokenNode)
 */

export class MmlMtext extends AbstractMmlTokenNode {

  /**
   * @override
   */
  public static defaults: PropertyList = {
    ...AbstractMmlTokenNode.defaults
  };

  /**
   * TeX class is ORD
   */
  protected texclass = TEXCLASS.ORD;

  /**
   * @override
   */
  public get kind() {
    return 'mtext';
  }

  /**
   * <mtext> is always space-like according to the spec
   * @override
   */
  public get isSpacelike() {
    return true;
  }

}
