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
 * @fileoverview  Implements the CHTMLmn wrapper for the MmlMn object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper, CHTMLConstructor} from '../Wrapper.js';
import {CommonMnMixin} from '../../common/Wrappers/mn.js';
import {MmlMn} from '../../../core/MmlTree/MmlNodes/mn.js';

/*****************************************************************/
/**
 * The CHTMLmn wrapper for the MmlMn object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
// @ts-ignore
export class CHTMLmn<N, T, D> extends
CommonMnMixin<CHTMLConstructor<any, any, any>>(CHTMLWrapper) {

  /**
   * The mn wrapper
   */
  public static kind = MmlMn.prototype.kind;

}
