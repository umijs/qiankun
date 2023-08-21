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
 * @fileoverview Configuration file for the Html package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Configuration} from '../Configuration.js';
import {CommandMap} from '../SymbolMap.js';
import HtmlMethods from './HtmlMethods.js';


new CommandMap('html_macros', {
  href:    'Href',
  'class': 'Class',
  style:   'Style',
  cssId:   'Id'
}, HtmlMethods);

export const HtmlConfiguration = Configuration.create(
  'html', {handler: { macro: ['html_macros']}}
);
