/*************************************************************
 *
 *  Copyright (c) 2018-2022 The MathJax Consortium
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
 * @fileoverview  Implements a lightweight HTML Element replacement
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {OptionList} from '../../util/Options.js';
import {Styles} from '../../util/Styles.js';
import {LiteText} from './Text.js';

/**
 * Type for attribute lists
 */
export type LiteAttributeList = OptionList;

/**
 * Type for generic nodes in LiteAdaptor
 */
export type LiteNode = LiteElement | LiteText;


/************************************************************/
/**
 * Implements a lightweight HTML element replacement
 */
export class LiteElement {
  /**
   * The type of element (tag name)
   */
  public kind: string;

  /**
   * The element's attribute list
   */
  public attributes: LiteAttributeList;

  /**
   * The element's children
   */
  public children: LiteNode[];

  /**
   * The element's parent
   */
  public parent: LiteElement;

  /**
   * The styles for the element
   */
  public styles: Styles;

  /**
   * @param {string} kind  The type of node to create
   * @param {LiteAttributeList} attributes  The list of attributes to set (if any)
   * @param {LiteNode[]} children  The children for the node (if any)
   * @constructor
   */
  constructor(kind: string, attributes: LiteAttributeList = {}, children: LiteNode[] = []) {
    this.kind = kind;
    this.attributes = {...attributes};
    this.children = [...children];
    for (const child of this.children) {
      child.parent = this;
    }
    this.styles = null;
  }
}
