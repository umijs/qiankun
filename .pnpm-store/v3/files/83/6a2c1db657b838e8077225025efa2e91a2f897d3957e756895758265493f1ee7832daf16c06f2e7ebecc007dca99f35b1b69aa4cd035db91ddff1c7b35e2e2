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
 * @fileoverview  Implements the SVG OutputJax object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CommonOutputJax, UnknownBBox} from './common/OutputJax.js';
import {OptionList} from '../util/Options.js';
import {MathDocument} from '../core/MathDocument.js';
import {MathItem} from '../core/MathItem.js';
import {MmlNode} from '../core/MmlTree/MmlNode.js';
import {SVGWrapper} from './svg/Wrapper.js';
import {SVGWrapperFactory} from './svg/WrapperFactory.js';
import {SVGFontData} from './svg/FontData.js';
import {TeXFont} from './svg/fonts/tex.js';
import {StyleList as CssStyleList} from '../util/StyleList.js';
import {FontCache} from './svg/FontCache.js';
import {unicodeChars} from '../util/string.js';
import {percent} from '../util/lengths.js';

export const SVGNS = 'http://www.w3.org/2000/svg';
export const XLINKNS = 'http://www.w3.org/1999/xlink';

/*****************************************************************/
/**
 *  Implements the CHTML class (extends AbstractOutputJax)
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class SVG<N, T, D> extends
CommonOutputJax<N, T, D, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGFontData, typeof SVGFontData> {

  /**
   * The name of the output jax
   */
  public static NAME: string = 'SVG';

  /**
   * @override
   */
  public static OPTIONS: OptionList = {
    ...CommonOutputJax.OPTIONS,
    internalSpeechTitles: true,     // insert <title> tags with speech content
    titleID: 0,                     // initial id number to use for aria-labeledby titles
    fontCache: 'local',             // or 'global' or 'none'
    localID: null,                  // ID to use for local font cache (for single equation processing)
  };

  /**
   *  The default styles for SVG
   */
  public static commonStyles: CssStyleList = {
    'mjx-container[jax="SVG"]': {
      direction: 'ltr'
    },
    'mjx-container[jax="SVG"] > svg': {
      overflow: 'visible',
      'min-height': '1px',
      'min-width': '1px'
    },
    'mjx-container[jax="SVG"] > svg a': {
      fill: 'blue', stroke: 'blue'
    }
  };

  /**
   * The ID for the SVG element that stores the cached font paths
   */
  public static FONTCACHEID = 'MJX-SVG-global-cache';

  /**
   * The ID for the stylesheet element for the styles for the SVG output
   */
  public static STYLESHEETID = 'MJX-SVG-styles';

  /**
   * Stores the CHTMLWrapper factory
   */
  public factory: SVGWrapperFactory<N, T, D>;

  /**
   * Stores the information about the cached character glyphs
   */
  public fontCache: FontCache<N, T, D>;

  /**
   * Minimum width for tables with labels,
   */
  public minwidth: number = 0;
  /**
   * The shift for the main equation
   */
  public shift: number = 0;

  /**
   * The container element for the math
   */
  public container: N = null;

  /**
   * The SVG stylesheet, once it is constructed
   */
  public svgStyles: N = null;

  /**
   * @override
   * @constructor
   */
  constructor(options: OptionList = null) {
    super(options, SVGWrapperFactory as any, TeXFont);
    this.fontCache = new FontCache(this);
  }

  /**
   * @override
   */
  public initialize() {
    if (this.options.fontCache === 'global') {
      this.fontCache.clearCache();
    }
  }

  /**
   * Clear the font cache (use for resetting the global font cache)
   */
  public clearFontCache() {
    this.fontCache.clearCache();
  }

  /**
   * @override
   */
  public reset() {
    this.clearFontCache();
  }

  /**
   * @override
   */
  protected setScale(node: N) {
    if (this.options.scale !== 1) {
      this.adaptor.setStyle(node, 'fontSize', percent(this.options.scale));
    }
  }

  /**
   * @override
   */
  public escaped(math: MathItem<N, T, D>, html: MathDocument<N, T, D>) {
    this.setDocument(html);
    return this.html('span', {}, [this.text(math.math)]);
  }

  /**
   * @override
   */
  public styleSheet(html: MathDocument<N, T, D>) {
    if (this.svgStyles) {
      return this.svgStyles;  // stylesheet is already added to the document
    }
    const sheet = this.svgStyles = super.styleSheet(html);
    this.adaptor.setAttribute(sheet, 'id', SVG.STYLESHEETID);
    return sheet;
  }

  /**
   * @override
   */
  public pageElements(html: MathDocument<N, T, D>) {
    if (this.options.fontCache === 'global' && !this.findCache(html)) {
      return this.svg('svg', {id: SVG.FONTCACHEID, style: {display: 'none'}}, [this.fontCache.getCache()]);
    }
    return null as N;
  }

  /**
   * Checks if there is already a font-cache element in the page
   *
   * @param {MathDocument} html   The document to search
   * @return {boolean}            True if a font cache already exists in the page
   */
  protected findCache(html: MathDocument<N, T, D>): boolean {
    const adaptor = this.adaptor;
    const svgs = adaptor.tags(adaptor.body(html.document), 'svg');
    for (let i = svgs.length - 1; i >= 0; i--) {
      if (this.adaptor.getAttribute(svgs[i], 'id') === SVG.FONTCACHEID) {
        return true;
      }
    }
    return false;
  }

  /**
   * @param {MmlNode} math  The MML node whose SVG is to be produced
   * @param {N} parent      The HTML node to contain the SVG
   */
  protected processMath(math: MmlNode, parent: N) {
    //
    // Cache the container (tooltips process into separate containers)
    //
    const container = this.container;
    this.container = parent;
    //
    //  Get the wrapped math element and the SVG container
    //  Then typeset the math into the SVG
    //
    const wrapper = this.factory.wrap(math);
    const [svg, g] = this.createRoot(wrapper);
    this.typesetSVG(wrapper, svg, g);
    //
    //  Put back the original container
    //
    this.container = container;
  }

  /**
   * @param {SVGWrapper} wrapper   The wrapped math to process
   * @return {[N, N]}              The svg and g nodes for the math
   */
  protected createRoot(wrapper: SVGWrapper<N, T, D>): [N, N] {
    const {w, h, d, pwidth} = wrapper.getOuterBBox();
    const px = wrapper.metrics.em / 1000;
    const W = Math.max(w, px); // make sure we are at least one px wide (needed for e.g. \llap)
    const H = Math.max(h + d, px); // make sure we are at least one px tall (needed for e.g., \smash)
    //
    //  The container that flips the y-axis and sets the colors to inherit from the surroundings
    //
    const g = this.svg('g', {
      stroke: 'currentColor', fill: 'currentColor',
      'stroke-width': 0, transform: 'scale(1,-1)'
    }) as N;
    //
    //  The svg element with its viewBox, size and alignment
    //
    const adaptor = this.adaptor;
    const svg = adaptor.append(this.container, this.svg('svg', {
      xmlns: SVGNS,
      width: this.ex(W), height: this.ex(H),
      role: 'img', focusable: false,
      style: {'vertical-align': this.ex(-d)},
      viewBox: [0, this.fixed(-h * 1000, 1), this.fixed(W * 1000, 1), this.fixed(H * 1000, 1)].join(' ')
    }, [g])) as N;
    if (W === .001) {
      adaptor.setAttribute(svg, 'preserveAspectRatio', 'xMidYMid slice');
      if (w < 0) {
        adaptor.setStyle(this.container, 'margin-right', this.ex(w));
      }
    }
    if (pwidth) {
      //
      // Use width 100% with no viewbox, and instead scale and translate to achieve the same result
      //
      adaptor.setStyle(svg, 'min-width', this.ex(W));
      adaptor.setAttribute(svg, 'width', pwidth);
      adaptor.removeAttribute(svg, 'viewBox');
      const scale = this.fixed(wrapper.metrics.ex / (this.font.params.x_height * 1000), 6);
      adaptor.setAttribute(g, 'transform', `scale(${scale},-${scale}) translate(0, ${this.fixed(-h * 1000, 1)})`);
    }
    if (this.options.fontCache !== 'none') {
      adaptor.setAttribute(svg, 'xmlns:xlink', XLINKNS);
    }
    return [svg, g];
  }

  /**
   * Typeset the math and add minwidth (from mtables), or set the alignment and indentation
   * of the finalized expression.
   *
   * @param {SVGWrapper} wrapper   The wrapped math to typeset
   * @param {N} svg                The main svg element for the typeet math
   * @param {N} g                  The group in which the math is typeset
   */
  protected typesetSVG(wrapper: SVGWrapper<N, T, D>, svg: N, g: N) {
    const adaptor = this.adaptor;
    //
    //  Typeset the math and add minWidth (from mtables), or set the alignment and indentation
    //    of the finalized expression
    //
    this.minwidth = this.shift = 0;
    if (this.options.fontCache === 'local') {
      this.fontCache.clearCache();
      this.fontCache.useLocalID(this.options.localID);
      adaptor.insert(this.fontCache.getCache(), g);
    }
    wrapper.toSVG(g);
    this.fontCache.clearLocalID();
    if (this.minwidth) {
      adaptor.setStyle(svg, 'minWidth', this.ex(this.minwidth));
      adaptor.setStyle(this.container, 'minWidth', this.ex(this.minwidth));
    } else if (this.shift) {
      const align = adaptor.getAttribute(this.container, 'justify') || 'center';
      this.setIndent(svg, align, this.shift);
    }
  }

  /**
   * @param {N} svg         The svg node whose indentation is to be adjusted
   * @param {string} align  The alignment for the node
   * @param {number} shift  The indent (positive or negative) for the node
   */
  protected setIndent(svg: N, align: string, shift: number) {
    if (align === 'center' || align === 'left') {
      this.adaptor.setStyle(svg, 'margin-left', this.ex(shift));
    }
    if (align === 'center' || align === 'right') {
      this.adaptor.setStyle(svg, 'margin-right', this.ex(-shift));
    }
  }

  /**
   * @param {number} m  A number to be shown in ex
   * @return {string}   The number with units of ex
   */
  public ex(m: number): string {
    m /= this.font.params.x_height;
    return (Math.abs(m) < .001 ? '0' : m.toFixed(3).replace(/\.?0+$/, '') + 'ex');
  }

  /**
   * @param {string} kind             The kind of node to create
   * @param {OptionList} properties   The properties to set for the element
   * @param {(N|T)[]} children            The child nodes for this node
   * @return {N}                      The newly created node in the SVG namespace
   */
  public svg(kind: string, properties: OptionList = {}, children: (N | T)[] = []): N {
    return this.html(kind, properties, children, SVGNS);
  }

  /**
   * @param {string} text      The text to be displayed
   * @param {string} variant   The name of the variant for the text
   * @return {N}               The text element containing the text
   */
  public unknownText(text: string, variant: string): N {
    const metrics = this.math.metrics;
    const scale = this.font.params.x_height / metrics.ex * metrics.em * 1000;
    const svg = this.svg('text', {
      'data-variant': variant,
      transform: 'scale(1,-1)', 'font-size': this.fixed(scale, 1) + 'px'
    }, [this.text(text)]);
    const adaptor = this.adaptor;
    if (variant !== '-explicitFont') {
      const c = unicodeChars(text);
      if (c.length !== 1 || c[0] < 0x1D400 || c[0] > 0x1D7FF) {
        const [family, italic, bold] = this.font.getCssFont(variant);
        adaptor.setAttribute(svg, 'font-family', family);
        if (italic) {
          adaptor.setAttribute(svg, 'font-style', 'italic');
        }
        if (bold) {
          adaptor.setAttribute(svg, 'font-weight', 'bold');
        }
      }
    }
    return svg;
  }

  /**
   * Measure the width of a text element by placing it in the page
   *  and looking up its size (fake the height and depth, since we can't measure that)
   *
   * @param {N} text         The text element to measure
   * @return {Object}        The width, height and depth for the text
   */
  public measureTextNode(text: N): UnknownBBox {
    const adaptor = this.adaptor;
    text = adaptor.clone(text);
    adaptor.removeAttribute(text, 'transform');
    const ex = this.fixed(this.font.params.x_height * 1000, 1);
    const svg = this.svg('svg', {
      position: 'absolute', visibility: 'hidden',
      width: '1ex', height: '1ex',
      viewBox: [0, 0, ex, ex].join(' ')
    }, [text]);
    adaptor.append(adaptor.body(adaptor.document), svg);
    let w = adaptor.nodeSize(text, 1000, true)[0];
    adaptor.remove(svg);
    return {w: w, h: .75, d: .2};
  }

}
