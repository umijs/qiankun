/*************************************************************
 *
 *  Copyright (c) 2009-2022 The MathJax Consortium
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
 * @fileoverview Node utility methods.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {TextNode, MMLNODE, MmlNode, AbstractMmlNode, AbstractMmlEmptyNode} from '../../core/MmlTree/MmlNode.js';
import {MmlMo} from '../../core/MmlTree/MmlNodes/mo.js';
import {Property, PropertyList} from '../../core/Tree/Node.js';
import {Args} from './Types.js';
import {OperatorDef} from '../../core/MmlTree/OperatorDictionary.js';


namespace NodeUtil {

  const attrs: Map<String, boolean> = new Map([
    ['autoOP', true],
    ['fnOP', true],
    ['movesupsub', true],
    ['subsupOK', true],
    ['texprimestyle', true],
    ['useHeight', true],
    ['variantForm', true],
    ['withDelims', true],
    ['mathaccent', true],
    ['open', true],
    ['close', true]
  ]);


  /**
   * Creates a single character from a unicode hex string.
   * @param {string} code The code.
   * @return {string} The newly created entity.
   */
  export function createEntity(code: string): string  {
    return String.fromCodePoint(parseInt(code, 16));
  }


  /**
   * Get the children of the a node.
   * @param {MmlNode} node The node.
   * @return {MMLNODE[]} Its children.
   */
  export function getChildren(node: MmlNode): MMLNODE[] {
    return (node.childNodes as MMLNODE[]);
  }


  /**
   * Get text content of a node.
   * @param {TextNode} node The node.
   * @return {string} Its text content.
   */
  export function getText(node: TextNode): string {
    return node.getText();
  }


  /**
   * Append children to a node.
   * @param {MmlNode} node The node.
   * @param {MMLNODE[]} children A list of new children.
   */
  export function appendChildren(node: MmlNode, children: MMLNODE[])  {
    for (let child of children) {
      node.appendChild(child);
    }
  }


  /**
   * Sets an attribute of a node.
   * @param {MmlNode} node The node.
   * @param {string} attribute An attribute.
   * @param {Args} value The attribute value.
   */
  export function setAttribute(node: MmlNode, attribute: string, value: Args) {
    node.attributes.set(attribute, value);
  }


  /**
   * Sets a property of a node.
   * @param {MmlNode} node The node.
   * @param {string} property The property.
   * @param {Args} value The property value.
   */
  export function setProperty(node: MmlNode, property: string, value: Args) {
    node.setProperty(property, value);
  }


  /**
   * Sets properties and attributes of a node.
   * @param {MmlNode} node The node.
   * @param {PropertyList} properties A list of property/attribute value pairs.
   */
  export function setProperties(node: MmlNode, properties: PropertyList) {
    for (const name of Object.keys(properties)) {
      let value = properties[name];
      if (name === 'texClass') {
        node.texClass = (value as number);
        node.setProperty(name, value);
      } else if (name === 'movablelimits') {
        node.setProperty('movablelimits', value);
        if (node.isKind('mo') || node.isKind('mstyle')) {
          node.attributes.set('movablelimits', value);
        }
      } else if (name === 'inferred') {
        // ignore
      } else if (attrs.has(name)) {
        node.setProperty(name, value);
      } else {
        node.attributes.set(name, value);
      }
    }
  }


  /**
   * Returns the property of a node.
   * @param {MmlNode} node The node.
   * @param {string} property A property name.
   * @return {Property} Value of the property.
   */
  export function getProperty(node: MmlNode, property: string): Property  {
    return node.getProperty(property);
  }


  /**
   * Returns the attribute of a node.
   * @param {MmlNode} node The node.
   * @param {string} attr A attribute name.
   * @return {Property} Value of the attribute.
   */
  export function getAttribute(node: MmlNode, attr: string): Property  {
    return node.attributes.get(attr);
  }


  /**
   * Removes a set of properties from a node.
   * @param {MmlNode} node The node.
   * @param {string[]} ...properties  A list of properties.
   */
  export function removeProperties(node: MmlNode, ...properties: string[]) {
    node.removeProperty(...properties);
  }


  /**
   * Returns a child node at a given position.
   * @param {MmlNode} node The node.
   * @param {number} position The position of the child.
   * @return {MMLNODE} The child node at position.
   */
  export function getChildAt(node: MmlNode, position: number): MMLNODE {
    return (node.childNodes[position] as MMLNODE);
  }


  /**
   * Set node child at position.
   * @param {MmlNode} node The node.
   * @param {number} position The position of the new child.
   * @param {MmlNode} child The new child.
   */
  export function setChild(node: MmlNode, position: number, child: MmlNode) {
    let children = node.childNodes;
    children[position] = child;
    if (child) {
      child.parent = node;
    }
  }


  /**
   * Copies children between nodes.
   * @param {MmlNode} oldNode The source node.
   * @param {MmlNode} newNode The target node.
   */
  export function copyChildren(oldNode: MmlNode, newNode: MmlNode) {
    let children = oldNode.childNodes as (TextNode | MmlNode)[];
    for (let i = 0; i < children.length; i++) {
      setChild(newNode, i, children[i]);
    }
  }


  /**
   * Copies attributes between nodes.
   * @param {MmlNode} oldNode The source node.
   * @param {MmlNode} newNode The target node.
   */
  export function copyAttributes(oldNode: MmlNode, newNode: MmlNode) {
    newNode.attributes = oldNode.attributes;
    setProperties(newNode, oldNode.getAllProperties());
  }


  /**
   * Checks if node is of a particular type.
   * @param {MmlNode} node The node.
   * @param {string} kind The type to check.
   * @return {boolean} True if node is of the given type.
   */
  export function isType(node: MmlNode, kind: string): boolean  {
    return node.isKind(kind);
  }


  /**
   * Checks if the node is embellished.
   * @param {MmlNode} node The node.
   * @return {boolean} True if node is embellished.
   */
  export function isEmbellished(node: MmlNode): boolean {
    return node.isEmbellished;
  }


  /**
   * Gets the texclass of a node.
   * @param {MmlNode} node The node.
   * @return {number} Its texclass.
   */
  export function getTexClass(node: MmlNode): number  {
    return node.texClass;
  }


  /**
   * Gets the mo element at the core of the node.
   * @param {MmlNode} node The node.
   * @return {MmlNode} The MO node at the core.
   */
  export function getCoreMO(node: MmlNode): MmlNode  {
    return node.coreMO();
  }


  /**
   * Checks if an object is a node.
   * @param {any} item The object.
   * @return {boolean} True if it is a node.
   */
  export function isNode(item: any): boolean  {
    return item instanceof AbstractMmlNode || item instanceof AbstractMmlEmptyNode;
  }


  /**
   * Checks if the node is an inferred mrow.
   * @param {MmlNode} node The node.
   * @return {boolean} True if the node is an inferred mrow.
   */
  export function isInferred(node: MmlNode): boolean {
    return node.isInferred;
  }


  /**
   * Gets the operator definition of a node.
   * @param {MmlNode} node The node.
   * @return {OperatorDef} If node is an MO returns the operator definition. O/w
   *    null.
   */
  export function getForm(node: MmlNode): OperatorDef {
    if (!isType(node, 'mo')) {
      return null;
    }
    let mo = node as MmlMo;
    let forms = mo.getForms();
    for (let form of forms) {
      let symbol = MmlMo.OPTABLE[form][mo.getText()];
      if (symbol) {
        return symbol;
      }
    }
    return null;
  }

}

export default NodeUtil;
