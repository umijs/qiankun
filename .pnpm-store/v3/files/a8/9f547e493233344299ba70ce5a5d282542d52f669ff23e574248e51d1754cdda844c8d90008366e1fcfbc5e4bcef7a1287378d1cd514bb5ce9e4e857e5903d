/*************************************************************
 *
 *  Copyright (c) 2020-2022 The MathJax Consortium
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
 * @fileoverview  MathItem, MathDocument, and Handler for the safe extension
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {MathItem} from '../../core/MathItem.js';
import {MathDocument, MathDocumentConstructor} from '../../core/MathDocument.js';
import {Handler} from '../../core/Handler.js';

import {Safe} from './safe.js';

/*==========================================================================*/

/**
 * Generic constructor for Mixins
 */
export type Constructor<T> = new(...args: any[]) => T;

/*==========================================================================*/

/**
 * The properties needed in the MathDocument for sanitizing the internal MathML
 */
export interface SafeMathDocument<N, T, D> extends MathDocument<N, T, D> {

  /**
   * The Safe object for this document
   */
  safe: Safe<N, T, D>;

}


/**
 * The mixin for adding safe render action to MathDocuments
 *
 * @param {B} BaseDocument             The MathDocument class to be extended
 * @return {SafeMathDocument<N,T,D>}   The extended MathDocument class
 */
export function SafeMathDocumentMixin<N, T, D, B extends MathDocumentConstructor<MathDocument<N, T, D>>>(
  BaseDocument: B
): Constructor<SafeMathDocument<N, T, D>> & B {

  return class extends BaseDocument {

    /**
     * @override
     */
    public static OPTIONS = {
      ...BaseDocument.OPTIONS,
      safeOptions: {
        ...Safe.OPTIONS,
      },
      SafeClass: Safe
    };

    /**
     * An instance of the Safe object
     */
    public safe: Safe<N, T, D>;

    /**
     * Extend the MathItem class used for this MathDocument
     *
     * @override
     * @constructor
     */
    constructor(...args: any[]) {
      super(...args);
      this.safe = new this.options.SafeClass(this, this.options.safeOptions);
      const ProcessBits = (this.constructor as typeof BaseDocument).ProcessBits;
      if (!ProcessBits.has('safe')) {
        ProcessBits.allocate('safe');
      }
      for (const jax of this.inputJax) {
        if (jax.name.match(/MathML/)) {
          (jax as any).mathml.filterAttribute = this.safe.mmlAttribute.bind(this.safe);
          (jax as any).mathml.filterClassList = this.safe.mmlClassList.bind(this.safe);
        } else if (jax.name.match(/TeX/)) {
          jax.postFilters.add(this.sanitize.bind(jax), -5.5);
        }
      }
    }

    /**
     * @param {{document:SafeDocument<N,T,D>}} data   The document to use for the filter
     *                                                (note: this has been bound to the input jax)
     */
    protected sanitize(data: {math: MathItem<N, T, D>, document: SafeMathDocument<N, T, D>}) {
      data.math.root = (this as any).parseOptions.root;
      data.document.safe.sanitize(data.math, data.document);
    }
  };

}


/*==========================================================================*/

/**
 * Add context-menu support to a Handler instance
 *
 * @param {Handler} handler   The Handler instance to enhance
 * @return {Handler}          The handler that was modified (for purposes of chaining extensions)
 */
export function SafeHandler<N, T, D>(handler: Handler<N, T, D>): Handler<N, T, D> {
  handler.documentClass = SafeMathDocumentMixin(handler.documentClass);
  return handler;
}
