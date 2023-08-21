/*************************************************************
 *
 *  Copyright (c) 2018-2022 The MathJax Consortium
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
 * @fileoverview  Implements the CHTMLmglyph wrapper for the MmlMglyph object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper, CHTMLConstructor} from '../Wrapper.js';
import {CommonMglyphMixin} from '../../common/Wrappers/mglyph.js';
import {MmlMglyph} from '../../../core/MmlTree/MmlNodes/mglyph.js';
import {CHTMLTextNode} from './TextNode.js';
import {StyleList, StyleData} from '../../../util/StyleList.js';

/*****************************************************************/
/**
 * The CHTMLmglyph wrapper for the MmlMglyph object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
// @ts-ignore
export class CHTMLmglyph<N, T, D> extends
CommonMglyphMixin<CHTMLConstructor<any, any, any>>(CHTMLWrapper) {

  /**
   * The mglyph wrapper
   */
  public static kind = MmlMglyph.prototype.kind;

  /**
   * @override
   */
  public static styles: StyleList = {
    'mjx-mglyph > img': {
      display: 'inline-block',
      border: 0,
      padding: 0
    }
  };

  /**
   * @override
   */
  public toCHTML(parent: N) {
    const chtml = this.standardCHTMLnode(parent);
    if (this.charWrapper) {
      (this.charWrapper as CHTMLTextNode<N, T, D>).toCHTML(chtml);
      return;
    }
    const {src, alt} = this.node.attributes.getList('src', 'alt');
    const styles: StyleData = {
      width: this.em(this.width),
      height: this.em(this.height)
    };
    if (this.valign) {
      styles.verticalAlign = this.em(this.valign);
    }
    const img = this.html('img', {src: src, style: styles, alt: alt, title: alt});
    this.adaptor.append(chtml, img);
  }

}
