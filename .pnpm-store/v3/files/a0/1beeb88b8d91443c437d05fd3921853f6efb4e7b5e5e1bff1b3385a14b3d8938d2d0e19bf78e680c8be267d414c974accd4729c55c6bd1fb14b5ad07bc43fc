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
 * @fileoverview  Implements the interface and abstract class for HandlerList objects
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {PrioritizedList} from '../util/PrioritizedList.js';
import {OptionList} from '../util/Options.js';
import {Handler} from './Handler.js';
import {MathDocument} from './MathDocument.js';

/*****************************************************************/
/**
 *  The HandlerList class (extends PrioritizedList of Handlers)
 *
 *  This list is used to find the handler for a given document
 *  by asking each handler to test if it can handle the document,
 *  and when one can, it is asked to create its associated MathDocument.
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class HandlerList<N, T, D> extends PrioritizedList<Handler<N, T, D>>  {

  /**
   * @param {Handler} handler  The handler to register
   * @return {Handler}  The list item created for the handler
   */
  public register(handler: Handler<N, T, D>): Handler<N, T, D> {
    return this.add(handler, handler.priority);
  }

  /**
   * @param {Handler} Handler  The handler to remove from the list
   */
  public unregister(handler: Handler<N, T, D>) {
    this.remove(handler);
  }

  /**
   * @param {any} document  The document (string, window, DOM element, etc) to be handled
   * @return {Handler}      The handler from the list that can process the given document
   */
  public handlesDocument(document: any): Handler<N, T, D> {
    for (const item of this) {
      let handler = item.item;
      if (handler.handlesDocument(document)) {
        return handler;
      }
    }
    throw new Error(`Can't find handler for document`);
  }

  /**
   * @param {any} document        The document to be processed
   * @param {OptionList} options  The options for the handler
   * @return {MathDocument}       The MathDocument created by the handler for this document
   */
  public document(document: any, options: OptionList = null): MathDocument<N, T, D> {
    return this.handlesDocument(document).create(document, options);
  }

}
