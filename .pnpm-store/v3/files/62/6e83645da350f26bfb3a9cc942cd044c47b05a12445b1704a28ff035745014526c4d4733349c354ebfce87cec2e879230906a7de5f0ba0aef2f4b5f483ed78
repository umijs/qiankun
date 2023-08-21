
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

import {AttributeData} from '../../core/DOMAdaptor.js';
import {MinDOMParser} from '../HTMLAdaptor.js';
import * as Entities from '../../util/Entities.js';
import {LiteDocument} from './Document.js';
import {LiteElement} from './Element.js';
import {LiteText, LiteComment} from './Text.js';
import {LiteAdaptor} from '../liteAdaptor.js';

/**
 * Patterns used in parsing serialized HTML
 */
export namespace PATTERNS {
  export const TAGNAME = '[a-z][^\\s\\n>]*';
  export const ATTNAME = '[a-z][^\\s\\n>=]*';
  export const VALUE =  `(?:'[^']*'|"[^"]*"|[^\\s\\n]+)`;
  export const VALUESPLIT =  `(?:'([^']*)'|"([^"]*)"|([^\\s\\n]+))`;
  export const SPACE = '(?:\\s|\\n)+';
  export const OPTIONALSPACE = '(?:\\s|\\n)*';
  export const ATTRIBUTE = ATTNAME + '(?:' + OPTIONALSPACE + '=' + OPTIONALSPACE + VALUE + ')?';
  export const ATTRIBUTESPLIT = '(' + ATTNAME + ')(?:' + OPTIONALSPACE + '=' + OPTIONALSPACE + VALUESPLIT + ')?';
  export const TAG = '(<(?:' + TAGNAME + '(?:' + SPACE + ATTRIBUTE + ')*'
                       + OPTIONALSPACE + '/?|/' + TAGNAME + '|!--[^]*?--|![^]*?)(?:>|$))';
  export const tag = new RegExp(TAG, 'i');
  export const attr = new RegExp(ATTRIBUTE, 'i');
  export const attrsplit = new RegExp(ATTRIBUTESPLIT, 'i');
}

/************************************************************/
/**
 * Implements a lightweight DOMParser replacement
 * (Not perfect, but handles most well-formed HTML)
 */
export class LiteParser implements MinDOMParser<LiteDocument> {

  /**
   * The list of self-closing tags
   */
  public static SELF_CLOSING: {[name: string]: boolean} = {
    area: true,
    base: true,
    br: true,
    col: true,
    command: true,
    embed: true,
    hr: true,
    img: true,
    input: true,
    keygen: true,
    link: true,
    menuitem: true,
    meta: true,
    param: true,
    source: true,
    track: true,
    wbr: true
  };

  /**
   * The list of tags chose content is not parsed (PCDATA)
   */
  public static PCDATA: {[name: string]: boolean} = {
    option: true,
    textarea: true,
    fieldset: true,
    title: true,
    style: true,
    script: true
  };

  /**
   * The list of attributes that don't get entity translation
   */
  public static CDATA_ATTR: {[name: string]: boolean} = {
    style: true,
    datafld: true,
    datasrc: true,
    href: true,
    src: true,
    longdesc: true,
    usemap: true,
    cite: true,
    datetime: true,
    action: true,
    axis: true,
    profile: true,
    content: true,
    scheme: true
  };

  /**
   * @override
   */
  public parseFromString(text: string, _format: string = 'text/html', adaptor: LiteAdaptor = null) {
    const root = adaptor.createDocument();
    let node = adaptor.body(root);
    //
    // Split the HTML into an array of text, tag, text, tag, ...
    // Then loop through them and add text nodes and process tags.
    //
    let parts = text.replace(/<\?.*?\?>/g, '').split(PATTERNS.tag);
    while (parts.length) {
      const text = parts.shift();
      const tag = parts.shift();
      if (text) {
        this.addText(adaptor, node, text);
      }
      if (tag && tag.charAt(tag.length - 1) === '>') {
        if (tag.charAt(1) === '!') {
          this.addComment(adaptor, node, tag);
        } else if (tag.charAt(1) === '/') {
          node = this.closeTag(adaptor, node, tag);
        } else {
          node = this.openTag(adaptor, node, tag, parts);
        }
      }
    }
    this.checkDocument(adaptor, root);
    return root;
  }

  /**
   * @param {LiteAdaptor} adaptor  The adaptor for managing nodes
   * @param {LiteElement} node     The node to add a text element to
   * @param {string} text          The text for the text node
   * @return {LiteText}            The text element
   */
  protected addText(adaptor: LiteAdaptor, node: LiteElement, text: string): LiteText {
    text = Entities.translate(text);
    return adaptor.append(node, adaptor.text(text)) as LiteText;
  }

  /**
   * @param {LiteAdaptor} adaptor  The adaptor for managing nodes
   * @param {LiteElement} node     The node to add a comment to
   * @param {string} comment       The text for the comment node
   * @return {LiteComment}         The comment element
   */
  protected addComment(adaptor: LiteAdaptor, node: LiteElement, comment: string): LiteComment {
    return adaptor.append(node, new LiteComment(comment)) as LiteComment;
  }

  /**
   * @param {LiteAdaptor} adaptor  The adaptor for managing nodes
   * @param {LiteElement} node     The node to close
   * @param {string} tag           The close tag being processed
   * @return {LiteElement}         The first unclosed parent node
   */
  protected closeTag(adaptor: LiteAdaptor, node: LiteElement, tag: string): LiteElement {
    const kind = tag.slice(2, tag.length - 1).toLowerCase();
    while (adaptor.parent(node) && adaptor.kind(node) !== kind) {
      node = adaptor.parent(node);
    }
    return adaptor.parent(node);
  }

  /**
   * @param {LiteAdaptor} adaptor  The adaptor for managing nodes
   * @param {LiteElement} node     The parent node for the tag
   * @param {string} tag           The tag being processed
   * @param {string[]} parts       The rest of the text/tag array
   * @return {LiteElement}         The node to which the next tag will be added
   */
  protected openTag(adaptor: LiteAdaptor, node: LiteElement, tag: string, parts: string[]): LiteElement {
    const PCDATA = (this.constructor as typeof LiteParser).PCDATA;
    const SELF_CLOSING = (this.constructor as typeof LiteParser).SELF_CLOSING;
    //
    // Get the child to be added to the node
    //
    const kind = tag.match(/<(.*?)[\s\n>\/]/)[1].toLowerCase();
    const child = adaptor.node(kind) as LiteElement;
    //
    // Split out the tag attributes as an array of space, name, value1, value3, value3,
    //   where value1, value2, and value3 are the value of the node (only one is defined)
    //   that come from matching quoted strings with ' (value1), " (value2) or no quotes (value3).
    //
    const attributes = tag.replace(/^<.*?[\s\n>]/, '').split(PATTERNS.attrsplit);
    //
    // If the tag was complete (it ends with > or has no attributes)
    //
    if (attributes.pop().match(/>$/) || attributes.length < 5) {
      this.addAttributes(adaptor, child, attributes);
      adaptor.append(node, child);
      //
      // For non-self-closing tags,
      //   For tags whose contents is PCDATA (like <script>), collect the
      //     content up until the end tag, and continue adding nee tags
      //     to the current parent node.
      //   Otherwise, the child tag becames the parent node to which
      //     new tags are added
      //
      if (!SELF_CLOSING[kind] && !tag.match(/\/>$/)) {
        if (PCDATA[kind]) {
          this.handlePCDATA(adaptor, child, kind, parts);
        } else {
          node = child;
        }
      }
    }
    return node;
  }

  /**
   * @param {LiteAdaptor} adaptor  The adaptor for managing nodes
   * @param {LiteElement} node     The node getting the attributes
   * @param {string[]} attributes  The array of space, name, value1, value2, value3
   *                                as described above.
   */
  protected addAttributes(adaptor: LiteAdaptor, node: LiteElement, attributes: string[]) {
    const CDATA_ATTR = (this.constructor as typeof LiteParser).CDATA_ATTR;
    while (attributes.length) {
      let [ , name, v1, v2, v3] = attributes.splice(0, 5);
      let value = v1 || v2 || v3 || '';
      if (!CDATA_ATTR[name]) {
        value = Entities.translate(value);
      }
      adaptor.setAttribute(node, name, value);
    }
  }

  /**
   * @param {LiteAdaptor} adaptor  The adaptor for managing nodes
   * @param {LiteElement} node     The node whose PCDATA content is being collected
   * @param {string} kind          The tag name being handled
   * @param {string[]} parts       The array of text/tag data for the document
   */
  protected handlePCDATA(adaptor: LiteAdaptor, node: LiteElement, kind: string, parts: string[]) {
    const pcdata = [] as string[];
    const etag = '</' + kind + '>';
    let ptag = '';
    //
    //  Look through the parts until the end tag is found
    //    Add the unmatched tag and the following text
    //    and try the next tag until we find the end tag.
    //
    while (parts.length && ptag !== etag) {
      pcdata.push(ptag);
      pcdata.push(parts.shift());
      ptag = parts.shift();
    }
    //
    //  Add the collected contents as a text node
    //
    adaptor.append(node, adaptor.text(pcdata.join('')));
  }

  /**
   * Check the contents of the parsed document and move html, head, and body
   * tags into the document structure.  That way, you can parse fragments or
   * full documents and still get a valid document.
   *
   * @param {LiteAdaptor} adaptor  The adaptor for managing nodes
   * @param {LiteDocument} root    The document being checked
   */
  protected checkDocument(adaptor: LiteAdaptor, root: LiteDocument) {
    let node = this.getOnlyChild(adaptor, adaptor.body(root));
    if (!node) return;
    for (const child of adaptor.childNodes(adaptor.body(root))) {
      if (child === node) {
        break;
      }
      if (child instanceof LiteComment && child.value.match(/^<!DOCTYPE/)) {
        root.type = child.value;
      }
    }
    switch (adaptor.kind(node)) {
    case 'html':
      //
      //  Look through the children for the head and body
      //
      for (const child of node.children) {
        switch (adaptor.kind(child)) {
        case 'head':
          root.head = child as LiteElement;
          break;
        case 'body':
          root.body = child as LiteElement;
          break;
        }
      }
      //
      //  Make sure the elements are linked in properly
      //
      root.root = node;
      adaptor.remove(node);
      if (adaptor.parent(root.body) !== node) {
        adaptor.append(node, root.body);
      }
      if (adaptor.parent(root.head) !== node) {
        adaptor.insert(root.head, root.body);
      }
      break;

    case 'head':
      root.head = adaptor.replace(node, root.head) as LiteElement;
      break;

    case 'body':
      root.body = adaptor.replace(node, root.body) as LiteElement;
      break;
    }
  }

  /**
   * Checks if the body has only one element child (as opposed to comments or text nodes)
   * and returns that sole element (or null if none or more than one)
   *
   * @param {LiteAdaptor} adaptor  The adaptor for managing nodes
   * @param {LiteElement} body     The body element being checked
   * @return {LiteElement}         The sole LiteElement child of the body, or null if none or more than one
   */
  protected getOnlyChild(adaptor: LiteAdaptor, body: LiteElement): LiteElement {
    let node: LiteElement = null;
    for (const child of adaptor.childNodes(body)) {
      if (child instanceof LiteElement) {
        if (node) return null;
        node = child;
      }
    }
    return node;
  }

  /**
   * @param {LiteAdaptor} adaptor  The adaptor for managing nodes
   * @param {LiteElement} node     The node to serialize
   * @param {boolean} xml          True when producing XML, false for HTML
   * @return {string}              The serialized element (like outerHTML)
   */
  public serialize(adaptor: LiteAdaptor, node: LiteElement, xml: boolean = false): string {
    const SELF_CLOSING = (this.constructor as typeof LiteParser).SELF_CLOSING;
    const CDATA = (this.constructor as typeof LiteParser).CDATA_ATTR;
    const tag = adaptor.kind(node);
    const attributes = adaptor.allAttributes(node).map(
      (x: AttributeData) => x.name + '="' + (CDATA[x.name] ? x.value : this.protectAttribute(x.value)) + '"'
    ).join(' ');
    const content = this.serializeInner(adaptor, node, xml);
    const html =
      '<' + tag + (attributes ? ' ' + attributes : '')
          + ((!xml || content) && !SELF_CLOSING[tag] ? `>${content}</${tag}>` : xml ? '/>' : '>');
    return html;
  }

  /**
   * @param {LiteAdaptor} adaptor  The adaptor for managing nodes
   * @param {LiteElement} node     The node whose innerHTML is needed
   * @return {string}              The serialized element (like innerHTML)
   */
  public serializeInner(adaptor: LiteAdaptor, node: LiteElement, xml: boolean = false): string {
    const PCDATA = (this.constructor as typeof LiteParser).PCDATA;
    if (PCDATA.hasOwnProperty(node.kind)) {
      return adaptor.childNodes(node).map(x => adaptor.value(x)).join('');
    }
    return adaptor.childNodes(node).map(x => {
      const kind = adaptor.kind(x);
      return (kind === '#text' ? this.protectHTML(adaptor.value(x)) :
              kind === '#comment' ? (x as LiteComment).value :
              this.serialize(adaptor, x as LiteElement, xml));
    }).join('');
  }

  /**
   * @param {string} text  The attribute value to be HTML escaped
   * @return {string}      The string with " replaced by entities
   */
  public protectAttribute(text: string): string {
    if (typeof text !== 'string') {
      text = String(text);
    }
    return text.replace(/"/g, '&quot;');
  }

  /**
   * @param {string} text  The text to be HTML escaped
   * @return {string}      The string with &, <, and > replaced by entities
   */
  public protectHTML(text: string): string {
    return text.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

}
