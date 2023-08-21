/*************************************************************
 *  Copyright (c) 2020-2022 MathJax Consortium
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
 * @fileoverview    Implementation of items for the mathtools package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */

import {MultlineItem} from '../ams/AmsItems.js';
import NodeUtil from '../NodeUtil.js';
import {TexConstant} from '../TexConstants.js';


/**
 * The StackItem for the multlined environment
 */
export class MultlinedItem extends MultlineItem {

  /**
   * @override
   */
  get kind() {
    return 'multlined';
  }


  /**
   * @override
   */
  public EndTable() {
    if (this.Size() || this.row.length) {
      this.EndEntry();
      this.EndRow();
    }
    if (this.table.length > 1) {
      const options = this.factory.configuration.options.mathtools;
      const gap = options.multlinegap;
      const firstskip = options['firstline-afterskip'] || gap;
      const lastskip = options['lastline-preskip'] || gap;
      const first = NodeUtil.getChildren(this.table[0])[0];
      if (NodeUtil.getAttribute(first, 'columnalign') !== TexConstant.Align.RIGHT) {
        first.appendChild(this.create('node', 'mspace', [], {width: firstskip}));
      }
      const last = NodeUtil.getChildren(this.table[this.table.length - 1])[0];
      if (NodeUtil.getAttribute(last, 'columnalign') !== TexConstant.Align.LEFT) {
        const top = NodeUtil.getChildren(last)[0];
        top.childNodes.unshift(null);
        const space = this.create('node', 'mspace', [], {width: lastskip});
        NodeUtil.setChild(top, 0, space);
      }
    }
    super.EndTable.call(this);
  }

}
