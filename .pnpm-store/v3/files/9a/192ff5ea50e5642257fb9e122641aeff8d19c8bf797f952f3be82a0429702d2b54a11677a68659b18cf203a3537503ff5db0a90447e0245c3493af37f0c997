/*************************************************************
 *
 *  Copyright (c) 2021-2022 The MathJax Consortium
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
 * @fileoverview  Keeps track of usage of font characters and wrappers
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

/**
 * Class used for tracking usage of font characters or wrappers
 */
export class Usage<T> {

  /**
   * The used items.
   */
  protected used: Set<string> = new Set<string>();

  /**
   * The items marked as used since last update.
   */
  protected needsUpdate: T[] = [];

  /**
   * @param {T} item   The item that has been used
   */
  public add(item: T) {
    const name = JSON.stringify(item);
    if (!this.used.has(name)) {
      this.needsUpdate.push(item);
    }
    this.used.add(name);
  }

  /**
   * @param {T} item     The item to check for being used
   * @return {boolean}   True if the item has been used
   */
  public has(item: T): boolean {
    return this.used.has(JSON.stringify(item));
  }

  /**
   * Clear the usage information
   */
  public clear() {
    this.used.clear();
    this.needsUpdate = [];
  }

  /**
   * Get the items marked as used since the last update.
   */
  public update() {
    const update = this.needsUpdate;
    this.needsUpdate = [];
    return update;
  }

}

