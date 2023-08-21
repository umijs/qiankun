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
 * @fileoverview Configuration options for the TexParser.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {HandlerConfig, FallbackConfig} from './MapHandler.js';
import {StackItemClass} from './StackItem.js';
import {TagsClass} from './Tags.js';
import {userOptions, defaultOptions, OptionList} from '../../util/Options.js';
import {SubHandlers} from './MapHandler.js';
import {FunctionList} from '../../util/FunctionList.js';
import {TeX} from '../tex.js';
import {PrioritizedList} from '../../util/PrioritizedList.js';
import {TagsFactory} from './Tags.js';


export type StackItemConfig = {[kind: string]: StackItemClass};
export type TagsConfig = {[kind: string]: TagsClass};
export type Processor<T> = [T, number];
export type ProtoProcessor<T> = Processor<T> | T;
export type ProcessorList = Processor<Function>[];
export type ConfigMethod = (c: ParserConfiguration, j: TeX<any, any, any>) => void;
export type InitMethod = (c: ParserConfiguration) => void;



export class Configuration {

  /**
   * Creates a function priority pair.
   * @param {ProtoProcessor<T>} func The function or processor.
   * @param {number} priority The default priority.
   * @return {Processor} The processor pair.
   * @template T
   */
  private static makeProcessor<T>(func: ProtoProcessor<T>, priority: number): Processor<T> {
    return Array.isArray(func) ? func : [func, priority];
  }

  /**
   * Creates a configuration for a package.
   * @param {string} name The package name or empty string.
   * @param {Object} config See `create` method.
   * @return {Configuration} The newly generated configuration.
   */
  private static _create(name: string,
                         config: {handler?: HandlerConfig,
                                  fallback?: FallbackConfig,
                                  items?: StackItemConfig,
                                  tags?: TagsConfig,
                                  options?: OptionList,
                                  nodes?: {[key: string]: any},
                                  preprocessors?: ProtoProcessor<Function>[],
                                  postprocessors?: ProtoProcessor<Function>[],
                                  init?: ProtoProcessor<InitMethod>,
                                  config?: ProtoProcessor<ConfigMethod>,
                                  priority?: number,
                                  parser?: string,
                                 } = {}): Configuration {
    let priority = config.priority || PrioritizedList.DEFAULTPRIORITY;
    let init = config.init ? this.makeProcessor(config.init, priority) : null;
    let conf = config.config ? this.makeProcessor(config.config, priority) : null;
    let preprocessors = (config.preprocessors || []).map(
      pre => this.makeProcessor(pre, priority));
    let postprocessors = (config.postprocessors || []).map(
      post => this.makeProcessor(post, priority));
    let parser = config.parser || 'tex';
    return new Configuration(
      name,
      config.handler || {},
      config.fallback || {},
      config.items || {},
      config.tags || {},
      config.options || {},
      config.nodes || {},
      preprocessors, postprocessors, init, conf, priority,
      parser
    );
  }

  /**
   * Creator pattern for creating a named package configuration. This will be
   * administered in the configuration handler and can be retrieved again.
   * @param {string} name The package name.
   * @param {Object} config The configuration parameters:
   * Configuration for the TexParser consist of the following:
   *  * _handler_  configuration mapping handler types to lists of symbol mappings.
   *  * _fallback_ configuration mapping handler types to fallback methods.
   *  * _items_ for the StackItem factory.
   *  * _tags_ mapping tagging configurations to tagging objects.
   *  * _options_ parse options for the packages.
   *  * _nodes_ for the Node factory.
   *  * _preprocessors_ list of functions for preprocessing the LaTeX
   *      string wrt. to given parse options. Can contain a priority.
   *  * _postprocessors_ list of functions for postprocessing the MmlNode
   *      wrt. to given parse options. Can contain a priority.
   *  * _init_ init method and optionally its priority.
   *  * _config_ config method and optionally its priority.
   *  * _priority_ default priority of the configuration.
   *  * _parser_ the name of the parser that this configuration targets.
   * @return {Configuration} The newly generated configuration.
   */
  public static create(name: string,
                       config: {handler?: HandlerConfig,
                                fallback?: FallbackConfig,
                                items?: StackItemConfig,
                                tags?: TagsConfig,
                                options?: OptionList,
                                nodes?: {[key: string]: any},
                                preprocessors?: ProtoProcessor<Function>[],
                                postprocessors?: ProtoProcessor<Function>[],
                                init?: ProtoProcessor<InitMethod>,
                                config?: ProtoProcessor<ConfigMethod>,
                                priority?: number,
                                parser?: string,
                               } = {}): Configuration {
    let configuration = Configuration._create(name, config);
    ConfigurationHandler.set(name, configuration);
    return configuration;
  }

  /**
   * Creates an unnamed, ephemeral package configuration. It will not added to
   * the configuration handler.
   * @param {Object} config See `create` method.
   * @return {Configuration} The ephemeral package configuration.
   */
  public static local(config: {handler?: HandlerConfig,
                              fallback?: FallbackConfig,
                              items?: StackItemConfig,
                              tags?: TagsConfig,
                              options?: OptionList,
                              nodes?: {[key: string]: any},
                              preprocessors?: ProtoProcessor<Function>[],
                              postprocessors?: ProtoProcessor<Function>[],
                              init?: ProtoProcessor<InitMethod>,
                              config?: ProtoProcessor<ConfigMethod>,
                              priority?: number,
                              parser?: string,
                             } = {}): Configuration {
    return Configuration._create('', config);
  }


  /**
   * @constructor
   */
  private constructor(readonly name: string,
                      readonly handler: HandlerConfig = {},
                      readonly fallback: FallbackConfig = {},
                      readonly items: StackItemConfig = {},
                      readonly tags: TagsConfig = {},
                      readonly options: OptionList = {},
                      readonly nodes: {[key: string]: any} = {},
                      readonly preprocessors: ProcessorList = [],
                      readonly postprocessors: ProcessorList = [],
                      readonly initMethod: Processor<InitMethod> = null,
                      readonly configMethod: Processor<ConfigMethod> = null,
                      public priority: number,
                      readonly parser: string
                     ) {
    this.handler = Object.assign(
      {character: [], delimiter: [], macro: [], environment: []}, handler);
  }

  /**
   * The init method.
   * @type {Function}
   */
  public get init(): InitMethod {
    return this.initMethod ? this.initMethod[0] : null;
  }

  /**
   * The config method to call once jax is ready.
   * @type {FunctionList}
   */
  public get config(): ConfigMethod {
    return this.configMethod ? this.configMethod[0] : null;
  }

}


export namespace ConfigurationHandler {

  let maps: Map<string, Configuration> = new Map();

  /**
   * Adds a new configuration to the handler overwriting old ones.
   *
   * @param {string} name The name of the configuration.
   * @param {Configuration} map The configuration mapping.
   */
  export let set = function(name: string, map: Configuration): void {
    maps.set(name, map);
  };


  /**
   * Looks up a configuration.
   *
   * @param {string} name The name of the configuration.
   * @return {Configuration} The configuration with the given name or null.
   */
  export let get = function(name: string): Configuration {
    return maps.get(name);
  };

  /**
   * @return {string[]} All configurations in the handler.
   */
  export let keys = function(): IterableIterator<string> {
    return maps.keys();
  };

}


/**
 * Parser configuration combines the configurations of the currently selected
 * packages.
 * @constructor
 */
export class ParserConfiguration {

  /**
   * Priority list of init methods.
   * @type {FunctionList}
   */
  protected initMethod: FunctionList = new FunctionList();

  /**
   * Priority list of init methods to call once jax is ready.
   * @type {FunctionList}
   */
  protected configMethod: FunctionList = new FunctionList();

  /**
   * An ordered list of cofigurations.
   * @type {PrioritizedList<Configuration>}
   */
  protected configurations: PrioritizedList<Configuration> = new PrioritizedList();

  /**
   * The list of parsers this configuration targets
   */
  protected parsers: string[] = [];

  /**
   * The subhandlers for this configuration.
   * @type {SubHandlers}
   */
  public handlers: SubHandlers = new SubHandlers();

  /**
   * The collated stack items.
   * @type {StackItemConfig}
   */
  public items: StackItemConfig = {};

  /**
   * The collated tag configurations.
   * @type {TagsConfig}
   */
  public tags: TagsConfig = {};

  /**
   * The collated options.
   * @type {OptionList}
   */
  public options: OptionList = {};

  /**
   * The collated node creators.
   * @type {{[key: string]: any}}
   */
  public nodes: {[key: string]: any}  = {};

  /**
   * @constructor
   * @param {(string|[string,number])[]} packages A list of packages with
   *     optional priorities.
   * @parm {string[]} parsers   The names of the parsers this package targets
   */
  constructor(packages: (string | [string, number])[], parsers: string[] = ['tex']) {
    this.parsers = parsers;
    for (const pkg of packages.slice().reverse()) {
      this.addPackage(pkg);
    }
    for (let {item: config, priority: priority} of this.configurations) {
      this.append(config, priority);
    }
  }

  /**
   * Init method for the configuration;
   */
  public init() {
    this.initMethod.execute(this);
  }

  /**
   * Init method for when the jax is ready
   * @param {TeX} jax The TeX jax for this configuration
   */
  public config(jax: TeX<any, any, any>) {
    this.configMethod.execute(this, jax);
    for (const config of this.configurations) {
      this.addFilters(jax, config.item);
    }
  }

  /**
   * Retrieves and adds configuration for a package with priority.
   * @param {(string | [string, number]} pkg Package with priority.
   */
  public addPackage(pkg: (string | [string, number])) {
    const name = typeof pkg === 'string' ? pkg : pkg[0];
    const conf = this.getPackage(name);
    conf && this.configurations.add(conf, typeof pkg === 'string' ? conf.priority : pkg[1]);
  }

  /**
   * Adds a configuration after the input jax is created.  (Used by \require.)
   * Sets items, nodes and runs configuration method explicitly.
   *
   * @param {string} name            The name of the package to add
   * @param {TeX} jax                The TeX jax where it is being registered
   * @param {OptionList=} options    The options for the configuration.
   */
  public add(name: string, jax: TeX<any, any, any>, options: OptionList = {}) {
    const config = this.getPackage(name);
    this.append(config);
    this.configurations.add(config, config.priority);
    this.init();
    const parser = jax.parseOptions;
    parser.nodeFactory.setCreators(config.nodes);
    for (const kind of Object.keys(config.items)) {
      parser.itemFactory.setNodeClass(kind, config.items[kind]);
    }
    TagsFactory.addTags(config.tags);
    defaultOptions(parser.options, config.options);
    userOptions(parser.options, options);
    this.addFilters(jax, config);
    if (config.config) {
      config.config(this, jax);
    }
  }

 /**
  * Find a package and check that it is for the targeted parser
  *
  * @param {string} name       The name of the package to check
  * @return {Configuration}    The configuration for the package
  */
  protected getPackage(name: string): Configuration {
    const config = ConfigurationHandler.get(name);
    if (config && this.parsers.indexOf(config.parser) < 0) {
      throw Error(`Package ${name} doesn't target the proper parser`);
    }
    return config;
  }

  /**
   * Appends a configuration to the overall configuration object.
   * @param {Configuration} config A configuration.
   * @param {number} priority The configurations optional priority.
   */
  public append(config: Configuration, priority?: number) {
    priority = priority || config.priority;
    if (config.initMethod) {
      this.initMethod.add(config.initMethod[0], config.initMethod[1]);
    }
    if (config.configMethod) {
        this.configMethod.add(config.configMethod[0], config.configMethod[1]);
      }
    this.handlers.add(config.handler, config.fallback, priority);
    Object.assign(this.items, config.items);
    Object.assign(this.tags, config.tags);
    defaultOptions(this.options, config.options);
    Object.assign(this.nodes, config.nodes);
  }

  /**
   * Adds pre- and postprocessor as filters to the jax.
   * @param {TeX<any} jax The TeX Jax.
   * @param {Configuration} config The configuration whose processors are added.
   */
  private addFilters(jax: TeX<any, any, any>, config: Configuration) {
    for (const [pre, priority] of config.preprocessors) {
      jax.preFilters.add(pre, priority);
    }
    for (const [post, priority] of config.postprocessors) {
      jax.postFilters.add(post, priority);
    }
  }

}
