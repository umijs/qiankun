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
 * @fileoverview The TexParser. Implements the basic parsing functionality and
 *     administers the global stack and tree objects.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import ParseUtil from './ParseUtil.js';
import {HandlerType} from './MapHandler.js';
import Stack from './Stack.js';
import StackItemFactory from './StackItemFactory.js';
import {Tags} from './Tags.js';
import TexError from './TexError.js';
import {MmlNode, AbstractMmlNode} from '../../core/MmlTree/MmlNode.js';
import {ParseInput, ParseResult} from './Types.js';
import ParseOptions from './ParseOptions.js';
import {StackItem, EnvList} from './StackItem.js';
import {Symbol} from './Symbol.js';
import {OptionList} from '../../util/Options.js';


/**
 * The main Tex Parser class.
 */
export default class TexParser {

  /**
   * Counter for recursive macros.
   * @type {number}
   */
  public macroCount: number = 0;

  /**
   * The stack for items and created nodes.
   * @type {Stack}
   */
  public stack: Stack;

  /**
   * Current position in the string that is parsed.
   * @type {number}
   */
  public i: number = 0;

  /**
   * The last command sequence
   * @type {string}
   */
  public currentCS: string = '';

  /**
   * @constructor
   * @param {string} string The string to parse.
   * @param {EnvList} env The intial environment representing the current parse
   *     state of the overall expression translation.
   * @param {ParseOptions} configuration A parser configuration.
   */
  constructor(private _string: string, env: EnvList, public configuration: ParseOptions) {
    const inner = env.hasOwnProperty('isInner');
    const isInner = env['isInner'] as boolean;
    delete env['isInner'];
    let ENV: EnvList;
    if (env) {
      ENV = {};
      for (const id of Object.keys(env)) {
        ENV[id] = env[id];
      }
    }
    this.configuration.pushParser(this);
    this.stack = new Stack(this.itemFactory, ENV, inner ? isInner : true);
    this.Parse();
    this.Push(this.itemFactory.create('stop'));
  }

  /**
   * @return {OptionList} The configuration options.
   */
  get options(): OptionList {
    return this.configuration.options;
  }

  /**
   * @return {StackItemFactory} The factory for stack items.
   */
  get itemFactory(): StackItemFactory {
    return this.configuration.itemFactory;
  }

  /**
   * @return {Tags} The tags style of this configuration.
   */
  get tags(): Tags {
    return this.configuration.tags;
  }

  /**
   * Sets the string that should be parsed.
   * @param {string} str The new string to parse.
   */
  set string(str: string) {
    this._string = str;
  }

  /**
   * @return {string} The string that is currently parsed.
   */
  get string(): string {
    return this._string;
  }


  /**
   * Parses the input with the specified kind of map.
   * @param {HandlerType} kind Configuration name.
   * @param {ParseInput} input Input to be parsed.
   * @return {ParseResult} The output of the parsing function.
   */
  public parse(kind: HandlerType, input: ParseInput): ParseResult {
    return this.configuration.handlers.get(kind).parse(input);
  }


  /**
   * Maps a symbol to its "parse value" if it exists.
   * @param {HandlerType} kind Configuration name.
   * @param {string} symbol The symbol to parse.
   * @return {any} A boolean, Character, or Macro.
   */
  public lookup(kind: HandlerType, symbol: string): any {
    return this.configuration.handlers.get(kind).lookup(symbol);
  }


  /**
   * Checks if a symbol is contained in one of the symbol mappings of the
   * specified kind.
   * @param {HandlerType} kind Configuration name.
   * @param {string} symbol The symbol to parse.
   * @return {boolean} True if the symbol is contained in the given types of
   *     symbol mapping.
   */
  public contains(kind: HandlerType, symbol: string): boolean {
    return this.configuration.handlers.get(kind).contains(symbol);
  }


  /**
   * @override
   */
  public toString(): string {
    let str = '';
    for (const config of Array.from(this.configuration.handlers.keys())) {
      str += config + ': ' +
        this.configuration.handlers.get(config as HandlerType) + '\n';
    }
    return str;
  }


  /**
   * Parses the current input string.
   */
  public Parse() {
    let c: string;
    while (this.i < this.string.length) {
      c = this.getCodePoint();
      this.i += c.length;
      this.parse('character', [this, c]);
    }
  }


  /**
   * Pushes a new item onto the stack. The item can also be a Mml node,
   *   but if the mml item is an inferred row, push its children instead.
   * @param {StackItem|MmlNode} arg The new item.
   */
  public Push(arg: StackItem | MmlNode) {
    if (arg instanceof AbstractMmlNode && arg.isInferred) {
      this.PushAll(arg.childNodes);
    } else {
      this.stack.Push(arg);
    }
  }


  /**
   * Pushes a list of new items onto the stack.
   * @param {StackItem|MmlNode[]} args The new items.
   */
  public PushAll(args: (StackItem | MmlNode)[]) {
    for (const arg of args) {
      this.stack.Push(arg);
    }
  }


  /**
   * @return {MmlNode} The internal Mathml structure.
   */
  public mml(): MmlNode {
    if (!this.stack.Top().isKind('mml')) {
      return null;
    }
    let node = this.stack.Top().First;
    this.configuration.popParser();
    return node;
  }

  /************************************************************************
   *
   *   String handling routines
   */

  /**
   * Convert delimiter to character.
   * @param {string} c The delimiter name.
   * @return {string} The corresponding character.
   */
  public convertDelimiter(c: string): string {
    const symbol = this.lookup('delimiter', c) as Symbol;
    return symbol ? symbol.char : null;
  }

  /**
   * @return {string}   Get the next unicode character in the string
   */
  public getCodePoint(): string {
    const code = this.string.codePointAt(this.i);
    return code === undefined ? '' : String.fromCodePoint(code);
  }

  /**
   * @return {boolean} True if the next character to parse is a space.
   */
  public nextIsSpace(): boolean {
    return !!this.string.charAt(this.i).match(/\s/);
  }

  /**
   * @return {string} Get the next non-space character.
   */
  public GetNext(): string {
    while (this.nextIsSpace()) {
      this.i++;
    }
    return this.getCodePoint();
  }

  /**
   * @return {string} Get and return a control-sequence name
   */
  public GetCS(): string {
    let CS = this.string.slice(this.i).match(/^(([a-z]+) ?|[\uD800-\uDBFF].|.)/i);
    if (CS) {
      this.i += CS[0].length;
      return CS[2] || CS[1];
    } else {
      this.i++;
      return ' ';
    }
  }

  /**
   * Get and return a TeX argument (either a single character or control
   *     sequence, or the contents of the next set of braces).
   * @param {string} name Name of the current control sequence.
   * @param {boolean} noneOK? True if no argument is OK.
   * @return {string} The next argument.
   */
  public GetArgument(_name: string, noneOK?: boolean): string {
    switch (this.GetNext()) {
    case '':
      if (!noneOK) {
        // @test MissingArgFor
        throw new TexError('MissingArgFor', 'Missing argument for %1', this.currentCS);
      }
      return null;
    case '}':
      if (!noneOK) {
        // @test ExtraCloseMissingOpen
        throw new TexError('ExtraCloseMissingOpen',
                            'Extra close brace or missing open brace');
      }
      return null;
    case '\\':
      this.i++;
      return '\\' + this.GetCS();
    case '{':
      let j = ++this.i, parens = 1;
      while (this.i < this.string.length) {
        switch (this.string.charAt(this.i++)) {
        case '\\':  this.i++; break;
        case '{':   parens++; break;
        case '}':
          if (--parens === 0) {
            return this.string.slice(j, this.i - 1);
          }
          break;
        }
      }
      // @test MissingCloseBrace
      throw new TexError('MissingCloseBrace', 'Missing close brace');
    }
    const c = this.getCodePoint();
    this.i += c.length;
    return c;
  }


  /**
   * Get an optional LaTeX argument in brackets.
   * @param {string} name Name of the current control sequence.
   * @param {string} def? The default value for the optional argument.
   * @return {string} The optional argument.
   */
  public GetBrackets(_name: string, def?: string): string {
    if (this.GetNext() !== '[') {
      return def;
    }
    let j = ++this.i, parens = 0;
    while (this.i < this.string.length) {
      switch (this.string.charAt(this.i++)) {
      case '{':   parens++; break;
      case '\\':  this.i++; break;
      case '}':
        if (parens-- <= 0) {
          // @test ExtraCloseLooking1
          throw new TexError('ExtraCloseLooking',
                              'Extra close brace while looking for %1', '\']\'');
        }
        break;
      case ']':
        if (parens === 0) {
          return this.string.slice(j, this.i - 1);
        }
        break;
      }
    }
    // @test MissingCloseBracket
    throw new TexError('MissingCloseBracket',
                        'Could not find closing \']\' for argument to %1', this.currentCS);
  }

  /**
   *  Get the name of a delimiter (check it in the delimiter list).
   * @param {string} name Name of the current control sequence.
   * @param {boolean} braceOK? Are braces around the delimiter OK.
   * @return {string} The delimiter name.
   */
  public GetDelimiter(name: string, braceOK?: boolean): string {
    let c = this.GetNext(); this.i += c.length;
    if (this.i <= this.string.length) {
      if (c === '\\') {
        c += this.GetCS();
      } else if (c === '{' && braceOK) {
        this.i--;
        c = this.GetArgument(name).trim();
      }
      if (this.contains('delimiter', c)) {
        return this.convertDelimiter(c);
      }
    }
    // @test MissingOrUnrecognizedDelim1, MissingOrUnrecognizedDelim2
    throw new TexError('MissingOrUnrecognizedDelim',
                        'Missing or unrecognized delimiter for %1', this.currentCS);
  }

  /**
   * Get a dimension (including its units).
   * @param {string} name Name of the current control sequence.
   * @return {string} The dimension string.
   */
  public GetDimen(name: string): string {
    if (this.GetNext() === '{') {
      let dimen = this.GetArgument(name);
      let [value, unit] = ParseUtil.matchDimen(dimen);
      if (value) {
        // @test Raise In Line, Lower 2, (Raise|Lower) Negative
        return value + unit;
      }
    } else {
      // @test Above, Raise, Lower, Modulo, Above With Delims
      let dimen = this.string.slice(this.i);
      let [value, unit, length] = ParseUtil.matchDimen(dimen, true);
      if (value) {
        this.i += length;
        return value + unit;
      }
    }
    // @test MissingDimOrUnits
    throw new TexError('MissingDimOrUnits',
                        'Missing dimension or its units for %1', this.currentCS);
  }

  /**
   *  Get everything up to the given control sequence (token)
   * @param {string} name Name of the current control sequence.
   * @param {string} token The element until where to parse.
   * @return {string} The text between the current position and the given token.
   */
  public GetUpTo(_name: string, token: string): string {
    while (this.nextIsSpace()) {
      this.i++;
    }
    let j = this.i;
    let parens = 0;
    while (this.i < this.string.length) {
      let k = this.i;
      let c = this.GetNext(); this.i += c.length;
      switch (c) {
      case '\\':  c += this.GetCS(); break;
      case '{':   parens++; break;
      case '}':
        if (parens === 0) {
          // @test ExtraCloseLooking2
          throw new TexError('ExtraCloseLooking',
                              'Extra close brace while looking for %1', token);
        }
        parens--;
        break;
      }
      if (parens === 0 && c === token) {
        return this.string.slice(j, k);
      }
    }
    // @test TokenNotFoundForCommand
    throw new TexError('TokenNotFoundForCommand',
                        'Could not find %1 for %2', token, this.currentCS);
  }

  /**
   * Parse the arguments of a control sequence in a new parser instance.
   * @param {string} name Name of the current control sequence.
   * @return {MmlNode} The parsed node.
   */
  public ParseArg(name: string): MmlNode  {
    return new TexParser(this.GetArgument(name), this.stack.env,
                         this.configuration).mml();
  }

  /**
   * Parses a given string up to a given token in a new parser instance.
   * @param {string} name Name of the current control sequence.
   * @param {string} token A Token at which to end parsing.
   * @return {MmlNode} The parsed node.
   */
  public ParseUpTo(name: string, token: string): MmlNode {
    return new TexParser(this.GetUpTo(name, token), this.stack.env,
                         this.configuration).mml();
  }


  /**
   * Get a delimiter or empty argument
   * @param {string} name Name of the current control sequence.
   * @return {string} The delimiter.
   */
  public GetDelimiterArg(name: string): string {
    let c = ParseUtil.trimSpaces(this.GetArgument(name));
    if (c === '') {
      return null;
    }
    if (this.contains('delimiter', c)) {
      return c;
    }
    // @test MissingOrUnrecognizedDelim
    throw new TexError('MissingOrUnrecognizedDelim',
                        'Missing or unrecognized delimiter for %1', this.currentCS);
  }

  /**
   * @return {boolean} True if a star follows the control sequence name.
   */
  public GetStar(): boolean {
    let star = (this.GetNext() === '*');
    if (star) {
      this.i++;
    }
    return star;
  }


  /**
   * Convenience method to create nodes with the node factory of the current
   * configuration.
   * @param {string} kind The kind of node to create.
   * @param {any[]} ...rest The remaining arguments for the creation method.
   * @return {MmlNode} The newly created node.
   */
  public create(kind: string, ...rest: any[]): MmlNode {
    return this.configuration.nodeFactory.create(kind, ...rest);
  }


}
