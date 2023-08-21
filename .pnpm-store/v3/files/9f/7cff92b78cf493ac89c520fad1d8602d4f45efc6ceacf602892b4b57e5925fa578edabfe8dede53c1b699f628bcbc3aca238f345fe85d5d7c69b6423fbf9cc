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
 * @fileoverview  Implements the HTMLDocument class
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AbstractMathDocument} from '../../core/MathDocument.js';
import {userOptions, separateOptions, OptionList, expandable} from '../../util/Options.js';
import {HTMLMathItem} from './HTMLMathItem.js';
import {HTMLMathList} from './HTMLMathList.js';
import {HTMLDomStrings} from './HTMLDomStrings.js';
import {DOMAdaptor} from '../../core/DOMAdaptor.js';
import {InputJax} from '../../core/InputJax.js';
import {STATE, ProtoItem, Location} from '../../core/MathItem.js';
import {StyleList} from '../../util/StyleList.js';

/*****************************************************************/
/**
 * List of Lists of pairs consisting of a DOM node and its text length
 *
 * These represent the Text elements that make up a single
 * string in the list of strings to be searched for math
 * (multiple consecutive Text nodes can form a single string).
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 */
export type HTMLNodeArray<N, T> = [N | T, number][][];

/*****************************************************************/
/**
 *  The HTMLDocument class (extends AbstractMathDocument)
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class HTMLDocument<N, T, D> extends AbstractMathDocument<N, T, D> {

  /**
   * The kind of document
   */
  public static KIND: string = 'HTML';

  /**
   * The default options for HTMLDocument
   */
  public static OPTIONS: OptionList = {
    ...AbstractMathDocument.OPTIONS,
    renderActions: expandable({
      ...AbstractMathDocument.OPTIONS.renderActions,
      styles: [STATE.INSERTED + 1, '', 'updateStyleSheet', false]  // update styles on a rerender() call
    }),
    MathList: HTMLMathList,           // Use the HTMLMathList for MathLists
    MathItem: HTMLMathItem,           // Use the HTMLMathItem for MathItem
    DomStrings: null                  // Use the default DomString parser
  };

  /**
   * Extra styles to be included in the document's stylesheet (added by extensions)
   */
  protected styles: StyleList[];

  /**
   * The DomString parser for locating the text in DOM trees
   */
  public domStrings: HTMLDomStrings<N, T, D>;

  /**
   * @override
   * @constructor
   * @extends {AbstractMathDocument}
   */
  constructor(document: any, adaptor: DOMAdaptor<N, T, D>, options: OptionList) {
    let [html, dom] = separateOptions(options, HTMLDomStrings.OPTIONS);
    super(document, adaptor, html);
    this.domStrings = this.options['DomStrings'] || new HTMLDomStrings<N, T, D>(dom);
    this.domStrings.adaptor = adaptor;
    this.styles = [];
  }

  /**
   * Creates a Location object for a delimiter at the position given by index in the N's string
   *  of the array of strings searched for math, recovering the original DOM node where the delimiter
   *  was found.
   *
   * @param {number} N             The index of the string in the string array
   * @param {number} index         The position within the N's string that needs to be found
   * @param {string} delim         The delimiter for this position
   * @param {HTMLNodeArray} nodes  The list of node lists representing the string array
   * @return {Location}            The Location object for the position of the delimiter in the document
   */
  protected findPosition(N: number, index: number, delim: string, nodes: HTMLNodeArray<N, T>): Location<N, T> {
    const adaptor = this.adaptor;
    for (const list of nodes[N]) {
      let [node, n] = list;
      if (index <= n && adaptor.kind(node) === '#text') {
        return {node: node, n: Math.max(index, 0), delim: delim};
      }
      index -= n;
    }
    return {node: null, n: 0, delim: delim};
  }

  /**
   * Convert a ProtoItem to a MathItem (i.e., determine the actual Location
   *  objects for its start and end)
   *
   * @param {ProtoItem} item       The proto math item to turn into an actual MathItem
   * @param {InputJax} jax         The input jax to use for the MathItem
   * @param {HTMLNodeArray} nodes  The array of node lists that produced the string array
   * @return {HTMLMathItem}        The MathItem for the given proto item
   */
  protected mathItem(item: ProtoItem<N, T>, jax: InputJax<N, T, D>,
                     nodes: HTMLNodeArray<N, T>): HTMLMathItem<N, T, D> {
                       let math = item.math;
                       let start = this.findPosition(item.n, item.start.n, item.open, nodes);
                       let end = this.findPosition(item.n, item.end.n, item.close, nodes);
                       return new this.options.MathItem(math, jax, item.display, start, end) as HTMLMathItem<N, T, D>;
                     }

  /**
   * Find math within the document:
   *  Get the list of containers (default is document.body), and for each:
   *    For each input jax:
   *      Make a new MathList to store the located math
   *      If the input jax processes strings:
   *        If we haven't already made the string array and corresponding node list, do so
   *        Ask the jax to find the math in the string array, and
   *          for each one, push it onto the math list
   *      Otherwise (the jax processes DOM nodes):
   *        Ask the jax to find the math in the container, and
   *          for each one, make the result into a MathItem, and push it on the list
   *      Merge the new math list into the document's math list
   *        (we use merge to maintain a sorted list of MathItems)
   *
   * @override
   */
  public findMath(options: OptionList) {
    if (!this.processed.isSet('findMath')) {
      this.adaptor.document = this.document;
      options = userOptions({elements: this.options.elements || [this.adaptor.body(this.document)]}, options);
      for (const container of this.adaptor.getElements(options['elements'], this.document)) {
        let [strings, nodes] = [null, null] as [string[], HTMLNodeArray<N, T>];
        for (const jax of this.inputJax) {
          let list = new (this.options['MathList'])();
          if (jax.processStrings) {
            if (strings === null) {
              [strings, nodes] = this.domStrings.find(container);
            }
            for (const math of jax.findMath(strings)) {
              list.push(this.mathItem(math, jax, nodes));
            }
          } else {
            for (const math of jax.findMath(container)) {
              let item: HTMLMathItem<N, T, D> =
                new this.options.MathItem(math.math, jax, math.display, math.start, math.end);
              list.push(item);
            }
          }
          this.math.merge(list);
        }
      }
      this.processed.set('findMath');
    }
    return this;
  }

  /**
   * @override
   */
  public updateDocument() {
    if (!this.processed.isSet('updateDocument')) {
      this.addPageElements();
      this.addStyleSheet();
      super.updateDocument();
      this.processed.set('updateDocument');
    }
    return this;
  }

  /**
   *  Add any elements needed for the document
   */
  protected addPageElements() {
    const body = this.adaptor.body(this.document);
    const node = this.documentPageElements();
    if (node) {
      this.adaptor.append(body, node);
    }
  }

  /**
   * Add the stylesheet to the document
   */
  public addStyleSheet() {
    const sheet = this.documentStyleSheet();
    const adaptor = this.adaptor;
    if (sheet && !adaptor.parent(sheet)) {
      const head = adaptor.head(this.document);
      let styles = this.findSheet(head, adaptor.getAttribute(sheet, 'id'));
      if (styles) {
        adaptor.replace(sheet, styles);
      } else {
        adaptor.append(head, sheet);
      }
    }
  }

  /**
   * @param {N} head     The document <head>
   * @param {string} id  The id of the stylesheet to find
   * @param {N|null}     The stylesheet with the given ID
   */
  protected findSheet(head: N, id: string) {
    if (id) {
      for (const sheet of this.adaptor.tags(head, 'style')) {
        if (this.adaptor.getAttribute(sheet, 'id') === id) {
          return sheet;
        }
      }
    }
    return null as N;
  }

  /**
   * @override
   */
  public removeFromDocument(restore: boolean = false) {
    if (this.processed.isSet('updateDocument')) {
      for (const math of this.math) {
        if (math.state() >= STATE.INSERTED) {
          math.state(STATE.TYPESET, restore);
        }
      }
    }
    this.processed.clear('updateDocument');
    return this;
  }

  /**
   * @override
   */
  public documentStyleSheet() {
    return this.outputJax.styleSheet(this);
  }

  /**
   * @override
   */
  public documentPageElements() {
    return this.outputJax.pageElements(this);
  }

  /**
   * Add styles to be included in the document's stylesheet
   *
   * @param {StyleList} styles   The styles to include
   */
  public addStyles(styles: StyleList) {
    this.styles.push(styles);
  }

  /**
   * Get the array of document-specific styles
   */
  public getStyles() {
    return this.styles;
  }

}
