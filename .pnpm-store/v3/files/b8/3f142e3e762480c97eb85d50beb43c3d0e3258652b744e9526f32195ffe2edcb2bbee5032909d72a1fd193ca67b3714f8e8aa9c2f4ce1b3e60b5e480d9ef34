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
 * @fileoverview  Implements the SVGMroot wrapper for the MmlMroot object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVGWrapper, Constructor} from '../Wrapper.js';
import {SVGmsqrt} from './msqrt.js';
import {CommonMrootMixin} from '../../common/Wrappers/mroot.js';
import {BBox} from '../../../util/BBox.js';
import {MmlMroot} from '../../../core/MmlTree/MmlNodes/mroot.js';

/*****************************************************************/
/**
 * The SVGmroot wrapper for the MmlMroot object (extends SVGmsqrt)
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class SVGmroot<N, T, D> extends CommonMrootMixin<Constructor<SVGmsqrt<any, any, any>>>(SVGmsqrt) {

  /**
   * The mroot wrapper
   */
  public static kind = MmlMroot.prototype.kind;

  /**
   * @override
   */
  protected addRoot(ROOT: N, root: SVGWrapper<N, T, D>, sbox: BBox, H: number) {
    root.toSVG(ROOT);
    const [x, h, dx] = this.getRootDimens(sbox, H);
    const bbox = root.getOuterBBox();
    root.place(dx * bbox.rscale, h);
    this.dx = x;
  }

}
