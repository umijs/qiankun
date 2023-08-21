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
 * @fileoverview  The DOMAdaptor interface and abstract class
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {OptionList} from '../util/Options.js';

/**
 * The data for an attribute
 */
export type AttributeData = {
  name: string,
  value: string
};

/**
 * The data for an elements page-based bounding box
 */
export type PageBBox = {
  left: number,
  right: number,
  top: number,
  bottom: number
};


/*****************************************************************/
/**
 *  The interface for the DOMAdaptor
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface DOMAdaptor<N, T, D> {
  /**
   * Document in which the nodes are to be created
   */
  document: D;

  /**
   * @param {string} text    The serialized document to be parsed
   * @param {string} format  The format (e.g., 'text/html' or 'text/xhtml')
   * @return {D}             The parsed document
   */
  parse(text: string, format?: string): D;

  /**
   * @param {string} kind      The tag name of the HTML node to be created
   * @param {OptionList} def   The properties to set for the created node
   * @param {(N|T)[]} children The child nodes for the created HTML node
   * @param {string} ns        The namespace in which to create the node
   * @return {N}               The generated HTML tree
   */
  node(kind: string, def?: OptionList, children?: (N | T)[], ns?: string): N;

  /**
   * @param {string} text   The text from which to create an HTML text node
   * @return {T}            The generated text node with the given text
   */
  text(text: string): T;

  /**
   * @param {D} doc   The document whose head is to be obtained
   * @return {N}      The document.head element
   */
  head(doc: D): N;

  /**
   * @param {D} doc   The document whose body is to be obtained
   * @return {N}      The document.body element
   */
  body(doc: D): N;

  /**
   * @param {D} doc   The document whose documentElement is to be obtained
   * @return {N}      The documentElement
   */
  root(doc: D): N;

  /**
   * @param {D} doc     The document whose doctype is to be obtained
   * @return {string}   The DOCTYPE comment
   */
  doctype(doc: D): string;

  /**
   * @param {N} node        The node to search for tags
   * @param {string} name   The name of the tag to search for
   * @param {string} ns     The namespace to search in (or null for no namespace)
   * @return {N[]}          The list of tags found
   */
  tags(node: N, name: string, ns?: string): N[];

  /**
   * Get a list of containers (to be searched for math).  These can be
   *  specified by CSS selector, or as actual DOM elements or arrays of such.
   *
   * @param {(string | N | N[])[]} nodes  The array of items to make into a container list
   * @param {D} document                  The document in which to search
   * @return {N[]}                        The array of containers to search
   */
  getElements(nodes: (string | N | N[])[], document: D): N[];

  /**
   * Determine if a container node contains a given node somewhere in its DOM tree
   *
   * @param {N} container  The container to search
   * @param {N|T} node     The node to look for
   * @return {boolean}     True if the node is in the container's DOM tree
   */
  contains(container: N, node: N | T): boolean;

  /**
   * @param {N|T} node  The HTML node whose parent is to be obtained
   * @return {N}        The parent node of the given one
   */
  parent(node: N | T): N;

  /**
   * @param {N} node     The HTML node to be appended to
   * @param {N|T} child  The node or text to be appended
   * @return {N|T}       The appended node
   */
  append(node: N, child: N | T): N | T;

  /**
   * @param {N|T} nchild  The node or text to be inserted
   * @param {N|T} ochild  The node or text where the new child is to be added before it
   */
  insert(nchild: N | T, ochild: N | T): void;

  /**
   * @param {N|T} child  The node or text to be removed from its parent
   * @return {N|T}       The removed node
   */
  remove(child: N | T): N | T;

  /**
   * @param {N|T} nnode  The node to replace with
   * @param {N|T} onode  The child to be replaced
   * @return {N|T}       The removed node
   */
  replace(nnode: N | T, onode: N | T): N | T;

  /**
   * @param {N} node   The HTML node to be cloned
   * @return {N}       The copied node
   */
  clone(node: N): N;

  /**
   * @param {T} node    The HTML text node to be split
   * @param {number} n  The index of the character where the split will occur
   */
  split(node: T, n: number): T;

  /**
   * @param {N|T} node   The HTML node whose sibling is to be obtained
   * @return {N|T}       The node following the given one (or null)
   */
  next(node: N | T): N | T;

  /**
   * @param {N|T} node   The HTML node whose sibling is to be obtained
   * @return {N|T}       The node preceding the given one (or null)
   */
  previous(node: N | T): N | T;

  /**
   * @param {N} node   The HTML node whose child is to be obtained
   * @return {N|T}     The first child of the given node (or null)
   */
  firstChild(node: N): N | T;

  /**
   * @param {N} node   The HTML node whose child is to be obtained
   * @return {N}       The last child of the given node (or null)
   */
  lastChild(node: N): N | T;

  /**
   * @param {N} node    The HTML node whose children are to be obtained
   * @return {(N|T)[]}  Array of children for the given node (not a live list)
   */
  childNodes(node: N): (N | T)[];

  /**
   * @param {N} node    The HTML node whose child is to be obtained
   * @param {number} i  The index of the child to return
   * @return {N|T}      The i-th child node of the given node (or null)
   */
  childNode(node: N, i: number): N | T;

  /**
   * @param {N | T} node   The HTML node whose tag or node name is to be obtained
   * @return {string}      The tag or node name of the given node
   */
  kind(node: N | T): string;

  /**
   * @param {N|T} node  The HTML node whose value is to be obtained
   * @return {string}   The value of the given node
   */
  value(node: N | T): string;

  /**
   * @param {N} node    The HTML node whose text content is to be obtained
   * @return {string}   The text content of the given node
   */
  textContent(node: N): string;

  /**
   * @param {N} node   The HTML node whose inner HTML string is to be obtained
   * @return {string}  The serialized content of the node
   */
  innerHTML(node: N): string;

  /**
   * @param {N} node   The HTML node whose outer HTML string is to be obtained
   * @return {string}  The serialized node and its content
   */
  outerHTML(node: N): string;

  /**
   * @param {N} node   The HTML node whose serialized string is to be obtained
   * @return {string}  The serialized node and its content
   */
  serializeXML(node: N): string;

  /**
   * @param {N} node               The HTML node whose attribute is to be set
   * @param {string|number} name   The name of the attribute to set
   * @param {string} value         The new value of the attribute
   * @param {string=} ns           The namespace to use for the attribute
   */
  setAttribute(node: N, name: string, value: string | number, ns?: string): void;

  /**
   * @param {N} node           The HTML element whose attributes are to be set
   * @param {OptionList} def   The attributes to set on that node
   */
  setAttributes(node: N, def: OptionList): void;

  /**
   * @param {N} node        The HTML node whose attribute is to be obtained
   * @param {string} name   The name of the attribute to get
   * @return {string}       The value of the given attribute of the given node
   */
  getAttribute(node: N, name: string): string;

  /**
   * @param {N} node        The HTML node whose attribute is to be removed
   * @param {string} name   The name of the attribute to remove
   */
  removeAttribute(node: N, name: string): void;

  /**
   * @param {N} node        The HTML node whose attribute is to be tested
   * @param {string} name   The name of the attribute to test
   * @return {boolean}      True of the node has the given attribute defined
   */
  hasAttribute(node: N, name: string): boolean;

  /**
   * @param {N} node           The HTML node whose attributes are to be returned
   * @return {AttributeData[]} The list of attributes
   */
  allAttributes(node: N): AttributeData[];

  /**
   * @param {N} node        The HTML node whose class is to be augmented
   * @param {string} name   The class to be added
   */
  addClass(node: N, name: string): void;

  /**
   * @param {N} node        The HTML node whose class is to be changed
   * @param {string} name   The class to be removed
   */
  removeClass(node: N, name: string): void;

  /**
   * @param {N} node        The HTML node whose class is to be tested
   * @param {string} name   The class to test
   * @return {boolean}      True if the node has the given class
   */
  hasClass(node: N, name: string): boolean;

  /**
   * @param {N} node        The HTML node whose class list is needed
   * @return {string[]}     An array of the class names for this node
   */
  allClasses(node: N): string[];

  /**
   * @param {N} node        The HTML node whose style is to be changed
   * @param {string} name   The style to be set
   * @param {string} value  The new value of the style
   */
  setStyle(node: N, name: string, value: string): void;

  /**
   * @param {N} node        The HTML node whose style is to be obtained
   * @param {string} name   The style to be obtained
   * @return {string}       The value of the style
   */
  getStyle(node: N, name: string): string;

  /**
   * @param {N} node        The HTML node whose styles are to be returned
   * @return {string}       The cssText for the styles
   */
  allStyles(node: N): string;

  /**
   * @param {N} node           The stylesheet node where the rule will be added
   * @param {string[]} rules   The rule to add at the beginning of the stylesheet
   */
  insertRules(node: N, rules: string[]): void;

  /**
   * @param {N} node        The HTML node whose font size is to be determined
   * @return {number}       The font size (in pixels) of the node
   */
  fontSize(node: N): number;

  /**
   * @param {N} node        The HTML node whose font family is to be determined
   * @return {string}       The font family
   */
  fontFamily(node: N): string;

  /**
   * @param {N} node            The HTML node whose dimensions are to be determined
   * @param {number} em         The number of pixels in an em
   * @param {boolean} local     True if local coordinates are to be used in SVG elements
   * @return {[number, number]} The width and height (in ems) of the element
   */
  nodeSize(node: N, em?: number, local?: boolean): [number, number];


  /**
   * @param {N} node            The HTML node whose BBox is to be determined
   * @return {PageBBox}         BBox as {left, right, top, bottom} position on the page (in pixels)
   */
  nodeBBox(node: N): PageBBox;
}

/*****************************************************************/
/**
 *  Abstract DOMAdaptor class for creating HTML elements
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export abstract class AbstractDOMAdaptor<N, T, D> implements DOMAdaptor<N, T, D> {

  /**
   * The document in which the HTML nodes will be created
   */
  public document: D;

  /**
   * @param {D} document  The document in which the nodes will be created
   * @constructor
   */
  constructor(document: D = null) {
    this.document = document;
  }

  /**
   * @override
   */
  public abstract parse(text: string, format?: string): D;

  /**
   * @override
   */
  public node(kind: string, def: OptionList = {}, children: (N | T)[] = [], ns?: string) {
    const node = this.create(kind, ns);
    this.setAttributes(node, def);
    for (const child of children) {
      this.append(node, child);
    }
    return node as N;
  }

  /**
   * @param {string} kind  The type of the node to create
   * @param {string} ns    The optional namespace in which to create the node
   * @return {N}           The created node
   */
  protected abstract create(kind: string, ns?: string): N;

  /**
   * @override
   */
  public abstract text(text: string): T;

  /**
   * @param {N} node           The HTML element whose attributes are to be set
   * @param {OptionList} def   The attributes to set on that node
   */
  public setAttributes(node: N, def: OptionList) {
    if (def.style && typeof(def.style) !== 'string') {
      for (let key of Object.keys(def.style)) {
        this.setStyle(node, key.replace(/-([a-z])/g, (_m, c) => c.toUpperCase()), def.style[key]);
      }
    }
    if (def.properties) {
      for (let key of Object.keys(def.properties)) {
        (node as OptionList)[key] = def.properties[key];
      }
    }
    for (let key of Object.keys(def)) {
      if ((key !== 'style' || typeof(def.style) === 'string') && key !== 'properties') {
        this.setAttribute(node, key, def[key]);
      }
    }
  }

  /**
   * @override
   */
  public abstract head(doc: D): N;

  /**
   * @override
   */
  public abstract body(doc: D): N;

  /**
   * @override
   */
  public abstract root(doc: D): N;

  /**
   * @override
   */
  public abstract doctype(doc: D): string;

  /**
   * @override
   */
  public abstract tags(node: N, name: string, ns?: string): N[];

  /**
   * @override
   */
  public abstract getElements(nodes: (string | N | N[])[], document: D): N[];

  /**
   * @override
   */
  public abstract contains(container: N, node: N | T): boolean;

  /**
   * @override
   */
  public abstract parent(node: N | T): N;

  /**
   * @override
   */
  public abstract append(node: N, child: N | T): N | T;

  /**
   * @override
   */
  public abstract insert(nchild: N | T, ochild: N | T): void;

  /**
   * @override
   */
  public abstract remove(child: N | T): N | T;

  /**
   * @override
   */
  public replace(nnode: N | T, onode: N | T) {
    this.insert(nnode, onode);
    this.remove(onode);
    return onode;
  }

  /**
   * @override
   */
  public abstract clone(node: N):  N;

  /**
   * @override
   */
  public abstract split(node: T, n: number): T;

  /**
   * @override
   */
  public abstract next(node: N | T): N | T;

  /**
   * @override
   */
  public abstract previous(node: N | T): N | T;

  /**
   * @override
   */
  public abstract firstChild(node: N): N | T;

  /**
   * @override
   */
  public abstract lastChild(node: N): N | T;

  /**
   * @override
   */
  public abstract childNodes(node: N): (N | T)[];

  /**
   * @override
   */
  public childNode(node: N, i: number) {
    return this.childNodes(node)[i];
  }

  /**
   * @override
   */
  public abstract kind(node: N | T): string;

  /**
   * @override
   */
  public abstract value(node: N | T): string;

  /**
   * @override
   */
  public abstract textContent(node: N): string;

  /**
   * @override
   */
  public abstract innerHTML(node: N): string;

  /**
   * @override
   */
  public abstract outerHTML(node: N): string;

  /**
   * @override
   */
  public abstract serializeXML(node: N): string;

  /**
   * @override
   */
  public abstract setAttribute(node: N, name: string, value: string, ns?: string): void;

  /**
   * @override
   */
  public abstract getAttribute(node: N, name: string): string;

  /**
   * @override
   */
  public abstract removeAttribute(node: N, name: string): void;

  /**
   * @override
   */
  public abstract hasAttribute(node: N, name: string): boolean;


  /**
   * @override
   */
  public abstract allAttributes(node: N): AttributeData[];

  /**
   * @override
   */
  public abstract addClass(node: N, name: string): void;

  /**
   * @override
   */
  public abstract removeClass(node: N, name: string): void;

  /**
   * @override
   */
  public abstract hasClass(node: N, name: string): boolean;

  /**
   * @override
   */
  public allClasses(node: N) {
    const classes = this.getAttribute(node, 'class');
    return (!classes ? [] as string[] :
            classes.replace(/  +/g, ' ').replace(/^ /, '').replace(/ $/, '').split(/ /));
  }

  /**
   * @override
   */
  public abstract setStyle(node: N, name: string, value: string): void;

  /**
   * @override
   */
  public abstract getStyle(node: N, name: string): string;

  /**
   * @override
   */
  public abstract allStyles(node: N): string;

  /**
   * @override
   */
  public abstract insertRules(node: N, rules: string[]): void;

  /**
   * @override
   */
  public abstract fontSize(node: N): number;

  /**
   * @override
   */
  public abstract fontFamily(node: N): string;

  /**
   * @override
   */
  public abstract nodeSize(node: N, em?: number, local?: boolean): [number, number];

  /**
   * @override
   */
  public abstract nodeBBox(node: N): PageBBox;

}
