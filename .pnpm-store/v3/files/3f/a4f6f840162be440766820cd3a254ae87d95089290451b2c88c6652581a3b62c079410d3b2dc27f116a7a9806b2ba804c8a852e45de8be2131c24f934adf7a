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
 * @fileoverview  Implements the SVGmrow wrapper for the MmlMrow object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVGWrapper, SVGConstructor, Constructor} from '../Wrapper.js';
import {CommonMrowMixin} from '../../common/Wrappers/mrow.js';
import {CommonInferredMrowMixin} from '../../common/Wrappers/mrow.js';
import {MmlMrow, MmlInferredMrow} from '../../../core/MmlTree/MmlNodes/mrow.js';

/*****************************************************************/
/**
 * The SVGmrow wrapper for the MmlMrow object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
// @ts-ignore
export class SVGmrow<N, T, D> extends
CommonMrowMixin<SVGConstructor<any, any, any>>(SVGWrapper) {

  /**
   * The mrow wrapper
   */
  public static kind = MmlMrow.prototype.kind;

  /**
   * @override
   */
  public toSVG(parent: N) {
    const svg = (this.node.isInferred ? (this.element = parent) : this.standardSVGnode(parent));
    this.addChildren(svg);
    // FIXME:  handle line breaks
  }

}

/*****************************************************************/
/**
 *  The SVGinferredMrow wrapper for the MmlInferredMrow object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
// @ts-ignore
export class SVGinferredMrow<N, T, D> extends
CommonInferredMrowMixin<Constructor<SVGmrow<any, any, any>>>(SVGmrow) {

  /**
   * The inferred-mrow wrapper
   */
  public static kind = MmlInferredMrow.prototype.kind;

}
