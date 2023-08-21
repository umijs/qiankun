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
 * @fileoverview Configuration file for the textmacros package
 *
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */

import {TeX} from '../../tex.js';
import TexParser from '../TexParser.js';
import {Configuration, ParserConfiguration} from '../Configuration.js';
import ParseOptions from '../ParseOptions.js';
import {TagsFactory} from '../Tags.js';
import {StartItem, StopItem, MmlItem, StyleItem} from '../base/BaseItems.js';
import {TextParser} from './TextParser.js';
import {TextMacrosMethods} from './TextMacrosMethods.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';

import './TextMacrosMappings.js';

/**
 *  The base text macro configuration (used in the TextParser)
 */
export const TextBaseConfiguration = Configuration.create('text-base', {
  parser: 'text',
  handler: {
    character: ['command', 'text-special'],
    macro: ['text-macros']
  },
  fallback: {
    //
    // Unknown characters are added to the text verbatim
    //
    character: (parser: TextParser, c: string) => {
      parser.text += c;
    },
    //
    // For unknown macros, if they are defined in the main TeX parser
    //   and not string-replacement macros, give an error, otherwise
    //   run the macro (this either does the string replacement or
    //   produces the error as configured in the main TeX parser, so
    //   this will respect the noundefined package, if loaded).
    //
    macro: (parser: TextParser, name: string) => {
      const texParser = parser.texParser;
      const macro = texParser.lookup('macro', name);
      if (macro && macro._func !== TextMacrosMethods.Macro) {
        parser.Error('MathMacro', '%1 is only supported in math mode', '\\' + name);
      }
      texParser.parse('macro', [parser, name]);
    }
  },
  items: {
    [StartItem.prototype.kind]: StartItem,
    [StopItem.prototype.kind]: StopItem,
    [MmlItem.prototype.kind]: MmlItem,
    [StyleItem.prototype.kind]: StyleItem     // needed for \color
  }
});

/**
 * Replacement for ParseUtil.internalMath that handles text-mode macros.
 *
 * @param {TexParser} parser      The TexParser calling this function
 * @param {string} text           The text-mode string to be processed
 * @param {number|string} level   The scriptlevel of the text
 * @param {string} mathvariant    The mathvariant for the text
 * @return {MmlNode[]}            The final MmlNode generated for the text
 */
function internalMath(parser: TexParser, text: string, level?: number | string, mathvariant?: string): MmlNode[] {
  const config = parser.configuration.packageData.get('textmacros');
  if (!(parser instanceof TextParser)) {
    config.texParser = parser;
  }
  return [(new TextParser(text, mathvariant ? {mathvariant} : {}, config.parseOptions, level)).mml()];
}

//
//  The textmacros package configuration
//
export const TextMacrosConfiguration = Configuration.create('textmacros', {
  /**
   * @param {ParserConfiguration} config   The configuration object we are being configured within
   * @param {TeX<any,any,any>} jax         The TeX input jax in which we are running
   */
  config(_config: ParserConfiguration, jax: TeX<any, any, any>) {
    //
    //  Create the configuration and parseOptions objects for the
    //    internal TextParser and add the textBase configuration.
    //
    const textConf = new ParserConfiguration(jax.parseOptions.options.textmacros.packages, ['tex', 'text']);
    textConf.init();
    const parseOptions = new ParseOptions(textConf, []);
    parseOptions.options = jax.parseOptions.options;      // share the TeX options
    textConf.config(jax);
    TagsFactory.addTags(textConf.tags);
    parseOptions.tags = TagsFactory.getDefault();
    parseOptions.tags.configuration = parseOptions;
    //
    // Share the TeX input jax's parseOptions packageData object
    //   so that require and other packages will work in both parsers,
    //   set the textmacros data (texParser will be filled in later),
    //   and replace the internalMath function with our own.
    //
    parseOptions.packageData = jax.parseOptions.packageData;
    parseOptions.packageData.set('textmacros', {parseOptions, jax, texParser: null});
    parseOptions.options.internalMath = internalMath;
  },
  preprocessors: [(data: {data: ParseOptions}) => {
    //
    //  Set the MmlFactory for the nodeFactory, since it was not available
    //  durring configuration above.
    //
    const config = data.data.packageData.get('textmacros');
    config.parseOptions.nodeFactory.setMmlFactory(config.jax.mmlFactory);
  }],
  options: {
    textmacros: {
      packages: ['text-base']    // textmacro packages to load
    }
  }
});
