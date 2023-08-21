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
 * @fileoverview Items for TeX parsing of new environments.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */


import TexError from '../TexError.js';
import {CheckType, BaseItem, StackItem} from '../StackItem.js';


/**
 * Opening Item dealing with definitions of new environments. It's pushed onto
 * the stack whenever a user defined environment is encountered and remains
 * until a corresponding \\end collapses the stack.
 */
export class BeginEnvItem extends BaseItem {

  /**
   * @override
   */
  public get kind() {
    return 'beginEnv';
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
    if (item.isKind('end')) {
      // @test Newenvironment Empty, Newenvironment Align
      if (item.getName() !== this.getName()) {
        // @test (missing) \newenvironment{env}{aa}{bb}\begin{env}cc\end{equation}
        throw new TexError('EnvBadEnd', '\\begin{%1} ended with \\end{%2}',
                            this.getName(), item.getName());
      }
      return [[this.factory.create('mml', this.toMml())], true];
    }
    if (item.isKind('stop')) {
      // @test (missing) \newenvironment{env}{aa}{bb}\begin{env}cc
      throw new TexError('EnvMissingEnd', 'Missing \\end{%1}', this.getName());
    }
    // @test Newenvironment Empty, Newenvironment Align
    return super.checkItem(item);
  }

}
