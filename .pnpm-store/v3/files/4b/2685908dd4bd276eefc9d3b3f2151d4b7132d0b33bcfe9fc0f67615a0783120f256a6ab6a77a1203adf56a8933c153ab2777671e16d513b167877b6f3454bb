/*************************************************************
 *
 *  Copyright (c) 2018 The MathJax Consortium
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
 * @fileoverview  Creates configurations for webpacking of MathJax components
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

/**************************************************************/

/**
 * @param {string} string  The string whose special characters are to be escaped
 * @return {string}        The string with regex special characters escaped
 */
function quoteRE(string) {
  return string.replace(/([\\.{}[\]()?*^$])/g, '\\$1')
}

/**
 * Creates the plugin needed for including jsdir in the output
 *
 * @param {string} js          The location of the compiled js files
 * @param {string} dir         The directory of the component being built
 * @return {any[]}             The plugin array (empty or with the conversion plugin)
 */
const PLUGINS = function (js, dir) {
  const mjdir = path.resolve(__dirname, '..', 'js');
  const jsdir = path.resolve(dir, js);

  //
  //  Record the js directory for the pack command
  //
  return [new webpack.DefinePlugin({
    __JSDIR__: jsdir
  })];
};

/**
 * Creates the plugin needed for converting mathjax references to component/lib references
 *
 * @param {string} js          The location of the compiled js files
 * @param {string[]} lib       The component library directories to be linked against
 * @param {string} dir         The directory of the component being built
 * @return {any[]}             The plugin array (empty or with the conversion plugin)
 */
const RESOLVE = function (js, libs, dir) {
  const mjdir = path.resolve(__dirname, '..', 'js');
  const jsdir = path.resolve(dir, js);
  const mjRE = new RegExp('^(?:' + quoteRE(jsdir) + '|' + quoteRE(mjdir) + ')' + quoteRE(path.sep));
  const root = path.dirname(mjdir);

  //
  //  Add directory names to libraries
  //
  libs = libs.map(lib => path.join(lib.charAt(0) === '.' ? dir : root, lib) + path.sep);

  //
  // Function replace imported files by ones in the specified component lib directories.
  //
  const replaceLibs = (resource) => {
    //
    // The full file name to check.
    //
    const request = require.resolve(
      resource.request ? 
        resource.request.charAt(0) === '.' ? path.resolve(resource.path, resource.request) : resource.request :
      resource.path
    );
    //
    // Only check files in the MathJax js directory.
    //
    if (!request.match(mjRE)) return;
    //
    // Loop through the libraries and see if the imported file is there.
    //   If so, replace the request with the library version and return.
    //
    for (const lib of libs) {
      const file = request.replace(mjRE, lib);
      if (fs.existsSync(file)) {
        resource.path = file;
        resource.request = undefined;
        return;
      }
    }
  }

  //
  // A plugin that looks for files and modules to see if they need replacing with library versions.
  //
  class ResolveReplacementPlugin {
    apply(compiler) {
      compiler.hooks.file.tap(ResolveReplacementPlugin.name, replaceLibs);
      compiler.hooks.module.tap(ResolveReplacementPlugin.name, replaceLibs);
    }
  }

  return {plugins: [new ResolveReplacementPlugin()]};
}

/**
 * Add babel-loader to appropriate directories
 *
 * @param {string} dir    The directory for the component being built
 * @return {any}          The modules specification for the webpack configuration
 */
const MODULE = function (dir) {
  //
  // Only need to transpile our directory and components directory
  //
  const dirRE = (dir.substr(0, __dirname.length) === __dirname ? quoteRE(__dirname) :
                 '(?:' + quoteRE(__dirname) + '|' + quoteRE(dir) + ')');
  return {
    // NOTE: for babel transpilation
    rules: [{
      test: new RegExp(dirRE + quoteRE(path.sep) + '.*\\.js$'),
      exclude: new RegExp(quoteRE(path.join(path.dirname(__dirname), 'es5') + path.sep)),
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/env']
        }
      }
    }]
  }
};

/**
 * Create a webpack configuration for a distribution file
 *
 * @param {string} name       The name of the component to create
 * @param {string} js         The path to the compiled .js files
 * @param {string[]} libs     Array of paths to component lib directories to link against
 * @param {string} dir        The directory of the component buing built
 * @param {string} dist       The path to the directory where the component .js file will be placed
 *                              (defaults to es5 in the same directory as the js directory)
 */
const PACKAGE = function (name, js, libs, dir, dist) {
  const distDir = dist ? path.resolve(dir, dist) :
                         path.resolve(path.dirname(js), 'es5', path.dirname(name));
  name = path.basename(name);
  return {
    name: name,
    entry: path.join(dir, name + '.js'),
    output: {
      path: distDir,
      filename: name + (dist === '.' ? '.min.js' : '.js')
    },
    target: ['web', 'es5'],  // needed for IE11 and old browsers
    plugins: PLUGINS(js, dir),
    resolve: RESOLVE(js, libs, dir),
    module: MODULE(dir),
    performance: {
      hints: false
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin({
        extractComments: false,
        terserOptions: {
          output: {
            ascii_only: true
          }
        }
      })]
    },
    mode: 'production'
  };
}

module.exports = PACKAGE;
