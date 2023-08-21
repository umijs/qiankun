/*************************************************************
 *
 *  Copyright (c) 2020-2022 The MathJax Consortium
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
 * @fileoverview  Support for the safe extension
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {Property} from '../../core/Tree/Node.js';
import {MmlNode} from '../../core/MmlTree/MmlNode.js';
import {MathItem} from '../../core/MathItem.js';
import {MathDocument} from '../../core/MathDocument.js';
import {OptionList, expandable} from '../../util/Options.js';
import {DOMAdaptor} from '../../core/DOMAdaptor.js';
import {SafeMethods} from './SafeMethods.js';


/**
 * Function type for filtering attributes
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export type FilterFunction<N, T, D> = (safe: Safe<N, T, D>, value: Property, ...args: any[]) => Property;

/**
 * The Safe object for sanitizing the internal MathML representation of an expression
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class Safe<N, T, D> {

  /**
   * The options controlling the handling of the safe extension
   */
  public static OPTIONS: OptionList = {
    allow: {
      //
      //  Values can be "all", "safe", or "none"
      //
      URLs:    'safe',   // safe are in safeProtocols below
      classes: 'safe',   // safe start with mjx- (can be set by pattern below)
      cssIDs:  'safe',   // safe start with mjx- (can be set by pattern below)
      styles:  'safe'    // safe are in safeStyles below
    },
    //
    // Largest padding/border/margin, etc. in em's
    //
    lengthMax: 3,
    //
    // Valid range for scriptsizemultiplier
    //
    scriptsizemultiplierRange: [.6, 1],
    //
    // Valid range for scriptlevel
    //
    scriptlevelRange: [-2, 2],
    //
    // Pattern for allowed class names
    //
    classPattern: /^mjx-[-a-zA-Z0-9_.]+$/,
    //
    // Pattern for allowed ids
    //
    idPattern: /^mjx-[-a-zA-Z0-9_.]+$/,
    //
    // Pattern for data attributes
    //
    dataPattern: /^data-mjx-/,
    //
    //  Which URL protocols are allowed
    //
    safeProtocols: expandable({
      http: true,
      https: true,
      file: true,
      javascript: false,
      data: false
    }),
    //
    //  Which styles are allowed
    //
    safeStyles: expandable({
      color: true,
      backgroundColor: true,
      border: true,
      cursor: true,
      margin: true,
      padding: true,
      textShadow: true,
      fontFamily: true,
      fontSize: true,
      fontStyle: true,
      fontWeight: true,
      opacity: true,
      outline: true
    }),
    //
    //  CSS styles that have Top/Right/Bottom/Left versions
    //
    styleParts: expandable({
      border: true,
      padding: true,
      margin: true,
      outline: true
    }),
    //
    //  CSS styles that are lengths needing max/min testing
    //    A string value means test that style value;
    //    An array gives [min,max] in em's
    //    Otherwise use [-lengthMax,lengthMax] from above
    //
    styleLengths: expandable({
      borderTop: 'borderTopWidth',
      borderRight: 'borderRightWidth',
      borderBottom: 'borderBottomWidth',
      borderLeft: 'borderLeftWidth',
      paddingTop: true,
      paddingRight: true,
      paddingBottom: true,
      paddingLeft: true,
      marginTop: true,
      marginRight: true,
      marginBottom: true,
      marginLeft: true,
      outlineTop: true,
      outlineRight: true,
      outlineBottom: true,
      outlineLeft: true,
      fontSize: [.707, 1.44]
    })
  };

  /**
   * The attribute-to-filter-method mapping
   */
  public filterAttributes: Map<string, string> = new Map([
    //
    //  Methods called for MathML attribute processing
    //
    ['href', 'filterURL'],
    ['src',  'filterURL'],
    ['altimg', 'filterURL'],
    ['class', 'filterClassList'],
    ['style', 'filterStyles'],
    ['id', 'filterID'],
    ['fontsize', 'filterFontSize'],
    ['mathsize', 'filterFontSize'],
    ['scriptminsize', 'filterFontSize'],
    ['scriptsizemultiplier', 'filterSizeMultiplier'],
    ['scriptlevel', 'filterScriptLevel'],
    ['data-', 'filterData']
  ]);

  /**
   * The safe options from the document option list
   */
  public options: OptionList;

  /**
   * Shorthand for options.allow
   */
  public allow: OptionList;

  /**
   * The DOM adaptor from the document
   */
  public adaptor: DOMAdaptor<N, T, D>;

  /**
   * The methods for filtering the MathML attributes
   */
  public filterMethods: {[name: string]: FilterFunction<N, T, D>} = {
    ...SafeMethods
  };

  /**
   * @param {MathDocument<N,T,D>} document  The MathDocument we are sanitizing
   * @param {OptionList} options            The safeOptions from the document
   */
  constructor(document: MathDocument<N, T, D>, options: OptionList) {
    this.adaptor = document.adaptor;
    this.options = options;
    this.allow = this.options.allow;
  }

  /**
   * Sanitize a MathItem's root MathML tree
   *
   * @param {MathItem<N,T,D>} math           The MathItem to sanitize
   * @param {MathDocument<N,T,D>} document   The MathDocument in which it lives
   */
  public sanitize(math: MathItem<N, T, D>, document: MathDocument<N, T, D>) {
    try {
      math.root.walkTree(this.sanitizeNode.bind(this));
    } catch (err) {
      document.options.compileError(document, math, err);
    }
  }

  /**
   * Sanitize a node's attributes
   *
   * @param {MmlNode} node      The node to sanitize
   */
  protected sanitizeNode(node: MmlNode) {
    const attributes = node.attributes.getAllAttributes();
    for (const id of Object.keys(attributes)) {
      const method = this.filterAttributes.get(id);
      if (method) {
        const value = this.filterMethods[method](this, attributes[id]);
        if (value) {
          if (value !== (typeof value === 'number' ? parseFloat(attributes[id] as string) : attributes[id])) {
            attributes[id] = value;
          }
        } else {
          delete attributes[id];
        }
      }
    }
  }

  /**
   * Sanitize a MathML input attribute
   *
   * @param {string} id      The name of the attribute
   * @param {string} value   The value of the attribute
   * @return {string|null}   The sanitized value
   */
  public mmlAttribute(id: string, value: string): string | null {
    if (id === 'class') return null;
    const method = this.filterAttributes.get(id);
    const filter = (method || (id.substr(0, 5) === 'data-' ? this.filterAttributes.get('data-') : null));
    if (!filter) {
      return value;
    }
    const result = this.filterMethods[filter](this, value, id);
    return (typeof result === 'number' || typeof result === 'boolean' ? String(result) : result);
  }

  /**
   * Sanitize a list of class names
   *
   * @param {string[]} list   The list of class names
   * @return {string[]}       The sanitized list
   */
  public mmlClassList(list: string[]): string[] {
    return list.map((name) => this.filterMethods.filterClass(this, name) as string)
               .filter((value) => value !== null);
  }

}
