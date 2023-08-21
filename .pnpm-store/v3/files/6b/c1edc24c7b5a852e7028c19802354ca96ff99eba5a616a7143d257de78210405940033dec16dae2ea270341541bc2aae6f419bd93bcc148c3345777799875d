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
 * @fileoverview Generic Node classes for node trees
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {NodeFactory} from './NodeFactory.js';

/**
 *  PropertyList and Property are for string data like
 *  attributes and other properties
 */
export type Property = string | number | boolean;
export type PropertyList = {[key: string]: Property};

/*********************************************************/
/**
 *  The generic Node interface
 */

export interface Node {
  readonly kind: string;
  /**
   * The NodeFactory to use to create additional nodes, as needed
   */
  readonly factory: NodeFactory<Node, NodeClass>;
  parent: Node;
  childNodes: Node[];

  /**
   * @param {string} name     The name of the property to set
   * @param {Property} value  The value to which the property will be set
   */
  setProperty(name: string, value: Property): void;

  /**
   * @param {string} name  The name of the property to get
   * @return {Property}   The value of the named property
   */
  getProperty(name: string): Property;

  /**
   * @return {string[]}  An array of the names of every property currently defined
   */
  getPropertyNames(): string[];

  /**
   * @return {PropertyList}  The propery list containing all the properties of the node
   */
  getAllProperties(): PropertyList;

  /**
   * @param {string[]} names  The names of the properties to be removed
   */
  removeProperty(...names: string[]): void;


  /**
   * @param {string} kind  The type of node to test for
   * @return {boolean}     True when the node is of the given type
   */
  isKind(kind: string): boolean;

  /**
   * @param {Node[]} children  The child nodes to add to this node
   */
  setChildren(children: Node[]): void;

  /**
   * @param {Node} child  A node to add to this node's children
   * @return {Node}       The child node that was added
   */
  appendChild(child: Node): Node;

  /**
   * @param {Node} newChild  A child node to be inserted
   * @param {Node} oldChild  A child node to be replaced
   * @return {Node}          The old child node that was removed
   */
  replaceChild(newChild: Node, oldChild: Node): Node;

  /**
   * @param {Node} child   Child node to be removed
   * @return {Node}        The old child node that was removed
   */
  removeChild(child: Node): Node;

  /**
   * @param {Node} child  A child node whose index in childNodes is desired
   * @return {number}     The index of the child in childNodes, or null if not found
   */
  childIndex(child: Node): number;

  /**
   * Make a deep copy of the node (but with no parent).
   */
  copy(): Node;

  /**
   * @param {string} kind  The kind of nodes to be located in the tree
   * @return {Node[]}      An array of nodes that are children (at any depth) of the given kind
   */
  findNodes(kind: string): Node[];

  /**
   * @param {Function} func  A function to apply to each node in the tree rooted at this node
   * @param {any} data       Data to pass to the function (as state information)
   */
  walkTree(func: (node: Node, data?: any) => void, data?: any): void;
}

/*********************************************************/
/**
 *  The generic Node class interface
 */

export interface NodeClass {
  /**
   * @param {NodeFactory} factory  The NodeFactory to use to create new nodes when needed
   * @param {PropertyList} properties  Any properties to be added to the node, if any
   * @param {Node[]} children  The initial child nodes, if any
   * @return {Node}  The newly created node
   */
  new (factory: NodeFactory<Node, NodeClass>, properties?: PropertyList, children?: Node[]): Node;
}

/*********************************************************/
/**
 *  The abstract Node class
 */

export abstract class AbstractNode implements Node {

  /**
   * The parent node for this one
   */
  public parent: Node = null;

  /**
   * The properties for this node
   */
  protected properties: PropertyList = {};

  /**
   * The children for this node
   */
  public childNodes: Node[] = [];

  /**
   * @param {NodeFactory} factory  The NodeFactory to use to create new nodes when needed
   * @param {PropertyList} properties  Any properties to be added to the node, if any
   * @param {Node[]} children  The initial child nodes, if any
   *
   * @constructor
   * @implements {Node}
   */
  constructor(readonly factory: NodeFactory<Node, NodeClass>, properties: PropertyList = {}, children: Node[] = []) {
    for (const name of Object.keys(properties)) {
      this.setProperty(name, properties[name]);
    }
    if (children.length) {
      this.setChildren(children);
    }
  }

  /**
   * @override
   */
  public get kind() {
    return 'unknown';
  }

  /**
   * @override
   */
  public setProperty(name: string, value: Property) {
    this.properties[name] = value;
  }

  /**
   * @override
   */
  public getProperty(name: string) {
    return this.properties[name];
  }

  /**
   * @override
   */
  public getPropertyNames() {
    return Object.keys(this.properties);
  }

  /**
   * @override
   */
  public getAllProperties() {
    return this.properties;
  }

  /**
   * @override
   */
  public removeProperty(...names: string[]) {
    for (const name of names) {
      delete this.properties[name];
    }
  }


  /**
   * @override
   */
  public isKind(kind: string): boolean {
    return this.factory.nodeIsKind(this, kind);
  }


  /**
   * @override
   */
  public setChildren(children: Node[]) {
    this.childNodes = [];
    for (let child of children) {
      this.appendChild(child);
    }
  }

  /**
   * @override
   */
  public appendChild(child: Node) {
    this.childNodes.push(child);
    child.parent = this;
    return child;
  }

  /**
   * @override
   */
  public replaceChild(newChild: Node, oldChild: Node) {
    let i = this.childIndex(oldChild);
    // If i === null should we error?  return null?  silently fail?
    if (i !== null) {
      this.childNodes[i] = newChild;
      newChild.parent = this;
      oldChild.parent = null;
    }
    return newChild;
  }

  /**
   * @override
   */
  public removeChild(child: Node) {
    const i = this.childIndex(child);
    if (i !== null) {
      this.childNodes.splice(i, 1);
      child.parent = null;
    }
    return child;
  }


  /**
   * @override
   */
  public childIndex(node: Node) {
    let i = this.childNodes.indexOf(node);
    return (i === -1 ? null : i);
  }


  /**
   * @override
   */
  public copy() {
    const node = (this as AbstractNode).factory.create(this.kind) as AbstractNode;
    node.properties = {...this.properties};
    for (const child of this.childNodes || []) {
      if (child) {
        node.appendChild(child.copy());
      }
    }
    return node;
  }

  /**
   * @override
   */
  public findNodes(kind: string) {
    let nodes: Node[] = [];
    this.walkTree((node: Node) => {
      if (node.isKind(kind)) {
        nodes.push(node);
      }
    });
    return nodes;
  }


  /**
   * @override
   */
  public walkTree(func: (node: Node, data?: any) => void, data?: any) {
    func(this, data);
    for (const child of this.childNodes) {
      if (child) {
        child.walkTree(func, data);
      }
    }
    return data;
  }

  /**
   * Simple string version for debugging, just to get the structure.
   */
  public toString() {
    return this.kind + '(' + this.childNodes.join(',') + ')';
  }

}

/*********************************************************/
/**
 *  The abstract EmptyNode class
 */

export abstract class AbstractEmptyNode extends AbstractNode {
  /**
   *  We don't have children, so ignore these methods
   */

  /**
   * @override
   */
  public setChildren(_children: Node[]) {
  }

  /**
   * @override
   */
  public appendChild(child: Node) {
    return child;
  }

  /**
   * @override
   */
  public replaceChild(_newChild: Node, oldChild: Node) {
    return oldChild;
  }

  /**
   * @override
   */
  public childIndex(_node: Node) {
    return null as number;
  }

  /**
   * Don't step into children (there aren't any)
   *
   * @override
   */
  public walkTree(func: (node: Node, data?: any) => void, data?: any) {
    func(this, data);
    return data;
  }

  /**
   * Simple string version for debugging, just to get the structure.
   */
  public toString() {
    return this.kind;
  }

}
