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
 * @fileoverview  Implements the CommonMunderover wrapper mixin for the MmlMunderover object
 *                and the special cases CommonMunder and CommonMsup
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AnyWrapper, Constructor} from '../Wrapper.js';
import {CommonScriptbase, ScriptbaseConstructor} from './scriptbase.js';
import {MmlMunderover, MmlMunder, MmlMover} from '../../../core/MmlTree/MmlNodes/munderover.js';
import {BBox} from '../../../util/BBox.js';

/*****************************************************************/
/**
 * The CommonMunder interface
 *
 * @template W  The child-node Wrapper class
 */
export interface CommonMunder<W extends AnyWrapper> extends CommonScriptbase<W> {
}

/**
 * Shorthand for the CommonMunder constructor
 *
 * @template W  The child-node Wrapper class
 */
export type MunderConstructor<W extends AnyWrapper> = Constructor<CommonMunder<W>>;

/*****************************************************************/
/**
 * The CommonMunder wrapper mixin for the MmlMunder object
 *
 * @template W  The child-node Wrapper class
 * @template T  The Wrapper class constructor type
 */
export function CommonMunderMixin<
  W extends AnyWrapper,
  T extends ScriptbaseConstructor<W>
>(Base: T): MunderConstructor<W> & T {

  return class extends Base {

    /**
     * @override
     */
    public get scriptChild() {
      return this.childNodes[(this.node as MmlMunder).under];
    }

    /**
     * @override
     * @constructor
     */
    constructor(...args: any[]) {
      super(...args);
      this.stretchChildren();
    }

    /**
     * @override
     */
    public computeBBox(bbox: BBox, recompute: boolean = false) {
      if (this.hasMovableLimits()) {
        super.computeBBox(bbox, recompute);
        return;
      }
      bbox.empty();
      const basebox = this.baseChild.getOuterBBox();
      const underbox = this.scriptChild.getOuterBBox();
      const v = this.getUnderKV(basebox, underbox)[1];
      const delta = (this.isLineBelow ? 0 : this.getDelta(true));
      const [bw, uw] = this.getDeltaW([basebox, underbox], [0, -delta]);
      bbox.combine(basebox, bw, 0);
      bbox.combine(underbox, uw, v);
      bbox.d += this.font.params.big_op_spacing5;
      bbox.clean();
      this.setChildPWidths(recompute);
    }

  };

}

/*****************************************************************/
/**
 * The CommonMover interface
 *
 * @template W  The child-node Wrapper class
 */
export interface CommonMover<W extends AnyWrapper> extends CommonScriptbase<W> {
}

/**
 * Shorthand for the CommonMover constructor
 *
 * @template W  The child-node Wrapper class
 */
export type MoverConstructor<W extends AnyWrapper> = Constructor<CommonMover<W>>;

/*****************************************************************/
/**
 * The CommonMover wrapper mixin for the MmlMover object
 *
 * @template W  The child-node Wrapper class
 * @template T  The Wrapper class constructor type
 */
export function CommonMoverMixin<
  W extends AnyWrapper,
  T extends ScriptbaseConstructor<W>
>(Base: T): MoverConstructor<W> & T {

  return class extends Base {

    /**
     * @override
     */
    public get scriptChild() {
      return this.childNodes[(this.node as MmlMover).over];
    }

    /**
     * @override
     * @constructor
     */
    constructor(...args: any[]) {
      super(...args);
      this.stretchChildren();
    }

    /**
     * @override
     */
    public computeBBox(bbox: BBox) {
      if (this.hasMovableLimits()) {
        super.computeBBox(bbox);
        return;
      }
      bbox.empty();
      const basebox = this.baseChild.getOuterBBox();
      const overbox = this.scriptChild.getOuterBBox();
      if (this.node.attributes.get('accent')) {
        basebox.h = Math.max(basebox.h, this.font.params.x_height * basebox.scale);
      }
      const u = this.getOverKU(basebox, overbox)[1];
      const delta = (this.isLineAbove ? 0 : this.getDelta());
      const [bw, ow] = this.getDeltaW([basebox, overbox], [0, delta]);
      bbox.combine(basebox, bw, 0);
      bbox.combine(overbox, ow, u);
      bbox.h += this.font.params.big_op_spacing5;
      bbox.clean();
    }

  };

}

/*****************************************************************/
/**
 * The CommonMunderover interface
 *
 * @template W  The child-node Wrapper class
 */
export interface CommonMunderover<W extends AnyWrapper> extends CommonScriptbase<W> {

  /*
   * The wrapped under node
   */
  readonly underChild: W;

  /*
   * The wrapped overder node
   */
  readonly overChild: W;

}

/**
 * Shorthand for the CommonMunderover constructor
 *
 * @template W  The child-node Wrapper class
 */
export type MunderoverConstructor<W extends AnyWrapper> = Constructor<CommonMunderover<W>>;

/*****************************************************************/
/*
 * The CommonMunderover wrapper for the MmlMunderover object
 *
 * @template W  The child-node Wrapper class
 * @template T  The Wrapper class constructor type
 */
export function CommonMunderoverMixin<
  W extends AnyWrapper,
  T extends ScriptbaseConstructor<W>
>(Base: T): MunderoverConstructor<W> & T {

  return class extends Base {

    /*
     * @return {W}   The wrapped under node
     */
    public get underChild() {
      return this.childNodes[(this.node as MmlMunderover).under];
    }

    /*
     * @return {W}   The wrapped overder node
     */
    public get overChild() {
      return this.childNodes[(this.node as MmlMunderover).over];
    }

    /*
     * Needed for movablelimits
     *
     * @override
     */
    public get subChild() {
      return this.underChild;
    }

    /*
     * Needed for movablelimits
     *
     * @override
     */
    public get supChild() {
      return this.overChild;
    }

    /**
     * @override
     * @constructor
     */
    constructor(...args: any[]) {
      super(...args);
      this.stretchChildren();
    }

    /**
     * @override
     */
    public computeBBox(bbox: BBox) {
      if (this.hasMovableLimits()) {
        super.computeBBox(bbox);
        return;
      }
      bbox.empty();
      const overbox = this.overChild.getOuterBBox();
      const basebox = this.baseChild.getOuterBBox();
      const underbox = this.underChild.getOuterBBox();
      if (this.node.attributes.get('accent')) {
        basebox.h = Math.max(basebox.h, this.font.params.x_height * basebox.scale);
      }
      const u = this.getOverKU(basebox, overbox)[1];
      const v = this.getUnderKV(basebox, underbox)[1];
      const delta = this.getDelta();
      const [bw, uw, ow] = this.getDeltaW([basebox, underbox, overbox],
                                          [0, this.isLineBelow ? 0 : -delta, this.isLineAbove ? 0 : delta]);
      bbox.combine(basebox, bw, 0);
      bbox.combine(overbox, ow, u);
      bbox.combine(underbox, uw, v);
      const z = this.font.params.big_op_spacing5;
      bbox.h += z;
      bbox.d += z;
      bbox.clean();
    }

  };

}
