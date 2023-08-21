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
 * @fileoverview A factory for stack items. This allows particular items to be
 *     overwritten later.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {StackItemClass, StackItem, BaseItem} from './StackItem.js';
import ParseOptions from './ParseOptions.js';
import {AbstractFactory} from '../../core/Tree/Factory.js';


class DummyItem extends BaseItem {}

/**
 * The StackItemFactory is initially populated with the default stack item
 * classes. They can be changed, deleted or added to, if and when necessary.
 *
 * @constructor
 * @extends {AbstractFactory}
 */
export default class StackItemFactory extends AbstractFactory<StackItem, StackItemClass> {

  /**
   * @override
   */
  public static DefaultStackItems: {[kind: string]: StackItemClass} = {
    [DummyItem.prototype.kind]: DummyItem
  };


  /**
   * @override
   */
  public defaultKind = 'dummy';


  /**
   * The parser configuration.
   * @type {ParseOptions}
   */
  public configuration: ParseOptions = null;

}
