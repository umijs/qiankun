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
 * @fileoverview  A visitor class that visits MmlNode trees
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {TextNode, XMLNode} from './MmlNode.js';
import {MmlFactory} from './MmlFactory.js';
import {AbstractVisitor} from '../Tree/Visitor.js';

/*****************************************************************/
/**
 *  Implements the MmlVisitor (subclass of Visitor, and base class
 *  for visitors that accept MmlNode trees)
 */

export class MmlVisitor extends AbstractVisitor {
  /**
   * @param {MmlFactory} factory  The MmlNode factory (defaults to MmlFactory if not given)
   *
   * @constructor
   * @extends {AbstractVisitor}
   */
  constructor(factory: MmlFactory = null) {
    if (!factory) {
      factory = new MmlFactory();
    }
    super(factory);
  }

  /***********************************************/
  /**
   * Stubs for overriding in subclasses
   */

  /**
   * @param {TextNode} node  The TextNode to visit
   * @param {any[]} args  Any arguments needed by the visitor
   * @return {any}  Any return value needed for the visitor
   */
  public visitTextNode(_node: TextNode, ..._args: any[]): any {}

  /**
   * @param {XMLNode} node  The XMLNode to visit
   * @param {any[]} args  Any arguments needed by the visitor
   * @return {any}  Any return value needed for the visitor
   */
  public visitXMLNode(_node: XMLNode, ..._args: any[]): any {}

}
