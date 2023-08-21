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
 * @fileoverview  Implements a lightweight DOM adaptor
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AbstractDOMAdaptor} from '../core/DOMAdaptor.js';
import {NodeMixin, Constructor} from './NodeMixin.js';
import {LiteDocument} from './lite/Document.js';
import {LiteElement, LiteNode} from './lite/Element.js';
import {LiteText, LiteComment} from './lite/Text.js';
import {LiteList} from './lite/List.js';
import {LiteWindow} from './lite/Window.js';
import {LiteParser} from './lite/Parser.js';
import {Styles} from '../util/Styles.js';
import {OptionList} from '../util/Options.js';

/************************************************************/


/**
 * Implements a lightweight DOMAdaptor on liteweight HTML elements
 */
export class LiteBase extends AbstractDOMAdaptor<LiteElement, LiteText, LiteDocument> {
  /**
   * The document in which the HTML nodes will be created
   */
  public document: LiteDocument;

  /**
   * The window for the document
   */
  public window: LiteWindow;

  /**
   * The parser for serialized HTML
   */
  public parser: LiteParser;

  /**
   * @param {OptionList} options  The options for the lite adaptor (e.g., fontSize)
   * @constructor
   */
  constructor() {
    super();
    this.parser = new LiteParser();
    this.window = new LiteWindow();
  }

  /**
   * @override
   */
  public parse(text: string, format?: string): LiteDocument {
    return this.parser.parseFromString(text, format, this);
  }

  /**
   * @override
   */
  protected create(kind: string, _ns: string = null) {
    return new LiteElement(kind);
  }

  /**
   * @override
   */
  public text(text: string) {
    return new LiteText(text);
  }

  /**
   * @param {string} text   The text of the comment
   * @return {LiteComment}  The comment node
   */
  public comment(text: string): LiteComment {
    return new LiteComment(text);
  }

  /**
   * @return {LiteDocument}  A new document element
   */
  public createDocument(): LiteDocument {
    return new LiteDocument();
  }

  /**
   * @override
   */
  public head(doc: LiteDocument) {
    return doc.head;
  }

  /**
   * @override
   */
  public body(doc: LiteDocument) {
    return doc.body;
  }

  /**
   * @override
   */
  public root(doc: LiteDocument) {
    return doc.root;
  }

  /**
   * @override
   */
  public doctype(doc: LiteDocument) {
    return doc.type;
  }

  /**
   * @override
   */
  public tags(node: LiteElement, name: string, ns: string = null) {
    let stack = [] as LiteNode[];
    let tags = [] as LiteElement[];
    if (ns) {
      return tags;  // we don't have namespaces
    }
    let n: LiteNode = node;
    while (n) {
      let kind = n.kind;
      if (kind !== '#text' && kind !== '#comment') {
        n = n as LiteElement;
        if (kind === name) {
          tags.push(n);
        }
        if (n.children.length) {
          stack = n.children.concat(stack);
        }
      }
      n = stack.shift();
    }
    return tags;
  }

  /**
   * @param {LiteElement} node   The node to be searched
   * @param {string} id          The id of the node to look for
   * @return {LiteElement}       The child node having the given id
   */
  public elementById(node: LiteElement, id: string): LiteElement {
    let stack = [] as LiteNode[];
    let n = node as LiteNode;
    while (n) {
      if (n.kind !== '#text' && n.kind !== '#comment') {
        n = n as LiteElement;
        if (n.attributes['id'] === id) {
          return n;
        }
        if (n.children.length) {
          stack = n.children.concat(stack);
        }
      }
      n = stack.shift();
    }
    return null;
  }

  /**
   * @param {LiteElement} node   The node to be searched
   * @param {string} name        The name of the class to find
   * @return {LiteElement[]}     The nodes with the given class
   */
  public elementsByClass(node: LiteElement, name: string): LiteElement[] {
    let stack = [] as LiteNode[];
    let tags = [] as LiteElement[];
    let n: LiteNode = node;
    while (n) {
      if (n.kind !== '#text' && n.kind !== '#comment') {
        n = n as LiteElement;
        const classes = (n.attributes['class'] || '').trim().split(/ +/);
        if (classes.includes(name)) {
          tags.push(n);
        }
        if (n.children.length) {
          stack = n.children.concat(stack);
        }
      }
      n = stack.shift();
    }
    return tags;
  }

  /**
   * @override
   */
  public getElements(nodes: (string | LiteElement | LiteElement[])[], document: LiteDocument) {
    let containers = [] as LiteElement[];
    const body = this.body(document);
    for (const node of nodes) {
      if (typeof(node) === 'string') {
        if (node.charAt(0) === '#') {
          const n = this.elementById(body, node.slice(1));
          if (n) {
            containers.push(n);
          }
        } else if (node.charAt(0) === '.') {
          containers = containers.concat(this.elementsByClass(body, node.slice(1)));
        } else if (node.match(/^[-a-z][-a-z0-9]*$/i)) {
          containers = containers.concat(this.tags(body, node));
        }
      } else if (Array.isArray(node)) {
        containers = containers.concat(node);
      } else if (node instanceof this.window.NodeList || node instanceof this.window.HTMLCollection) {
        containers = containers.concat((node as LiteList<LiteElement>).nodes);
      } else {
        containers.push(node);
      }
    }
    return containers;
  }

  /**
   * @override
   */
  public contains(container: LiteNode, node: LiteNode | LiteText) {
    while (node && node !== container) {
      node = this.parent(node);
    }
    return !!node;
  }

  /**
   * @override
   */
  public parent(node: LiteNode) {
    return node.parent;
  }

  /**
   * @param {LiteNode} node  The node whose index is needed
   * @return {number}        The index of the node it its parent's children array
   */
  public childIndex(node: LiteNode): number {
    return (node.parent ? node.parent.children.findIndex(n => n === node) : -1);
  }

  /**
   * @override
   */
  public append(node: LiteElement, child: LiteNode) {
    if (child.parent) {
      this.remove(child);
    }
    node.children.push(child);
    child.parent = node;
    return child;
  }

  /**
   * @override
   */
  public insert(nchild: LiteNode, ochild: LiteNode) {
    if (nchild.parent) {
      this.remove(nchild);
    }
    if (ochild && ochild.parent) {
      const i = this.childIndex(ochild);
      ochild.parent.children.splice(i, 0, nchild);
      nchild.parent = ochild.parent;
    }
  }

  /**
   * @override
   */
  public remove(child: LiteNode) {
    const i = this.childIndex(child);
    if (i >= 0) {
      child.parent.children.splice(i, 1);
    }
    child.parent = null;
    return child;
  }

  /**
   * @override
   */
  public replace(nnode: LiteNode, onode: LiteNode) {
    const i = this.childIndex(onode);
    if (i >= 0) {
      onode.parent.children[i] = nnode;
      nnode.parent = onode.parent;
      onode.parent = null;
    }
    return onode;
  }

  /**
   * @override
   */
  public clone(node: LiteElement) {
    const nnode = new LiteElement(node.kind);
    nnode.attributes = {...node.attributes};
    nnode.children = node.children.map(n => {
      if (n.kind === '#text') {
        return new LiteText((n as LiteText).value);
      } else if (n.kind === '#comment') {
        return new LiteComment((n as LiteComment).value);
      } else {
        const m = this.clone(n as LiteElement);
        m.parent = nnode;
        return m;
      }
    });
    return nnode;
  }

  /**
   * @override
   */
  public split(node: LiteText, n: number) {
    const text = new LiteText(node.value.slice(n));
    node.value = node.value.slice(0, n);
    node.parent.children.splice(this.childIndex(node) + 1, 0, text);
    text.parent = node.parent;
    return text;
  }

  /**
   * @override
   */
  public next(node: LiteNode) {
    const parent = node.parent;
    if (!parent) return null;
    const i = this.childIndex(node) + 1;
    return (i >= 0 && i < parent.children.length ? parent.children[i] : null);
  }

  /**
   * @override
   */
  public previous(node: LiteNode) {
    const parent = node.parent;
    if (!parent) return null;
    const i = this.childIndex(node) - 1;
    return (i >= 0 ? parent.children[i] : null);
  }

  /**
   * @override
   */
  public firstChild(node: LiteElement) {
    return node.children[0];
  }

  /**
   * @override
   */
  public lastChild(node: LiteElement) {
    return node.children[node.children.length - 1];
  }

  /**
   * @override
   */
  public childNodes(node: LiteElement) {
    return [...node.children];
  }

  /**
   * @override
   */
  public childNode(node: LiteElement, i: number) {
    return node.children[i];
  }

  /**
   * @override
   */
  public kind(node: LiteNode) {
    return node.kind;
  }

  /**
   * @override
   */
  public value(node: LiteNode | LiteText) {
    return (node.kind === '#text' ? (node as LiteText).value :
            node.kind === '#comment' ? (node as LiteComment).value.replace(/^<!(--)?((?:.|\n)*)\1>$/, '$2') : '');
  }

  /**
   * @override
   */
  public textContent(node: LiteElement): string {
    return node.children.reduce((s: string, n: LiteNode) => {
      return s + (n.kind === '#text' ? (n as LiteText).value :
                  n.kind === '#comment' ? '' : this.textContent(n as LiteElement));
    }, '');
  }

  /**
   * @override
   */
  public innerHTML(node: LiteElement): string {
    return this.parser.serializeInner(this, node);
  }

  /**
   * @override
   */
  public outerHTML(node: LiteElement): string {
    return this.parser.serialize(this, node);
  }

  /**
   * @override
   */
  public serializeXML(node: LiteElement): string {
    return this.parser.serialize(this, node, true);
  }

  /**
   * @override
   */
  public setAttribute(node: LiteElement, name: string, value: string | number, ns: string = null) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    if (ns) {
      name = ns.replace(/.*\//, '') + ':' + name.replace(/^.*:/, '');
    }
    node.attributes[name] = value;
    if (name === 'style') {
      node.styles = null;
    }
  }

  /**
   * @override
   */
  public getAttribute(node: LiteElement, name: string) {
    return node.attributes[name];
  }

  /**
   * @override
   */
  public removeAttribute(node: LiteElement, name: string) {
    delete node.attributes[name];
  }

  /**
   * @override
   */
  public hasAttribute(node: LiteElement, name: string) {
    return node.attributes.hasOwnProperty(name);
  }

  /**
   * @override
   */
  public allAttributes(node: LiteElement) {
    const attributes = node.attributes;
    const list = [];
    for (const name of Object.keys(attributes)) {
      list.push({name: name, value: attributes[name] as string});
    }
    return list;
  }

  /**
   * @override
   */
  public addClass(node: LiteElement, name: string) {
    const classes = (node.attributes['class'] as string || '').split(/ /);
    if (!classes.find(n => n === name)) {
      classes.push(name);
      node.attributes['class'] = classes.join(' ');
    }
  }

  /**
   * @override
   */
  public removeClass(node: LiteElement, name: string) {
    const classes = (node.attributes['class'] as string || '').split(/ /);
    const i = classes.findIndex(n => n === name);
    if (i >= 0) {
      classes.splice(i, 1);
      node.attributes['class'] = classes.join(' ');
    }
  }

  /**
   * @override
   */
  public hasClass(node: LiteElement, name: string) {
    const classes = (node.attributes['class'] as string || '').split(/ /);
    return !!classes.find(n => n === name);
  }

  /**
   * @override
   */
  public setStyle(node: LiteElement, name: string, value: string) {
    if (!node.styles) {
      node.styles = new Styles(this.getAttribute(node, 'style'));
    }
    node.styles.set(name, value);
    node.attributes['style'] = node.styles.cssText;
  }

  /**
   * @override
   */
  public getStyle(node: LiteElement, name: string) {
    if (!node.styles) {
      const style = this.getAttribute(node, 'style');
      if (!style) {
        return '';
      }
      node.styles = new Styles(style);
    }
    return node.styles.get(name);
  }

  /**
   * @override
   */
  public allStyles(node: LiteElement) {
    return this.getAttribute(node, 'style');
  }

  /**
   * @override
   */
  public insertRules(node: LiteElement, rules: string[]) {
    node.children = [this.text(rules.join('\n\n') + '\n\n' + this.textContent(node))];
  }

  /*******************************************************************/
  /*
   *  The next four methods get overridden by the NodeMixin below
   */

  /**
   * @override
   */
  public fontSize(_node: LiteElement) {
    return 0;
  }

  /**
   * @override
   */
  public fontFamily(_node: LiteElement) {
    return '';
  }

  /**
   * @override
   */
  public nodeSize(_node: LiteElement, _em: number = 1, _local: boolean = null) {
    return [0, 0] as [number, number];
  }

  /**
   * @override
   */
  public nodeBBox(_node: LiteElement) {
    return {left: 0, right: 0, top: 0, bottom: 0};
  }

}

/**
 * The LiteAdaptor class (add in the NodeMixin methods and options)
 */
export class LiteAdaptor extends NodeMixin<LiteElement, LiteText, LiteDocument, Constructor<LiteBase>>(LiteBase) {}

/************************************************************/
/**
 * The function to call to obtain a LiteAdaptor
 *
 * @param {OptionList} options  The options for the adaptor
 * @return {LiteAdaptor}        The newly created adaptor
 */
export function liteAdaptor(options: OptionList = null): LiteAdaptor {
  return new LiteAdaptor(null, options);
}
