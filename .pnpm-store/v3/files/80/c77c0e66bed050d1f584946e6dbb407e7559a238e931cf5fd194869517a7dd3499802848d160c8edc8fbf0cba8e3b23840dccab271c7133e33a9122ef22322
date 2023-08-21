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
 * @fileoverview  Implements the CHTMLWrapperFactory class
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTML} from '../chtml.js';
import {CommonWrapperFactory} from '../common/WrapperFactory.js';
import {CHTMLWrapper, CHTMLWrapperClass} from './Wrapper.js';
import {CHTMLWrappers} from './Wrappers.js';
import {CHTMLCharOptions, CHTMLDelimiterData, CHTMLFontData} from './FontData.js';

/*****************************************************************/
/**
 *  The CHTMLWrapperFactory class for creating CHTMLWrapper nodes
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLWrapperFactory<N, T, D> extends
CommonWrapperFactory<
  CHTML<N, T, D>,
  CHTMLWrapper<N, T, D>,
  CHTMLWrapperClass,
  CHTMLCharOptions,
  CHTMLDelimiterData,
  CHTMLFontData
> {

  /**
   * The default list of wrapper nodes this factory can create
   */
  public static defaultNodes = CHTMLWrappers;

  /**
   * The CHTML output jax associated with this factory
   */
  public jax: CHTML<N, T, D>;

}
