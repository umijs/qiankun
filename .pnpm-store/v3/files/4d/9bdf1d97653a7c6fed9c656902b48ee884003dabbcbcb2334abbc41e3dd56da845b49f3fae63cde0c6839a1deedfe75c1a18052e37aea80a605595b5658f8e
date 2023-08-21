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
 * @fileoverview  Implements the CHTMLWrapper class
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {OptionList} from '../../util/Options.js';
import * as LENGTHS from '../../util/lengths.js';
import {CommonWrapper, AnyWrapperClass, Constructor, StringMap} from '../common/Wrapper.js';
import {CHTML} from '../chtml.js';
import {CHTMLWrapperFactory} from './WrapperFactory.js';
import {BBox} from '../../util/BBox.js';
import {CHTMLFontData, CHTMLCharOptions, CHTMLDelimiterData} from './FontData.js';

export {Constructor, StringMap} from '../common/Wrapper.js';

/*****************************************************************/

/**
 * Some standard sizes to use in predefind CSS properties
 */
export const FONTSIZE: StringMap = {
  '70.7%': 's',
  '70%': 's',
  '50%': 'ss',
  '60%': 'Tn',
  '85%': 'sm',
  '120%': 'lg',
  '144%': 'Lg',
  '173%': 'LG',
  '207%': 'hg',
  '249%': 'HG'
};

export const SPACE: StringMap = {
  /* tslint:disable:whitespace */
  [LENGTHS.em(2/18)]: '1',
  [LENGTHS.em(3/18)]: '2',
  [LENGTHS.em(4/18)]: '3',
  [LENGTHS.em(5/18)]: '4',
  [LENGTHS.em(6/18)]: '5'
  /* tslint:enable */
};


/**
 * Shorthand for making a CHTMLWrapper constructor
 */
export type CHTMLConstructor<N, T, D> = Constructor<CHTMLWrapper<N, T, D>>;


/*****************************************************************/
/**
 *  The type of the CHTMLWrapper class (used when creating the wrapper factory for this class)
 */
export interface CHTMLWrapperClass extends AnyWrapperClass {

  kind: string;

  /**
   * If true, this causes a style for the node type to be generated automatically
   * that sets display:inline-block (as needed for the output for MmlNodes).
   */
  autoStyle: boolean;

}

/*****************************************************************/
/**
 *  The base CHTMLWrapper class
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLWrapper<N, T, D> extends
CommonWrapper<
  CHTML<N, T, D>,
  CHTMLWrapper<N, T, D>,
  CHTMLWrapperClass,
  CHTMLCharOptions,
  CHTMLDelimiterData,
  CHTMLFontData
> {

  /**
   * The wrapper type
   */
  public static kind: string = 'unknown';

  /**
   * If true, this causes a style for the node type to be generated automatically
   * that sets display:inline-block (as needed for the output for MmlNodes).
   */
  public static autoStyle = true;

  /**
   * @override
   */
  protected factory: CHTMLWrapperFactory<N, T, D>;

  /**
   * @override
   */
  public parent: CHTMLWrapper<N, T, D>;
  /**
   * @override
   */
  public childNodes: CHTMLWrapper<N, T, D>[];

  /**
   * The HTML element generated for this wrapped node
   */
  public chtml: N = null;

  /*******************************************************************/

  /**
   * Create the HTML for the wrapped node.
   *
   * @param {N} parent  The HTML node where the output is added
   */
  public toCHTML(parent: N) {
    const chtml = this.standardCHTMLnode(parent);
    for (const child of this.childNodes) {
      child.toCHTML(chtml);
    }
  }

  /*******************************************************************/

  /**
   * Create the standard CHTML element for the given wrapped node.
   *
   * @param {N} parent  The HTML element in which the node is to be created
   * @returns {N}  The root of the HTML tree for the wrapped node's output
   */
  protected standardCHTMLnode(parent: N): N {
    this.markUsed();
    const chtml = this.createCHTMLnode(parent);
    this.handleStyles();
    this.handleVariant();
    this.handleScale();
    this.handleColor();
    this.handleSpace();
    this.handleAttributes();
    this.handlePWidth();
    return chtml;
  }

  /**
   * Mark this class as having been typeset (so its styles will be output)
   */
  public markUsed() {
    this.jax.wrapperUsage.add(this.kind);
  }

  /**
   * @param {N} parent  The HTML element in which the node is to be created
   * @returns {N}  The root of the HTML tree for the wrapped node's output
   */
  protected createCHTMLnode(parent: N): N {
    const href = this.node.attributes.get('href');
    if (href) {
      parent = this.adaptor.append(parent, this.html('a', {href: href})) as N;
    }
    this.chtml = this.adaptor.append(parent, this.html('mjx-' + this.node.kind)) as N;
    return this.chtml;
  }

  /**
   * Set the CSS styles for the chtml element
   */
  protected handleStyles() {
    if (!this.styles) return;
    const styles = this.styles.cssText;
    if (styles) {
      this.adaptor.setAttribute(this.chtml, 'style', styles);
      const family = this.styles.get('font-family');
      if (family) {
        this.adaptor.setStyle(this.chtml, 'font-family', 'MJXZERO, ' + family);
      }
    }
  }

  /**
   * Set the CSS for the math variant
   */
  protected handleVariant() {
    if (this.node.isToken && this.variant !== '-explicitFont') {
      this.adaptor.setAttribute(this.chtml, 'class',
                                (this.font.getVariant(this.variant) || this.font.getVariant('normal')).classes);
    }
  }

  /**
   * Set the (relative) scaling factor for the node
   */
  protected handleScale() {
    this.setScale(this.chtml, this.bbox.rscale);
  }

  /**
   * @param {N} chtml  The HTML node to scale
   * @param {number} rscale      The relatie scale to apply
   * @return {N}       The HTML node (for chaining)
   */
  protected setScale(chtml: N, rscale: number): N {
    const scale = (Math.abs(rscale - 1) < .001 ? 1 : rscale);
    if (chtml && scale !== 1) {
      const size = this.percent(scale);
      if (FONTSIZE[size]) {
        this.adaptor.setAttribute(chtml, 'size', FONTSIZE[size]);
      } else {
        this.adaptor.setStyle(chtml, 'fontSize', size);
      }
    }
    return chtml;
  }

  /**
   * Add the proper spacing
   */
  protected handleSpace() {
    for (const data of [[this.bbox.L, 'space',  'marginLeft'],
                        [this.bbox.R, 'rspace', 'marginRight']]) {
      const [dimen, name, margin] = data as [number, string, string];
      if (dimen) {
        const space = this.em(dimen);
        if (SPACE[space]) {
          this.adaptor.setAttribute(this.chtml, name, SPACE[space]);
        } else {
          this.adaptor.setStyle(this.chtml, margin, space);
        }
      }
    }
  }

  /**
   * Add the foreground and background colors
   * (Only look at explicit attributes, since inherited ones will
   *  be applied to a parent element, and we will inherit from that)
   */
  protected handleColor() {
    const attributes = this.node.attributes;
    const mathcolor = attributes.getExplicit('mathcolor') as string;
    const color = attributes.getExplicit('color') as string;
    const mathbackground = attributes.getExplicit('mathbackground') as string;
    const background = attributes.getExplicit('background') as string;
    if (mathcolor || color) {
      this.adaptor.setStyle(this.chtml, 'color', mathcolor || color);
    }
    if (mathbackground || background) {
      this.adaptor.setStyle(this.chtml, 'backgroundColor', mathbackground || background);
    }
  }

  /**
   * Copy RDFa, aria, and other tags from the MathML to the CHTML output nodes.
   * Don't copy those in the skipAttributes list, or anything that already exists
   * as a property of the node (e.g., no "onlick", etc.).  If a name in the
   * skipAttributes object is set to false, then the attribute WILL be copied.
   * Add the class to any other classes already in use.
   */
  protected handleAttributes() {
    const attributes = this.node.attributes;
    const defaults = attributes.getAllDefaults();
    const skip = CHTMLWrapper.skipAttributes;
    for (const name of attributes.getExplicitNames()) {
      if (skip[name] === false || (!(name in defaults) && !skip[name] &&
                                   !this.adaptor.hasAttribute(this.chtml, name))) {
        this.adaptor.setAttribute(this.chtml, name, attributes.getExplicit(name) as string);
      }
    }
    if (attributes.get('class')) {
      const names = (attributes.get('class') as string).trim().split(/ +/);
      for (const name of names) {
        this.adaptor.addClass(this.chtml, name);
      }
    }
  }

  /**
   * Handle the attributes needed for percentage widths
   */
  protected handlePWidth() {
    if (this.bbox.pwidth) {
      if (this.bbox.pwidth === BBox.fullWidth) {
        this.adaptor.setAttribute(this.chtml, 'width', 'full');
      } else {
        this.adaptor.setStyle(this.chtml, 'width', this.bbox.pwidth);
      }
    }
  }

  /*******************************************************************/

  /**
   * @param {N} chtml       The HTML node whose indentation is to be adjusted
   * @param {string} align  The alignment for the node
   * @param {number} shift  The indent (positive or negative) for the node
   */
  protected setIndent(chtml: N, align: string, shift: number) {
    const adaptor = this.adaptor;
    if (align === 'center' || align === 'left') {
      const L = this.getBBox().L;
      adaptor.setStyle(chtml, 'margin-left', this.em(shift + L));
    }
    if (align === 'center' || align === 'right') {
      const R = this.getBBox().R;
      adaptor.setStyle(chtml, 'margin-right', this.em(-shift + R));
    }
  }

  /*******************************************************************/
  /**
   * For debugging
   */

  public drawBBox() {
    let {w, h, d, R}  = this.getBBox();
    const box = this.html('mjx-box', {style: {
      opacity: .25, 'margin-left': this.em(-w - R)
    }}, [
      this.html('mjx-box', {style: {
        height: this.em(h),
        width: this.em(w),
        'background-color': 'red'
      }}),
      this.html('mjx-box', {style: {
        height: this.em(d),
        width: this.em(w),
        'margin-left': this.em(-w),
        'vertical-align': this.em(-d),
        'background-color': 'green'
      }})
    ] as N[]);
    const node = this.chtml || this.parent.chtml;
    const size = this.adaptor.getAttribute(node, 'size');
    if (size) {
      this.adaptor.setAttribute(box, 'size', size);
    }
    const fontsize = this.adaptor.getStyle(node, 'fontSize');
    if (fontsize) {
      this.adaptor.setStyle(box, 'fontSize', fontsize);
    }
    this.adaptor.append(this.adaptor.parent(node), box);
    this.adaptor.setStyle(node, 'backgroundColor', '#FFEE00');
  }

  /*******************************************************************/
  /*
   * Easy access to some utility routines
   */

  /**
   * @param {string} type      The tag name of the HTML node to be created
   * @param {OptionList} def   The properties to set for the created node
   * @param {(N|T)[]} content  The child nodes for the created HTML node
   * @return {N}               The generated HTML tree
   */
  public html(type: string, def: OptionList = {}, content: (N | T)[] = []): N {
    return this.jax.html(type, def, content);
  }

  /**
   * @param {string} text  The text from which to create an HTML text node
   * @return {T}           The generated text node with the given text
   */
  public text(text: string): T {
    return this.jax.text(text);
  }

  /**
   * @param {number} n  A unicode code point to be converted to a character className reference.
   * @return {string}   The className for the character
   */
  protected char(n: number): string {
    return this.font.charSelector(n).substr(1);
  }

}
