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
 * @fileoverview  Implements the CHTMLTeXAtom wrapper for the MmlTeXAtom object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper, CHTMLConstructor} from '../Wrapper.js';
import {CommonTeXAtomMixin} from '../../common/Wrappers/TeXAtom.js';
import {TeXAtom} from '../../../core/MmlTree/MmlNodes/TeXAtom.js';
import {TEXCLASS, TEXCLASSNAMES} from '../../../core/MmlTree/MmlNode.js';

/*****************************************************************/
/**
 * The CHTMLTeXAtom wrapper for the TeXAtom object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
// @ts-ignore
export class CHTMLTeXAtom<N, T, D> extends
CommonTeXAtomMixin<CHTMLConstructor<any, any, any>>(CHTMLWrapper) {

  /**
   * The TeXAtom wrapper
   */
  public static kind = TeXAtom.prototype.kind;

  /**
   * @override
   */
  public toCHTML(parent: N) {
    super.toCHTML(parent);
    this.adaptor.setAttribute(this.chtml, 'texclass', TEXCLASSNAMES[this.node.texClass]);
    //
    // Center VCENTER atoms vertically
    //
    if (this.node.texClass === TEXCLASS.VCENTER) {
      const bbox = this.childNodes[0].getBBox();  // get unmodified bbox of children
      const {h, d} = bbox;
      const a = this.font.params.axis_height;
      const dh = ((h + d) / 2 + a) - h;  // new height minus old height
      this.adaptor.setStyle(this.chtml, 'verticalAlign', this.em(dh));
    }
  }

}
