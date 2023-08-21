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
 * @fileoverview  Implements the MmlMpadded node
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {PropertyList} from '../../Tree/Node.js';
import {AbstractMmlLayoutNode} from '../MmlNode.js';

/*****************************************************************/
/**
 *  Implements the MmlMpadded node class (subclass of AbstractMmlLayoutNode)
 */

export class MmlMpadded extends AbstractMmlLayoutNode {

  /**
   * @override
   */
  public static defaults: PropertyList = {
    ...AbstractMmlLayoutNode.defaults,
    width: '',
    height: '',
    depth: '',
    lspace: 0,
    voffset: 0
  };

  /**
   * @override
   */
  public get kind() {
    return 'mpadded';
  }

}
