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
 * @fileoverview  Implements the SVGWrapper class
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {OptionList} from '../../util/Options.js';
import {BBox} from '../../util/BBox.js';
import {CommonWrapper, AnyWrapperClass, Constructor} from '../common/Wrapper.js';
import {SVG, XLINKNS} from '../svg.js';
import {SVGWrapperFactory} from './WrapperFactory.js';
import {SVGFontData, SVGDelimiterData, SVGCharOptions} from './FontData.js';

export {Constructor, StringMap} from '../common/Wrapper.js';

/*****************************************************************/

/**
 * Shorthand for makeing a SVGWrapper constructor
 */
export type SVGConstructor<N, T, D> = Constructor<SVGWrapper<N, T, D>>;


/*****************************************************************/
/**
 *  The type of the SVGWrapper class (used when creating the wrapper factory for this class)
 */
export interface SVGWrapperClass extends AnyWrapperClass {

  kind: string;

}

/*****************************************************************/
/**
 *  The base SVGWrapper class
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class SVGWrapper<N, T, D> extends
CommonWrapper<
  SVG<N, T, D>,
  SVGWrapper<N, T, D>,
  SVGWrapperClass,
  SVGCharOptions,
  SVGDelimiterData,
  SVGFontData
> {

  /**
   * The kind of wrapper
   */
  public static kind: string = 'unknown';

  /**
   * A fuzz factor for borders to avoid anti-alias problems at the edges
   */
  public static borderFuzz = 0.005;

  /**
   * The factory used to create more SVGWrappers
   */
  protected factory: SVGWrapperFactory<N, T, D>;

  /**
   * @override
   */
  public parent: SVGWrapper<N, T, D>;
  /**
   * @override
   */
  public childNodes: SVGWrapper<N, T, D>[];

  /**
   * The SVG element generated for this wrapped node
   */
  public element: N = null;

  /**
   * Offset due to border/padding
   */
  public dx: number = 0;

  /**
   * @override
   */
  public font: SVGFontData;

  /*******************************************************************/

  /**
   * Create the HTML for the wrapped node.
   *
   * @param {N} parent  The HTML node where the output is added
   */
  public toSVG(parent: N) {
    this.addChildren(this.standardSVGnode(parent));
  }

  /**
   * @param {N} parent  The element in which to add the children
   */
  public addChildren(parent: N) {
    let x = 0;
    for (const child of this.childNodes) {
      child.toSVG(parent);
      const bbox = child.getOuterBBox();
      if (child.element) {
        child.place(x + bbox.L * bbox.rscale, 0);
      }
      x += (bbox.L + bbox.w + bbox.R) * bbox.rscale;
    }
  }

  /*******************************************************************/

  /**
   * Create the standard SVG element for the given wrapped node.
   *
   * @param {N} parent  The HTML element in which the node is to be created
   * @returns {N}  The root of the HTML tree for the wrapped node's output
   */
  protected standardSVGnode(parent: N): N {
    const svg = this.createSVGnode(parent);
    this.handleStyles();
    this.handleScale();
    this.handleBorder();
    this.handleColor();
    this.handleAttributes();
    return svg;
  }

  /**
   * @param {N} parent  The HTML element in which the node is to be created
   * @returns {N}  The root of the HTML tree for the wrapped node's output
   */
  protected createSVGnode(parent: N): N {
    this.element = this.svg('g', {'data-mml-node': this.node.kind});
    const href = this.node.attributes.get('href');
    if (href) {
      parent = this.adaptor.append(parent, this.svg('a', {href: href})) as N;
      const {h, d, w} = this.getOuterBBox();
      this.adaptor.append(this.element, this.svg('rect', {
        'data-hitbox': true, fill: 'none', stroke: 'none', 'pointer-events': 'all',
        width: this.fixed(w), height: this.fixed(h + d), y: this.fixed(-d)
      }));
    }
    this.adaptor.append(parent, this.element) as N;
    return this.element;
  }

  /**
   * Set the CSS styles for the svg element
   */
  protected handleStyles() {
    if (!this.styles) return;
    const styles = this.styles.cssText;
    if (styles) {
      this.adaptor.setAttribute(this.element, 'style', styles);
    }
    BBox.StyleAdjust.forEach(([name, , lr]) => {
      if (lr !== 0) return;
      const x = this.styles.get(name);
      if (x) {
        this.dx += this.length2em(x, 1, this.bbox.rscale);
      }
    });
  }

  /**
   * Set the (relative) scaling factor for the node
   */
  protected handleScale() {
    if (this.bbox.rscale !== 1) {
      const scale = 'scale(' + this.fixed(this.bbox.rscale / 1000, 3) + ')';
      this.adaptor.setAttribute(this.element, 'transform', scale);
    }
  }

  /**
   * Add the foreground and background colors
   * (Only look at explicit attributes, since inherited ones will
   *  be applied to a parent element, and we will inherit from that)
   */
  protected handleColor() {
    const adaptor = this.adaptor;
    const attributes = this.node.attributes;
    const mathcolor = attributes.getExplicit('mathcolor') as string;
    const color = attributes.getExplicit('color') as string;
    const mathbackground = attributes.getExplicit('mathbackground') as string;
    const background = attributes.getExplicit('background') as string;
    const bgcolor = (this.styles?.get('background-color') || '');
    if (mathcolor || color) {
      adaptor.setAttribute(this.element, 'fill', mathcolor || color);
      adaptor.setAttribute(this.element, 'stroke', mathcolor || color);
    }
    if (mathbackground || background || bgcolor) {
      let {h, d, w} = this.getOuterBBox();
      let rect = this.svg('rect', {
        fill: mathbackground || background || bgcolor,
        x: this.fixed(-this.dx), y: this.fixed(-d),
        width: this.fixed(w),
        height: this.fixed(h + d),
        'data-bgcolor': true
      });
      let child = adaptor.firstChild(this.element);
      if (child) {
        adaptor.insert(rect, child);
      } else {
        adaptor.append(this.element, rect);
      }
    }
  }

  /**
   * Create the borders, if any are requested.
   */
  protected handleBorder() {
    if (!this.styles) return;
    const width = Array(4).fill(0);
    const style = Array(4);
    const color = Array(4);
    for (const [name, i] of [['Top', 0], ['Right', 1], ['Bottom', 2], ['Left', 3]] as [string, number][]) {
      const key = 'border' + name;
      const w = this.styles.get(key + 'Width');
      if (!w) continue;
      width[i] = Math.max(0, this.length2em(w, 1, this.bbox.rscale));
      style[i] = this.styles.get(key + 'Style') || 'solid';
      color[i] = this.styles.get(key + 'Color') || 'currentColor';
    }
    const f = SVGWrapper.borderFuzz;
    const bbox = this.getOuterBBox();
    const [h, d, w] = [bbox.h + f, bbox.d + f, bbox.w + f];
    const outerRT = [w, h];
    const outerLT = [-f, h];
    const outerRB = [w, -d];
    const outerLB = [-f, -d];
    const innerRT = [w - width[1], h - width[0]];
    const innerLT = [-f + width[3], h - width[0]];
    const innerRB = [w - width[1], -d + width[2]];
    const innerLB = [-f + width[3], -d + width[2]];
    const paths: number[][][] = [
      [outerLT, outerRT, innerRT, innerLT],
      [outerRB, outerRT, innerRT, innerRB],
      [outerLB, outerRB, innerRB, innerLB],
      [outerLB, outerLT, innerLT, innerLB]
    ];
    const adaptor = this.adaptor;
    const child = adaptor.firstChild(this.element) as N;
    for (const i of [0, 1, 2, 3]) {
      if (!width[i]) continue;
      const path = paths[i];
      if (style[i] === 'dashed' || style[i] === 'dotted') {
        this.addBorderBroken(path, color[i], style[i], width[i], i);
      } else {
        this.addBorderSolid(path, color[i], child);
      }
    }
  }

  /**
   * Create a solid border piece with the given color
   *
   * @param {[number, number][]} path    The points for the border segment
   * @param {string} color               The color to use
   * @param {N} child                    Insert the border before this child, if any
   */
  protected addBorderSolid(path: number[][], color: string, child: N) {
    const border = this.svg('polygon', {
      points: path.map(([x, y]) => `${this.fixed(x - this.dx)},${this.fixed(y)}`).join(' '),
      stroke: 'none',
      fill: color
    });
    if (child) {
      this.adaptor.insert(border, child);
    } else {
      this.adaptor.append(this.element, border);
    }
  }

  /**
   * Create a dashed or dotted border line with the given width and color
   *
   * @param {[number, number][]} path   The points for the border segment
   * @param {string} color              The color to use
   * @param {string} style              Either 'dotted' or 'dashed'
   * @param {number} t                  The thickness for the border line
   * @param {number} i                  The side being drawn
   */
  protected addBorderBroken(path: number[][], color: string, style: string, t: number, i: number) {
    const dot = (style === 'dotted');
    const t2 = t / 2;
    const [tx1, ty1, tx2, ty2] = [[t2, -t2, -t2, -t2], [-t2, t2, -t2, -t2], [t2, t2, -t2, t2], [t2, t2, t2, -t2]][i];
    const [A, B] = path;
    const x1 = A[0] + tx1 - this.dx, y1 = A[1] + ty1;
    const x2 = B[0] + tx2 - this.dx, y2 = B[1] + ty2;
    const W = Math.abs(i % 2 ? y2 - y1 : x2 - x1);
    const n = (dot ? Math.ceil(W / (2 * t)) : Math.ceil((W - t) / (4 * t)));
    const m = W / (4 * n + 1);
    const line = this.svg('line', {
      x1: this.fixed(x1), y1: this.fixed(y1),
      x2: this.fixed(x2), y2: this.fixed(y2),
      'stroke-width': this.fixed(t), stroke: color, 'stroke-linecap': dot ? 'round' : 'square',
      'stroke-dasharray': dot ? [1, this.fixed(W / n - .002)].join(' ') : [this.fixed(m), this.fixed(3 * m)].join(' ')
    });
    const adaptor = this.adaptor;
    const child = adaptor.firstChild(this.element);
    if (child) {
      adaptor.insert(line, child);
    } else {
      adaptor.append(this.element, line);
    }
  }

  /**
   * Copy RDFa, aria, and other tags from the MathML to the SVG output nodes.
   * Don't copy those in the skipAttributes list, or anything that already exists
   * as a property of the node (e.g., no "onlick", etc.).  If a name in the
   * skipAttributes object is set to false, then the attribute WILL be copied.
   * Add the class to any other classes already in use.
   */
  protected handleAttributes() {
    const attributes = this.node.attributes;
    const defaults = attributes.getAllDefaults();
    const skip = SVGWrapper.skipAttributes;
    for (const name of attributes.getExplicitNames()) {
      if (skip[name] === false || (!(name in defaults) && !skip[name] &&
                                   !this.adaptor.hasAttribute(this.element, name))) {
        this.adaptor.setAttribute(this.element, name, attributes.getExplicit(name) as string);
      }
    }
    if (attributes.get('class')) {
      const names = (attributes.get('class') as string).trim().split(/ +/);
      for (const name of names) {
        this.adaptor.addClass(this.element, name);
      }
    }
  }

  /*******************************************************************/

  /**
   * @param {number} x   The x-offset for the element
   * @param {number} y   The y-offset for the element
   * @param {N} element  The element to be placed
   */
  public place(x: number, y: number, element: N = null) {
    x += this.dx;
    if (!(x || y)) return;
    if (!element) {
      element = this.element;
      y = this.handleId(y);
    }
    const translate = `translate(${this.fixed(x)},${this.fixed(y)})`;
    const transform = this.adaptor.getAttribute(element, 'transform') || '';
    this.adaptor.setAttribute(element, 'transform', translate + (transform ? ' ' + transform : ''));
  }

  /**
   * Firefox and Safari don't scroll to the top of the element with an Id, so
   *   we shift the element up and then translate its contents down in order to
   *   correct for their positioning.  Also, Safari will go to the baseline of
   *   a <text> element (e.g., when mtextInheritFont is true), so add a text
   *   element to help Safari get the right location.
   *
   * @param {number} y     The current offset of the element
   * @return {number}      The new offset for the element if it has an id
   */
  protected handleId(y: number): number {
    if (!this.node.attributes || !this.node.attributes.get('id')) {
      return y;
    }
    const adaptor = this.adaptor;
    const h = this.getBBox().h;
    //
    //  Remove the element's children and put them into a <g> with transform
    //
    const children =  adaptor.childNodes(this.element);
    children.forEach(child => adaptor.remove(child));
    const g = this.svg('g', {'data-idbox': true, transform: `translate(0,${this.fixed(-h)})`}, children);
    //
    //  Add the text element (not transformed) and the transformed <g>
    //
    adaptor.append(this.element, this.svg('text', {'data-id-align': true} , [this.text('')]));
    adaptor.append(this.element, g);
    return y + h;
  }

  /**
   * Return the first child element, skipping id align boxes and href hit boxes
   *
   * @return {N}   The first "real" child element
   */
  public firstChild(): N {
    const adaptor = this.adaptor;
    let child = adaptor.firstChild(this.element);
    if (child && adaptor.kind(child) === 'text' && adaptor.getAttribute(child, 'data-id-align')) {
      child = adaptor.firstChild(adaptor.next(child));
    }
    if (child && adaptor.kind(child) === 'rect' && adaptor.getAttribute(child, 'data-hitbox')) {
      child = adaptor.next(child);
    }
    return child;
  }

  /**
   * @param {number} n        The character number
   * @param {number} x        The x-position of the character
   * @param {number} y        The y-position of the character
   * @param {N} parent        The container for the character
   * @param {string} variant  The variant to use for the character
   * @return {number}         The width of the character
   */
  public placeChar(n: number, x: number, y: number, parent: N, variant: string = null): number {
    if (variant === null) {
      variant = this.variant;
    }
    const C = n.toString(16).toUpperCase();
    const [ , , w, data] = this.getVariantChar(variant, n);
    if ('p' in data) {
      const path = (data.p ? 'M' + data.p + 'Z' : '');
      this.place(x, y, this.adaptor.append(parent, this.charNode(variant, C, path)));
    } else if ('c' in data) {
      const g = this.adaptor.append(parent, this.svg('g', {'data-c': C}));
      this.place(x, y, g);
      x = 0;
      for (const n of this.unicodeChars(data.c, variant)) {
        x += this.placeChar(n, x, y, g, variant);
      }
    } else if (data.unknown) {
      const char = String.fromCodePoint(n);
      const text = this.adaptor.append(parent, this.jax.unknownText(char, variant));
      this.place(x, y, text);
      return this.jax.measureTextNodeWithCache(text, char, variant).w;
    }
    return w;
  }

  /**
   * @param {string} variant    The name of the variant being used
   * @param {string} C          The hex string for the character code
   * @param {string} path       The data from the character
   * @return {N}                The <path> or <use> node for the glyph
   */
  protected charNode(variant: string, C: string, path: string): N {
    const cache = this.jax.options.fontCache;
    return (cache !== 'none' ? this.useNode(variant, C, path) : this.pathNode(C, path));
  }

  /**
   * @param {string} C          The hex string for the character code
   * @param {string} path       The data from the character
   * @return {N}                The <path> for the glyph
   */
  protected pathNode(C: string, path: string): N {
    return this.svg('path', {'data-c': C, d: path});
  }

  /**
   * @param {string} variant    The name of the variant being used
   * @param {string} C          The hex string for the character code
   * @param {string} path       The data from the character
   * @return {N}                The <use> node for the glyph
   */
  protected useNode(variant: string, C: string, path: string): N {
    const use = this.svg('use', {'data-c': C});
    const id = '#' + this.jax.fontCache.cachePath(variant, C, path);
    this.adaptor.setAttribute(use, 'href', id, XLINKNS);
    return use;
  }

  /*******************************************************************/
  /**
   * For debugging
   */

  public drawBBox() {
    let {w, h, d}  = this.getBBox();
    const box = this.svg('g', {style: {
      opacity: .25
    }}, [
      this.svg('rect', {
        fill: 'red',
        height: this.fixed(h),
        width: this.fixed(w)
      }),
      this.svg('rect', {
        fill: 'green',
        height: this.fixed(d),
        width: this.fixed(w),
        y: this.fixed(-d)
      })
    ] as N[]);
    const node = this.element || this.parent.element;
    this.adaptor.append(node, box);
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
   * @param {string} type      The tag name of the svg node to be created
   * @param {OptionList} def   The properties to set for the created node
   * @param {(N|T)[]} content  The child nodes for the created SVG node
   * @return {N}               The generated SVG tree
   */
  public svg(type: string, def: OptionList = {}, content: (N | T)[] = []): N {
    return this.jax.svg(type, def, content);
  }

  /**
   * @param {string} text  The text from which to create an HTML text node
   * @return {T}  The generated text node with the given text
   */
  public text(text: string): T {
    return this.jax.text(text);
  }

  /**
   * @param {number} x   The dimension to display
   * @param {number=} n  The number of digits to display
   * @return {string}    The dimension with the given number of digits (minus trailing zeros)
   */
  public fixed(x: number, n: number = 1): string {
    return this.jax.fixed(x * 1000, n);
  }

}
