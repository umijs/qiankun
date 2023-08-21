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
 * @fileoverview  Implements the SVGmpadded wrapper for the MmlMpadded object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVGWrapper, SVGConstructor} from '../Wrapper.js';
import {CommonMpaddedMixin} from '../../common/Wrappers/mpadded.js';
import {MmlMpadded} from '../../../core/MmlTree/MmlNodes/mpadded.js';

/*****************************************************************/
/**
 * The SVGmpadded wrapper for the MmlMpadded object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
// @ts-ignore
export class SVGmpadded<N, T, D> extends
CommonMpaddedMixin<SVGConstructor<any, any, any>>(SVGWrapper) {

  /**
   * The mpadded wrapper
   */
  public static kind = MmlMpadded.prototype.kind;

  /**
   * @override
   */
  public toSVG(parent: N) {
    let svg = this.standardSVGnode(parent);
    const [ , , , , , dw, x, y, dx] = this.getDimens();
    const align = (this.node.attributes.get('data-align') as string) || 'left';
    const X = x + dx - (dw < 0 && align !== 'left' ? align === 'center' ? dw / 2 : dw : 0);
    //
    // If there is a horizontal or vertical shift,
    //   use relative positioning to move the contents
    //
    if (X || y) {
      svg = this.adaptor.append(svg, this.svg('g'));
      this.place(X, y, svg);
    }
    this.addChildren(svg);
  }

}
