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
 * @fileoverview  Implements the CHTMLmunderover wrapper for the MmlMunderover object
 *                and the special cases CHTMLmunder and CHTMLmsup
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper, Constructor} from '../Wrapper.js';
import {CHTMLmsubsup, CHTMLmsub, CHTMLmsup} from './msubsup.js';
import {CommonMunderMixin} from '../../common/Wrappers/munderover.js';
import {CommonMoverMixin} from '../../common/Wrappers/munderover.js';
import {CommonMunderoverMixin} from '../../common/Wrappers/munderover.js';
import {MmlMunderover, MmlMunder, MmlMover} from '../../../core/MmlTree/MmlNodes/munderover.js';
import {StyleList} from '../../../util/StyleList.js';

/*****************************************************************/
/**
 * The CHTMLmunder wrapper for the MmlMunder object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
// @ts-ignore
export class CHTMLmunder<N, T, D> extends
CommonMunderMixin<CHTMLWrapper<any, any, any>, Constructor<CHTMLmsub<any, any, any>>>(CHTMLmsub)  {

  /**
   * The munder wrapper
   */
  public static kind = MmlMunder.prototype.kind;

  /**
   * @override
   */
  public static styles: StyleList = {
    'mjx-over': {
      'text-align': 'left'
    },
    'mjx-munder:not([limits="false"])': {
      display: 'inline-table',
    },
    'mjx-munder > mjx-row': {
      'text-align': 'left'
    },
    'mjx-under': {
      'padding-bottom': '.1em'           // big_op_spacing5
    }
  };

  /**
   * @override
   */
  public toCHTML(parent: N) {
    if (this.hasMovableLimits()) {
      super.toCHTML(parent);
      this.adaptor.setAttribute(this.chtml, 'limits', 'false');
      return;
    }
    this.chtml = this.standardCHTMLnode(parent);
    const base = this.adaptor.append(
      this.adaptor.append(this.chtml, this.html('mjx-row')) as N,
      this.html('mjx-base')
    ) as N;
    const under = this.adaptor.append(
      this.adaptor.append(this.chtml, this.html('mjx-row')) as N,
      this.html('mjx-under')
    ) as N;
    this.baseChild.toCHTML(base);
    this.scriptChild.toCHTML(under);
    const basebox = this.baseChild.getOuterBBox();
    const underbox = this.scriptChild.getOuterBBox();
    const k = this.getUnderKV(basebox, underbox)[0];
    const delta = (this.isLineBelow ? 0 : this.getDelta(true));
    this.adaptor.setStyle(under, 'paddingTop', this.em(k));
    this.setDeltaW([base, under], this.getDeltaW([basebox, underbox], [0, -delta]));
    this.adjustUnderDepth(under, underbox);
  }

}

/*****************************************************************/
/**
 * The CHTMLmover wrapper for the MmlMover object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
// @ts-ignore
export class CHTMLmover<N, T, D> extends
CommonMoverMixin<CHTMLWrapper<any, any, any>, Constructor<CHTMLmsup<any, any, any>>>(CHTMLmsup)  {

  /**
   * The mover wrapper
   */
  public static kind = MmlMover.prototype.kind;

  /**
   * @override
   */
  public static styles: StyleList = {
    'mjx-mover:not([limits="false"])': {
      'padding-top': '.1em'        // big_op_spacing5
    },
    'mjx-mover:not([limits="false"]) > *': {
      display: 'block',
      'text-align': 'left'
    }
  };

  /**
   * @override
   */
  public toCHTML(parent: N) {
    if (this.hasMovableLimits()) {
      super.toCHTML(parent);
      this.adaptor.setAttribute(this.chtml, 'limits', 'false');
      return;
    }
    this.chtml = this.standardCHTMLnode(parent);
    const over = this.adaptor.append(this.chtml, this.html('mjx-over')) as N;
    const base = this.adaptor.append(this.chtml, this.html('mjx-base')) as N;
    this.scriptChild.toCHTML(over);
    this.baseChild.toCHTML(base);
    const overbox = this.scriptChild.getOuterBBox();
    const basebox = this.baseChild.getOuterBBox();
    this.adjustBaseHeight(base, basebox);
    const k = this.getOverKU(basebox, overbox)[0];
    const delta = (this.isLineAbove ? 0 : this.getDelta());
    this.adaptor.setStyle(over, 'paddingBottom', this.em(k));
    this.setDeltaW([base, over], this.getDeltaW([basebox, overbox], [0, delta]));
    this.adjustOverDepth(over, overbox);
  }

}

/*****************************************************************/
/*
 * The CHTMLmunderover wrapper for the MmlMunderover object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
// @ts-ignore
export class CHTMLmunderover<N, T, D> extends
CommonMunderoverMixin<CHTMLWrapper<any, any, any>, Constructor<CHTMLmsubsup<any, any, any>>>(CHTMLmsubsup)  {

  /**
   * The munderover wrapper
   */
  public static kind = MmlMunderover.prototype.kind;

  /**
   * @override
   */
  public static styles: StyleList = {
    'mjx-munderover:not([limits="false"])': {
      'padding-top': '.1em'        // big_op_spacing5
    },
    'mjx-munderover:not([limits="false"]) > *': {
      display: 'block'
    },
  };

  /**
   * @override
   */
  public toCHTML(parent: N) {
    if (this.hasMovableLimits()) {
      super.toCHTML(parent);
      this.adaptor.setAttribute(this.chtml, 'limits', 'false');
      return;
    }
    this.chtml = this.standardCHTMLnode(parent);
    const over = this.adaptor.append(this.chtml, this.html('mjx-over')) as N;
    const table = this.adaptor.append(
      this.adaptor.append(this.chtml, this.html('mjx-box')) as N,
      this.html('mjx-munder')
    ) as N;
    const base = this.adaptor.append(
      this.adaptor.append(table, this.html('mjx-row')) as N,
      this.html('mjx-base')
    ) as N;
    const under = this.adaptor.append(
      this.adaptor.append(table, this.html('mjx-row')) as N,
      this.html('mjx-under')
    ) as N;
    this.overChild.toCHTML(over);
    this.baseChild.toCHTML(base);
    this.underChild.toCHTML(under);
    const overbox = this.overChild.getOuterBBox();
    const basebox = this.baseChild.getOuterBBox();
    const underbox = this.underChild.getOuterBBox();
    this.adjustBaseHeight(base, basebox);
    const ok = this.getOverKU(basebox, overbox)[0];
    const uk = this.getUnderKV(basebox, underbox)[0];
    const delta = this.getDelta();
    this.adaptor.setStyle(over, 'paddingBottom', this.em(ok));
    this.adaptor.setStyle(under, 'paddingTop', this.em(uk));
    this.setDeltaW([base, under, over],
                   this.getDeltaW([basebox, underbox, overbox],
                                  [0, this.isLineBelow ? 0 : -delta, this.isLineAbove ? 0 : delta]));
    this.adjustOverDepth(over, overbox);
    this.adjustUnderDepth(under, underbox);
  }

  /**
   * Make sure styles get output when called from munderover with movable limits
   *
   * @override
   */
  public markUsed() {
    super.markUsed();
    this.jax.wrapperUsage.add(CHTMLmsubsup.kind);
  }

}
