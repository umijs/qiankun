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
 * @fileoverview  Implements the SVGmsqrt wrapper for the MmlMsqrt object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVGWrapper, SVGConstructor} from '../Wrapper.js';
import {CommonMsqrtMixin} from '../../common/Wrappers/msqrt.js';
import {BBox} from '../../../util/BBox.js';
import {MmlMsqrt} from '../../../core/MmlTree/MmlNodes/msqrt.js';

/*****************************************************************/
/**
 * The SVGmsqrt wrapper for the MmlMsqrt object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class SVGmsqrt<N, T, D> extends CommonMsqrtMixin<SVGConstructor<any, any, any>>(SVGWrapper) {

  /**
   * The msqrt wrapper
   */
  public static kind = MmlMsqrt.prototype.kind;

  /**
   * Indent due to root
   */
  public dx: number = 0;

  /**
   * @override
   */
  public toSVG(parent: N) {
    const surd = this.childNodes[this.surd];
    const base = this.childNodes[this.base];
    const root = (this.root ? this.childNodes[this.root] : null);
    //
    //  Get the parameters for the spacing of the parts
    //
    const sbox = surd.getBBox();
    const bbox = base.getOuterBBox();
    const q = this.getPQ(sbox)[1];
    const t = this.font.params.rule_thickness * this.bbox.scale;
    const H = bbox.h + q + t;
    //
    //  Create the SVG structure for the root
    //
    const SVG = this.standardSVGnode(parent);
    const BASE = this.adaptor.append(SVG, this.svg('g'));
    //
    //  Place the children
    //
    this.addRoot(SVG, root, sbox, H);
    surd.toSVG(SVG);
    surd.place(this.dx, H - sbox.h);
    base.toSVG(BASE);
    base.place(this.dx + sbox.w, 0);
    this.adaptor.append(SVG, this.svg('rect', {
      width: this.fixed(bbox.w), height: this.fixed(t),
      x: this.fixed(this.dx + sbox.w), y: this.fixed(H - t)
    }));
  }

  /**
   * Add root HTML (overridden in mroot)
   *
   * @param {N} ROOT           The container for the root
   * @param {SVGWrapper} root  The wrapped MML root content
   * @param {BBox} sbox        The bounding box of the surd
   * @param {number} H         The height of the root as a whole
   */
  protected addRoot(_ROOT: N, _root: SVGWrapper<N, T, D>, _sbox: BBox, _H: number) {
  }

}
