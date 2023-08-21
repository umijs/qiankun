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
 * @fileoverview  Implements the MmlMaction node
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {PropertyList} from '../../Tree/Node.js';
import {MmlNode, AbstractMmlNode} from '../MmlNode.js';

/*****************************************************************/
/**
 *  Implements the MmlMaction node class (subclass of AbstractMmlNode)
 */

export class MmlMaction extends AbstractMmlNode {

  /**
   * @override
   */
  public static defaults: PropertyList = {
    ...AbstractMmlNode.defaults,
    actiontype: 'toggle',
    selection: 1
  };

  /**
   * @override
   */
  public get kind() {
    return 'maction';
  }

  /**
   * At least one child
   * @override
   */
  public get arity() {
    return 1;
  }

  /**
   * @return {MmlNode}  The selected child node (or an mrow if none selected)
   */
  public get selected(): MmlNode {
    const selection = this.attributes.get('selection') as number;
    const i = Math.max(1, Math.min(this.childNodes.length, selection)) - 1;
    return this.childNodes[i] || this.factory.create('mrow');
  }

  /**
   * @override
   */
  public get isEmbellished() {
    return this.selected.isEmbellished;
  }

  /**
   * @override
   */
  public get isSpacelike() {
    return this.selected.isSpacelike;
  }

  /**
   * @override
   */
  public core(): MmlNode {
    return this.selected.core();
  }

  /**
   * @override
   */
  public coreMO(): MmlNode {
    return this.selected.coreMO();
  }

  /**
   * @override
   */
  protected verifyAttributes(options: PropertyList) {
    super.verifyAttributes(options);
    if (this.attributes.get('actiontype') !== 'toggle' &&
        this.attributes.getExplicit('selection') !== undefined) {
      const attributes = this.attributes.getAllAttributes();
      delete attributes.selection;
    }
  }

  /**
   * Get the TeX class from the selceted node
   * For tooltips, set TeX classes within the tip as a separate math list
   *
   * @override
   */
  public setTeXclass(prev: MmlNode) {
    if (this.attributes.get('actiontype') === 'tooltip' && this.childNodes[1]) {
      this.childNodes[1].setTeXclass(null);
    }
    let selected = this.selected;
    prev = selected.setTeXclass(prev);
    this.updateTeXclass(selected);
    return prev;
  }

  /**
   * Select the next child for a toggle action
   */
  public nextToggleSelection() {
    let selection = Math.max(1, (this.attributes.get('selection') as number) + 1);
    if (selection > this.childNodes.length) {
      selection = 1;
    }
    this.attributes.set('selection', selection);
  }

}
