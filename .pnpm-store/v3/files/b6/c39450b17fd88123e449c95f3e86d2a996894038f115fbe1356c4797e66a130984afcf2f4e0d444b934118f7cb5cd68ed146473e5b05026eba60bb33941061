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
 * @fileoverview  Implements the TeX InputJax object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AbstractInputJax} from '../core/InputJax.js';
import {userOptions, separateOptions, OptionList} from '../util/Options.js';
import {MathDocument} from '../core/MathDocument.js';
import {MathItem} from '../core/MathItem.js';
import {MmlNode} from '../core/MmlTree/MmlNode.js';
import {MmlFactory} from '../core/MmlTree/MmlFactory.js';

import {FindTeX} from './tex/FindTeX.js';

import FilterUtil from './tex/FilterUtil.js';
import NodeUtil from './tex/NodeUtil.js';
import TexParser from './tex/TexParser.js';
import TexError from './tex/TexError.js';
import ParseOptions from './tex/ParseOptions.js';
import {TagsFactory} from './tex/Tags.js';
import {ParserConfiguration} from './tex/Configuration.js';
// Import base as it is the default package loaded.
import './tex/base/BaseConfiguration.js';


/*****************************************************************/
/*
 *  Implements the TeX class (extends AbstractInputJax)
 */

/**
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class TeX<N, T, D> extends AbstractInputJax<N, T, D> {

  /**
   * Name of input jax.
   * @type {string}
   */
  public static NAME: string = 'TeX';

  /**
   * Default options for the jax.
   * @type {OptionList}
   */
  public static OPTIONS: OptionList = {
    ...AbstractInputJax.OPTIONS,
    FindTeX: null,
    packages: ['base'],
    // Digit pattern to match numbers.
    digits: /^(?:[0-9]+(?:\{,\}[0-9]{3})*(?:\.[0-9]*)?|\.[0-9]+)/,
    // Maximum size of TeX string to process.
    maxBuffer: 5 * 1024,
    formatError: (jax: TeX<any, any, any>, err: TexError) => jax.formatError(err)
  };

  /**
   * The FindTeX instance used for locating TeX in strings
   */
  protected findTeX: FindTeX<N, T, D>;

  /**
   * The configuration of the TeX jax.
   * @type {ParserConfiguration}
   */
  protected configuration: ParserConfiguration;

  /**
   * The LaTeX code that is parsed.
   * @type {string}
   */
  protected latex: string;

  /**
   * The Math node that results from parsing.
   * @type {MmlNode}
   */
  protected mathNode: MmlNode;

  private _parseOptions: ParseOptions;

  /**
   * Initialises the configurations.
   * @param {string[]} packages Names of packages.
   * @return {Configuration} The configuration object.
   */
  protected static configure(packages: (string | [string, number])[]): ParserConfiguration {
    let configuration = new ParserConfiguration(packages, ['tex']);
    configuration.init();
    return configuration;
  }


  /**
   * Initialises the Tags factory. Add tagging structures from packages and set
   * tagging to given default.
   * @param {ParseOptions} options The parse options.
   * @param {Configuration} configuration The configuration.
   */
  protected static tags(options: ParseOptions, configuration: ParserConfiguration) {
    TagsFactory.addTags(configuration.tags);
    TagsFactory.setDefault(options.options.tags);
    options.tags = TagsFactory.getDefault();
    options.tags.configuration = options;
  }


  /**
   * @override
   */
  constructor(options: OptionList = {}) {
    const [rest, tex, find] = separateOptions(options, TeX.OPTIONS, FindTeX.OPTIONS);
    super(tex);
    this.findTeX = this.options['FindTeX'] || new FindTeX(find);
    const packages = this.options.packages;
    const configuration = this.configuration = TeX.configure(packages);
    const parseOptions = this._parseOptions =
      new ParseOptions(configuration, [this.options, TagsFactory.OPTIONS]);
    userOptions(parseOptions.options, rest);
    configuration.config(this);
    TeX.tags(parseOptions, configuration);
    this.postFilters.add(FilterUtil.cleanSubSup, -6);
    this.postFilters.add(FilterUtil.setInherited, -5);
    this.postFilters.add(FilterUtil.moveLimits, -4);
    this.postFilters.add(FilterUtil.cleanStretchy, -3);
    this.postFilters.add(FilterUtil.cleanAttributes, -2);
    this.postFilters.add(FilterUtil.combineRelations, -1);
  }

  /**
   * @override
   */
  public setMmlFactory(mmlFactory: MmlFactory) {
    super.setMmlFactory(mmlFactory);
    this._parseOptions.nodeFactory.setMmlFactory(mmlFactory);
  }


  /**
   * @return {ParseOptions} The parse options that configure this JaX instance.
   */
  public get parseOptions(): ParseOptions {
    return this._parseOptions;
  }

  /**
   * @override
   */
  public reset(tag: number = 0) {
    this.parseOptions.tags.reset(tag);
  }


  /**
   * @override
   */
  public compile(math: MathItem<N, T, D>, document: MathDocument<N, T, D>): MmlNode {
    this.parseOptions.clear();
    this.executeFilters(this.preFilters, math, document, this.parseOptions);
    let display = math.display;
    this.latex = math.math;
    let node: MmlNode;
    this.parseOptions.tags.startEquation(math);
    let globalEnv;
    try {
      let parser = new TexParser(this.latex,
                                 {display: display, isInner: false},
                                 this.parseOptions);
      node = parser.mml();
      globalEnv = parser.stack.global;
    } catch (err) {
      if (!(err instanceof TexError)) {
        throw err;
      }
      this.parseOptions.error = true;
      node = this.options.formatError(this, err);
    }
    node = this.parseOptions.nodeFactory.create('node', 'math', [node]);
    if (globalEnv?.indentalign) {
      NodeUtil.setAttribute(node, 'indentalign', globalEnv.indentalign);
    }
    if (display) {
      NodeUtil.setAttribute(node, 'display', 'block');
    }
    this.parseOptions.tags.finishEquation(math);
    this.parseOptions.root = node;
    this.executeFilters(this.postFilters, math, document, this.parseOptions);
    this.mathNode = this.parseOptions.root;
    return this.mathNode;
  }


  /**
   * @override
   */
  public findMath(strings: string[]) {
    return this.findTeX.findMath(strings);
  }

  /**
   * Default formatter for error messages:
   *   wrap an error into a node for output.
   * @param {TeXError} err The TexError.
   * @return {Node} The merror node.
   */
  public formatError(err: TexError): MmlNode {
    let message = err.message.replace(/\n.*/, '');
    return this.parseOptions.nodeFactory.create(
      'error', message, err.id, this.latex);
  }

}
