/*************************************************************
 *
 *  Copyright (c) 2009-2022 The MathJax Consortium
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
 * @fileoverview Node factory for creating MmlNodes. This allows extension
 *     packages to add node constructors or overwrite existing ones.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {TextNode, MmlNode} from '../../core/MmlTree/MmlNode.js';
import {MmlFactory} from '../../core/MmlTree/MmlFactory.js';
import ParseOptions from './ParseOptions.js';
import NodeUtil from './NodeUtil.js';


export type NodeFactoryMethod = (factory: NodeFactory, kind: string, ...rest: any[]) => MmlNode;

export class NodeFactory {

  /**
   * Parser configuration that can be used to pass information between node methods.
   * @type {ParseOption}
   */
  public configuration: ParseOptions;


  /**
   * The external node factory.
   * @type {MmlFactory}
   */
  protected mmlFactory: MmlFactory = null;


  /**
   * The factory table populated with some default methods.
   */
  private factory: {[kind: string]: NodeFactoryMethod} =
    {'node': NodeFactory.createNode,
     'token': NodeFactory.createToken,
     'text': NodeFactory.createText,
     'error': NodeFactory.createError
    };

  /**
   * Default node generation function.
   * @param {NodeFactory} factory The current node factory.
   * @param {string} kind The type of node to create.
   * @param {MmlNode[]} children Its children.
   * @param {any=} def Its properties.
   * @param {TextNode=} text An optional text node if this is a token.
   * @return {MmlNode} The newly created Mml node.
   */
  public static createNode(factory: NodeFactory, kind: string,
                           children: MmlNode[] = [], def: any = {},
                           text?: TextNode): MmlNode {
    const node = factory.mmlFactory.create(kind);
    node.setChildren(children);
    if (text) {
      node.appendChild(text);
    }
    NodeUtil.setProperties(node, def);
    return node;
  }


  /**
   * Default token generation function.
   * @param {NodeFactory} factory The current node factory.
   * @param {string} kind The type of node to create.
   * @param {any} def Its properties.
   * @param {string} text Text of the token.
   * @return {MmlNode} The newly created token node.
   */
  public static createToken(factory: NodeFactory, kind: string,
                            def: any = {}, text: string = ''): MmlNode  {
    const textNode = factory.create('text', text);
    return factory.create('node', kind, [], def, textNode);
  }


  /**
   * Default text node generation function.
   * @param {NodeFactory} factory The current node factory.
   * @param {string} text The text for the new node.
   * @return {TextNode} The newly created text node.
   */
  public static createText(factory: NodeFactory, text: string): TextNode  {
    if (text == null) {
      return null;
    }
    return (factory.mmlFactory.create('text') as TextNode).setText(text);
  }


  /**
   * Default error node generation function.
   * @param {NodeFactory} factory The current node factory.
   * @param {string} message The error message.
   * @return {MmlNode} The newly created error node.
   */
  public static createError(factory: NodeFactory, message: string): MmlNode  {
    let text = factory.create('text', message);
    let mtext = factory.create('node', 'mtext', [], {}, text);
    let error = factory.create('node', 'merror', [mtext], {'data-mjx-error': message});
    return error;
  }


  /**
   * @param {MmlFactory} mmlFactory   The MmlFactory for the TeX jax to use
   */
  public setMmlFactory(mmlFactory: MmlFactory) {
    this.mmlFactory = mmlFactory;
  }

  /**
   * Adds a method to the factory.
   * @param {string} kind The type of node the method creates.
   * @param {NodeFactoryMethod} func The node creator.
   */
  public set(kind: string, func: NodeFactoryMethod) {
    this.factory[kind] = func;
  }


  /**
   * Adds a set of node creators to the factory.
   * @param {Object.<NodeFactoryMethod>} maps The set of functions.
   */
  public setCreators(maps: {[kind: string]: NodeFactoryMethod}) {
    for (let kind in maps) {
      this.set(kind, maps[kind]);
    }
  }


  /**
   * Creates a node for the internal data structure from the factory.
   * @param {string} kind The type of node to be created.
   * @param {any[]} ...rest The arguments for the node.
   * @return {MmlNode} The created node.
   */
  public create(kind: string, ...rest: any[]): MmlNode {
    const func = this.factory[kind] || this.factory['node'];
    const node = func(this, rest[0], ...rest.slice(1));
    if (kind === 'node') {
      this.configuration.addNode(rest[0], node);
    }
    return node;
  }


  /**
   * @param {string} kind The method for generating a node of given kind.
   */
  public get(kind: string) {
    return this.factory[kind];
  }

}
