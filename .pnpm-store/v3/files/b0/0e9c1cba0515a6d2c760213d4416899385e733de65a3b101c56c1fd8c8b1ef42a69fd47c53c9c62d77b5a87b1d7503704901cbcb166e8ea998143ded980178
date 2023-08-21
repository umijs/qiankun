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
 * @fileoverview  Implements the SVGmglyph wrapper for the MmlMglyph object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVGWrapper, SVGConstructor} from '../Wrapper.js';
import {CommonMglyphMixin} from '../../common/Wrappers/mglyph.js';
import {MmlMglyph} from '../../../core/MmlTree/MmlNodes/mglyph.js';
import {SVGTextNode} from './TextNode.js';
import {OptionList} from '../../../util/Options.js';

/*****************************************************************/
/**
 * The SVGmglyph wrapper for the MmlMglyph object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
// @ts-ignore
export class SVGmglyph<N, T, D> extends
CommonMglyphMixin<SVGConstructor<any, any, any>>(SVGWrapper) {

  /**
   * The mglyph wrapper
   */
  public static kind = MmlMglyph.prototype.kind;

  /**
   * @override
   */
  public toSVG(parent: N) {
    const svg = this.standardSVGnode(parent);
    if (this.charWrapper) {
      (this.charWrapper as SVGTextNode<N, T, D>).toSVG(svg);
      return;
    }
    const {src, alt} = this.node.attributes.getList('src', 'alt');
    const h = this.fixed(this.height);
    const w = this.fixed(this.width);
    const y = this.fixed(this.height + (this.valign || 0));
    const properties: OptionList = {
      width: w, height: h,
      transform: 'translate(0 ' + y + ') matrix(1 0 0 -1 0 0)',
      preserveAspectRatio: 'none',
      'aria-label': alt,
      href: src
    };
    const img = this.svg('image', properties);
    this.adaptor.append(svg, img);
  }

}
