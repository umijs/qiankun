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
 * @fileoverview Methods for the Html package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */


import TexParser from '../TexParser.js';
import {ParseMethod} from '../Types.js';
import NodeUtil from '../NodeUtil.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';


// Namespace
let HtmlMethods: Record<string, ParseMethod> = {};


/**
 * Implements \href{url}{math}
 * @param {TexParser} parser The calling parser.
 * @param {string} name The macro name.
 */
HtmlMethods.Href = function(parser: TexParser, name: string) {
  const url = parser.GetArgument(name);
  const arg = GetArgumentMML(parser, name);
  NodeUtil.setAttribute(arg, 'href', url);
  parser.Push(arg);
};


/**
 * Implements \class{name}{math}
 * @param {TexParser} parser The calling parser.
 * @param {string} name The macro name.
 */
HtmlMethods.Class = function(parser: TexParser, name: string) {
  let CLASS = parser.GetArgument(name);
  const arg = GetArgumentMML(parser, name);
  let oldClass = NodeUtil.getAttribute(arg, 'class');
  if (oldClass) {
    CLASS = oldClass + ' ' + CLASS;
  }
  NodeUtil.setAttribute(arg, 'class', CLASS);
  parser.Push(arg);
};


/**
 * Implements \style{style-string}{math}
 * @param {TexParser} parser The calling parser.
 * @param {string} name The macro name.
 */
HtmlMethods.Style = function(parser: TexParser, name: string) {
  let style = parser.GetArgument(name);
  const arg = GetArgumentMML(parser, name);
  // check that it looks like a style string
  let oldStyle = NodeUtil.getAttribute(arg, 'style');
  if (oldStyle) {
    if (style.charAt(style.length - 1) !== ';') {
      style += ';';
    }
    style = oldStyle + ' ' + style;
  }
  NodeUtil.setAttribute(arg, 'style', style);
  parser.Push(arg);
};


/**
 * Implements \cssId{id}{math}
 * @param {TexParser} parser The calling parser.
 * @param {string} name The macro name.
 */
HtmlMethods.Id = function(parser: TexParser, name: string) {
  const ID  = parser.GetArgument(name);
  const arg = GetArgumentMML(parser, name);
  NodeUtil.setAttribute(arg, 'id', ID);
  parser.Push(arg);
};


/**
 * Parses the math argument of the above commands and returns it as single
 * node (in an mrow if necessary). The HTML attributes are then
 * attached to this element.
 * @param {TexParser} parser The calling parser.
 * @param {string} name The calling macro name.
 * @return {MmlNode} The math node.
 */
let GetArgumentMML = function(parser: TexParser, name: string): MmlNode {
  let arg = parser.ParseArg(name);
  if (!NodeUtil.isInferred(arg)) {
    return arg;
  }
  let children = NodeUtil.getChildren(arg);
  if (children.length === 1) {
    return children[0];
  }
  const mrow = parser.create('node', 'mrow');
  NodeUtil.copyChildren(arg, mrow);
  NodeUtil.copyAttributes(arg, mrow);
  return mrow;
};


export default HtmlMethods;
