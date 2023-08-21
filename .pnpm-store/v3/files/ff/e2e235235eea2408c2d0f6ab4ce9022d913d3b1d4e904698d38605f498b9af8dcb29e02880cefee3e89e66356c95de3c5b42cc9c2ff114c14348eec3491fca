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
 * @fileoverview Configuration file for the NoErrors package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Configuration} from '../Configuration.js';
import {NodeFactory} from '../NodeFactory.js';

/**
 * Generates an error node containing the erroneous expression.
 * @param {TexParser} parser The node factory.
 * @param {string} message The error message (which is ignored).
 * @param {string} id The error id (which is ignored).
 * @param {string} expr The original LaTeX expression.
 */
function noErrors(factory: NodeFactory,
                  message: string, _id: string, expr: string) {
  let mtext = factory.create('token', 'mtext', {}, expr.replace(/\n/g, ' '));
  let error = factory.create('node', 'merror', [mtext], {'data-mjx-error': message, title: message});
  return error;
}

export const NoErrorsConfiguration = Configuration.create(
  'noerrors', {nodes: {'error': noErrors}}
);


