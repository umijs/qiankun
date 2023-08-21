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
 * @fileoverview Symbol map classes.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Attributes, Args, ParseMethod, ParseInput, ParseResult} from './Types.js';
import {Symbol, Macro} from './Symbol.js';
import {MapHandler} from './MapHandler.js';


/**
 * SymbolMaps are the base components for the input parsers.
 *
 * They provide a contains method that checks if a map is applicable (contains)
 * a particular string. Implementing classes then perform the actual symbol
 * parsing, from simple regular expression test, straight forward symbol mapping
 * to transformational functionality on the parsed string.
 *
 * @interface
 */
export interface SymbolMap {

  /**
   * @return {string} The name of the map.
   */
  name: string;

  /**
   * @return {ParseMethod} The default parsing method.
   */
  parser: ParseMethod;

  /**
   * @param {string} symbol A symbol to parse.
   * @return {boolean} True if the symbol map applies to the symbol.
   */
  contains(symbol: string): boolean;

  /**
   * @param {string} symbol A symbol to parse.
   * @return {ParseMethod} A parse method for the symbol.
   */
  parserFor(symbol: string): ParseMethod;

  /**
   * @param {TexParser} env The current parser.
   * @param {string} symbol A symbol to parse.
   * @return {ParseResult} The parsed symbol and the rest of the string.
   */
  parse([env, symbol]: ParseInput): ParseResult;

}

/**
 * @param {ParseResult} result    The result to check
 * @return {ParseResult}          True if result was void, result otherwise
 */
export function parseResult(result: ParseResult): ParseResult {
  return result === void 0 ? true : result;
}

/**
 * Abstract implementation of symbol maps.
 * @template T
 */
export abstract class AbstractSymbolMap<T> implements SymbolMap {

  /**
   * @constructor
   * @implements {SymbolMap}
   * @param {string} name Name of the mapping.
   * @param {ParseMethod} parser The parser for the mappiong.
   */
  constructor(private _name: string, private _parser: ParseMethod) {
    MapHandler.register(this);
  }


  /**
   * @override
   */
  public get name(): string {
    return this._name;
  }


  /**
   * @override
   */
  public abstract contains(symbol: string): boolean;


  /**
   * @override
   */
  public parserFor(symbol: string) {
    return this.contains(symbol) ? this.parser : null;
  }


  /**
   * @override
   */
  public parse([env, symbol]: ParseInput) {
    let parser = this.parserFor(symbol);
    let mapped = this.lookup(symbol);
    return (parser && mapped) ? parseResult(parser(env, mapped as any)) : null;
  }


  public set parser(parser: ParseMethod) {
    this._parser = parser;
  }

  public get parser(): ParseMethod {
    return this._parser;
  }


  /**
   * @param {string} symbol
   * @return {T}
   */
  public abstract lookup(symbol: string): T;

}



/**
 * Regular expressions used for parsing strings.
 */
export class RegExpMap extends AbstractSymbolMap<string> {

  /**
   * @constructor
   * @extends {AbstractSymbolMap}
   * @param {string} name Name of the mapping.
   * @param {ParseMethod} parser The parser for the mappiong.
   * @param {RegExp} regexp The regular expression.
   */
  constructor(name: string, parser: ParseMethod, private _regExp: RegExp) {
    super(name, parser);
  }


  /**
   * @override
   */
  public contains(symbol: string) {
    return this._regExp.test(symbol);
  }


  /**
   * @override
   */
  public lookup(symbol: string): string {
    return this.contains(symbol) ? symbol : null;
  }

}


/**
 * Parse maps associate strings with parsing functionality.
 * @constructor
 * @extends {AbstractSymbolMap}
 * @template K
 */
export abstract class AbstractParseMap<K> extends AbstractSymbolMap<K> {

  private map: Map<string, K> = new Map<string, K>();

  /**
   * @override
   */
  public lookup(symbol: string): K {
    return this.map.get(symbol);
  }

  /**
   * @override
   */
  public contains(symbol: string) {
    return this.map.has(symbol);
  }

  /**
   * Sets mapping for a symbol.
   * @param {string} symbol The symbol to map.
   * @param {K} object The symbols value in the mapping's codomain.
   */
  public add(symbol: string, object: K) {
    this.map.set(symbol, object);
  }

  /**
   * Removes a symbol from the map
   * @param {string} symbol The symbol to remove
   */
  public remove(symbol: string) {
    this.map.delete(symbol);
  }

}


/**
 * Maps symbols that can all be parsed with the same method.
 *
 * @constructor
 * @extends {AbstractParseMap}
 */
export class CharacterMap extends AbstractParseMap<Symbol> {

  /**
   * @constructor
   * @param {string} name Name of the mapping.
   * @param {ParseMethod} parser The parser for the mapping.
   * @param {JSON} json The JSON representation of the character mapping.
   */
  constructor(name: string, parser: ParseMethod,
              json: {[index: string]: string | [string, Attributes]}) {
    super(name, parser);
    for (const key of Object.keys(json)) {
      let value = json[key];
      let [char, attrs] = (typeof(value) === 'string') ? [value, null] : value;
      let character = new Symbol(key, char, attrs);
      this.add(key, character);
    }
  }

}


/**
 * Maps symbols that are delimiters, that are all parsed with the same method.
 *
 * @constructor
 * @extends {CharacterMap}
 */
export class DelimiterMap extends CharacterMap {

  /**
   * @override
   */
  public parse([env, symbol]: ParseInput) {
    return super.parse([env, '\\' + symbol]);
  }

}


/**
 * Maps macros that all bring their own parsing method.
 *
 * @constructor
 * @extends {AbstractParseMap}
 */
export class MacroMap extends AbstractParseMap<Macro> {

  /**
   * @constructor
   * @param {string} name Name of the mapping.
   * @param {JSON} json The JSON representation of the macro map.
   * @param {Record<string, ParseMethod>} functionMap Collection of parse
   *     functions for the single macros.
   */
  constructor(name: string,
              json: {[index: string]: string | Args[]},
              functionMap: Record<string, ParseMethod>) {
    super(name, null);
    for (const key of Object.keys(json)) {
      let value = json[key];
      let [func, ...attrs] = (typeof(value) === 'string') ? [value] : value;
      let character = new Macro(key, functionMap[func as string], attrs);
      this.add(key, character);
    }
  }


  /**
   * @override
   */
  public parserFor(symbol: string) {
    let macro = this.lookup(symbol);
    return macro ? macro.func : null;
  }


  /**
   * @override
   */
  public parse([env, symbol]: ParseInput) {
    let macro = this.lookup(symbol);
    let parser = this.parserFor(symbol);
    if (!macro || !parser) {
      return null;
    }
    return parseResult(parser(env, macro.symbol, ...macro.args));
  }

}


/**
 * Maps macros that all bring their own parsing method.
 *
 * @constructor
 * @extends {MacroMap}
 */
export class CommandMap extends MacroMap {

  /**
   * @override
   */
  public parse([env, symbol]: ParseInput) {
    let macro = this.lookup(symbol);
    let parser = this.parserFor(symbol);
    if (!macro || !parser) {
      return null;
    }
    let saveCommand = env.currentCS;
    env.currentCS = '\\' + symbol;
    let result = parser(env, '\\' + macro.symbol, ...macro.args);
    env.currentCS = saveCommand;
    return parseResult(result);
  }

}


/**
 * Maps macros for environments. It has a general parsing method for
 * environments, i.e., one that deals with begin/end, and each environment has
 * its own parsing method returning the content.
 *
 * @constructor
 * @extends {MacroMap}
 */
export class EnvironmentMap extends MacroMap {

  /**
   * @constructor
   * @param {string} name Name of the mapping.
   * @param {ParseMethod} parser The parser for the environments.
   * @param {JSON} json The JSON representation of the macro map.
   * @param {Record<string, ParseMethod>} functionMap Collection of parse
   *     functions for the single macros.
   */
  constructor(name: string,
              parser: ParseMethod,
              json: {[index: string]: string | Args[]},
              functionMap: Record<string, ParseMethod>) {
    super(name, json, functionMap);
    this.parser = parser;
  }


  /**
   * @override
   */
  public parse([env, symbol]: ParseInput) {
    let macro = this.lookup(symbol);
    let envParser = this.parserFor(symbol);
    if (!macro || !envParser) {
      return null;
    }
    return parseResult(this.parser(env, macro.symbol, envParser, macro.args));
  }

}
