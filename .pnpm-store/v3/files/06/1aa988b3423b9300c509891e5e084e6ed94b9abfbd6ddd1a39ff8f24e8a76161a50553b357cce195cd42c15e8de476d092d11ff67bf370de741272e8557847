/*************************************************************
 *
 *  Copyright (c) 2009-2022 The MathJax Consortium
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
 * @fileoverview Regions for A11y purposes.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */


import {MathDocument} from '../../core/MathDocument.js';
import {CssStyles} from '../../util/StyleList.js';
import Sre from '../sre.js';

export type A11yDocument = MathDocument<HTMLElement, Text, Document>;

export interface Region<T> {

  /**
   * Adds a style sheet for the live region to the document.
   */
  AddStyles(): void;

  /**
   * Adds the region element to the document.
   */
  AddElement(): void;

  /**
   * Shows the live region in the document.
   * @param {HTMLElement} node
   * @param {Sre.highlighter} highlighter
   */
  Show(node: HTMLElement, highlighter: Sre.highlighter): void;

  /**
   * Takes the element out of the document flow.
   */
  Hide(): void;

  /**
   * Clears the content of the region.
   */
  Clear(): void;

  /**
   * Updates the content of the region.
   * @template T
   */
  Update(content: T): void;

}

export abstract class AbstractRegion<T> implements Region<T> {

  /**
   * CSS Classname of the element.
   * @type {String}
   */
  protected static className: string;

  /**
   * True if the style has already been added to the document.
   * @type {boolean}
   */
  protected static styleAdded: boolean = false;

  /**
   * The CSS style that needs to be added for this type of region.
   * @type {CssStyles}
   */
  protected static style: CssStyles;

  /**
   * The outer div node.
   * @type {HTMLElement}
   */
  protected div: HTMLElement;

  /**
   * The inner node.
   * @type {HTMLElement}
   */
  protected inner: HTMLElement;

  /**
   * The actual class name to refer to static elements of a class.
   * @type {typeof AbstractRegion}
   */
  protected CLASS: typeof AbstractRegion;

  /**
   * @constructor
   * @param {A11yDocument} document The document the live region is added to.
   */
  constructor(public document: A11yDocument) {
    this.CLASS = this.constructor as typeof AbstractRegion;
    this.AddStyles();
    this.AddElement();
  }


  /**
   * @override
   */
  public AddStyles() {
    if (this.CLASS.styleAdded) {
      return;
    }
    // TODO: should that be added to document.documentStyleSheet()?
    let node = this.document.adaptor.node('style');
    node.innerHTML = this.CLASS.style.cssText;
    this.document.adaptor.head(this.document.adaptor.document).
      appendChild(node);
    this.CLASS.styleAdded = true;
  }


  /**
   * @override
   */
  public AddElement() {
    let element = this.document.adaptor.node('div');
    element.classList.add(this.CLASS.className);
    element.style.backgroundColor = 'white';
    this.div = element;
    this.inner = this.document.adaptor.node('div');
    this.div.appendChild(this.inner);
    this.document.adaptor.
      body(this.document.adaptor.document).
      appendChild(this.div);

  }


  /**
   * @override
   */
  public Show(node: HTMLElement, highlighter: Sre.highlighter) {
    this.position(node);
    this.highlight(highlighter);
    this.div.classList.add(this.CLASS.className + '_Show');
  }


  /**
   * Computes the position where to place the element wrt. to the given node.
   * @param {HTMLElement} node The reference node.
   */
  protected abstract position(node: HTMLElement): void;


  /**
   * Highlights the region.
   * @param {Sre.highlighter} highlighter The Sre highlighter.
   */
  protected abstract highlight(highlighter: Sre.highlighter): void;


  /**
   * @override
   */
  public Hide() {
    this.div.classList.remove(this.CLASS.className + '_Show');
  }


  /**
   * @override
   */
  public abstract Clear(): void;


  /**
   * @override
   */
  public abstract Update(content: T): void;


  /**
   * Auxiliary position method that stacks shown regions of the same type.
   * @param {HTMLElement} node The reference node.
   */
  protected stackRegions(node: HTMLElement) {
    // TODO: This could be made more efficient by caching regions of a class.
    const rect = node.getBoundingClientRect();
    let baseBottom = 0;
    let baseLeft = Number.POSITIVE_INFINITY;
    let regions = this.document.adaptor.document.getElementsByClassName(
      this.CLASS.className + '_Show');
    // Get all the shown regions (one is this element!) and append at bottom.
    for (let i = 0, region; region = regions[i]; i++) {
      if (region !== this.div) {
        baseBottom = Math.max(region.getBoundingClientRect().bottom, baseBottom);
        baseLeft = Math.min(region.getBoundingClientRect().left, baseLeft);
      }
    }
    const bot = (baseBottom ? baseBottom : rect.bottom + 10) + window.pageYOffset;
    const left = (baseLeft < Number.POSITIVE_INFINITY ? baseLeft : rect.left) + window.pageXOffset;
    this.div.style.top = bot + 'px';
    this.div.style.left = left + 'px';
  }

}

export class DummyRegion extends AbstractRegion<void> {

  /**
   * @override
   */
  public Clear() {}

  /**
   * @override
   */
  public Update() {}

  /**
   * @override
   */
  public Hide() {}

  /**
   * @override
   */
  public Show() {}

  /**
   * @override
   */
  public AddElement() {}

  /**
   * @override
   */
  public AddStyles() {}

  /**
   * @override
   */
  public position() {}

  /**
   * @override
   */
  public highlight(_highlighter: Sre.highlighter) {}
}


export class StringRegion extends AbstractRegion<string> {

  /**
   * @override
   */
  public Clear(): void {
    this.Update('');
    this.inner.style.top = '';
    this.inner.style.backgroundColor = '';
  }


  /**
   * @override
   */
  public Update(speech: string) {
    this.inner.textContent = '';
    this.inner.textContent = speech;
  }

  /**
   * @override
   */
  protected position(node: HTMLElement) {
    this.stackRegions(node);
  }


  /**
   * @override
   */
  protected highlight(highlighter: Sre.highlighter) {
    const color = highlighter.colorString();
    this.inner.style.backgroundColor = color.background;
    this.inner.style.color = color.foreground;
  }

}


export class ToolTip extends StringRegion {

  /**
   * @override
   */
  protected static className = 'MJX_ToolTip';

  /**
   * @override
   */
  protected static style: CssStyles =
    new CssStyles({
      ['.' + ToolTip.className]: {
        position: 'absolute', display: 'inline-block',
        height: '1px', width: '1px'
      },
      ['.' + ToolTip.className + '_Show']: {
        width: 'auto', height: 'auto', opacity: 1, 'text-align': 'center',
        'border-radius': '6px', padding: '0px 0px',
        'border-bottom': '1px dotted black', position: 'absolute',
        'z-index': 202
      }
    });

}


export class LiveRegion extends StringRegion {

  /**
   * @override
   */
  protected static className = 'MJX_LiveRegion';

  /**
   * @override
   */
  protected static style: CssStyles =
    new CssStyles({
      ['.' + LiveRegion.className]: {
        position: 'absolute', top: '0', height: '1px', width: '1px',
        padding: '1px', overflow: 'hidden'
      },
      ['.' + LiveRegion.className + '_Show']: {
        top: '0', position: 'absolute', width: 'auto', height: 'auto',
        padding: '0px 0px', opacity: 1, 'z-index': '202',
        left: 0, right: 0, 'margin': '0 auto',
        'background-color': 'rgba(0, 0, 255, 0.2)', 'box-shadow': '0px 10px 20px #888',
        border: '2px solid #CCCCCC'
      }
    });


  /**
   * @constructor
   * @param {A11yDocument} document The document the live region is added to.
   */
  constructor(public document: A11yDocument) {
    super(document);
    this.div.setAttribute('aria-live', 'assertive');
  }

}


// Region that overlays the current element.
export class HoverRegion extends AbstractRegion<HTMLElement> {

  /**
   * @override
   */
  protected static className = 'MJX_HoverRegion';

  /**
   * @override
   */
  protected static style: CssStyles =
    new CssStyles({
      ['.' + HoverRegion.className]: {
        position: 'absolute', height: '1px', width: '1px',
        padding: '1px', overflow: 'hidden'
      },
      ['.' + HoverRegion.className + '_Show']: {
        position: 'absolute', width: 'max-content', height: 'auto',
        padding: '0px 0px', opacity: 1, 'z-index': '202', 'margin': '0 auto',
        'background-color': 'rgba(0, 0, 255, 0.2)',
        'box-shadow': '0px 10px 20px #888', border: '2px solid #CCCCCC'
      }
    });


  /**
   * @constructor
   * @param {A11yDocument} document The document the live region is added to.
   */
  constructor(public document: A11yDocument) {
    super(document);
    this.inner.style.lineHeight = '0';
  }

  /**
   * Sets the position of the region with respect to align parameter.  There are
   * three options: top, bottom and center. Center is the default.
   *
   * @param {HTMLElement} node The node that is displayed.
   */
  protected position(node: HTMLElement) {
    const nodeRect = node.getBoundingClientRect();
    const divRect = this.div.getBoundingClientRect();
    const xCenter = nodeRect.left + (nodeRect.width / 2);
    let left = xCenter - (divRect.width / 2);
    left = (left < 0) ? 0 : left;
    left = left + window.pageXOffset;
    let top;
    switch (this.document.options.a11y.align) {
    case 'top':
      top = nodeRect.top - divRect.height - 10 ;
      break;
    case 'bottom':
      top = nodeRect.bottom + 10;
      break;
    case 'center':
    default:
      const yCenter = nodeRect.top + (nodeRect.height / 2);
      top = yCenter - (divRect.height / 2);
    }
    top = top + window.pageYOffset;
    top = (top < 0) ? 0 : top;
    this.div.style.top = top + 'px';
    this.div.style.left = left + 'px';
  }

  /**
   * @override
   */
  protected highlight(highlighter: Sre.highlighter) {
    // TODO Do this with styles to avoid the interaction of SVG/CHTML.
    if (this.inner.firstChild &&
        !(this.inner.firstChild as HTMLElement).hasAttribute('sre-highlight')) {
      return;
    }
    const color = highlighter.colorString();
    this.inner.style.backgroundColor = color.background;
    this.inner.style.color = color.foreground;
  }

  /**
   * @override
   */
  public Show(node: HTMLElement, highlighter: Sre.highlighter) {
    this.div.style.fontSize = this.document.options.a11y.magnify;
    this.Update(node);
    super.Show(node, highlighter);
  }

  /**
   * @override
   */
  public Clear() {
    this.inner.textContent = '';
    this.inner.style.top = '';
    this.inner.style.backgroundColor = '';
  }

  /**
   * @override
   */
  public Update(node: HTMLElement) {
    this.Clear();
    let mjx = this.cloneNode(node);
    this.inner.appendChild(mjx);
  }

  /**
   * Clones the node to put into the hover region.
   * @param {HTMLElement} node The original node.
   * @return {HTMLElement} The cloned node.
   */
  private cloneNode(node: HTMLElement): HTMLElement {
    let mjx = node.cloneNode(true) as HTMLElement;
    if (mjx.nodeName !== 'MJX-CONTAINER') {
      // remove element spacing (could be done in CSS)
      if (mjx.nodeName !== 'g') {
        mjx.style.marginLeft = mjx.style.marginRight = '0';
      }
      let container = node;
      while (container && container.nodeName !== 'MJX-CONTAINER') {
        container = container.parentNode as HTMLElement;
      }
      if (mjx.nodeName !== 'MJX-MATH' && mjx.nodeName !== 'svg') {
        const child = container.firstChild;
        mjx = child.cloneNode(false).appendChild(mjx).parentNode as HTMLElement;
        //
        // SVG specific
        //
        if (mjx.nodeName === 'svg') {
          (mjx.firstChild as HTMLElement).setAttribute('transform', 'matrix(1 0 0 -1 0 0)');
          const W = parseFloat(mjx.getAttribute('viewBox').split(/ /)[2]);
          const w = parseFloat(mjx.getAttribute('width'));
          const {x, y, width, height} = (node as any).getBBox();
          mjx.setAttribute('viewBox', [x, -(y + height), width, height].join(' '));
          mjx.removeAttribute('style');
          mjx.setAttribute('width', (w / W * width) + 'ex');
          mjx.setAttribute('height', (w / W * height) + 'ex');
          container.setAttribute('sre-highlight', 'false');
        }
      }
      mjx = container.cloneNode(false).appendChild(mjx).parentNode as HTMLElement;
      //  remove displayed math margins (could be done in CSS)
      mjx.style.margin = '0';
    }
    return mjx;
  }

}
