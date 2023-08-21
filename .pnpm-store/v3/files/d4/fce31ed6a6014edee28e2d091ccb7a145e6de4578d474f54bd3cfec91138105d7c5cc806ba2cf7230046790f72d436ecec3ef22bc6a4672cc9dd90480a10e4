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
 * @fileoverview  Implements the SVGsemantics wrapper for the MmlSemantics object
 *                and the associated wrappers for annotations
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVGWrapper, SVGConstructor} from '../Wrapper.js';
import {CommonSemanticsMixin} from '../../common/Wrappers/semantics.js';
import {BBox} from '../../../util/BBox.js';
import {MmlSemantics, MmlAnnotation, MmlAnnotationXML} from '../../../core/MmlTree/MmlNodes/semantics.js';
import {XMLNode} from '../../../core/MmlTree/MmlNode.js';
import {StyleList} from '../../../util/StyleList.js';

/*****************************************************************/
/**
 * The SVGsemantics wrapper for the MmlSemantics object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
// @ts-ignore
export class SVGsemantics<N, T, D> extends
CommonSemanticsMixin<SVGConstructor<any, any, any>>(SVGWrapper) {

  /**
   * The semantics wrapper
   */
  public static kind = MmlSemantics.prototype.kind;

  /**
   * @override
   */
  public toSVG(parent: N) {
    const svg = this.standardSVGnode(parent);
    if (this.childNodes.length) {
      this.childNodes[0].toSVG(svg);
    }
  }

}


/*****************************************************************/
/**
 * The SVGannotation wrapper for the MmlAnnotation object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class SVGannotation<N, T, D> extends SVGWrapper<N, T, D> {

  /**
   * The annotation wrapper
   */
  public static kind = MmlAnnotation.prototype.kind;

  /**
   * @override
   */
  public toSVG(parent: N) {
    // FIXME:  output as plain text
    super.toSVG(parent);
  }

  /**
   * @override
   */
  public computeBBox() {
    // FIXME:  compute using the DOM, if possible
    return this.bbox;
  }

}

/*****************************************************************/
/**
 * The SVGannotationXML wrapper for the MmlAnnotationXML object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class SVGannotationXML<N, T, D> extends SVGWrapper<N, T, D> {

  /**
   * The annotation-xml wrapper
   */
  public static kind = MmlAnnotationXML.prototype.kind;

  /**
   * @override
   */
  public static styles: StyleList = {
    'foreignObject[data-mjx-xml]': {
      'font-family': 'initial',
      'line-height': 'normal',
      overflow: 'visible'
    }
  };

}

/*****************************************************************/
/**
 * The SVGxml wrapper for the XMLNode object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class SVGxml<N, T, D> extends SVGWrapper<N, T, D> {

  /**
   * The XMLNode wrapper
   */
  public static kind = XMLNode.prototype.kind;

  /**
   * Don't include inline-block CSS for this element
   */
  public static autoStyle = false;

  /**
   * @override
   */
  public toSVG(parent: N) {
    const xml = this.adaptor.clone((this.node as XMLNode).getXML() as N);
    const em = this.jax.math.metrics.em * this.jax.math.metrics.scale;
    const scale = this.fixed(1 / em);
    const {w, h, d} = this.getBBox();
    this.element = this.adaptor.append(parent, this.svg('foreignObject', {
      'data-mjx-xml': true,
      y: this.jax.fixed(-h * em) + 'px',
      width: this.jax.fixed(w * em) + 'px',
      height: this.jax.fixed((h + d) * em) + 'px',
      transform: `scale(${scale}) matrix(1 0 0 -1 0 0)`
    }, [xml]));
  }

  /**
   * @override
   */
  public computeBBox(bbox: BBox, _recompute: boolean = false) {
    const {w, h, d} = this.jax.measureXMLnode((this.node as XMLNode).getXML() as N);
    bbox.w = w;
    bbox.h = h;
    bbox.d = d;
  }

  /**
   * @override
   */
  protected getStyles() {}

  /**
   * @override
   */
  protected getScale() {}

  /**
   * @override
   */
  protected getVariant() {}
}
