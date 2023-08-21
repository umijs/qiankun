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
 * @fileoverview  Implements the interface and abstract class for MathList objects
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {LinkedList} from '../util/LinkedList.js';
import {MathItem} from './MathItem.js';

/*****************************************************************/
/**
 *  The MathList interface (extends LinkedList<MathItem>)
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface MathList<N, T, D> extends LinkedList<MathItem<N, T, D>> {
  /**
   * Test if one math item is before the other in the document (a < b)
   *
   * @param {MathItem} a   The first MathItem
   * @param {MathItem} b   The second MathItem
   */
  isBefore(a: MathItem<N, T, D>, b: MathItem<N, T, D>): boolean;
}

/*****************************************************************/
/**
 *  The MathList abstract class (extends LinkedList<MathItem>)
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export abstract class AbstractMathList<N, T, D> extends
LinkedList<MathItem<N, T, D>> implements MathList<N, T, D> {

  /**
   * @override
   */
  public isBefore(a: MathItem<N, T, D>, b: MathItem<N, T, D>) {
    return (a.start.i < b.start.i || (a.start.i === b.start.i && a.start.n < b.start.n));
  }

}
