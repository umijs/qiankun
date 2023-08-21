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
 * @fileoverview  Implements asynchronous loading of files
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {mathjax} from '../mathjax.js';

/**
 * Load a file asynchronously using the mathjax.asynchLoad method, if there is one
 *
 * @param {string} name  The name of the file to load
 * @return {Promise}     The promise that is satisfied when the file is loaded
 */
export function asyncLoad(name: string): Promise<void> {
  if (!mathjax.asyncLoad) {
    return Promise.reject(`Can't load '${name}': No asyncLoad method specified`);
  }
  return new Promise((ok, fail) => {
    const result = mathjax.asyncLoad(name);
    if (result instanceof Promise) {
      result.then((value: any) => ok(value)).catch((err: Error) => fail(err));
    } else {
      ok(result);
    }
  });
}
