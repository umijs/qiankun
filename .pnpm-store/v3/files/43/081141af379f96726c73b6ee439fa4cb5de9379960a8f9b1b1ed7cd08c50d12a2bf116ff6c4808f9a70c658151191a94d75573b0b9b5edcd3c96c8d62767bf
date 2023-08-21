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
 * @fileoverview  Implement a generic LinkedList object.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

/*****************************************************************/
/**
 *  A symbol used to mark the special node used to indicate
 *  the start and end of the list.
 */
export const END = Symbol();

/**
 * Shorthand type for the functions used to sort the data items
 *
 * @template DataClass   The type of data stored in the list
 */
export type SortFn<DataClass> = (a: DataClass, b: DataClass) => boolean;

/*****************************************************************/
/**
 *  The ListItem interface (for a specific type of data item)
 *
 *  These are the items in the doubly-linked list.
 *
 * @template DataClass   The type of data stored in the list
 */

export class ListItem<DataClass> {
  /**
   * The data for the list item
   */
  public data: DataClass | symbol;

  /**
   * Pointers to the next item in the list
   */
  public next: ListItem<DataClass> = null;
  /**
   * Pointers to the previous item in the list
   */
  public prev: ListItem<DataClass> = null;

  /**
   * @param {any} data  The data to be stored in the list item
   * @constructor
   */
  constructor(data: any = null) {
    this.data = data;
  }
}

/*****************************************************************/
/**
 *  Implements the generic LinkedList class
 *
 * @template DataClass   The type of data stored in the list
 */

export class LinkedList<DataClass> {
  /**
   * The linked list
   */
  protected list: ListItem<DataClass>;

  /**
   *  This.list is a special ListItem whose next property
   *    points to the head of the list and whose prev
   *    property points to the tail.  This lets us relink
   *    the head and tail items in the same way as any other
   *    item in the list, without having to handle special
   *    cases.
   *
   * @param {DataClass[]} args  The data items that form the initial list
   * @constructor
   */
  constructor(...args: DataClass[]) {
    this.list = new ListItem<DataClass>(END);
    this.list.next = this.list.prev = this.list;
    this.push(...args);
  }

  /**
   *  Used for sorting and merging lists (Overridden by subclasses)
   *
   * @param {DataClass} a   The first item to compare
   * @param {DataClass} b   The second item to compare
   * @return {boolean}      True if a is before b, false otherwise
   */
  public isBefore(a: DataClass, b: DataClass): boolean {
    return a < b;
  }

  /**
   * Push items on the end of the list
   *
   * @param {DataClass[]} args   The list of data items to be pushed
   * @return {LinkedList}        The LinkedList object (for chaining)
   */
  public push(...args: DataClass[]): LinkedList<DataClass> {
    for (const data of args) {
      let item = new ListItem<DataClass>(data);
      item.next = this.list;
      item.prev = this.list.prev;
      this.list.prev = item;
      item.prev.next = item;
    }
    return this;
  }

  /**
   * Pop the end item off the list and return its data
   *
   * @return {DataClass}  The data from the last item in the list
   */
  public pop(): DataClass {
    let item = this.list.prev;
    if (item.data === END) {
      return null;
    }
    this.list.prev = item.prev;
    item.prev.next = this.list;
    item.next = item.prev = null;
    return item.data as DataClass;
  }

  /**
   * Push items at the head of the list
   *
   * @param {DataClass[]} args   The list of data items to inserted
   * @return {LinkedList}        The LinkedList object (for chaining)
   */
  public unshift(...args: DataClass[]): LinkedList<DataClass> {
    for (const data of args.slice(0).reverse()) {
      let item = new ListItem<DataClass>(data);
      item.next = this.list.next;
      item.prev = this.list;
      this.list.next = item;
      item.next.prev = item;
    }
    return this;
  }

  /**
   * Remove an item from the head of the list and return its data
   *
   * @return {DataClass}  The data from the first item in the list
   */
  public shift(): DataClass {
    let item = this.list.next;
    if (item.data === END) {
      return null;
    }
    this.list.next = item.next;
    item.next.prev = this.list;
    item.next = item.prev = null;
    return item.data as DataClass;
  }

  /**
   * Remove items from the list
   *
   * @param {DataClass[]} items   The items to remove
   */
  public remove(...items: DataClass[]) {
    const map = new Map<DataClass, boolean>();
    for (const item of items) {
      map.set(item, true);
    }
    let item = this.list.next;
    while (item.data !== END) {
      const next = item.next;
      if (map.has(item.data as DataClass)) {
        item.prev.next = item.next;
        item.next.prev = item.prev;
        item.next = item.prev = null;
      }
      item = next;
    }
  }

  /**
   * Empty the list
   *
   * @return {LinkedList}  The LinkedList object (for chaining)
   */
  public clear(): LinkedList<DataClass> {
    this.list.next.prev = this.list.prev.next = null;
    this.list.next = this.list.prev = this.list;
    return this;
  }

  /**
   * An iterator for the list in forward order
   *
   * @yield {DataClass} The next item in the iteration sequence
   */
  public *[Symbol.iterator](): IterableIterator<DataClass> {
    let current = this.list.next;

    while (current.data !== END) {
      yield current.data as DataClass;
      current = current.next;
    }
  }

  /**
   * An iterator for the list in reverse order
   *
   * @yield {DataClass} The previous item in the iteration sequence
   */
  public *reversed(): IterableIterator<DataClass> {
    let current = this.list.prev;

    while (current.data !== END) {
      yield current.data as DataClass;
      current = current.prev;
    }
  }

  /**
   * Insert a new item into a sorted list in the correct locations
   *
   * @param {DataClass} data   The data item to add
   * @param {SortFn} isBefore   The function used to order the data
   * @param {LinkedList}        The LinkedList object (for chaining)
   */
  public insert(data: DataClass, isBefore: SortFn<DataClass> = null) {
    if (isBefore === null) {
      isBefore = this.isBefore.bind(this);
    }
    let item = new ListItem<DataClass>(data);
    let cur = this.list.next;
    while (cur.data !== END && isBefore(cur.data as DataClass, item.data as DataClass)) {
      cur = cur.next;
    }
    item.prev = cur.prev;
    item.next = cur;
    cur.prev.next = cur.prev = item;
    return this;
  }

  /**
   * Sort the list using an optional sort function
   *
   * @param {SortFn} isBefore  The function used to order the data
   * @return {LinkedList}      The LinkedList object (for chaining)
   */
  public sort(isBefore: SortFn<DataClass> = null): LinkedList<DataClass> {
    if (isBefore === null) {
      isBefore = this.isBefore.bind(this);
    }
    //
    //  Make an array of singleton lists
    //
    let lists: LinkedList<DataClass>[] = [];
    for (const item of this) {
      lists.push(new LinkedList<DataClass>(item as DataClass));
    }
    //
    //  Clear current list
    //
    this.list.next = this.list.prev = this.list;
    //
    //  Merge pairs of lists until there is only one left
    //
    while (lists.length > 1) {
      let l1 = lists.shift();
      let l2 = lists.shift();
      l1.merge(l2, isBefore);
      lists.push(l1);
    }
    //
    //  Use the final list as our list
    //
    if (lists.length) {
      this.list = lists[0].list;
    }
    return this;
  }

  /**
   * Merge a sorted list with another sorted list
   *
   * @param {LinkedList} list  The list to merge into this instance's list
   * @param {SortFn} isBefore  The function used to order the data
   * @return {LinkedList}      The LinkedList instance (for chaining)
   */
  public merge(list: LinkedList<DataClass>, isBefore: SortFn<DataClass> = null): LinkedList<DataClass> {
    if (isBefore === null) {
      isBefore = this.isBefore.bind(this);
    }
    //
    //  Get the head of each list
    //
    let lcur = this.list.next;
    let mcur = list.list.next;
    //
    //  While there is more in both lists
    //
    while (lcur.data !== END && mcur.data !== END) {
      //
      //  If the merge item is before the list item
      //    (we have found where the head of the merge list belongs)
      //    Link the merge list into the main list at this point
      //      and make the merge list be the remainder of the original list.
      //    The merge continues by looking for where the rest of the original
      //      list fits into the newly formed main list (the old merge list).
      //  Otherwise
      //    Go on to the next item in the main list
      //
      if (isBefore(mcur.data as DataClass, lcur.data as DataClass)) {
        [mcur.prev.next, lcur.prev.next] = [lcur, mcur];
        [mcur.prev, lcur.prev] = [lcur.prev, mcur.prev];
        [this.list.prev.next, list.list.prev.next] = [list.list, this.list];
        [this.list.prev, list.list.prev] = [list.list.prev, this.list.prev];
        [lcur, mcur] = [mcur.next, lcur];
      } else {
        lcur = lcur.next;
      }
    }
    //
    //  If there is more to be merged (i.e., we came to the end of the main list),
    //  then link that at the end of the main list.
    //
    if (mcur.data !== END) {
      this.list.prev.next = list.list.next;
      list.list.next.prev = this.list.prev;
      list.list.prev.next = this.list;
      this.list.prev = list.list.prev;
      list.list.next = list.list.prev = list.list;
    }
    return this;
  }
}
