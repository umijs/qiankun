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
 * @fileoverview  Implements the a base class for SVGmsubsup, SVGmunderover
 *                and their relatives.  (Since munderover can become msubsup
 *                when movablelimits is set, munderover needs to be able to
 *                do the same thing as msubsup in some cases.)
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVGWrapper, SVGConstructor} from '../Wrapper.js';
import {CommonScriptbaseMixin} from '../../common/Wrappers/scriptbase.js';

/*****************************************************************/
/**
 * A base class for msup/msub/msubsup and munder/mover/munderover
 * wrapper implementations
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
// @ts-ignore
export class SVGscriptbase<N, T, D> extends
CommonScriptbaseMixin<SVGWrapper<any, any, any>, SVGConstructor<any, any, any>>(SVGWrapper) {

  /**
   * The scriptbase wrapper
   */
  public static kind = 'scriptbase';

  /**
   * This gives the common output for msub and msup.  It is overridden
   * for all the others (msubsup, munder, mover, munderover).
   *
   * @override
   */
  public toSVG(parent: N) {
    const svg = this.standardSVGnode(parent);
    const w = this.getBaseWidth();
    const [x, v] = this.getOffset();
    this.baseChild.toSVG(svg);
    this.scriptChild.toSVG(svg);
    this.scriptChild.place(w + x, v);
  }

}
