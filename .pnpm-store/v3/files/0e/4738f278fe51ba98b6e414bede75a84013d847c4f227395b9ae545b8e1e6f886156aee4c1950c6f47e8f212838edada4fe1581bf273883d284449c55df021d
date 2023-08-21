/*************************************************************
 *
 *  Copyright (c) 2020-2022 The MathJax Consortium
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
 * @fileoverview  Method definitions for the textmacros package
 *
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */

import TexParser from '../TexParser.js';
import {retryAfter} from '../../../util/Retries.js';
import {TextParser} from './TextParser.js';
import BaseMethods from '../base/BaseMethods.js';

/**
 * The methods used to implement the text-mode macros
 */
export const TextMacrosMethods = {

  /**
   * @param {TextParser} parser   The text-mode parser
   * @param {string} c            The character that called this function
   */
  Comment(parser: TextParser, _c: string) {
    while (parser.i < parser.string.length && parser.string.charAt(parser.i) !== '\n') {
      parser.i++;
    }
    parser.i++;
  },

  /**
   * @param {TextParser} parser   The text-mode parser
   * @param {string} open         The delimiter used to open math-mode in text-mode
   */
  Math(parser: TextParser, open: string) {
    parser.saveText();
    let i = parser.i;
    let j, c;
    let braces = 0;
    //
    // Loop through the string looking for the closing delimiter, while matching braces
    //
    while ((c = parser.GetNext())) {
      j = parser.i++;
      switch (c) {

      case '\\':
        const cs = parser.GetCS();
        if (cs === ')') c = '\\(';  // \( is the opening delimiter for \)
      case '$':
        //
        //  If there are no unbalanced braces and we have found the close delimiter,
        //    process the contents of the delimiters in math mode (using the original TeX parser)
        //
        if (braces === 0 && open === c) {
          const config = parser.texParser.configuration;
          const mml = (new TexParser(parser.string.substr(i, j - i), parser.stack.env, config)).mml();
          parser.PushMath(mml);
          return;
        }
        break;

      case '{':
        braces++;
        break;

      case '}':
        if (braces === 0) {
          parser.Error('ExtraCloseMissingOpen', 'Extra close brace or missing open brace');
        }
        braces--;
        break;
      }
    }
    parser.Error('MathNotTerminated', 'Math-mode is not properly terminated');
  },

  /**
   * @param {TextParser} parser   The text-mode parser
   * @param {string} c            The character that called this function
   */
  MathModeOnly(parser: TextParser, c: string) {
    parser.Error('MathModeOnly', '\'%1\' allowed only in math mode', c);
  },

  /**
   * @param {TextParser} parser   The text-mode parser
   * @param {string} c            The character that called this function
   */
  Misplaced(parser: TextParser, c: string) {
    parser.Error('Misplaced', '\'%1\' can not be used here', c);
  },

  /**
   * @param {TextParser} parser   The text-mode parser
   * @param {string} c            The character that called this function
   */
  OpenBrace(parser: TextParser, _c: string) {
    //
    //  Save the current stack environment and make a copy of it for
    //    use within the braced group.
    //
    const env = parser.stack.env;
    parser.envStack.push(env);
    parser.stack.env = Object.assign({}, env);
  },

  /**
   * @param {TextParser} parser   The text-mode parser
   * @param {string} c            The character that called this function
   */
  CloseBrace(parser: TextParser, _c: string) {
    //
    //  Restore the saved stack environment, if there was one
    //
    if (parser.envStack.length) {
      parser.saveText();
      parser.stack.env = parser.envStack.pop();
    } else {
      parser.Error('ExtraCloseMissingOpen', 'Extra close brace or missing open brace');
    }
  },

  /**
   * @param {TextParser} parser   The text-mode parser
   * @param {string} c            The character that called this function
   */
  OpenQuote(parser: TextParser, c: string) {
    //
    //  Handle smart open quotes
    //
    if (parser.string.charAt(parser.i) === c) {
      parser.text += '\u201C';
      parser.i++;
    } else {
      parser.text += '\u2018';
    }
  },

  /**
   * @param {TextParser} parser   The text-mode parser
   * @param {string} c            The character that called this function
   */
  CloseQuote(parser: TextParser, c: string) {
    //
    //  Handle smart close quotes
    //
    if (parser.string.charAt(parser.i) === c) {
      parser.text += '\u201D';
      parser.i++;
    } else {
      parser.text += '\u2019';
    }
  },

  /**
   * @param {TextParser} parser   The text-mode parser
   * @param {string} c            The character that called this function
   */
  Tilde(parser: TextParser, _c: string) {
    parser.text += '\u00A0';  // non-breaking space
  },

  /**
   * @param {TextParser} parser   The text-mode parser
   * @param {string} c            The character that called this function
   */
  Space(parser: TextParser, _c: string) {
    parser.text += ' ';  // regular space, but skipping multiple spaces
    while (parser.GetNext().match(/\s/)) parser.i++;
  },

  /**
   * @param {TextParser} parser   The text-mode parser
   * @param {string} name         The control sequence that called this function
   */
  SelfQuote(parser: TextParser, name: string) {
    parser.text += name.substr(1);  // add in the quoted character
  },

  /**
   * @param {TextParser} parser   The text-mode parser
   * @param {string} name         The control sequence that called this function
   * @param {string} c            The character to insert into the string
   */
  Insert(parser: TextParser, _name: string, c: string) {
    parser.text += c;
  },

  /**
   * @param {TextParser} parser   The text-mode parser
   * @param {string} name         The control sequence that called this function
   * @param {string} c            The character to insert into the string
   */
  Accent(parser: TextParser, name: string, c: string) {
    //
    //  Create an accented character using mover
    //
    const base = parser.ParseArg(name);
    const accent = parser.create('token', 'mo', {}, c);
    parser.addAttributes(accent);
    parser.Push(parser.create('node', 'mover', [base, accent]));
  },

  /**
   * @param {TextParser} parser   The text-mode parser
   * @param {string} name         The control sequence that called this function
   */
  Emph(parser: TextParser, name: string) {
    //
    //  Switch to/from italics
    //
    const variant = (parser.stack.env.mathvariant === '-tex-mathit' ? 'normal' : '-tex-mathit');
    parser.Push(parser.ParseTextArg(name, {mathvariant: variant}));
  },

  /**
   * @param {TextParser} parser   The text-mode parser
   * @param {string} name         The control sequence that called this function
   * @param {string} variant      The font variant to use from now on
   */
  SetFont(parser: TextParser, _name: string, variant: string) {
    parser.saveText();
    parser.stack.env.mathvariant = variant;
  },

  /**
   * @param {TextParser} parser   The text-mode parser
   * @param {string} name         The control sequence that called this function
   * @param {number} size         The font size to use from now on
   */
  SetSize(parser: TextParser, _name: string, size: number) {
    parser.saveText();
    parser.stack.env.mathsize = size;
  },

  /**
   * @param {TextParser} parser   The text-mode parser
   * @param {string} name         The control sequence that called this function
   */
  CheckAutoload(parser: TextParser, name: string) {
    const autoload = parser.configuration.packageData.get('autoload');
    const texParser = parser.texParser;
    name = name.slice(1);
    //
    // Check if a macro is undefined, or currently set to autoload an extension.
    // If so, process the macro in the original TexParser:
    //    This will handle the undefined macro using the TeX parser's configuration, then return,
    //    or will cause the autoloaded extension to load or be processed and restart the expression.
    // Otherwise, process the macro in text mode.
    //
    const macro = texParser.lookup('macro', name);
    if (!macro || (autoload && macro._func === autoload.Autoload)) {
      texParser.parse('macro', [texParser, name]);
      if (!macro) return;
      retryAfter(Promise.resolve());
    }
    texParser.parse('macro', [parser, name]);
  },

  //
  // Copy some methods from the base package
  //
  Macro: BaseMethods.Macro,
  Spacer: BaseMethods.Spacer,
  Hskip: BaseMethods.Hskip,
  rule: BaseMethods.rule,
  Rule: BaseMethods.Rule,
  HandleRef: BaseMethods.HandleRef

};

