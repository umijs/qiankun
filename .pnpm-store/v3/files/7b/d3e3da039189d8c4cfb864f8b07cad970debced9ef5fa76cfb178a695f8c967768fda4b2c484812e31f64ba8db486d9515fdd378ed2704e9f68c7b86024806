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
 * @fileoverview  The generic visitor class for node trees
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {Node, NodeClass, AbstractNode} from './Node.js';
import {NodeFactory} from './NodeFactory.js';

/**
 * The type for the functions associated with each node class
 */
export type VisitorFunction = (visitor: NodeFactory<Node, NodeClass>, node: Node, ...args: any[]) => any;

/*****************************************************************/
/**
 *  Implements the Visitor interface
 */

export interface Visitor {

  /**
   * Visit the tree rooted at the given node (passing along any needed parameters)
   *
   * @param {Node} tree   The node that is the root of the tree
   * @param {any[]} args  The arguments to pass to the visitNode functions
   * @return {any}        Whatever the visitNode function returns for the root tree node
   */
  visitTree(tree: Node, ...args: any[]): any;

  /**
   * Visit a node by calling the visitor function for the given type of node
   *  (passing along any needed parameters)
   *
   * @param {Node} node   The node to visit
   * @param {any[]} args  The arguments to pass to the visitor function for this node
   * @return {any}        Whatever the visitor function returns for this node
   */
  visitNode(node: Node, ...args: any[]): any;

  /**
   * The default visitor function for when no node-specific function is defined
   *
   * @param {Node} node   The node to visit
   * @param {any[]} args  The arguments to pass to the visitor function for this node
   * @return {any}        Whatever the visitor function returns for this node
   */
  visitDefault(node: Node, ...args: any[]): any;

  /**
   * Define a visitor function for a given node kind
   *
   * @param {string} kind  The node kind for which the handler is being defined
   * @param {VisitorFunction} handler  The function to call to handle nodes of this kind
   */
  setNodeHandler(kind: string, handler: VisitorFunction): void;

  /**
   * Remove the visitor function for a given node kind
   *
   * @param {string} kind  The node kind whose visitor function is to be removed
   */
  removeNodeHandler(kind: string): void;

  /**
   * The various visitor functions implemented by the subclasses, and any data they need
   */
  [property: string]: any;
}

/*****************************************************************/
/**
 *  Implements the generic Visitor object
 */

export abstract class AbstractVisitor implements Visitor {
  /**
   * Holds the mapping from node kinds to visitor funcitons
   */
  protected nodeHandlers: Map<string, VisitorFunction> = new Map();

  /**
   *  Visitor functions are named "visitKindNode" where "Kind" is replaced by
   *    the node kind; e.g., visitTextNode for kind = text.
   *
   *  @param {string} kind  The node kind whose method name is needed
   *  @return {string}  The name of the visitor method for the given node kind
   */
  protected static methodName(kind: string): string {
    return 'visit' + (kind.charAt(0).toUpperCase() + kind.substr(1)).replace(/[^a-z0-9_]/ig, '_') + 'Node';
  }

  /**
   * Create the node handler map by looking for methods with the correct names
   *   based on the node kinds available from the factory.
   *
   * @constructor
   * @param {NodeFactory} factory  The node factory for the kinds of nodes this visitor handles
   */
  constructor(factory: NodeFactory<Node, NodeClass>) {
    for (const kind of factory.getKinds()) {
      let method = (this as Visitor)[AbstractVisitor.methodName(kind)] as VisitorFunction;
      if (method) {
        this.nodeHandlers.set(kind, method);
      }
    }
  }

  /**
   * @override
   */
  public visitTree(tree: Node, ...args: any[]) {
    return this.visitNode(tree, ...args);
  }

  /**
   * @override
   */
  public visitNode(node: Node, ...args: any[]) {
    let handler = this.nodeHandlers.get(node.kind) || this.visitDefault;
    return handler.call(this, node, ...args);
  }

  /**
   * @override
   */
  public visitDefault(node: Node, ...args: any[]) {
    if (node instanceof AbstractNode) {
      for (const child of node.childNodes) {
        this.visitNode(child, ...args);
      }
    }
  }

  /**
   * @override
   */
  public setNodeHandler(kind: string, handler: VisitorFunction) {
    this.nodeHandlers.set(kind, handler);
  }

  /**
   * @override
   */
  public removeNodeHandler(kind: string) {
    this.nodeHandlers.delete(kind);
  }

}
