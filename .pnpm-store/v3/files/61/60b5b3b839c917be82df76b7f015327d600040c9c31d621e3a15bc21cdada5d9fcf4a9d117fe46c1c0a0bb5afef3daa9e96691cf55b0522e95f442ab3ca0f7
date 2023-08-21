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
 * @fileoverview  Implements component Package object for handling
 *                dynamic loading of components.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CONFIG, Loader} from './loader.js';

/*
 * The browser document (for creating scripts to load components)
 */
declare var document: Document;

/**
 * A map of package names to Package instances
 */
export type PackageMap = Map<string, Package>;

/**
 * An error class that includes the package name
 */
export class PackageError extends Error {
  /* tslint:disable:jsdoc-require */
  public package: string;
  constructor(message: string, name: string) {
    super(message);
    this.package = name;
  }
  /* tslint:enable */
}

/**
 * Types for ready() and failed() functions and for promises
 */
export type PackageReady = (name: string) => string | void;
export type PackageFailed = (message: PackageError) => void;
export type PackagePromise = (resolve: PackageReady, reject: PackageFailed) => void;

/**
 * The configuration data for a package
 */
export interface PackageConfig {
  ready?: PackageReady;                // Function to call when package is loaded successfully
  failed?: PackageFailed;              // Function to call when package fails to load
  checkReady?: () => Promise<void>;    // Function called to see if package is fully loaded
                                       //   (may cause additional packages to load, for example)
}

/**
 * The Package class for handling individual components
 */
export class Package {
  /**
   * The set of packages being used
   */
  public static packages: PackageMap = new Map();

  /**
   * The package name
   */
  public name: string;

  /**
   * True when the package has been loaded successfully
   */
  public isLoaded: boolean = false;

  /**
   * A promise that resolves when the package is loaded successfully and rejects when it fails to load
   */
  public promise: Promise<string>;

  /**
   * True when the package is being loaded but hasn't yet finished loading
   */
  protected isLoading: boolean = false;

  /**
   * True if the package has failed to load
   */
  protected hasFailed: boolean = false;

  /**
   * True if this package should be loaded automatically (e.g., it was created in reference
   *   to a MathJax.loader.ready() call when the package hasn't been requested to load)
   */
  protected noLoad: boolean;

  /**
   * The function that resolves the package's promise
   */
  protected resolve: PackageReady;

  /**
   * The function that rejects the package's promise
   */
  protected reject: PackageFailed;

  /**
   * The packages that require this one
   */
  protected dependents: Package[] = [];

  /**
   * The packages that this one depends on
   */
  protected dependencies: Package[] = [];

  /**
   * The number of dependencies that haven't yet been loaded
   */
  protected dependencyCount: number = 0;

  /**
   * The sub-packages that this one provides
   */
  protected provided: Package[] = [];

  /**
   * @return {boolean}  True when the package can be loaded (i.e., its dependencies are all loaded,
   *                    it is allowed to be loaded, isn't already loading, and hasn't failed to load
   *                    in the past)
   */
  get canLoad(): boolean {
    return this.dependencyCount === 0 && !this.noLoad && !this.isLoading && !this.hasFailed;
  }

  /**
   * Compute the path for a package using the loader's path filters
   *
   * @param {string} name            The name of the package to resolve
   * @param {boolean} addExtension   True if .js should be added automatically
   * @return {string}                The path (file or URL) for this package
   */
  public static resolvePath(name: string, addExtension: boolean = true): string {
    const data = {name, original: name, addExtension};
    Loader.pathFilters.execute(data);
    return data.name;
  }

  /**
   * Attempt to load all packages that are ready to be loaded
   * (i.e., that have no unloaded dependencies, and that haven't
   *  already been loaded, and that aren't in process of being
   *  loaded, and that aren't marked as noLoad).
   */
  public static loadAll() {
    for (const extension of this.packages.values()) {
      if (extension.canLoad) {
        extension.load();
      }
    }
  }

  /**
   * @param {string} name        The name of the package
   * @param {boolean} noLoad     True when the package is just for reference, not loading
   */
  constructor(name: string, noLoad: boolean = false) {
    this.name = name;
    this.noLoad = noLoad;
    Package.packages.set(name, this);
    this.promise = this.makePromise(this.makeDependencies());
  }

  /**
   * @return {Promise<string>[]}   The array of promises that must be resolved before this package
   *                                 can be loaded
   */
  protected makeDependencies(): Promise<string>[] {
    const promises = [] as Promise<string>[];
    const map = Package.packages;
    const noLoad = this.noLoad;
    const name = this.name;
    //
    //  Get the dependencies for this package
    //
    const dependencies = [] as string[];
    if (CONFIG.dependencies.hasOwnProperty(name)) {
      dependencies.push(...CONFIG.dependencies[name]);
    } else if (name !== 'core') {
      dependencies.push('core');  //  Add 'core' dependency by default
    }
    //
    //  Add all the dependencies (creating them, if needed)
    //    and record the promises of unloaded ones
    //
    for (const dependent of dependencies) {
      const extension = map.get(dependent) || new Package(dependent, noLoad);
      if (this.dependencies.indexOf(extension) < 0) {
        extension.addDependent(this, noLoad);
        this.dependencies.push(extension);
        if (!extension.isLoaded) {
          this.dependencyCount++;
          promises.push(extension.promise);
        }
      }
    }
    //
    //  Return the collected promises
    //
    return promises;
  }

  /**
   * @param {Promise<string>[]} promises  The array or promises that must be resolved before
   *                                        this package can load
   */
  protected makePromise(promises: Promise<string>[]) {
    //
    //  Make a promise and save its resolve/reject functions
    //
    let promise = new Promise<string>(((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    }) as PackagePromise);
    //
    //  If there is a ready() function in the configuration for this package,
    //    Add running that to the promise
    //
    const config = (CONFIG[this.name] || {}) as PackageConfig;
    if (config.ready) {
      promise = promise.then((_name: string) => config.ready(this.name)) as Promise<string>;
    }
    //
    //  If there are promises for dependencies,
    //    Add the one for loading this package and create a promise for all of them
    //      (That way, if any of them fail to load, our promise will reject automatically)
    //
    if (promises.length) {
      promises.push(promise);
      promise = Promise.all(promises).then((names: string[]) => names.join(', '));
    }
    //
    //  If there is a failed() function in the configuration for this package,
    //    Add a catch to handle the error
    //
    if (config.failed) {
      promise.catch((message: string) => config.failed(new PackageError(message, this.name)));
    }
    //
    //  Return the promise that represents when this file is loaded
    //
    return promise;
  }

  /**
   * Attempt to load this package
   */
  public load() {
    if (!this.isLoaded && !this.isLoading && !this.noLoad) {
      this.isLoading = true;
      const url = Package.resolvePath(this.name);
      if (CONFIG.require) {
        this.loadCustom(url);
      } else {
        this.loadScript(url);
      }
    }
  }

  /**
   * Load using a custom require method (usually the one from node.js)
   */
  protected loadCustom(url: string) {
    try {
      const result = CONFIG.require(url);
      if (result instanceof Promise) {
        result.then(() => this.checkLoad())
          .catch((err) => this.failed('Can\'t load "' + url + '"\n' + err.message.trim()));
      } else {
        this.checkLoad();
      }
    } catch (err) {
      this.failed(err.message);
    }
  }

  /**
   * Load in a browser by inserting a script to load the proper URL
   */
  protected loadScript(url: string) {
    const script = document.createElement('script');
    script.src = url;
    script.charset = 'UTF-8';
    script.onload = (_event) => this.checkLoad();
    script.onerror = (_event) => this.failed('Can\'t load "' + url + '"');
    // FIXME: Should there be a timeout failure as well?
    document.head.appendChild(script);
  }

  /**
   * Called when the package is loaded.
   *
   * Mark it as loaded, and tell its dependents that this package
   *   has been loaded (may cause dependents to load themselves).
   *   Mark any provided packages as loaded.
   * Resolve the promise that says this package is loaded.
   */
  public loaded() {
    this.isLoaded = true;
    this.isLoading = false;
    for (const dependent of this.dependents) {
      dependent.requirementSatisfied();
    }
    for (const provided of this.provided) {
      provided.loaded();
    }
    this.resolve(this.name);
  }

  /**
   * Called when the package fails to load for some reason
   *
   * Mark it as failed to load
   * Reject the promise for this package with an error
   *
   * @param {string} message   The error message for a load failure
   */
  protected failed(message: string) {
    this.hasFailed = true;
    this.isLoading = false;
    this.reject(new PackageError(message, this.name));
  }

  /**
   * Check if a package is really ready to be marked as loaded
   * (When it is loaded, it may set its own checkReady() function
   *  as a means of loading additional packages.  E.g., an output
   *  jax may load a font package, dependent on its configuration.)
   *
   *  The configuration's checkReady() function returns a promise
   *  that allows the loader to wait for addition actions to finish
   *  before marking the file as loaded (or failing to load).
   */
  protected checkLoad() {
    const config = (CONFIG[this.name] || {}) as PackageConfig;
    const checkReady = config.checkReady || (() => Promise.resolve());
    checkReady().then(() => this.loaded())
      .catch((message) => this.failed(message));
  }

  /**
   * This is called when a dependency loads.
   *
   * Decrease the dependency count, and try to load this package
   * when the dependencies are all loaded.
   */
  public requirementSatisfied() {
    if (this.dependencyCount) {
      this.dependencyCount--;
      if (this.canLoad) {
        this.load();
      }
    }
  }

  /**
   * @param {string[]} names    The names of the packages that this package provides
   */
  public provides(names: string[] = []) {
    for (const name of names) {
      let provided = Package.packages.get(name);
      if (!provided) {
        if (!CONFIG.dependencies[name]) {
          CONFIG.dependencies[name] = [];
        }
        CONFIG.dependencies[name].push(name);
        provided = new Package(name, true);
        provided.isLoading = true;
      }
      this.provided.push(provided);
    }
  }

  /**
   * Add a package as a dependent, and if it is not just for reference,
   *   check if we need to change our noLoad status.
   *
   * @param {Package} extension   The package to add as a dependent
   * @param {boolean} noLoad      The noLoad status of the dependent
   */
  public addDependent(extension: Package, noLoad: boolean) {
    this.dependents.push(extension);
    if (!noLoad) {
      this.checkNoLoad();
    }
  }

  /**
   * If this package is marked as noLoad, change that and check all
   *   our dependencies to see if they need to change their noLoad
   *   status as well.
   *
   *  I.e., if there are dependencies that were set up for reference
   *  and a leaf node needs to be loaded, make sure all parent nodes
   *  are marked as needing to be loaded as well.
   */
  public checkNoLoad() {
    if (this.noLoad) {
      this.noLoad = false;
      for (const dependency of this.dependencies) {
        dependency.checkNoLoad();
      }
    }
  }

}
