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
 * @fileoverview  Implements the MmlMath node
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {PropertyList} from '../../Tree/Node.js';
import {AbstractMmlLayoutNode, AttributeList} from '../MmlNode.js';

/*****************************************************************/
/**
 *  Implements the MmlMath node class (subclass of AbstractMmlLayoutNode)
 */

export class MmlMath extends AbstractMmlLayoutNode {

  /**
   *  These are used as the defaults for any attributes marked INHERIT in other classes
   */
  public static defaults: PropertyList = {
    ...AbstractMmlLayoutNode.defaults,
    mathvariant: 'normal',
    mathsize: 'normal',
    mathcolor: '', // Should be 'black', but allow it to inherit from surrounding text
    mathbackground: 'transparent',
    dir: 'ltr',
    scriptlevel: 0,
    displaystyle: false,
    display: 'inline',
    maxwidth: '',
    overflow: 'linebreak',
    altimg: '',
    'altimg-width': '',
    'altimg-height': '',
    'altimg-valign': '',
    alttext: '',
    cdgroup: '',
    scriptsizemultiplier: 1 / Math.sqrt(2),
    scriptminsize: '8px',        // Should be 8pt, but that's too big
    infixlinebreakstyle: 'before',
    lineleading: '1ex',
    linebreakmultchar: '\u2062', // Invisible times
    indentshift: 'auto',         // Use user configuration
    indentalign: 'auto',
    indenttarget: '',
    indentalignfirst: 'indentalign',
    indentshiftfirst: 'indentshift',
    indentalignlast:  'indentalign',
    indentshiftlast:  'indentshift'
  };

  /**
   * @override
   */
  public get kind() {
    return 'math';
  }

  /**
   * Linebreaking can occur in math nodes
   * @override
   */
  public get linebreakContainer() {
    return true;
  }

  /**
   * The attributes of math nodes are inherited, so add them into the list.
   * The displaystyle attribute comes from the display attribute if not given explicitly
   * The scriptlevel comes from the scriptlevel attribute or default
   *
   * @override
   */
  protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {
    if (this.attributes.get('mode') === 'display') {
      this.attributes.setInherited('display', 'block');
    }
    attributes = this.addInheritedAttributes(attributes, this.attributes.getAllAttributes());
    display = (!!this.attributes.get('displaystyle') ||
               (!this.attributes.get('displaystyle') && this.attributes.get('display') === 'block'));
    this.attributes.setInherited('displaystyle', display);
    level = (this.attributes.get('scriptlevel') ||
             (this.constructor as typeof MmlMath).defaults['scriptlevel']) as number;
    super.setChildInheritedAttributes(attributes, display, level, prime);
  }

}
