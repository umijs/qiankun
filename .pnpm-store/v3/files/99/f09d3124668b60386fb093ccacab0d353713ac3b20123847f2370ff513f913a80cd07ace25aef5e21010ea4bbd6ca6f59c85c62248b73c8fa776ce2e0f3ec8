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
 * @fileoverview  Implements the SVGmunderover wrapper for the MmlMunderover object
 *                and the special cases SVGmunder and SVGmsup
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVGWrapper, Constructor} from '../Wrapper.js';
import {SVGmsubsup, SVGmsub, SVGmsup} from './msubsup.js';
import {CommonMunderMixin} from '../../common/Wrappers/munderover.js';
import { CommonMoverMixin} from '../../common/Wrappers/munderover.js';
import {CommonMunderoverMixin} from '../../common/Wrappers/munderover.js';
import {MmlMunderover, MmlMunder, MmlMover} from '../../../core/MmlTree/MmlNodes/munderover.js';

/*****************************************************************/
/**
 * The SVGmunder wrapper for the MmlMunder object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
// @ts-ignore
export class SVGmunder<N, T, D> extends
CommonMunderMixin<SVGWrapper<any, any, any>, Constructor<SVGmsub<any, any, any>>>(SVGmsub)  {

  /**
   * The munder wrapper
   */
  public static kind = MmlMunder.prototype.kind;

  /**
   * @override
   */
  public toSVG(parent: N) {
    if (this.hasMovableLimits()) {
      super.toSVG(parent);
      return;
    }

    const svg = this.standardSVGnode(parent);
    const [base, script] = [this.baseChild, this.scriptChild];
    const [bbox, sbox] = [base.getOuterBBox(), script.getOuterBBox()];

    base.toSVG(svg);
    script.toSVG(svg);

    const delta = (this.isLineBelow ? 0 : this.getDelta(true));
    const v = this.getUnderKV(bbox, sbox)[1];
    const [bx, sx] = this.getDeltaW([bbox, sbox], [0, -delta]);

    base.place(bx, 0);
    script.place(sx, v);
  }

}

/*****************************************************************/
/**
 * The SVGmover wrapper for the MmlMover object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
// @ts-ignore
export class SVGmover<N, T, D> extends
CommonMoverMixin<SVGWrapper<any, any, any>, Constructor<SVGmsup<any, any, any>>>(SVGmsup)  {

  /**
   * The mover wrapper
   */
  public static kind = MmlMover.prototype.kind;

  /**
   * @override
   */
  public toSVG(parent: N) {
    if (this.hasMovableLimits()) {
      super.toSVG(parent);
      return;
    }
    const svg = this.standardSVGnode(parent);
    const [base, script] = [this.baseChild, this.scriptChild];
    const [bbox, sbox] = [base.getOuterBBox(), script.getOuterBBox()];

    base.toSVG(svg);
    script.toSVG(svg);

    const delta = (this.isLineAbove ? 0 : this.getDelta());
    const u = this.getOverKU(bbox, sbox)[1];
    const [bx, sx] = this.getDeltaW([bbox, sbox], [0, delta]);

    base.place(bx, 0);
    script.place(sx, u);
  }

}

/*****************************************************************/
/*
 * The SVGmunderover wrapper for the MmlMunderover object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
// @ts-ignore
export class SVGmunderover<N, T, D> extends
CommonMunderoverMixin<SVGWrapper<any, any, any>, Constructor<SVGmsubsup<any, any, any>>>(SVGmsubsup)  {

  /**
   * The munderover wrapper
   */
  public static kind = MmlMunderover.prototype.kind;

  /**
   * @override
   */
  public toSVG(parent: N) {
    if (this.hasMovableLimits()) {
      super.toSVG(parent);
      return;
    }
    const svg = this.standardSVGnode(parent);
    const [base, over, under] = [this.baseChild, this.overChild, this.underChild];
    const [bbox, obox, ubox] = [base.getOuterBBox(), over.getOuterBBox(), under.getOuterBBox()];

    base.toSVG(svg);
    under.toSVG(svg);
    over.toSVG(svg);

    const delta = this.getDelta();
    const u = this.getOverKU(bbox, obox)[1];
    const v = this.getUnderKV(bbox, ubox)[1];
    const [bx, ux, ox] = this.getDeltaW([bbox, ubox, obox],
                                        [0, this.isLineBelow ? 0 : -delta, this.isLineAbove ? 0 : delta]);

    base.place(bx, 0);
    under.place(ux, v);
    over.place(ox, u);
  }

}
