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
import {LiteDocument} from './Document.js';
import {LiteList} from './List.js';
import {LiteParser} from './Parser.js';

/************************************************************/
/**
 * Implements a lightweight Window replacement
 */
export class LiteWindow {
  /**
   * The window's document instance
   */
  public document: LiteDocument;
  /**
   * The DOMParser class
   */
  public DOMParser: typeof LiteParser = LiteParser;
  /**
   * The NodeList class
   */
  public NodeList: typeof LiteList = LiteList;
  /**
   * The HTMLCollection class
   */
  public HTMLCollection: typeof LiteList = LiteList;
  /**
   * The HTMLElement class
   */
  public HTMLElement: typeof LiteElement = LiteElement;
  /**
   * The DocumentFragment class
   */
  public DocumentFragment: typeof LiteList  = LiteList;
  /**
   * The Document class
   */
  public Document: typeof LiteDocument  = LiteDocument;

  /**
   * Create the LiteWindow and its LiteDocument
   */
  constructor() {
    this.document = new LiteDocument();
  }
}
