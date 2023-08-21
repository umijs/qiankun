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
 * @fileoverview  Implements the CommonMtd wrapper mixin for the MmlMtd object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AnyWrapper, WrapperConstructor, Constructor} from '../Wrapper.js';
import {CommonMtable} from '../../common/Wrappers/mtable.js';
import {CommonMtr} from '../../common/Wrappers/mtr.js';

/*****************************************************************/
/**
 * The CommonMtd interface
 */
export interface CommonMtd extends AnyWrapper {
}

/**
 * Shorthand for the CommonMtd constructor
 */
export type MtdConstructor = Constructor<CommonMtd>;

/*****************************************************************/
/**
 *  The CommonMtd wrapper mixin for the MmlMtd object
 *
 * @template T  The Wrapper class constructor type
 */
export function CommonMtdMixin<T extends WrapperConstructor>(Base: T): MtdConstructor & T {

  return class extends Base {

    /**
     * @override
     */
    get fixesPWidth() {
      return false;
    }

    /**
     * @override
     */
    public invalidateBBox() {
      this.bboxComputed = false;
    }

    /**
     * @override
     */
    public getWrapWidth(_j: number) {
      const table = this.parent.parent as any as CommonMtable<AnyWrapper, CommonMtr<AnyWrapper>>;
      const row = this.parent as CommonMtr<AnyWrapper>;
      const i = this.node.childPosition() - (row.labeled ? 1 : 0);
      return (typeof(table.cWidths[i]) === 'number' ? table.cWidths[i] : table.getTableData().W[i]) as number;
    }

    /**
     * @override
     */
    public getChildAlign(_i: number) {
      return this.node.attributes.get('columnalign') as string;
    }

  };

}
