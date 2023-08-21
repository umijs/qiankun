/*************************************************************
 *
 *  Copyright (c) 2009-2022 The MathJax Consortium
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
 * @fileoverview Stack items for parsing the braket package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */


import {CheckType, BaseItem, StackItem} from '../StackItem.js';
import {TEXCLASS} from '../../../core/MmlTree/MmlNode.js';
import ParseUtil from '../ParseUtil.js';


/**
 * A bra-ket command. Collates elements from the opening brace to the closing
 * brace, adding bars to a given maximal number (e.g., only one in case of
 * set). To finalise it adds the surrounding angle brackets or braces.
 */
export class BraketItem extends BaseItem {

  /**
   * @override
   */
  get kind() {
    return 'braket';
  }

  /**
   * @override
   */
  get isOpen() {
    return true;
  }

  /**
   * @override
   */
  public checkItem(item: StackItem): CheckType {
    if (item.isKind('close')) {
      return [[this.factory.create('mml', this.toMml())], true];
    }
    if (item.isKind('mml')) {
      this.Push(item.toMml());
      if (this.getProperty('single')) {
        return [[this.toMml()], true];
      }
      return BaseItem.fail;
    }
    return super.checkItem(item);
  }


  /**
   * @override
   */
  public toMml() {
    let inner = super.toMml();
    let open = this.getProperty('open') as string;
    let close = this.getProperty('close') as string;
    if (this.getProperty('stretchy')) {
      return ParseUtil.fenced(this.factory.configuration, open, inner, close);
    }
    let attrs = {fence: true, stretchy: false, symmetric: true, texClass: TEXCLASS.OPEN};
    let openNode = this.create('token', 'mo', attrs, open);
    attrs.texClass = TEXCLASS.CLOSE;
    let closeNode = this.create('token', 'mo', attrs, close);
    let mrow = this.create('node', 'mrow', [openNode, inner, closeNode],
                         {open: open, close: close, texClass: TEXCLASS.INNER});
    return mrow;
  }

}
