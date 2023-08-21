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
 * @fileoverview  Implements the CHTMLmsubsup wrapper for the MmlMsubsup object
 *                and the special cases CHTMLmsub and CHTMLmsup
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper, Constructor} from '../Wrapper.js';
import {CHTMLscriptbase} from './scriptbase.js';
import {CommonMsubMixin} from '../../common/Wrappers/msubsup.js';
import {CommonMsupMixin} from '../../common/Wrappers/msubsup.js';
import {CommonMsubsupMixin} from '../../common/Wrappers/msubsup.js';
import {MmlMsubsup, MmlMsub, MmlMsup} from '../../../core/MmlTree/MmlNodes/msubsup.js';
import {StyleList} from '../../../util/StyleList.js';

/*****************************************************************/
/**
 * The CHTMLmsub wrapper for the MmlMsub object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
// @ts-ignore
export class CHTMLmsub<N, T, D> extends
CommonMsubMixin<CHTMLWrapper<any, any, any>, Constructor<CHTMLscriptbase<any, any, any>>>(CHTMLscriptbase)  {

  /**
   * The msub wrapper
   */
  public static kind = MmlMsub.prototype.kind;

}

/*****************************************************************/
/**
 * The CHTMLmsup wrapper for the MmlMsup object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
// @ts-ignore
export class CHTMLmsup<N, T, D> extends
CommonMsupMixin<CHTMLWrapper<any, any, any>, Constructor<CHTMLscriptbase<any, any, any>>>(CHTMLscriptbase)  {

  /**
   * The msup wrapper
   */
  public static kind = MmlMsup.prototype.kind;

}

/*****************************************************************/
/**
 * The CHTMLmsubsup wrapper for the MmlMsubsup object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
// @ts-ignore
export class CHTMLmsubsup<N, T, D> extends
CommonMsubsupMixin<CHTMLWrapper<any, any, any>, Constructor<CHTMLscriptbase<any, any, any>>>(CHTMLscriptbase)  {

  /**
   * The msubsup wrapper
   */
  public static kind = MmlMsubsup.prototype.kind;

  /**
   * @override
   */
  public static styles: StyleList = {
    'mjx-script': {
      display: 'inline-block',
      'padding-right': '.05em',  // scriptspace
      'padding-left': '.033em'   // extra_ic
    },
    'mjx-script > mjx-spacer': {
      display: 'block'
    }
  };

  /**
   * @override
   */
  public toCHTML(parent: N) {
    const adaptor = this.adaptor;
    const chtml = this.standardCHTMLnode(parent);
    const [base, sup, sub] = [this.baseChild, this.supChild, this.subChild];
    const [ , v, q] = this.getUVQ();
    const style = {'vertical-align': this.em(v)};
    base.toCHTML(chtml);
    const stack = adaptor.append(chtml, this.html('mjx-script', {style})) as N;
    sup.toCHTML(stack);
    adaptor.append(stack, this.html('mjx-spacer', {style: {'margin-top': this.em(q)}}));
    sub.toCHTML(stack);
    const ic = this.getAdjustedIc();
    if (ic) {
      adaptor.setStyle(sup.chtml, 'marginLeft', this.em(ic / sup.bbox.rscale));
    }
    if (this.baseRemoveIc) {
      adaptor.setStyle(stack, 'marginLeft', this.em(-this.baseIc));
    }
  }

}
