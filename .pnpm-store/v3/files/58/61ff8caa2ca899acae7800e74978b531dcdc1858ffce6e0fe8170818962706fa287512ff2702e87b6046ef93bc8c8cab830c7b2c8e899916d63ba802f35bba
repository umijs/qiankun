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
 * @fileoverview  The generic NodeFactory class for creating Node objects
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {Node, PropertyList} from './Node.js';
import {Factory, FactoryNodeClass, AbstractFactory} from './Factory.js';

/*****************************************************************/
/**
 * The NodeFactory interface
 *
 * @template N  The node type created by the factory
 * @template C  The class of the node being constructed (for access to static properties)
 */
export interface NodeFactory<N extends Node, C extends FactoryNodeClass<N>> extends Factory<N, C> {
  /**
   * @param {string} kind  The kind of node to create
   * @param {PropertyList} properties  The list of initial properties for the node (if any)
   * @param {N[]} children  The array of initial child nodes (if any)
   * @return {N}  The newly created node of the given kind
   */
  create(kind: string, properties?: PropertyList, children?: N[]): N;
}

/*****************************************************************/
/**
 * The generic NodeFactory class
 *
 * @template N  The node type created by the factory
 * @template C  The class of the node being constructed (for access to static properties)
 */
export abstract class AbstractNodeFactory<N extends Node, C extends FactoryNodeClass<N>> extends AbstractFactory<N, C> {
  /**
   * @override
   */
  public create(kind: string, properties: PropertyList = {}, children: N[] = []) {
    return this.node[kind](properties, children);
  }

}
