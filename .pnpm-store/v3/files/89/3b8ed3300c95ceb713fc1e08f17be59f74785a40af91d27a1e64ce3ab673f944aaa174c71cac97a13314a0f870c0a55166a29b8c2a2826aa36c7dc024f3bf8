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
 * @fileoverview Factory generating maps to keep options for the TeX parser.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import StackItemFactory from './StackItemFactory.js';
import {Tags} from './Tags.js';
import {SubHandlers} from './MapHandler.js';
import {NodeFactory} from './NodeFactory.js';
import NodeUtil from './NodeUtil.js';
import {MmlNode} from '../../core/MmlTree/MmlNode.js';
import TexParser from './TexParser.js';
import {defaultOptions, OptionList} from '../../util/Options.js';
import {ParserConfiguration} from './Configuration.js';


/**
 * @class
 */
export default class ParseOptions {

  /**
   * A set of sub handlers
   * @type {SubHandlers}
   */
  public handlers: SubHandlers;

  /**
   * A set of options, mapping names to string or boolean values.
   * @type {OptionList}
   */
  public options: OptionList = {};

  /**
   * The current item factory.
   * @type {StackItemFactory}
   */
  public itemFactory: StackItemFactory;

  /**
   * The current node factory.
   * @type {NodeFactory}
   */
  public nodeFactory: NodeFactory;

  /**
   * The current tagging object.
   * @type {Tags}
   */
  public tags: Tags;

  /**
   * Storage area for parser-specific package data (indexed by package name)
   * @type {Map<string, any>}
   */
  public packageData: Map<string, any> = new Map();

  // Fields for ephemeral options, i.e., options that will be cleared for each
  // run of the parser.
  /**
   * Stack of previous tex parsers. This is used to keep track of parser
   * settings when expressions are recursively parsed.
   * @type {TexParser[]}
   */
  public parsers: TexParser[] = [];


  /**
   * The current root node.
   * @type {MmlNode}
   */
  public root: MmlNode = null;

  /**
   * List of node lists saved with respect to some property or their kind.
   * @type {{[key: string]: MmlNode[]}}
   */
  public nodeLists: {[key: string]: MmlNode[]} = {};

  /**
   * Error state of the parser.
   * @type {boolean}
   */
  public error: boolean = false;



  /**
   * @constructor
   * @param {Configuration} configuration Configuration object of the current
   *     TeX parser.
   * @param {OptionList[]} options   [TeX options, Tag options, {packages}]
   */
  public constructor(configuration: ParserConfiguration, options: OptionList[] = []) {
    this.handlers = configuration.handlers;
    // Add node factory methods from packages.
    this.nodeFactory = new NodeFactory();
    this.nodeFactory.configuration = this;
    this.nodeFactory.setCreators(configuration.nodes);
    // Add stackitems from packages.
    this.itemFactory = new StackItemFactory(configuration.items);
    this.itemFactory.configuration = this;
    // Set default options for parser from packages and for tags.
    defaultOptions(this.options, ...options);
    defaultOptions(this.options, configuration.options);
  }


  // Methods for dealing with ephemeral fields.
  /**
   * Pushes a new tex parser onto the stack.
   * @param {TexParser} parser The new parser.
   */
  public pushParser(parser: TexParser) {
    this.parsers.unshift(parser);
  }


  /**
   * Pops a parser of the tex parser stack.
   */
  public popParser() {
    this.parsers.shift();
  }


  /**
   * @return {TexParser} The currently active tex parser.
   */
  public get parser(): TexParser {
    return this.parsers[0];
  }

  /**
   * Clears all the ephemeral options.
   */
  public clear() {
    this.parsers = [];
    this.root = null;
    this.nodeLists = {};
    this.error = false;
    this.tags.resetTag();
  }


  /**
   * Saves a tree node to a list of nodes for post processing.
   * @param {string} property The property name that will be used for
   *     postprocessing.
   * @param {MmlNode} node The node to save.
   */
  public addNode(property: string, node: MmlNode) {
    let list = this.nodeLists[property];
    if (!list) {
      list = this.nodeLists[property] = [];
    }
    list.push(node);
    if (node.kind !== property) {
      //
      // If the list is not just for its kind, record that it is in this list
      //   so that if it is copied, the copy can also be added to the list.
      //
      const inlists = (NodeUtil.getProperty(node, 'in-lists') as string || '');
      const lists = (inlists ? inlists.split(/,/) : []).concat(property).join(',');
      NodeUtil.setProperty(node, 'in-lists', lists);
    }
  }


  /**
   * Gets a saved node list with respect to a given property. It first ensures
   * that all the nodes are "live", i.e., actually live in the current
   * tree. Sometimes nodes are created, saved in the node list but discarded
   * later in the parsing. These will be filtered out here.
   *
   * NB: Do not use this method before the root field of the options is
   * set. Otherwise, your node list will always be empty!
   * @param {string} property The property for which to retrieve the node list.
   */
  public getList(property: string) {
    let list = this.nodeLists[property] || [];
    let result = [];
    for (let node of list) {
      if (this.inTree(node)) {
        result.push(node);
      }
    }
    this.nodeLists[property] = result;
    return result;
  }


  /**
   * Remove a list of nodes from a saved list (e.g., when a filter removes the
   * node from the DOM, like for munderover => munder).
   *
   * @param {string} property The property from which to remove nodes.
   * @param {MmlNode[]} nodes The nodes to remove.
   */
  public removeFromList(property: string, nodes: MmlNode[]) {
    const list = this.nodeLists[property] || [];
    for (const node of nodes) {
      const i = list.indexOf(node);
      if (i >= 0) {
        list.splice(i, 1);
      }
    }
  }


  /**
   * Tests if the node is in the tree spanned by the current root node.
   * @param {MmlNode} node The node to test.
   */
  private inTree(node: MmlNode) {
    while (node && node !== this.root) {
      node = node.parent;
    }
    return !!node;
  }

}
