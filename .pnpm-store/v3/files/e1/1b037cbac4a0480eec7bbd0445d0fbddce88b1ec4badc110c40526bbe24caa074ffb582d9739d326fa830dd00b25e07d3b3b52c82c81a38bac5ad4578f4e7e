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
 * @fileoverview  Implement FunctionList object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {PrioritizedList, PrioritizedListItem} from './PrioritizedList.js';

/*****************************************************************/
/**
 *  The FunctionListItem interface (extends PrioritizedListItem<Function>)
 */

export interface FunctionListItem extends PrioritizedListItem<Function> {}

/*****************************************************************/
/**
 *  Implements the FunctionList class (extends PrioritizedList<Function>)
 */

export class FunctionList extends PrioritizedList<Function> {

  /**
   * Executes the functions in the list (in prioritized order),
   *   passing the given data to the functions.  If any return
   *   false, the list is terminated.
   *
   * @param {any[]} data  The array of arguments to pass to the functions
   * @return {boolean}    False if any function stopped the list by
   *                       returning false, true otherwise
   */
  public execute(...data: any[]): boolean {
    for (const item of this) {
      let result = item.item(...data);
      if (result === false) {
        return false;
      }
    }
    return true;
  }

  /**
   * Executes the functions in the list (in prioritized order) asynchronously,
   *   passing the given data to the functions, and doing the next function
   *   only when the previous one completes.  If the function returns a
   *   Promise, then use that to control the flow.  Otherwise, if the
   *   function returns false, the list is terminated.
   * This function returns a Promise.  If any function in the list fails,
   *   the promise fails.  If any function returns false, the promise
   *   succeeds, but passes false as its argument.  Otherwise it succeeds
   *   and passes true.
   *
   * @param {any[]} data  The array of arguments to pass to the functions
   * @return {Promise}    The promise that is satisfied when the function
   *                       list completes (with argument true or false
   *                       depending on whether some function returned
   *                       false or not).
   */
  public asyncExecute(...data: any[]): Promise<void> {
    let i = -1;
    let items = this.items;
    return new Promise((ok: Function, fail: Function) => {
      (function execute() {
        while (++i < items.length) {
          let result = items[i].item(...data);
          if (result instanceof Promise) {
            result.then(execute).catch(err => fail(err));
            return;
          }
          if (result === false) {
            ok(false);
            return;
          }
        }
        ok(true);
      })();
    });
  }

}
