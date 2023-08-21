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
 * @fileoverview  Implements a lightweight DOM adaptor
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {LiteElement} from './Element.js';

/************************************************************/
/**
 * Implements a lightweight Document replacement
 */
export class LiteDocument {
  /**
   * The document's <html> element
   */
  public root: LiteElement;
  /**
   * The document's <head> element
   */
  public head: LiteElement;
  /**
   * The document's <body> element
   */
  public body: LiteElement;

  /**
   * the DOCTYPE comment
   */
  public type: string;

  /**
   * The kind is always #document
   */
  public get kind() {
    return '#document';
  }

  /**
   * @constructor
   */
  constructor() {
    this.root = new LiteElement('html', {}, [
      this.head = new LiteElement('head'),
      this.body = new LiteElement('body')
    ]);
    this.type = '';
  }
}
