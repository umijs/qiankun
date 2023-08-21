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
 * @fileoverview  Implements the CommonMaction wrapper mixin for the MmlMaction object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AnyWrapper, WrapperConstructor, Constructor, AnyWrapperClass} from '../Wrapper.js';
import {MmlMaction} from '../../../core/MmlTree/MmlNodes/maction.js';
import {BBox} from '../../../util/BBox.js';
import {split} from '../../../util/string.js';

/*****************************************************************/
/**
 * The types needed to define the actiontypes
 *
 * @template W  The maction wrapper type
 */
export type ActionData = {[name: string]: any};
export type ActionHandler<W extends AnyWrapper> = (node: W, data?: ActionData) => void;
export type ActionPair<W extends AnyWrapper> = [ActionHandler<W>, ActionData];
export type ActionMap<W extends AnyWrapper> = Map<string, ActionPair<W>>;
export type ActionDef<W extends AnyWrapper> = [string, [ActionHandler<W>, ActionData]];

export type EventHandler = (event: Event) => void;

/**
 * Data used for tooltip actions
 */
export const TooltipData = {
  dx: '.2em',          // x-offset of tooltip from right side of maction bbox
  dy: '.1em',          // y-offset of tooltip from bottom of maction bbox

  postDelay: 600,      // milliseconds before tooltip posts
  clearDelay: 100,     // milliseconds before tooltip is removed

  hoverTimer: new Map<any, number>(),    // timers for posting tooltips
  clearTimer: new Map<any, number>(),    // timers for removing tooltips

  /*
   * clear the timers if any are active
   */
  stopTimers: (node: any, data: ActionData) => {
    if (data.clearTimer.has(node)) {
      clearTimeout(data.clearTimer.get(node));
      data.clearTimer.delete(node);
    }
    if (data.hoverTimer.has(node)) {
      clearTimeout(data.hoverTimer.get(node));
      data.hoverTimer.delete(node);
    }
  }

};

/*****************************************************************/
/**
 * The CommonMaction interface
 *
 * @template W  The maction wrapper type
 */
export interface CommonMaction<W extends AnyWrapper> extends AnyWrapper {
  /**
   * The handler for the specified actiontype
   */
  action: ActionHandler<W>;
  data: ActionData;

  /**
   * Tooltip offsets
   */
  dx: number;
  dy: number;

  /**
   * The selected child wrapper
   */
  readonly selected: W;

}

/**
 * The CommonMaction class interface
 *
 * @template W  The maction wrapper type
 */
export interface CommonMactionClass<W extends AnyWrapper> extends AnyWrapperClass {
  /**
   * The valid action types and their handlers
   */
  actions: ActionMap<W>;
}

/**
 * Shorthand for the CommonMaction constructor
 *
 * @template W  The maction wrapper type
 */
export type MactionConstructor<W extends AnyWrapper> = Constructor<CommonMaction<W>>;

/*****************************************************************/
/**
 * The CommonMaction wrapper mixin for the MmlMaction object
 *
 * @template W  The maction wrapper type
 * @template T  The Wrapper class constructor type
 */
export function CommonMactionMixin<
  W extends AnyWrapper,
  T extends WrapperConstructor
>(Base: T): MactionConstructor<W> & T {

  return class extends Base {

    /**
     * The handler for the specified actiontype
     */
    public action: ActionHandler<W>;
    /**
     * The data for the specified actiontype
     */
    public data: ActionData;

    /**
     * The x-offset for tooltips
     */
    public dx: number;
    /**
     * The y-offset for tooltips
     */
    public dy: number;

    /**
     * @return {W}  The selected child wrapper
     */
    public get selected(): W {
      const selection = this.node.attributes.get('selection') as number;
      const i = Math.max(1, Math.min(this.childNodes.length, selection)) - 1;
      return this.childNodes[i] || this.wrap((this.node as MmlMaction).selected);
    }

    /*************************************************************/

    /**
     * @override
     */
    constructor(...args: any[]) {
      super(...args);
      const actions = (this.constructor as CommonMactionClass<W>).actions;
      const action = this.node.attributes.get('actiontype') as string;
      const [handler, data] = actions.get(action) || [((_node, _data) => {}) as ActionHandler<W>, {}];
      this.action = handler;
      this.data = data;
      this.getParameters();
    }

    /**
     * Look up attribute parameters
     */
    public getParameters() {
      const offsets = this.node.attributes.get('data-offsets') as string;
      let [dx, dy] = split(offsets || '');
      this.dx = this.length2em(dx || TooltipData.dx);
      this.dy = this.length2em(dy || TooltipData.dy);
    }

    /**
     * @override
     */
    public computeBBox(bbox: BBox, recompute: boolean = false) {
      bbox.updateFrom(this.selected.getOuterBBox());
      this.selected.setChildPWidths(recompute);
    }

  };

}
