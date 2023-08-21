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
 * @fileoverview A visitor to convert the new to the old internal format.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {MmlVisitor} from './MmlVisitor.js';
import {MmlNode, TextNode, XMLNode} from './MmlNode.js';

/**
 *  Get access to legacy MML Element Jax
 */
declare var MathJax: any;
let MML = MathJax.ElementJax.mml;

/*****************************************************************/
/**
 *  Implements the LegacyMmlVisitor (subclass of MmlVisitor)
 */

export class LegacyMmlVisitor extends MmlVisitor {

  /**
   * Convert the tree rooted at a particular node into the old-style
   * internal format used by MathJax v2.
   *
   * @param {MmlNode} node  The node to use as the root of the tree to traverse
   * @return {any}  The old-style internal format equivalent of the tree
   */
  public visitTree(node: MmlNode): any {
    let root = MML.mrow();
    this.visitNode(node, root);
    root = root.data[0];
    root.parent = null;
    return root;
  }

  /**
   * @param {TextNode} node  The text node to visit
   * @param {any} parent  The old-style parent to which this node should be added
   */
  public visitTextNode(node: TextNode, parent: any) {
    parent.Append(MML.chars(node.getText()));
  }

  /**
   * @param {XMLNode} node  The XML node to visit
   * @param {any} parent  The old-style parent to which this node should be added
   */
  public visitXMLNode(node: XMLNode, parent: any) {
    parent.Append(MML.xml(node.getXML()));
  }

  /**
   * Visit an inferred mrow, but don't add the inferred row itself (the old-style
   * nodes will add one automatically).
   *
   * @param {MmlNode} node  The inferred mrow to visit
   * @param {any} parent  The old-style parent to which this node's children should be added
   */
  public visitInferredMrowNode(node: MmlNode, parent: any) {
    for (const child of node.childNodes) {
      this.visitNode(child, parent);
    }
  }

  /**
   * The generic visiting function:
   *   Create a node of the correct type.
   *   Add its explicit attributes.
   *   Add its non-attribute properties.
   *   Append its children nodes.
   *   Append the new node to the old-style parent.
   *
   * @param {MmlNode} node  The node to visit
   * @param {any} parent  The old-style parent to which this node should be added
   */
  public visitDefault(node: MmlNode, parent: any) {
    let mml = MML[node.kind]();
    this.addAttributes(node, mml);
    this.addProperties(node, mml);
    for (const child of node.childNodes) {
      this.visitNode(child, mml);
    }
    parent.Append(mml);
  }

  /**
   * @param {MmlNode} node  The node who attributes are to be copied
   * @param {any} mml  The old-style node to which attributes are being added
   */
  public addAttributes(node: MmlNode, mml: any) {
    let attributes = node.attributes;
    let names = attributes.getExplicitNames();
    for (const name of names) {
      mml[name] = attributes.getExplicit(name);
    }
  }

  /**
   * @param {MmlNode} node  The node whose properties are to be copied
   * @param {any} mml  The old-stype node to which the properties are being copied
   */
  public addProperties(node: MmlNode, mml: any) {
    let names = node.getPropertyNames();
    for (const name of names) {
      mml[name] = node.getProperty(name);
    }
  }

}
