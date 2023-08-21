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
 * @fileoverview    Configuration file for the require package.
 *
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */

import {Configuration, ParserConfiguration, ConfigurationHandler} from '../Configuration.js';
import TexParser from '../TexParser.js';
import {CommandMap} from '../SymbolMap.js';
import {ParseMethod} from '../Types.js';
import TexError from '../TexError.js';
import {TeX} from '../../tex.js';

import {MathJax} from '../../../components/global.js';
import {Package} from '../../../components/package.js';
import {Loader, CONFIG as LOADERCONFIG} from '../../../components/loader.js';
import {mathjax} from '../../../mathjax.js';
import {expandable} from '../../../util/Options.js';

/**
 * The MathJax configuration block (for looking up user-defined package options)
 */
const MJCONFIG = MathJax.config;

/**
 * Add an extension to the configuration, and configure its user options
 *
 * @param {TeX} jax       The TeX jax whose configuration is to be modified
 * @param {string} name   The name of the extension being added (e.g., '[tex]/amscd')
 */
function RegisterExtension(jax: TeX<any, any, any>, name: string) {
  const require = jax.parseOptions.options.require;
  const required = jax.parseOptions.packageData.get('require').required as string[];
  const extension = name.substr(require.prefix.length);
  if (required.indexOf(extension) < 0) {
    required.push(extension);
    //
    //  Register any dependencies that were loaded to handle this one
    //
    RegisterDependencies(jax, LOADERCONFIG.dependencies[name]);
    //
    //  If the required file loaded an extension...
    //
    const handler = ConfigurationHandler.get(extension);
    if (handler) {
      //
      //  Check if there are user-supplied options
      //    (place them in a block for the extension, if needed)
      //
      let options = MJCONFIG[name] || {};
      if (handler.options && Object.keys(handler.options).length === 1 && handler.options[extension]) {
        options = {[extension]: options};
      }
      //
      //  Register the extension with the jax's configuration
      //
      (jax as any).configuration.add(extension, jax, options);
      //
      // If there are preprocessors, restart so that they run
      // (we don't have access to the document or MathItem needed to call
      //  the preprocessors from here)
      //
      const configured = jax.parseOptions.packageData.get('require').configured;
      if (handler.preprocessors.length && !configured.has(extension)) {
        configured.set(extension, true);
        mathjax.retryAfter(Promise.resolve());
      }
    }
  }
}

/**
 * Register any dependencies for the loaded extension
 *
 * @param {TeX} jax          The jax whose configuration is being modified
 * @param {string[]} names   The names of the dependencies to register
 */
function RegisterDependencies(jax: TeX<any, any, any>, names: string[] = []) {
  const prefix = jax.parseOptions.options.require.prefix;
  for (const name of names) {
    if (name.substr(0, prefix.length) === prefix) {
      RegisterExtension(jax, name);
    }
  }
}

/**
 * Load a required package
 *
 * @param {TexParser} parser   The current tex parser.
 * @param {string} name        The name of the package to load.
 */
export function RequireLoad(parser: TexParser, name: string) {
  const options = parser.options.require;
  const allow = options.allow;
  const extension = (name.substr(0, 1) === '[' ? '' : options.prefix) + name;
  const allowed = (allow.hasOwnProperty(extension) ? allow[extension] :
                   allow.hasOwnProperty(name) ? allow[name] : options.defaultAllow);
  if (!allowed) {
    throw new TexError('BadRequire', 'Extension "%1" is not allowed to be loaded', extension);
  }
  if (Package.packages.has(extension)) {
    RegisterExtension(parser.configuration.packageData.get('require').jax, extension);
  } else {
    mathjax.retryAfter(Loader.load(extension));
  }
}

/**
 * Save the jax so that it can be used when \require{} is processed.
 */
function config(_config: ParserConfiguration, jax: TeX<any, any, any>) {
  jax.parseOptions.packageData.set('require', {
    jax: jax,                             // \require needs access to this
    required: [...jax.options.packages],  // stores the names of the packages that have been added
    configured: new Map()                 // stores the packages that have been configured
  });
  const options = jax.parseOptions.options.require;
  const prefix = options.prefix;
  if (prefix.match(/[^_a-zA-Z0-9]/)) {
    throw Error('Illegal characters used in \\require prefix');
  }
  if (!LOADERCONFIG.paths[prefix]) {
    LOADERCONFIG.paths[prefix] = '[mathjax]/input/tex/extensions';
  }
  options.prefix = '[' + prefix + ']/';
}


/**
 * Namespace for \require methods
 */
export const RequireMethods: Record<string, ParseMethod> = {

  /**
   * Implements \require macro to load TeX extensions
   *
   * @param {TexParser} parser   The current tex parser.
   * @param {string} name        The name of the calling macro.
   */
  Require(parser: TexParser, name: string) {
    const required = parser.GetArgument(name);
    if (required.match(/[^_a-zA-Z0-9]/) || required === '') {
      throw new TexError('BadPackageName', 'Argument for %1 is not a valid package name', name);
    }
    RequireLoad(parser, required);
  }

};

/**
 * The options for the require extension
 */
export const options = {
  require: {
    //
    // Specifies which extensions can/can't be required.
    // The keys are the names of extensions, and the value is true
    //   if the extension can be required, and false if it can't
    //
    allow: expandable({
      base: false,
      'all-packages': false,
      autoload: false,
      configmacros: false,
      tagformat: false,
      setoptions: false
    }),
    //
    //  The default allow value if the extension isn't in the list above
    //
    defaultAllow: true,
    //
    //  The path prefix to use for exensions:  'tex' means use '[tex]/'
    //  before the extension name.
    //
    prefix: 'tex'
  }
};

/**
 * The command map for the \require macro
 */
new CommandMap('require', {require: 'Require'}, RequireMethods);

/**
 * The configuration for the \require macro
 */
export const RequireConfiguration = Configuration.create(
  'require', {handler: {macro: ['require']}, config, options}
);
