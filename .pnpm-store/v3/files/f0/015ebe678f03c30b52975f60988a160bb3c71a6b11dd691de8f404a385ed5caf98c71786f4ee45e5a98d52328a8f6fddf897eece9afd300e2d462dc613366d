/*************************************************************
 *
 *  Copyright (c) 2019-2022 The MathJax Consortium
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
 * @fileoverview    Configuration file for the autoload package.
 *
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */

import {Configuration, ParserConfiguration} from '../Configuration.js';
import TexParser from '../TexParser.js';
import {CommandMap} from '../SymbolMap.js';
import {Macro} from '../Symbol.js';
import {TeX} from '../../tex.js';

import {RequireLoad, RequireConfiguration} from '../require/RequireConfiguration.js';
import {Package} from '../../../components/package.js';
import {expandable, defaultOptions} from '../../../util/Options.js';


/**
 * Autoload an extension when the first macro for it is encountered
 *   (if the extension has already been loaded, remove the autoload
 *    macros and environments so they won't try to load it again, and
 *    back up to read the macro again, call the RequireLoad command to
 *    either load the extension, or initialize it.)
 *
 * @param {TexParser} parser   The TeX input parser
 * @param {string} name        The control sequence that is running
 * @param {string} extension   The extension to load
 * @param {boolean} isMacro    True if this is a macro, false if an environment
 */
function Autoload(parser: TexParser, name: string, extension: string, isMacro: boolean) {
  if (Package.packages.has(parser.options.require.prefix + extension)) {
    const def = parser.options.autoload[extension];
    const [macros, envs] = (def.length === 2 && Array.isArray(def[0]) ? def : [def, []]);
    for (const macro of macros) {
      AutoloadMacros.remove(macro);
    }
    for (const env of envs) {
      AutoloadEnvironments.remove(env);
    }
    //
    //  Put back the macro or \begin and read it again
    //
    parser.string = (isMacro ? name + ' ' : '\\begin{' + name.slice(1) + '}' ) + parser.string.slice(parser.i);
    parser.i = 0;
  }
  RequireLoad(parser, extension);
}

/**
 * Check if the require extension has been initialized
 * (If autoload has been included in the TeX packages, but require isn't, then we need
 *  to set up the options here and configure the require package in configAutoload below.
 *  the priorities of the initialization and configuration are set so that autoload
 *  will run after require when both are used.)
 */
function initAutoload(config: ParserConfiguration) {
  if (!config.options.require) {
    defaultOptions(config.options, RequireConfiguration.options);
  }
}

/**
 * Create the macros and environments for the extensions that need to be loaded.
 * Only ones that aren't already defined are made to autoload
 *   (except for \color, which is overridden if present)
 */
function configAutoload(config: ParserConfiguration, jax: TeX<any, any, any>) {
  const parser = jax.parseOptions;
  const macros = parser.handlers.get('macro');
  const environments = parser.handlers.get('environment');
  const autoload = parser.options.autoload;
  parser.packageData.set('autoload', {Autoload});  // used by textmacros to tell if a macro is autoloading
  //
  // Loop through the autoload definitions
  //
  for (const extension of Object.keys(autoload)) {
    const def = autoload[extension];
    const [macs, envs] = (def.length === 2 && Array.isArray(def[0]) ? def : [def, []]);
    //
    // Create the macros
    //
    for (const name of macs) {
      if (!macros.lookup(name) || name === 'color') {
        AutoloadMacros.add(name, new Macro(name, Autoload, [extension, true]));
      }
    }
    //
    // Create the environments
    //
    for (const name of envs) {
      if (!environments.lookup(name)) {
        AutoloadEnvironments.add(name, new Macro(name, Autoload, [extension, false]));
      }
    }
  }
  //
  //  Check if the require extension needs to be configured
  //
  if (!parser.packageData.get('require')) {
    RequireConfiguration.config(config, jax);
  }
}

/**
 * The command and environment maps for the macros that autoload extensions
 */
const AutoloadMacros = new CommandMap('autoload-macros', {}, {});
const AutoloadEnvironments = new CommandMap('autoload-environments', {}, {});


/**
 * The configuration object for configmacros
 */
export const AutoloadConfiguration = Configuration.create(
  'autoload', {
    handler: {
      macro: ['autoload-macros'],
      environment: ['autoload-environments']
    },
    options: {
      //
      //  These are the extension names and the macros and environments they contain.
      //    The format is [macros...] or [[macros...], [environments...]]
      //  You can prevent one from being autoloaded by setting
      //    it to [] in the options when the TeX input jax is created.
      //  You can include the prefix if it is not the default one from require
      //
      autoload: expandable({
        action: ['toggle', 'mathtip', 'texttip'],
        amscd: [[], ['CD']],
        bbox: ['bbox'],
        boldsymbol: ['boldsymbol'],
        braket: ['bra', 'ket', 'braket', 'set', 'Bra', 'Ket', 'Braket', 'Set', 'ketbra', 'Ketbra'],
        bussproofs: [[], ['prooftree']],
        cancel: ['cancel', 'bcancel', 'xcancel', 'cancelto'],
        color: ['color', 'definecolor', 'textcolor', 'colorbox', 'fcolorbox'],
        enclose: ['enclose'],
        extpfeil: ['xtwoheadrightarrow', 'xtwoheadleftarrow', 'xmapsto', 'xlongequal', 'xtofrom', 'Newextarrow'],
        html: ['href', 'class', 'style', 'cssId'],
        mhchem: ['ce', 'pu'],
        newcommand: ['newcommand', 'renewcommand', 'newenvironment', 'renewenvironment', 'def', 'let'],
        unicode: ['unicode'],
        verb: ['verb']
      })
    },
    config: configAutoload,
    init: initAutoload,
    priority: 10
  }
);
