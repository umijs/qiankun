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
 * @fileoverview  A dynamic loader for loading MathJax components based
 *                on a user configuration, while handling timing of
 *                dependencies properly
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {MathJax as MJGlobal, MathJaxObject as MJObject, MathJaxLibrary,
        MathJaxConfig as MJConfig, combineWithMathJax, combineDefaults} from './global.js';

import {Package, PackageError, PackageReady, PackageFailed} from './package.js';
export {Package, PackageError, PackageReady, PackageFailed} from './package.js';
export {MathJaxLibrary} from './global.js';

import {FunctionList} from '../util/FunctionList.js';

/*
 * The current directory (for webpack), and the browser document (if any)
 */
declare var __dirname: string;
declare var document: Document;

/**
 * Function used to determine path to a given package.
 */
export type PathFilterFunction = (data: {name: string, original: string, addExtension: boolean}) => boolean;
export type PathFilterList = (PathFilterFunction | [PathFilterFunction, number])[];

/**
 * Update the configuration structure to include the loader configuration
 */
export interface MathJaxConfig extends MJConfig {
  loader?: {
    paths?: {[name: string]: string};          // The path prefixes for use in locations
    source?: {[name: string]: string};         // The URLs for the extensions, e.g., tex: [mathjax]/input/tex.js
    dependencies?: {[name: string]: string[]}; // The dependencies for each package
    provides?: {[name: string]: string[]};     // The sub-packages provided by each package
    load?: string[];                           // The packages to load (found in locations or [mathjax]/name])
    ready?: PackageReady;                      // A function to call when MathJax is ready
    failed?: PackageFailed;                    // A function to call when MathJax fails to load
    require?: (url: string) => any;            // A function for loading URLs
    pathFilters?: PathFilterList;              // List of path filters (and optional priorities) to add
    versionWarnings?: boolean;                 // True means warn when extension version doesn't match MJ version
    [name: string]: any;                       // Other configuration blocks
  };
}

/**
 * Update the MathJax object to inclide the loader information
 */
export interface MathJaxObject extends MJObject {
  _: MathJaxLibrary;
  config: MathJaxConfig;
  loader: {
    ready: (...names: string[]) => Promise<string[]>; // Get a promise for when all the named packages are loaded
    load: (...names: string[]) => Promise<string>;    // Load the packages and return a promise for when ready
    preLoad: (...names: string[]) => void;            // Indicate that packages are already loaded by hand
    defaultReady: () => void;                         // The function performed when all packages are loaded
    getRoot: () => string;                            // Find the root URL for the MathJax files
    checkVersion: (name: string, version: string) => boolean;   // Check the version of an extension
    pathFilters: FunctionList;                        // the filters to use for looking for package paths
  };
  startup?: any;
}

/**
 * Functions used to filter the path to a package
 */
export const PathFilters: {[name: string]: PathFilterFunction} = {
  /**
   * Look up the path in the configuration's source list
   */
  source: (data) => {
    if (CONFIG.source.hasOwnProperty(data.name)) {
      data.name = CONFIG.source[data.name];
    }
    return true;
  },

  /**
   * Add [mathjax] before any relative path, and add .js if needed
   */
  normalize: (data) => {
    const name = data.name;
    if (!name.match(/^(?:[a-z]+:\/)?\/|[a-z]:\\|\[/i)) {
      data.name = '[mathjax]/' + name.replace(/^\.\//, '');
    }
    if (data.addExtension && !name.match(/\.[^\/]+$/)) {
      data.name += '.js';
    }
    return true;
  },

  /**
   * Recursively replace path prefixes (e.g., [mathjax], [tex], etc.)
   */
  prefix: (data) => {
    let match;
    while ((match = data.name.match(/^\[([^\]]*)\]/))) {
      if (!CONFIG.paths.hasOwnProperty(match[1])) break;
      data.name = CONFIG.paths[match[1]] + data.name.substr(match[0].length);
    }
    return true;
  }

};


/**
 * The implementation of the dynamic loader
 */
export namespace Loader {

  /**
   * The version of MathJax that is running.
   */
  const VERSION = MJGlobal.version;

  /**
   * The versions of all the loaded extensions.
   */
  export const versions: Map<string, string> = new Map();

  /**
   * Get a promise that is resolved when all the named packages have been loaded.
   *
   * @param {string[]} names  The packages to wait for
   * @returns {Promise}       A promise that resolves when all the named packages are ready
   */
  export function ready(...names: string[]): Promise<string[]> {
    if (names.length === 0) {
      names = Array.from(Package.packages.keys());
    }
    const promises = [];
    for (const name of names) {
      const extension = Package.packages.get(name) || new Package(name, true);
      promises.push(extension.promise);
    }
    return Promise.all(promises);
  }

  /**
   * Load the named packages and return a promise that is resolved when they are all loaded
   *
   * @param {string[]} names  The packages to load
   * @returns {Promise}       A promise that resolves when all the named packages are ready
   */
  export function load(...names: string[]): Promise<void | string[]> {
    if (names.length === 0) {
      return Promise.resolve();
    }
    const promises = [];
    for (const name of names) {
      let extension = Package.packages.get(name);
      if (!extension) {
        extension = new Package(name);
        extension.provides(CONFIG.provides[name]);
      }
      extension.checkNoLoad();
      promises.push(extension.promise.then(() => {
        if (!CONFIG.versionWarnings) return;
        if (extension.isLoaded && !versions.has(Package.resolvePath(name))) {
          console.warn(`No version information available for component ${name}`);
        }
      }) as Promise<null>);
    }
    Package.loadAll();
    return Promise.all(promises);
  }

  /**
   * Indicate that the named packages are being loaded by hand (e.g., as part of a larger package).
   *
   * @param {string[]} names  The packages to load
   */
  export function preLoad(...names: string[]) {
    for (const name of names) {
      let extension = Package.packages.get(name);
      if (!extension) {
        extension = new Package(name, true);
        extension.provides(CONFIG.provides[name]);
      }
      extension.loaded();
    }
  }

  /**
   * The default function to perform when all the packages are loaded
   */
  export function defaultReady() {
    if (typeof MathJax.startup !== 'undefined') {
      MathJax.config.startup.ready();
    }
  }

  /**
   * Get the root location for where the MathJax package files are found
   *
   * @returns {string}   The root location (directory for node.js, URL for browser)
   */
  export function getRoot(): string {
    let root = __dirname + '/../../es5';
    if (typeof document !== 'undefined') {
      const script = document.currentScript || document.getElementById('MathJax-script');
      if (script) {
        root = (script as HTMLScriptElement).src.replace(/\/[^\/]*$/, '');
      }
    }
    return root;
  }

  /**
   * Check the version of an extension and report an error if not correct
   *
   * @param {string} name       The name of the extension being checked
   * @param {string} version    The version of the extension to check
   * @param {string} type       The type of extension (future code may use this to check ranges of versions)
   * @return {boolean}          True if there was a mismatch, false otherwise
   */
  export function checkVersion(name: string, version: string, _type?: string): boolean {
    versions.set(Package.resolvePath(name), VERSION);
    if (CONFIG.versionWarnings && version !== VERSION) {
      console.warn(`Component ${name} uses ${version} of MathJax; version in use is ${VERSION}`);
      return true;
    }
    return false;
  }

  /**
   * The filters to use to modify the paths used to obtain the packages
   */
  export const pathFilters = new FunctionList();

  /**
   * The default filters to use.
   */
  pathFilters.add(PathFilters.source, 0);
  pathFilters.add(PathFilters.normalize, 10);
  pathFilters.add(PathFilters.prefix, 20);
}

/**
 * Export the global MathJax object for convenience
 */
export const MathJax = MJGlobal as MathJaxObject;

/*
 * If the loader hasn't been added to the MathJax variable,
 *   Add the loader configuration, library, and data objects.
 *   Add any path filters from the configuration.
 */
if (typeof MathJax.loader === 'undefined') {

  combineDefaults(MathJax.config, 'loader', {
    paths: {
      mathjax: Loader.getRoot()
    },
    source: {},
    dependencies: {},
    provides: {},
    load: [],
    ready: Loader.defaultReady.bind(Loader),
    failed: (error: PackageError) => console.log(`MathJax(${error.package || '?'}): ${error.message}`),
    require: null,
    pathFilters: [],
    versionWarnings: true
  });
  combineWithMathJax({
    loader: Loader
  });

  //
  // Add any path filters from the configuration
  //
  for (const filter of MathJax.config.loader.pathFilters) {
    if (Array.isArray(filter)) {
      Loader.pathFilters.add(filter[0], filter[1]);
    } else {
      Loader.pathFilters.add(filter);
    }
  }
}

/**
 * Export the loader configuration for convenience
 */
export const CONFIG = MathJax.config.loader;
