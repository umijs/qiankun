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
 * @fileoverview  A visitor that produces a serilaied MathML string
 *                that contains addition information about inherited
 *                attributes and internal properties.
 *                (For testing purposes only.)
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SerializedMmlVisitor} from './SerializedMmlVisitor.js';
import {MmlNode} from './MmlNode.js';
import {PropertyList} from '../Tree/Node.js';

/*****************************************************************/
/**
 *  Implements the TestMmlVisitor (subclass of SerializedMmlVisitor)
 */

export class TestMmlVisitor extends SerializedMmlVisitor {

  /**
   * The generic visiting function:
   *   Make the string versino of the open tag with it attributes (explicit and
   *     inherited) and properties
   *   Increate the indentation level
   *   Add the childnodes
   *   Add the end tag with proper spacing (empty tags have the close tag following directly)
   *
   * @param {MmlNode} node  The node to visit
   * @param {string} space    The number of spaces to use for indentation
   */
  public visitDefault(node: MmlNode, space: string) {
    let kind = node.kind;
    let [nl, endspace] = (node.isToken || node.childNodes.length === 0 ? ['', ''] : ['\n', space]);
    let mml = space + '<' + kind + this.getAttributes(node) +
      this.getInherited(node) + this.getProperties(node) + '\n' + space + '   ' +
      this.attributeString({
        isEmbellished: node.isEmbellished,
        isSpacelike: node.isSpacelike,
        texClass: node.texClass
      }, '{', '}') +
      '>' + nl;
    space += '  ';
    for (const child of node.childNodes) {
      mml += this.visitNode(child, space) + nl;
    }
    mml += endspace + '</' + kind + '>';
    return mml;
  }

  /**
   * @param {MmlNode} node  The node whose attributes are to be produced
   * @return {string}  The attribute list as a string
   */
  protected getAttributes(node: MmlNode): string {
    return this.attributeString(node.attributes.getAllAttributes(), '', '');
  }

  /**
   * @param {MmlNode} node  The node whose inherited attributes are to be produced
   * @return {string}  The inhertited attribute list as a string (with each in [...])
   */
  protected getInherited(node: MmlNode): string {
    return this.attributeString(node.attributes.getAllInherited(), '[', ']');
  }

  /**
   * @param {MmlNode} node  The node whose properties are to be produced
   * @return {string}  The property list as a string (with each in [[...]])
   */
  protected getProperties(node: MmlNode): string {
    return this.attributeString(node.getAllProperties(), '[[', ']]');
  }

  /**
   * @param {PropertyList} attributes  The attributes to be made into a list
   * @param {string} open  The opening delimiter to add before each attribute
   * @param {string} close  The closing delimiter to add after each attribute
   * @return {string}  The attribute list as a string
   */
  protected attributeString(attributes: PropertyList, open: string, close: string): string {
    let ATTR = '';
    for (const name of Object.keys(attributes)) {
      ATTR += ' ' + open + name + '="' + this.quoteHTML(String(attributes[name])) + '"' + close;
    }
    return ATTR;
  }

}
