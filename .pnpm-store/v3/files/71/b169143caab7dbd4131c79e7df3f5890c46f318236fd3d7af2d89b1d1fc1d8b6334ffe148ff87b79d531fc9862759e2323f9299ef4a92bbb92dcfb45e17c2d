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
 * @fileoverview  Implements the CHTML OutputJax object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CommonOutputJax} from './common/OutputJax.js';
import {CommonWrapper} from './common/Wrapper.js';
import {StyleList} from '../util/Styles.js';
import {StyleList as CssStyleList, CssStyles} from '../util/StyleList.js';
import {OptionList} from '../util/Options.js';
import {MathDocument} from '../core/MathDocument.js';
import {MathItem} from '../core/MathItem.js';
import {MmlNode} from '../core/MmlTree/MmlNode.js';
import {CHTMLWrapper} from './chtml/Wrapper.js';
import {CHTMLWrapperFactory} from './chtml/WrapperFactory.js';
import {CHTMLFontData} from './chtml/FontData.js';
import {Usage} from './chtml/Usage.js';
import {TeXFont} from './chtml/fonts/tex.js';
import * as LENGTHS from '../util/lengths.js';
import {unicodeChars} from '../util/string.js';


/*****************************************************************/
/**
 *  Implements the CHTML class (extends AbstractOutputJax)
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTML<N, T, D> extends
CommonOutputJax<N, T, D, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLFontData, typeof CHTMLFontData> {

  /**
   * The name of this output jax
   */
  public static NAME: string = 'CHTML';

  /**
   * @override
   */
  public static OPTIONS: OptionList = {
    ...CommonOutputJax.OPTIONS,
    adaptiveCSS: true,            // true means only produce CSS that is used in the processed equations
    matchFontHeight: true,        // true to match ex-height of surrounding font
  };

  /**
   *  The default styles for CommonHTML
   */
  public static commonStyles: CssStyleList = {
    'mjx-container[jax="CHTML"]': {'line-height': 0},

    'mjx-container [space="1"]': {'margin-left': '.111em'},
    'mjx-container [space="2"]': {'margin-left': '.167em'},
    'mjx-container [space="3"]': {'margin-left': '.222em'},
    'mjx-container [space="4"]': {'margin-left': '.278em'},
    'mjx-container [space="5"]': {'margin-left': '.333em'},

    'mjx-container [rspace="1"]': {'margin-right': '.111em'},
    'mjx-container [rspace="2"]': {'margin-right': '.167em'},
    'mjx-container [rspace="3"]': {'margin-right': '.222em'},
    'mjx-container [rspace="4"]': {'margin-right': '.278em'},
    'mjx-container [rspace="5"]': {'margin-right': '.333em'},

    'mjx-container [size="s"]' : {'font-size': '70.7%'},
    'mjx-container [size="ss"]': {'font-size': '50%'},
    'mjx-container [size="Tn"]': {'font-size': '60%'},
    'mjx-container [size="sm"]': {'font-size': '85%'},
    'mjx-container [size="lg"]': {'font-size': '120%'},
    'mjx-container [size="Lg"]': {'font-size': '144%'},
    'mjx-container [size="LG"]': {'font-size': '173%'},
    'mjx-container [size="hg"]': {'font-size': '207%'},
    'mjx-container [size="HG"]': {'font-size': '249%'},

    'mjx-container [width="full"]': {width: '100%'},

    'mjx-box': {display: 'inline-block'},
    'mjx-block': {display: 'block'},
    'mjx-itable': {display: 'inline-table'},
    'mjx-row': {display: 'table-row'},
    'mjx-row > *': {display: 'table-cell'},

    //
    //  These don't have Wrapper subclasses, so add their styles here
    //
    'mjx-mtext': {
      display: 'inline-block'
    },
    'mjx-mstyle': {
      display: 'inline-block'
    },
    'mjx-merror': {
      display: 'inline-block',
      color: 'red',
      'background-color': 'yellow'
    },
    'mjx-mphantom': {
      visibility: 'hidden'
    },

    //
    //  WebKit-specific CSS to handle bug with clipped characters.
    //  (test found at https://browserstrangeness.bitbucket.io/css_hacks.html#safari)
    //
    '_::-webkit-full-page-media, _:future, :root mjx-container': {
      'will-change': 'opacity'
    }
  };

  /**
   * The ID for the stylesheet element for the styles for the SVG output
   */
  public static STYLESHEETID = 'MJX-CHTML-styles';

  /**
   *  Used to store the CHTMLWrapper factory.
   */
  public factory: CHTMLWrapperFactory<N, T, D>;

  /**
   * The usage information for the wrapper classes
   */
  public wrapperUsage: Usage<string>;

  /**
   * The CHTML stylesheet, once it is constructed
   */
  public chtmlStyles: N = null;

  /**
   * @override
   * @constructor
   */
  constructor(options: OptionList = null) {
    super(options, CHTMLWrapperFactory as any, TeXFont);
    this.font.adaptiveCSS(this.options.adaptiveCSS);
    this.wrapperUsage = new Usage<string>();
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
    if (this.chtmlStyles) {
      if (this.options.adaptiveCSS) {
        //
        // Update the style sheet rules
        //
        const styles = new CssStyles();
        this.addWrapperStyles(styles);
        this.updateFontStyles(styles);
        this.adaptor.insertRules(this.chtmlStyles, styles.getStyleRules());
      }
      return this.chtmlStyles;  // stylesheet is already added to the document
    }
    const sheet = this.chtmlStyles = super.styleSheet(html);
    this.adaptor.setAttribute(sheet, 'id', CHTML.STYLESHEETID);
    this.wrapperUsage.update();
    return sheet;
  }

  /**
   * @param {CssStyles} styles   The styles to update with newly used character styles
   */
  protected updateFontStyles(styles: CssStyles) {
    styles.addStyles(this.font.updateStyles({}));
  }

  /**
   * @override
   */
  protected addWrapperStyles(styles: CssStyles) {
    if (!this.options.adaptiveCSS) {
      super.addWrapperStyles(styles);
      return;
    }
    for (const kind of this.wrapperUsage.update()) {
      const wrapper = this.factory.getNodeClass(kind) as any as typeof CommonWrapper;
      wrapper && this.addClassStyles(wrapper, styles);
    }
  }

  /**
   * @override
   */
  protected addClassStyles(wrapper: typeof CommonWrapper, styles: CssStyles) {
    const CLASS = wrapper as typeof CHTMLWrapper;
    if (CLASS.autoStyle && CLASS.kind !== 'unknown') {
      styles.addStyles({
        ['mjx-' + CLASS.kind]: {
          display: 'inline-block',
          'text-align': 'left'
        }
      });
    }
    this.wrapperUsage.add(CLASS.kind);
    super.addClassStyles(wrapper, styles);
  }

  /**
   * @param {MmlNode} math  The MML node whose HTML is to be produced
   * @param {N} parent      The HTML node to contain the HTML
   */
  protected processMath(math: MmlNode, parent: N) {
    this.factory.wrap(math).toCHTML(parent);
  }

  /**
   * Clear the cache of which items need their styles to be output
   */
  public clearCache() {
    this.cssStyles.clear();
    this.font.clearCache();
    this.wrapperUsage.clear();
    this.chtmlStyles = null;
  }

  /**
   * @override
   */
  public reset() {
    this.clearCache();
  }

  /*****************************************************************/

  /**
   * @override
   */
  public unknownText(text: string, variant: string, width: number = null) {
    const styles: StyleList = {};
    const scale = 100 / this.math.metrics.scale;
    if (scale !== 100) {
      styles['font-size'] = this.fixed(scale, 1) + '%';
      styles.padding = LENGTHS.em(75 / scale) + ' 0 ' + LENGTHS.em(20 / scale) + ' 0';
    }
    if (variant !== '-explicitFont') {
      const c = unicodeChars(text);
      if (c.length !== 1 || c[0] < 0x1D400 || c[0] > 0x1D7FF) {
        this.cssFontStyles(this.font.getCssFont(variant), styles);
      }
    }
    //
    // Work around Safari bug with the MJXZERO font by forcing the width.
    //   (If MJXZERO can be made to work with Safari, then remove width parameter
    //    and call to getBBox().w in TextNode.ts)
    //
    if (width !== null) {
      const metrics = this.math.metrics;
      styles.width = Math.round(width * metrics.em * metrics.scale) + 'px';
    }
    //
    return this.html('mjx-utext', {variant: variant, style: styles}, [this.text(text)]);
  }

  /**
   * Measure the width of a text element by placing it in the page
   *  and looking up its size (fake the height and depth, since we can't measure that)
   *
   * @override
   */

  public measureTextNode(textNode: N) {
    const adaptor = this.adaptor;
    const text = adaptor.clone(textNode);
    //
    // Work arround Safari bug with the MJXZERO font.
    //
    adaptor.setStyle(text, 'font-family', adaptor.getStyle(text, 'font-family').replace(/MJXZERO, /g, ''));
    //
    const style = {position: 'absolute', 'white-space': 'nowrap'};
    const node = this.html('mjx-measure-text', {style}, [text]);
    adaptor.append(adaptor.parent(this.math.start.node), this.container);
    adaptor.append(this.container, node);
    let w = adaptor.nodeSize(text, this.math.metrics.em)[0] / this.math.metrics.scale;
    adaptor.remove(this.container);
    adaptor.remove(node);
    return {w: w, h: .75, d: .2};
  }

}
