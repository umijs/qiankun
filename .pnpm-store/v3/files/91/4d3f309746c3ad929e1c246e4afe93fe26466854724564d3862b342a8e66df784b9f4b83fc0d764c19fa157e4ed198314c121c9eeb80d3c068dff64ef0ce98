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
 * @fileoverview  Implements the browser DOM adaptor
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {HTMLAdaptor} from './HTMLAdaptor.js';

//
//  Let Typescript know about these
//
declare global {
  interface Window {
    Document: typeof Document;
    DOMParser: typeof DOMParser;
    XMLSerializer: typeof XMLSerializer;
    HTMLElement: typeof HTMLElement;
    HTMLCollection: typeof HTMLCollection;
    NodeList: typeof NodeList;
    DocumentFragment: typeof DocumentFragment;
  }
}

/**
 * Function to create an HTML adpator for browsers
 *
 * @return {HTMLAdaptor}  The newly created adaptor
 */
export function browserAdaptor(): HTMLAdaptor<HTMLElement, Text, Document> {
  return new HTMLAdaptor<HTMLElement, Text, Document>(window);
}
