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
 * @fileoverview The AMS Parse methods.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */


import {StackItem} from '../StackItem.js';
import {ParseMethod} from '../Types.js';
import ParseUtil from '../ParseUtil.js';
import ParseMethods from '../ParseMethods.js';
import NodeUtil from '../NodeUtil.js';
import {TexConstant} from '../TexConstants.js';
import TexParser from '../TexParser.js';
import TexError from '../TexError.js';
import {Macro} from '../Symbol.js';
import {CommandMap} from '../SymbolMap.js';
import {ArrayItem} from '../base/BaseItems.js';
import {FlalignItem} from './AmsItems.js';
import BaseMethods from '../base/BaseMethods.js';
import {TEXCLASS} from '../../../core/MmlTree/MmlNode.js';
import {MmlMunderover} from '../../../core/MmlTree/MmlNodes/munderover.js';
import {MmlNode, AbstractMmlTokenNode} from '../../../core/MmlTree/MmlNode.js';


// Namespace
export const AmsMethods: Record<string, ParseMethod> = {};


/**
 * Handle AMS array environments.
 * @param {TexParser} parser The calling parser.
 * @param {StackItem} begin The opening stackitem.
 * @param {boolean} numbered Environment numbered.
 * @param {boolean} taggable Environment taggable (e.g., align* is taggable,
 *     split is not).
 * @param {string} align Column alignment.
 * @param {string} spacing Column spacing.
 * @param {string} style Display style indicator.
 */
AmsMethods.AmsEqnArray = function(parser: TexParser, begin: StackItem,
                                      numbered: boolean, taggable: boolean,
                                      align: string, spacing: string,
                                      style: string) {
  // @test Aligned, Gathered
  const args = parser.GetBrackets('\\begin{' + begin.getName() + '}');
  const array = BaseMethods.EqnArray(parser, begin, numbered, taggable, align, spacing, style);
  return ParseUtil.setArrayAlign(array as ArrayItem, args);
};


/**
 * Handle AMS  alignat environments.
 * @param {TexParser} parser The calling parser.
 * @param {StackItem} begin The opening stackitem.
 * @param {boolean} numbered Environment numbered.
 * @param {boolean} taggable Environment taggable (e.g., align* is taggable,
 *     split is not).
 */
AmsMethods.AlignAt = function(parser: TexParser, begin: StackItem,
                              numbered: boolean, taggable: boolean) {
  const name = begin.getName();
  let n, valign, align = '', spacing = [];
  if (!taggable) {
    // @test Alignedat
    valign = parser.GetBrackets('\\begin{' + name + '}');
  }
  n = parser.GetArgument('\\begin{' + name + '}');
  if (n.match(/[^0-9]/)) {
    // @test PositiveIntegerArg
    throw new TexError('PositiveIntegerArg',
                        'Argument to %1 must me a positive integer',
                        '\\begin{' + name + '}');
  }
  let count = parseInt(n, 10);
  while (count > 0) {
    align  += 'rl';
    spacing.push('0em 0em');
    count--;
  }
  let spaceStr = spacing.join(' ');
  if (taggable) {
    // @test Alignat, Alignat Star
    return AmsMethods.EqnArray(parser, begin, numbered, taggable, align, spaceStr);
  }
  // @test Alignedat
  let array = AmsMethods.EqnArray(parser, begin, numbered, taggable, align, spaceStr);
  return ParseUtil.setArrayAlign(array as ArrayItem, valign);
};


/**
 * Implements multline environment (mostly handled through STACKITEM below)
 * @param {TexParser} parser The calling parser.
 * @param {StackItem} begin The opening stackitem.
 * @param {boolean} numbered Environment numbered.
 */
AmsMethods.Multline = function (parser: TexParser, begin: StackItem, numbered: boolean) {
  // @test Shove*, Multline
  parser.Push(begin);
  ParseUtil.checkEqnEnv(parser);
  const item = parser.itemFactory.create('multline', numbered, parser.stack) as ArrayItem;
  item.arraydef = {
    displaystyle: true,
    rowspacing: '.5em',
    columnspacing: '100%',
    width: parser.options.ams['multlineWidth'],
    side: parser.options['tagSide'],
    minlabelspacing: parser.options['tagIndent'],
    framespacing: parser.options.ams['multlineIndent'] + ' 0',
    frame: '',   // Use frame spacing with no actual frame
    'data-width-includes-label': true // take label space out of 100% width
  };
  return item;
};


/**
 * Generate an align at environment.
 * @param {TexParser} parser The current TeX parser.
 * @param {StackItem} begin The begin stackitem.
 * @param {boolean} numbered Is this a numbered array.
 * @param {boolean} padded Is it padded.
 */
AmsMethods.XalignAt = function(parser: TexParser, begin: StackItem,
                                  numbered: boolean, padded: boolean) {
  let n = parser.GetArgument('\\begin{' + begin.getName() + '}');
  if (n.match(/[^0-9]/)) {
    throw new TexError('PositiveIntegerArg',
                       'Argument to %1 must me a positive integer',
                       '\\begin{' + begin.getName() + '}');
  }
  const align = (padded ? 'crl' : 'rlc');
  const width = (padded ? 'fit auto auto' : 'auto auto fit');
  const item = AmsMethods.FlalignArray(parser, begin, numbered, padded, false, align, width, true) as FlalignItem;
  item.setProperty('xalignat', 2 * parseInt(n));
  return item;
};


/**
 * Generate an flalign environment.
 * @param {TexParser} parser The current TeX parser.
 * @param {StackItem} begin The begin stackitem.
 * @param {boolean} numbered Is this a numbered array.
 * @param {boolean} padded Is it padded.
 * @param {boolean} center Is it centered.
 * @param {string} align The horizontal alignment for columns
 * @param {string} width The column widths of the table
 * @param {boolean} zeroWidthLabel True if the label should be in llap/rlap
 */
AmsMethods.FlalignArray = function(parser: TexParser, begin: StackItem, numbered: boolean,
                                  padded: boolean, center: boolean, align: string,
                                  width: string, zeroWidthLabel: boolean = false) {
  parser.Push(begin);
  ParseUtil.checkEqnEnv(parser);
  align = align
    .split('')
    .join(' ')
    .replace(/r/g, 'right')
    .replace(/l/g, 'left')
    .replace(/c/g, 'center');
  const item = parser.itemFactory.create(
    'flalign', begin.getName(), numbered, padded, center, parser.stack) as FlalignItem;
  item.arraydef = {
    width: '100%',
    displaystyle: true,
    columnalign: align,
    columnspacing: '0em',
    columnwidth: width,
    rowspacing: '3pt',
    side: parser.options['tagSide'],
    minlabelspacing: (zeroWidthLabel ? '0' : parser.options['tagIndent']),
    'data-width-includes-label': true,
  };
  item.setProperty('zeroWidthLabel', zeroWidthLabel);
  return item;
};


export const NEW_OPS = 'ams-declare-ops';

/**
 * Handle DeclareMathOperator.
 * @param {TexParser} parser The calling parser.
 * @param {string} name The macro name.
 */
AmsMethods.HandleDeclareOp =  function (parser: TexParser, name: string) {
  let star = (parser.GetStar() ? '*' : '');
  let cs = ParseUtil.trimSpaces(parser.GetArgument(name));
  if (cs.charAt(0) === '\\') {
    cs = cs.substr(1);
  }
  let op = parser.GetArgument(name);
  (parser.configuration.handlers.retrieve(NEW_OPS) as CommandMap).
    add(cs, new Macro(cs, AmsMethods.Macro, [`\\operatorname${star}{${op}}`]));
};


/**
 * Handle operatorname.
 * @param {TexParser} parser The calling parser.
 * @param {string} name The macro name.
 */
AmsMethods.HandleOperatorName = function(parser: TexParser, name: string) {
  // @test Operatorname
  const star = parser.GetStar();
  //
  //  Parse the argument using operator letters and grouping multiple letters.
  //
  let op = ParseUtil.trimSpaces(parser.GetArgument(name));
  let mml = new TexParser(op, {
    ...parser.stack.env,
    font: TexConstant.Variant.NORMAL,
    multiLetterIdentifiers: /^[-*a-z]+/i as any,
    operatorLetters: true
  }, parser.configuration).mml();
  //
  //  If we get something other than a single mi, wrap in a TeXAtom.
  //
  if (!mml.isKind('mi')) {
    mml = parser.create('node', 'TeXAtom', [mml]);
  }
  //
  //  Mark the limit properties and the TeX class.
  //
  NodeUtil.setProperties(mml, {movesupsub: star, movablelimits: true, texClass: TEXCLASS.OP});
  //
  //  Skip a following \limits macro if not a starred operator
  //
  if (!star) {
    const c = parser.GetNext(), i = parser.i;
    if (c === '\\' && ++parser.i && parser.GetCS() !== 'limits') {
      parser.i = i;
    }
  }
  //
  parser.Push(mml);
};

/**
 * Handle sideset.
 * @param {TexParser} parser The calling parser.
 * @param {string} name The macro name.
 */
AmsMethods.SideSet = function (parser: TexParser, name: string) {
  //
  //  Get the pre- and post-scripts, and any extra material from the arguments
  //
  const [preScripts, preRest] = splitSideSet(parser.ParseArg(name));
  const [postScripts, postRest] = splitSideSet(parser.ParseArg(name));
  const base = parser.ParseArg(name);
  let mml = base;
  //
  //  If there are pre-scripts...
  //
  if (preScripts) {
    //
    //  If there is other material...
    //
    if (preRest) {
      //
      //  Replace the empty base of the prescripts with a phantom element of the
      //    original base, with width 0 (but still of the correct height and depth).
      //    so the scripts will be at the right heights.
      //
      preScripts.replaceChild(
        parser.create('node', 'mphantom', [
          parser.create('node', 'mpadded', [ParseUtil.copyNode(base, parser)], {width: 0})
        ]),
        NodeUtil.getChildAt(preScripts, 0)
      );
    } else {
      //
      //  If there is no extra meterial, make a mmultiscripts element
      //
      mml = parser.create('node', 'mmultiscripts', [base]);
      //
      //  Add any postscripts
      //
      if (postScripts) {
        NodeUtil.appendChildren(mml, [
          NodeUtil.getChildAt(postScripts, 1) || parser.create('node', 'none'),
          NodeUtil.getChildAt(postScripts, 2) || parser.create('node', 'none')
        ]);
      }
      //
      //  Add the prescripts (left aligned)
      //
      NodeUtil.setProperty(mml, 'scriptalign', 'left');
      NodeUtil.appendChildren(mml, [
        parser.create('node', 'mprescripts'),
        NodeUtil.getChildAt(preScripts, 1) || parser.create('node', 'none'),
        NodeUtil.getChildAt(preScripts, 2) || parser.create('node', 'none')
      ]);
    }
  }
  //
  //  If there are postscripts and we didn't make a mmultiscript element above...
  //
  if (postScripts && mml === base) {
    //
    //  Replace the emtpy base with actual base, and use that as the mml
    //
    postScripts.replaceChild(base, NodeUtil.getChildAt(postScripts, 0));
    mml = postScripts;
  }
  //
  //  Put the needed pieces into a TeXAtom of class OP.
  //  Note that the postScripts are in the mml element,
  //    either as part of the mmultiscripts node, or the
  //    msubsup with the base inserted into it.
  //
  const mrow = parser.create('node', 'TeXAtom', [], {texClass: TEXCLASS.OP, movesupsub: true, movablelimits: true});
  if (preRest) {
    preScripts && mrow.appendChild(preScripts);
    mrow.appendChild(preRest);
  }
  mrow.appendChild(mml);
  postRest && mrow.appendChild(postRest);
  parser.Push(mrow);
};

/**
 * Utility for breaking the \sideset scripts from any other material.
 * @param {MmlNode} mml The node to check.
 * @return {[MmlNode, MmlNode]} The msubsup with the scripts together with any extra nodes.
 */
function splitSideSet(mml: MmlNode): [MmlNode, MmlNode] {
    if (!mml || (mml.isInferred && mml.childNodes.length === 0)) return [null, null];
    if (mml.isKind('msubsup') && checkSideSetBase(mml)) return [mml, null];
    const child = NodeUtil.getChildAt(mml, 0);
    if (!(mml.isInferred && child && checkSideSetBase(child))) return [null, mml];
    mml.childNodes.splice(0, 1); // remove first child
    return [child, mml];
}

/**
 * Utility for checking if a \sideset argument has scripts with an empty base.
 * @param {MmlNode} mml The node to check.
 * @return {boolean} True if the base is not and empty mi element.
 */
function checkSideSetBase(mml: MmlNode): boolean {
  const base = mml.childNodes[0];
  return base && base.isKind('mi') && (base as AbstractMmlTokenNode).getText() === '';
}


/**
 * Handle extra letters in \operatorname (- and *), default to normal otherwise.
 * @param {TexParser} parser The calling parser.
 * @param {string} c The letter being checked
 */
AmsMethods.operatorLetter = function (parser: TexParser, c: string) {
  return parser.stack.env.operatorLetters ? ParseMethods.variable(parser, c) : false;
};


/**
 * Handle multi integral signs.
 * @param {TexParser} parser The calling parser.
 * @param {string} name The macro name.
 * @param {string} integral The actual integral sign.
 */
AmsMethods.MultiIntegral = function(parser: TexParser, name: string,
                                    integral: string) {
  let next = parser.GetNext();
  if (next === '\\') {
    // @test MultiInt with Command
    let i = parser.i;
    next = parser.GetArgument(name);
    parser.i = i;
    if (next === '\\limits') {
      if (name === '\\idotsint') {
       // @test MultiInt with Limits
        integral = '\\!\\!\\mathop{\\,\\,' + integral + '}';
      }
      else {
        // Question: This is not used anymore?
        integral = '\\!\\!\\!\\mathop{\\,\\,\\,' + integral + '}';
      }
    }
  }
  // @test MultiInt, MultiInt in Context
  parser.string = integral + ' ' + parser.string.slice(parser.i);
  parser.i = 0;
};


/**
 *  Handle stretchable arrows.
 * @param {TexParser} parser The calling parser.
 * @param {string} name The macro name.
 * @param {number} chr The arrow character in hex code.
 * @param {number} l Left width.
 * @param {number} r Right width.
 */
AmsMethods.xArrow = function(parser: TexParser, name: string,
                             chr: number, l: number, r: number) {
  let def = {width: '+' + ParseUtil.Em((l + r) / 18), lspace: ParseUtil.Em(l / 18)};
  let bot = parser.GetBrackets(name);
  let first = parser.ParseArg(name);
  let dstrut = parser.create('node', 'mspace', [], {depth: '.25em'});
  let arrow = parser.create('token',
    'mo', {stretchy: true, texClass: TEXCLASS.REL}, String.fromCodePoint(chr));
  arrow = parser.create('node', 'mstyle', [arrow], {scriptlevel: 0});
  let mml = parser.create('node', 'munderover', [arrow]) as MmlMunderover;
  let mpadded = parser.create('node', 'mpadded', [first, dstrut], def);
  NodeUtil.setAttribute(mpadded, 'voffset', '-.2em');
  NodeUtil.setAttribute(mpadded, 'height', '-.2em');
  NodeUtil.setChild(mml, mml.over, mpadded);
  if (bot) {
    // @test Above Below Left Arrow, Above Below Right Arrow
    let bottom = new TexParser(bot, parser.stack.env, parser.configuration).mml();
    let bstrut = parser.create('node', 'mspace', [], {height: '.75em'});
    mpadded = parser.create('node', 'mpadded', [bottom, bstrut], def);
    NodeUtil.setAttribute(mpadded, 'voffset', '.15em');
    NodeUtil.setAttribute(mpadded, 'depth', '-.15em');
    NodeUtil.setChild(mml, mml.under, mpadded);
  }
  // @test Above Left Arrow, Above Right Arrow, Above Left Arrow in Context,
  //       Above Right Arrow in Context
  NodeUtil.setProperty(mml, 'subsupOK', true);
  parser.Push(mml);
};


/**
 * Record presence of \shoveleft and \shoveright
 * @param {TexParser} parser The calling parser.
 * @param {string} name The macro name.
 * @param {string} shove The shove value.
 */
AmsMethods.HandleShove = function(parser: TexParser, _name: string,
                                  shove: string) {
  let top = parser.stack.Top();
  // @test Shove (Left|Right) (Top|Middle|Bottom)
  if (top.kind !== 'multline') {
    // @test Shove Error Environment
    throw new TexError('CommandOnlyAllowedInEnv',
                        '%1 only allowed in %2 environment',
                        parser.currentCS, 'multline');
  }
  if (top.Size()) {
    // @test Shove Error (Top|Middle|Bottom)
    throw new TexError('CommandAtTheBeginingOfLine',
                        '%1 must come at the beginning of the line', parser.currentCS);
  }
  top.setProperty('shove', shove);
};


/**
 * Handle \cfrac
 * @param {TexParser} parser The calling parser.
 * @param {string} name The macro name.
 */
AmsMethods.CFrac = function(parser: TexParser, name: string) {
  let lr  = ParseUtil.trimSpaces(parser.GetBrackets(name, ''));
  let num = parser.GetArgument(name);
  let den = parser.GetArgument(name);
  let lrMap: {[key: string]: string} = {
    l: TexConstant.Align.LEFT, r: TexConstant.Align.RIGHT, '': ''};
  let numNode = new TexParser('\\strut\\textstyle{' + num + '}',
                              parser.stack.env, parser.configuration).mml();
  let denNode = new TexParser('\\strut\\textstyle{' + den + '}',
                              parser.stack.env, parser.configuration).mml();
  let frac = parser.create('node', 'mfrac', [numNode, denNode]);
  lr = lrMap[lr];
  if (lr == null) {
    // @test Center Fraction Error
    throw new TexError('IllegalAlign', 'Illegal alignment specified in %1', parser.currentCS);
  }
  if (lr) {
    // @test Right Fraction, Left Fraction
    NodeUtil.setProperties(frac, {numalign: lr, denomalign: lr});
  }
  // @test Center Fraction
  parser.Push(frac);
};


/**
 * Implement AMS generalized fraction.
 * @param {TexParser} parser The calling parser.
 * @param {string} name The macro name.
 * @param {string} left Left delimiter.
 * @param {string} right Right delimiter.
 * @param {string} thick Line thickness.
 * @param {string} style Math style.
 */
AmsMethods.Genfrac = function(parser: TexParser, name: string, left: string,
                              right: string, thick: string, style: string) {
  if (left  == null) { // @test Genfrac
    left = parser.GetDelimiterArg(name);
  }
  if (right == null) { // @test Genfrac
    right = parser.GetDelimiterArg(name);
  }
  if (thick == null) { // @test Genfrac
    thick = parser.GetArgument(name);
  }
  if (style == null) { // @test Genfrac
    style = ParseUtil.trimSpaces(parser.GetArgument(name));
  }
  let num = parser.ParseArg(name);
  let den = parser.ParseArg(name);
  let frac = parser.create('node', 'mfrac', [num, den]);
  if (thick !== '') {
    // @test Normal Binomial, Text Binomial, Display Binomial
    NodeUtil.setAttribute(frac, 'linethickness', thick);
  }
  if (left || right) {
    // @test Normal Binomial, Text Binomial, Display Binomial
    NodeUtil.setProperty(frac, 'withDelims', true);
    frac = ParseUtil.fixedFence(parser.configuration, left, frac, right);
  }
  if (style !== '') {
    let styleDigit = parseInt(style, 10);
    let styleAlpha = ['D', 'T', 'S', 'SS'][styleDigit];
    if (styleAlpha == null) {
      // @test Genfrac Error
      throw new TexError('BadMathStyleFor', 'Bad math style for %1', parser.currentCS);
    }
    frac = parser.create('node', 'mstyle', [frac]);
    if (styleAlpha === 'D') {
      // @test Display Fraction, Display Sub Fraction, Display Binomial,
      //       Display Sub Binomial
      NodeUtil.setProperties(frac, {displaystyle: true, scriptlevel: 0});
    }
    else {
      // @test Text Fraction, Text Sub Fraction, Text Binomial,
      //       Text Sub Binomial
      NodeUtil.setProperties(frac, {displaystyle: false,
                                      scriptlevel: styleDigit - 1});
    }
  }
  // @test Text Fraction, Normal Sub Binomial, Normal Binomial
  parser.Push(frac);
};



/**
 * Add the tag to the environment (to be added to the table row later).
 * @param {TexParser} parser The calling parser.
 * @param {string} name The macro name.
 */
AmsMethods.HandleTag = function(parser: TexParser, name: string) {
  if (!parser.tags.currentTag.taggable && parser.tags.env) {
    // @test Illegal Tag Error
    throw new TexError('CommandNotAllowedInEnv',
                        '%1 not allowed in %2 environment',
                        parser.currentCS, parser.tags.env);
  }
  if (parser.tags.currentTag.tag) {
    // @test Double Tag Error
    throw new TexError('MultipleCommand', 'Multiple %1', parser.currentCS);
  }
  let star = parser.GetStar();
  let tagId = ParseUtil.trimSpaces(parser.GetArgument(name));
  parser.tags.tag(tagId, star);
};


AmsMethods.HandleNoTag = BaseMethods.HandleNoTag;

AmsMethods.HandleRef = BaseMethods.HandleRef;

AmsMethods.Macro = BaseMethods.Macro;

AmsMethods.Accent = BaseMethods.Accent;

AmsMethods.Tilde = BaseMethods.Tilde;

AmsMethods.Array = BaseMethods.Array;

AmsMethods.Spacer = BaseMethods.Spacer;

AmsMethods.NamedOp = BaseMethods.NamedOp;

AmsMethods.EqnArray = BaseMethods.EqnArray;

AmsMethods.Equation = BaseMethods.Equation;
