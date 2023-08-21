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
 * @fileoverview  Implements the SVGmfenced wrapper for the MmlMfenced object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVGWrapper, SVGConstructor} from '../Wrapper.js';
import {CommonMfencedMixin} from '../../common/Wrappers/mfenced.js';
import {MmlMfenced} from '../../../core/MmlTree/MmlNodes/mfenced.js';
import {SVGinferredMrow} from './mrow.js';

/*****************************************************************/
/**
 * The SVGmfenced wrapper for the MmlMfenced object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class SVGmfenced<N, T, D> extends CommonMfencedMixin<SVGConstructor<any, any, any>>(SVGWrapper) {

  /**
   * The mfenced wrapper
   */
  public static kind = MmlMfenced.prototype.kind;

  /**
   * An mrow used to render the result
   */
  public mrow: SVGinferredMrow<N, T, D>;

  /**
   * @override
   */
  public toSVG(parent: N) {
    const svg = this.standardSVGnode(parent);
    this.setChildrenParent(this.mrow);  // temporarily change parents to the mrow
    this.mrow.toSVG(svg);
    this.setChildrenParent(this);       // put back the correct parents
  }

  /**
   * @param {SVGWrapper} parent   The parent to use for the fenced children
   */
  protected setChildrenParent(parent: SVGWrapper<N, T, D>) {
    for (const child of this.childNodes) {
      child.parent = parent;
    }
  }

}
