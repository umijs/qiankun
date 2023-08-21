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
 * @fileoverview  Implements the SVGmath wrapper for the MmlMath object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVGWrapper, SVGConstructor} from '../Wrapper.js';
import {CommonMathMixin} from '../../common/Wrappers/math.js';
import {MmlMath} from '../../../core/MmlTree/MmlNodes/math.js';
import {StyleList} from '../../../util/StyleList.js';
import {BBox} from '../../../util/BBox.js';

/*****************************************************************/
/**
 * The SVGmath wrapper for the MmlMath object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
// @ts-ignore
export class SVGmath<N, T, D> extends
CommonMathMixin<SVGConstructor<any, any, any>>(SVGWrapper) {

  /**
   * The math wrapper
   */
  public static kind = MmlMath.prototype.kind;

  /**
   * @overreide
   */
  public static styles: StyleList = {
    'mjx-container[jax="SVG"][display="true"]': {
      display: 'block',
      'text-align': 'center',
      margin: '1em 0'
    },
    'mjx-container[jax="SVG"][display="true"][width="full"]': {
      display: 'flex'
    },
    'mjx-container[jax="SVG"][justify="left"]': {
      'text-align': 'left'
    },
    'mjx-container[jax="SVG"][justify="right"]': {
      'text-align': 'right'
    }
  };

  /**
   * @override
   */
  public toSVG(parent: N) {
    super.toSVG(parent);
    const adaptor = this.adaptor;
    const display = (this.node.attributes.get('display') === 'block');
    if (display) {
      adaptor.setAttribute(this.jax.container, 'display', 'true');
      this.handleDisplay();
    }
    if (this.jax.document.options.internalSpeechTitles) {
      this.handleSpeech();
    }
  }

  /**
   * Set the justification, and get the minwidth and shift needed
   * for the displayed equation.
   */
  protected handleDisplay() {
    const [align, shift] = this.getAlignShift();
    if (align !== 'center') {
      this.adaptor.setAttribute(this.jax.container, 'justify', align);
    }
    if (this.bbox.pwidth === BBox.fullWidth) {
      this.adaptor.setAttribute(this.jax.container, 'width', 'full');
      if (this.jax.table) {
        let {L, w, R} = this.jax.table.getOuterBBox();
        if (align === 'right') {
          R = Math.max(R || -shift, -shift);
        } else if (align === 'left') {
          L = Math.max(L || shift, shift);
        } else if (align === 'center') {
          w += 2 * Math.abs(shift);
        }
        this.jax.minwidth = Math.max(0, L + w + R);
      }
    } else {
      this.jax.shift = shift;
    }
  }

  /**
   * Handle adding speech to the top-level node, if any.
   */
  protected handleSpeech() {
    const adaptor = this.adaptor;
    const attributes = this.node.attributes;
    const speech = (attributes.get('aria-label') || attributes.get('data-semantic-speech')) as string;
    if (speech) {
      const id = this.getTitleID();
      const label = this.svg('title', {id}, [this.text(speech)]);
      adaptor.insert(label, adaptor.firstChild(this.element));
      adaptor.setAttribute(this.element, 'aria-labeledby', id);
      adaptor.removeAttribute(this.element, 'aria-label');
      for (const child of this.childNodes[0].childNodes) {
        adaptor.setAttribute(child.element, 'aria-hidden', 'true');
      }
    }
  }

  /**
   * @return {string}  A unique ID to use for aria-labeledby title elements
   */
  protected getTitleID(): string {
    return 'mjx-svg-title-' + String(this.jax.options.titleID++);
  }

  /**
   * @override
   */
  public setChildPWidths(recompute: boolean, w: number = null, _clear: boolean = true) {
    return super.setChildPWidths(recompute,
                                 this.parent ? w : this.metrics.containerWidth / this.jax.pxPerEm,
                                 false);
  }

}
