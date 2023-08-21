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
 * @fileoverview  Implements the CHTMLmtr wrapper for the MmlMtr object
 *                and CHTMLmlabeledtr for MmlMlabeledtr
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper, CHTMLConstructor, Constructor} from '../Wrapper.js';
import {CommonMtrMixin} from '../../common/Wrappers/mtr.js';
import {CommonMlabeledtrMixin} from '../../common/Wrappers/mtr.js';
import {CHTMLmtable} from './mtable.js';
import {CHTMLmtd} from './mtd.js';
import {MmlMtr, MmlMlabeledtr} from '../../../core/MmlTree/MmlNodes/mtr.js';
import {StyleList} from '../../../util/StyleList.js';

/*****************************************************************/
/**
 * The CHTMLmtr wrapper for the MmlMtr object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
// @ts-ignore
export class CHTMLmtr<N, T, D> extends
CommonMtrMixin<CHTMLmtd<any, any, any>, CHTMLConstructor<any, any, any>>(CHTMLWrapper) {

  /**
   * The mtr wrapper
   */
  public static kind = MmlMtr.prototype.kind;

  /**
   * @override
   */
  public static styles: StyleList = {
    'mjx-mtr': {
      display: 'table-row',
    },
    'mjx-mtr[rowalign="top"] > mjx-mtd': {
      'vertical-align': 'top'
    },
    'mjx-mtr[rowalign="center"] > mjx-mtd': {
      'vertical-align': 'middle'
    },
    'mjx-mtr[rowalign="bottom"] > mjx-mtd': {
      'vertical-align': 'bottom'
    },
    'mjx-mtr[rowalign="baseline"] > mjx-mtd': {
      'vertical-align': 'baseline'
    },
    'mjx-mtr[rowalign="axis"] > mjx-mtd': {
      'vertical-align': '.25em'
    }
  };

  /**
   * @override
   */
  public toCHTML(parent: N) {
    super.toCHTML(parent);
    const align = this.node.attributes.get('rowalign') as string;
    if (align !== 'baseline') {
      this.adaptor.setAttribute(this.chtml, 'rowalign', align);
    }
  }

}

/*****************************************************************/
/**
 * The CHTMLlabeledmtr wrapper for the MmlMlabeledtr object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLmlabeledtr<N, T, D> extends
CommonMlabeledtrMixin<CHTMLmtd<any, any, any>, Constructor<CHTMLmtr<any, any, any>>>(CHTMLmtr) {

  /**
   * The mlabeledtr wrapper
   */
  public static kind = MmlMlabeledtr.prototype.kind;

  /**
   * @override
   */
  public static styles: StyleList = {
    'mjx-mlabeledtr': {
      display: 'table-row'
    },
    'mjx-mlabeledtr[rowalign="top"] > mjx-mtd': {
      'vertical-align': 'top'
    },
    'mjx-mlabeledtr[rowalign="center"] > mjx-mtd': {
      'vertical-align': 'middle'
    },
    'mjx-mlabeledtr[rowalign="bottom"] > mjx-mtd': {
      'vertical-align': 'bottom'
    },
    'mjx-mlabeledtr[rowalign="baseline"] > mjx-mtd': {
      'vertical-align': 'baseline'
    },
    'mjx-mlabeledtr[rowalign="axis"] > mjx-mtd': {
      'vertical-align': '.25em'
    }
  };

  /**
   * @override
   */
  public toCHTML(parent: N) {
    super.toCHTML(parent);
    const child = this.adaptor.firstChild(this.chtml) as N;
    if (child) {
      //
      // Remove label and put it into the labels box inside a row
      //
      this.adaptor.remove(child);
      const align = this.node.attributes.get('rowalign') as string;
      const attr = (align !== 'baseline' && align !== 'axis' ? {rowalign: align} : {});
      const row = this.html('mjx-mtr', attr, [child]);
      this.adaptor.append((this.parent as CHTMLmtable<N, T, D>).labels, row);
    }
  }

  /**
   * @override
   */
  public markUsed() {
    super.markUsed();
    this.jax.wrapperUsage.add(CHTMLmtr.kind);
  }

}
