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
 * @fileoverview  Implements the CHTMLmspace wrapper for the MmlMspace object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper, CHTMLConstructor} from '../Wrapper.js';
import {CommonMspaceMixin} from '../../common/Wrappers/mspace.js';
import {MmlMspace} from '../../../core/MmlTree/MmlNodes/mspace.js';

/*****************************************************************/
/**
 * The CHTMLmspace wrapper for the MmlMspace object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
// @ts-ignore
export class CHTMLmspace<N, T, D> extends
CommonMspaceMixin<CHTMLConstructor<any, any, any>>(CHTMLWrapper) {

  /**
   * The mspace wrapper
   */
  public static kind = MmlMspace.prototype.kind;

  /**
   * @override
   */
  public toCHTML(parent: N) {
    let chtml = this.standardCHTMLnode(parent);
    let {w, h, d} = this.getBBox();
    if (w < 0) {
      this.adaptor.setStyle(chtml, 'marginRight', this.em(w));
      w = 0;
    }
    if (w) {
      this.adaptor.setStyle(chtml, 'width', this.em(w));
    }
    h = Math.max(0, h + d);
    if (h) {
      this.adaptor.setStyle(chtml, 'height', this.em(Math.max(0, h)));
    }
    if (d) {
      this.adaptor.setStyle(chtml, 'verticalAlign', this.em(-d));
    }
  }

}
