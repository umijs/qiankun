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
 * @fileoverview  Implements the CHTMLMroot wrapper for the MmlMroot object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper} from '../Wrapper.js';
import {CHTMLmsqrt} from './msqrt.js';
import {CommonMrootMixin, MrootConstructor} from '../../common/Wrappers/mroot.js';
import {BBox} from '../../../util/BBox.js';
import {MmlMroot} from '../../../core/MmlTree/MmlNodes/mroot.js';

/*****************************************************************/
/**
 * The CHTMLmroot wrapper for the MmlMroot object (extends CHTMLmsqrt)
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLmroot<N, T, D> extends CommonMrootMixin<MrootConstructor>(CHTMLmsqrt) {

  /**
   * The mroot wrapper
   */
  public static kind = MmlMroot.prototype.kind;

  /**
   * @override
   */
  protected addRoot(ROOT: N, root: CHTMLWrapper<N, T, D>, sbox: BBox, H: number) {
    root.toCHTML(ROOT);
    const [x, h, dx] = this.getRootDimens(sbox, H);
    this.adaptor.setStyle(ROOT, 'verticalAlign', this.em(h));
    this.adaptor.setStyle(ROOT, 'width', this.em(x));
    if (dx) {
      this.adaptor.setStyle(this.adaptor.firstChild(ROOT) as N, 'paddingLeft', this.em(dx));
    }
  }

}
