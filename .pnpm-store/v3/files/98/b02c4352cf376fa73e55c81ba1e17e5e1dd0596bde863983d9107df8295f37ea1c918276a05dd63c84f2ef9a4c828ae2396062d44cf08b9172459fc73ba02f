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
 * @fileoverview  Implements the HTMLHandler class
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AbstractHandler} from '../../core/Handler.js';
import {MinHTMLAdaptor} from '../../adaptors/HTMLAdaptor.js';
import {HTMLDocument} from './HTMLDocument.js';
import {OptionList} from '../../util/Options.js';

/*****************************************************************/
/**
 *  Implements the HTMLHandler class (extends AbstractHandler)
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class HTMLHandler<N, T, D> extends AbstractHandler<N, T, D> {

  /**
   * The DOMAdaptor for the document being handled
   */
  public adaptor: MinHTMLAdaptor<N, T, D>;  // declare a more specific adaptor type

  /**
   * @override
   */
  public documentClass = HTMLDocument;

  /**
   * @override
   */
  public handlesDocument(document: any) {
    const adaptor = this.adaptor;
    if (typeof(document) === 'string') {
      try {
        document = adaptor.parse(document, 'text/html');
      } catch (err) {}
    }
    if (document instanceof adaptor.window.Document ||
        document instanceof adaptor.window.HTMLElement ||
        document instanceof adaptor.window.DocumentFragment) {
      return true;
    }
    return false;
  }

  /**
   * If the document isn't already a Document object, create one
   * using the given data
   *
   * @override
   */
  public create(document: any, options: OptionList) {
    const adaptor = this.adaptor;
    if (typeof(document) === 'string') {
      document = adaptor.parse(document, 'text/html');
    } else if (document instanceof adaptor.window.HTMLElement ||
               document instanceof adaptor.window.DocumentFragment) {
      let child = document as N;
      document = adaptor.parse('', 'text/html');
      adaptor.append(adaptor.body(document), child);
    }
    return super.create(document, options) as HTMLDocument<N, T, D>;
  }

}
