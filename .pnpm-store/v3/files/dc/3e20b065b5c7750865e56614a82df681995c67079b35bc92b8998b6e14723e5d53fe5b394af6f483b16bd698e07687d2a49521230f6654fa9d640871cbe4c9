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
 * @fileoverview  Implements the jdsom DOM adaptor
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {HTMLAdaptor} from './HTMLAdaptor.js';
import {NodeMixin, Constructor} from './NodeMixin.js';
import {OptionList} from '../util/Options.js';

/**
 * The constructor for an HTMLAdaptor
 */
export type HTMLAdaptorConstructor = Constructor<HTMLAdaptor<HTMLElement, Text, Document>>;

/**
 * The JsdomAdaptor class
 */
export class JsdomAdaptor extends NodeMixin<HTMLElement, Text, Document, HTMLAdaptorConstructor>(HTMLAdaptor) {}

/**
 * Function for creating an HTML adaptor using jsdom
 *
 * @param {any} JSDOM      The jsdom object to use for this adaptor
 * @return {HTMLAdaptor}   The newly created adaptor
 */
export function jsdomAdaptor(JSDOM: any, options: OptionList = null): JsdomAdaptor {
  return new JsdomAdaptor(new JSDOM().window, options);
}
