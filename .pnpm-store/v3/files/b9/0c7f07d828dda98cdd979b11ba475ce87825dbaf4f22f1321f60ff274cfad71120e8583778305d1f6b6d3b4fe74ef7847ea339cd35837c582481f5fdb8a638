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
 * @fileoverview  Implements the CHTMLmenclose wrapper for the MmlMenclose object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper, CHTMLConstructor} from '../Wrapper.js';
import {CommonMencloseMixin} from '../../common/Wrappers/menclose.js';
import {CHTMLmsqrt} from './msqrt.js';
import * as Notation from '../Notation.js';
import {MmlMenclose} from '../../../core/MmlTree/MmlNodes/menclose.js';
import {OptionList} from '../../../util/Options.js';
import {StyleList} from '../../../util/StyleList.js';
import {em} from '../../../util/lengths.js';

/*****************************************************************/

/**
 *  The skew angle needed for the arrow head pieces
 */
function Angle(x: number, y: number) {
  return Math.atan2(x, y).toFixed(3).replace(/\.?0+$/, '');
}

const ANGLE = Angle(Notation.ARROWDX, Notation.ARROWY);

/*****************************************************************/
/**
 * The CHTMLmenclose wrapper for the MmlMenclose object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
// @ts-ignore
export class CHTMLmenclose<N, T, D> extends
CommonMencloseMixin<
  CHTMLWrapper<any, any, any>,
  CHTMLmsqrt<any, any, any>,
  any,
  CHTMLConstructor<any, any, any>
>(CHTMLWrapper) {

  /**
   * The menclose wrapper
   */
  public static kind = MmlMenclose.prototype.kind;

  /**
   * Styles needed for the various notations
   */
  public static styles: StyleList = {
    'mjx-menclose': {
      position: 'relative'
    },
    'mjx-menclose > mjx-dstrike': {
      display: 'inline-block',
      left: 0, top: 0,
      position: 'absolute',
      'border-top': Notation.SOLID,
      'transform-origin': 'top left'
    },
    'mjx-menclose > mjx-ustrike': {
      display: 'inline-block',
      left: 0, bottom: 0,
      position: 'absolute',
      'border-top': Notation.SOLID,
      'transform-origin': 'bottom left'
    },
    'mjx-menclose > mjx-hstrike': {
      'border-top': Notation.SOLID,
      position: 'absolute',
      left: 0, right: 0, bottom: '50%',
      transform: 'translateY(' + em(Notation.THICKNESS / 2) + ')'
    },
    'mjx-menclose > mjx-vstrike': {
      'border-left': Notation.SOLID,
      position: 'absolute',
      top: 0, bottom: 0, right: '50%',
      transform: 'translateX(' + em(Notation.THICKNESS / 2) + ')'
    },
    'mjx-menclose > mjx-rbox': {
      position: 'absolute',
      top: 0, bottom: 0, right: 0, left: 0,
      'border': Notation.SOLID,
      'border-radius': em(Notation.THICKNESS + Notation.PADDING)
    },
    'mjx-menclose > mjx-cbox': {
      position: 'absolute',
      top: 0, bottom: 0, right: 0, left: 0,
      'border': Notation.SOLID,
      'border-radius': '50%'
    },
    'mjx-menclose > mjx-arrow': {
      position: 'absolute',
      left: 0, bottom: '50%', height: 0, width: 0
    },
    'mjx-menclose > mjx-arrow > *': {
      display: 'block',
      position: 'absolute',
      'transform-origin': 'bottom',
      'border-left': em(Notation.THICKNESS * Notation.ARROWX) + ' solid',
      'border-right': 0,
      'box-sizing': 'border-box'
    },
    'mjx-menclose > mjx-arrow > mjx-aline': {
      left: 0, top: em(-Notation.THICKNESS / 2),
      right: em(Notation.THICKNESS * (Notation.ARROWX - 1)), height: 0,
      'border-top': em(Notation.THICKNESS) + ' solid',
      'border-left': 0
    },
    'mjx-menclose > mjx-arrow[double] > mjx-aline': {
      left: em(Notation.THICKNESS * (Notation.ARROWX - 1)), height: 0,
    },
    'mjx-menclose > mjx-arrow > mjx-rthead': {
      transform: 'skewX(' + ANGLE + 'rad)',
      right: 0, bottom: '-1px',
      'border-bottom': '1px solid transparent',
      'border-top': em(Notation.THICKNESS * Notation.ARROWY) + ' solid transparent'
    },
    'mjx-menclose > mjx-arrow > mjx-rbhead': {
      transform: 'skewX(-' + ANGLE + 'rad)',
      'transform-origin': 'top',
      right: 0, top: '-1px',
      'border-top': '1px solid transparent',
      'border-bottom': em(Notation.THICKNESS * Notation.ARROWY) + ' solid transparent'
    },
    'mjx-menclose > mjx-arrow > mjx-lthead': {
      transform: 'skewX(-' + ANGLE + 'rad)',
      left: 0, bottom: '-1px',
      'border-left': 0,
      'border-right': em(Notation.THICKNESS * Notation.ARROWX) + ' solid',
      'border-bottom': '1px solid transparent',
      'border-top': em(Notation.THICKNESS * Notation.ARROWY) + ' solid transparent'
    },
    'mjx-menclose > mjx-arrow > mjx-lbhead': {
      transform: 'skewX(' + ANGLE + 'rad)',
      'transform-origin': 'top',
      left: 0, top: '-1px',
      'border-left': 0,
      'border-right': em(Notation.THICKNESS * Notation.ARROWX) + ' solid',
      'border-top': '1px solid transparent',
      'border-bottom': em(Notation.THICKNESS * Notation.ARROWY) + ' solid transparent'
    },
    'mjx-menclose > dbox': {
      position: 'absolute',
      top: 0, bottom: 0, left: em(-1.5 * Notation.PADDING),
      width: em(3 * Notation.PADDING),
      border: em(Notation.THICKNESS) + ' solid',
      'border-radius': '50%',
      'clip-path': 'inset(0 0 0 ' + em(1.5 * Notation.PADDING) + ')',
      'box-sizing': 'border-box'
    }
  };

  /**
   *  The definitions of the various notations
   */
  public static notations: Notation.DefList<CHTMLmenclose<any, any, any>, any> = new Map([

    Notation.Border('top'),
    Notation.Border('right'),
    Notation.Border('bottom'),
    Notation.Border('left'),

    Notation.Border2('actuarial', 'top', 'right'),
    Notation.Border2('madruwb', 'bottom', 'right'),

    Notation.DiagonalStrike('up', 1),
    Notation.DiagonalStrike('down', -1),

    ['horizontalstrike', {
      renderer: Notation.RenderElement('hstrike', 'Y'),
      bbox: (node) => [0, node.padding, 0, node.padding]
    }],

    ['verticalstrike', {
      renderer: Notation.RenderElement('vstrike', 'X'),
      bbox: (node) => [node.padding, 0, node.padding, 0]
    }],

    ['box', {
      renderer: (node, child) => {
        node.adaptor.setStyle(child, 'border', node.em(node.thickness) + ' solid');
      },
      bbox: Notation.fullBBox,
      border: Notation.fullBorder,
      remove: 'left right top bottom'
    }],

    ['roundedbox', {
      renderer: Notation.RenderElement('rbox'),
      bbox: Notation.fullBBox
    }],

    ['circle', {
      renderer: Notation.RenderElement('cbox'),
      bbox: Notation.fullBBox
    }],

    ['phasorangle', {
      //
      // Use a bottom border and an upward strike properly angled
      //
      renderer: (node, child) => {
        const {h, d} = node.getBBox();
        const [a, W] = node.getArgMod(1.75 * node.padding, h + d);
        const t = node.thickness * Math.sin(a) * .9;
        node.adaptor.setStyle(child, 'border-bottom', node.em(node.thickness) + ' solid');
        const strike = node.adjustBorder(node.html('mjx-ustrike', {style: {
          width: node.em(W),
          transform: 'translateX(' + node.em(t) + ') rotate(' + node.fixed(-a) + 'rad)',
        }}));
        node.adaptor.append(node.chtml, strike);
      },
      bbox: (node) => {
        const p = node.padding / 2;
        const t = node.thickness;
        return [2 * p, p, p + t, 3 * p + t];
      },
      border: (node) => [0, 0, node.thickness, 0],
      remove: 'bottom'
    }],

    Notation.Arrow('up'),
    Notation.Arrow('down'),
    Notation.Arrow('left'),
    Notation.Arrow('right'),

    Notation.Arrow('updown'),
    Notation.Arrow('leftright'),

    Notation.DiagonalArrow('updiagonal'),  // backward compatibility
    Notation.DiagonalArrow('northeast'),
    Notation.DiagonalArrow('southeast'),
    Notation.DiagonalArrow('northwest'),
    Notation.DiagonalArrow('southwest'),

    Notation.DiagonalArrow('northeastsouthwest'),
    Notation.DiagonalArrow('northwestsoutheast'),

    ['longdiv', {
      //
      // Use a line along the top followed by a half ellipse at the left
      //
      renderer: (node, child) => {
        const adaptor = node.adaptor;
        adaptor.setStyle(child, 'border-top', node.em(node.thickness) + ' solid');
        const arc = adaptor.append(node.chtml, node.html('dbox'));
        const t = node.thickness;
        const p = node.padding;
        if (t !== Notation.THICKNESS) {
          adaptor.setStyle(arc, 'border-width', node.em(t));
        }
        if (p !== Notation.PADDING) {
          adaptor.setStyle(arc, 'left', node.em(-1.5 * p));
          adaptor.setStyle(arc, 'width', node.em(3 * p));
          adaptor.setStyle(arc, 'clip-path', 'inset(0 0 0 ' + node.em(1.5 * p) + ')');
        }
      },
      bbox: (node) => {
        const p = node.padding;
        const t = node.thickness;
        return [p + t, p, p, 2 * p + t / 2];
      }
    }],

    ['radical', {
      //
      //  Use the msqrt rendering, but remove the extra space due to the radical
      //    (it is added in at the end, so other notations overlap the root)
      //
      renderer: (node, child) => {
        node.msqrt.toCHTML(child);
        const TRBL = node.sqrtTRBL();
        node.adaptor.setStyle(node.msqrt.chtml, 'margin', TRBL.map(x => node.em(-x)).join(' '));
      },
      //
      //  Create the needed msqrt wrapper
      //
      init: (node) => {
        node.msqrt = node.createMsqrt(node.childNodes[0]);
      },
      //
      //  Add back in the padding for the square root
      //
      bbox: (node) => node.sqrtTRBL(),
      //
      //  This notation replaces the child
      //
      renderChild: true
    }]

  ] as Notation.DefPair<CHTMLmenclose<any, any, any>, any>[]);

  /********************************************************/

  /**
   * @override
   */
  public toCHTML(parent: N) {
    const adaptor = this.adaptor;
    const chtml = this.standardCHTMLnode(parent);
    //
    //  Create a box for the child (that can have padding and borders added by the notations)
    //    and add the child HTML into it
    //
    const block = adaptor.append(chtml, this.html('mjx-box')) as N;
    if (this.renderChild) {
      this.renderChild(this, block);
    } else {
      this.childNodes[0].toCHTML(block);
    }
    //
    //  Render all the notations for this menclose element
    //
    for (const name of Object.keys(this.notations)) {
      const notation = this.notations[name];
      !notation.renderChild && notation.renderer(this, block);
    }
    //
    //  Add the needed padding, if any
    //
    const pbox = this.getPadding();
    for (const name of Notation.sideNames) {
      const i = Notation.sideIndex[name];
      pbox[i] > 0 && adaptor.setStyle(block, 'padding-' + name, this.em(pbox[i]));
    }
  }

  /********************************************************/

  /**
   * Create an arrow using HTML elements
   *
   * @param {number} w        The length of the arrow
   * @param {number} a        The angle for the arrow
   * @param {boolean} double  True if this is a double-headed arrow
   * @param {string} offset   'X' for vertical arrow, 'Y' for horizontal
   * @param {number} dist     Distance to translate in the offset direction
   * @return {N}              The newly created arrow
   */
  public arrow(w: number, a: number, double: boolean, offset: string = '', dist: number = 0): N {
    const W = this.getBBox().w;
    const style = {width: this.em(w)} as OptionList;
    if (W !== w) {
      style.left = this.em((W - w) / 2);
    }
    if (a) {
      style.transform = 'rotate(' + this.fixed(a) + 'rad)';
    }
    const arrow = this.html('mjx-arrow', {style: style}, [
      this.html('mjx-aline'), this.html('mjx-rthead'), this.html('mjx-rbhead')
    ]);
    if (double) {
      this.adaptor.append(arrow, this.html('mjx-lthead'));
      this.adaptor.append(arrow, this.html('mjx-lbhead'));
      this.adaptor.setAttribute(arrow, 'double', 'true');
    }
    this.adjustArrow(arrow, double);
    this.moveArrow(arrow, offset, dist);
    return arrow;
  }

  /**
   * @param {N} arrow          The arrow whose thickness and arrow head is to be adjusted
   * @param {boolean} double   True if the arrow is double-headed
   */
  protected adjustArrow(arrow: N, double: boolean) {
    const t = this.thickness;
    const head = this.arrowhead;
    if (head.x === Notation.ARROWX && head.y === Notation.ARROWY &&
        head.dx === Notation.ARROWDX && t === Notation.THICKNESS) return;
    const [x, y] = [t * head.x, t * head.y].map(x => this.em(x));
    const a = Angle(head.dx, head.y);
    const [line, rthead, rbhead, lthead, lbhead] = this.adaptor.childNodes(arrow);
    this.adjustHead(rthead, [y, '0', '1px', x], a);
    this.adjustHead(rbhead, ['1px', '0', y, x], '-' + a);
    this.adjustHead(lthead, [y, x, '1px', '0'], '-' + a);
    this.adjustHead(lbhead, ['1px', x, y, '0'], a);
    this.adjustLine(line, t, head.x, double);
  }

  /**
   * @param {N} head            The piece of arrow head to be adjusted
   * @param {string[]} border   The border sizes [T, R, B, L]
   * @param {string} a          The skew angle for the piece
   */
  protected adjustHead(head: N, border: string[], a: string) {
    if (head) {
      this.adaptor.setStyle(head, 'border-width', border.join(' '));
      this.adaptor.setStyle(head, 'transform', 'skewX(' + a + 'rad)');
    }
  }

  /**
   * @param {N} line           The arrow shaft to be adjusted
   * @param {number} t         The arrow shaft thickness
   * @param {number} x         The arrow head x size
   * @param {boolean} double   True if the arrow is double-headed
   */
  protected adjustLine(line: N, t: number, x: number, double: boolean) {
    this.adaptor.setStyle(line, 'borderTop', this.em(t) + ' solid');
    this.adaptor.setStyle(line, 'top', this.em(-t / 2));
    this.adaptor.setStyle(line, 'right', this.em(t * (x - 1)));
    if (double) {
      this.adaptor.setStyle(line, 'left', this.em(t * (x - 1)));
    }
  }

  /**
   * @param {N} arrow        The arrow whose position is to be adjusted
   * @param {string} offset  The direction to move the arrow
   * @param {number} d       The distance to translate in that direction
   */
  protected moveArrow(arrow: N, offset: string, d: number) {
    if (!d) return;
    const transform = this.adaptor.getStyle(arrow, 'transform');
    this.adaptor.setStyle(
      arrow, 'transform', `translate${offset}(${this.em(-d)})${(transform ? ' ' + transform : '')}`
    );
  }

  /********************************************************/

  /**
   * @param {N} node   The HTML element whose border width must be
   *                   adjusted if the thickness isn't the default
   * @return {N}       The adjusted element
   */
  public adjustBorder(node: N): N {
    if (this.thickness !== Notation.THICKNESS) {
      this.adaptor.setStyle(node, 'borderWidth', this.em(this.thickness));
    }
    return node;
  }

  /**
   * @param {N} shape   The svg element whose stroke-thickness must be
   *                    adjusted if the thickness isn't the default
   * @return {N}        The adjusted element
   */
  public adjustThickness(shape: N): N {
    if (this.thickness !== Notation.THICKNESS) {
      this.adaptor.setStyle(shape, 'strokeWidth', this.fixed(this.thickness));
    }
    return shape;
  }

  /********************************************************/

  /**
   * @param {number} m    A number to be shown with a fixed number of digits
   * @param {number=} n   The number of digits to use
   * @return {string}     The formatted number
   */
  public fixed(m: number, n: number = 3): string {
    if (Math.abs(m) < .0006) {
      return '0';
    }
    return m.toFixed(n).replace(/\.?0+$/, '');
  }

  /**
   * @override
   * (make it public so it can be called by the notation functions)
   */
  public em(m: number) {
    return super.em(m);
  }

}
