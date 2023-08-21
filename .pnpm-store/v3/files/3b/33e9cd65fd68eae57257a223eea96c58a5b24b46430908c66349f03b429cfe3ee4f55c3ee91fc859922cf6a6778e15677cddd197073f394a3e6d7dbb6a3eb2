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
 * @fileoverview Items for TeX parsing of bussproofs.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */


import TexError from '../TexError.js';
import {BaseItem, CheckType, StackItem} from '../StackItem.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import Stack from '../Stack.js';
import * as BussproofsUtil from './BussproofsUtil.js';


export class ProofTreeItem extends BaseItem {


  /**
   * The current left label.
   * @type {MmlNode[]}
   */
  public leftLabel: MmlNode[] = null;

  /**
   * The current right label.
   * @type {MmlNode[]}
   */
  public rigthLabel: MmlNode[] = null;

  private innerStack: Stack = new Stack(this.factory, {}, true);

  /**
   * @override
   */
  public get kind() {
    return 'proofTree';
  }


  /**
   * @override
   */
  public checkItem(item: StackItem): CheckType {
    if (item.isKind('end') && item.getName() === 'prooftree') {
      let node = this.toMml();
      BussproofsUtil.setProperty(node, 'proof', true);
      return [[this.factory.create('mml', node), item], true];
    }
    if (item.isKind('stop')) {
      throw new TexError('EnvMissingEnd', 'Missing \\end{%1}', this.getName());
    }
    this.innerStack.Push(item);
    return BaseItem.fail;
  }


  /**
   * @override
   */
  public toMml() {
    const tree = super.toMml();
    const start = this.innerStack.Top();
    if (start.isKind('start') && !start.Size()) {
      return tree;
    }
    this.innerStack.Push(this.factory.create('stop'));
    let prefix = this.innerStack.Top().toMml();
    return this.create('node', 'mrow', [prefix, tree], {});
  }
}
