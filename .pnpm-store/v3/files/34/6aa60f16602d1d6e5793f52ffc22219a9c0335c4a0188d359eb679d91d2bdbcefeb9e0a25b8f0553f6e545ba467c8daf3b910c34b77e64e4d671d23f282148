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
 * @fileoverview  Implements the CommonWrapper class
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AbstractWrapper, WrapperClass} from '../../core/Tree/Wrapper.js';
import {PropertyList} from '../../core/Tree/Node.js';
import {MmlNode, TextNode, AbstractMmlNode, indentAttributes} from '../../core/MmlTree/MmlNode.js';
import {MmlMo} from '../../core/MmlTree/MmlNodes/mo.js';
import {Property} from '../../core/Tree/Node.js';
import {unicodeChars} from '../../util/string.js';
import * as LENGTHS from '../../util/lengths.js';
import {Styles} from '../../util/Styles.js';
import {StyleList} from '../../util/StyleList.js';
import {CommonOutputJax} from './OutputJax.js';
import {CommonWrapperFactory} from './WrapperFactory.js';
import {BBox} from '../../util/BBox.js';
import {FontData, DelimiterData, CharData, CharOptions, DIRECTION, NOSTRETCH} from './FontData.js';

/*****************************************************************/

/**
 * Shorthand for a dictionary object (an object of key:value pairs)
 */
export type StringMap = {[key: string]: string};

/**
 * MathML spacing rules
 */
/* tslint:disable-next-line:whitespace */
const SMALLSIZE = 2/18;

/**
 * @param {boolean} script   The scriptlevel
 * @param {number} size      The space size
 * @return {number}          The size clamped to SMALLSIZE when scriptlevel > 0
 */
function MathMLSpace(script: boolean, size: number): number {
  return (script ? size < SMALLSIZE ? 0 : SMALLSIZE : size);
}

export type Constructor<T> = new(...args: any[]) => T;

/**
 * Shorthands for wrappers and their constructors
 */
export type AnyWrapper = CommonWrapper<any, any, any, any, any, any>;
export type AnyWrapperClass = CommonWrapperClass<any, any, any, any, any, any>;
export type WrapperConstructor = Constructor<AnyWrapper>;

/*********************************************************/
/**
 *  The CommonWrapper class interface
 *
 * @template J  The OutputJax type
 * @template W  The Wrapper type
 * @template C  The WrapperClass type
 * @template CC The CharOptions type
 * @template FD The FontData type
 */
export interface CommonWrapperClass<
  J extends CommonOutputJax<any, any, any, W, CommonWrapperFactory<J, W, C, CC, DD, FD>, FD, any>,
  W extends CommonWrapper<J, W, C, CC, DD, FD>,
  C extends CommonWrapperClass<J, W, C, CC, DD, FD>,
  CC extends CharOptions,
  DD extends DelimiterData,
  FD extends FontData<CC, any, DD>
> extends WrapperClass<MmlNode, CommonWrapper<J, W, C, CC, DD, FD>> {
  /**
   * @override
   */
  new(factory: CommonWrapperFactory<J, W, C, CC, DD, FD>, node: MmlNode, ...args: any[]): W;
}

/*****************************************************************/
/**
 *  The base CommonWrapper class
 *
 * @template J  The OutputJax type
 * @template W  The Wrapper type
 * @template C  The WrapperClass type
 * @template CC The CharOptions type
 * @template FD The FontData type
 */
export class CommonWrapper<
  J extends CommonOutputJax<any, any, any, W, CommonWrapperFactory<J, W, C, CC, DD, FD>, FD, any>,
  W extends CommonWrapper<J, W, C, CC, DD, FD>,
  C extends CommonWrapperClass<J, W, C, CC, DD, FD>,
  CC extends CharOptions,
  DD extends DelimiterData,
  FD extends FontData<CC, any, DD>
> extends AbstractWrapper<MmlNode, CommonWrapper<J, W, C, CC, DD, FD>> {

  /**
   * The wrapper kind
   */
  public static kind: string = 'unknown';

  /**
   * Any styles needed for the class
   */
  public static styles: StyleList = {};

  /**
   * Styles that should not be passed on from style attribute
   */
  public static removeStyles: string[] = [
    'fontSize', 'fontFamily', 'fontWeight',
    'fontStyle', 'fontVariant', 'font'
  ];

  /**
   * Non-MathML attributes on MathML elements NOT to be copied to the
   * corresponding DOM elements.  If set to false, then the attribute
   * WILL be copied.  Most of these (like the font attributes) are handled
   * in other ways.
   */
  public static skipAttributes: {[name: string]: boolean} = {
    fontfamily: true, fontsize: true, fontweight: true, fontstyle: true,
    color: true, background: true,
    'class': true, href: true, style: true,
    xmlns: true
  };

  /**
   * The translation of mathvariant to bold styles, or to remove
   * bold from a mathvariant.
   */
  public static BOLDVARIANTS: {[name: string]: StringMap} =  {
    bold: {
      normal: 'bold',
      italic: 'bold-italic',
      fraktur: 'bold-fraktur',
      script: 'bold-script',
      'sans-serif': 'bold-sans-serif',
      'sans-serif-italic': 'sans-serif-bold-italic'
    },
    normal: {
      bold: 'normal',
      'bold-italic': 'italic',
      'bold-fraktur': 'fraktur',
      'bold-script': 'script',
      'bold-sans-serif': 'sans-serif',
      'sans-serif-bold-italic': 'sans-serif-italic'
    }
  };

  /**
   * The translation of mathvariant to italic styles, or to remove
   * italic from a mathvariant.
   */
  public static ITALICVARIANTS: {[name: string]: StringMap} = {
    italic: {
      normal: 'italic',
      bold: 'bold-italic',
      'sans-serif': 'sans-serif-italic',
      'bold-sans-serif': 'sans-serif-bold-italic'
    },
    normal: {
      italic: 'normal',
      'bold-italic': 'bold',
      'sans-serif-italic': 'sans-serif',
      'sans-serif-bold-italic': 'bold-sans-serif'
    }
  };

  /**
   * The factory used to create more wrappers
   */
  protected factory: CommonWrapperFactory<J, W, C, CC, DD, FD>;

  /**
   * The parent of this node
   */
  public parent: W = null;

  /**
   * The children of this node
   */
  public childNodes: W[];

  /**
   * Styles that must be handled directly by the wrappers (mostly having to do with fonts)
   */
  protected removedStyles: StringMap = null;

  /**
   * The explicit styles set by the node
   */
  protected styles: Styles = null;

  /**
   * The mathvariant for this node
   */
  public variant: string = '';

  /**
   * The bounding box for this node
   */
  public bbox: BBox;
  /**
   * Whether the bounding box has been computed yet
   */
  protected bboxComputed: boolean = false;

  /**
   * Delimiter data for stretching this node (NOSTRETCH means not yet determined)
   */
  public stretch: DD = NOSTRETCH as DD;

  /**
   * Easy access to the font parameters
   */
  public font: FD = null;

  /**
   * Easy access to the output jax for this node
   */
  get jax() {
    return this.factory.jax;
  }

  /**
   * Easy access to the DOMAdaptor object
   */
  get adaptor() {
    return this.factory.jax.adaptor;
  }

  /**
   * Easy access to the metric data for this node
   */
  get metrics() {
    return this.factory.jax.math.metrics;
  }

  /**
   * True if children with percentage widths should be resolved by this container
   */
  get fixesPWidth() {
    return !this.node.notParent && !this.node.isToken;
  }

  /*******************************************************************/

  /**
   * @override
   */
  constructor(factory: CommonWrapperFactory<J, W, C, CC, DD, FD>, node: MmlNode, parent: W = null) {
    super(factory, node);
    this.parent = parent;
    this.font = factory.jax.font;
    this.bbox = BBox.zero();
    this.getStyles();
    this.getVariant();
    this.getScale();
    this.getSpace();
    this.childNodes = node.childNodes.map((child: MmlNode) => {
      const wrapped = this.wrap(child);
      if (wrapped.bbox.pwidth && (node.notParent || node.isKind('math'))) {
        this.bbox.pwidth = BBox.fullWidth;
      }
      return wrapped;
    });
  }

  /**
   * @param {MmlNode} node  The node to the wrapped
   * @param {W} parent  The wrapped parent node
   * @return {W}  The newly wrapped node
   */
  public wrap(node: MmlNode, parent: W = null): W {
    const wrapped = this.factory.wrap(node, parent || this);
    if (parent) {
      parent.childNodes.push(wrapped);
    }
    this.jax.nodeMap.set(node, wrapped);
    return wrapped;
  }

  /*******************************************************************/
  /**
   * Return the wrapped node's bounding box, either the cached one, if it exists,
   *   or computed directly if not.
   *
   * @param {boolean} save  Whether to cache the bbox or not (used for stretchy elements)
   * @return {BBox}  The computed bounding box
   */
  public getBBox(save: boolean = true): BBox {
    if (this.bboxComputed) {
      return this.bbox;
    }
    const bbox = (save ? this.bbox : BBox.zero());
    this.computeBBox(bbox);
    this.bboxComputed = save;
    return bbox;
  }

  /**
   * Return the wrapped node's bounding box that includes borders and padding
   *
   * @param {boolean} save  Whether to cache the bbox or not (used for stretchy elements)
   * @return {BBox}  The computed bounding box
   */
  public getOuterBBox(save: boolean = true): BBox {
    const bbox = this.getBBox(save);
    if (!this.styles) return bbox;
    const obox = new BBox();
    Object.assign(obox, bbox);
    for (const [name, side] of BBox.StyleAdjust) {
      const x = this.styles.get(name);
      if (x) {
        (obox as any)[side] += this.length2em(x, 1, obox.rscale);
      }
    }
    return obox;
  }

  /**
   * @param {BBox} bbox           The bounding box to modify (either this.bbox, or an empty one)
   * @param {boolean} recompute   True if we are recomputing due to changes in children that have percentage widths
   */
  protected computeBBox(bbox: BBox, recompute: boolean = false) {
    bbox.empty();
    for (const child of this.childNodes) {
      bbox.append(child.getOuterBBox());
    }
    bbox.clean();
    if (this.fixesPWidth && this.setChildPWidths(recompute)) {
      this.computeBBox(bbox, true);
    }
  }

  /**
   * Recursively resolve any percentage widths in the child nodes using the given
   *   container width (or the child width, if none was passed).
   *   Overriden for mtables in order to compute the width.
   *
   * @param {boolean} recompute  True if we are recomputing due to changes in children
   * @param {(number|null)=} w   The width of the container (from which percentages are computed)
   * @param {boolean=} clear     True if pwidth marker is to be cleared
   * @return {boolean}           True if a percentage width was found
   */
  public setChildPWidths(recompute: boolean, w: (number | null) = null, clear: boolean = true): boolean {
    if (recompute) {
      return false;
    }
    if (clear) {
      this.bbox.pwidth = '';
    }
    let changed = false;
    for (const child of this.childNodes) {
      const cbox = child.getOuterBBox();
      if (cbox.pwidth && child.setChildPWidths(recompute, w === null ? cbox.w : w, clear)) {
        changed = true;
      }
    }
    return changed;
  }

  /**
   * Mark BBox to be computed again (e.g., when an mo has stretched)
   */
  public invalidateBBox() {
    if (this.bboxComputed) {
      this.bboxComputed = false;
      if (this.parent) {
        this.parent.invalidateBBox();
      }
    }
  }

  /**
   * Copy child skew and italic correction
   *
   * @param {BBox} bbox  The bounding box to modify
   */
  protected copySkewIC(bbox: BBox) {
    const first = this.childNodes[0];
    if (first?.bbox.sk) {
      bbox.sk = first.bbox.sk;
    }
    if (first?.bbox.dx) {
      bbox.dx = first.bbox.dx;
    }
    const last = this.childNodes[this.childNodes.length - 1];
    if (last?.bbox.ic) {
      bbox.ic = last.bbox.ic;
      bbox.w += bbox.ic;
    }
  }

  /*******************************************************************/

  /**
   * Add the style attribute, but remove any font-related styles
   *   (since these are handled separately by the variant)
   */
  protected getStyles() {
    const styleString = this.node.attributes.getExplicit('style') as string;
    if (!styleString) return;
    const style = this.styles = new Styles(styleString);
    for (let i = 0, m = CommonWrapper.removeStyles.length; i < m; i++) {
      const id = CommonWrapper.removeStyles[i];
      if (style.get(id)) {
        if (!this.removedStyles) this.removedStyles = {};
        this.removedStyles[id] = style.get(id);
        style.set(id, '');
      }
    }
  }

  /**
   * Get the mathvariant (or construct one, if needed).
   */
  protected getVariant() {
    if (!this.node.isToken) return;
    const attributes = this.node.attributes;
    let variant = attributes.get('mathvariant') as string;
    if (!attributes.getExplicit('mathvariant')) {
      const values = attributes.getList('fontfamily', 'fontweight', 'fontstyle') as StringMap;
      if (this.removedStyles) {
        const style = this.removedStyles;
        if (style.fontFamily) values.family = style.fontFamily;
        if (style.fontWeight) values.weight = style.fontWeight;
        if (style.fontStyle)  values.style  = style.fontStyle;
      }
      if (values.fontfamily) values.family = values.fontfamily;
      if (values.fontweight) values.weight = values.fontweight;
      if (values.fontstyle)  values.style  = values.fontstyle;
      if (values.weight && values.weight.match(/^\d+$/)) {
        values.weight = (parseInt(values.weight) > 600 ? 'bold' : 'normal');
      }
      if (values.family) {
        variant = this.explicitVariant(values.family, values.weight, values.style);
      } else {
        if (this.node.getProperty('variantForm')) variant = '-tex-variant';
        variant = (CommonWrapper.BOLDVARIANTS[values.weight] || {})[variant] || variant;
        variant = (CommonWrapper.ITALICVARIANTS[values.style] || {})[variant] || variant;
      }
    }
    this.variant = variant;
  }

  /**
   * Set the CSS for a token element having an explicit font (rather than regular mathvariant).
   *
   * @param {string} fontFamily  The font family to use
   * @param {string} fontWeight  The font weight to use
   * @param {string} fontStyle   The font style to use
   */
  protected explicitVariant(fontFamily: string, fontWeight: string, fontStyle: string) {
    let style = this.styles;
    if (!style) style = this.styles = new Styles();
    style.set('fontFamily', fontFamily);
    if (fontWeight) style.set('fontWeight', fontWeight);
    if (fontStyle)  style.set('fontStyle', fontStyle);
    return '-explicitFont';
  }

  /**
   * Determine the scaling factor to use for this wrapped node, and set the styles for it.
   */
  protected getScale() {
    let scale = 1, parent = this.parent;
    let pscale = (parent ? parent.bbox.scale : 1);
    let attributes = this.node.attributes;
    let scriptlevel = Math.min(attributes.get('scriptlevel') as number, 2);
    let fontsize = attributes.get('fontsize');
    let mathsize = (this.node.isToken || this.node.isKind('mstyle') ?
                    attributes.get('mathsize') : attributes.getInherited('mathsize'));
    //
    // If scriptsize is non-zero, set scale based on scriptsizemultiplier
    //
    if (scriptlevel !== 0) {
      scale = Math.pow(attributes.get('scriptsizemultiplier') as number, scriptlevel);
      let scriptminsize = this.length2em(attributes.get('scriptminsize'), .8, 1);
      if (scale < scriptminsize) scale = scriptminsize;
    }
    //
    // If there is style="font-size:...", and not fontsize attribute, use that as fontsize
    //
    if (this.removedStyles && this.removedStyles.fontSize && !fontsize) {
      fontsize = this.removedStyles.fontSize;
    }
    //
    // If there is a fontsize and no mathsize attribute, is that
    //
    if (fontsize && !attributes.getExplicit('mathsize')) {
      mathsize = fontsize;
    }
    //
    //  Incorporate the mathsize, if any
    //
    if (mathsize !== '1') {
      scale *= this.length2em(mathsize, 1, 1);
    }
    //
    // Record the scaling factors and set the element's CSS
    //
    this.bbox.scale = scale;
    this.bbox.rscale = scale / pscale;
  }

  /**
   * Sets the spacing based on TeX or MathML algorithm
   */
  protected getSpace() {
    const isTop = this.isTopEmbellished();
    const hasSpacing = this.node.hasSpacingAttributes();
    if (this.jax.options.mathmlSpacing || hasSpacing) {
      isTop && this.getMathMLSpacing();
    } else {
      this.getTeXSpacing(isTop, hasSpacing);
    }
  }

  /**
   * Get the spacing using MathML rules based on the core MO
   */
  protected getMathMLSpacing() {
    const node = this.node.coreMO() as MmlMo;
    //
    // If the mo is not within a multi-node mrow, don't add space
    //
    const child = node.coreParent();
    const parent = child.parent;
    if (!parent || !parent.isKind('mrow') || parent.childNodes.length === 1) return;
    //
    // Get the lspace and rspace
    //
    const attributes = node.attributes;
    const isScript = (attributes.get('scriptlevel') > 0);
    this.bbox.L = (attributes.isSet('lspace') ?
                   Math.max(0, this.length2em(attributes.get('lspace'))) :
                   MathMLSpace(isScript, node.lspace));
    this.bbox.R = (attributes.isSet('rspace') ?
                   Math.max(0, this.length2em(attributes.get('rspace'))) :
                   MathMLSpace(isScript, node.rspace));
    //
    // If there are two adjacent <mo>, use enough left space to make it
    //   the maximum of the rspace of the first and lspace of the second
    //
    const n = parent.childIndex(child);
    if (n === 0) return;
    const prev = parent.childNodes[n - 1] as AbstractMmlNode;
    if (!prev.isEmbellished) return;
    const bbox = this.jax.nodeMap.get(prev).getBBox();
    if (bbox.R) {
      this.bbox.L = Math.max(0, this.bbox.L - bbox.R);
    }
  }

  /**
   * Get the spacing using the TeX rules
   *
   * @parm {boolean} isTop       True when this is a top-level embellished operator
   * @parm {boolean} hasSpacing  True when there is an explicit or inherited 'form' attribute
   */
  protected getTeXSpacing(isTop: boolean, hasSpacing: boolean) {
    if (!hasSpacing) {
      const space = this.node.texSpacing();
      if (space) {
        this.bbox.L = this.length2em(space);
      }
    }
    if (isTop || hasSpacing) {
      const attributes = this.node.coreMO().attributes;
      if (attributes.isSet('lspace')) {
        this.bbox.L = Math.max(0, this.length2em(attributes.get('lspace')));
      }
      if (attributes.isSet('rspace')) {
        this.bbox.R = Math.max(0, this.length2em(attributes.get('rspace')));
      }
    }
  }

  /**
   * @return {boolean}   True if this is the top-most container of an embellished operator that is
   *                       itself an embellished operator (the maximal embellished operator for its core)
   */
  protected isTopEmbellished(): boolean {
    return (this.node.isEmbellished &&
            !(this.node.parent && this.node.parent.isEmbellished));
  }

  /*******************************************************************/

  /**
   * @return {CommonWrapper}  The wrapper for this node's core node
   */
  public core(): CommonWrapper<J, W, C, CC, DD, FD> {
    return this.jax.nodeMap.get(this.node.core());
  }

  /**
   * @return {CommonWrapper}  The wrapper for this node's core <mo> node
   */
  public coreMO(): CommonWrapper<J, W, C, CC, DD, FD> {
    return this.jax.nodeMap.get(this.node.coreMO());
  }

  /**
   * @return {string}  For a token node, the combined text content of the node's children
   */
  public getText(): string {
    let text = '';
    if (this.node.isToken) {
      for (const child of this.node.childNodes) {
        if (child instanceof TextNode) {
          text += child.getText();
        }
      }
    }
    return text;
  }

  /**
   * @param {DIRECTION} direction  The direction to stretch this node
   * @return {boolean}             Whether the node can stretch in that direction
   */
  public canStretch(direction: DIRECTION): boolean {
    this.stretch = NOSTRETCH as DD;
    if (this.node.isEmbellished) {
      let core = this.core();
      if (core && core.node !== this.node) {
        if (core.canStretch(direction)) {
          this.stretch = core.stretch;
        }
      }
    }
    return this.stretch.dir !== DIRECTION.None;
  }

  /**
   * @return {[string, number]}  The alignment and indentation shift for the expression
   */
  protected getAlignShift(): [string, number] {
    let {indentalign, indentshift, indentalignfirst, indentshiftfirst} =
      this.node.attributes.getList(...indentAttributes) as StringMap;
    if (indentalignfirst !== 'indentalign') {
      indentalign = indentalignfirst;
    }
    if (indentalign === 'auto') {
      indentalign = this.jax.options.displayAlign;
    }
    if (indentshiftfirst !== 'indentshift') {
      indentshift = indentshiftfirst;
    }
    if (indentshift === 'auto') {
      indentshift = this.jax.options.displayIndent;
      if (indentalign === 'right' && !indentshift.match(/^\s*0[a-z]*\s*$/)) {
        indentshift = ('-' + indentshift.trim()).replace(/^--/, '');
      }
    }
    const shift = this.length2em(indentshift, this.metrics.containerWidth);
    return [indentalign, shift] as [string, number];
  }

  /**
   * @param {number} W       The total width
   * @param {BBox} bbox      The bbox to be aligned
   * @param {string} align   How to align (left, center, right)
   * @return {number}        The x position of the aligned width
   */
  protected getAlignX(W: number, bbox: BBox, align: string): number {
    return (align === 'right' ? W - (bbox.w + bbox.R) * bbox.rscale :
            align === 'left' ? bbox.L * bbox.rscale :
            (W - bbox.w * bbox.rscale) / 2);
  }

  /**
   * @param {number} H        The total height
   * @param {number} D        The total depth
   * @param {number} h        The height to be aligned
   * @param {number} d        The depth to be aligned
   * @param {string} align    How to align (top, bottom, center, axis, baseline)
   * @return {number}         The y position of the aligned baseline
   */
  protected getAlignY(H: number, D: number, h: number, d: number, align: string): number {
    return (align === 'top' ? H - h :
            align === 'bottom' ? d - D :
            align === 'center' ? ((H - h) - (D - d)) / 2 :
            0); // baseline and axis
  }

  /**
   * @param {number} i   The index of the child element whose container is needed
   * @return {number}    The inner width as a container (for percentage widths)
   */
  public getWrapWidth(i: number): number {
    return this.childNodes[i].getBBox().w;
  }

  /**
   * @param {number} i   The index of the child element whose container is needed
   * @return {string}    The alignment child element
   */
  public getChildAlign(_i: number): string {
    return 'left';
  }

  /*******************************************************************/
  /*
   * Easy access to some utility routines
   */

  /**
   * @param {number} m  A number to be shown as a percent
   * @return {string}  The number m as a percent
   */
  protected percent(m: number): string {
    return LENGTHS.percent(m);
  }

  /**
   * @param {number} m  A number to be shown in ems
   * @return {string}  The number with units of ems
   */
  protected em(m: number): string {
    return LENGTHS.em(m);
  }

  /**
   * @param {number} m   A number of em's to be shown as pixels
   * @param {number} M   The minimum number of pixels to allow
   * @return {string}  The number with units of px
   */
  protected px(m: number, M: number = -LENGTHS.BIGDIMEN): string {
    return LENGTHS.px(m, M, this.metrics.em);
  }

  /**
   * @param {Property} length  A dimension (giving number and units) or number to be converted to ems
   * @param {number} size  The default size of the dimension (for percentage values)
   * @param {number} scale  The current scaling factor (to handle absolute units)
   * @return {number}  The dimension converted to ems
   */
  protected length2em(length: Property, size: number = 1, scale: number = null): number {
    if (scale === null) {
      scale = this.bbox.scale;
    }
    return LENGTHS.length2em(length as string, size, scale, this.jax.pxPerEm);
  }

  /**
   * @param {string} text   The text to turn into unicode locations
   * @param {string} name   The name of the variant for the characters
   * @return {number[]}     Array of numbers represeting the string's unicode character positions
   */
  protected unicodeChars(text: string, name: string = this.variant): number[] {
    let chars = unicodeChars(text);
    //
    //  Remap to Math Alphanumerics block
    //
    const variant = this.font.getVariant(name);
    if (variant && variant.chars) {
      const map = variant.chars;
      //
      //  Is map[n] doesn't exist, (map[n] || []) still gives an CharData array.
      //  If the array doesn't have a CharOptions element use {} instead.
      //  Then check if the options has an smp property, which gives
      //    the Math Alphabet mapping for this character.
      //  Otherwise use the original code point, n.
      //
      chars = chars.map((n) => ((map[n] || [])[3] || {}).smp || n);
    }
    return chars;
  }

  /**
   * @param {number[]} chars    The array of unicode character numbers to remap
   * @return {number[]}         The converted array
   */
  public remapChars(chars: number[]): number[] {
    return chars;
  }

  /**
   * @param {string} text   The text from which to create a TextNode object
   * @return {TextNode}     The TextNode with the given text
   */
  public mmlText(text: string): TextNode {
    return ((this.node as AbstractMmlNode).factory.create('text') as TextNode).setText(text);
  }

  /**
   * @param {string} kind             The kind of MmlNode to create
   * @param {ProperyList} properties  The properties to set initially
   * @param {MmlNode[]} children      The child nodes to add to the created node
   * @return {MmlNode}                The newly created MmlNode
   */
  public mmlNode(kind: string, properties: PropertyList = {}, children: MmlNode[] = []): MmlNode {
    return (this.node as AbstractMmlNode).factory.create(kind, properties, children);
  }

  /**
   * Create an mo wrapper with the given text,
   *   link it in, and give it the right defaults.
   *
   * @param {string} text     The text for the wrapped element
   * @return {CommonWrapper}  The wrapped MmlMo node
   */
  protected createMo(text: string): CommonWrapper<J, W, C, CC, DD, FD> {
    const mmlFactory = (this.node as AbstractMmlNode).factory;
    const textNode = (mmlFactory.create('text') as TextNode).setText(text);
    const mml = mmlFactory.create('mo', {stretchy: true}, [textNode]);
    mml.inheritAttributesFrom(this.node);
    const node = this.wrap(mml);
    node.parent = this as any as W;
    return node;
  }

  /**
   * @param {string} variant   The variant in which to look for the character
   * @param {number} n         The number of the character to look up
   * @return {CharData}        The full CharData object, with CharOptions guaranteed to be defined
   */
  protected getVariantChar(variant: string, n: number): CharData<CC> {
    const char = this.font.getChar(variant, n) || [0, 0, 0, {unknown: true} as CC];
    if (char.length === 3) {
      (char as any)[3] = {};
    }
    return char as [number, number, number, CC];
  }

}
