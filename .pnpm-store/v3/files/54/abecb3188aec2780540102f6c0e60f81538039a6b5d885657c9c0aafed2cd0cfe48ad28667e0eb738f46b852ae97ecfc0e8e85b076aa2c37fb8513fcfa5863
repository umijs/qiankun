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
 * @fileoverview  Implements the CHTMLmrow wrapper for the MmlMrow object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper, CHTMLConstructor, Constructor} from '../Wrapper.js';
import {CommonMrowMixin} from '../../common/Wrappers/mrow.js';
import {CommonInferredMrowMixin} from '../../common/Wrappers/mrow.js';
import {MmlMrow, MmlInferredMrow} from '../../../core/MmlTree/MmlNodes/mrow.js';

/*****************************************************************/
/**
 * The CHTMLmrow wrapper for the MmlMrow object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
// @ts-ignore
export class CHTMLmrow<N, T, D> extends
CommonMrowMixin<CHTMLConstructor<any, any, any>>(CHTMLWrapper) {

  /**
   * The mrow wrapper
   */
  public static kind = MmlMrow.prototype.kind;

  /**
   * @override
   */
  public toCHTML(parent: N) {
    const chtml = (this.node.isInferred ? (this.chtml = parent) : this.standardCHTMLnode(parent));
    let hasNegative = false;
    for (const child of this.childNodes) {
      child.toCHTML(chtml);
      if (child.bbox.w < 0) {
        hasNegative = true;
      }
    }
    // FIXME:  handle line breaks
    if (hasNegative) {
      const {w} = this.getBBox();
      if (w) {
        this.adaptor.setStyle(chtml, 'width', this.em(Math.max(0, w)));
        if (w < 0) {
          this.adaptor.setStyle(chtml, 'marginRight', this.em(w));
        }
      }
    }
  }

}

/*****************************************************************/
/**
 *  The CHTMLinferredMrow wrapper for the MmlInferredMrow object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
// @ts-ignore
export class CHTMLinferredMrow<N, T, D> extends
CommonInferredMrowMixin<Constructor<CHTMLmrow<any, any, any>>>(CHTMLmrow) {

  /**
   * The inferred-mrow wrapper
   */
  public static kind = MmlInferredMrow.prototype.kind;

}
