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
 * @fileoverview  Implements the CommonMrow wrapper minin for the MmlMrow object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AnyWrapper, WrapperConstructor, Constructor} from '../Wrapper.js';
import {CommonMo} from './mo.js';
import {BBox} from '../../../util/BBox.js';
import {DIRECTION} from '../FontData.js';

/*****************************************************************/
/**
 * The CommonMrow interface
 */
export interface CommonMrow extends AnyWrapper {
  /**
   * Handle vertical stretching of children to match height of
   *  other nodes in the row.
   */
  stretchChildren(): void;
}

/**
 * Shorthand for the CommonMrow constructor
 */
export type MrowConstructor = Constructor<CommonMrow>;

/*****************************************************************/
/**
 * The CommonMrow wrapper mixin for the MmlMrow object
 *
 * @template T  The Wrapper class constructor type
 */
export function CommonMrowMixin<T extends WrapperConstructor>(Base: T): MrowConstructor & T {

  return class extends Base {

    /**
     * @override
     */
    get fixesPWidth() {
      return false;
    }

    /**
     * @override
     * @constructor
     */
    constructor(...args: any[]) {
      super(...args);
      this.stretchChildren();
      for (const child of this.childNodes) {
        if (child.bbox.pwidth) {
          this.bbox.pwidth = BBox.fullWidth;
          break;
        }
      }
    }

    /**
     * Handle vertical stretching of children to match height of
     *  other nodes in the row.
     */
    public stretchChildren() {
      let stretchy: AnyWrapper[] = [];
      //
      //  Locate and count the stretchy children
      //
      for (const child of this.childNodes) {
        if (child.canStretch(DIRECTION.Vertical)) {
          stretchy.push(child);
        }
      }
      let count = stretchy.length;
      let nodeCount = this.childNodes.length;
      if (count && nodeCount > 1) {
        let H = 0, D = 0;
        //
        //  If all the children are stretchy, find the largest one,
        //  otherwise, find the height and depth of the non-stretchy
        //  children.
        //
        let all = (count > 1 && count === nodeCount);
        for (const child of this.childNodes) {
          const noStretch = (child.stretch.dir === DIRECTION.None);
          if (all || noStretch) {
            let {h, d, rscale} = child.getOuterBBox(noStretch);
            h *= rscale;
            d *= rscale;
            if (h > H) H = h;
            if (d > D) D = d;
          }
        }
        //
        //  Stretch the stretchable children
        //
        for (const child of stretchy) {
          (child.coreMO() as CommonMo).getStretchedVariant([H, D]);
        }
      }
    }

  };
}

/*****************************************************************/
/*****************************************************************/
/**
 * The CommonInferredMrow interface
 */
export interface CommonInferredMrow extends CommonMrow {
}

/**
 * Shorthand for the CommonInferredMrow constructor
 */
export type InferredMrowConstructor = Constructor<CommonInferredMrow>;

/*****************************************************************/
/**
 * The CommonInferredMrow wrapper mixin for the MmlInferredMrow object
 *
 * @template T  The Wrapper class constructor type
 */
export function CommonInferredMrowMixin<T extends MrowConstructor>(Base: T): InferredMrowConstructor & T {

  return class extends Base {

    /**
     * Since inferred rows don't produce a container span, we can't
     * set a font-size for it, so we inherit the parent scale
     *
     * @override
     */
    public getScale() {
      this.bbox.scale = this.parent.bbox.scale;
      this.bbox.rscale = 1;
    }
  };

}
