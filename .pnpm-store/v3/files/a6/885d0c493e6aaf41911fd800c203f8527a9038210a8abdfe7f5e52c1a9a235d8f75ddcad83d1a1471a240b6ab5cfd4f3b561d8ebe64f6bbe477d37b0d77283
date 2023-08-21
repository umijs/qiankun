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
 * @fileoverview  Implements a list sorted by a numeric priority
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

/*****************************************************************/
/**
 *  The PrioritizedListItem<DataClass> interface
 *
 * @template DataClass   The class of data stored in the item
 */

export interface PrioritizedListItem<DataClass> {

  /**
   * The priority of this item
   */
  priority: number;

  /**
   * The data for the list item
   */
  item: DataClass;
}

/*****************************************************************/
/**
 *  Implements the PrioritizedList<DataClass> class
 *
 * @template DataClass   The class of data stored in the list
 */

export class PrioritizedList<DataClass> {

  /**
   * The default priority for items added to the list
   */
  public static DEFAULTPRIORITY: number = 5;

  /**
   * The list of items, sorted by priority (smallest number first)
   */
  protected items: PrioritizedListItem<DataClass>[] = [];

  /**
   * @constructor
   */
  constructor() {
    this.items = [];
  }

  /**
   * Make the list iterable, and return the data for the items in the list
   *
   * @return {{next: Function}}  The object containing the iterator's next() function
   */
  public [Symbol.iterator](): Iterator<PrioritizedListItem<DataClass>> {
    let i = 0;
    let items = this.items;
    return {
      /* tslint:disable-next-line:jsdoc-require */
      next(): IteratorResult<PrioritizedListItem<DataClass>> {
        return {value: items[i++], done: (i > items.length)};
      }
    };
  }

  /**
   * Add an item to the list
   *
   * @param {DataClass} item   The data for the item to be added
   * @param {number} priority  The priority for the item
   * @return {DataClass}       The data itself
   */
  public add(item: DataClass, priority: number = PrioritizedList.DEFAULTPRIORITY): DataClass {
    let i = this.items.length;
    do {
      i--;
    } while (i >= 0 && priority < this.items[i].priority);
    this.items.splice(i + 1, 0, {item: item, priority: priority});
    return item;
  }

  /**
   * Remove an item from the list
   *
   * @param {DataClass} item   The data for the item to be removed
   */
  public remove(item: DataClass) {
    let i = this.items.length;
    do {
      i--;
    } while (i >= 0 && this.items[i].item !== item);
    if (i >= 0) {
      this.items.splice(i, 1);
    }
  }
}
