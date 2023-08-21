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
 * @fileoverview  Implements the MmlMtr and MmlMlabeledtr nodes
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {PropertyList} from '../../Tree/Node.js';
import {MmlNode, AbstractMmlNode, AttributeList} from '../MmlNode.js';
import {INHERIT} from '../Attributes.js';
import {split} from '../../../util/string.js';

/*****************************************************************/
/**
 *  Implements the MmlMtr node class (subclass of AbstractMmlNode)
 */

export class MmlMtr extends AbstractMmlNode {

  /**
   * @override
   */
  public static defaults: PropertyList = {
    ...AbstractMmlNode.defaults,
    rowalign: INHERIT,
    columnalign: INHERIT,
    groupalign: INHERIT
  };

  /**
   * @override
   */
  public get kind() {
    return 'mtr';
  }

  /**
   * <mtr> can contain linebreaks
   * @override
   */
  public get linebreakContainer() {
    return true;
  }

  /**
   * Inherit the mtr attributes
   *
   * @override
   */
  protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {
    for (const child of this.childNodes) {
      if (!child.isKind('mtd')) {
        this.replaceChild(this.factory.create('mtd'), child)
            .appendChild(child);
      }
    }
    const calign = split(this.attributes.get('columnalign') as string);
    if (this.arity === 1) {
      calign.unshift(this.parent.attributes.get('side') as string);
    }
    attributes = this.addInheritedAttributes(attributes, {
      rowalign: this.attributes.get('rowalign'),
      columnalign: 'center'
    });
    for (const child of this.childNodes) {
      attributes.columnalign[1] = calign.shift() || attributes.columnalign[1];
      child.setInheritedAttributes(attributes, display, level, prime);
    }
  }

  /**
   * Check that parent is mtable and children are mtd
   *
   * @override
   */
  protected verifyChildren(options: PropertyList) {
    if (this.parent && !this.parent.isKind('mtable')) {
      this.mError(this.kind + ' can only be a child of an mtable', options, true);
      return;
    }
    for (const child of this.childNodes) {
      if (!child.isKind('mtd')) {
        let mtd = this.replaceChild(this.factory.create('mtd'), child) as MmlNode;
        mtd.appendChild(child);
        if (!options['fixMtables']) {
          child.mError('Children of ' + this.kind + ' must be mtd', options);
        }
      }
    }
    super.verifyChildren(options);
  }

  /**
   * @override
   */
  public setTeXclass(prev: MmlNode) {
    this.getPrevClass(prev);
    for (const child of this.childNodes) {
      child.setTeXclass(null);
    }
    return this;
  }

}

/*****************************************************************/
/**
 *  Implements the MmlMlabeledtr node class (subclass of MmlMtr)
 */

export class MmlMlabeledtr extends MmlMtr {

  /**
   * @override
   */
  public get kind() {
    return 'mlabeledtr';
  }

  /**
   * <mlabeledtr> requires at least one child (the label)
   * @override
   */
  get arity() {
    return 1;
  }

}
