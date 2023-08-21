/*************************************************************
 *
 *  Copyright (c) 2021-2022 The MathJax Consortium
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
 * @fileoverview  Auxiliary function for elementary MathML3 support (experimental)
 *                using David Carlisle's XLST transform.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {MathDocument} from '../../../core/MathDocument.js';

/**
 * Create the transform function that uses Saxon-js to perform the
 *   xslt transformation.
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 *
 * @return {(node: N, doc: MathDocument<N,T,D>) => N)}   The transformation function
 */
export function createTransform<N, T, D>(): (node: N, doc: MathDocument<N, T, D>) => N {
  /* tslint:disable-next-line:no-eval */
  const nodeRequire = eval('require');   // get the actual require from node.
  /* tslint:disable-next-line:no-eval */
  const dirname = eval('__dirname');     // get the actual __dirname
  try {
    nodeRequire.resolve('saxon-js');     // check if saxon-js is installed.
  } catch (err) {
    throw Error('Saxon-js not found.  Run the command:\n    npm install saxon-js\nand try again.');
  }
  const Saxon = nodeRequire('saxon-js'); // dynamically load Saxon-JS.
  const path = nodeRequire('path');      // use the real version from node.
  const fs = nodeRequire('fs');          // use the real version from node.
  const xsltFile = path.resolve(dirname, 'mml3.sef.json');  // load the preprocessed stylesheet.
  const xslt = JSON.parse(fs.readFileSync(xsltFile));       // and parse it.
  return (node: N, doc: MathDocument<N, T, D>) => {
    const adaptor = doc.adaptor;
    let mml = adaptor.outerHTML(node);
    //
    //  Make sure the namespace is present
    //
    if (!mml.match(/ xmlns[=:]/)) {
      mml = mml.replace(/<(?:(\w+)(:))?math/, '<$1$2math xmlns$2$1="http://www.w3.org/1998/Math/MathML"');
    }
    //
    //  Try to run the transform, and if it fails, return the original MathML
    //
    let result;
    try {
      result = adaptor.firstChild(adaptor.body(adaptor.parse(Saxon.transform({
        stylesheetInternal: xslt,
        sourceText: mml,
        destination: 'serialized'
      }).principalResult))) as N;
    } catch (err) {
      result = node;
    }
    return result;
  };
}
