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
 * @fileoverview  Registers the HTML document type
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {mathjax} from '../mathjax.js';
import {HTMLHandler} from './html/HTMLHandler.js';
import {DOMAdaptor} from '../core/DOMAdaptor.js';

/**
 * Create the HTML handler object and register it with MathJax.
 *
 * @param {DOMAdaptor<N,T,D>} adaptor  The DOM adaptor to use with HTML
 * @return {HTMLHandler}               The newly created handler
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export function RegisterHTMLHandler<N, T, D>(adaptor: DOMAdaptor<N, T, D>): HTMLHandler<N, T, D> {
  const handler = new HTMLHandler<N, T, D>(adaptor);
  mathjax.handlers.register(handler);
  return handler;
}
