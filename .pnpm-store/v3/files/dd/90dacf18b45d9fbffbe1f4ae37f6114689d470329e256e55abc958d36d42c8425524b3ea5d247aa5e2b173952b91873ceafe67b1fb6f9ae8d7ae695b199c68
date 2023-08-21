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
 * @fileoverview Utility functions for the newcommand package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */


import ParseUtil from '../ParseUtil.js';
import TexError from '../TexError.js';
import TexParser from '../TexParser.js';
import {Macro, Symbol} from '../Symbol.js';
import {Args, Attributes, ParseMethod} from '../Types.js';
import * as sm from '../SymbolMap.js';


namespace NewcommandUtil {

  /**
   * Transforms the attributes of a symbol into the arguments of a macro. E.g.,
   * Symbol('ell', 'l', {mathvariant: "italic"}) is turned into Macro arguments:
   * ['ell', 'l', 'mathvariant', 'italic'].
   *
   * @param {string} name The command name for the symbol.
   * @param {Symbol} symbol The symbol associated with name.
   * @return {Args[]} Arguments for a macro.
   */
  export function disassembleSymbol(name: string, symbol: Symbol): Args[] {
    let newArgs = [name, symbol.char] as Args[];
    // @test Let Relet, Let Let, Let Circular Macro
    if (symbol.attributes) {
      // @test Let Relet
      for (let key in symbol.attributes) {
        newArgs.push(key);
        newArgs.push(symbol.attributes[key] as Args);
      }
    }
    return newArgs;
  }


  /**
   * Assembles a symbol from a list of macro arguments. This is the inverse
   * method of the one above.
   *
   * @param {Args[]} args The arguments of the macro.
   * @return {Symbol} The Symbol generated from the arguments..
   */
  export function assembleSymbol(args: Args[]): Symbol {
    // @test Let Relet, Let Let, Let Circular Macro
    let name = args[0] as string;
    let char = args[1] as string;
    let attrs: Attributes = {};
    for (let i = 2; i < args.length; i = i + 2) {
      // @test Let Relet
      attrs[args[i] as string] = args[i + 1];
    }
    return new Symbol(name, char, attrs);
  }

  /**
   * Get the next CS name or give an error.
   * @param {TexParser} parser The calling parser.
   * @param {string} cmd The string starting with a control sequence.
   * @return {string} The control sequence.
   */
  export function GetCSname(parser: TexParser, cmd: string): string {
    // @test Def ReDef, Let Bar, Let Brace Equal
    let c = parser.GetNext();
    if (c !== '\\') {
      // @test No CS
      throw new TexError('MissingCS',
                          '%1 must be followed by a control sequence', cmd);
    }
    let cs = ParseUtil.trimSpaces(parser.GetArgument(cmd));
    return cs.substr(1);
  }

  /**
   * Get a control sequence name as an argument (doesn't require the backslash)
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro that is getting the name.
   * @return {string} The control sequence.
   */
  export function GetCsNameArgument(parser: TexParser, name: string): string {
    let cs = ParseUtil.trimSpaces(parser.GetArgument(name));
    if (cs.charAt(0) === '\\') {
      // @test Newcommand Simple
      cs = cs.substr(1);
    }
    if (!cs.match(/^(.|[a-z]+)$/i)) {
      // @test Illegal CS
      throw new TexError('IllegalControlSequenceName',
                         'Illegal control sequence name for %1', name);
    }
    return cs;
  }

  /**
   * Get the number of arguments for a macro definition
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro that is getting the argument count.
   * @return {string} The number of arguments (or blank).
   */
  export function GetArgCount(parser: TexParser, name: string): string {
    let n = parser.GetBrackets(name);
    if (n) {
      // @test Newcommand Optional, Newcommand Arg, Newcommand Arg Optional
      // @test Newenvironment Optional, Newenvironment Arg Optional
      n = ParseUtil.trimSpaces(n);
      if (!n.match(/^[0-9]+$/)) {
        // @test Illegal Argument Number
        throw new TexError('IllegalParamNumber',
                           'Illegal number of parameters specified in %1', name);
      }
    }
    return n;
  }

  /**
   * Get a \def parameter template.
   * @param {TexParser} parser The calling parser.
   * @param {string} cmd The string starting with the template.
   * @param {string} cs The control sequence of the \def.
   * @return {number | string[]} The number of parameters or a string array if
   *     there is an optional argument.
   */
  export function GetTemplate(parser: TexParser, cmd: string, cs: string): number | string[] {
    // @test Def Double Let, Def ReDef, Def Let
    let c = parser.GetNext();
    let params: string[] = [];
    let n = 0;
    let i = parser.i;
    while (parser.i < parser.string.length) {
      c = parser.GetNext();
      if (c === '#') {
        // @test Def ReDef, Def Let, Def Optional Brace
        if (i !== parser.i) {
          // @test Def Let, Def Optional Brace
          params[n] = parser.string.substr(i, parser.i - i);
        }
        c = parser.string.charAt(++parser.i);
        if (!c.match(/^[1-9]$/)) {
          // @test Illegal Hash
          throw new TexError('CantUseHash2',
                              'Illegal use of # in template for %1', cs);
        }
        if (parseInt(c) !== ++n) {
          // @test No Sequence
          throw new TexError('SequentialParam',
                              'Parameters for %1 must be numbered sequentially', cs);
        }
        i = parser.i + 1;
      } else if (c === '{') {
        // @test Def Double Let, Def ReDef, Def Let
        if (i !== parser.i) {
          // @test Optional Brace Error
          params[n] = parser.string.substr(i, parser.i - i);
        }
        if (params.length > 0) {
          // @test Def Let, Def Optional Brace
          return [n.toString()].concat(params);
        } else {
          // @test Def Double Let, Def ReDef
          return n;
        }
      }
      parser.i++;
    }
    // @test No Replacement
    throw new TexError('MissingReplacementString',
                        'Missing replacement string for definition of %1', cmd);
  }


  /**
   * Find a single parameter delimited by a trailing template.
   * @param {TexParser} parser The calling parser.
   * @param {string} name The name of the calling command.
   * @param {string} param The parameter for the macro.
   */
  export function GetParameter(parser: TexParser, name: string, param: string) {
    if (param == null) {
      // @test Def Let, Def Optional Brace, Def Options CS
      return parser.GetArgument(name);
    }
    let i = parser.i;
    let j = 0;
    let hasBraces = 0;
    while (parser.i < parser.string.length) {
      let c = parser.string.charAt(parser.i);
      // @test Def Let, Def Optional Brace, Def Options CS
      if (c === '{') {
        // @test Def Optional Brace, Def Options CS
        if (parser.i === i) {
          // @test Def Optional Brace
          hasBraces = 1;
        }
        parser.GetArgument(name);
        j = parser.i - i;
      } else if (MatchParam(parser, param)) {
        // @test Def Let, Def Optional Brace, Def Options CS
        if (hasBraces) {
          // @test Def Optional Brace
          i++;
          j -= 2;
        }
        return parser.string.substr(i, j);
      } else if (c === '\\') {
        // @test Def Options CS
        parser.i++;
        j++;
        hasBraces = 0;
        let match = parser.string.substr(parser.i).match(/[a-z]+|./i);
        if (match) {
          // @test Def Options CS
          parser.i += match[0].length;
          j = parser.i - i;
        }
      } else {
        // @test Def Let
        parser.i++;
        j++;
        hasBraces = 0;
      }
    }
    // @test Runaway Argument
    throw new TexError('RunawayArgument', 'Runaway argument for %1?', name);
  }


  /**
   * Check if a template is at the current location.
   * (The match must be exact, with no spacing differences. TeX is
   *  a little more forgiving than this about spaces after macro names)
   * @param {TexParser} parser The calling parser.
   * @param {string} param Tries to match an optional parameter.
   * @return {number} The number of optional parameters, either 0 or 1.
   */
  export function MatchParam(parser: TexParser, param: string): number {
    // @test Def Let, Def Optional Brace, Def Options CS
    if (parser.string.substr(parser.i, param.length) !== param) {
      // @test Def Let, Def Options CS
      return 0;
    }
    if (param.match(/\\[a-z]+$/i) &&
        parser.string.charAt(parser.i + param.length).match(/[a-z]/i)) {
      // @test (missing)
      return 0;
    }
    // @test Def Let, Def Optional Brace, Def Options CS
    parser.i += param.length;
    return 1;
  }


  /**
   * Adds a new delimiter as extension to the parser.
   * @param {TexParser} parser The current parser.
   * @param {string} cs The control sequence of the delimiter.
   * @param {string} char The corresponding character.
   * @param {Attributes} attr The attributes needed for parsing.
   */
  export function addDelimiter(parser: TexParser, cs: string, char: string, attr: Attributes) {
    const handlers = parser.configuration.handlers;
    const handler = handlers.retrieve(NEW_DELIMITER) as sm.DelimiterMap;
    handler.add(cs, new Symbol(cs, char, attr));
  }

  /**
   * Adds a new macro as extension to the parser.
   * @param {TexParser} parser The current parser.
   * @param {string} cs The control sequence of the delimiter.
   * @param {ParseMethod} func The parse method for this macro.
   * @param {Args[]} attr The attributes needed for parsing.
   * @param {string=} symbol Optionally original symbol for macro, in case it is
   *     different from the control sequence.
   */
  export function addMacro(parser: TexParser, cs: string, func: ParseMethod, attr: Args[],
                           symbol: string = '') {
    const handlers = parser.configuration.handlers;
    const handler = handlers.retrieve(NEW_COMMAND) as sm.CommandMap;
    handler.add(cs, new Macro(symbol ? symbol : cs, func, attr));
  }


  /**
   * Adds a new environment as extension to the parser.
   * @param {TexParser} parser The current parser.
   * @param {string} env The environment name.
   * @param {ParseMethod} func The parse method for this macro.
   * @param {Args[]} attr The attributes needed for parsing.
   */
  export function addEnvironment(parser: TexParser, env: string, func: ParseMethod, attr: Args[]) {
    const handlers = parser.configuration.handlers;
    const handler = handlers.retrieve(NEW_ENVIRONMENT) as sm.EnvironmentMap;
    handler.add(env, new Macro(env, func, attr));
  }

  /**
   * Naming constants for the extension mappings.
   */
  export const NEW_DELIMITER = 'new-Delimiter';
  export const NEW_COMMAND = 'new-Command';
  export const NEW_ENVIRONMENT = 'new-Environment';

}

export default NewcommandUtil;
