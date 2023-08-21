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
 * @fileoverview  Implements the MmlMfenced node
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {PropertyList} from '../../Tree/Node.js';
import {MmlNode, TextNode, AbstractMmlNode, AttributeList, TEXCLASS} from '../MmlNode.js';

/*****************************************************************/
/**
 *  Implements the MmlMfenced node class (subclass of AbstractMmlNode)
 */

export class MmlMfenced extends AbstractMmlNode {

  /**
   * @overeride
   */
  public static defaults: PropertyList = {
    ...AbstractMmlNode.defaults,
    open: '(',
    close: ')',
    separators: ','
  };

  /**
   * TeX class is INNER
   */
  protected texclass = TEXCLASS.INNER;

  /**
   * Storage for "fake" nodes for the separators
   */
  public separators: MmlNode[] = [];
  /**
   * Storage for "fake" open node
   */
  public open: MmlNode = null;
  /**
   * Storage for "fake" close node
   */
  public close: MmlNode = null;

  /**
   * @override
   */
  public get kind() {
    return 'mfenced';
  }

  /**
   * Include the fake nodes in the process, since they will be used
   *  to produce the output.
   *
   * @override
   */
  public setTeXclass(prev: MmlNode) {
    this.getPrevClass(prev);
    if (this.open) {
      prev = this.open.setTeXclass(prev);
    }
    if (this.childNodes[0]) {
      prev = this.childNodes[0].setTeXclass(prev);
    }
    for (let i = 1, m = this.childNodes.length; i < m; i++) {
      if (this.separators[i - 1]) {
        prev = this.separators[i - 1].setTeXclass(prev);
      }
      if (this.childNodes[i]) {
        prev = this.childNodes[i].setTeXclass(prev);
      }
    }
    if (this.close) {
      prev = this.close.setTeXclass(prev);
    }
    this.updateTeXclass(this.open);
    return prev;
  }

  /**
   * Create the fake nodes and do their inheritance
   * Then do inheridence of usual children
   *
   * @override
   */
  protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {
    this.addFakeNodes();
    for (const child of [this.open, this.close].concat(this.separators)) {
      if (child) {
        child.setInheritedAttributes(attributes, display, level, prime);
      }
    }
    super.setChildInheritedAttributes(attributes, display, level, prime);
  }

  /**
   * Create <mo> elements for the open and close delimiters, and for the separators (if any)
   */
  protected addFakeNodes() {
    let {open, close, separators} = this.attributes.getList('open', 'close', 'separators') as
    {open: string, close: string, separators: string};
    open = open.replace(/[ \t\n\r]/g, '');
    close = close.replace(/[ \t\n\r]/g, '');
    separators = separators.replace(/[ \t\n\r]/g, '');
    //
    // Create open node
    //
    if (open) {
      this.open = this.fakeNode(open, {fence: true, form: 'prefix'}, TEXCLASS.OPEN);
    }
    //
    // Create nodes for the separators
    //
    if (separators) {
      while (separators.length < this.childNodes.length - 1) {
        separators += separators.charAt(separators.length - 1);
      }
      let i = 0;
      for (const child of this.childNodes.slice(1)) {
        if (child) {
          this.separators.push(this.fakeNode(separators.charAt(i++)));
        }
      }
    }
    //
    //  Create close node
    //
    if (close) {
      this.close = this.fakeNode(close, {fence: true, form: 'postfix'}, TEXCLASS.CLOSE);
    }
  }

  /**
   * @param {string} c                 The character for the text of the node
   * @param {PropertyList} properties  The attributes for the node
   * @param {number} texClass          The TeX class for the node
   * @return {MmlNode}                 The generated <mo> node
   */
  protected fakeNode(c: string, properties: PropertyList = {}, texClass: number = null): MmlNode {
    let text = (this.factory.create('text') as TextNode).setText(c);
    let node = this.factory.create('mo', properties, [text]);
    node.texClass = texClass;
    node.parent = this;
    return node;
  }

}
