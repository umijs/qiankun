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
 * @fileoverview A namespace for utility functions for the TeX Parser.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {TEXCLASS, MmlNode} from '../../core/MmlTree/MmlNode.js';
import {EnvList} from './StackItem.js';
import {ArrayItem} from './base/BaseItems.js';
import ParseOptions from './ParseOptions.js';
import NodeUtil from './NodeUtil.js';
import TexParser from './TexParser.js';
import TexError from './TexError.js';
import {entities} from '../../util/Entities.js';
import {MmlMunderover} from '../../core/MmlTree/MmlNodes/munderover.js';


namespace ParseUtil {

  // TODO (VS): Combine some of this with lengths in util.
  const emPerInch = 7.2;
  const pxPerInch = 72;
  // Note, the following are TeX CM font values.
  const UNIT_CASES: {[key: string]: ((m: number) => number)}  = {
    'em': m => m,
    'ex': m => m * .43,
    'pt': m => m / 10,                    // 10 pt to an em
    'pc': m => m * 1.2,                   // 12 pt to a pc
    'px': m => m * emPerInch / pxPerInch,
    'in': m => m * emPerInch,
    'cm': m => m * emPerInch / 2.54, // 2.54 cm to an inch
    'mm': m => m * emPerInch / 25.4, // 10 mm to a cm
    'mu': m => m / 18,
  };
  const num = '([-+]?([.,]\\d+|\\d+([.,]\\d*)?))';
  const unit = '(pt|em|ex|mu|px|mm|cm|in|pc)';
  const dimenEnd = RegExp('^\\s*' + num + '\\s*' + unit + '\\s*$');
  const dimenRest = RegExp('^\\s*' + num + '\\s*' + unit + ' ?');


  /**
   * Matches for a dimension argument.
   * @param {string} dim The argument.
   * @param {boolean} rest Allow for trailing garbage in the dimension string.
   * @return {[string, string, number]} The match result as (Anglosaxon) value,
   *     unit name, length of matched string. The latter is interesting in the
   *     case of trailing garbage.
   */
  export function matchDimen(
    dim: string, rest: boolean = false): [string, string, number] {
      let match = dim.match(rest ? dimenRest : dimenEnd);
      return match ?
        muReplace([match[1].replace(/,/, '.'), match[4], match[0].length]) :
        [null, null, 0];
  }


  /**
   * Transforms mu dimension to em if necessary.
   * @param {[string, string, number]} [value, unit, length] The dimension triple.
   * @return {[string, string, number]} [value, unit, length] The transformed triple.
   */
  function muReplace([value, unit, length]: [string, string, number]): [string, string, number] {
    if (unit !== 'mu') {
      return [value, unit, length];
    }
    let em = Em(UNIT_CASES[unit](parseFloat(value || '1')));
    return [em.slice(0, -2), 'em', length];
  }


  /**
   * Convert a dimension string into standard em dimension.
   * @param {string} dim The attribute string.
   * @return {number} The numerical value.
   */
  export function dimen2em(dim: string): number {
    let [value, unit] = matchDimen(dim);
    let m = parseFloat(value || '1');
    let func = UNIT_CASES[unit];
    return func ? func(m) : 0;
  }


  /**
   * Turns a number into an em value.
   * @param {number} m The number.
   * @return {string} The em dimension string.
   */
  export function Em(m: number): string {
    if (Math.abs(m) < .0006) {
      return '0em';
    }
    return m.toFixed(3).replace(/\.?0+$/, '') + 'em';
  }


  /**
   * Takes an array of numbers and returns a space-separated string of em values.
   * @param {number[]} W  The widths to be turned into em values
   * @return {string}     The numbers with em units, separated by spaces.
   */
  export function cols(...W: number[]): string {
    return W.map(n => Em(n)).join(' ');
  }


  /**
   * Create an mrow that has stretchy delimiters at either end, as needed
   * @param {ParseOptions} configuration Current parse options.
   * @param {string} open The opening fence.
   * @param {MmlNode} mml The enclosed node.
   * @param {string} close The closing fence.
   * @param {string=} big Bigg command.
   */
  export function fenced(configuration: ParseOptions, open: string, mml: MmlNode,
                         close: string, big: string = '', color: string = '') {
    // @test Fenced, Fenced3
    let nf = configuration.nodeFactory;
    let mrow = nf.create('node', 'mrow', [],
                         {open: open, close: close, texClass: TEXCLASS.INNER});
    let mo;
    if (big) {
      mo = new TexParser('\\' + big + 'l' + open, configuration.parser.stack.env, configuration).mml();
    } else {
      let openNode = nf.create('text', open);
      mo = nf.create('node', 'mo', [],
                     {fence: true, stretchy: true, symmetric: true, texClass: TEXCLASS.OPEN},
                     openNode);
    }
    NodeUtil.appendChildren(mrow, [mo, mml]);
    if (big) {
      mo = new TexParser('\\' + big + 'r' + close, configuration.parser.stack.env, configuration).mml();
    } else {
      let closeNode = nf.create('text', close);
      mo = nf.create('node', 'mo', [],
                     {fence: true, stretchy: true, symmetric: true, texClass: TEXCLASS.CLOSE},
                     closeNode);
    }
    color && mo.attributes.set('mathcolor', color);
    NodeUtil.appendChildren(mrow, [mo]);
    return mrow;
  }


  /**
   *  Create an mrow that has \\mathchoice using \\bigg and \\big for the delimiters.
   * @param {ParseOptions} configuration The current parse options.
   * @param {string} open The opening fence.
   * @param {MmlNode} mml The enclosed node.
   * @param {string} close The closing fence.
   * @return {MmlNode} The mrow node.
   */
  export function fixedFence(configuration: ParseOptions, open: string,
                             mml: MmlNode, close: string): MmlNode {
    // @test Choose, Over With Delims, Above with Delims
    let mrow = configuration.nodeFactory.create('node',
      'mrow', [], {open: open, close: close, texClass: TEXCLASS.ORD});
    if (open) {
      NodeUtil.appendChildren(mrow, [mathPalette(configuration, open, 'l')]);
    }
    if (NodeUtil.isType(mml, 'mrow')) {
      NodeUtil.appendChildren(mrow, NodeUtil.getChildren(mml));
    } else {
      NodeUtil.appendChildren(mrow, [mml]);
    }
    if (close) {
      NodeUtil.appendChildren(mrow, [mathPalette(configuration, close, 'r')]);
    }
    return mrow;
  }


  /**
   * Generates a mathchoice element for fences. These will be resolved later,
   * once the position, and therefore size, of the of the fenced expression is
   * known.
   * @param {ParseOptions} configuration The current parse otpions.
   * @param {string} fence The fence.
   * @param {string} side The side of the fence (l or r).
   * @return {MmlNode} The mathchoice node.
   */
  export function mathPalette(configuration: ParseOptions, fence: string,
                              side: string): MmlNode  {
    if (fence === '{' || fence === '}') {
      fence = '\\' + fence;
    }
    let D = '{\\bigg' + side + ' ' + fence + '}';
    let T = '{\\big' + side + ' ' + fence + '}';
    return new TexParser('\\mathchoice' + D + T + T + T, {}, configuration).mml();
  }


  /**
   * If the initial child, skipping any initial space or
   * empty braces (TeXAtom with child being an empty inferred row),
   * is an <mo>, precede it by an empty <mi> to force the <mo> to
   * be infix.
   * @param {ParseOptions} configuration The current parse options.
   * @param {MmlNode[]} nodes The row of nodes to scan for an initial <mo>
   */
  export function fixInitialMO(configuration: ParseOptions, nodes: MmlNode[]) {
    for (let i = 0, m = nodes.length; i < m; i++) {
      let child = nodes[i];
      if (child && (!NodeUtil.isType(child, 'mspace') &&
                    (!NodeUtil.isType(child, 'TeXAtom') ||
                     (NodeUtil.getChildren(child)[0] &&
                      NodeUtil.getChildren(NodeUtil.getChildren(child)[0]).length)))) {
        if (NodeUtil.isEmbellished(child) ||
            (NodeUtil.isType(child, 'TeXAtom') && NodeUtil.getTexClass(child) === TEXCLASS.REL)) {
          let mi = configuration.nodeFactory.create('node', 'mi');
          nodes.unshift(mi);
        }
        break;
      }
    }
  }


  /**
   * Break up a string into text and math blocks.
   * @param {TexParser} parser The calling parser.
   * @param {string} text The text in the math expression to parse.
   * @param {number|string=} level The scriptlevel.
   * @param {string} font The mathvariant to use
   * @return {MmlNode[]} The nodes corresponding to the internal math expression.
   */
  export function internalMath(parser: TexParser, text: string,
                               level?: number | string, font?: string): MmlNode[] {
    if (parser.configuration.options.internalMath) {
      return parser.configuration.options.internalMath(parser, text, level, font);
    }
    let mathvariant = font || parser.stack.env.font;
    let def = (mathvariant ? {mathvariant} : {});
    let mml: MmlNode[] = [], i = 0, k = 0, c, node, match = '', braces = 0;
    if (text.match(/\\?[${}\\]|\\\(|\\(eq)?ref\s*\{/)) {
      while (i < text.length) {
        c = text.charAt(i++);
        if (c === '$') {
          if (match === '$' && braces === 0) {
            // @test Interspersed Text
            node = parser.create(
              'node', 'TeXAtom',
              [(new TexParser(text.slice(k, i - 1), {}, parser.configuration)).mml()]);
            mml.push(node);
            match = '';
            k = i;
          } else if (match === '') {
            // @test Interspersed Text
            if (k < i - 1) {
              // @test Interspersed Text
              mml.push(internalText(parser, text.slice(k, i - 1), def));
            }
            match = '$';
            k = i;
          }
        } else if (c === '{' && match !== '') {
          // @test Mbox Mbox, Mbox Math
          braces++;
        } else if (c === '}') {
          // @test Mbox Mbox, Mbox Math
          if (match === '}' && braces === 0) {
            // @test Mbox Eqref, Mbox Math
            let atom = (new TexParser(text.slice(k, i), {}, parser.configuration)).mml();
            node = parser.create('node', 'TeXAtom', [atom], def);
            mml.push(node);
            match = '';
            k = i;
          } else if (match !== '') {
            // @test Mbox Math, Mbox Mbox
            if (braces) {
              // @test Mbox Math, Mbox Mbox
              braces--;
            }
          }
        } else if (c === '\\') {
          // @test Mbox Eqref, Mbox CR
          if (match === '' && text.substr(i).match(/^(eq)?ref\s*\{/)) {
            // @test Mbox Eqref
            let len = ((RegExp as any)['$&'] as string).length;
            if (k < i - 1) {
              // @test Mbox Eqref
              mml.push(internalText(parser, text.slice(k, i - 1), def));
            }
            match = '}';
            k = i - 1;
            i += len;
          } else {
            // @test Mbox CR, Mbox Mbox
            c = text.charAt(i++);
            if (c === '(' && match === '') {
              // @test Mbox Internal Display
              if (k < i - 2) {
                // @test Mbox Internal Display
                mml.push(internalText(parser, text.slice(k, i - 2), def));
              }
              match = ')'; k = i;
            } else if (c === ')' && match === ')' && braces === 0) {
              // @test Mbox Internal Display
              node = parser.create(
                'node', 'TeXAtom',
                [(new TexParser(text.slice(k, i - 2), {}, parser.configuration)).mml()]);
              mml.push(node);
              match = '';
              k = i;
            } else if (c.match(/[${}\\]/) && match === '')  {
              // @test Mbox CR
              i--;
              text = text.substr(0, i - 1) + text.substr(i); // remove \ from \$, \{, \}, or \\
            }
          }
        }
      }
      if (match !== '') {
        // @test Internal Math Error
        throw new TexError('MathNotTerminated', 'Math not terminated in text box');
      }
    }
    if (k < text.length) {
      // @test Interspersed Text, Mbox Mbox
      mml.push(internalText(parser, text.slice(k), def));
    }
    if (level != null) {
      // @test Label, Fbox, Hbox
      mml = [parser.create('node', 'mstyle', mml, {displaystyle: false, scriptlevel: level})];
    } else if (mml.length > 1) {
      // @test Interspersed Text
      mml = [parser.create('node', 'mrow', mml)];
    }
    return mml;
  }


  /**
   * Parses text internal to boxes or labels.
   * @param {TexParser} parser The current tex parser.
   * @param {string} text The text to parse.
   * @param {EnvList} def The attributes of the text node.
   * @return {MmlNode} The text node.
   */
  export function internalText(parser: TexParser, text: string, def: EnvList): MmlNode {
    // @test Label, Fbox, Hbox
    text = text.replace(/^\s+/, entities.nbsp).replace(/\s+$/, entities.nbsp);
    let textNode = parser.create('text', text);
    return parser.create('node', 'mtext', [], def, textNode);
  }

  /**
   * Create an munderover node with the given script position.
   * @param {TexParser} parser   The current TeX parser.
   * @param {MmlNode} base       The base node.
   * @param {MmlNode} script     The under- or over-script.
   * @param {string} pos         Either 'over' or 'under'.
   * @param {boolean} stack      True if super- or sub-scripts should stack.
   * @return {MmlNode}           The generated node (MmlMunderover or TeXAtom)
   */
  export function underOver(parser: TexParser, base: MmlNode, script: MmlNode, pos: string, stack: boolean): MmlNode {
    // @test Overline
    ParseUtil.checkMovableLimits(base);
    if (NodeUtil.isType(base, 'munderover') && NodeUtil.isEmbellished(base)) {
      // @test Overline Limits
      NodeUtil.setProperties(NodeUtil.getCoreMO(base), {lspace: 0, rspace: 0});
      const mo = parser.create('node', 'mo', [], {rspace: 0});
      base = parser.create('node', 'mrow', [mo, base]);
      // TODO? add an empty <mi> so it's not embellished any more
    }
    const mml = parser.create('node', 'munderover', [base]) as MmlMunderover;
    NodeUtil.setChild(mml, pos === 'over' ?  mml.over : mml.under, script);
    let node: MmlNode = mml;
    if (stack) {
      // @test Overbrace 1 2 3, Underbrace, Overbrace Op 1 2
      node = parser.create('node', 'TeXAtom', [mml], {texClass: TEXCLASS.OP, movesupsub: true});
    }
    NodeUtil.setProperty(node, 'subsupOK', true);
    return node;
  }

  /**
   * Set movablelimits to false if necessary.
   * @param {MmlNode} base   The base node being tested.
   */
  export function checkMovableLimits(base: MmlNode) {
    const symbol = (NodeUtil.isType(base, 'mo') ? NodeUtil.getForm(base) : null);
    if (NodeUtil.getProperty(base, 'movablelimits') || (symbol && symbol[3] && symbol[3].movablelimits)) {
      // @test Overline Sum
      NodeUtil.setProperties(base, {movablelimits: false});
    }
  }

  /**
   * Trim spaces from a string.
   * @param {string} text The string to clean.
   * @return {string} The string with leading and trailing whitespace removed.
   */
  export function trimSpaces(text: string): string {
    if (typeof(text) !== 'string') {
      return text;
    }
    let TEXT = text.trim();
    if (TEXT.match(/\\$/) && text.match(/ $/)) {
      TEXT += ' ';
    }
    return TEXT;
  }


  /**
   * Sets alignment in array definitions.
   * @param {ArrayItem} array The array item.
   * @param {string} align The alignment string.
   * @return {ArrayItem} The altered array item.
   */
  export function setArrayAlign(array: ArrayItem, align: string): ArrayItem {
    // @test Array1, Array2, Array Test
    align = ParseUtil.trimSpaces(align || '');
    if (align === 't') {
      array.arraydef.align = 'baseline 1';
    } else if (align === 'b') {
      array.arraydef.align = 'baseline -1';
    } else if (align === 'c') {
      array.arraydef.align = 'axis';
    } else if (align) {
      array.arraydef.align = align;
    } // FIXME: should be an error?
    return array;
  }


  /**
   * Replace macro parameters with their values.
   * @param {TexParser} parser The current TeX parser.
   * @param {string[]} args A list of arguments for macro parameters.
   * @param {string} str The macro parameter string.
   * @return {string} The string with all parameters replaced by arguments.
   */
  export function substituteArgs(parser: TexParser, args: string[],
                                 str: string): string {
    let text = '';
    let newstring = '';
    let i = 0;
    while (i < str.length) {
      let c = str.charAt(i++);
      if (c === '\\') {
        text += c + str.charAt(i++);
      }
      else if (c === '#') {
        c = str.charAt(i++);
        if (c === '#') {
          text += c;
        } else {
          if (!c.match(/[1-9]/) || parseInt(c, 10) > args.length) {
            throw new TexError('IllegalMacroParam',
                                'Illegal macro parameter reference');
          }
          newstring = addArgs(parser, addArgs(parser, newstring, text),
                              args[parseInt(c, 10) - 1]);
          text = '';
        }
      } else {
        text += c;
      }
    }
    return addArgs(parser, newstring, text);
  }


  /**
   * Adds a new expanded argument to an already macro parameter string.  Makes
   * sure that macros are followed by a space if their names could accidentally
   * be continued into the following text.
   * @param {TexParser} parser The current TeX parser.
   * @param {string} s1 The already expanded string.
   * @param {string} s2 The string to add.
   * @return {string} The combined string.
   */
  export function addArgs(parser: TexParser, s1: string, s2: string): string {
    if (s2.match(/^[a-z]/i) && s1.match(/(^|[^\\])(\\\\)*\\[a-z]+$/i)) {
      s1 += ' ';
    }
    if (s1.length + s2.length > parser.configuration.options['maxBuffer']) {
      throw new TexError('MaxBufferSize',
                          'MathJax internal buffer size exceeded; is there a' +
                          ' recursive macro call?');
    }
    return s1 + s2;
  }

  /**
   * Report an error if there are too many macro substitutions.
   * @param {TexParser} parser The current TeX parser.
   * @param {boolean} isMacro  True if we are substituting a macro, false for environment.
   */
  export function checkMaxMacros(parser: TexParser, isMacro: boolean = true) {
    if (++parser.macroCount <= parser.configuration.options['maxMacros']) {
      return;
    }
    if (isMacro) {
      throw new TexError('MaxMacroSub1',
                         'MathJax maximum macro substitution count exceeded; ' +
                         'is here a recursive macro call?');
    } else {
      throw new TexError('MaxMacroSub2',
                         'MathJax maximum substitution count exceeded; ' +
                         'is there a recursive latex environment?');
    }
  }


  /**
   *  Check for bad nesting of equation environments
   */
  export function checkEqnEnv(parser: TexParser) {
    if (parser.stack.global.eqnenv) {
      // @test ErroneousNestingEq
      throw new TexError('ErroneousNestingEq', 'Erroneous nesting of equation structures');
    }
    parser.stack.global.eqnenv = true;
  }

  /**
   * Copy an MmlNode and add it (and its children) to the proper lists.
   *
   * @param {MmlNode} node       The MmlNode to copy
   * @param {TexParser} parser   The active tex parser
   * @return {MmlNode}           The duplicate tree
   */
  export function copyNode(node: MmlNode, parser: TexParser): MmlNode  {
    const tree = node.copy() as MmlNode;
    const options = parser.configuration;
    tree.walkTree((n: MmlNode) => {
      options.addNode(n.kind, n);
      const lists = (n.getProperty('in-lists') as string || '').split(/,/);
      for (const list of lists) {
        list && options.addNode(list, n);
      }
    });
    return tree;
  }

  /**
   * This is a placeholder for future security filtering of attributes.
   * @param {TexParser} parser The current parser.
   * @param {string} name The attribute name.
   * @param {string} value The attribute value to filter.
   * @return {string} The filtered value.
   */
  export function MmlFilterAttribute(_parser: TexParser, _name: string, value: string): string {
    // TODO: Implement in security package.
    return value;
  }


  /**
   * Initialises an stack environment with current font definition in the parser.
   * @param {TexParser} parser The current tex parser.
   * @return {EnvList} The initialised environment list.
   */
  export function getFontDef(parser: TexParser): EnvList {
    const font = parser.stack.env['font'];
    return (font ? {mathvariant: font} : {});
  }


  /**
   * Splits a package option list of the form [x=y,z=1] into an attribute list
   * of the form {x: y, z: 1}.
   * @param {string} attrib The attributes of the package.
   * @param {{[key: string]: number}?} allowed A list of allowed options. If
   *     given only allowed arguments are returned.
   * @param {boolean?} error If true, raises an exception if not allowed options
   *     are found.
   * @return {EnvList} The attribute list.
   */
  export function keyvalOptions(attrib: string,
                                allowed: {[key: string]: number} = null,
                                error: boolean = false): EnvList {
    let def: EnvList = readKeyval(attrib);
    if (allowed) {
      for (let key of Object.keys(def)) {
        if (!allowed.hasOwnProperty(key)) {
          if (error) {
            throw new TexError('InvalidOption', 'Invalid option: %1', key);
          }
          delete def[key];
        }
      }
    }
    return def;
  }


  /**
   * Implementation of the keyval function from https://www.ctan.org/pkg/keyval
   * @param {string} text The optional parameter string for a package or
   *     command.
   * @return {EnvList} Set of options as key/value pairs.
   */
  function readKeyval(text: string): EnvList {
    let options: EnvList = {};
    let rest = text;
    let end, key, val;
    while (rest) {
      [key, end, rest] = readValue(rest, ['=', ',']);
      if (end === '=') {
        [val, end, rest] = readValue(rest, [',']);
        val = (val === 'false' || val === 'true') ?
            JSON.parse(val) : val;
        options[key] = val;
      } else if (key) {
        options[key] = true;
      }
    }
    return options;
  }


  /**
   * Removes pairs of outer braces.
   * @param {string} text The string to clean.
   * @param {number} count The number of outer braces to slice off.
   * @return {string} The cleaned string.
   */
  function removeBraces(text: string, count: number): string {
    while (count > 0) {
      text = text.trim().slice(1, -1);
      count--;
    }
    return text.trim();
  }


  /**
   * Read a value from the given string until an end parameter is reached or
   * string is exhausted.
   * @param {string} text The string to process.
   * @param {string[]} end List of possible end characters.
   * @return {[string, string, string]} The collected value, the actual end
   *     character, and the rest of the string still to parse.
   */
  function readValue(text: string, end: string[]): [string, string, string] {
    let length = text.length;
    let braces = 0;
    let value = '';
    let index = 0;
    let start = 0;             // Counter for the starting left braces.
    let startCount = true;     // Flag for counting starting left braces.
    let stopCount = false;     // If true right braces are found directly
                               // after starting braces, but no other char yet.
    while (index < length) {
      let c = text[index++];
      switch (c) {
      case ' ':                // Ignore spaces.
        break;
      case '{':
        if (startCount) {      // Count start left braces at start.
          start++;
        } else {
          stopCount = false;
          if (start > braces) {   // Some start left braces have been closed.
            start = braces;
          }
        }
        braces++;
        break;
      case '}':
        if (braces) {          // Closing braces.
          braces--;
        }
        if (startCount || stopCount) {  // Closing braces at the start.
          start--;
          stopCount = true;    // Continue to close braces.
        }
        startCount = false;    // Stop counting start left braces.
        break;
      default:
        if (!braces && end.indexOf(c) !== -1) {   // End character reached.
          return [stopCount ? 'true' :            // If Stop count is true we
                                                  // have balanced braces, only.
                  removeBraces(value, start), c, text.slice(index)];
        }
        startCount = false;
        stopCount = false;
      }
      value += c;
    }
    if (braces) {
      throw new TexError('ExtraOpenMissingClose',
                         'Extra open brace or missing close brace');
    }
    return [stopCount ? 'true' : removeBraces(value, start), '', text.slice(index)];
  }

}

export default ParseUtil;
