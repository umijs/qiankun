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
 * @fileoverview  A visitor that produces a JSON version of an MmlNode tree
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {PropertyList} from '../Tree/Node.js';
import {MmlVisitor} from './MmlVisitor.js';
import {MmlNode, TextNode, XMLNode} from './MmlNode.js';

export type MmlNodeJSON = {
  kind: string,
  texClass: number
  isEmbellished?: boolean,
  isSpacelike?: boolean,
  isInferred?: boolean,
  childNodes: MmlJSON[],
  attributes: PropertyList,
  inherited: PropertyList,
  properties: PropertyList
};

export type MmlTextJSON = {
  kind: string,
  text: string
};

export type MmlXmlJSON = {
  kind: string,
  xml: any
};

export type MmlJSON = MmlNodeJSON | MmlTextJSON | MmlXmlJSON;

/*****************************************************************/
/**
 *  Implements the JsonMmlVisitor (subclass of MmlVisitor)
 */

export class JsonMmlVisitor extends MmlVisitor {
  /**
   * Convert the tree rooted at a particular node into a JSON structure
   *
   * @param {MmlNode} node  The node to use as the root of the tree to traverse
   * @return {MmlJSON}      The JSON object representing the internal tree
   */
  public visitTree(node: MmlNode): MmlJSON {
    return this.visitNode(node);
  }

  /**
   * @param {TextNode} node   The text node to visit
   * @return {MmlJSON}        The JSON for the text element
   */
  public visitTextNode(node: TextNode): MmlTextJSON {
    return {kind: node.kind, text: node.getText()};
  }

  /**
   * @param {XMLNode} node  The XML node to visit
   * @return {MmlJSON}      The JSON for the XML node
   */
  public visitXMLNode(node: XMLNode): MmlXmlJSON {
    return {kind: node.kind, xml: node.getXML()};
  }

  /**
   * The generic visiting function:
   *   Create a DOM node of the correct type.
   *   Add its explicit attributes.
   *   Append its children nodes.
   *   Append the new node to the DOM parent.
   *
   * @param {MmlNode} node  The node to visit
   * @return {MmlJSON}      The JSON object representing it
   */
  public visitDefault(node: MmlNode): MmlJSON {
    let json: MmlJSON = {
      kind: node.kind.replace(/inferredM/, 'm'),
      texClass: node.texClass,
      attributes: this.getAttributes(node),
      inherited: this.getInherited(node),
      properties: this.getProperties(node),
      childNodes: this.getChildren(node)
    };
    if (node.isInferred) {
      json.isInferred = true;
    }
    if (node.isEmbellished) {
      json.isEmbellished = true;
    }
    if (node.isSpacelike) {
      json.isSpacelike = true;
    }
    return json;
  }

  /**
   * @param {MmlNode} node    The node whose children are to be copied
   * @return {MmlJSON[]}      The array of child JSON objects
   */
  public getChildren(node: MmlNode): MmlJSON[] {
    let children = [];
    for (const child of node.childNodes) {
      children.push(this.visitNode(child));
    }
    return children;
  }

  /**
   * @param {MmlNode} node    The node whose attributes are to be copied
   * @return {PropertyList}   The object containing the attributes;
   */
  public getAttributes(node: MmlNode): PropertyList {
    return Object.assign({}, node.attributes.getAllAttributes());
  }

  /**
   * @param {MmlNode} node    The node whose inherited attributes are to be copied
   * @return {PropertyList}   The object containing the inherited attributes;
   */
  public getInherited(node: MmlNode): PropertyList {
    return Object.assign({}, node.attributes.getAllInherited());
  }

  /**
   * @param {MmlNode} node    The node whose properties are to be copied
   * @return {PropertyList}   The object containing the properties;
   */
  public getProperties(node: MmlNode): PropertyList {
    return Object.assign({}, node.getAllProperties());
  }

}
