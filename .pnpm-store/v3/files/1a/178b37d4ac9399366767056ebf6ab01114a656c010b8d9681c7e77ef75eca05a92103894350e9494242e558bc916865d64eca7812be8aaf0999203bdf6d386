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
 * @fileoverview  Implements the SVGTextNode wrapper for the TextNode object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {TextNode} from '../../../core/MmlTree/MmlNode.js';
import {SVGWrapper, SVGConstructor} from '../Wrapper.js';
import {CommonTextNodeMixin} from '../../common/Wrappers/TextNode.js';
import {StyleList} from '../../../util/StyleList.js';

/*****************************************************************/
/**
 *  The SVGTextNode wrapper for the TextNode object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
// @ts-ignore
export class SVGTextNode<N, T, D> extends
CommonTextNodeMixin<SVGConstructor<any, any, any>>(SVGWrapper) {

  /**
   * The TextNode wrapper
   */
  public static kind = TextNode.prototype.kind;

  /**
   * @override
   */
  public static styles: StyleList = {
    'mjx-container[jax="SVG"] path[data-c], mjx-container[jax="SVG"] use[data-c]': {
      'stroke-width': 3
    }
  };

  /**
   * @override
   */
  public toSVG(parent: N) {
    const text = (this.node as TextNode).getText();
    const variant = this.parent.variant;
    if (text.length === 0) return;
    if (variant === '-explicitFont') {
      this.element = this.adaptor.append(parent, this.jax.unknownText(text, variant));
    } else {
      const chars = this.remappedText(text, variant);
      if (this.parent.childNodes.length > 1) {
        parent = this.element = this.adaptor.append(parent, this.svg('g', {'data-mml-node': 'text'}));
      }
      let x = 0;
      for (const n of chars) {
        x += this.placeChar(n, x, 0, parent, variant);
      }
    }
  }

}
