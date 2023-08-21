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
 * @fileoverview  Implements the SVGmerror wrapper for the MmlMerror object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVGWrapper} from '../Wrapper.js';
import {MmlMerror} from '../../../core/MmlTree/MmlNodes/merror.js';
import {StyleList} from '../../../util/StyleList.js';

/*****************************************************************/
/**
 *  The SVGmerror wrapper for the MmlMerror object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class SVGmerror<N, T, D> extends SVGWrapper<N, T, D> {

  /**
   * The merror wrapper
   */
  public static kind = MmlMerror.prototype.kind;

  /**
   * @override
   */
  public static styles: StyleList = {
    'g[data-mml-node="merror"] > g': {
      fill: 'red',
      stroke: 'red'
    },
    'g[data-mml-node="merror"] > rect[data-background]': {
      fill: 'yellow',
      stroke: 'none'
    }
  };

  /**
   * @override
   */
  public toSVG(parent: N) {
    const svg = this.standardSVGnode(parent);
    const {h, d, w} = this.getBBox();
    this.adaptor.append(this.element, this.svg('rect', {
      'data-background': true,
      width: this.fixed(w), height: this.fixed(h + d), y: this.fixed(-d)
    }));
    const title = this.node.attributes.get('title') as string;
    if (title) {
      this.adaptor.append(this.element, this.svg('title', {}, [this.adaptor.text(title)]));
    }
    this.addChildren(svg);
  }

}
