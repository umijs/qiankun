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
 * @fileoverview  Implements the CHTMLTextNode wrapper for the TextNode object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {TextNode} from '../../../core/MmlTree/MmlNode.js';
import {CHTMLWrapper, CHTMLConstructor} from '../Wrapper.js';
import {CommonTextNodeMixin} from '../../common/Wrappers/TextNode.js';
import {StyleList} from '../../../util/StyleList.js';

/*****************************************************************/
/**
 *  The CHTMLTextNode wrapper for the TextNode object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
// @ts-ignore
export class CHTMLTextNode<N, T, D> extends
CommonTextNodeMixin<CHTMLConstructor<any, any, any>>(CHTMLWrapper) {

  /**
   * The TextNode wrapper
   */
  public static kind = TextNode.prototype.kind;

  /**
   * @override
   */
  public static autoStyle = false;

  /**
   * @override
   */
  public static styles: StyleList = {
    'mjx-c': {
      display: 'inline-block'
    },
    'mjx-utext': {
      display: 'inline-block',
      padding: '.75em 0 .2em 0'
    }
  };

  /**
   * @override
   */
  public toCHTML(parent: N) {
    this.markUsed();
    const adaptor = this.adaptor;
    const variant = this.parent.variant;
    const text = (this.node as TextNode).getText();
    if (text.length === 0) return;
    if (variant === '-explicitFont') {
      adaptor.append(parent, this.jax.unknownText(text, variant, this.getBBox().w));
    } else {
      const chars = this.remappedText(text, variant);
      for (const n of chars) {
        const data = this.getVariantChar(variant, n)[3];
        const font = (data.f ? ' TEX-' + data.f : '');
        const node = (data.unknown ?
                      this.jax.unknownText(String.fromCodePoint(n), variant) :
                      this.html('mjx-c', {class: this.char(n) + font}));
        adaptor.append(parent, node);
        !data.unknown && this.font.charUsage.add([variant, n]);
      }
    }
  }

}
