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
 * @fileoverview  Implements utilities for notations for menclose elements
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AnyWrapper} from './Wrapper.js';
import {CommonMenclose} from './Wrappers/menclose.js';

/*****************************************************************/

export const ARROWX = 4, ARROWDX = 1, ARROWY = 2;  // default relative arrowhead values

export const THICKNESS = .067;  // default rule thickness
export const PADDING = .2;      // default padding

export const SOLID = THICKNESS + 'em solid';  // a solid border

/*****************************************************************/

/**
 * Shorthand for CommonMenclose
 */
export type Menclose = CommonMenclose<any, any, any>;

/**
 * Top, right, bottom, left padding data
 */
export type PaddingData = [number, number, number, number];

/**
 * The functions used for notation definitions
 *
 * @templare N  The DOM node class
 */
export type Renderer<W extends AnyWrapper, N> = (node: W, child: N) => void;
export type BBoxExtender<W extends AnyWrapper> = (node: W) => PaddingData;
export type BBoxBorder<W extends AnyWrapper> = (node: W) => PaddingData;
export type Initializer<W extends AnyWrapper> = (node: W) => void;

/**
 * The definition of a notation
 *
 * @template W  The menclose wrapper class
 * @templare N  The DOM node class
 */
export type NotationDef<W extends AnyWrapper, N> = {
  renderer: Renderer<W, N>;  // renders the DOM nodes for the notation
  bbox: BBoxExtender<W>;     // gives the offsets to the child bounding box: [top, right, bottom, left]
  border?: BBoxBorder<W>;    // gives the amount of the bbox offset that is due to borders on the child
  renderChild?: boolean;     // true if the notation is used to render the child directly (e.g., radical)
  init?: Initializer<W>;     // function to be called during wrapper construction
  remove?: string;           // list of notations that are suppressed by this one
};

/**
 * For defining notation maps
 *
 * @template W  The menclose wrapper class
 * @templare N  The DOM node class
 */
export type DefPair<W extends AnyWrapper, N> = [string, NotationDef<W, N>];
export type DefList<W extends AnyWrapper, N> = Map<string, NotationDef<W, N>>;

export type DefPairF<T, W extends AnyWrapper, N> = (name: T) => DefPair<W, N>;

/**
 * The list of notations for an menclose element
 *
 * @template W  The menclose wrapper class
 * @templare N  The DOM node class
 */
export type List<W extends AnyWrapper, N> = {[notation: string]: NotationDef<W, N>};

/*****************************************************************/

/**
 * The names and indices of sides for borders, padding, etc.
 */
export const sideIndex = {top: 0, right: 1, bottom: 2, left: 3};
export type Side = keyof typeof sideIndex;
export const sideNames = Object.keys(sideIndex) as Side[];

/**
 * Common BBox and Border functions
 */
export const fullBBox = ((node) => new Array(4).fill(node.thickness + node.padding)) as BBoxExtender<Menclose>;
export const fullPadding = ((node) => new Array(4).fill(node.padding)) as BBoxExtender<Menclose>;
export const fullBorder = ((node) => new Array(4).fill(node.thickness)) as BBoxBorder<Menclose>;

/*****************************************************************/

/**
 * The length of an arrowhead
 */
export const arrowHead = (node: Menclose) => {
  return Math.max(node.padding, node.thickness * (node.arrowhead.x + node.arrowhead.dx + 1));
};

/**
 * Adjust short bbox for tall arrow heads
 */
export const arrowBBoxHD = (node: Menclose, TRBL: PaddingData) => {
  if (node.childNodes[0]) {
    const {h, d} = node.childNodes[0].getBBox();
    TRBL[0] = TRBL[2] = Math.max(0, node.thickness * node.arrowhead.y - (h + d) / 2);
  }
  return TRBL;
};

/**
 * Adjust thin bbox for wide arrow heads
 */
export const arrowBBoxW = (node: Menclose, TRBL: PaddingData) => {
  if (node.childNodes[0]) {
    const {w} = node.childNodes[0].getBBox();
    TRBL[1] = TRBL[3] = Math.max(0, node.thickness * node.arrowhead.y - w / 2);
  }
  return TRBL;
};

/**
 * The data for horizontal and vertical arrow notations
 *   [angle, double, isVertical, remove]
 */
export const arrowDef = {
  up:        [-Math.PI / 2, false, true,  'verticalstrike'],
  down:      [ Math.PI / 2, false, true,  'verticakstrike'],
  right:     [ 0,           false, false, 'horizontalstrike'],
  left:      [ Math.PI,     false, false, 'horizontalstrike'],
  updown:    [ Math.PI / 2, true,  true,  'verticalstrike uparrow downarrow'],
  leftright: [ 0,           true,  false, 'horizontalstrike leftarrow rightarrow']
} as {[name: string]: [number, boolean, boolean, string]};

/**
 * The data for diagonal arrow notations
 *   [c, pi, double, remove]
 */
export const diagonalArrowDef = {
  updiagonal:         [-1, 0,       false, 'updiagonalstrike northeastarrow'],
  northeast:          [-1, 0,       false, 'updiagonalstrike updiagonalarrow'],
  southeast:          [ 1, 0,       false, 'downdiagonalstrike'],
  northwest:          [ 1, Math.PI, false, 'downdiagonalstrike'],
  southwest:          [-1, Math.PI, false, 'updiagonalstrike'],
  northeastsouthwest: [-1, 0,       true,  'updiagonalstrike northeastarrow updiagonalarrow southwestarrow'],
  northwestsoutheast: [ 1, 0,       true,  'downdiagonalstrike northwestarrow southeastarrow']
} as {[name: string]: [number, number, boolean, string]};

/**
 * The BBox functions for horizontal and vertical arrows
 */
export const arrowBBox = {
  up:    (node) => arrowBBoxW(node, [arrowHead(node), 0, node.padding, 0]),
  down:  (node) => arrowBBoxW(node, [node.padding, 0, arrowHead(node), 0]),
  right: (node) => arrowBBoxHD(node, [0, arrowHead(node), 0, node.padding]),
  left:  (node) => arrowBBoxHD(node, [0, node.padding, 0, arrowHead(node)]),
  updown:    (node) => arrowBBoxW(node, [arrowHead(node), 0, arrowHead(node), 0]),
  leftright: (node) => arrowBBoxHD(node, [0, arrowHead(node), 0, arrowHead(node)])
} as {[name: string]: BBoxExtender<Menclose>};

/*****************************************************************/

/**
 * @param {Renderer} render     The function for adding the border to the node
 * @return {string => DefPair}  The function returingn the notation definition
 *                              for the notation having a line on the given side
 */
export const CommonBorder = function<W extends Menclose, N>(render: Renderer<W, N>): DefPairF<Side, W, N> {
  /**
   * @param {string} side   The side on which a border should appear
   * @return {DefPair}      The notation definition for the notation having a line on the given side
   */
  return (side: Side) => {
    const i = sideIndex[side];
    return [side, {
      //
      // Add the border to the main child object
      //
      renderer: render,
      //
      // Indicate the extra space on the given side
      //
      bbox: (node) => {
        const bbox = [0, 0, 0, 0] as PaddingData;
        bbox[i] = node.thickness + node.padding;
        return bbox;
      },
      //
      // Indicate the border on the given side
      //
      border: (node) => {
        const bbox = [0, 0, 0, 0] as PaddingData;
        bbox[i] = node.thickness;
        return bbox;
      }
    }];
  };
};

/**
 * @param {Renderer} render                    The function for adding the borders to the node
 * @return {(sring, Side, Side) => DefPair}    The function returning the notation definition
 *                                             for the notation having lines on two sides
 */
export const CommonBorder2 = function<W extends Menclose, N>(render: Renderer<W, N>):
(name: string, side1: Side, side2: Side) => DefPair<W, N> {
  /**
   * @param {string} name    The name of the notation to define
   * @param {Side} side1   The first side to get a border
   * @param {Side} side2   The second side to get a border
   * @return {DefPair}       The notation definition for the notation having lines on two sides
   */
  return (name: string, side1: Side, side2: Side) => {
    const i1 = sideIndex[side1];
    const i2 = sideIndex[side2];
    return [name, {
      //
      // Add the border along the given sides
      //
      renderer: render,
      //
      // Mark the extra space along the two sides
      //
      bbox: (node) => {
        const t = node.thickness + node.padding;
        const bbox = [0, 0, 0, 0] as PaddingData;
        bbox[i1] = bbox[i2] = t;
        return bbox;
      },
      //
      // Indicate the border on the two sides
      //
      border: (node) => {
        const bbox = [0, 0, 0, 0] as PaddingData;
        bbox[i1] = bbox[i2] = node.thickness;
        return bbox;
      },
      //
      // Remove the single side notations, if present
      //
      remove: side1 + ' ' + side2
    }];
  };
};

/*****************************************************************/

/**
 * @param {string => Renderer} render      The function for adding the strike to the node
 * @return {string => DefPair}   The function returning the notation definition for the diagonal strike
 */
export const CommonDiagonalStrike = function<W extends Menclose, N>(render: (sname: string) => Renderer<W, N>):
DefPairF<string, W, N> {
  /**
   * @param {string} name  The name of the diagonal strike to define
   * @return {DefPair}     The notation definition for the diagonal strike
   */
  return (name: string) => {
    const cname = 'mjx-' + name.charAt(0) + 'strike';
    return [name + 'diagonalstrike', {
      //
      // Find the angle and width from the bounding box size and create the diagonal line
      //
      renderer: render(cname),
      //
      //  Add padding all around
      //
      bbox: fullBBox
    }];
  };
};

/*****************************************************************/

/**
 * @param {Renderer} render     The function to add the arrow to the node
 * @return {string => DefPair}  The funciton returning the notation definition for the diagonal arrow
 */
export const CommonDiagonalArrow = function<W extends Menclose, N>(render: Renderer<W, N>): DefPairF<string, W, N> {
  /**
   * @param {string} name   The name of the diagonal arrow to define
   * @return {DefPair}      The notation definition for the diagonal arrow
   */
  return (name: string) => {
    const [c, pi, double, remove] = diagonalArrowDef[name];
    return [name + 'arrow', {
      //
      // Find the angle and width from the bounding box size and create
      //   the arrow from them and the other arrow data
      //
      renderer: (node, _child) => {
        const [a, W] = node.arrowAW();
       const arrow = node.arrow(W, c * (a - pi), double);
        render(node, arrow);
      },
      //
      // Add space for the arrowhead all around
      //
      bbox: (node) => {
        const {a, x, y} = node.arrowData();
        const [ax, ay, adx] = [node.arrowhead.x, node.arrowhead.y, node.arrowhead.dx];
        const [b, ar] = node.getArgMod(ax + adx, ay);
        const dy = y + (b > a ? node.thickness * ar * Math.sin(b - a) : 0);
        const dx = x + (b > Math.PI / 2 - a ? node.thickness * ar * Math.sin(b + a - Math.PI / 2) : 0);
        return [dy, dx, dy, dx];
      },
      //
      // Remove redundant notations
      //
      remove: remove
    }];
  };
};

/**
 * @param {Renderer} render     The function to add the arrow to the node
 * @return {string => DefPair}  The function returning the notation definition for the arrow
 */
export const CommonArrow = function<W extends Menclose, N>(render: Renderer<W, N>): DefPairF<string, W, N> {
  /**
   * @param {string} name   The name of the horizontal or vertical arrow to define
   * @return {DefPair}      The notation definition for the arrow
   */
  return (name: string) => {
    const [angle, double, isVertical, remove] = arrowDef[name];
    return [name + 'arrow', {
      //
      // Get the arrow height and depth from the bounding box and the arrow direction
      //   then create the arrow from that and the other data
      //
      renderer: (node, _child) => {
        const {w, h, d} = node.getBBox();
        const [W, offset] = (isVertical ? [h + d, 'X'] : [w, 'Y']);
        const dd = node.getOffset(offset);
        const arrow = node.arrow(W, angle, double, offset, dd);
        render(node, arrow);
      },
      //
      // Add the padding to the proper sides
      //
      bbox: arrowBBox[name],
      //
      // Remove redundant notations
      //
      remove: remove
    }];
  };
};
