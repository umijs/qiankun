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
 * @fileoverview  Implements the MmlMtd node
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {PropertyList} from '../../Tree/Node.js';
import {AbstractMmlBaseNode, MmlNode} from '../MmlNode.js';
import {INHERIT} from '../Attributes.js';

/*****************************************************************/
/**
 *  Implements the MmlMtd node class (subclass of AbstractMmlBaseNode)
 */

export class MmlMtd extends AbstractMmlBaseNode {

  /**
   * @override
   */
  public static defaults: PropertyList = {
    ...AbstractMmlBaseNode.defaults,
    rowspan: 1,
    columnspan: 1,
    rowalign: INHERIT,
    columnalign: INHERIT,
    groupalign: INHERIT
  };

  /**
   * @override
   */
  public get kind() {
    return 'mtd';
  }

  /**
   * <mtd> has an inferred mrow
   * @overrride
   */
  public get arity() {
    return -1;
  }

  /**
   * <mtd> can contain line breaks
   * @override
   */
  public get linebreakContainer() {
    return true;
  }

  /**
   * Check that parent is mtr
   *
   * @override
   */
  protected verifyChildren(options: PropertyList) {
    if (this.parent && !this.parent.isKind('mtr')) {
      this.mError(this.kind + ' can only be a child of an mtr or mlabeledtr', options, true);
      return;
    }
    super.verifyChildren(options);
  }

  /**
   * @override
   */
  public setTeXclass(prev: MmlNode) {
    this.getPrevClass(prev);
    this.childNodes[0].setTeXclass(null);
    return this;
  }

}
