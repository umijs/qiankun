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
 * @fileoverview Generic WrapperFactory class for creating Wrapper objects
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {Node} from './Node.js';
import {Wrapper, WrapperClass} from './Wrapper.js';
import {Factory, AbstractFactory} from './Factory.js';

/*****************************************************************/
/**
 * The generic WrapperFactory class
 *
 * @template N  The Node type being created by the factory
 * @template W  The Wrapper type being produced (instance type)
 * @template C  The Wrapper class (for static values)
 */
export interface WrapperFactory<N extends Node, W extends Wrapper<N, W>, C extends WrapperClass<N, W>>
extends Factory<W, C> {
  /**
   * @param {N} node  The node to be wrapped
   * @param {any[]} args  Any additional arguments needed when wrapping the node
   * @return {W}  The newly wrapped node
   */
  wrap(node: N, ...args: any[]): W;
}

/*****************************************************************/
/**
 * The generic WrapperFactory class
 *
 * @template N  The Node type being created by the factory
 * @template W  The Wrapper type being produced (instance type)
 * @template C  The Wrapper class (for static values)
 */
export abstract class AbstractWrapperFactory<N extends Node, W extends Wrapper<N, W>, C extends WrapperClass<N, W>>
extends AbstractFactory<W, C> implements WrapperFactory<N, W, C> {
  /**
   * @param {N} node  The node to be wrapped
   * @param {any[]} args  Any additional arguments needed when wrapping the node
   * @return {W}  The newly wrapped node
   */
  public wrap(node: N, ...args: any[]): W {
    return this.create(node.kind, node, ...args);
  }
}
