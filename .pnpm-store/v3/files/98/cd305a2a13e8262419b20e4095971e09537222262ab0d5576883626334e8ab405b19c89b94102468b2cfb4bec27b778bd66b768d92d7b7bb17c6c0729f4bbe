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
 * @fileoverview  Implements the CHTMLsemantics wrapper for the MmlSemantics object
 *                and the associated wrappers for annotations
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper, CHTMLConstructor} from '../Wrapper.js';
import {CommonSemanticsMixin} from '../../common/Wrappers/semantics.js';
import {BBox} from '../../../util/BBox.js';
import {MmlSemantics, MmlAnnotation, MmlAnnotationXML} from '../../../core/MmlTree/MmlNodes/semantics.js';
import {XMLNode} from '../../../core/MmlTree/MmlNode.js';
import {StyleList} from '../../../util/StyleList.js';

/*****************************************************************/
/**
 * The CHTMLsemantics wrapper for the MmlSemantics object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
// @ts-ignore
export class CHTMLsemantics<N, T, D> extends
CommonSemanticsMixin<CHTMLConstructor<any, any, any>>(CHTMLWrapper) {

  /**
   * The semantics wrapper
   */
  public static kind = MmlSemantics.prototype.kind;

  /**
   * @override
   */
  public toCHTML(parent: N) {
    const chtml = this.standardCHTMLnode(parent);
    if (this.childNodes.length) {
      this.childNodes[0].toCHTML(chtml);
    }
  }

}


/*****************************************************************/
/**
 * The CHTMLannotation wrapper for the MmlAnnotation object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLannotation<N, T, D> extends CHTMLWrapper<N, T, D> {

  /**
   * The annotation wrapper
   */
  public static kind = MmlAnnotation.prototype.kind;

  /**
   * @override
   */
  public toCHTML(parent: N) {
    // FIXME:  output as plain text
    super.toCHTML(parent);
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
 * The CHTMLannotationXML wrapper for the MmlAnnotationXML object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLannotationXML<N, T, D> extends CHTMLWrapper<N, T, D> {

  /**
   * The annotation-xml wrapper
   */
  public static kind = MmlAnnotationXML.prototype.kind;

  /**
   * @override
   */
  public static styles: StyleList = {
    'mjx-annotation-xml': {
      'font-family': 'initial',
      'line-height': 'normal'
    }
  };

}

/*****************************************************************/
/**
 * The CHTMLxml wrapper for the XMLNode object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLxml<N, T, D> extends CHTMLWrapper<N, T, D> {

  /**
   * The xml wrapper
   */
  public static kind = XMLNode.prototype.kind;

  /**
   * Don't set up inline-block styles for this
   */
  public static autoStyle = false;

  /**
   * @override
   */
  public toCHTML(parent: N) {
    this.chtml = this.adaptor.append(parent, this.adaptor.clone((this.node as XMLNode).getXML() as N));
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
